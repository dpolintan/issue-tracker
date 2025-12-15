(-- Migration: align `issues` table with SQLAlchemy `Issue` model
-- Idempotent PostgreSQL statements. Review and backup before running.
BEGIN;

-- Create table if it does not exist (permissive column types first)
CREATE TABLE IF NOT EXISTS issues (
		id integer,
		title varchar(255),
		description text,
		status varchar(10),
		created_on timestamptz
);

-- Ensure id sequence exists and is used as default (auto-increment)
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'issues_id_seq') THEN
		CREATE SEQUENCE issues_id_seq;
	END IF;
END$$;

-- Set sequence current value from max(id)
SELECT setval('issues_id_seq', COALESCE((SELECT MAX(id) FROM issues), 0));
ALTER TABLE issues ALTER COLUMN id SET DEFAULT nextval('issues_id_seq');

-- Add PRIMARY KEY on id if not already present
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.table_constraints
		WHERE table_name = 'issues' AND constraint_type = 'PRIMARY KEY'
	) THEN
		ALTER TABLE issues ADD PRIMARY KEY (id);
	END IF;
END$$;

-- Title: ensure column exists, fill NULLs, then make NOT NULL
ALTER TABLE issues ADD COLUMN IF NOT EXISTS title varchar(255);
UPDATE issues SET title = 'Untitled' WHERE title IS NULL;
ALTER TABLE issues ALTER COLUMN title SET NOT NULL;

-- Description: ensure column exists
ALTER TABLE issues ADD COLUMN IF NOT EXISTS description text;

-- Status: ensure column exists, normalize, add CHECK constraint and default
ALTER TABLE issues ADD COLUMN IF NOT EXISTS status varchar(10);
UPDATE issues SET status = 'open' WHERE status IS NULL OR status = '';
ALTER TABLE issues DROP CONSTRAINT IF EXISTS check_issue_status;
ALTER TABLE issues ADD CONSTRAINT check_issue_status CHECK (status IN ('open','closed'));
ALTER TABLE issues ALTER COLUMN status SET DEFAULT 'open';

-- created_on: ensure column exists, set missing values to now(), set default and NOT NULL
ALTER TABLE issues ADD COLUMN IF NOT EXISTS created_on timestamptz;
UPDATE issues SET created_on = now() WHERE created_on IS NULL;
ALTER TABLE issues ALTER COLUMN created_on SET DEFAULT now();
ALTER TABLE issues ALTER COLUMN created_on SET NOT NULL;

-- Indexes: add meaningful indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues (status);
CREATE INDEX IF NOT EXISTS idx_issues_created_on ON issues (created_on);

COMMIT;

-- Notes:
-- 1) Script is conservative: creates missing columns, fills NULLs with safe defaults,
--    and adds constraints/defaults matching the SQLAlchemy model.
-- 2) For a native Postgres ENUM type for `status`, create the type and ALTER the column.
-- 3) Backup your data before running in production.
)
