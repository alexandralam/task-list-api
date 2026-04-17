import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import ZodPlugin from "@pothos/plugin-zod";
import { GraphQLError } from "graphql";
import { getDatamodel } from "./generated/pothos-types.js";
import type PrismaTypes from "./generated/pothos-types.js";
import { prisma } from "./db.js";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin, ZodPlugin],
  zod: {
    validationError: (zodError) =>
      new GraphQLError("Validation error", {
        extensions: { code: "VALIDATION_ERROR", issues: zodError.issues },
      }),
  },
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
  },
});