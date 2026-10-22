import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-6">
      <header className="flex items-center justify-between">
        <span className="font-display text-xl font-extrabold">vitrine</span>
        <nav className="flex gap-2">
          <Link to="/entrar" className="btn-ghost">Entrar</Link>
          <Link to="/criar-loja" className="btn">Criar minha loja</Link>
        </nav>
      </header>

      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">Chega de anotar pedido no caderno.</h1>
          <p className="mt-5 max-w-md text-lg">
            Monte o catálogo da sua loja, ponha o link na bio do Instagram e receba cada pedido pronto no seu WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/criar-loja" className="btn">Criar loja grátis</Link>
            <span className="text-sm">Até 10 produtos grátis, sem cartão.</span>
          </div>
        </div>

        {/* O pedido que chega no WhatsApp é o produto */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium">Chegou no seu WhatsApp:</p>
          <div className="rounded-xl rounded-tl-sm bg-[#d9fdd3] p-4 text-sm leading-relaxed whitespace-pre-line">
{`*Novo pedido — Doce Dani*

2x Brigadeiro gourmet — R$ 12,00
1x Caixa de brownie — R$ 38,00

*Total: R$ 50,00*
Cliente: Marina`}
          </div>
        </div>
      </section>
    </main>
  );
}
