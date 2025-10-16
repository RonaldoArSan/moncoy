# Lista de Verificação de Testes - Funcionalidade de Compromissos

Use esta lista para verificar que todas as funcionalidades estão funcionando corretamente após o deploy.

## Pré-requisitos

- [ ] Migração do banco de dados aplicada (ver `MIGRATION_GUIDE.md`)
- [ ] Código atualizado e deployed
- [ ] Aplicação rodando (dev ou produção)
- [ ] Usuário autenticado no sistema

## Testes de Banco de Dados

### 1. Verificar Tabela
```sql
-- Execute no SQL Editor do Supabase
SELECT * FROM information_schema.tables WHERE table_name = 'commitments';
```
- [ ] Tabela `commitments` existe

### 2. Verificar RLS
```sql
-- Verificar políticas de segurança
SELECT * FROM pg_policies WHERE tablename = 'commitments';
```
- [ ] Política RLS existe e está ativa

### 3. Verificar Índices
```sql
-- Verificar índices
SELECT * FROM pg_indexes WHERE tablename = 'commitments';
```
- [ ] Índices criados (user_id, date, status)

## Testes de Interface - Página Agenda

### Navegação
- [ ] Acessar a página `/agenda` no navegador
- [ ] Página carrega sem erros
- [ ] Calendário é exibido
- [ ] Botão "Novo Evento" está visível no cabeçalho

### Criação de Compromissos

#### Teste 1: Criar compromisso básico
1. [ ] Clicar no botão "Novo Evento"
2. [ ] Modal "Criar Novo Compromisso" abre
3. [ ] Preencher:
   - Título: "Teste de Compromisso"
   - Data: Selecionar data futura
4. [ ] Clicar em "Criar Compromisso"
5. [ ] Modal fecha
6. [ ] Compromisso aparece no calendário (evento azul)
7. [ ] Console não mostra erros

#### Teste 2: Criar compromisso completo
1. [ ] Clicar no botão "Novo Evento"
2. [ ] Preencher todos os campos:
   - Título: "Reunião Importante"
   - Descrição: "Discutir projeto X"
   - Data: Hoje
   - Horário: 14:00
   - Local: "Escritório Central"
3. [ ] Clicar em "Criar Compromisso"
4. [ ] Compromisso criado com sucesso
5. [ ] Todos os dados salvos corretamente

#### Teste 3: Validação de campos obrigatórios
1. [ ] Abrir modal de criação
2. [ ] Deixar título vazio
3. [ ] Botão "Criar Compromisso" está desabilitado
4. [ ] Preencher título
5. [ ] Deixar data vazia
6. [ ] Botão "Criar Compromisso" está desabilitado
7. [ ] Preencher data
8. [ ] Botão "Criar Compromisso" está habilitado

#### Teste 4: Cancelar criação
1. [ ] Abrir modal de criação
2. [ ] Preencher alguns campos
3. [ ] Clicar em "Cancelar"
4. [ ] Modal fecha
5. [ ] Nenhum compromisso criado
6. [ ] Abrir modal novamente
7. [ ] Campos estão vazios (limpos)

### Visualização de Compromissos

#### Teste 5: Visualizar dia sem compromissos
1. [ ] Clicar em data sem compromissos
2. [ ] Modal de visualização abre
3. [ ] Mensagem "Nenhum compromisso para esta data" exibida
4. [ ] Ícone de calendário aparece
5. [ ] Botão "Adicionar Compromisso" está disponível

#### Teste 6: Visualizar dia com compromissos
1. [ ] Criar pelo menos 2 compromissos na mesma data
2. [ ] Clicar na data com compromissos
3. [ ] Modal abre mostrando "X compromissos neste dia"
4. [ ] Lista de compromissos é exibida
5. [ ] Cada compromisso mostra:
   - [ ] Título
   - [ ] Descrição (se houver)
   - [ ] Badge de status
   - [ ] Horário (se houver) com ícone de relógio
   - [ ] Local (se houver) com ícone de pin
   - [ ] Botões de ação

