import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, brl, getToken, setToken, toCents, type Me } from "../api";

const empty = { name: "", description: "", price: "", imageUrl: "" };

export default function Dashboard() {
  const nav = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const load = () => api<Me>("/me").then(setMe).catch(() => { setToken(null); nav("/entrar"); });
  useEffect(() => { if (!getToken()) nav("/entrar"); else load(); }, []);

  async function add(e: FormEvent) {
    e.preventDefault(); setError("");
    try {
      await api("/products", { method: "POST", body: { name: form.name, description: form.description || null, priceCents: toCents(form.price), imageUrl: form.imageUrl } });
      setForm(empty); load();
    } catch (err) { setError((err as Error).message); }
  }
  const toggle = (id: string, active: boolean) => api(`/products/${id}`, { method: "PUT", body: { active: !active } }).then(load);
  const remove = (id: string) => confirm("Excluir este produto?") && api(`/products/${id}`, { method: "DELETE" }).then(load);

  if (!me) return <p className="p-8">Carregando...</p>;
  const link = `${location.origin}/${me.store.slug}`;

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">{me.store.name}</h1>
        <button className="btn-ghost" onClick={() => { setToken(null); nav("/"); }}>Sair</button>
      </header>

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4">
        <span className="break-all font-medium">{link}</span>
        <button className="btn-ghost" onClick={() => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copiado!" : "Copiar link"}</button>
        <a className="btn-ghost" href={link} target="_blank" rel="noreferrer">Ver loja</a>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-extrabold">Novo produto</h2>
        <form onSubmit={add} className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><label className="label">Nome</label><input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Preço (R$)</label><input className="field" required inputMode="decimal" placeholder="12,50" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Descrição</label><input className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Link da foto</label><input className="field" type="url" placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">{error}</p>}
          <button className="btn sm:col-span-2">Adicionar produto</button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-extrabold">Produtos ({me.store.products.length}{me.plan === "free" ? `/${me.freeLimit}` : ""})</h2>
        {me.store.products.length === 0 && <p className="mt-3">Nenhum produto ainda. Cadastre o primeiro acima.</p>}
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white">
          {me.store.products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3">
              {p.imageUrl ? <img src={p.imageUrl} alt="" className="size-14 rounded-lg object-cover" /> : <div className="size-14 rounded-lg bg-line" />}
              <div className="flex-1"><p className="font-bold">{p.name}</p><p className="text-sm">{brl(p.priceCents)}{!p.active && " · oculto"}</p></div>
              <button className="btn-ghost" onClick={() => toggle(p.id, p.active)}>{p.active ? "Ocultar" : "Mostrar"}</button>
              <button className="btn-ghost" onClick={() => remove(p.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
