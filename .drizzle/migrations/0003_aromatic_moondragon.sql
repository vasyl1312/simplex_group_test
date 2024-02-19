ALTER TABLE "doctors" ADD COLUMN "email" varchar(50) NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "emailIdx" ON "doctors" ("email");