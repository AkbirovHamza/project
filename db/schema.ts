import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: serial().primaryKey(),
  name: text().notNull(),
  phone: text().notNull(),
  email: text(),
  message: text().notNull().default(""),
  source: text().notNull().default("site"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
