# Página de Conselhos de IA (AI Advice)

## 📋 Visão Geral

A página de **AI Advice** fornece conselhos financeiros personalizados baseados na análise das transações do usuário. Utiliza o hook `useAIAdvice` para gerar insights inteligentes sobre padrões de gastos, tendências e oportunidades de economia.

## 🎯 Funcionalidades Implementadas

### ✨ **Componentes Principais:**

1. **Página Principal** (`/app/ai-advice/page.tsx`)
   - Interface responsiva e moderna
   - Estados de loading com skeletons
   - Controle de acesso por plano de usuário
   - Filtros interativos
   - Refresh manual dos conselhos

2. **Componente de Estatísticas** (`/components/ai-stats.tsx`)
   - Métricas resumidas dos conselhos
   - Contadores por prioridade
   - Cálculo de economia potencial total
   - Cards visuais informativos

3. **Componente de Filtros** (`/components/ai-filters.tsx`)
   - Filtro por categoria (Alerta, Economia, Investimentos, Planejamento)
   - Filtro por prioridade (Alta, Média, Baixa)
   - Limpeza de filtros
   - Interface intuitiva com ícones

4. **Componente de Resumo** (`/components/ai-summary.tsx`)
   - Score de saúde financeira (0-100%)
   - Métricas chave consolidadas
   - Alertas de prioridade alta
   - Mensagens motivacionais

### 🎨 **Design e UX:**

#### **Código de Cores por Prioridade:**
- 🔴 **Alta**: Vermelho (destructive) - Ações urgentes necessárias
- 🟡 **Média**: Azul (default) - Melhorias recomendadas  
- 🟢 **Baixa**: Cinza (secondary) - Otimizações sugeridas

#### **Ícones por Categoria:**
- ⚠️ **Alerta**: AlertTriangle (Vermelho)
- 💰 **Economia**: PiggyBank (Verde)
- 📈 **Investimentos**: TrendingUp (Azul)
- 📊 **Planejamento**: BarChart3 (Roxo)

#### **Estados da Interface:**
- **Loading**: Skeletons animados durante análise
- **Sem dados**: Mensagem motivacional para continuar registrando
- **Sem resultados de filtro**: Sugestão para ajustar filtros
- **Upgrade necessário**: Call-to-action para planos superiores

### 🧠 **Lógica de Conselhos (useAIAdvice):**

#### **Tipos de Análises:**
1. **Saldo Negativo**: Alerta de alta prioridade quando gastos > receitas
2. **Categoria de Alto Gasto**: Quando uma categoria representa >40% do orçamento
3. **Tendência de Aumento**: Quando gastos aumentam >15% mês a mês
4. **Oportunidade de Investimento**: Para saldos positivos consistentes
5. **Gasto Diário Elevado**: Quando média diária >R$200
6. **Conselho Padrão**: Motivação para continuar registrando transações

#### **Score de Saúde Financeira:**
```typescript
healthScore = Math.max(0, 100 - (contadorPrioridadeAlta * 25))
```
- **80-100%**: Excelente 🟢
- **60-79%**: Bom 🔵  
- **40-59%**: Atenção 🟡
- **0-39%**: Crítico 🔴

### 🔐 **Controle de Acesso:**

- **Plano Básico**: Tela de upgrade com call-to-action
- **Plano Pro/Premium**: Acesso completo às funcionalidades
- Verificação via contexto `useUserPlan`

### 📱 **Responsividade:**

- **Desktop**: Grid 2 colunas para conselhos, layout completo
- **Mobile**: Layout empilhado, filtros otimizados
- **Tablets**: Adaptação automática com breakpoints

## 🛠️ **Tecnologias Utilizadas:**

- **React 18** com hooks modernos
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Radix UI** para componentes base
- **Contextos** para gerenciamento de estado

## 🚀 **Como Usar:**

1. **Navegue** para `/ai-advice`
2. **Aguarde** a análise automática das transações
3. **Visualize** os conselhos organizados por prioridade
4. **Filtre** por categoria ou prioridade conforme necessário
5. **Implemente** as sugestões para melhorar sua saúde financeira
6. **Atualize** periodicamente para novos insights

## 🔄 **Fluxo de Dados:**

```
Transações → useAIAdvice → Análise → Conselhos → Filtros → Exibição
     ↓
useReports → KPIs → Algoritmos → Priorização → Interface
```

## 📈 **Métricas Monitoradas:**

- Total de conselhos gerados
- Distribuição por prioridade
- Economia potencial calculada
- Score de saúde financeira
- Categorias de foco principais

---

**Desenvolvido com foco na experiência do usuário e insights acionáveis para melhoria da saúde financeira.**