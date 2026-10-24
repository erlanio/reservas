# Tasks — Gerenciar Tempos

## Controle de acesso

- [X] Adicionar o item **Tempos** ao menu lateral.
- [X] Exibir o item somente para usuários master.
- [X] Permitir o acesso somente para usuários autenticados, ativos e master.
- [X] Proteger as rotas de tempos no backend.
- [X] Redirecionar usuários sem permissão para o início do dashboard.

## Tempos padrão

- [X] Criar a rotina de inserção dos nove tempos padrão.
- [X] Garantir que a rotina seja executada somente quando necessário.
- [X] Impedir a duplicação dos tempos ao reiniciar a aplicação.
- [X] Criar os seguintes tempos:
  - [X] 1º tempo: `07:20` até `08:10`;
  - [X] 2º tempo: `08:10` até `09:00`;
  - [X] 3º tempo: `09:20` até `10:10`;
  - [X] 4º tempo: `10:10` até `11:00`;
  - [X] 5º tempo: `11:00` até `12:00`;
  - [X] 6º tempo: `13:00` até `13:50`;
  - [X] 7º tempo: `13:50` até `14:40`;
  - [X] 8º tempo: `15:00` até `15:50`;
  - [X] 9º tempo: `15:50` até `16:40`.

## Interface e listagem

- [x] Criar a tela de tempos.
- [X] Criar a tabela de tempos.
- [X] Exibir identificador, horário inicial, horário final, duração e opções.
- [X] Ordenar a tabela pelo horário inicial.
- [X] Permitir ordenação crescente e decrescente.
- [X] Criar paginação com no máximo dez registros por página.
- [X] Exibir uma mensagem quando não existirem tempos cadastrados.
- [X] Adicionar um acesso para a lixeira.

## Cadastro de tempos

- [x] Criar a funcionalidade de cadastro de tempos.
- [X] Criar os campos identificador, horário inicial e horário final.
- [X] Validar o preenchimento dos campos obrigatórios.
- [X] Impedir identificadores duplicados.
- [X] Validar se o horário final é posterior ao inicial.
- [X] Verificar a sobreposição com outros tempos.
- [X] Permitir horários consecutivos.
- [X] Apresentar o tempo conflitante quando houver sobreposição.
- [X] Atualizar a tabela após o cadastro.
- [X] Garantir que o cadastro exija no máximo quatro cliques.

## Edição de tempos

- [x] Criar a funcionalidade de edição de tempos.
- [X] Preencher o formulário com os dados atuais.
- [X] Validar se o novo identificador está disponível.
- [X] Validar o horário inicial e o horário final.
- [X] Verificar a sobreposição sem comparar o registro com ele mesmo.
- [X] Solicitar confirmação antes de salvar.
- [X] Atualizar a tabela após a edição.
- [X] Garantir que a edição exija no máximo quatro cliques.

## Exclusão de tempos

- [x] Criar a funcionalidade de exclusão de tempos.
- [X] Solicitar confirmação antes da exclusão.
- [X] Implementar a exclusão lógica.
- [X] Registrar a data da exclusão.
- [X] Definir a data prevista para exclusão definitiva.
- [X] Remover o tempo da listagem principal.
- [X] Garantir que a exclusão exija no máximo quatro cliques.

## Lixeira

- [X] Criar a tela de tempos excluídos.
- [X] Exibir identificador, horário inicial, horário final e data da exclusão.
- [X] Exibir a data prevista para exclusão definitiva.
- [X] Criar paginação com no máximo dez registros por página.
- [X] Exibir uma mensagem quando a lixeira estiver vazia.

## Recuperação de tempos

- [x] Possibilitar a recuperação de tempos excluídos há menos de 30 dias.
- [X] Verificar se o prazo de recuperação ainda está válido.
- [X] Verificar se o identificador está disponível.
- [X] Verificar se o intervalo não se sobrepõe a outro tempo.
- [X] Informar o motivo quando a recuperação não for permitida.
- [X] Solicitar confirmação antes da recuperação.
- [X] Atualizar a tabela e a lixeira após a recuperação.

## Exclusão definitiva

- [X] Criar a rotina de exclusão definitiva.
- [X] Excluir permanentemente tempos após 30 dias na lixeira.
- [X] Impedir a recuperação após o vencimento do prazo.
- [X] Garantir que registros não sejam excluídos antes dos 30 dias.

## Atualização dinâmica

- [X] Atualizar a tabela após cadastrar, editar ou excluir um tempo.
- [X] Atualizar a listagem após recuperar um tempo.
- [X] Manter a ordenação e a página selecionada quando possível.
- [X] Exibir mensagens de sucesso e erro.
- [X] Evitar o recarregamento completo da página.

## Responsividade

- [X] Aplicar a abordagem Mobile First.
- [X] Tornar a tabela responsiva.
- [X] Permitir rolagem horizontal em telas pequenas.
- [X] Agrupar as ações em um menu no mobile.
- [X] Organizar o formulário em uma coluna no mobile.
- [X] Garantir que botões e campos sejam adequados para toque.
- [X] Testar a interface em mobile, tablet e desktop.

## Testes

- [X] Testar a criação automática dos tempos padrão.
- [X] Testar a execução repetida da rotina sem duplicação.
- [X] Testar o cadastro de um tempo válido.
- [X] Testar o cadastro com identificador duplicado.
- [X] Testar um horário final igual ao inicial.
- [X] Testar um horário final anterior ao inicial.
- [X] Testar a sobreposição total de horários.
- [X] Testar a sobreposição parcial no início.
- [X] Testar a sobreposição parcial no final.
- [X] Testar horários consecutivos.
- [X] Testar a edição de um tempo.
- [X] Testar a confirmação da edição.
- [X] Testar a exclusão lógica.
- [X] Testar a confirmação da exclusão.
- [X] Testar a recuperação dentro do prazo.
- [X] Testar a recuperação com identificador em uso.
- [X] Testar a recuperação com sobreposição de horário.
- [X] Testar a recuperação após 30 dias.
- [X] Testar a exclusão definitiva.
- [X] Testar o limite máximo de quatro cliques.
- [X] Testar o acesso de usuário normal.
- [X] Testar o acesso de usuário master.
- [X] Testar a interface em diferentes tamanhos de tela.

## Critérios para conclusão

- [X] Apenas usuários master conseguem gerenciar tempos.
- [X] Os nove tempos padrão são criados sem duplicação.
- [X] O sistema impede identificadores duplicados.
- [X] O horário final deve ser posterior ao inicial.
- [X] O sistema impede intervalos sobrepostos.
- [X] O sistema permite horários consecutivos.
- [X] A edição e a exclusão exigem confirmação.
- [X] Tempos excluídos permanecem na lixeira por 30 dias.
- [X] A recuperação funciona quando não existem conflitos.
- [X] A exclusão definitiva ocorre após 30 dias.
- [X] As operações principais exigem no máximo quatro cliques.
- [X] A interface funciona em mobile, tablet e desktop.

## Dependências

Esta especificação depende de:

- `02-login`;
- `03-dashboard`.

A especificação de reservas depende da conclusão do gerenciamento de tempos.