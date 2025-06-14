## Formerr

Formerr é uma **ferramenta moderna e _open source_** para **criação e compartilhamento de formulários personalizados**, gerar links públicos e **coletar respostas de forma simples, rápida e escalável**.

## Tecnologias utilizadas

- [Next.js](https://nextjs.org/) — Framework React para aplicações web
- [Postgres](https://www.postgresql.org/) —Banco de dados relacional
- [Drizzle ORM](https://orm.drizzle.dev/) — Uma ORM moderna e simples para TypeScript

## 🚀 Como usar o Formerr

Siga o passo a passo para instalar e rodar o **Formerr** no seu próprio ambiente.

### 1️⃣ Instale as dependências:

```bash
npm install
```

### 2️⃣ Prepare o `.env`:

Crie um arquivo `.env` na raiz do seu projeto e preencha as seguintes variáveis de ambiente:

```ini
PG_USER="your-database-user"
PG_PASSWORD="your-database-password"
PG_HOST="your-database-host"
PG_PORT="your-database-port"
PG_DATABASE="your-database-name"
PG_SSL="false"
```

### 3️⃣ Prepare o banco de dados:

Com o [Drizzle ORM](https://orm.drizzle.dev/) instalado, execute o comando para preparar suas tabelas automaticamente:

```bash
npx drizzle-kit push
```

### 4️⃣ Rodar o desenvolvimento:

Depois de tudo configurado, é só dar um:

```bash
npm run dev
```

Isso iniciará o **servidor de desenvolvimento** e você consegue acessar o Formerr pelo `http://localhost:3000`.