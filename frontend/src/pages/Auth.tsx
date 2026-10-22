import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "", storeName: "", slug: "", whatsapp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const body = mode === "login" ? { email: f.email, password: f.password } : { ...f, whatsapp: f.whatsapp.replace(/\D/g, "") };
      const { token } = await api<{ token: string }>(mode === "login" ? "/auth/login" : "/auth/register", { method: "POST", body });
      setToken(token);
      nav("/painel");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-12">
      <Link to="/" className="font-display text-xl font-extrabold">vitrine</Link>
      <h1 className="mt-8 text-3xl font-extrabold">{mode === "login" ? "Entrar na sua conta" : "Crie sua loja"}</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "register" && (
          <>
            <div><label className="label">Nome da loja</label><input className="field" required value={f.storeName} onChange={set("storeName")} /></div>
            <div>
              <label className="label">Endereço da loja</label>
              <input className="field" required placeholder="doce-dani" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value.toLowerCase() })} />
              <p className="mt-1 text-sm">Seu link: {location.host}/{f.slug || "doce-dani"}</p>
            </div>
            <div>
              <label className="label">WhatsApp que recebe os pedidos</label>
              <input className="field" required inputMode="numeric" placeholder="5577999999999" value={f.whatsapp} onChange={set("whatsapp")} />
              <p className="mt-1 text-sm">Com 55 e DDD, só números.</p>
            </div>
          </>
        )}
        <div><label className="label">E-mail</label><input className="field" type="email" required value={f.email} onChange={set("email")} /></div>
        <div><label className="label">Senha</label><input className="field" type="password" required minLength={6} value={f.password} onChange={set("password")} /></div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button className="btn w-full" disabled={loading}>{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar loja"}</button>
      </form>
      <p className="mt-5 text-sm">
        {mode === "login" ? <>Ainda não tem loja? <Link className="font-bold text-leaf" to="/criar-loja">Criar loja grátis</Link></> : <>Já tem conta? <Link className="font-bold text-leaf" to="/entrar">Entrar</Link></>}
      </p>
    </main>
  );
}
