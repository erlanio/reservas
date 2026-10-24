# Tasks — Dashboard Inicial

## 1. Estrutura do dashboard

- [x] Criar a área de reservas do dia na tela inicial.
- [x] Definir a data atual como padrão.
- [x] Criar o seletor de data.
- [x] Criar o filtro por tipo de ativo.
- [x] Criar o seletor de ativo específico.
- [x] Priorizar visualmente a consulta das reservas.
- [x] Exibir a reserva rápida como ação secundária.

## 2. Banco de dados

- [x] Verificar as tabelas de usuários, tipos de ativos, ativos e reservas.
- [x] Criar ou ajustar o relacionamento entre tipo de ativo e ativo.
- [x] Garantir que cada reserva esteja vinculada a um usuário e a um ativo.
- [x] Manter finalidade, observações e situação fora desta etapa por decisão do usuário.
- [x] Criar índices para consultas por data e ativo.

## 3. Backend

- [x] Criar uma rota para listar as reservas por data.
- [x] Criar uma rota para listar os tipos de ativos.
- [x] Criar uma rota para listar os ativos de um tipo.
- [x] Criar uma rota para consultar a agenda diária de um ativo.
- [x] Criar uma rota para consultar os detalhes de uma reserva.
- [x] Criar uma rota para realizar uma reserva rápida.
- [x] Verificar conflitos de horários antes de salvar uma reserva.
- [x] Impedir reservas em horários passados.
- [x] Manter ativos inativos, bloqueados ou em manutenção fora desta etapa porque o cadastro atual nao possui esses estados.
- [x] Aplicar as permissões dos usuários master e normal.

## 4. Visualização das reservas

- [x] Exibir todos os horários de funcionamento do ativo selecionado.
- [x] Identificar os horários como livre, reservado ou passado.
- [x] Exibir o responsável nos horários reservados, conforme as permissões.
- [x] Criar uma legenda para as situações dos horários.
- [x] Exibir uma mensagem quando não houver reservas no dia.
- [x] Permitir a consulta dos detalhes de uma reserva.

## 5. Reserva rápida

- [x] Permitir a seleção de um horário livre.
- [x] Abrir um formulário simplificado no dashboard.
- [x] Preencher automaticamente a data, o ativo, o usuário e o horário.
- [x] Manter finalidade fora desta etapa por decisão do usuário.
- [x] Validar novamente a disponibilidade antes da confirmação.
- [x] Informar quando o horário não estiver mais disponível.
- [x] Registrar reserva diretamente, sem situação pendente nesta etapa.
- [x] Exibir uma mensagem após a reserva ser realizada.

## 6. Atualização dinâmica

- [x] Atualizar a agenda ao trocar a data.
- [x] Atualizar os ativos ao trocar o tipo de ativo.
- [x] Atualizar a linha do tempo ao selecionar um ativo.
- [x] Atualizar a agenda após cadastrar uma reserva rápida.
- [x] Manter os filtros selecionados após as atualizações.
- [x] Evitar o recarregamento completo da página.

## 7. Responsividade

- [x] Desenvolver a interface com abordagem Mobile First.
- [x] Adaptar os filtros para mobile, tablet e desktop.
- [x] Adaptar a linha do tempo para telas pequenas.
- [x] Garantir que botões e campos sejam adequados para toque.
- [x] Tornar o menu lateral recolhível no mobile.
- [x] Evitar cortes ou perda de informações em diferentes resoluções.

## 8. Testes

- [x] Testar a visualização das reservas do dia.
- [x] Testar a seleção de diferentes datas.
- [x] Testar o filtro por tipo de ativo.
- [x] Testar a seleção de um ativo específico.
- [x] Testar a exibição de horários livres e reservados.
- [x] Testar a visualização do responsável pela reserva.
- [x] Testar a criação de uma reserva rápida.
- [x] Testar conflitos de horário.
- [x] Manter testes de ativos bloqueados, inativos ou em manutenção fora desta etapa porque o cadastro atual nao possui esses estados.
- [x] Testar as permissões dos usuários master e normal.
- [x] Testar a interface em mobile, tablet e desktop por revisão responsiva de CSS.

## 9. Critérios para conclusão

- [x] O dashboard apresenta as reservas do dia após o login.
- [x] O usuário consegue filtrar por tipo de ativo e selecionar um ativo.
- [x] Todos os horários do ativo são exibidos com suas situações.
- [x] O responsável pela reserva é apresentado quando permitido.
- [x] A reserva rápida funciona sem acessar o menu Reservas.
- [x] A visualização continua sendo o elemento principal da tela.
- [x] A interface funciona corretamente em diferentes tamanhos de tela.
