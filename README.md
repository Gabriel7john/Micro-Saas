<div align="center">

# 🛍️ Vitrine

**Catálogo digital para pequenos negócios. O cliente monta o carrinho e o pedido chega pronto no seu WhatsApp.**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

</div>

---

## 💡 O problema

Quem vende pelo Instagram (confeiteiras, lojas de roupa, hamburguerias, brechós) recebe pedido por direct, manda foto e preço na mão e anota tudo no caderno. É lento, dá erro e perde venda.

## ✅ A solução

O lojista cria a loja em minutos, coloca **um link na bio** e o cliente faz o pedido sozinho. O pedido chega **formatado no WhatsApp** do dono, com itens, quantidades e total.

```
*Novo pedido — Doce Dani*

2x Brigadeiro gourmet — R$ 12,00
1x Caixa de brownie — R$ 38,00

*Total: R$ 50,00*
Cliente: Marina
```

## ✨ Funcionalidades

- 🔐 Cadastro e login com JWT (a conta já nasce com a loja)
- 🏪 Link próprio por loja: `seusite.com/nome-da-loja`
- 📦 Painel do lojista: cadastrar, ocultar e excluir produtos
- 🛒 Vitrine pública com carrinho e botão **Enviar pedido** direto pro WhatsApp
- 💳 Modelo freemium: plano grátis com até 10 produtos, pronto para o plano Pro
- 📱 Interface responsiva, pensada para abrir pelo celular

## 🧱 Stack

| Camada | Tecnologias |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4, React Router |
| Backend | Node.js, Express, TypeScript, Zod |
| Banco | PostgreSQL + Prisma ORM |
| Auth | JWT + bcrypt |
| Infra local | Docker Compose |

## 📁 Estrutura

```
.
├── backend/
│   ├── prisma/schema.prisma   # User, Store, Product
│   └── src/
│       ├── index.ts           # rotas da API
│       └── auth.ts            # JWT e middleware
├── frontend/
│   └── src/
│       ├── api.ts             # cliente HTTP e helpers de preço
│       └── pages/             # Landing, Auth, Dashboard, StorePage
├── docker-compose.yml         # PostgreSQL local
└── README.md
```

## 🚀 Como rodar

**Pré-requisitos:** Node.js 20+ e Docker (ou uma URL de banco no [Neon](https://neon.tech)).

```bash
# 1. Clone o projeto
git clone https://github.com/Gabriel7john/Micro-Saas.git
cd Micro-Saas

# 2. Suba o banco
docker compose up -d

# 3. Backend
cd backend
cp .env.example .env
npm install
npm run db:push
npm run dev            # http://localhost:3333

# 4. Frontend (em outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

Depois é só abrir `http://localhost:5173`, clicar em **Criar minha loja** e cadastrar o primeiro produto.

### Variáveis de ambiente

**`backend/.env`**

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `JWT_SECRET` | Segredo para assinar os tokens (use um valor longo e aleatório) |
| `PORT` | Porta da API (padrão `3333`) |
| `FRONTEND_URL` | Origem permitida no CORS |

**`frontend/.env`**

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API |

## 🔌 API

| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| `POST` | `/auth/register` | ❌ | Cria conta e loja |
| `POST` | `/auth/login` | ❌ | Retorna o token JWT |
| `GET` | `/me` | ✅ | Conta, loja e produtos |
| `PUT` | `/me/store` | ✅ | Edita nome e WhatsApp da loja |
| `POST` | `/products` | ✅ | Cria produto (limite de 10 no plano grátis) |
| `PUT` | `/products/:id` | ✅ | Edita ou oculta produto |
| `DELETE` | `/products/:id` | ✅ | Exclui produto |
| `GET` | `/public/:slug` | ❌ | Vitrine pública da loja |

Preços são guardados em **centavos** (`priceCents`) para evitar erro de arredondamento.

## 🗺️ Roadmap

- [x] Cadastro, login e painel do lojista
- [x] Vitrine pública com carrinho e pedido via WhatsApp
- [x] Limite do plano grátis
- [ ] Upload de foto do produto (Cloudinary ou S3)
- [ ] Plano Pro com cobrança recorrente (Mercado Pago ou Stripe)
- [ ] Categorias de produtos
- [ ] Cupom de desconto e taxa de entrega
- [ ] Painel de pedidos e relatório dos mais vendidos
- [ ] Domínio próprio por loja
- [ ] Deploy (frontend na Vercel, API no Railway ou Render, banco no Neon)

## 🖼️ Screenshots

<!-- Troque pelos seus prints: coloque as imagens em /docs e ajuste os caminhos -->

| Landing | Painel | Vitrine |
|---|---|---|
| ![Landing](docs/landing.png) | ![Painel](docs/painel.png) | ![Vitrine](docs/vitrine.png) |

## 🤝 Contribuindo

Sugestões e issues são bem-vindas. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça o commit: `git commit -m "feat: minha feature"`
4. Envie: `git push origin feature/minha-feature`
5. Abra um Pull Request

## 👨‍💻 Autor

Feito por **Gabriel Santana**, desenvolvedor full stack.

[![GitHub](https://img.shields.io/badge/GitHub-Gabriel7john-181717?style=flat&logo=github)](https://github.com/Gabriel7john)
