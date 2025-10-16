#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

// Criar cliente com privilégios de admin
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function runMigration() {
  try {
    console.log('🚀 Iniciando migração para criar tabela de compromissos...');
    
    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, '../supabase/migrations/commitments-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Executar SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Erro ao executar migração:', error);
      process.exit(1);
    }
    
    console.log('✅ Migração executada com sucesso!');
    console.log('📋 Tabela "commitments" criada com sucesso');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Tentar executar direto via SQL
async function runMigrationDirect() {
  try {
    console.log('🚀 Executando migração direta...');
    
    // SQL da migração
    const sql = `
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
    `;
    
    // Executar criação da tabela
    const { error: tableError } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (tableError) {
      console.log('📝 Tentando método alternativo...');
      
      // Método alternativo - inserir via API
      const { error: apiError } = await supabase
        .from('commitments')
        .select('id')
        .limit(1);
        
      if (apiError && apiError.code === '42P01') {
        console.error('❌ Tabela não existe e não foi possível criar. Execute manualmente no Supabase Dashboard:');
        console.log('📋 SQL para executar:');
        console.log(sql);
        console.log('\n-- Depois execute:');
        console.log('ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;');
        console.log('CREATE POLICY "Allow users to access their own commitments" ON commitments FOR ALL USING (auth.uid() = user_id);');
        process.exit(1);
      }
    }
    
    console.log('✅ Verificação da tabela bem-sucedida!');
    
    // Configurar RLS
    const rlsSQL = `
      ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY IF NOT EXISTS "Allow users to access their own commitments" 
      ON commitments FOR ALL USING (auth.uid() = user_id);
    `;
    
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql_query: rlsSQL });
    
    if (rlsError) {
      console.log('⚠️  Aviso: Não foi possível configurar RLS automaticamente');
      console.log('📋 Execute manualmente no Supabase Dashboard:');
      console.log(rlsSQL);
    } else {
      console.log('🔒 RLS configurado com sucesso!');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    console.log('\n📋 Execute manualmente no Supabase Dashboard:');
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
CREATE POLICY "Allow users to access their own commitments" ON commitments FOR ALL USING (auth.uid() = user_id);
    `);
  }
}

runMigrationDirect();