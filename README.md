# Pousada Guimaraes - Frontend

Frontend da Pousada Guimaraes: site institucional, sistema de reservas, autenticação e painel administrativo.

## Pre-requisitos

- Node.js 22+ (LTS)
- npm

## Instalacao

```bash
npm install
```

## Execucao local

```bash
npm run dev
```

O frontend estara disponivel em `http://localhost:3000`.

## Build de producao

```bash
npm run build
npm run start
```

## Variaveis de Ambiente

| Variavel | Padrao | Descricao |
|----------|--------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | URL da API backend |

## Tecnologias

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3

## Estrutura

```
├── src/
│   ├── app/            # Paginas (landing, login, dashboard, admin)
│   ├── components/     # Componentes React
│   ├── contexts/       # Context de autenticacao
│   ├── data/           # Dados do site
│   ├── lib/            # Servico de API
│   └── types/          # Tipos TypeScript
├── public/             # Imagens e assets estaticos
└── assets/             # Imagens de apartamentos
```
