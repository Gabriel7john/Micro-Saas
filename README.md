# Vitrine

Micro SaaS de catálogo digital: o lojista cria a loja, coloca o link na bio do Instagram e recebe cada pedido pronto no WhatsApp.

## Stack
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT
- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, React Router

## Como rodar

```bash
# 1. Banco (ou use uma URL do Neon no .env)
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run db:push
npm run dev          # http://localhost:3333

# 3. Frontend (outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev          # http://localhost:5173
```

## Rotas da API
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cria conta + loja |
| POST | `/auth/login` | Login (retorna JWT) |
| GET | `/me` | Conta, loja e produtos |
| PUT | `/me/store` | Edita nome/WhatsApp |
| POST/PUT/DELETE | `/products` | CRUD de produtos (grátis: até 10) |
| GET | `/public/:slug` | Vitrine pública |

## Roadmap
- [ ] Upload de foto (Cloudinary/S3)
- [ ] Plano Pro com cobrança recorrente (Mercado Pago ou Stripe)
- [ ] Categorias, cupom e taxa de entrega
- [ ] Painel de pedidos e relatório de mais vendidos
- [ ] Domínio próprio por loja
