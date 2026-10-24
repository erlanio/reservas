# Tasks — Cadastrar Ativos

## Controle de acesso

- [X] Permitir o acesso somente para usuários autenticados, ativos e master.
- [X] Ocultar o item **Ativos** para usuários normais.
- [X] Proteger as rotas de ativos e tipos no backend.
- [X] Redirecionar usuários sem permissão para o início do dashboard.

## Interface de ativos

- [x] Criar a tela de ativos.
- [x] Criar submenus dinâmicos para os tipos de ativos.
- [X] Adicionar o item **Todos os ativos**.
- [X] Adicionar o item **Tipos de ativos**.
- [X] Adicionar o item **Lixeira**.
- [X] Criar a tabela de ativos.
- [X] Exibir identificador, descrição, tipo, situação e opções.
- [X] Criar ordenação por identificador, tipo e situação.
- [X] Criar paginação com no máximo dez ativos por página.
- [X] Filtrar a tabela ao selecionar um tipo no submenu.
- [X] Manter as cores e a tipografia do módulo de usuários.

## Cadastro de tipos de ativos

- [x] Criar a funcionalidade de cadastro de tipos.
- [X] Criar o botão **+** ao lado do campo de tipo.
- [X] Abrir o gerenciamento de tipos em um modal ou painel lateral.
- [X] Solicitar a descrição do tipo.
- [X] Validar o preenchimento da descrição.
- [X] Impedir descrições duplicadas.
- [X] Ignorar diferenças entre letras maiúsculas e minúsculas.
- [X] Remover espaços excedentes antes da validação.
- [X] Atualizar o campo de tipo após o cadastro.
- [X] Selecionar automaticamente o novo tipo.
- [X] Manter os dados já preenchidos no formulário do ativo.

## Edição de tipos de ativos

- [x] Criar a funcionalidade de edição de tipos.
- [X] Preencher o formulário com a descrição atual.
- [X] Validar se a nova descrição já está em uso.
- [X] Solicitar confirmação antes de salvar.
- [X] Atualizar os submenus após a edição.
- [X] Atualizar a tabela e os formulários após a edição.

## Exclusão de tipos de ativos

- [x] Criar a funcionalidade de exclusão de tipos.
- [X] Solicitar confirmação antes da exclusão.
- [X] Verificar se existem ativos vinculados ao tipo.
- [X] Impedir a exclusão de tipos relacionados a ativos.
- [X] Informar quantos ativos estão vinculados ao tipo.
- [X] Atualizar os submenus após a exclusão.

## Cadastro de ativos

- [x] Criar a funcionalidade de cadastro de ativos.
- [X] Criar os campos identificador, descrição, tipo e situação.
- [X] Definir a descrição como opcional.
- [X] Definir o identificador e o tipo como obrigatórios.
- [X] Impedir identificadores duplicados.
- [X] Ignorar diferenças entre letras maiúsculas e minúsculas.
- [X] Validar se o tipo selecionado existe e está ativo.
- [X] Exibir uma mensagem após o cadastro.
- [X] Atualizar a tabela e os submenus.
- [X] Garantir que o cadastro exija no máximo cinco cliques.

## Edição de ativos

- [x] Criar a funcionalidade de edição de ativos.
- [X] Preencher o formulário com os dados atuais.
- [X] Validar se o novo identificador está disponível.
- [X] Validar se o tipo selecionado existe.
- [X] Solicitar confirmação antes de salvar.
- [X] Atualizar a tabela após a edição.
- [X] Garantir que a edição exija no máximo cinco cliques.

## Exclusão de ativos

- [x] Criar a funcionalidade de exclusão de ativos.
- [X] Solicitar confirmação antes da exclusão.
- [X] Implementar a exclusão lógica.
- [X] Registrar a data da exclusão.
- [X] Definir a data prevista para exclusão definitiva.
- [X] Remover o ativo da listagem principal.
- [X] Garantir que a exclusão exija no máximo cinco cliques.

## Lixeira de ativos

