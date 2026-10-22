import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireAuth, signToken, type AuthRequest } from "./auth.js";

const prisma = new PrismaClient();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL ?? "*" }));
app.use(express.json());

const FREE_LIMIT = 10;
const slugRe = /^[a-z0-9-]{3,30}$/;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  storeName: z.string().min(2),
  slug: z.string().regex(slugRe, "Use 3 a 30 letras minúsculas, números ou hífen."),
  whatsapp: z.string().regex(/^\d{12,13}$/, "WhatsApp com DDI e DDD, só números. Ex: 5577999999999"),
});
const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  priceCents: z.number().int().min(0),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  active: z.boolean().optional(),
});

// Wrapper: devolve erros de validação como JSON legível
const h =
  (fn: (req: AuthRequest, res: express.Response) => Promise<unknown>) =>
  (req: AuthRequest, res: express.Response) =>
    fn(req, res).catch((e) => {
      if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues[0].message });
      console.error(e);
      res.status(500).json({ error: "Algo deu errado. Tente de novo." });
    });

app.get("/health", (_req, res) => res.json({ ok: true }));

// ---------- Auth ----------
app.post("/auth/register", h(async (req, res) => {
  const d = registerSchema.parse(req.body);
  if (await prisma.user.findUnique({ where: { email: d.email } }))
    return res.status(409).json({ error: "Esse e-mail já tem conta." });
  if (await prisma.store.findUnique({ where: { slug: d.slug } }))
    return res.status(409).json({ error: "Esse endereço de loja já está em uso." });
  const user = await prisma.user.create({
    data: {
      email: d.email,
      password: await bcrypt.hash(d.password, 10),
      store: { create: { name: d.storeName, slug: d.slug, whatsapp: d.whatsapp } },
    },
  });
  res.status(201).json({ token: signToken(user.id) });
}));

app.post("/auth/login", h(async (req, res) => {
  const { email, password } = z.object({ email: z.string(), password: z.string() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: "E-mail ou senha incorretos." });
  res.json({ token: signToken(user.id) });
}));

// ---------- Painel (autenticado) ----------
app.get("/me", requireAuth, h(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { store: { include: { products: { orderBy: { createdAt: "desc" } } } } },
  });
  if (!user) return res.status(404).json({ error: "Conta não encontrada." });
  const { password: _p, ...safe } = user;
  res.json({ ...safe, freeLimit: FREE_LIMIT });
}));

app.put("/me/store", requireAuth, h(async (req, res) => {
  const d = z.object({ name: z.string().min(2), whatsapp: registerSchema.shape.whatsapp }).parse(req.body);
  res.json(await prisma.store.update({ where: { userId: req.userId }, data: d }));
}));

async function myStore(userId: string) {
  return prisma.store.findUniqueOrThrow({ where: { userId } });
}

app.post("/products", requireAuth, h(async (req, res) => {
  const store = await myStore(req.userId!);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.userId } });
  const count = await prisma.product.count({ where: { storeId: store.id } });
  if (user.plan === "free" && count >= FREE_LIMIT)
    return res.status(402).json({ error: `O plano grátis permite ${FREE_LIMIT} produtos. Assine o Pro para cadastrar mais.` });
  const d = productSchema.parse(req.body);
  res.status(201).json(await prisma.product.create({ data: { ...d, imageUrl: d.imageUrl || null, storeId: store.id } }));
}));

app.put("/products/:id", requireAuth, h(async (req, res) => {
  const store = await myStore(req.userId!);
  const d = productSchema.partial().parse(req.body);
  const r = await prisma.product.updateMany({ where: { id: req.params.id, storeId: store.id }, data: { ...d, imageUrl: d.imageUrl || null } });
  if (!r.count) return res.status(404).json({ error: "Produto não encontrado." });
  res.json({ ok: true });
}));

app.delete("/products/:id", requireAuth, h(async (req, res) => {
  const store = await myStore(req.userId!);
  await prisma.product.deleteMany({ where: { id: req.params.id, storeId: store.id } });
  res.status(204).end();
}));

// ---------- Vitrine pública ----------
app.get("/public/:slug", h(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { slug: req.params.slug },
    include: { products: { where: { active: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!store) return res.status(404).json({ error: "Loja não encontrada." });
  const { userId: _u, ...pub } = store;
  res.json(pub);
}));

const port = Number(process.env.PORT ?? 3333);
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
