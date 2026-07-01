# Pousada Guimaraes

Sistema completo de reservas, autenticação e painel administrativo para a Pousada Guimaraes.

## Pre-requisitos

- Node.js 22+ (LTS)
- PostgreSQL 15+
- npm
- Docker e Docker Compose (para execução via container)

## Instalacao Local

### 1. Clonar o repositorio

```bash
git clone https://github.com/lkznx7/PousadaGuimaraes.git
cd PousadaGuimaraes
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edite o .env com suas credenciais do banco
npm install
```

Criar o banco de dados PostgreSQL:

```sql
CREATE DATABASE nestdb;
```

Iniciar o backend:

```bash
npm run start:dev
```

O backend estara disponivel em `http://localhost:3001`.

### 3. Seed (Dados Iniciais)

Para criar o usuario admin e dados de teste:

```bash
cd backend
npx ts-node src/config/seed.ts
```

**Usuarios criados:**
- Admin: `admin@pousada.com` / `admin123`
- Cliente: `cliente@email.com` / `cliente123`

### 4. Frontend

```bash
# Na raiz do projeto
npm install
npm run dev
```

O frontend estara disponivel em `http://localhost:3000`.

## Execucao com Docker Compose

O Docker Compose sobe o backend + PostgreSQL automaticamente:

```bash
cd backend
docker compose up -d
```

Para verificar os logs:

```bash
docker compose logs -f backend
```

Para parar:

```bash
docker compose down
```

Para parar e limpar volumes:

```bash
docker compose down -v
```

Apos o primeiro `docker compose up`, rode o seed para popular dados iniciais:

```bash
docker compose exec backend npx ts-node src/config/seed.ts
```

## Estrutura do Projeto

```
PousadaGuimaraes/
├── src/                        # Frontend (Next.js 15 + React 19 + Tailwind CSS)
│   ├── app/
│   │   ├── (auth)/             # Paginas de login e cadastro
│   │   ├── (dashboard)/        # Area do cliente (perfil, reservas)
│   │   ├── admin/              # Painel administrativo
│   │   ├── apartamentos/       # Listagem e detalhes dos apartamentos
│   │   └── page.tsx            # Pagina inicial (landing page)
│   ├── components/             # Componentes React
│   ├── contexts/               # Context de autenticacao
│   ├── data/                   # Dados do site
│   ├── lib/                    # Servico de API
│   └── types/                  # Tipos TypeScript
├── backend/                    # Backend (NestJS + TypeORM + PostgreSQL)
│   ├── src/
│   │   ├── auth/               # Modulo de autenticacao (JWT)
│   │   ├── users/              # Modulo de usuarios
│   │   ├── apartments/         # Modulo de apartamentos
│   │   ├── reservations/       # Modulo de reservas
│   │   ├── uploads/            # Modulo de upload de imagens
│   │   ├── common/             # Enums, decorators, filters
│   │   └── config/             # Seed e configuracoes
│   ├── Dockerfile              # Multi-stage build para producao
│   ├── docker-compose.yml      # Backend + PostgreSQL
│   └── uploads/                # Diretorio de imagens enviadas
└── public/                     # Imagens e assets estaticos
```

## Tecnologias

### Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3

### Backend

- NestJS 10
- TypeORM
- PostgreSQL 15
- JWT (Passport)
- Bcrypt
- Class Validator / Class Transformer
- Swagger

## Configuracao

### Variaveis de Ambiente (Backend)

| Variavel | Padrao | Descricao |
|----------|--------|-----------|
| `POSTGRES_HOST` | `localhost` | Host do PostgreSQL |
| `POSTGRES_PORT` | `5432` | Porta do PostgreSQL |
| `POSTGRES_USER` | `nestuser` | Usuario do PostgreSQL |
| `POSTGRES_PASSWORD` | `nestpassword` | Senha do PostgreSQL |
| `POSTGRES_DB` | `nestdb` | Nome do banco |
| `JWT_SECRET` | `troque_por_uma_chave_forte` | Chave secreta JWT |
| `JWT_EXPIRES_IN` | `7d` | Expiracao do token |
| `NODE_ENV` | `development` | Ambiente (development/production) |
| `PORT` | `3001` | Porta do backend |
| `UPLOAD_DIR` | `./uploads` | Diretorio de uploads |
| `FRONTEND_URL` | `http://localhost:3000` | URL do frontend (CORS) |

