CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"workspace_owner" uuid NOT NULL,
	"title" text NOT NULL,
	"data" text,
	"icon_id" text NOT NULL,
	"in_trash" text,
	"updated_at" timestamp with time zone,
	"logo" text,
	"banner_url" text
);
