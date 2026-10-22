import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api, brl, type Store } from "../api";

export default function StorePage() {
  const { slug } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [name, setName] = useState("");

  useEffect(() => { api<Store>(`/public/${slug}`).then(setStore).catch((e) => setError(e.message)); }, [slug]);

  const items = useMemo(() => store?.products.filter((p) => cart[p.id]) ?? [], [store, cart]);
  const total = items.reduce((s, p) => s + p.priceCents * cart[p.id], 0);
  const change = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  function order() {
    const lines = items.map((p) => `${cart[p.id]}x ${p.name} — ${brl(p.priceCents * cart[p.id])}`).join("\n");
    const msg = `*Novo pedido — ${store!.name}*\n\n${lines}\n\n*Total: ${brl(total)}*${name ? `\nCliente: ${name}` : ""}`;
    window.open(`https://wa.me/${store!.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  if (error) return <p className="p-8 text-center">{error}</p>;
  if (!store) return <p className="p-8 text-center">Carregando...</p>;

  return (
    <main className="mx-auto max-w-2xl px-5 pb-40 pt-8">
      <h1 className="text-3xl font-extrabold">{store.name}</h1>
      {store.products.length === 0 && <p className="mt-6">Esta loja ainda não tem produtos.</p>}
      <ul className="mt-6 space-y-3">
        {store.products.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="size-20 rounded-lg object-cover" />}
            <div className="flex-1">
              <p className="font-bold">{p.name}</p>
              {p.description && <p className="text-sm">{p.description}</p>}
              <p className="mt-1 font-bold text-leaf">{brl(p.priceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              {cart[p.id] > 0 && <><button aria-label="Tirar um" className="btn-ghost !px-3" onClick={() => change(p.id, -1)}>−</button><span className="w-5 text-center font-bold">{cart[p.id]}</span></>}
              <button aria-label={`Adicionar ${p.name}`} className="btn !px-3" onClick={() => change(p.id, 1)}>+</button>
            </div>
          </li>
        ))}
      </ul>

      {total > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-line bg-paper p-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
            <input className="field flex-1" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn" onClick={order}>Enviar pedido · {brl(total)}</button>
          </div>
        </div>
      )}
    </main>
  );
}
