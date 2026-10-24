# Design — Login

## Visão geral da solução

O módulo de login permitirá que usuários cadastrados acessem o sistema utilizando e-mail e senha.

Após a validação das credenciais, o sistema deverá verificar a situação do usuário antes de permitir o acesso ao dashboard.

## Dados utilizados

Para realizar o login, serão solicitados:

- E-mail;
- Senha.

Também serão utilizados os seguintes dados armazenados:

- Identificador do usuário;
- Nome;
- Nível de acesso;
- Situação do cadastro;
- Quantidade de tentativas incorretas.

## Componentes da interface

A tela de login deverá possuir:

- Campo de e-mail;
- Campo de senha;
- Opção para mostrar ou ocultar a senha;
- Botão **Entrar**;
- Link **Fazer cadastro**;
- Link **Esqueci minha senha**;
- Área para mensagens de validação e erro.

## Fluxos

### Fluxo principal

1. O usuário acessa a tela de login.
2. O sistema apresenta os campos de e-mail e senha.
3. O usuário informa suas credenciais.
4. O sistema valida os campos.
5. O sistema verifica se o e-mail está cadastrado.
6. O sistema compara a senha informada com o hash armazenado.
7. O sistema verifica a situação do usuário.
8. Se o usuário estiver ativo, o sistema inicia a sessão.
9. O sistema direciona o usuário para o dashboard.

### Fluxo alternativo 1 — E-mail não cadastrado

1. O usuário acessa a tela de login.
2. O usuário informa um e-mail não cadastrado.
3. O sistema verifica que o e-mail não existe no banco de dados.
4. O sistema apresenta a mensagem: **“O e-mail informado não possui cadastro.”**
5. O usuário permanece na tela de login.

### Fluxo alternativo 2 — Senha incorreta

1. O usuário informa um e-mail cadastrado e uma senha incorreta.
2. O sistema apresenta a mensagem: **“Senha incorreta.”**
3. O sistema registra a tentativa incorreta.
4. O usuário permanece na tela de login.

### Fluxo alternativo 3 — Cadastro pendente

1. O usuário informa credenciais válidas.
2. O sistema identifica que o cadastro está pendente.
3. O sistema não permite o acesso ao dashboard.
4. O sistema apresenta uma tela informando que o cadastro aguarda aprovação.
5. O sistema apresenta os nomes e e-mails dos usuários master disponíveis para contato.

### Fluxo alternativo 4 — Cadastro rejeitado

1. O usuário informa credenciais válidas.
2. O sistema identifica que o cadastro foi rejeitado.
3. O sistema não permite o acesso ao dashboard.
4. O sistema apresenta uma mensagem informando que o cadastro não foi aprovado.

### Fluxo alternativo 5 — Três tentativas incorretas

1. O usuário informa uma senha incorreta três vezes consecutivas.
2. O sistema registra as tentativas.
3. Após a terceira tentativa, o sistema direciona o usuário para a tela de recuperação de senha.
4. O usuário não é bloqueado.
5. O usuário poderá retornar à tela de login.

### Fluxo alternativo 6 — Campos não preenchidos

1. O usuário tenta entrar sem preencher o e-mail ou a senha.
2. O sistema não envia a solicitação de login.
3. O sistema destaca os campos obrigatórios.
4. O usuário permanece na tela de login.

## Sessão do usuário

Após um login válido, o sistema deverá:

- Criar uma sessão para o usuário;
- Armazenar somente os dados necessários na sessão;
- Proteger as rotas privadas;
- Verificar o nível de acesso do usuário;
- Disponibilizar a opção de encerrar a sessão;
- Direcionar para o login quando a sessão for inválida ou expirar.

## Validações

- O e-mail e a senha são obrigatórios.
- O e-mail deve possuir um formato válido.
- A senha deve ser comparada utilizando `bcrypt`.
- Usuários pendentes não podem acessar o dashboard.
- Usuários rejeitados não podem acessar o dashboard.
- O contador de tentativas deve ser reiniciado após um login válido.
- O usuário não deve ser bloqueado após três tentativas incorretas.
- Senhas e credenciais não devem aparecer em mensagens ou logs.

## Decisões técnicas

- **Banco de dados:** MySQL;
- **Frontend:** HTML, CSS e JavaScript;
- **Backend:** Node.js;
- **Comunicação:** API REST;
- **Formato de dados:** JSON;
- **Validação de senha:** `bcrypt`;
- **Controle de acesso:** sessão autenticada;
- **Abordagem da interface:** Mobile First.

## Responsividade

- A tela deve adaptar-se a celulares, tablets e computadores.
- Em dispositivos móveis, os elementos devem ser apresentados em uma única coluna.
- Os campos e botões devem possuir tamanho adequado para interação por toque.
- O formulário deve permanecer centralizado e legível.
- As mensagens de erro devem adaptar-se à largura disponível.
- Nenhum conteúdo deve ultrapassar os limites da tela.
- A navegação por teclado deve funcionar corretamente.

## Segurança

- As credenciais do banco devem ser lidas de variáveis de ambiente.
- A senha não deve ser armazenada em texto puro ou com MD5.
- As mensagens de erro não devem expor credenciais ou detalhes técnicos.
- As rotas do dashboard devem exigir uma sessão válida.
- A sessão deve utilizar configurações seguras.
- O backend deve validar todos os dados recebidos, mesmo que já tenham sido validados no frontend.