#### Teste 7: Clicar em evento no calendário
1. [ ] Clicar diretamente em um evento de compromisso (azul)
2. [ ] Modal de visualização abre
3. [ ] Compromisso correspondente é exibido

### Edição de Status

#### Teste 8: Marcar como concluído
1. [ ] Abrir modal com compromisso pendente
2. [ ] Clicar em "Marcar como Concluído"
3. [ ] Badge muda para "Concluído" (visual padrão/verde)
4. [ ] Botão muda para "Marcar como Pendente"
5. [ ] Atualização é instantânea (sem reload)

#### Teste 9: Marcar como pendente
1. [ ] Abrir modal com compromisso concluído
2. [ ] Clicar em "Marcar como Pendente"
3. [ ] Badge muda para "Pendente" (cinza)
4. [ ] Botão muda para "Marcar como Concluído"

### Exclusão de Compromissos

#### Teste 10: Excluir com confirmação
1. [ ] Abrir modal com compromisso
2. [ ] Clicar em "Excluir" (botão vermelho)
3. [ ] Alert de confirmação aparece
4. [ ] Clicar em "OK" para confirmar
5. [ ] Compromisso é removido da lista
6. [ ] Evento desaparece do calendário

#### Teste 11: Cancelar exclusão
1. [ ] Abrir modal com compromisso
2. [ ] Clicar em "Excluir"
3. [ ] Alert de confirmação aparece
4. [ ] Clicar em "Cancelar"
5. [ ] Compromisso permanece na lista

### Adicionar Compromisso da Data

#### Teste 12: Adicionar da visualização
1. [ ] Abrir modal de visualização (qualquer data)
2. [ ] Clicar em "Adicionar Compromisso"
3. [ ] Modal de visualização fecha
4. [ ] Modal de criação abre
5. [ ] Campo de data já está preenchido com a data selecionada
6. [ ] Criar compromisso
7. [ ] Compromisso aparece na data correta

## Testes de Integração

### Teste 13: Múltiplos tipos de eventos
1. [ ] Criar uma transação (receita ou despesa)
2. [ ] Criar uma transação recorrente
3. [ ] Criar um compromisso
4. [ ] Todos aparecem no calendário com cores diferentes:
   - Verde: Receita
   - Vermelho: Despesa
   - Amarelo: Recorrente
   - Azul: Compromisso

### Teste 14: Navegação no calendário
1. [ ] Criar compromissos em diferentes meses
2. [ ] Navegar para mês anterior/próximo
3. [ ] Compromissos aparecem nas datas corretas
4. [ ] Clicar em diferentes datas mostra compromissos corretos

### Teste 15: Múltiplos compromissos no mesmo dia
1. [ ] Criar 5+ compromissos na mesma data
2. [ ] Abrir modal de visualização
3. [ ] Lista é rolável (scroll)
4. [ ] Todos os compromissos são exibidos
5. [ ] Performance é boa (sem lag)

## Testes de Segurança

### Teste 16: Isolamento de usuários
1. [ ] Criar compromisso com Usuário A
2. [ ] Fazer logout
3. [ ] Login com Usuário B
4. [ ] Acessar página agenda
5. [ ] Compromisso do Usuário A não é visível
6. [ ] Usuário B só vê seus próprios compromissos

### Teste 17: RLS Enforcement
```sql
-- Execute como admin no Supabase SQL Editor
-- Tentar acessar compromissos de outro usuário diretamente
SELECT * FROM commitments WHERE user_id != auth.uid();
```
- [ ] Query retorna vazio ou erro de permissão

## Testes de Responsividade

### Teste 18: Mobile
1. [ ] Abrir em dispositivo móvel ou emular (DevTools)
2. [ ] Página agenda é responsiva
3. [ ] Botão "Novo Evento" está acessível
4. [ ] Modais se ajustam à tela
5. [ ] Campos são utilizáveis no touch
6. [ ] Calendário funciona corretamente

