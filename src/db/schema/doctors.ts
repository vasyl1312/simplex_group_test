import { InferModel } from "drizzle-orm";
import { pgTable, varchar, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const newDoctorSchema = pgTable(
  "doctors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 50 }).notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    spec: varchar("spec", { length: 50 }).notNull(),
    slots: varchar("slots").array().default([]),
  },
  (table) => ({
    emailIdx: uniqueIndex("emailIdx").on(table.email), ///unique
  })
);

export type TNewDoctor = InferModel<typeof newDoctorSchema>;
