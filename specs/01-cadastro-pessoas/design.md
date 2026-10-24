# Design — Cadastro de Pessoas

## Visão geral da solução

O módulo permitirá o autocadastro de usuários. Após o cadastro, o usuário deverá aguardar a aprovação de um usuário master para acessar o sistema.

## Dados utilizados

O formulário de cadastro deverá solicitar:

- Nome;
- E-mail;
- Senha;
- Data de nascimento.

O sistema deverá registrar automaticamente:

- Nível de acesso: `normal`;
- Situação do cadastro: `pendente`.

A senha deverá ser protegida com `bcrypt`. Não deve ser armazenada em texto puro nem utilizando MD5.

## Fluxo de cadastro

1. O usuário acessa a tela de login.
2. O usuário seleciona a opção **Fazer cadastro**.
3. O sistema apresenta o formulário de cadastro.
4. O usuário informa nome, e-mail, senha e data de nascimento.
5. O sistema valida os dados informados.
6. O sistema verifica se o e-mail já está cadastrado.
7. O sistema protege a senha utilizando `bcrypt`.
8. O sistema cadastra o usuário com nível `normal` e situação `pendente`.
9. O sistema informa que o cadastro depende da aprovação de um usuário master.

## Fluxo de aprovação

1. O usuário master acessa a lista de cadastros pendentes.
2. O sistema apresenta os usuários que aguardam aprovação.
3. O master seleciona um usuário.
4. O master aprova ou rejeita o cadastro.
5. Se aprovado, o usuário recebe a situação `ativo`.
6. Se rejeitado, o usuário recebe a situação `rejeitado`.

## Fluxo de recuperação de senha

1. O usuário seleciona a opção **Esqueci minha senha**.
2. O sistema solicita o e-mail e a data de nascimento.
3. O usuário informa os dados.
4. O sistema verifica se os dados correspondem ao cadastro.
5. O sistema gera automaticamente uma senha temporária.
6. O sistema armazena somente o hash da senha temporária.
7. O usuário utiliza a senha temporária no próximo acesso.
8. O sistema solicita a criação de uma nova senha.

## Validações

- Todos os campos são obrigatórios.
- O e-mail deve possuir um formato válido.
- O e-mail deve ser único no sistema.
- A data de nascimento deve ser válida e não pode estar no futuro.
- A senha deve seguir a política de segurança definida pelo sistema.
- A senha deve ser armazenada somente como hash.
- Usuários pendentes ou rejeitados não podem acessar as funcionalidades protegidas.
- Somente usuários master podem aprovar ou rejeitar cadastros.
- Somente usuários master podem promover um usuário normal para master.

## Componentes da interface

- Tela de login;
- Link para fazer cadastro;
- Formulário de cadastro;
- Tela de recuperação de senha;
- Lista de usuários pendentes;
- Botões para aprovar ou rejeitar cadastros;
- Mensagens de validação, sucesso e erro.

## Decisões técnicas

- **Banco de dados:** MySQL;
- **Frontend:** HTML, CSS e JavaScript;
- **Backend:** Node.js;
- **Comunicação:** API REST;
- **Formato de dados:** JSON;
- **Proteção de senhas:** `bcrypt`;
- **Abordagem da interface:** Mobile First.

## Responsividade

- A interface deve adaptar-se a celulares, tablets e computadores.
- Os formulários devem ocupar adequadamente o espaço disponível.
- Em telas pequenas, os campos devem ser apresentados em uma única coluna.
- Botões e campos devem possuir tamanho adequado para interação por toque.
- Nenhum conteúdo deve ultrapassar os limites da tela.
- Mensagens de validação devem permanecer visíveis em todos os dispositivos.