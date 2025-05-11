CREATE TABLE "albums" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_to_albums" (
	"userId" uuid NOT NULL,
	"albumId" uuid NOT NULL,
	CONSTRAINT "users_to_albums_userId_albumId_pk" PRIMARY KEY("userId","albumId")
);
--> statement-breakpoint
ALTER TABLE "users_to_albums" ADD CONSTRAINT "users_to_albums_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_albums" ADD CONSTRAINT "users_to_albums_albumId_albums_id_fk" FOREIGN KEY ("albumId") REFERENCES "public"."albums"("id") ON DELETE no action ON UPDATE no action;