ALTER TABLE "users" ADD COLUMN "phone" varchar(50) NOT NULL;
DROP INDEX IF EXISTS "phoneIdx";
CREATE UNIQUE INDEX IF NOT EXISTS "emailIdx" ON "users" ("phone");