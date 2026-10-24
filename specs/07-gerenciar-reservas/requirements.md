# Requirements — Gerenciar Reservas

## Objetivo

Ajustar o módulo de reservas para facilitar a seleção de ativos, impedir conflitos de horários e separar as funcionalidades de criação e visualização.

## Contexto

O módulo deve permitir que usuários autenticados e ativos:

- Realizem reservas;
- Visualizem reservas;
- Selecionem ativos por tipo;
- Consultem os tempos disponíveis para um ativo em determinada data.

Na parte superior da tela, o usuário deve poder alternar entre:

- **Fazer reserva**;
- **Visualizar reservas**.

## Dados da reserva

Cada reserva deve possuir:

- Usuário responsável;
- Ativo;
- Data;
- Um ou mais tempos;
- Finalidade;
- Observações opcionais;
- Situação;
- Data de criação.

## Requisitos funcionais

### RF01 — Controlar o acesso

O sistema deve permitir o acesso ao módulo de reservas somente para usuários:

- Autenticados;
- Com situação `ativo`.

### RF02 — Exibir modos de utilização

A parte superior da tela deve possuir as opções:

- **Fazer reserva**;
- **Visualizar reservas**.

A troca entre as opções deve ocorrer sem recarregar toda a página.

### RF03 — Selecionar data

Para realizar uma reserva, o usuário deve selecionar uma data.

### RF04 — Impedir datas anteriores

O sistema não deve permitir reservas em datas anteriores à data atual.

A validação deve ser realizada no frontend e no backend.

### RF05 — Organizar ativos por tipo

Na criação da reserva, os ativos devem ser organizados pelo tipo ao qual pertencem.

A organização pode utilizar abas.

> **Exemplo:**
>
> - Laboratórios;
> - Projetores;
> - Caixas de som.

### RF06 — Selecionar ativo

Após selecionar o tipo, o sistema deve apresentar os ativos relacionados.

O usuário deve selecionar um ativo antes de escolher os tempos.

### RF07 — Carregar tempos disponíveis

Após a seleção da data e do ativo, o sistema deve consultar os tempos disponíveis.

### RF08 — Ocultar tempos indisponíveis na reserva

Na opção **Fazer reserva**, o sistema deve apresentar somente os tempos disponíveis para o ativo e a data selecionados.

Um tempo deve ser considerado indisponível quando existir uma reserva válida para o mesmo ativo, data e tempo.

### RF09 — Atualizar os tempos

O sistema deve atualizar os tempos disponíveis sempre que o usuário alterar:

- A data;
- O tipo de ativo;
- O ativo.

### RF10 — Selecionar tempos

O usuário deve poder selecionar um ou mais tempos disponíveis para a mesma data e o mesmo ativo.

### RF11 — Posicionar o botão de reserva

O botão **Reservar** deve ficar logo abaixo da seleção do ativo e dos tempos.

### RF12 — Validar novamente a disponibilidade

Antes de salvar, o sistema deve verificar novamente se todos os tempos selecionados continuam disponíveis.

### RF13 — Impedir conflitos

O sistema não deve permitir duas reservas válidas para o mesmo ativo, data e tempo.

### RF14 — Registrar a reserva

Após validar os dados, o sistema deve registrar a reserva vinculada ao usuário autenticado.

### RF15 — Confirmar a reserva

Após o cadastro, o sistema deve apresentar uma mensagem de confirmação e atualizar os tempos disponíveis.

### RF16 — Visualizar reservas por tipo

Na opção **Visualizar reservas**, o sistema deve apresentar abas com os tipos de ativos.

### RF17 — Selecionar ativo na visualização

Após selecionar um tipo, o sistema deve permitir que o usuário escolha um ativo específico.

### RF18 — Visualizar agenda do ativo

Após a seleção do ativo e da data, o sistema deve apresentar todos os tempos e suas situações:

- Livre;
- Reservado;
- Pendente;
- Indisponível.

### RF19 — Exibir detalhes da reserva

Para os tempos reservados, o sistema deve apresentar:

- Responsável;
- Horário inicial e final;
- Finalidade;
- Situação.

A identificação do responsável deve respeitar as permissões definidas pelo sistema.

### RF20 — Atualizar a visualização

A agenda deve ser atualizada quando uma reserva for criada, editada, cancelada ou excluída.

## Fluxo para fazer uma reserva

1. O usuário acessa o módulo **Reservas**.
2. O usuário seleciona **Fazer reserva**.
3. O sistema apresenta a seleção de data.
4. O usuário seleciona uma data igual ou posterior à data atual.
5. O sistema apresenta as abas dos tipos de ativos.
6. O usuário seleciona um tipo.
7. O sistema apresenta os ativos relacionados.
8. O usuário seleciona um ativo.
9. O sistema consulta os tempos disponíveis.
10. O usuário seleciona um ou mais tempos.
11. O usuário informa a finalidade e as observações, quando necessário.
12. O usuário seleciona **Reservar**.
13. O sistema verifica novamente a disponibilidade.
14. O sistema registra a reserva.
15. O sistema apresenta uma mensagem de confirmação.
16. O sistema atualiza os tempos disponíveis.

## Fluxo para visualizar reservas

