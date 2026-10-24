# Requirements — Gerenciar Tempos e Horários

## Objetivo

Permitir o cadastro, a visualização, a edição, a exclusão e a recuperação dos tempos utilizados nas reservas de ativos.

## Contexto

Um tempo representa um intervalo do dia definido por:

- Identificador;
- Horário inicial;
- Horário final.

Os tempos cadastrados serão utilizados posteriormente como base para a reserva de ativos.

Apenas usuários autenticados, ativos e com nível `master` poderão acessar e gerenciar os tempos.

## Tempos padrão

O sistema deve criar automaticamente os seguintes tempos durante a configuração inicial:

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

A criação dos tempos padrão deve ocorrer apenas uma vez, sem gerar registros duplicados.

## Dados do tempo

O cadastro deve solicitar:

- Identificador;
- Horário inicial;
- Horário final.

## Requisitos funcionais

### RF01 — Controlar o acesso

O sistema deve permitir o acesso ao módulo somente para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `master`.

### RF02 — Exibir o menu

O dashboard deve possuir o item **Tempos** no menu lateral.

O item deve ser apresentado somente para usuários master.

### RF03 — Listar tempos

O sistema deve apresentar uma tabela contendo:

- Identificador;
- Horário inicial;
- Horário final;
- Duração;
- Opções.

### RF04 — Ordenar tempos

A tabela deve ser ordenada pelo horário inicial.

O usuário também deve poder ordenar os tempos em ordem crescente ou decrescente.

### RF05 — Paginar tempos

Quando existirem mais de dez registros, o sistema deve criar uma paginação com no máximo dez tempos por página.

### RF06 — Cadastrar tempo

O usuário master deve poder cadastrar um tempo informando o identificador, o horário inicial e o horário final.

### RF07 — Validar identificador

O identificador do tempo deve ser obrigatório e único entre os registros que não estão na lixeira.

A comparação deve ignorar diferenças entre letras maiúsculas e minúsculas e espaços excedentes.

### RF08 — Validar intervalo

O horário final deve ser posterior ao horário inicial.

### RF09 — Impedir sobreposição

O sistema não deve permitir o cadastro de tempos com horários sobrepostos.

Existe sobreposição quando:

`novoInicio < horarioFinalExistente` e `novoFim > horarioInicioExistente`

### RF10 — Permitir horários consecutivos

O horário final de um tempo pode ser igual ao horário inicial de outro.

> **Exemplo permitido:** um tempo termina às `15:50` e o próximo começa às `15:50`.

### RF11 — Editar tempo

O usuário master deve poder alterar o identificador, o horário inicial e o horário final.

### RF12 — Confirmar edição

Antes de salvar a alteração, o sistema deve apresentar uma mensagem de confirmação.

### RF13 — Excluir tempo

O usuário master deve poder excluir um tempo.

A exclusão deve ser lógica, mantendo o registro na lixeira por 30 dias.

### RF14 — Confirmar exclusão

Antes de enviar um tempo para a lixeira, o sistema deve apresentar uma mensagem de confirmação.

### RF15 — Listar tempos excluídos

A lixeira deve apresentar:

- Identificador;
- Horário inicial;
- Horário final;
- Data da exclusão;
- Data prevista para exclusão definitiva;
- Opção para recuperar.

### RF16 — Recuperar tempo

O usuário master deve poder recuperar um tempo durante o período de 30 dias.

### RF17 — Validar recuperação

Antes de recuperar um tempo, o sistema deve verificar:

- Se o prazo de recuperação ainda está válido;
- Se o identificador está disponível;
- Se o intervalo não se sobrepõe a outro tempo.

### RF18 — Excluir definitivamente

Após 30 dias na lixeira, o tempo deve ser excluído definitivamente.

### RF19 — Limitar interações

As ações de cadastrar, editar ou excluir um tempo devem ser concluídas com no máximo quatro cliques, desconsiderando a digitação dos dados.

## Fluxo principal

1. O usuário master realiza o login.
2. O sistema direciona o usuário para o dashboard.
3. O usuário seleciona o item **Tempos**.
4. O sistema verifica a permissão.
5. O sistema apresenta a tabela ordenada pelo horário inicial.
6. O usuário pode cadastrar, editar ou excluir um tempo.
7. O sistema atualiza a tabela após cada operação.

## Fluxo de cadastro

1. O usuário seleciona **Cadastrar tempo**.
2. O sistema apresenta o formulário.
3. O usuário informa o identificador, o horário inicial e o horário final.
4. O sistema valida os dados.
5. O sistema verifica se existe sobreposição.
6. O usuário confirma o cadastro.
7. O sistema salva o tempo.
8. O sistema atualiza a tabela.

## Fluxo de edição

1. O usuário seleciona a opção **Editar**.
2. O sistema apresenta o formulário preenchido.
3. O usuário altera os dados.
4. O sistema valida o identificador e o intervalo.
5. O sistema apresenta uma mensagem de confirmação.
6. O usuário confirma a alteração.
7. O sistema salva os dados.
8. O sistema atualiza a tabela.

## Fluxo de exclusão

