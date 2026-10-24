# Design — Gerenciar Reservas

## Visão geral da solução

O módulo permitirá que usuários normais e master realizem, visualizem, editem e cancelem reservas de ativos.

A implementação deve seguir os requisitos definidos em:

`08-gerenciar-reservas/requirements.md`

## Controle de acesso

O item **Reservas** deve ser apresentado no menu lateral para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível `normal` ou `master`.

As permissões devem ser verificadas no frontend e no backend.

## Permissões

### Usuário normal

- Realizar reservas em seu próprio nome;
- Visualizar suas reservas;
- Editar suas reservas, conforme as regras do sistema;
- Cancelar suas reservas.

### Usuário master

- Possuir todas as permissões do usuário normal;
- Realizar reservas para outros usuários ativos;
- Visualizar as reservas de todos os usuários;
- Editar reservas;
- Cancelar reservas.

## Estrutura do menu

O menu lateral deve possuir o item **Reservas**, com um ícone relacionado a calendário ou agendamento.

O item deve direcionar para a tela de gerenciamento de reservas.

## Estrutura da tela

Na parte superior, a tela deve possuir as opções:

- **Fazer reserva**;
- **Visualizar reservas**.

A opção selecionada deve possuir destaque visual.

A troca entre as opções deve ocorrer sem recarregar toda a página.

## Dados da reserva

Cada reserva deve possuir:

- Usuário responsável;
- Ativo;
- Tipo do ativo;
- Data;
- Tempo;
- Horário inicial;
- Horário final;
- Finalidade;
- Observações opcionais;
- Situação;
- Data de criação;
- Usuário que realizou o cancelamento, quando aplicável;
- Data do cancelamento, quando aplicável;
- Motivo do cancelamento, quando aplicável.

## Tela para fazer reserva

A tela deve apresentar os componentes nesta ordem:

1. Seleção do usuário, somente para usuários master;
2. Seleção da data;
3. Abas dos tipos de ativos;
4. Seleção dos ativos;
5. Seleção dos tempos disponíveis;
6. Campo de finalidade;
7. Campo de observações;
8. Botão **Reservar**.

O botão **Reservar** deve ficar logo abaixo da seleção dos ativos e tempos.

## Seleção de tipos e ativos

Os tipos de ativos devem ser apresentados em abas.

Ao selecionar uma aba, o sistema deve apresentar somente os ativos pertencentes ao tipo escolhido.

O sistema deve permitir a seleção de um ou mais ativos.

Ativos inativos, excluídos ou em manutenção não devem ser apresentados como disponíveis.

## Seleção de tempos

Após selecionar a data e os ativos, o sistema deve consultar os tempos disponíveis.

O sistema deve permitir a seleção de um ou mais tempos.

Na criação da reserva, somente tempos disponíveis para todos os ativos selecionados devem ser apresentados.

Um tempo deve ser considerado indisponível quando existir uma reserva `ativa` ou `pendente` para o mesmo ativo, data e tempo.

## Combinações de reservas

Quando o usuário selecionar múltiplos ativos e tempos, o sistema deverá criar uma reserva individual para cada combinação.

> **Exemplo:**
>
> Ativos selecionados:
>
> - Projetor 1;
> - Projetor 2.
>
> Tempos selecionados:
>
> - 1º tempo;
> - 2º tempo.
>
> Reservas criadas:
>
> - Projetor 1 + 1º tempo;
> - Projetor 1 + 2º tempo;
> - Projetor 2 + 1º tempo;
> - Projetor 2 + 2º tempo.

Todas as combinações devem ser salvas em uma única transação.

Se uma combinação possuir conflito, nenhuma reserva da solicitação deve ser cadastrada.

## Fluxo de cadastro

1. O usuário acessa o item **Reservas**.
2. O usuário seleciona **Fazer reserva**.
3. O usuário seleciona uma data igual ou posterior à data atual.
4. O usuário seleciona um tipo de ativo.
5. O sistema apresenta os ativos relacionados.
6. O usuário seleciona um ou mais ativos.
7. O sistema apresenta os tempos disponíveis.
8. O usuário seleciona um ou mais tempos.
9. O usuário informa a finalidade e as observações.
10. O usuário master pode selecionar outro usuário como responsável.
11. O usuário seleciona **Reservar**.
12. O sistema verifica novamente a disponibilidade.
13. O sistema cria as reservas individuais.
14. O sistema apresenta uma mensagem de confirmação.
15. O sistema atualiza os tempos disponíveis.

