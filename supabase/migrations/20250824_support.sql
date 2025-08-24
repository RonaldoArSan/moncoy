-- Support settings (global) and support tickets (per-user)

-- support_settings: single-row configuration edited by admins
CREATE TABLE IF NOT EXISTS support_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  support_email TEXT,
  phones JSONB DEFAULT '[]', -- array of strings
  whatsapp TEXT,
  business_hours TEXT, -- multiline text
  chat_url TEXT,
  knowledge_base_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE support_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone (incl. unauth) to read settings; writes only via service role/API
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_settings' AND policyname = 'Allow read to all'
  ) THEN
    CREATE POLICY "Allow read to all" ON support_settings FOR SELECT USING (true);
  END IF;
END $$;

-- support_tickets: users can create and view their own tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('Baixa','Média','Alta','Urgente')) DEFAULT 'Média',
  status TEXT CHECK (status IN ('Aberto','Em andamento','Resolvido','Fechado')) DEFAULT 'Aberto',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_tickets' AND policyname = 'Users manage own tickets'
  ) THEN
    CREATE POLICY "Users manage own tickets" ON support_tickets FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
