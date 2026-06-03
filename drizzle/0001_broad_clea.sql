CREATE TYPE "public"."quest_category" AS ENUM('visitas', 'vendas', 'receita', 'reativacao', 'produto', 'especial');--> statement-breakpoint
CREATE TYPE "public"."quest_type" AS ENUM('diaria', 'semanal', 'unica');--> statement-breakpoint
CREATE TABLE "quest_progress" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"quest_id" varchar(36) NOT NULL,
	"vendor_id" varchar(36) NOT NULL,
	"current" real DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" "quest_type" NOT NULL,
	"category" "quest_category" NOT NULL,
	"target" real NOT NULL,
	"xp_reward" integer NOT NULL,
	"icon" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"assigned_to_all" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "quest_progress_quest_vendor_idx" ON "quest_progress" USING btree ("quest_id","vendor_id");