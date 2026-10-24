# Requirements — Cadastro de Pessoas

## Objetivo

Permitir o autocadastro de usuários no banco de dados MySQL para que, após aprovação, possam acessar o sistema e realizar reservas.

## Perfis de usuário

### Usuário normal

- Pode solicitar o próprio cadastro.
- Pode acessar o sistema após aprovação de um usuário master.
- Pode visualizar e realizar reservas de ativos.

### Usuário master

- Possui as permissões do usuário normal.
- Pode aprovar ou rejeitar novos usuários.
- Pode promover um usuário normal para master.
- Pode cadastrar, editar e excluir ativos.

## Dados do usuário

- Nome;
- E-mail;
- Senha;
- Data de nascimento;
- Nível de acesso: `normal` ou `master`;
- Situação: `pendente`, `ativo` ou `rejeitado`.

> A senha não deve ser armazenada em texto puro nem com MD5. O sistema deve utilizar um algoritmo próprio para senhas, como `bcrypt`.

## Requisitos funcionais

### RF01 — Conexão com o banco

O sistema deve conectar-se ao MySQL usando credenciais definidas em variáveis de ambiente.

### RF02 — Autocadastro

O sistema deve permitir que uma pessoa crie a própria conta informando nome, e-mail, senha e data de nascimento.

### RF03 — E-mail único

O sistema não deve permitir mais de uma conta com o mesmo e-mail.

### RF04 — Perfil inicial

Todo usuário criado por autocadastro deve receber automaticamente o nível `normal`.

### RF05 — Aprovação do cadastro

Todo novo cadastro deve receber a situação `pendente` e depender da aprovação de um usuário master.

### RF06 — Acesso após aprovação

O usuário somente poderá acessar as funcionalidades protegidas após ter o cadastro aprovado.

### RF07 — Recuperação de senha

O sistema deve permitir a recuperação de senha mediante a confirmação do e-mail e da data de nascimento.

### RF08 — Geração de senha temporária

Após validar os dados de recuperação, o sistema deve gerar automaticamente uma senha temporária segura.

### RF09 — Promoção para master

Um usuário master deve poder alterar o nível de um usuário normal para `master`.

## Fluxo de autocadastro

1. A pessoa acessa a tela de cadastro.
2. Informa nome, e-mail, senha e data de nascimento.
3. O sistema valida os dados.
4. O sistema verifica se o e-mail já está cadastrado.
5. O sistema protege a senha com `bcrypt`.
6. O sistema registra o usuário com nível `normal` e situação `pendente`.
7. O sistema informa que o cadastro depende de aprovação.
8. Um usuário master aprova ou rejeita a solicitação.

## Fluxo de recuperação de senha

1. O usuário informa o e-mail e a data de nascimento.
2. O sistema verifica se os dados correspondem a um cadastro.
3. O sistema gera uma senha temporária segura.
4. O sistema armazena somente o hash da senha temporária.
5. O sistema disponibiliza a senha temporária pelo canal definido para recuperação.
6. No próximo acesso, o usuário deverá cadastrar uma nova senha.

## Fluxo de aprovação

1. O usuário master acessa a lista de cadastros pendentes.
2. O sistema apresenta os dados do novo usuário.
3. O master aprova ou rejeita o cadastro.
4. Se aprovado, o usuário recebe a situação `ativo`.
5. Se rejeitado, o usuário recebe a situação `rejeitado`.

## Regras de negócio

- O e-mail deve ser obrigatório, válido e único.
- A data de nascimento deve ser uma data válida e não pode estar no futuro.
- A senha deve ser obrigatória e seguir a política de segurança definida pelo sistema.
- Senhas devem ser armazenadas somente como hash com `bcrypt`.
- Novos usuários devem possuir nível `normal`.
- Novos usuários devem possuir situação `pendente`.
- Somente usuários master podem aprovar ou rejeitar cadastros.
- Somente usuários master podem promover usuários normais para master.
- O sistema não deve informar se o e-mail ou a data de nascimento foi o dado incorreto durante a recuperação.
- A senha temporária deve expirar após o uso ou após o período definido pelo sistema.

## Critérios de aceite

- [ ] O sistema conecta-se ao MySQL usando variáveis de ambiente.
- [ ] Nenhuma credencial aparece no código-fonte ou em mensagens de erro.
- [ ] O autocadastro exige nome, e-mail, senha e data de nascimento.
- [ ] O sistema impede o cadastro de e-mails duplicados.
- [ ] Todo novo usuário é criado com nível `normal`.
- [ ] Todo novo usuário é criado com situação `pendente`.
- [ ] Um cadastro pendente somente é ativado após aprovação de um master.
- [ ] Somente usuários master podem aprovar ou rejeitar cadastros.
- [ ] Um master consegue promover um usuário normal para master.
- [ ] As senhas são armazenadas com `bcrypt`, nunca em texto puro ou MD5.
- [ ] A recuperação valida o e-mail e a data de nascimento.
- [ ] A recuperação gera automaticamente uma senha temporária.
- [ ] A senha temporária expira após o uso ou conforme o prazo configurado.

## Fora do escopo

- Implementação completa da autenticação e da sessão de login.
- Envio de senha temporária por e-mail ou SMS, até que o canal de recuperação seja definido.
- Cadastro de usuários diretamente pelo master.
