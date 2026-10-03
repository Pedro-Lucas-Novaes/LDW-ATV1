# Task Tracker API --- LDW

API REST desenvolvida em **Node.js**, **Express**, **TypeScript**,
**Sequelize** e **PostgreSQL** para gerenciamento de usuários, projetos
e tarefas.

A aplicação possui autenticação com **JWT**, documentação interativa com
**Swagger**, migrations com **Sequelize CLI**, testes com **Vitest** e
suporte a execução do PostgreSQL/API com **Docker Compose**.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Sequelize
- Sequelize CLI
- JWT
- bcryptjs
- Swagger / OpenAPI 3
- Docker e Docker Compose
- Vitest
- ESLint
- Prettier
- pnpm

## Funcionalidades

A API permite:

- cadastrar, listar, consultar, atualizar e excluir usuários;
- autenticar usuários e gerar token JWT;
- cadastrar, listar, consultar, atualizar e excluir projetos;
- cadastrar, listar, consultar, atualizar e excluir tarefas;
- associar projetos ao usuário autenticado;
- associar tarefas aos projetos;
- controlar acesso às rotas protegidas utilizando JWT;
- documentar e testar os endpoints através do Swagger.

## Estrutura principal

```text
LDW-ATV1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middlewares/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── package.json
```

## Pré-requisitos

Para executar o projeto, tenha instalado:

- Node.js;
- pnpm;
- Docker Desktop / Docker Compose;
- Git.

O backend foi configurado para utilizar **pnpm 11.20.0 ou versão
compatível com `^11.20.0`**.

## Configuração das variáveis de ambiente

Entre na pasta `backend` e crie o arquivo `.env` com base no
`.env.example`.

No Windows CMD:

```bat
cd backend
copy .env.example .env
```

Exemplo de configuração para desenvolvimento local:

```env
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_DIALECT=postgres
DB_SSL=false

JWT_SECRET=troque_por_uma_chave_secreta
```

> O arquivo `.env` não deve ser versionado. O `.env.example` serve
> apenas como modelo de configuração.

## Instalação

Na raiz do projeto:

```bat
pnpm install
```

Depois instale as dependências do backend:

```bat
cd backend
pnpm install
```

## Banco de dados com Docker

Na raiz do projeto, inicie os serviços:

```bat
pnpm run compose:up
```

Para visualizar os logs:

```bat
pnpm run compose:logs
```

Para encerrar os containers:

```bat
pnpm run compose:down
```

O PostgreSQL local utiliza, por padrão:

```text
Host: 127.0.0.1
Porta: 5432
Banco: postgres
Usuário: postgres
Senha: postgres
```

## Migrations

Com o PostgreSQL em execução, entre na pasta `backend` e execute:

```bat
pnpm exec sequelize-cli db:migrate
```

As migrations criam as tabelas necessárias da aplicação, incluindo
usuários, projetos e tarefas.

## Executando o backend em desenvolvimento

Dentro de `backend`:

```bat
pnpm dev
```

A API ficará disponível em:

```text
http://localhost:3000/api
```

Health Check:

```text
http://localhost:3000/api/health
```

Documentação Swagger:

```text
http://localhost:3000/api/docs
```

## Autenticação

As rotas protegidas utilizam **Bearer Token JWT**.

Primeiro faça login em:

```text
POST /api/auth/login
```

Exemplo:

```json
{
  "email": "ana.silva@email.com",
  "password": "123456"
}
```

Após receber o token, no Swagger clique em **Authorize** e informe o
token. O Swagger adicionará o esquema Bearer à requisição.

## Principais endpoints

Método Endpoint Descrição

---

POST `/api/auth/login` Realiza login
GET `/api/users` Lista usuários
POST `/api/users` Cadastra usuário
GET `/api/users/{id}` Busca usuário
PUT `/api/users/{id}` Atualiza usuário
DELETE `/api/users/{id}` Exclui usuário
GET `/api/projects` Lista projetos do usuário autenticado
POST `/api/projects` Cria projeto
GET `/api/projects/{id}` Busca projeto
PUT `/api/projects/{id}` Atualiza projeto
DELETE `/api/projects/{id}` Exclui projeto
GET `/api/tasks` Lista tarefas
POST `/api/tasks` Cria tarefa
GET `/api/tasks/{id}` Busca tarefa
PUT `/api/tasks/{id}` Atualiza tarefa
DELETE `/api/tasks/{id}` Exclui tarefa

Para exemplos completos de Request Body, respostas e códigos HTTP,
utilize a documentação Swagger em `/api/docs`.

## Scripts do backend

Dentro da pasta `backend`:

```bat
pnpm dev
pnpm build
pnpm start
pnpm type-check
pnpm lint
pnpm lint:fix
pnpm format:check
pnpm format:fix
pnpm check-all
pnpm test
pnpm test:run
pnpm test:coverage
```

### Verificação do TypeScript

```bat
pnpm type-check
```

ou:

```bat
pnpm exec tsc --noEmit
```

### Testes

Executar os testes em modo interativo:

```bat
pnpm test
```

Executar uma única vez:

```bat
pnpm test:run
```

## Build e execução em produção

Dentro de `backend`:

```bat
pnpm build
pnpm start
```

O comando `build` compila o TypeScript para JavaScript e o comando
`start` executa `dist/server.js`.

## Docker

Na raiz do projeto também estão disponíveis os scripts:

```bat
pnpm run docker:build-api
pnpm run compose:up
pnpm run compose:down
pnpm run compose:logs
```

## Documentação da API

A documentação utiliza **OpenAPI 3.0** com Swagger UI e inclui:

- endpoints da aplicação;
- parâmetros;
- Request Bodies;
- autenticação JWT;
- códigos HTTP;
- exemplos de respostas JSON;
- schemas de usuários, projetos e tarefas;
- respostas de erro.

Acesse:

```text
http://localhost:3000/api/docs
```

## Códigos HTTP utilizados

A API utiliza, entre outros:

- `200 OK` --- operação realizada com sucesso;
- `201 Created` --- recurso criado;
- `204 No Content` --- recurso excluído;
- `400 Bad Request` --- dados inválidos;
- `401 Unauthorized` --- autenticação ausente ou inválida;
- `404 Not Found` --- recurso não encontrado;
- `409 Conflict` --- conflito, como e-mail já cadastrado;
- `500 Internal Server Error` --- erro interno inesperado.

## Segurança

- As senhas são armazenadas utilizando hash com `bcryptjs`.
- A autenticação utiliza JWT.
- Dados sensíveis são configurados por variáveis de ambiente.
- O arquivo `.env` não deve ser enviado ao repositório.
- Rotas de projetos e tarefas são protegidas por autenticação.

## Licença

Projeto acadêmico desenvolvido para a disciplina de **Laboratório de
Desenvolvimento Web (LDW)**.
