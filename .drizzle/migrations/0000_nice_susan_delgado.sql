CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(50) NOT NULL,
	"name" varchar(50) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "phoneIdx" ON "users" ("email");