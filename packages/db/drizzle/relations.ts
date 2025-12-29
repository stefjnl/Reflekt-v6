import { relations } from "drizzle-orm/relations";
import { users, dailyGoals, entries, notes, tasks } from "./schema";

export const dailyGoalsRelations = relations(dailyGoals, ({one}) => ({
	user: one(users, {
		fields: [dailyGoals.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	dailyGoals: many(dailyGoals),
	entries: many(entries),
	notes: many(notes),
	tasks: many(tasks),
}));

export const entriesRelations = relations(entries, ({one}) => ({
	user: one(users, {
		fields: [entries.userId],
		references: [users.id]
	}),
}));

export const notesRelations = relations(notes, ({one}) => ({
	user: one(users, {
		fields: [notes.userId],
		references: [users.id]
	}),
}));

export const tasksRelations = relations(tasks, ({one}) => ({
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id]
	}),
}));