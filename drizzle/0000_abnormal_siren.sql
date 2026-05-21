CREATE TYPE "public"."client_status" AS ENUM('pendente', 'visitado', 'venda_realizada', 'sem_venda');--> statement-breakpoint
CREATE TYPE "public"."goal_period" AS ENUM('diario', 'semanal', 'mensal');--> statement-breakpoint
CREATE TYPE "public"."goal_type" AS ENUM('receita', 'vendas', 'visitas');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('info', 'achievement', 'alert', 'route');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pendente', 'confirmado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."route_status" AS ENUM('nao_iniciada', 'em_andamento', 'concluida');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('GESTOR', 'VENDEDOR');--> statement-breakpoint
CREATE TYPE "public"."vendor_status" AS ENUM('ativo', 'inativo', 'ferias');--> statement-breakpoint
CREATE TYPE "public"."visit_reason" AS ENUM('cliente_fechado', 'sem_interesse', 'vai_comprar_depois');--> statement-breakpoint
CREATE TYPE "public"."xp_activity_type" AS ENUM('checkin', 'venda', 'meta_atingida', 'conquista');--> statement-breakpoint
CREATE TABLE "check_ins" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"lat" double precision,
	"lng" double precision,
	"photo_url" text,
	"notes" text,
	"vendor_id" varchar(36) NOT NULL,
	"client_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_locations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"vendor_id" varchar(36) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendor_locations_vendor_id_unique" UNIQUE("vendor_id")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cnpj" varchar(18) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(2) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"segment" varchar(100) NOT NULL,
	"notes" text,
	"status" "client_status" DEFAULT 'pendente' NOT NULL,
	"total_orders" integer DEFAULT 0 NOT NULL,
	"total_revenue" real DEFAULT 0 NOT NULL,
	"last_order_date" timestamp,
	"vendor_id" varchar(36),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(10) NOT NULL,
	"xp_reward" integer NOT NULL,
	"condition" text NOT NULL,
	CONSTRAINT "achievements_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "vendor_achievements" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	"vendor_id" varchar(36) NOT NULL,
	"achievement_id" varchar(36) NOT NULL,
	CONSTRAINT "vendor_achievements_vendor_id_achievement_id_unique" UNIQUE("vendor_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE "xp_activities" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"type" "xp_activity_type" NOT NULL,
	"description" text NOT NULL,
	"xp_earned" integer NOT NULL,
	"vendor_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"period" "goal_period" NOT NULL,
	"type" "goal_type" NOT NULL,
	"target" real NOT NULL,
	"current" real DEFAULT 0 NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"vendor_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_recipients" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"read_at" timestamp,
	"notification_id" varchar(36) NOT NULL,
	"vendor_id" varchar(36) NOT NULL,
	CONSTRAINT "notification_recipients_notification_id_vendor_id_unique" UNIQUE("notification_id","vendor_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"target_all" boolean DEFAULT false NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"sent_by_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" real NOT NULL,
	"subtotal" real NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"product_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"total" real NOT NULL,
	"status" "order_status" DEFAULT 'pendente' NOT NULL,
	"notes" text,
	"vendor_id" varchar(36) NOT NULL,
	"client_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"unit" varchar(50) NOT NULL,
	"price" real NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "route_clients" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"status" "client_status" DEFAULT 'pendente' NOT NULL,
	"check_in_time" timestamp,
	"visit_reason" "visit_reason",
	"route_id" varchar(36) NOT NULL,
	"client_id" varchar(36) NOT NULL,
	CONSTRAINT "route_clients_route_id_client_id_unique" UNIQUE("route_id","client_id")
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"status" "route_status" DEFAULT 'nao_iniciada' NOT NULL,
	"total_clients" integer DEFAULT 0 NOT NULL,
	"visited_clients" integer DEFAULT 0 NOT NULL,
	"sales_made" integer DEFAULT 0 NOT NULL,
	"vendor_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'GESTOR' NOT NULL,
	"avatar" text,
	"refresh_token" text,
	"login_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"matricula" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"avatar" text,
	"status" "vendor_status" DEFAULT 'ativo' NOT NULL,
	"region" text NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"total_sales" integer DEFAULT 0 NOT NULL,
	"total_revenue" real DEFAULT 0 NOT NULL,
	"goals_hit" integer DEFAULT 0 NOT NULL,
	"goals_total" integer DEFAULT 0 NOT NULL,
	"refresh_token" text,
	"login_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendors_email_unique" UNIQUE("email"),
	CONSTRAINT "vendors_matricula_unique" UNIQUE("matricula")
);
--> statement-breakpoint
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_locations" ADD CONSTRAINT "vendor_locations_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_achievements" ADD CONSTRAINT "vendor_achievements_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_achievements" ADD CONSTRAINT "vendor_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_activities" ADD CONSTRAINT "xp_activities_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sent_by_id_users_id_fk" FOREIGN KEY ("sent_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_clients" ADD CONSTRAINT "route_clients_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_clients" ADD CONSTRAINT "route_clients_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;