- [x] Criar a funcionalidade de lixeira.
- [X] Criar a tela de ativos excluídos.
- [X] Exibir identificador, descrição, tipo e data da exclusão.
- [X] Exibir a data prevista para exclusão definitiva.
- [X] Criar paginação com no máximo dez ativos por página.
- [X] Exibir uma mensagem quando a lixeira estiver vazia.

## Recuperação de ativos

- [x] Possibilitar a recuperação de ativos excluídos há menos de 30 dias.
- [X] Verificar se o prazo de recuperação ainda está válido.
- [X] Verificar se o identificador está disponível.
- [X] Impedir a recuperação quando o identificador estiver em uso.
- [X] Verificar se o tipo do ativo ainda existe.
- [X] Solicitar confirmação antes da recuperação.
- [X] Atualizar a tabela e a lixeira após a recuperação.

## Exclusão definitiva

- [X] Criar a rotina de exclusão definitiva.
- [X] Excluir permanentemente ativos após 30 dias na lixeira.
- [X] Impedir a recuperação após o vencimento do prazo.
- [X] Garantir que ativos não sejam excluídos antes dos 30 dias.

## Atualização dinâmica

- [X] Atualizar os tipos sem recarregar toda a página.
- [X] Atualizar os submenus após cadastrar, editar ou excluir um tipo.
- [X] Atualizar a tabela após cadastrar, editar ou excluir um ativo.
- [X] Manter os filtros e a página atual quando possível.
- [X] Exibir mensagens de sucesso e erro para todas as operações.

## Responsividade

- [X] Aplicar a abordagem Mobile First.
- [X] Tornar as tabelas responsivas.
- [X] Permitir rolagem horizontal em telas pequenas.
- [X] Agrupar as ações em um menu no mobile.
- [X] Organizar os formulários em uma coluna no mobile.
- [X] Garantir que os botões sejam adequados para interação por toque.
- [X] Testar a interface em mobile, tablet e desktop.

## Testes

- [X] Testar o acesso de usuário master.
- [X] Testar a tentativa de acesso de usuário normal.
- [X] Testar o cadastro de ativo.
- [X] Testar o cadastro com identificador duplicado.
- [X] Testar a edição de ativo.
- [X] Testar a confirmação da edição.
- [X] Testar a exclusão lógica.
- [X] Testar a confirmação da exclusão.
- [X] Testar o cadastro de tipo.
- [X] Testar o cadastro de tipo duplicado.
- [X] Testar a edição de tipo.
- [X] Testar a exclusão de tipo sem ativos.
- [X] Testar a exclusão de tipo relacionado a ativos.
- [X] Testar os submenus dinâmicos.
- [X] Testar a recuperação dentro do prazo.
- [X] Testar a recuperação com identificador duplicado.
- [X] Testar a recuperação quando o tipo não existe.
- [X] Testar a tentativa de recuperação após 30 dias.
- [X] Testar a exclusão definitiva.
- [X] Testar o limite máximo de cinco cliques.
- [X] Testar a interface em diferentes tamanhos de tela.

## Critérios para conclusão

- [X] Apenas usuários master conseguem gerenciar ativos e tipos.
- [X] Os identificadores dos ativos são únicos.
- [X] As descrições dos tipos são únicas.
- [X] Todo ativo possui um tipo.
- [X] Os submenus são criados dinamicamente.
- [X] O botão **+** permite gerenciar tipos pelo formulário.
- [X] Os dados preenchidos não são perdidos ao gerenciar tipos.
- [X] Tipos vinculados a ativos não podem ser excluídos.
- [X] Ativos excluídos permanecem na lixeira por 30 dias.
- [X] A recuperação funciona quando o identificador está disponível.
- [X] A exclusão definitiva ocorre após 30 dias.
- [X] As operações principais exigem no máximo cinco cliques.
- [X] A interface funciona em mobile, tablet e desktop.

## Dependências

Esta especificação depende de:

- `02-login`;
- `03-dashboard`;
- `04-gerenciar-usuarios`.

As funcionalidades de reservas dependem da conclusão desta especificação.