# Simple Task List API

A GraphQL API server using NodeJS, TypeScript, Yoga GQL, Prisma, and Pothos
GraphQL to manage a simple list of tasks

### Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Run database migrations

```bash
npm run db:migrate
```


### 4. Generate Prisma client and Pothos types

```bash
npm run db:generate
```

### 5. Start the development server

```bash
npm run dev
```

The GraphQL API will be at `http://localhost:4000/graphql`

---

## Project Structure

```
src/
├── types/
│   └── task.ts          # Task Pothos object type + DateTime scalar
├── schema/
│   ├── queries.ts        # tasks and task queries
│   └── mutations.ts      # addTask, toggleTask, deleteTask, updateTask, deleteCompletedTasks mutations
├── builder.ts            # Pothos SchemaBuilder (Prisma + Zod plugins)
├── db.ts                 # Prisma client
└── index.ts              # Server entry point

prisma/
├── migrations/           # Migration history
└── schema.prisma         # Data model
```

---

## Example Operations

```graphql
# Create a task
mutation {
  addTask(title: "First task") {
    id
    title
    completed
    createdAt
  }
}

# Toggle completion
mutation {
  toggleTask(id: "TASK_ID") {
    id
    completed
  }
}

# Delete a task
mutation {
  deleteTask(id: "TASK_ID") {
    id
    title
  }
}

# Update title
mutation {
  updateTask(id: "TASK_ID", title: "Rename task") {
    id
    title
  }
}

# Delete all completed tasks

mutation {
  deleteCompletedTasks {
    id
    title
    completed
  }
}

# List all tasks
query {
  tasks {
    id
    title
    completed
  }
}

# Fetch a single task
query {
  task(id: "TASK_ID") {
    id
    title
    completed
  }
}


```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build |
| `npm run db:migrate` | Run pending Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client and Pothos types |


