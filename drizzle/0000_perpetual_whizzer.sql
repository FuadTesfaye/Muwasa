CREATE TABLE "conversation_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"summary" text NOT NULL,
	"unresolved_questions" text[],
	"last_message_sequence" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"title" text DEFAULT 'New Reflection',
	"language" varchar(8) DEFAULT 'en',
	"status" varchar(32) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emotions" (
	"slug" varchar(64) PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text,
	"category" varchar(32) DEFAULT 'negative',
	"description" text
);
--> statement-breakpoint
CREATE TABLE "knowledge_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid,
	"source_type" varchar(32) NOT NULL,
	"source_reference" text NOT NULL,
	"title" text NOT NULL,
	"arabic_text" text,
	"translation" text,
	"content" text NOT NULL,
	"tags" text[],
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"status" varchar(32) DEFAULT 'approved' NOT NULL,
	"embedding" vector(768),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" varchar(32) NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"confidence" text,
	"consent" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" varchar(16) NOT NULL,
	"content" text NOT NULL,
	"sequence" integer NOT NULL,
	"situation_profile" jsonb,
	"safety_result" jsonb,
	"token_count" integer,
	"latency_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "response_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"knowledge_chunk_id" uuid,
	"source_reference" text NOT NULL,
	"source_type" varchar(32) NOT NULL,
	"position" integer NOT NULL,
	"relevance_score" text,
	"was_verified" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safety_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid,
	"message_id" uuid,
	"risk_level" varchar(32) NOT NULL,
	"risk_categories" jsonb,
	"action_taken" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "situation_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"situation_slug" varchar(64),
	"alias" text NOT NULL,
	"language" varchar(8) DEFAULT 'en' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "situations" (
	"slug" varchar(64) PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text,
	"category" varchar(32) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(32) NOT NULL,
	"name" text NOT NULL,
	"version" varchar(32) DEFAULT '1.0',
	"license" text,
	"url" text,
	"publisher" text,
	"verified" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spiritual_states" (
	"slug" varchar(64) PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "user_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid,
	"response_helpful" boolean NOT NULL,
	"response_tone" text,
	"source_relevant" boolean,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"display_name" text,
	"language" varchar(8) DEFAULT 'en',
	"translation_preference" text DEFAULT 'Saheeh International',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "conversation_summaries" ADD CONSTRAINT "conversation_summaries_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response_sources" ADD CONSTRAINT "response_sources_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response_sources" ADD CONSTRAINT "response_sources_knowledge_chunk_id_knowledge_chunks_id_fk" FOREIGN KEY ("knowledge_chunk_id") REFERENCES "public"."knowledge_chunks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "situation_aliases" ADD CONSTRAINT "situation_aliases_situation_slug_situations_slug_fk" FOREIGN KEY ("situation_slug") REFERENCES "public"."situations"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "knowledge_embedding_idx" ON "knowledge_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "knowledge_source_ref_idx" ON "knowledge_chunks" USING btree ("source_reference");--> statement-breakpoint
CREATE INDEX "knowledge_source_type_idx" ON "knowledge_chunks" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "knowledge_status_idx" ON "knowledge_chunks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messages_convo_seq_idx" ON "messages" USING btree ("conversation_id","sequence");