CREATE TABLE IF NOT EXISTS "doctors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"spec" varchar(50) NOT NULL,
	"slots" varchar[] DEFAULT '{}'::varchar[]
);
