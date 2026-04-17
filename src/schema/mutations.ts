import { GraphQLError } from 'graphql';
import { z } from 'zod';
import { builder } from '../builder.js';
import { prisma } from '../db.js';

const titleSchema = z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or fewer');
const idSchema = z.string().min(1, 'ID is required');

async function findTaskOrThrow(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new GraphQLError(`Task "${id}" not found`, { extensions: { code: 'NOT_FOUND' } });
  return task;
}

builder.mutationFields((t) => ({
  // Creates a new task with the given title
  // Returns the new task
  addTask: t.prismaField({
    type: 'Task',
    args: {
      title: t.arg.string({
        required: true,
        validate: { schema: titleSchema },
      }),
    },
    resolve: (query, _root, args) =>
      prisma.task.create({ ...query, data: { title: args.title } }),
  }),
  
  // Toggle a task's completion status by ID
  // Returns the task with updated completion status
  toggleTask: t.prismaField({
    type: 'Task',
    args: {
      id: t.arg.string({
        required: true,
        validate: { schema: idSchema },
      }),
    },
    resolve: async (query, _root, args) => {
      const task = await findTaskOrThrow(args.id);
      return prisma.task.update({
        ...query,
        where: { id: args.id },
        data: { completed: !task.completed },
      });
    },
  }),
  
  //Delete a task by ID
  // Returns the deleted task
  deleteTask: t.prismaField({
    type: 'Task',
    args: {
      id: t.arg.string({
        required: true,
        validate: { schema: idSchema },
      }),
    },
    resolve: async (query, _root, args) => {
      await findTaskOrThrow(args.id);
      return prisma.task.delete({ ...query, where: { id: args.id } });
    },
  }),

  // Bonus: Update a task's title
  // Returns the updated task
  updateTask: t.prismaField({
    type: 'Task',
    args: {
      id: t.arg.string({
        required: true,
        validate: { schema: idSchema },
      }),
      title: t.arg.string({
        required: true,
        validate: { schema: titleSchema },
      }),
    },
    resolve: async (query, _root, args) => {
      await findTaskOrThrow(args.id);
      return prisma.task.update({
        ...query,
        where: { id: args.id },
        data: { title: args.title },
      });
    },
  }),
  
  // Bonus: Delete all completed tasks
  // Returns the list of deleted tasks
  deleteCompletedTasks: t.prismaField({
    type: ['Task'],
    resolve: async (query) => {
      const tasks = await prisma.task.findMany({ ...query, where: { completed: true } });
      await prisma.task.deleteMany({ where: { completed: true } });
      return tasks;
    },
  }),
}));