### Teste 19: Tablet
1. [ ] Testar em resolução de tablet (768px)
2. [ ] Layout se adapta
3. [ ] Todos os elementos são clicáveis

### Teste 20: Desktop
1. [ ] Testar em desktop (1920px)
2. [ ] Modais têm largura máxima apropriada
3. [ ] Calendário usa espaço disponível

## Testes de Performance

### Teste 21: Carregamento inicial
1. [ ] Abrir página agenda
2. [ ] Medir tempo de carregamento
3. [ ] Loading state é exibido brevemente
4. [ ] Dados carregam sem bloqueios

### Teste 22: Muitos compromissos
1. [ ] Criar 50+ compromissos
2. [ ] Página ainda carrega rapidamente
3. [ ] Calendário renderiza sem lag
4. [ ] Scroll é suave

## Testes de Erro

### Teste 23: Erro de rede (simulado)
1. [ ] Abrir DevTools
2. [ ] Ir para Network tab
3. [ ] Selecionar "Offline"
4. [ ] Tentar criar compromisso
5. [ ] Erro é logado no console
6. [ ] Aplicação não trava

### Teste 24: Dados inválidos
1. [ ] Tentar inserir data inválida (se possível)
2. [ ] Aplicação lida graciosamente

## Testes de Usabilidade

### Teste 25: Fluxo completo do usuário
1. [ ] Novo usuário acessa agenda
2. [ ] Cria primeiro compromisso
3. [ ] Visualiza compromisso
4. [ ] Edita status
5. [ ] Cria outro compromisso
6. [ ] Navega entre meses
7. [ ] Exclui compromisso
- [ ] Fluxo é intuitivo e sem fricções

## Testes de Acessibilidade

### Teste 26: Navegação por teclado
1. [ ] Usar Tab para navegar entre elementos
2. [ ] Botões são focáveis
3. [ ] Enter abre modais
4. [ ] ESC fecha modais

### Teste 27: Screen reader (opcional)
1. [ ] Usar screen reader (NVDA/JAWS)
2. [ ] Labels são lidos corretamente
3. [ ] Ações são anunciadas

## Checklist de Deploy

- [ ] Todos os testes acima passaram
- [ ] Console do navegador não mostra erros críticos
- [ ] Performance é aceitável
- [ ] Mobile funciona corretamente
- [ ] RLS está protegendo dados
- [ ] Backup do banco antes de deploy em produção
- [ ] Migração aplicada em produção
- [ ] Código deployed
- [ ] Monitoring configurado (opcional)

## Problemas Encontrados

Liste aqui qualquer problema encontrado durante os testes:

1. ________________________________________________
   Status: [ ] Resolvido [ ] Pendente

2. ________________________________________________
   Status: [ ] Resolvido [ ] Pendente

3. ________________________________________________
   Status: [ ] Resolvido [ ] Pendente

## Notas Adicionais

_Use este espaço para anotações durante os testes_

---

## Resultado Final

Data do teste: _______________
Testador: _______________

- Total de testes: 27
- Testes passados: ___/27
- Testes falhos: ___/27
- Status: [ ] Aprovado [ ] Reprovado [ ] Parcial

---

## Suporte

Se encontrar problemas:
1. Verifique o console do navegador para erros
2. Verifique logs do Supabase
3. Revise `MIGRATION_GUIDE.md` para instruções de migração
4. Revise `IMPLEMENTATION_SUMMARY.md` para detalhes técnicos
5. Revise `UI_CHANGES.md` para entender o comportamento esperado

## Rollback (se necessário)

Se precisar reverter:
```sql
DROP TABLE IF EXISTS commitments CASCADE;
```

**Atenção:** Isso deletará todos os dados de compromissos permanentemente.
