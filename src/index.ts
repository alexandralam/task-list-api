import 'dotenv/config';
import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { builder } from './builder.js';
import './types/task.js';
import './schema/queries.js';
import './schema/mutations.js';

builder.queryType({});
builder.mutationType({});

const schema = builder.toSchema();
const yoga = createYoga({ schema });
const server = createServer(yoga);

const PORT = process.env['PORT'] ?? 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
