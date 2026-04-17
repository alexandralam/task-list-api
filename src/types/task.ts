import { builder } from '../builder.js';

const DateTime = builder.scalarType('DateTime', {
  serialize: (value) => (value as Date).toISOString(),
  parseValue: (value) => new Date(value as string),
});

builder.prismaObject('Task', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    completed: t.exposeBoolean('completed'),
    createdAt: t.expose('createdAt', { type: DateTime }),
    updatedAt: t.expose('updatedAt', { type: DateTime }),
  }),
});