### Variaveis de Ambiente (Frontend)

| Variavel | Padrao | Descricao |
|----------|--------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | URL da API backend |

## Rotas da API

Documentacao Swagger disponivel em `http://localhost:3001/api/docs`.

### Autenticacao

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/register` | Registrar novo usuario | Nao |
| POST | `/api/auth/login` | Login | Nao |

### Usuarios

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| GET | `/api/users` | Listar todos (Admin) | JWT + Admin |
| GET | `/api/users/me` | Perfil do logado | JWT |
| PUT | `/api/users/me` | Editar perfil | JWT |
| PUT | `/api/users/:id` | Editar usuario (Admin) | JWT + Admin |
| DELETE | `/api/users/:id` | Excluir usuario (Admin) | JWT + Admin |

### Apartamentos

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| GET | `/api/apartments` | Listar todos | Nao |
| GET | `/api/apartments/active` | Listar ativos | Nao |
| GET | `/api/apartments/available` | Disponiveis por data | Nao |
| GET | `/api/apartments/:id` | Detalhes | Nao |
| POST | `/api/apartments` | Criar (Admin) | JWT + Admin |
| PUT | `/api/apartments/:id` | Editar (Admin) | JWT + Admin |
| PUT | `/api/apartments/:id/toggle-active` | Ativar/Desativar | JWT + Admin |
| PUT | `/api/apartments/:id/photos` | Reordenar fotos (Admin) | JWT + Admin |
| DELETE | `/api/apartments/:id` | Excluir (Admin) | JWT + Admin |

### Reservas

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| POST | `/api/reservations` | Criar reserva | JWT |
| GET | `/api/reservations` | Listar todas (Admin) | JWT + Admin |
| GET | `/api/reservations/my` | Minhas reservas | JWT |
| GET | `/api/reservations/dashboard` | Dashboard (Admin) | JWT + Admin |
| GET | `/api/reservations/:id` | Detalhes | JWT |
| PUT | `/api/reservations/:id/cancel` | Cancelar | JWT |
| PUT | `/api/reservations/:id/status` | Atualizar status (Admin) | JWT + Admin |
| DELETE | `/api/reservations/:id` | Excluir (Admin) | JWT + Admin |

### Uploads

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| POST | `/api/uploads` | Upload de imagem | JWT + Admin |
| DELETE | `/api/uploads/:filename` | Remover imagem do disco | JWT + Admin |

## Funcionalidades

### Cliente
- Cadastro e login
- Editar perfil
- Visualizar reservas
- Cancelar reserva (antes do check-in)
- Criar nova reserva com verificacao de disponibilidade

### Administrador
- Dashboard com metricas
- CRUD de apartamentos (criar, editar, ativar/desativar, excluir)
- Gerenciar fotos dos apartamentos (upload, excluir, definir capa, reordenar)
- Gerenciar reservas (confirmar, cancelar, excluir, filtrar)
- Gerenciar usuarios (editar, excluir, promover a admin)

### Regras de Negocio
- Check-out deve ser posterior ao check-in
- Nao e possivel reservar no passado
- Reserva so pode ser cancelada antes do check-in
- Apartamento ocupado nao aparece como disponivel
- Capacidade do apartamento respeitada

## Producao

### Deploy com Docker

1. Subir os containers:
```bash
cd backend
docker compose up -d --build
```

2. Rodar o seed (primeira vez):
```bash
docker compose exec backend npx ts-node src/config/seed.ts
```

3. Verificar status:
```bash
docker compose ps
docker compose logs backend
```

### Deploy manual (VPS Linux)

1. Instalar Node.js 22 LTS e PostgreSQL 15
2. Clonar o repositorio
3. Configurar os `.env` (backend e frontend)
4. Build e iniciar o backend:
```bash
cd backend
npm ci --omit=dev
npm run build
npm run start:prod
```
5. Build e servir o frontend:
```bash
npm ci
npm run build
npm run start
```

Para manter os servicos rodando, use **PM2** ou **systemd**.

### Estrutura Docker

O `docker-compose.yml` define dois servicos:

- **postgres**: PostgreSQL 15 com volume persistente e healthcheck
- **backend**: NestJS com build multi-stage, conecta ao PostgreSQL via nome do servico

Os dados do banco sao persistidos no volume `pgdata`. As imagens enviadas sao persistidas no volume `uploads`.
