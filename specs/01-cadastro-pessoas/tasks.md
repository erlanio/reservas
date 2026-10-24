# Tasks — Cadastro de Pessoas

## Configuração e banco de dados

- [x] Criar leitura das variáveis de ambiente.
- [x] Criar conexão com o banco de dados MySQL.
- [x] Tratar erros de conexão sem expor credenciais.
- [x] Criar ou atualizar a tabela de usuários.
- [x] Adicionar os níveis de acesso `normal` e `master`.
- [x] Adicionar as situações `pendente`, `ativo` e `rejeitado`.
- [x] Criar restrição para impedir e-mails duplicados.

## Cadastro de usuários

- [x] Criar a tela de cadastro.
- [x] Criar a rota de cadastro no backend.
- [x] Validar nome, e-mail, senha e data de nascimento.
- [x] Validar o formato do e-mail.
- [x] Validar se a data de nascimento não está no futuro.
- [x] Impedir o cadastro de um e-mail já existente.
- [x] Proteger a senha utilizando `bcrypt`.
- [x] Cadastrar novos usuários com nível `normal`.
- [x] Cadastrar novos usuários com situação `pendente`.
- [x] Informar que o cadastro depende da aprovação de um master.

## Aprovação de usuários

- [x] Criar a tela de usuários pendentes.
- [x] Criar a rota para listar usuários pendentes.
- [x] Criar a ação para aprovar um usuário.
- [x] Criar a ação para rejeitar um usuário.
- [x] Permitir essas ações somente para usuários master.
- [x] Alterar a situação para `ativo` após a aprovação.
- [x] Alterar a situação para `rejeitado` após a rejeição.

## Gerenciamento de níveis

- [x] Criar a opção para promover um usuário normal para master.
- [x] Permitir a promoção somente por um usuário master.
- [x] Impedir que um usuário altere o próprio nível de acesso.
- [x] Impedir que um usuário altere o próprio nível de acesso.
- [x] Registrar a alteração do nível do usuário.

## Recuperação de senha

- [x] Criar a tela de recuperação de senha.
- [x] Criar a rota de recuperação de senha.
- [x] Validar o e-mail e a data de nascimento.
- [x] Gerar automaticamente uma senha temporária segura.
- [x] Armazenar somente o hash da senha temporária.
- [x] Definir a expiração da senha temporária.
- [x] Solicitar a criação de uma nova senha no próximo acesso.
- [x] Exibir uma mensagem genérica quando os dados não forem validados.

## Responsividade

- [x] Aplicar a abordagem Mobile First.
- [x] Ajustar os formulários para celulares, tablets e computadores.
- [x] Garantir que botões e campos sejam adequados para interação por toque.
- [x] Validar a interface em diferentes tamanhos de tela.

## Testes

- [x] Testar o cadastro com dados válidos.
- [x] Testar o cadastro com campos obrigatórios vazios.
- [x] Testar o cadastro com e-mail inválido.
- [x] Testar o cadastro com e-mail duplicado.
- [x] Testar o armazenamento seguro da senha.
- [x] Testar a criação do usuário como `normal` e `pendente`.
- [x] Testar a aprovação e a rejeição de usuários.
- [x] Testar as permissões do usuário master.
- [x] Testar a promoção de usuário normal para master.
- [x] Testar a recuperação de senha.
- [x] Testar a expiração da senha temporária.
- [x] Testar erros do banco sem exposição de credenciais.

## Dependências

As seguintes especificações dependem da conclusão desta:

- `02-login`;
- `03-cadastro-tipos`;
- `04-cadastro-ativos`.