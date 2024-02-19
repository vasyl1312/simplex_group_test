import { InferModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const newAppointmentSchema = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull(),
  doctor_id: uuid("doctor_id").notNull(),
  slot: varchar("phone", { length: 50 }).notNull(),
});

export type TAppointment = InferModel<typeof newAppointmentSchema>;