## Tela para visualizar reservas

A visualização deve possuir:

- Seleção de data;
- Abas dos tipos de ativos;
- Seleção do ativo;
- Agenda com todos os tempos;
- Filtros por usuário e situação, conforme as permissões;
- Opções para visualizar, editar e cancelar.

Na agenda, os tempos devem ser identificados como:

- Livre;
- Reservado;
- Pendente;
- Indisponível;
- Cancelado, quando exibido no histórico.

## Fluxo de visualização

1. O usuário seleciona **Visualizar reservas**.
2. O sistema apresenta inicialmente a data atual.
3. O usuário seleciona um tipo de ativo.
4. O sistema apresenta os ativos relacionados.
5. O usuário seleciona um ativo.
6. O sistema apresenta todos os tempos e suas situações.
7. O usuário seleciona uma reserva.
8. O sistema apresenta os detalhes e as ações permitidas.

## Fluxo de edição

1. O usuário seleciona a opção **Editar**.
2. O sistema apresenta os dados atuais.
3. O usuário altera os dados permitidos.
4. O sistema verifica a disponibilidade.
5. O sistema apresenta uma mensagem de confirmação.
6. O usuário confirma a edição.
7. O sistema salva as alterações.
8. O sistema atualiza a agenda.

## Fluxo de cancelamento

1. O usuário seleciona a opção **Cancelar reserva**.
2. O sistema solicita o motivo do cancelamento.
3. O sistema apresenta uma mensagem de confirmação.
4. O usuário confirma o cancelamento.
5. O sistema altera a situação para `cancelada`.
6. O sistema registra quem realizou o cancelamento.
7. O sistema registra a data e o motivo.
8. O sistema libera o tempo para novas reservas.
9. O sistema mantém a reserva no histórico.
10. O sistema atualiza a agenda.

## Validações

- A data não pode ser anterior à data atual.
- Pelo menos um ativo deve ser selecionado.
- Pelo menos um tempo deve ser selecionado.
- O usuário responsável deve estar ativo.
- Usuários normais somente podem reservar em seu próprio nome.
- O horário deve estar disponível para todos os ativos selecionados.
- A disponibilidade deve ser verificada novamente no backend.
- Reservas ativas ou pendentes devem bloquear o tempo.
- Reservas canceladas não devem bloquear o tempo.
- A edição não pode gerar conflito com outra reserva.
- O cancelamento deve exigir confirmação.
- Reservas canceladas não podem ser recuperadas ou excluídas definitivamente.

## Controle de concorrência

O cadastro e a edição devem utilizar uma transação no banco de dados.

Antes de salvar, o backend deve verificar novamente todas as combinações de:

- Ativo;
- Data;
- Tempo.

Se outra reserva tiver ocupado uma das combinações, a operação deve ser cancelada e o usuário deve ser informado.

## Atualização dinâmica

Após cadastrar, editar ou cancelar uma reserva, o sistema deve atualizar automaticamente:

- Os tempos disponíveis;
- A agenda do ativo;
- A listagem de reservas;
- Os indicadores de situação.

A atualização deve ocorrer sem recarregar toda a página.

## Decisões técnicas

- **Banco de dados:** MySQL;
- **Frontend:** HTML, CSS e JavaScript;
- **Backend:** Node.js;
- **Comunicação:** API REST;
- **Formato de dados:** JSON;
- **Controle de acesso:** sessão autenticada;
- **Persistência:** uma reserva para cada combinação de ativo e tempo;
- **Controle de concorrência:** transação no banco de dados;
- **Exclusão:** cancelamento com preservação do histórico;
- **Abordagem da interface:** Mobile First.

## Responsividade

- A tela deve adaptar-se a celulares, tablets e computadores.
- As abas devem permitir rolagem horizontal em telas pequenas.
- Os ativos e tempos devem ser adequados para interação por toque.
- Os formulários devem utilizar uma coluna no mobile.
- As tabelas devem ser responsivas.
- Em telas pequenas, as tabelas podem utilizar rolagem horizontal.
- As ações podem ser agrupadas em um menu no mobile.
- O botão **Reservar** deve permanecer visível e acessível.
- A agenda deve adaptar-se à largura disponível.
- Nenhum conteúdo deve ultrapassar os limites da tela.