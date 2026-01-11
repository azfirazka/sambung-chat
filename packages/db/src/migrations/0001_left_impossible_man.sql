ALTER TABLE "messages" ALTER COLUMN "metadata" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "prompts" ALTER COLUMN "variables" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "prompts" ALTER COLUMN "variables" SET DEFAULT '[]'::jsonb;