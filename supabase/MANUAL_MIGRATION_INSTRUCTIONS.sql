-- INSTRUÇÕES PARA APLICAR AS MIGRAÇÕES NO CONSOLE SUPABASE
-- 
-- 1. Acesse o console do Supabase: https://supabase.com/dashboard
-- 2. Navegue até o projeto dxdbpppymxfiojszrmir
-- 3. Vá para "SQL Editor"
-- 4. Execute os seguintes scripts na ordem:

-- ETAPA 1: Executar o arquivo de migração principal
-- Cole o conteúdo do arquivo: supabase/migrations/20251011_complete_financial_schema.sql

-- ETAPA 2: Executar as funções financeiras
-- Cole o conteúdo do arquivo: supabase/migrations/20251011_financial_functions.sql

-- ETAPA 3: Verificar se as tabelas foram criadas
-- Execute esta consulta para verificar:
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'budgets', 
    'budget_categories', 
    'financial_accounts', 
    'financial_reports', 
    'debts', 
    'debt_payments', 
    'subscriptions', 
    'tax_documents', 
    'financial_alerts', 
    'exchange_rates'
)
ORDER BY table_name;

-- ETAPA 4: Verificar se as funções foram criadas
-- Execute esta consulta para verificar:
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'calculate_net_worth',
    'calculate_savings_rate', 
    'get_spending_by_category',
    'detect_unusual_spending',
    'generate_monthly_report',
    'create_financial_alerts',
    'import_transactions_from_json',
    'cleanup_old_data'
)
ORDER BY routine_name;

-- ETAPA 5: Verificar a view
-- Execute esta consulta para verificar:
SELECT * FROM information_schema.views 
WHERE table_name = 'user_financial_summary';

-- ETAPA 6: Testar uma função (opcional)
-- Teste a função calculate_net_worth com um UUID de usuário existente:
-- SELECT calculate_net_worth('seu-uuid-aqui');

-- IMPORTANTE: 
-- 1. As migrações devem ser executadas por um usuário com privilégios de administrador
-- 2. Se alguma tabela já existir, a migração pode falhar - revise o schema existente
-- 3. Depois de aplicar as migrações, teste os endpoints da API criados
-- 4. Verifique se as políticas RLS estão funcionando corretamente

-- SCRIPT DE VERIFICAÇÃO COMPLETA:
DO $$
DECLARE
    table_count INTEGER;
    function_count INTEGER;
    view_count INTEGER;
BEGIN
    -- Contar tabelas criadas
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'budgets', 'budget_categories', 'financial_accounts', 
        'financial_reports', 'debts', 'debt_payments', 
        'subscriptions', 'tax_documents', 'financial_alerts', 
        'exchange_rates'
    );
    
    -- Contar funções criadas
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name IN (
        'calculate_net_worth', 'calculate_savings_rate', 
        'get_spending_by_category', 'detect_unusual_spending',
        'generate_monthly_report', 'create_financial_alerts',
        'import_transactions_from_json', 'cleanup_old_data'
    );
    
    -- Contar views criadas
    SELECT COUNT(*) INTO view_count
    FROM information_schema.views 
    WHERE table_name = 'user_financial_summary';
    
    -- Exibir resultados
    RAISE NOTICE 'Verificação da migração:';
    RAISE NOTICE 'Tabelas criadas: % de 10', table_count;
    RAISE NOTICE 'Funções criadas: % de 8', function_count;
    RAISE NOTICE 'Views criadas: % de 1', view_count;
    
    IF table_count = 10 AND function_count = 8 AND view_count = 1 THEN
        RAISE NOTICE 'SUCESSO: Todas as migrações foram aplicadas corretamente!';
    ELSE
        RAISE WARNING 'ATENÇÃO: Algumas migrações podem não ter sido aplicadas corretamente.';
    END IF;
END $$;