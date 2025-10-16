#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  try {
    console.log('🔍 Verificando se a tabela commitments existe...');
    
    // Tentar fazer uma query simples na tabela
    const { data, error } = await supabase
      .from('commitments')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tabela commitments não existe');
        console.log('🚀 Criando tabela...');
        await createTable();
      } else {
        console.log('⚠️  Erro ao verificar tabela:', error.message);
        if (error.code === '42501') {
          console.log('📋 Parece que a tabela existe mas sem permissões RLS corretas');
          console.log('Execute no Supabase Dashboard:');
          console.log('ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;');
          console.log('CREATE POLICY "Allow users to access their own commitments" ON commitments FOR ALL USING (auth.uid() = user_id);');
        }
      }
    } else {
      console.log('✅ Tabela commitments existe e está acessível!');
      console.log(`📊 Registros encontrados: ${data?.length || 0}`);
    }
  } catch (error) {
    console.error('❌ Erro durante verificação:', error);
  }
}

async function createTable() {
  try {
    // Como não temos privilégios de admin, vamos mostrar o SQL para executar manualmente
    console.log('📋 Execute este SQL no Supabase Dashboard (SQL Editor):');
    console.log(`
-- Create commitments table
CREATE TABLE IF NOT EXISTS commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE POLICY "Allow users to access their own commitments" 
ON commitments FOR ALL 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error);
  }
}

checkTable();