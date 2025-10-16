-- Create commitments table
CREATE TABLE commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  type VARCHAR(50) DEFAULT 'other' CHECK (type IN ('income', 'expense', 'investment', 'meeting', 'other')),
  amount NUMERIC(10, 2),
  category VARCHAR(255),
  recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern VARCHAR(50) CHECK (recurring_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow users to access their own commitments" ON commitments FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_commitments_user_id ON commitments(user_id);
CREATE INDEX idx_commitments_date ON commitments(date);
CREATE INDEX idx_commitments_user_date ON commitments(user_id, date);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();