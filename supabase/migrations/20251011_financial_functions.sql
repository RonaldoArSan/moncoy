-- Financial Functions and Stored Procedures
-- Date: 2025-10-11
-- Description: Funções específicas para operações financeiras

-- 1. Função para calcular o net worth do usuário
CREATE OR REPLACE FUNCTION calculate_net_worth(user_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_assets NUMERIC := 0;
  total_liabilities NUMERIC := 0;
BEGIN
  -- Calcular total de ativos (contas + investimentos)
  SELECT COALESCE(SUM(current_balance), 0) INTO total_assets
  FROM financial_accounts 
  WHERE user_id = user_uuid AND is_active = true AND account_type != 'credit_card';
  
  -- Adicionar investimentos
  total_assets := total_assets + COALESCE((
    SELECT SUM(quantity * current_price)
    FROM investments
    WHERE user_id = user_uuid
  ), 0);
  
  -- Calcular total de passivos (dívidas + cartões de crédito)
  SELECT COALESCE(SUM(current_balance), 0) INTO total_liabilities
  FROM debts 
  WHERE user_id = user_uuid AND is_active = true;
  
  -- Adicionar saldo negativo de cartões de crédito
  total_liabilities := total_liabilities + COALESCE((
    SELECT SUM(ABS(current_balance))
    FROM financial_accounts
    WHERE user_id = user_uuid AND account_type = 'credit_card' AND current_balance < 0
  ), 0);
  
  RETURN total_assets - total_liabilities;
END;
$$ LANGUAGE plpgsql;

-- 2. Função para calcular taxa de poupança (savings rate)
CREATE OR REPLACE FUNCTION calculate_savings_rate(user_uuid UUID, months INTEGER DEFAULT 1)
RETURNS NUMERIC AS $$
DECLARE
  total_income NUMERIC := 0;
  total_expenses NUMERIC := 0;
  savings_rate NUMERIC := 0;
BEGIN
  -- Calcular receita total no período
  SELECT COALESCE(SUM(amount), 0) INTO total_income
  FROM transactions
  WHERE user_id = user_uuid 
    AND type = 'income' 
    AND date >= CURRENT_DATE - INTERVAL '1 month' * months;
  
  -- Calcular gastos totais no período
  SELECT COALESCE(SUM(amount), 0) INTO total_expenses
  FROM transactions
  WHERE user_id = user_uuid 
    AND type = 'expense' 
    AND date >= CURRENT_DATE - INTERVAL '1 month' * months;
  
  -- Calcular taxa de poupança
  IF total_income > 0 THEN
    savings_rate := ((total_income - total_expenses) / total_income) * 100;
  END IF;
  
  RETURN ROUND(savings_rate, 2);
END;
$$ LANGUAGE plpgsql;

-- 3. Função para obter gastos por categoria no período
CREATE OR REPLACE FUNCTION get_spending_by_category(
  user_uuid UUID, 
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  category_name VARCHAR(255),
  total_amount NUMERIC,
  transaction_count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_spending NUMERIC;
BEGIN
  -- Calcular total de gastos no período
  SELECT COALESCE(SUM(amount), 0) INTO total_spending
  FROM transactions t
  WHERE t.user_id = user_uuid 
    AND t.type = 'expense' 
    AND t.date BETWEEN start_date AND end_date;
  
  RETURN QUERY
  SELECT 
    COALESCE(c.name, 'Sem Categoria') as category_name,
    COALESCE(SUM(t.amount), 0) as total_amount,
    COUNT(t.id) as transaction_count,
    CASE 
      WHEN total_spending > 0 THEN ROUND((COALESCE(SUM(t.amount), 0) / total_spending) * 100, 2)
      ELSE 0
    END as percentage
  FROM transactions t
  LEFT JOIN categories c ON t.category_id = c.id
  WHERE t.user_id = user_uuid 
    AND t.type = 'expense' 
    AND t.date BETWEEN start_date AND end_date
  GROUP BY c.id, c.name
  ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- 4. Função para detectar gastos incomuns
CREATE OR REPLACE FUNCTION detect_unusual_spending(user_uuid UUID)
RETURNS TABLE(
  transaction_id UUID,
  amount NUMERIC,
  description TEXT,
  category_name VARCHAR(255),
  date DATE,
  avg_amount NUMERIC,
  deviation_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH category_averages AS (
    SELECT 
      t.category_id,
      AVG(t.amount) as avg_amount,
      STDDEV(t.amount) as std_dev
    FROM transactions t
    WHERE t.user_id = user_uuid 
      AND t.type = 'expense'
      AND t.date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY t.category_id
    HAVING COUNT(*) >= 3 -- Pelo menos 3 transações para calcular média
  )
  SELECT 
    t.id as transaction_id,
    t.amount,
    t.description,
    COALESCE(c.name, 'Sem Categoria') as category_name,
    t.date,
    ca.avg_amount,
    ROUND(((t.amount - ca.avg_amount) / ca.avg_amount) * 100, 2) as deviation_percentage
  FROM transactions t
  LEFT JOIN categories c ON t.category_id = c.id
  JOIN category_averages ca ON t.category_id = ca.category_id
  WHERE t.user_id = user_uuid
    AND t.type = 'expense'
    AND t.date >= CURRENT_DATE - INTERVAL '30 days'
    AND t.amount > (ca.avg_amount + (2 * ca.std_dev)) -- 2 desvios padrão acima da média
  ORDER BY deviation_percentage DESC;
END;
$$ LANGUAGE plpgsql;

-- 5. Função para gerar relatório mensal automático
CREATE OR REPLACE FUNCTION generate_monthly_report(user_uuid UUID, report_month DATE)
RETURNS UUID AS $$
DECLARE
  report_id UUID;
  start_date DATE;
  end_date DATE;
  income_total NUMERIC;
  expense_total NUMERIC;
  net_worth NUMERIC;
  savings_rate NUMERIC;
  report_data JSONB;
BEGIN
  -- Definir período do relatório
  start_date := DATE_TRUNC('month', report_month);
  end_date := start_date + INTERVAL '1 month' - INTERVAL '1 day';
  
  -- Calcular totais
  SELECT COALESCE(SUM(amount), 0) INTO income_total
  FROM transactions
  WHERE user_id = user_uuid AND type = 'income' AND date BETWEEN start_date AND end_date;
  
  SELECT COALESCE(SUM(amount), 0) INTO expense_total
  FROM transactions
  WHERE user_id = user_uuid AND type = 'expense' AND date BETWEEN start_date AND end_date;
  
  -- Calcular net worth e savings rate
  SELECT calculate_net_worth(user_uuid) INTO net_worth;
  SELECT calculate_savings_rate(user_uuid, 1) INTO savings_rate;
  
  -- Preparar dados detalhados do relatório
  SELECT jsonb_build_object(
    'spending_by_category', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'category', category_name,
          'amount', total_amount,
          'percentage', percentage
        )
      )
      FROM get_spending_by_category(user_uuid, start_date, end_date)
    ),
    'top_expenses', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'description', description,
          'amount', amount,
          'date', date,
          'category', c.name
        )
      )
      FROM (
        SELECT t.description, t.amount, t.date, t.category_id
        FROM transactions t
        WHERE t.user_id = user_uuid AND t.type = 'expense' 
          AND t.date BETWEEN start_date AND end_date
        ORDER BY t.amount DESC
        LIMIT 10
      ) t
      LEFT JOIN categories c ON t.category_id = c.id
    )
  ) INTO report_data;
  
  -- Inserir ou atualizar relatório
  INSERT INTO financial_reports (
    user_id, report_type, period_start, period_end,
    total_income, total_expenses, net_worth, savings_rate, report_data
  ) VALUES (
    user_uuid, 'monthly', start_date, end_date,
    income_total, expense_total, net_worth, savings_rate, report_data
  )
  ON CONFLICT (user_id, report_type, period_start) 
  DO UPDATE SET
    total_income = EXCLUDED.total_income,
    total_expenses = EXCLUDED.total_expenses,
    net_worth = EXCLUDED.net_worth,
    savings_rate = EXCLUDED.savings_rate,
    report_data = EXCLUDED.report_data,
    generated_at = NOW()
  RETURNING id INTO report_id;
  
  RETURN report_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Função para criar alertas automáticos
