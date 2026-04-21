-- Apply database/schema/table privileges for cPanel PostgreSQL user.
-- Run this as a privileged database account (the database owner account).

GRANT CONNECT ON DATABASE "nagecoco_DB" TO "nagecoco_admin";
GRANT USAGE, CREATE ON SCHEMA public TO "nagecoco_admin";

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "nagecoco_admin";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "nagecoco_admin";
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO "nagecoco_admin";

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO "nagecoco_admin";

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO "nagecoco_admin";

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON FUNCTIONS TO "nagecoco_admin";
