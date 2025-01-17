import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	number: integer().notNull(),
	type: varchar({ length: 255 }).notNull(),
	content: varchar({ length: 255 }).notNull(),
});