1. O usuário seleciona a opção **Excluir**.
2. O sistema apresenta uma mensagem de confirmação.
3. O usuário confirma a exclusão.
4. O sistema registra a data da exclusão.
5. O sistema envia o tempo para a lixeira.
6. O sistema informa que o registro permanecerá na lixeira por 30 dias.
7. O sistema atualiza a tabela.

## Fluxo de recuperação

1. O usuário acessa a lixeira.
2. O sistema apresenta os tempos excluídos.
3. O usuário seleciona a opção **Recuperar**.
4. O sistema verifica o prazo de recuperação.
5. O sistema verifica o identificador.
6. O sistema verifica se existe sobreposição de horários.
7. O sistema solicita confirmação.
8. O usuário confirma a recuperação.
9. O sistema restaura o tempo.
10. O sistema atualiza a tabela e a lixeira.

## Fluxos alternativos

### Horário final inválido

1. O usuário informa um horário final igual ou anterior ao horário inicial.
2. O sistema não salva o tempo.
3. O sistema informa que o horário final deve ser posterior ao inicial.

### Sobreposição de horários

1. O usuário informa um intervalo que se sobrepõe a outro tempo.
2. O sistema não salva o registro.
3. O sistema informa qual tempo possui conflito.

### Identificador duplicado

1. O usuário informa um identificador já cadastrado.
2. O sistema não salva o registro.
3. O sistema informa que o identificador já está em uso.

### Conflito durante a recuperação

1. O usuário tenta recuperar um tempo.
2. O sistema identifica um conflito de identificador ou horário.
3. O sistema não realiza a recuperação.
4. O sistema apresenta o motivo do conflito.

### Prazo de recuperação expirado

1. O usuário tenta recuperar um tempo após 30 dias.
2. O sistema informa que o prazo expirou.
3. O sistema não permite a recuperação.

## Regras de negócio

- Apenas usuários autenticados, ativos e master podem gerenciar tempos.
- O identificador, o horário inicial e o horário final são obrigatórios.
- O identificador deve ser único.
- O horário final deve ser posterior ao horário inicial.
- Intervalos não podem se sobrepor.
- O final de um tempo pode ser igual ao início de outro.
- Os tempos devem ser ordenados pelo horário inicial.
- Os nove tempos padrão devem ser criados automaticamente.
- A criação dos tempos padrão não pode gerar duplicidades.
- A edição e a exclusão devem exigir confirmação.
- Tempos excluídos devem permanecer na lixeira por 30 dias.
- Tempos na lixeira não devem aparecer na listagem principal.
- A recuperação depende da disponibilidade do identificador e do intervalo.
- Após 30 dias, o tempo deve ser excluído definitivamente.
- As operações principais devem exigir no máximo quatro cliques.
- Todas as permissões e validações devem ser aplicadas no backend.

## Requisitos de interface

- A tela deve manter as cores e a tipografia dos demais módulos.
- A tabela deve seguir o padrão visual das telas de usuários e ativos.
- Os horários devem utilizar o formato de 24 horas: `HH:mm`.
- A duração pode ser calculada e apresentada automaticamente.
- O formulário deve utilizar campos próprios para seleção de horário.
- A tela deve possuir um acesso visível à lixeira.
- As mensagens de confirmação devem indicar a ação realizada.
- Os conflitos devem informar o tempo e o intervalo correspondentes.
- A interface deve utilizar a abordagem Mobile First.

## Responsividade

- A tela deve adaptar-se a celulares, tablets e computadores.
- A tabela deve ser responsiva.
- Em telas pequenas, a tabela pode utilizar rolagem horizontal.
- As ações podem ser agrupadas em um menu no mobile.
- O formulário deve utilizar uma coluna em telas pequenas.
- Os botões devem ser adequados para interação por toque.
- A paginação deve adaptar-se à largura disponível.

## Critérios de aceite

- [X] Apenas usuários autenticados, ativos e master acessam o módulo.
- [X] Os nove tempos padrão são criados automaticamente.
- [X] Os tempos padrão não são duplicados ao reiniciar a aplicação.
- [X] O sistema permite cadastrar, visualizar, editar e excluir tempos.
- [X] O sistema exige identificador, horário inicial e horário final.
- [X] O sistema impede identificadores duplicados.
- [X] O sistema impede que o horário final seja igual ou anterior ao inicial.
- [X] O sistema impede intervalos sobrepostos.
- [X] O sistema permite que o fim de um tempo seja igual ao início de outro.
- [X] A tabela é ordenada pelo horário inicial.
- [X] A edição exige confirmação.
- [X] A exclusão exige confirmação.
- [X] Tempos excluídos permanecem na lixeira por 30 dias.
- [X] O sistema permite recuperar um tempo dentro do prazo.
- [X] O sistema impede a recuperação quando existir conflito.
- [X] Tempos são excluídos definitivamente após 30 dias.
- [X] Cadastrar, editar ou excluir exige no máximo quatro cliques.
- [X] A interface funciona em mobile, tablet e desktop.

## Fora do escopo

- Criação de reservas;
- Associação de tempos a reservas;
- Horários diferentes por dia da semana;
- Calendários especiais e feriados;
- Duração variável por tipo de ativo;
- Histórico completo de alterações.