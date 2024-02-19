import { InferModel } from "drizzle-orm";
import { pgTable, varchar, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const newUserSchema = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phone: varchar("phone", { length: 50 }).notNull(),
    email: varchar("email", { length: 50 }).notNull(),
    name: varchar("name", { length: 50 }).notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("emailIdx").on(table.email), ///unique
  })
);

export type TNewUser = InferModel<typeof newUserSchema>;