CREATE OR REPLACE FUNCTION create_financial_alerts(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  alerts_created INTEGER := 0;
  budget_record RECORD;
  subscription_record RECORD;
  debt_record RECORD;
BEGIN
  -- Alertas de orçamento excedido
  FOR budget_record IN
    SELECT b.id, b.name, b.total_amount, b.spent_amount
    FROM budgets b
    WHERE b.user_id = user_uuid 
      AND b.is_active = true
      AND b.spent_amount > b.total_amount * 0.9 -- 90% do orçamento
      AND NOT EXISTS (
        SELECT 1 FROM financial_alerts fa
        WHERE fa.user_id = user_uuid 
          AND fa.alert_type = 'budget_exceeded'
          AND fa.related_entity_id = b.id::text::uuid
          AND fa.created_at > CURRENT_DATE - INTERVAL '7 days'
      )
  LOOP
    INSERT INTO financial_alerts (
      user_id, alert_type, title, message, severity,
      related_entity_type, related_entity_id
    ) VALUES (
      user_uuid, 'budget_exceeded',
      'Orçamento Quase Excedido',
      format('Seu orçamento "%s" atingiu %.1f%% do limite.', 
        budget_record.name, 
        (budget_record.spent_amount / budget_record.total_amount) * 100
      ),
      CASE 
        WHEN budget_record.spent_amount > budget_record.total_amount THEN 'critical'
        ELSE 'warning'
      END,
      'budget', budget_record.id
    );
    alerts_created := alerts_created + 1;
  END LOOP;
  
  -- Alertas de renovação de assinatura (próximos 7 dias)
  FOR subscription_record IN
    SELECT s.id, s.service_name, s.amount, s.next_billing_date
    FROM subscriptions s
    WHERE s.user_id = user_uuid 
      AND s.is_active = true
      AND s.next_billing_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      AND NOT EXISTS (
        SELECT 1 FROM financial_alerts fa
        WHERE fa.user_id = user_uuid 
          AND fa.alert_type = 'subscription_renewal'
          AND fa.related_entity_id = s.id::text::uuid
          AND fa.created_at > CURRENT_DATE - INTERVAL '30 days'
      )
  LOOP
    INSERT INTO financial_alerts (
      user_id, alert_type, title, message, severity,
      related_entity_type, related_entity_id
    ) VALUES (
      user_uuid, 'subscription_renewal',
      'Renovação de Assinatura',
      format('Sua assinatura "%s" será renovada em %s por R$ %.2f.', 
        subscription_record.service_name,
        to_char(subscription_record.next_billing_date, 'DD/MM/YYYY'),
        subscription_record.amount
      ),
      'info',
      'subscription', subscription_record.id
    );
    alerts_created := alerts_created + 1;
  END LOOP;
  
  -- Alertas de vencimento de dívidas (próximos 3 dias)
  FOR debt_record IN
    SELECT d.id, d.name, d.minimum_payment, d.due_date
    FROM debts d
    WHERE d.user_id = user_uuid 
      AND d.is_active = true
      AND d.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
      AND NOT EXISTS (
        SELECT 1 FROM financial_alerts fa
        WHERE fa.user_id = user_uuid 
          AND fa.alert_type = 'bill_due'
          AND fa.related_entity_id = d.id::text::uuid
          AND fa.created_at > CURRENT_DATE - INTERVAL '30 days'
      )
  LOOP
    INSERT INTO financial_alerts (
      user_id, alert_type, title, message, severity,
      related_entity_type, related_entity_id
    ) VALUES (
      user_uuid, 'bill_due',
      'Conta Vencendo',
      format('Sua conta "%s" vence em %s. Valor mínimo: R$ %.2f.', 
        debt_record.name,
        to_char(debt_record.due_date, 'DD/MM/YYYY'),
        debt_record.minimum_payment
      ),
      'warning',
      'debt', debt_record.id
    );
    alerts_created := alerts_created + 1;
  END LOOP;
  
  RETURN alerts_created;
END;
$$ LANGUAGE plpgsql;

-- 7. Função para importar transações de CSV
CREATE OR REPLACE FUNCTION import_transactions_from_json(
  user_uuid UUID,
  transactions_data JSONB
)
RETURNS TABLE(
  imported_count INTEGER,
  error_count INTEGER,
  errors JSONB
) AS $$
DECLARE
  transaction_item JSONB;
  imported INTEGER := 0;
  errors_count INTEGER := 0;
  error_list JSONB := '[]'::jsonb;
  category_id_var UUID;
BEGIN
  -- Processar cada transação no array JSON
  FOR transaction_item IN SELECT * FROM jsonb_array_elements(transactions_data)
  LOOP
    BEGIN
      -- Buscar ID da categoria por nome (ou criar se não existir)
      SELECT id INTO category_id_var
      FROM categories c
      WHERE c.user_id = user_uuid 
        AND c.name = transaction_item->>'category';
      
      IF category_id_var IS NULL AND transaction_item->>'category' IS NOT NULL THEN
        INSERT INTO categories (user_id, name, type, color)
        VALUES (user_uuid, transaction_item->>'category', 'expense', '#DDD')
        RETURNING id INTO category_id_var;
      END IF;
      
      -- Inserir transação
      INSERT INTO transactions (
        user_id, description, amount, type, category_id, date, status
      ) VALUES (
        user_uuid,
        transaction_item->>'description',
        (transaction_item->>'amount')::NUMERIC,
        transaction_item->>'type',
        category_id_var,
        (transaction_item->>'date')::DATE,
        COALESCE(transaction_item->>'status', 'completed')
      );
      
      imported := imported + 1;
      
    EXCEPTION WHEN OTHERS THEN
      errors_count := errors_count + 1;
      error_list := error_list || jsonb_build_object(
        'transaction', transaction_item,
        'error', SQLERRM
      );
    END;
  END LOOP;
  
  RETURN QUERY SELECT imported, errors_count, error_list;
END;
$$ LANGUAGE plpgsql;

-- 8. Função para limpar dados antigos (GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Remover alertas antigos (mais de 90 dias)
  DELETE FROM financial_alerts 
  WHERE created_at < CURRENT_DATE - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Remover relatórios muito antigos (mais de 2 anos), mantendo apenas anuais
  DELETE FROM financial_reports 
  WHERE generated_at < CURRENT_DATE - INTERVAL '2 years'
    AND report_type != 'yearly';
  
  -- Anonimizar dados de usuários excluídos há mais de 30 dias
  UPDATE users SET
    name = 'Usuário Excluído',
    email = 'deleted_' || id || '@example.com',
    phone = NULL
  WHERE updated_at < CURRENT_DATE - INTERVAL '30 days'
    AND name = 'Usuário Excluído'; -- Já processados
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Criar índices compostos para consultas complexas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_user_date_type 
ON transactions (user_id, date, type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_category_date 
ON transactions (category_id, date) WHERE category_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_financial_alerts_user_type_read 
ON financial_alerts (user_id, alert_type, is_read);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_budgets_user_period 
ON budgets (user_id, start_date, end_date) WHERE is_active = true;