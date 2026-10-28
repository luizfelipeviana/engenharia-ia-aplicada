# Demo: Login com GitHub (Better Auth + Next.js + SQLite)

Demo mínima em Next.js (App Router) com login via GitHub usando [Better Auth](https://www.better-auth.com), persistindo usuários/sessões em SQLite local.

## Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- npm
- Um OAuth App no GitHub (veja abaixo)

## 1) Criar o OAuth App no GitHub

1. Acesse [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**.
2. Preencha:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copie o **Client ID** e gere um **Client Secret**.

## 2) Configurar variáveis de ambiente

Edite o arquivo `.env.local` (já criado) e preencha:

```bash
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<gerado automaticamente>
GITHUB_CLIENT_ID=<seu client id>
GITHUB_CLIENT_SECRET=<seu client secret>
```

## 3) Instalar dependências

```bash
npm install
```

## 4) Rodar as migrações do banco (SQLite)

Cria o arquivo `better-auth.sqlite` com as tabelas `user`, `session`, `account` e `verification`:

```bash
npx @better-auth/cli migrate
```

## 5) Rodar o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Como funciona

- Clique em **"Entrar com GitHub"** → inicia o OAuth e redireciona para o GitHub.
- Após autorizar, você volta para a Home, que mostra **"Logado como \<nome/email\>"**.
- Clique em **"Sair"** para encerrar a sessão.

## Estrutura

```
lib/auth.ts                        # instância do Better Auth (servidor: GitHub + SQLite)
lib/auth-client.ts                 # cliente do Better Auth (React: signIn/signOut/useSession)
app/api/auth/[...all]/route.ts     # route handler que expõe a API do Better Auth
app/page.tsx                       # Home: botão de login/logout e estado da sessão
better-auth.sqlite                 # banco SQLite local (gerado pela migração)
```
