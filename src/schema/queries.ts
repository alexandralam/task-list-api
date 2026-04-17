import { z } from 'zod';
import { builder } from '../builder.js';
import { prisma } from '../db.js';

builder.queryFields((t) => ({
  //Query all tasks, ordered by creation date descending
  tasks: t.prismaField({
    type: ['Task'],
    resolve: (query) => prisma.task.findMany({ ...query, orderBy: { createdAt: 'desc' } }),
  }),

  //Query a single task by ID
  task: t.prismaField({
    type: 'Task',
    nullable: true,
    args: {
      id: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1, 'ID is required') },
      }),
    },
    resolve: (query, _root, args) =>
      prisma.task.findUnique({ ...query, where: { id: args.id } }),
  }),
}));
