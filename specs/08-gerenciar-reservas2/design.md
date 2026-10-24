# Design — Gerenciar Reservas

## Visão geral da solução

O módulo permitirá que usuários normais e master realizem, visualizem, editem e cancelem reservas de ativos.

A implementação deve seguir os requisitos definidos em:

`08-gerenciar-reservas2/requirements.md`

## Controle de acesso

O item **Reservas** deve ser apresentado no menu lateral para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `normal` ou `master`.

As permissões devem ser verificadas no frontend e no backend.

## Permissões

### Usuário normal

- Realizar reservas em seu próprio nome;
- Visualizar suas reservas;
- Editar suas reservas;
- Cancelar suas reservas.

### Usuário master

- Realizar reservas em seu próprio nome;
- Realizar reservas para outros usuários ativos;
- Visualizar todas as reservas;
- Editar reservas;
- Cancelar reservas.

## Estrutura do menu

O menu lateral deve possuir o item **Reservas**, acompanhado de um ícone relacionado a calendário ou agendamento.

O item deve direcionar para a tela de gerenciamento de reservas.

## Estrutura da tela

Na parte superior, a tela deve possuir as opções:

- **Fazer reserva**;
- **Visualizar reservas**.

A opção selecionada deve possuir destaque visual.

A troca entre as opções deve ocorrer sem recarregar toda a página.

## Tela para fazer reserva

A tela deve apresentar os seguintes elementos:

1. Seleção do usuário, disponível somente para usuários master;
2. Seleção da data;
3. Abas dos tipos de ativos;
4. Seleção dos ativos;
5. Seleção dos tempos disponíveis;
6. Campo de finalidade;
7. Campo de observações;
8. Botão **Reservar**.

O botão **Reservar** deve ficar logo abaixo da seleção dos ativos e tempos.

## Dados da reserva

Cada reserva deve possuir:

- Usuário responsável;
- Ativo;
- Data;
- Tempo;
- Finalidade;
- Observações opcionais;
- Situação;
- Data de criação;
- Usuário responsável pelo cancelamento, quando aplicável;
- Data do cancelamento, quando aplicável;
- Motivo do cancelamento, quando aplicável.

## Organização por tipo de ativo

Os tipos de ativos devem ser apresentados em abas.

Ao selecionar uma aba, o sistema deve apresentar somente os ativos pertencentes ao tipo escolhido.

A aba selecionada deve possuir destaque visual.

## Seleção de ativos

O sistema deve permitir a seleção de um ou mais ativos.

Não devem ser apresentados como disponíveis:

- Ativos inativos;
- Ativos excluídos;
- Ativos em manutenção.

Ao alterar os ativos selecionados, o sistema deve atualizar os tempos disponíveis.

## Seleção de tempos

Após selecionar a data e os ativos, o sistema deve consultar os tempos disponíveis.

O usuário deve poder selecionar um ou mais tempos.

Na opção **Fazer reserva**, somente os tempos disponíveis para todos os ativos selecionados devem ser apresentados.

Devem bloquear um tempo:

- Reservas ativas;
- Reservas pendentes.

Não devem bloquear um tempo:

- Reservas canceladas;
- Reservas rejeitadas.

## Fluxo de cadastro

1. O usuário acessa o item **Reservas**.
2. O usuário seleciona **Fazer reserva**.
3. O usuário informa uma data igual ou posterior à data atual.
4. O usuário seleciona um tipo de ativo.
5. O sistema apresenta os ativos relacionados.
6. O usuário seleciona um ou mais ativos.
7. O sistema apresenta somente os tempos disponíveis.
8. O usuário seleciona um ou mais tempos.
9. O usuário informa a finalidade e as observações.
10. O usuário master pode selecionar outro usuário como responsável.
11. O usuário seleciona **Reservar**.
12. O sistema verifica novamente a disponibilidade.
13. O sistema registra as reservas.
14. O sistema apresenta uma mensagem de confirmação.
15. O sistema atualiza os tempos disponíveis.

