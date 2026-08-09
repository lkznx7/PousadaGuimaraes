# Pousada Guimaraes - Backend

API da Pousada Guimaraes: autenticação (JWT), apartamentos, reservas, usuários e upload de imagens.

## Pre-requisitos

- Node.js 22+ (LTS)
- PostgreSQL 15+
- npm
- Docker e Docker Compose (para execução via container)

## Instalacao Local

```bash
npm install
cp .env.example .env
# Edite o .env com suas credenciais do banco
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

## Seed (Dados Iniciais)

Para criar o usuario admin e dados de teste:

```bash
npx ts-node src/config/seed.ts
```

**Usuarios criados:**
- Admin: `admin@pousada.com` / `admin123`
- Cliente: `cliente@email.com` / `cliente123`

## Execucao com Docker Compose

O Docker Compose sobe o backend + PostgreSQL automaticamente:

```bash
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

## Build de Producao

```bash
npm ci --omit=dev
npm run build
npm run start:prod
```

## Variaveis de Ambiente

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

## Estrutura do Projeto

```
├── src/
│   ├── auth/               # Modulo de autenticacao (JWT)
│   ├── users/              # Modulo de usuarios
│   ├── apartments/         # Modulo de apartamentos
│   ├── reservations/       # Modulo de reservas
│   ├── uploads/            # Modulo de upload de imagens
│   ├── common/             # Enums, decorators, filters
│   └── config/             # Seed e configuracoes
├── Dockerfile              # Multi-stage build para producao
├── docker-compose.yml      # Backend + PostgreSQL
└── uploads/                # Diretorio de imagens enviadas
```

## Tecnologias

- NestJS 10
- TypeORM
- PostgreSQL 15
- JWT (Passport)
- Bcrypt
- Class Validator / Class Transformer
- Swagger
