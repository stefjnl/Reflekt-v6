import { pgTable, index, foreignKey, serial, date, integer, varchar, boolean, timestamp, jsonb, text, unique, uniqueIndex, json, doublePrecision } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




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
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
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

export const entries = pgTable("entries", {
	id: serial("id").primaryKey().notNull(),
	title: varchar("title").notNull(),
	content: text("content").notNull(),
	userId: integer("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	importSource: varchar("import_source", { length: 50 }).default(sql`NULL`),
	importDate: timestamp("import_date", { mode: 'string' }),
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

export const notes = pgTable("notes", {
	id: serial("id").primaryKey().notNull(),
	title: varchar("title"),
	content: text("content").notNull(),
	color: varchar("color", { length: 7 }),
	pinned: boolean("pinned"),
	archived: boolean("archived"),
	position: integer("position").notNull(),
	userId: integer("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
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

export const tasks = pgTable("tasks", {
	id: serial("id").primaryKey().notNull(),
	userId: integer("user_id"),
	text: text("text").notNull(),
	completed: boolean("completed").default(false),
	position: integer("position").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
},
(table) => {
	return {
		tasksUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "tasks_user_id_fkey"
		}),
	}
});

export const monthlySummaries = pgTable("monthly_summaries", {
	id: serial("id").primaryKey().notNull(),
	year: integer("year").notNull(),
	month: integer("month").notNull(),
	totalEntries: integer("total_entries").default(0).notNull(),
	avgMoodScores: jsonb("avg_mood_scores").default({}).notNull(),
	moodTrends: jsonb("mood_trends").default({}).notNull(),
	dominantThemes: jsonb("dominant_themes").default({}).notNull(),
	themeEvolution: jsonb("theme_evolution").default({}).notNull(),
	growthPatterns: jsonb("growth_patterns").default({}).notNull(),
	keyInsights: jsonb("key_insights").default({}).notNull(),
	importantPeople: jsonb("important_people").default({}).notNull(),
	frequentLocations: jsonb("frequent_locations").default({}).notNull(),
	commonActivities: jsonb("common_activities").default({}).notNull(),
	llmSummary: text("llm_summary"),
	emotionalNarrative: text("emotional_narrative"),
	growthNarrative: text("growth_narrative"),
	generatedAt: timestamp("generated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	lastUpdated: timestamp("last_updated", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		idxMonthlySummariesDate: index("idx_monthly_summaries_date").using("btree", table.year.asc().nullsLast(), table.month.asc().nullsLast()),
		idxMonthlySummariesGenerated: index("idx_monthly_summaries_generated").using("btree", table.generatedAt.asc().nullsLast()),
		monthlySummariesYearMonthKey: unique("monthly_summaries_year_month_key").on(table.year, table.month),
	}
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	email: varchar("email").notNull(),
	hashedPassword: varchar("hashed_password").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
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

export const analysisCache = pgTable("analysis_cache", {
	id: serial("id").primaryKey().notNull(),
	entryId: integer("entry_id"),
	analysisType: varchar("analysis_type", { length: 50 }),
	promptHash: varchar("prompt_hash", { length: 64 }),
	result: json("result"),
	confidenceScore: doublePrecision("confidence_score"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		ixAnalysisCacheEntryId: index("ix_analysis_cache_entry_id").using("btree", table.entryId.asc().nullsLast()),
	}
});

export const processingStatus = pgTable("processing_status", {
	entryId: serial("entry_id").primaryKey().notNull(),
	lastAnalyzed: timestamp("last_analyzed", { withTimezone: true, mode: 'string' }),
	analysisVersion: varchar("analysis_version", { length: 20 }),
	status: varchar("status", { length: 20 }),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const narrativeSummaries = pgTable("narrative_summaries", {
	id: serial("id").primaryKey().notNull(),
	year: integer("year").notNull(),
	month: integer("month").notNull(),
	periodType: varchar("period_type", { length: 20 }).default('month'),
	emotionalArc: jsonb("emotional_arc"),
	relationshipDynamics: jsonb("relationship_dynamics"),
	significantEvents: jsonb("significant_events"),
	recurringPatterns: jsonb("recurring_patterns"),
	personalGrowthMoments: jsonb("personal_growth_moments"),
	entryCount: integer("entry_count"),
	moodRange: jsonb("mood_range"),
	dominantPeople: varchar("dominant_people").array(),
	keyThemes: varchar("key_themes").array(),
	generatedAt: timestamp("generated_at", { mode: 'string' }).defaultNow(),
});

export const crossPeriodInsights = pgTable("cross_period_insights", {
	id: serial("id").primaryKey().notNull(),
	generatedAt: timestamp("generated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	insights: jsonb("insights"),
});

export const entriesTemp = pgTable("entries_temp", {
	id: integer("id"),
	title: varchar("title"),
	content: text("content"),
	userId: integer("user_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	importSource: varchar("import_source", { length: 50 }),
	importDate: timestamp("import_date", { mode: 'string' }),
});