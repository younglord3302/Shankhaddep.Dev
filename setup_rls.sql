-- Create requesting_user_id function for Clerk integration
create or replace function public.requesting_user_id()
returns text
language sql stable
as $$
  select nullif(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  )::text
$$;

-- Enable RLS on all operational tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Projects: Public can read, authenticated users can do everything
DROP POLICY IF EXISTS "Public Read Projects" ON projects;
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth Manage Projects" ON projects;
CREATE POLICY "Auth Manage Projects" ON projects FOR ALL TO authenticated USING (requesting_user_id() IS NOT NULL);

-- Blogs: Public can read, authenticated users can do everything
DROP POLICY IF EXISTS "Public Read Blogs" ON blogs;
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth Manage Blogs" ON blogs;
CREATE POLICY "Auth Manage Blogs" ON blogs FOR ALL TO authenticated USING (requesting_user_id() IS NOT NULL);

-- Contacts: Public can submit (Insert), authenticated users can read/manage
DROP POLICY IF EXISTS "Public Insert Contacts" ON contacts;
CREATE POLICY "Public Insert Contacts" ON contacts FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Auth Manage Contacts" ON contacts;
CREATE POLICY "Auth Manage Contacts" ON contacts FOR ALL TO authenticated USING (requesting_user_id() IS NOT NULL);

-- Analytics: Public can submit events (Insert), authenticated users can read/manage
DROP POLICY IF EXISTS "Public Insert Analytics" ON analytics;
CREATE POLICY "Public Insert Analytics" ON analytics FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Auth Manage Analytics" ON analytics;
CREATE POLICY "Auth Manage Analytics" ON analytics FOR ALL TO authenticated USING (requesting_user_id() IS NOT NULL);
