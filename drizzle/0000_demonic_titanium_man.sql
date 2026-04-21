CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"image" text DEFAULT '/files/avatar/user-1.jpeg',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"anime_id" text NOT NULL,
	"anime_title" text NOT NULL,
	"anime_poster" text NOT NULL,
	"anime_status" text DEFAULT 'ongoing',
	"added_at" timestamp DEFAULT now(),
	CONSTRAINT "watchlist_user_id_anime_id_unique" UNIQUE("user_id","anime_id")
);
--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;