# Requirements — Login

## Objetivo

Permitir que usuários cadastrados acessem o sistema utilizando e-mail e senha.

## Contexto

O sistema deve possuir uma tela exclusiva para login, com links para cadastro e recuperação de senha.

Após a autenticação:

- Usuários ativos devem ser direcionados para o dashboard;
- Usuários pendentes devem visualizar uma mensagem informando que o cadastro ainda não foi aprovado;
- Usuários rejeitados não devem acessar o sistema.

## Requisitos funcionais

### RF01 — Realizar login

O sistema deve permitir que o usuário faça login utilizando e-mail e senha.

### RF02 — Validar campos obrigatórios

O sistema deve exigir o preenchimento do e-mail e da senha antes de tentar realizar o login.

### RF03 — Validar e-mail

O sistema deve verificar se o e-mail informado possui um formato válido e está cadastrado.

### RF04 — Informar e-mail não cadastrado

Quando o e-mail informado não estiver cadastrado, o sistema deve apresentar uma mensagem informando que o e-mail não foi encontrado.

### RF05 — Validar senha

Quando o e-mail existir, o sistema deve comparar a senha informada com o hash armazenado no banco de dados.

### RF06 — Redirecionar usuário ativo

Quando o e-mail e a senha estiverem corretos e o usuário estiver ativo, o sistema deve iniciar a sessão e direcioná-lo para o dashboard.

### RF07 — Tratar usuário pendente

O usuário com cadastro pendente poderá informar suas credenciais, mas não poderá acessar o dashboard.

O sistema deve apresentar:

- Uma mensagem informando que o cadastro aguarda aprovação;
- A lista de usuários master disponíveis para contato;
- O nome e o e-mail de cada usuário master.

### RF08 — Tratar usuário rejeitado

Quando o cadastro estiver rejeitado, o sistema não deve permitir o acesso ao dashboard e deve apresentar uma mensagem adequada.

### RF09 — Controlar tentativas incorretas

O sistema deve contar as tentativas consecutivas de login com senha incorreta.

Após três tentativas, o usuário deve ser direcionado para a tela de recuperação de senha.

O usuário não deve ser bloqueado e poderá retornar à tela de login.

### RF10 — Acessar o cadastro

A tela de login deve possuir um link para a tela de cadastro de usuário.

### RF11 — Acessar a recuperação de senha

A tela de login deve possuir um link para a tela de recuperação de senha.

### RF12 — Encerrar sessão

O sistema deve permitir que um usuário autenticado encerre sua sessão.

## Fluxo principal

1. O usuário acessa a tela de login.
2. O sistema apresenta os campos de e-mail e senha.
3. O usuário informa suas credenciais.
4. O sistema valida os campos.
5. O sistema verifica se o e-mail está cadastrado.
6. O sistema compara a senha informada com o hash armazenado.
7. O sistema verifica a situação do usuário.
8. Se o usuário estiver ativo, o sistema inicia a sessão.
9. O sistema redireciona o usuário para o dashboard.

## Fluxos alternativos

### E-mail não cadastrado

1. O usuário informa um e-mail não cadastrado.
2. O sistema apresenta a mensagem: **“E-mail não encontrado.”**
3. O usuário permanece na tela de login.

### Senha incorreta

1. O usuário informa uma senha incorreta.
2. O sistema apresenta a mensagem: **“Senha incorreta.”**
3. O sistema registra a tentativa.
4. Após três tentativas consecutivas, o sistema direciona o usuário para a recuperação de senha.
5. O usuário não é bloqueado.

### Cadastro pendente

1. O usuário informa credenciais válidas.
2. O sistema identifica que o cadastro está pendente.
3. O sistema não libera o acesso ao dashboard.
4. O sistema informa que o cadastro aguarda aprovação.
5. O sistema apresenta os nomes e e-mails dos usuários master.

### Cadastro rejeitado

1. O usuário informa credenciais válidas.
2. O sistema identifica que o cadastro foi rejeitado.
3. O sistema não inicia uma sessão com acesso ao dashboard.
4. O sistema apresenta uma mensagem informando que o cadastro não foi aprovado.

## Regras de negócio

- Somente usuários com situação `ativo` podem acessar o dashboard.
- Usuários pendentes podem validar suas credenciais, mas não podem acessar as funcionalidades protegidas.
- Usuários rejeitados não podem acessar o dashboard.
- A senha deve ser comparada utilizando `bcrypt`.
- A senha nunca deve ser exibida em mensagens, logs ou respostas da API.
- O contador de tentativas deve ser reiniciado após um login válido.
- O usuário não deve ser bloqueado após três tentativas incorretas.
- Após três tentativas incorretas, o usuário deve ser direcionado para a recuperação de senha.
- Os e-mails dos usuários master devem ser apresentados somente na tela de cadastro pendente.
- As rotas protegidas devem exigir uma sessão válida.
- A sessão deve ser encerrada quando o usuário selecionar a opção de sair.

## Requisitos de interface

- A tela deve possuir visual objetivo, clean e moderno.
- Os campos de e-mail e senha devem possuir rótulos visíveis.
- O campo de senha deve permitir mostrar ou ocultar o conteúdo.
- A tela deve possuir um botão de entrada claramente identificado.
- A tela deve possuir links para cadastro e recuperação de senha.
- As mensagens de validação devem ser claras e exibidas próximas aos campos.
- A interface deve utilizar a abordagem Mobile First.
- A tela deve adaptar-se a celulares, tablets e computadores.

## Critérios de aceite

- [X] A tela de login possui campos para e-mail e senha.
- [X] O usuário consegue acessar a tela de cadastro pelo login.
- [X] O usuário consegue acessar a recuperação de senha pelo login.
- [X] O sistema informa quando o e-mail não está cadastrado.
- [X] O sistema informa quando a senha está incorreta.
- [X] Um usuário ativo com credenciais válidas é direcionado ao dashboard.
- [X] Um usuário pendente não consegue acessar o dashboard.
- [X] O usuário pendente visualiza uma mensagem sobre a aprovação.
- [X] O usuário pendente visualiza os nomes e e-mails dos usuários master.
- [X] Um usuário rejeitado não consegue acessar o dashboard.
- [X] Após três senhas incorretas, o usuário é direcionado para a recuperação.
- [X] O usuário não é bloqueado após as tentativas incorretas.
- [X] A senha é comparada utilizando `bcrypt`.
- [X] As rotas protegidas não podem ser acessadas sem uma sessão válida.
- [X] O usuário consegue encerrar sua sessão.
- [X] A tela é objetiva, clean, moderna e responsiva.
- [X] O login pode ser utilizado sem treinamento prévio.