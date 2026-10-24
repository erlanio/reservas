# Requirements - Gerenciar reservas


## Objetivo

Permitir que o usuário visualize as reservas e a disponibilidade dos ativos diretamente na tela inicial do dashboard. A visualização deve ser a função principal, enquanto a reserva rápida deve ser uma ação secundária.

## Conceitos

- **Tipo de ativo:** categoria à qual o recurso pertence. Exemplo: Laboratórios.
- **Ativo:** recurso específico que pode ser reservado. Exemplo: Laboratório 1.

## Caso de uso 1 — Visualizar reservas do dia

Como usuário, quero visualizar as reservas do dia na tela inicial para acompanhar rapidamente a utilização dos ativos.

### Critérios de aceitação

- O dashboard deve exibir inicialmente as reservas do dia atual.
- Cada reserva deve apresentar o temmpo, o ativo e o responsável.
- Se não houver reservas, o sistema deve informar que não existem reservas para o dia.
- O usuário deve poder selecionar outra data.

## Caso de uso 2 — Filtrar por tipo de ativo

Como usuário, quero selecionar um tipo de ativo para visualizar apenas os recursos pertencentes à categoria escolhida.

### Critérios de aceitação

- O sistema deve listar os tipos de ativos cadastrados.
- Ao selecionar um tipo, o sistema deve apresentar apenas os ativos vinculados a ele.
- Exemplo: ao selecionar **Laboratórios**, devem ser exibidos **Laboratório 1**, **Laboratório 2** e os demais laboratórios cadastrados.

## Caso de uso 3 — Selecionar um ativo

Como usuário, quero selecionar um ativo específico para visualizar sua agenda e disponibilidade.

### Critérios de aceitação

- O sistema deve permitir a seleção de um ativo após a escolha do tipo.
- O sistema deve exibir todos os horários de funcionamento do ativo.
- Cada horário deve indicar uma das seguintes situações:
  - Livre;
  - Reservado;
- Nos horários reservados, o sistema deve mostrar o responsável, conforme a permissão do usuário.

## Caso de uso 4 — Visualizar a linha do tempo

Como usuário, quero visualizar uma linha do tempo do ativo para identificar rapidamente os horários livres e reservados.

### Critérios de aceitação

- A linha do tempo deve apresentar todos os horários do ativo no dia selecionado.
- Os estados devem possuir identificação visual diferente.
- O usuário deve poder selecionar um horário reservado para visualizar seus detalhes.
- A troca de data, tipo ou ativo deve atualizar a agenda sem recarregar toda a página.
- Horários passados devem ser identificados e não devem permitir novas reservas.

## Caso de uso 5 — Fazer reserva rápida

Como usuário, quero reservar um horário livre diretamente no dashboard para não precisar acessar a página de reservas.

### Critérios de aceitação

- A opção de reserva rápida deve aparecer somente em horários livres.
- Ao selecionar um horário livre, o sistema deve abrir um formulário simplificado.
- O formulário deve preencher automaticamente a data, o ativo, o usuário e o horário selecionado.
- O usuário deve informar a finalidade da reserva e os demais campos obrigatórios.
- Antes da confirmação, o sistema deve verificar novamente a disponibilidade.
- Após a confirmação, a agenda deve ser atualizada automaticamente.
- Caso o horário tenha sido ocupado, o sistema deve informar o conflito e não concluir a reserva.


## Regras de negócio

- A visualização das reservas deve ter prioridade na tela inicial.
- A reserva rápida deve ser apresentada como uma ação secundária.
- Todo ativo deve pertencer a um tipo de ativo.
- Um ativo não pode possuir duas reservas no mesmo período.
- Ativos inativos, bloqueados ou em manutenção não podem ser reservados.
- A identificação do responsável deve respeitar as permissões do usuário.
- Alterações, cancelamentos e novas reservas devem atualizar a agenda automaticamente.
- Os filtros e o ativo selecionado devem ser mantidos após a atualização da agenda.

## Fluxo principal

1. O usuário acessa o dashboard.
2. O sistema apresenta as reservas do dia atual.
3. O usuário seleciona uma data.
4. O usuário seleciona um tipo de ativo.
5. O usuário seleciona um ativo específico.
6. O sistema apresenta a linha do tempo do ativo.
7. O usuário consulta os detalhes de uma reserva ou seleciona um horário livre.
8. Se selecionar um horário livre, o usuário pode realizar uma reserva rápida.

## Prioridade

1. Visualização das reservas do dia.
2. Filtro por tipo de ativo.
3. Seleção do ativo.
4. Visualização completa da disponibilidade.
5. Consulta do responsável pela reserva.
6. Reserva rápida.


## Fora do Escopo / decisões negociadas


## Critérios de Aceite
- [X] Usuários poderão visualizar as reservas realizadas de um ativo na tela de início.
- [X] Usuários poderão fazer reservas de forma rápida e dinâmica diretamente da tela de inicio.
- [X] A interface deve ser responsiva, dinâmica e moderna.




