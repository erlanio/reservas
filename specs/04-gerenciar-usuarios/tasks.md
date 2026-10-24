# Tasks — Gerenciar Usuários

## Controle de acesso

- [X] Permitir o acesso somente para usuários autenticados, ativos e master.
- [X] Ocultar o item **Usuários** para usuários normais.
- [X] Proteger as rotas de gerenciamento de usuários no backend.
- [X] Redirecionar usuários sem permissão para o início do dashboard.

## Listagem de usuários

- [x] Criar a tela de usuários.
- [x] Criar a tabela de usuários.
- [x] Permitir a ordenação da tabela por nome.
- [X] Exibir apenas nome, e-mail, situação e opções na tabela.
- [X] Limitar a listagem a dez usuários por página.
- [X] Criar os controles de paginação.
- [X] Permitir ordenação crescente e decrescente por nome.
- [X] Não apresentar usuários excluídos na listagem principal.
- [X] Exibir uma mensagem quando não existirem usuários cadastrados.

## Edição de usuários

- [x] Criar a funcionalidade de edição.
- [X] Permitir a edição do nome.
- [X] Permitir a edição do e-mail.
- [X] Permitir a edição da data de nascimento.
- [X] Permitir a alteração do nível de acesso.
- [X] Permitir a alteração da situação do usuário.
- [X] Permitir a definição de uma nova senha.
- [X] Não apresentar a senha atual na edição.
- [X] Proteger a nova senha utilizando `bcrypt`.
- [X] Validar se o novo e-mail já está em uso.
- [X] Solicitar confirmação antes de salvar as alterações.
- [X] Atualizar a tabela após a edição.

## Aprovação de usuários

- [x] Criar a funcionalidade de aprovação de cadastro pendente.
- [X] Apresentar a opção **Aprovar** somente para usuários pendentes.
- [X] Solicitar confirmação antes da aprovação.
- [X] Alterar a situação do usuário aprovado para `ativo`.
- [X] Criar a opção para rejeitar um cadastro pendente.
- [X] Alterar a situação do usuário rejeitado para `rejeitado`.
- [X] Atualizar a tabela após a aprovação ou rejeição.

## Exclusão de usuários

- [x] Criar a funcionalidade de exclusão.
- [X] Solicitar confirmação antes da exclusão.
- [X] Implementar a exclusão lógica do usuário.
- [X] Registrar a data da exclusão.
- [X] Definir a data prevista para exclusão definitiva.
- [X] Impedir que um master exclua a própria conta.
- [X] Impedir a exclusão do último usuário master ativo.
- [X] Atualizar a tabela após a exclusão.

## Lixeira

- [x] Criar a lixeira de usuários.
- [x] Criar a tela de usuários excluídos.
- [X] Adicionar o acesso à lixeira na tela de usuários.
- [X] Exibir nome, e-mail e data da exclusão.
- [X] Exibir a data prevista para exclusão definitiva.
- [X] Exibir somente usuários excluídos.
- [X] Criar paginação com no máximo dez registros por página.
- [X] Exibir uma mensagem quando a lixeira estiver vazia.

## Recuperação de usuários

- [x] Criar a tela de recuperação de usuário excluído.
- [X] Criar a funcionalidade de recuperação.
- [X] Permitir a recuperação somente durante o prazo de 30 dias.
- [X] Verificar se o e-mail está disponível antes da recuperação.
- [X] Impedir a recuperação quando o e-mail estiver em uso.
- [X] Solicitar confirmação antes de recuperar o usuário.
- [X] Remover a data de exclusão após a recuperação.
- [X] Atualizar a listagem principal e a lixeira.

## Exclusão definitiva

- [X] Criar a rotina de exclusão definitiva.
- [X] Excluir permanentemente os usuários após 30 dias na lixeira.
- [X] Impedir a recuperação após o vencimento do prazo.
- [X] Garantir que a rotina não exclua usuários antes dos 30 dias.

## Responsividade

- [X] Aplicar a abordagem Mobile First.
- [X] Tornar a tabela responsiva.
- [X] Permitir rolagem horizontal quando necessário.
- [X] Agrupar as ações em um menu nas telas pequenas.
- [X] Ajustar a paginação para dispositivos móveis.
- [X] Garantir que botões e campos sejam adequados para toque.
- [X] Testar a interface em mobile, tablet e desktop.

## Testes

- [X] Testar o acesso de um usuário master.
- [X] Testar a tentativa de acesso de um usuário normal.
- [X] Testar a ordenação por nome.
- [X] Testar a paginação com mais de dez usuários.
- [X] Testar a edição dos dados.
- [X] Testar a alteração de senha.
- [X] Testar a tentativa de cadastrar um e-mail duplicado.
- [X] Testar a aprovação de usuário pendente.
- [X] Testar a rejeição de usuário pendente.
- [X] Testar a confirmação de edição.
- [X] Testar a confirmação de exclusão.
- [X] Testar a exclusão lógica.
- [X] Testar a recuperação dentro do prazo.
- [X] Testar a recuperação com e-mail em uso.
- [X] Testar a tentativa de recuperação após 30 dias.
- [X] Testar a exclusão definitiva.
- [X] Testar a tentativa de autoexclusão de um master.
- [X] Testar a tentativa de exclusão do último master ativo.

## Critérios para conclusão

- [X] Apenas usuários master acessam o módulo.
- [X] A tabela apresenta no máximo dez usuários por página.
- [X] A tabela pode ser ordenada pelo nome.
- [X] O master consegue editar, aprovar, rejeitar e excluir usuários.
- [X] Toda edição ou exclusão exige confirmação.
- [X] Usuários excluídos permanecem na lixeira por 30 dias.
- [X] Usuários podem ser recuperados quando o e-mail estiver disponível.
- [X] Usuários são excluídos definitivamente após 30 dias.
- [X] A interface funciona em mobile, tablet e desktop.

## Dependências

As seguintes especificações dependem da conclusão desta:

- `03-cadastro-tipos`;
- `04-cadastro-ativos`.