## Criação de múltiplas reservas

Quando o usuário selecionar múltiplos ativos e tempos, o sistema deve criar uma reserva individual para cada combinação.

> **Exemplo:**
>
> Ativos:
>
> - Laboratório 1;
> - Laboratório 2.
>
> Tempos:
>
> - 1º tempo;
> - 2º tempo.
>
> Reservas:
>
> - Laboratório 1 + 1º tempo;
> - Laboratório 1 + 2º tempo;
> - Laboratório 2 + 1º tempo;
> - Laboratório 2 + 2º tempo.

Todas as reservas devem ser salvas em uma única transação.

Se qualquer combinação estiver indisponível, nenhuma reserva da solicitação deve ser salva.

## Tela para visualizar reservas

A tela deve apresentar:

- Seleção de data;
- Abas dos tipos de ativos;
- Seleção do ativo;
- Agenda com todos os tempos;
- Filtros permitidos para o usuário;
- Opções para visualizar, editar e cancelar.

## Fluxo de visualização

1. O usuário seleciona **Visualizar reservas**.
2. O sistema apresenta inicialmente a data atual.
3. O usuário seleciona uma data.
4. O usuário seleciona uma aba de tipo.
5. O sistema apresenta os ativos relacionados.
6. O usuário seleciona um ativo.
7. O sistema apresenta todos os tempos e suas situações.
8. O usuário seleciona uma reserva para visualizar seus detalhes.

## Situações dos tempos

Na visualização, cada tempo deve possuir uma das seguintes situações:

- Livre;
- Reservado;
- Pendente;
- Indisponível.

A situação deve ser identificada por texto, cor e ícone.

A cor não deve ser o único recurso utilizado para comunicar a situação.

## Detalhes da reserva

Ao selecionar uma reserva, o sistema deve apresentar:

- Responsável;
- Ativo;
- Tipo do ativo;
- Data;
- Horário inicial;
- Horário final;
- Finalidade;
- Observações;
- Situação.

A identificação do responsável deve respeitar as permissões do usuário.

## Fluxo de edição

1. O usuário seleciona **Editar**.
2. O sistema apresenta os dados atuais.
3. O usuário altera os campos permitidos.
4. O sistema verifica a disponibilidade.
5. O sistema apresenta uma mensagem de confirmação.
6. O usuário confirma a alteração.
7. O sistema salva os dados.
8. O sistema atualiza a agenda.

## Fluxo de cancelamento

1. O usuário seleciona **Cancelar reserva**.
2. O sistema solicita o motivo.
3. O sistema apresenta uma mensagem de confirmação.
4. O usuário confirma o cancelamento.
5. O sistema altera a situação para `cancelada`.
6. O sistema registra quem realizou o cancelamento.
7. O sistema registra a data e o motivo.
8. O sistema libera o tempo.
9. O sistema mantém a reserva no histórico.
10. O sistema atualiza a agenda.

## Validações

- A data não pode ser anterior à data atual.
- Pelo menos um ativo deve ser selecionado.
- Pelo menos um tempo deve ser selecionado.
- O usuário responsável deve possuir cadastro ativo.
- Usuários normais somente podem reservar em seu próprio nome.
- Todos os tempos devem estar disponíveis para os ativos selecionados.
- A disponibilidade deve ser verificada no backend antes de salvar.
- A edição não pode gerar conflito.
- O cancelamento deve exigir confirmação.
- Reservas canceladas devem permanecer no histórico.
- Reservas canceladas não podem ser recuperadas ou excluídas definitivamente.

## Controle de concorrência

O cadastro e a edição devem utilizar uma transação no banco de dados.

Antes de salvar, o backend deve verificar novamente todas as combinações de:

- Ativo;
- Data;
- Tempo.

Se uma combinação tiver sido ocupada por outra solicitação, a operação deve ser cancelada e o usuário deve ser informado.

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
- **Concorrência:** transação no banco de dados;
- **Exclusão:** cancelamento com manutenção do histórico;
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