1. O usuário acessa o módulo **Reservas**.
2. O usuário seleciona **Visualizar reservas**.
3. O sistema apresenta a data atual.
4. O sistema apresenta as abas dos tipos de ativos.
5. O usuário seleciona um tipo.
6. O sistema apresenta os ativos vinculados.
7. O usuário seleciona um ativo.
8. O sistema apresenta todos os tempos do ativo na data escolhida.
9. O usuário visualiza os horários livres, reservados, pendentes ou indisponíveis.
10. O usuário pode selecionar uma reserva para visualizar os detalhes.

## Fluxos alternativos

### Data anterior à atual

1. O usuário seleciona uma data anterior à atual.
2. O sistema não permite continuar.
3. O sistema informa: **“Não é possível realizar reservas em datas anteriores à data atual.”**

### Tipo sem ativos

1. O usuário seleciona um tipo.
2. O sistema identifica que não existem ativos cadastrados.
3. O sistema informa: **“Não existem ativos disponíveis para este tipo.”**

### Ativo sem tempos disponíveis

1. O usuário seleciona uma data e um ativo.
2. O sistema identifica que todos os tempos estão ocupados.
3. O sistema informa: **“Não existem horários disponíveis para este ativo na data selecionada.”**
4. O botão **Reservar** permanece desabilitado.

### Horário ocupado durante a confirmação

1. O usuário seleciona um tempo disponível.
2. Antes da confirmação, outro usuário reserva o mesmo tempo.
3. O sistema identifica o conflito.
4. O sistema não registra a reserva.
5. O sistema informa: **“Um ou mais horários selecionados não estão mais disponíveis.”**
6. O sistema atualiza a lista de tempos.

### Nenhum tempo selecionado

1. O usuário seleciona um ativo, mas não escolhe nenhum tempo.
2. O botão **Reservar** permanece desabilitado.
3. O sistema informa que pelo menos um tempo deve ser selecionado.

## Regras de negócio

- Apenas usuários autenticados e ativos podem realizar reservas.
- A data da reserva deve ser igual ou posterior à data atual.
- Todo ativo deve pertencer a um tipo.
- A seleção do tipo deve ocorrer antes da seleção do ativo.
- A seleção do ativo deve ocorrer antes da seleção dos tempos.
- Na criação da reserva, somente tempos disponíveis devem ser apresentados.
- Na visualização da agenda, todos os tempos devem ser apresentados com suas situações.
- Uma reserva deve possuir pelo menos um tempo.
- Todos os tempos selecionados devem pertencer à mesma data e ao mesmo ativo.
- Reservas ativas ou pendentes devem tornar o tempo indisponível.
- Reservas canceladas, rejeitadas ou excluídas não devem bloquear o tempo.
- A disponibilidade deve ser verificada novamente no backend antes do cadastro.
- O banco de dados deve impedir conflitos causados por solicitações simultâneas.
- O botão **Reservar** deve permanecer desabilitado enquanto os dados obrigatórios não forem preenchidos.
- A data atual deve considerar o fuso horário configurado para o sistema.

## Requisitos de interface

- As opções **Fazer reserva** e **Visualizar reservas** devem ficar na parte superior.
- A opção ativa deve possuir destaque visual.
- Os tipos de ativos devem ser apresentados em abas.
- A aba selecionada deve possuir destaque visual.
- Os ativos devem ser apresentados após a seleção do tipo.
- Os tempos devem ser apresentados após a seleção do ativo e da data.
- O botão **Reservar** deve ficar logo abaixo da seleção de ativos e tempos.
- Os tempos selecionados devem possuir destaque visual.
- O sistema deve apresentar um estado de carregamento ao consultar a disponibilidade.
- A tela deve manter as cores e a tipografia dos demais módulos.
- A interface deve utilizar a abordagem Mobile First.

## Responsividade

- A tela deve adaptar-se a celulares, tablets e computadores.
- As abas devem permitir rolagem horizontal em telas pequenas.
- Os ativos devem ser apresentados de forma adequada para interação por toque.
- Os tempos devem adaptar-se à largura da tela.
- O botão **Reservar** deve permanecer visível e acessível no mobile.
- Os detalhes da reserva devem adaptar-se à altura e à largura disponíveis.
- Nenhum conteúdo deve ultrapassar os limites da tela.

## Critérios de aceite

- [X] Apenas usuários autenticados e ativos acessam o módulo.
- [X] O usuário pode alternar entre **Fazer reserva** e **Visualizar reservas**.
- [X] O sistema impede reservas em datas anteriores à atual.
- [X] Os tipos de ativos são apresentados em abas.
- [X] Os ativos são apresentados de acordo com o tipo selecionado.
- [X] O usuário consegue selecionar um ativo específico.
- [X] Na criação da reserva, somente tempos disponíveis são apresentados.
- [X] Um tempo reservado ou pendente não aparece como disponível.
- [X] O usuário pode selecionar um ou mais tempos.
- [X] O botão **Reservar** fica abaixo da seleção do ativo e dos tempos.
- [X] O sistema verifica novamente a disponibilidade antes de salvar.
- [X] O sistema impede duas reservas para o mesmo ativo, data e tempo.
- [X] A visualização apresenta todos os tempos e suas situações.
- [X] Os detalhes mostram o responsável, o horário, a finalidade e a situação.
- [X] A agenda é atualizada após alterações nas reservas.
- [X] A interface funciona em mobile, tablet e desktop.

## Fora do escopo

- Reservas recorrentes;
- Lista de espera;
- Cobrança pela utilização de ativos;
- Sincronização com calendários externos;
- Notificações por e-mail ou SMS;
- Reserva de mais de um ativo na mesma solicitação.