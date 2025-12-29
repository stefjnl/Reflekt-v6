-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "daily_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"user_id" integer NOT NULL,
	"goal_1" varchar NOT NULL,
	"goal_2" varchar NOT NULL,
	"goal_3" varchar NOT NULL,
	"goal_1_completed" boolean,
	"goal_2_completed" boolean,
	"goal_3_completed" boolean,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"additional_goals" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"import_source" varchar(50) DEFAULT NULL,
	"import_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"content" text NOT NULL,
	"color" varchar(7),
	"pinned" boolean,
	"archived" boolean,
	"position" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monthly_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"total_entries" integer DEFAULT 0 NOT NULL,
	"avg_mood_scores" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"mood_trends" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"dominant_themes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"theme_evolution" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"growth_patterns" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"key_insights" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"important_people" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"frequent_locations" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"common_activities" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"llm_summary" text,
	"emotional_narrative" text,
	"growth_narrative" text,
	"generated_at" timestamp with time zone DEFAULT now(),
	"last_updated" timestamp with time zone DEFAULT now(),
	CONSTRAINT "monthly_summaries_year_month_key" UNIQUE("year","month")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"hashed_password" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"google_credentials" text,
	"keep_email" varchar(255),
	"keep_master_token" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analysis_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_id" integer,
	"analysis_type" varchar(50),
	"prompt_hash" varchar(64),
	"result" json,
	"confidence_score" double precision,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "processing_status" (
	"entry_id" serial PRIMARY KEY NOT NULL,
	"last_analyzed" timestamp with time zone,
	"analysis_version" varchar(20),
	"status" varchar(20),
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "narrative_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"period_type" varchar(20) DEFAULT 'month',
	"emotional_arc" jsonb,
	"relationship_dynamics" jsonb,
	"significant_events" jsonb,
	"recurring_patterns" jsonb,
	"personal_growth_moments" jsonb,
	"entry_count" integer,
	"mood_range" jsonb,
	"dominant_people" varchar[],
	"key_themes" varchar[],
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cross_period_insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now(),
	"insights" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entries_temp" (
	"id" integer,
	"title" varchar,
	"content" text,
	"user_id" integer,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"import_source" varchar(50),
	"import_date" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_goals" ADD CONSTRAINT "daily_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_daily_goals_id" ON "daily_goals" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_entries_created_at" ON "entries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_entries_user_created" ON "entries" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_entries_id" ON "entries" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_notes_id" ON "notes" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_monthly_summaries_date" ON "monthly_summaries" USING btree ("year","month");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_monthly_summaries_generated" ON "monthly_summaries" USING btree ("generated_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ix_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_users_id" ON "users" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_analysis_cache_entry_id" ON "analysis_cache" USING btree ("entry_id");
*/