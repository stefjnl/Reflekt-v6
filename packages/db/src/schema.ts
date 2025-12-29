import { sql } from "drizzle-orm";
import { boolean, date, foreignKey, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey().notNull(),
    email: varchar("email").notNull(),
    hashedPassword: varchar("hashed_password").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'date' }).defaultNow(),
    googleCredentials: text("google_credentials"),
    keepEmail: varchar("keep_email", { length: 255 }),
    keepMasterToken: text("keep_master_token"),
},
    (table) => {
        return {
            ixUsersEmail: uniqueIndex("ix_users_email").using("btree", table.email.asc().nullsLast()),
            ixUsersId: index("ix_users_id").using("btree", table.id.asc().nullsLast()),
        }
    });

export const entries = pgTable("entries", {
    id: serial("id").primaryKey().notNull(),
    title: varchar("title").notNull(),
    content: text("content").notNull(),
    userId: integer("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'date' }).defaultNow(),
    importSource: varchar("import_source", { length: 50 }).default(sql`NULL`),
    importDate: timestamp("import_date", { mode: 'date' }),
},
    (table) => {
        return {
            idxEntriesCreatedAt: index("idx_entries_created_at").using("btree", table.createdAt.asc().nullsLast()),
            idxEntriesUserCreated: index("idx_entries_user_created").using("btree", table.userId.asc().nullsLast(), table.createdAt.asc().nullsLast()),
            ixEntriesId: index("ix_entries_id").using("btree", table.id.asc().nullsLast()),
            entriesUserIdFkey: foreignKey({
                columns: [table.userId],
                foreignColumns: [users.id],
                name: "entries_user_id_fkey"
            }),
        }
    });

export const dailyGoals = pgTable("daily_goals", {
    id: serial("id").primaryKey().notNull(),
    date: date("date").notNull(),
    userId: integer("user_id").notNull(),
    goal1: varchar("goal_1").notNull(),
    goal2: varchar("goal_2").notNull(),
    goal3: varchar("goal_3").notNull(),
    goal1Completed: boolean("goal_1_completed"),
    goal2Completed: boolean("goal_2_completed"),
    goal3Completed: boolean("goal_3_completed"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'date' }).defaultNow(),
    additionalGoals: jsonb("additional_goals").default([]),
},
    (table) => {
        return {
            ixDailyGoalsId: index("ix_daily_goals_id").using("btree", table.id.asc().nullsLast()),
            dailyGoalsUserIdFkey: foreignKey({
                columns: [table.userId],
                foreignColumns: [users.id],
                name: "daily_goals_user_id_fkey"
            }),
        }
    });

export const notes = pgTable("notes", {
    id: serial("id").primaryKey().notNull(),
    title: varchar("title"),
    content: text("content").notNull(),
    color: varchar("color", { length: 7 }),
    pinned: boolean("pinned"),
    archived: boolean("archived"),
    position: integer("position").notNull(),
    userId: integer("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'date' }).defaultNow(),
},
    (table) => {
        return {
            ixNotesId: index("ix_notes_id").using("btree", table.id.asc().nullsLast()),
            notesUserIdFkey: foreignKey({
                columns: [table.userId],
                foreignColumns: [users.id],
                name: "notes_user_id_fkey"
            }),
        }
    });
