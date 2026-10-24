# Design — Gerenciar Tempos

## Visão geral da solução

O módulo permitirá que usuários master cadastrem, visualizem, editem, excluam e recuperem tempos utilizados posteriormente nas reservas de ativos.

A implementação deve seguir os requisitos definidos em:

`06-gerenciar-tempos/requirements.md`

## Controle de acesso

O item **Tempos/Horários** deve ser apresentado no menu lateral somente para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `master`.

As permissões devem ser verificadas no frontend e no backend.

## Estrutura do menu

O menu lateral deve possuir o item **Tempos/Horários** com um ícone relacionado a tempo ou relógio.

O item deve direcionar para a tela de gerenciamento de tempos.

## Dados do tempo

Cada tempo deve possuir:

- Identificador;
- Horário inicial;
- Horário final;
- Data de exclusão, quando estiver na lixeira.

A duração deve ser calculada automaticamente com base nos horários inicial e final.

## Tempos padrão

O sistema deve criar os seguintes tempos durante a configuração inicial:

| Identificador | Horário inicial | Horário final |
|---|---:|---:|
| 1º tempo | 07:20 | 08:10 |
| 2º tempo | 08:10 | 09:00 |
| 3º tempo | 09:20 | 10:10 |
| 4º tempo | 10:10 | 11:00 |
| 5º tempo | 11:00 | 12:00 |
| 6º tempo | 13:00 | 13:50 |
| 7º tempo | 13:50 | 14:40 |
| 8º tempo | 15:00 | 15:50 |
| 9º tempo | 15:50 | 16:40 |

A rotina de criação deve ser idempotente e não pode gerar registros duplicados.

## Estrutura da tela

A tela deve possuir:

- Título da página;
- Botão **Cadastrar tempo**;
- Tabela de tempos;
- Ordenação por horário;
- Paginação;
- Acesso à lixeira;
- Mensagens de confirmação, sucesso e erro.

## Tabela de tempos

A tabela deve apresentar:

- Identificador;
- Horário inicial;
- Horário final;
- Duração;
- Opções.

As opções disponíveis devem ser:

- Editar;
- Excluir.

Os registros devem ser ordenados inicialmente pelo horário de início.

Cada página deve apresentar no máximo dez tempos.

## Fluxo principal

1. O usuário master realiza o login.
2. O sistema direciona o usuário para o dashboard.
3. O usuário seleciona **Tempos/Horários**.
4. O sistema verifica a permissão.
5. O sistema apresenta a tabela de tempos.
6. O usuário pode cadastrar, editar ou excluir um tempo.
7. O sistema atualiza a tabela após cada operação.

## Fluxo de cadastro

1. O usuário seleciona **Cadastrar tempo**.
2. O sistema apresenta o formulário.
3. O usuário informa o identificador, o horário inicial e o horário final.
4. O sistema valida os campos.
5. O sistema verifica se o identificador está disponível.
6. O sistema verifica se existe sobreposição de horários.
7. O usuário confirma o cadastro.
8. O sistema salva o tempo.
9. O sistema atualiza a tabela.

## Fluxo de edição

1. O usuário seleciona **Editar**.
2. O sistema apresenta o formulário preenchido.
3. O usuário altera os dados.
4. O sistema valida o identificador e os horários.
5. O sistema verifica se existe sobreposição.
6. O sistema apresenta uma mensagem de confirmação.
7. O usuário confirma a alteração.
8. O sistema salva os dados.
9. O sistema atualiza a tabela.

## Fluxo de exclusão

1. O usuário seleciona **Excluir**.
2. O sistema apresenta uma mensagem de confirmação.
3. O usuário confirma a exclusão.
4. O sistema registra a data da exclusão.
5. O sistema envia o tempo para a lixeira.
6. O sistema informa que o registro permanecerá disponível por 30 dias.
7. O sistema atualiza a tabela.

## Lixeira

A tela deve possuir um botão ou link chamado **Lixeira**.

A lixeira deve apresentar:

- Identificador;
- Horário inicial;
- Horário final;
- Data da exclusão;
- Data prevista para exclusão definitiva;
- Opção para recuperar.

## Fluxo de recuperação

1. O usuário acessa a lixeira.
2. O sistema apresenta os tempos excluídos.
3. O usuário seleciona **Recuperar**.
4. O sistema verifica se o prazo de 30 dias ainda está válido.
5. O sistema verifica se o identificador está disponível.
6. O sistema verifica se o intervalo não se sobrepõe a outro tempo.
7. O sistema solicita confirmação.
8. O usuário confirma a recuperação.
9. O sistema restaura o tempo.
10. O sistema atualiza a tabela e a lixeira.

## Validações

- O identificador é obrigatório e deve ser único.
- O horário inicial é obrigatório.
- O horário final é obrigatório.
- O horário final deve ser posterior ao horário inicial.
- Os intervalos não podem se sobrepor.
- O horário final de um tempo pode ser igual ao horário inicial de outro.
- A edição e a exclusão devem exigir confirmação.
- A recuperação deve validar o identificador e o intervalo.
- As operações principais devem exigir no máximo quatro cliques.

## Validação de sobreposição

Existe conflito quando:

`novoInicio < horarioFinalExistente` e `novoFim > horarioInicioExistente`

### Exemplo permitido

- Tempo A: `15:00` até `15:50`;
- Tempo B: `15:50` até `16:40`.

### Exemplo não permitido

- Tempo A: `15:00` até `15:50`;
- Tempo B: `15:30` até `16:20`.

## Atualização dinâmica

Após cadastrar, editar, excluir ou recuperar um tempo, o sistema deve atualizar automaticamente:

- A tabela;
- A ordenação;
- A paginação;
- A lixeira, quando necessário.

A atualização deve ocorrer sem recarregar toda a página.

## Decisões técnicas

- **Banco de dados:** MySQL;
- **Frontend:** HTML, CSS e JavaScript;
- **Backend:** Node.js;
- **Comunicação:** API REST;
- **Formato de dados:** JSON;
- **Controle de acesso:** sessão autenticada;
- **Formato de horário:** `HH:mm`;
- **Exclusão:** lógica durante 30 dias;
- **Abordagem da interface:** Mobile First.

## Responsividade

- A tela deve adaptar-se a celulares, tablets e computadores.
- A tabela deve ser responsiva.
- Em telas pequenas, a tabela pode utilizar rolagem horizontal.
- As ações podem ser agrupadas em um menu no mobile.
- O formulário deve ser organizado em uma coluna no mobile.
- Os campos de horário devem ser adequados para dispositivos móveis.
- Os botões devem possuir tamanho apropriado para interação por toque.
- A paginação deve adaptar-se à largura disponível.
- Nenhum conteúdo deve ultrapassar os limites da tela.