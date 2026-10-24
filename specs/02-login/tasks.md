# Tasks — Login

## Interface

- [x] Criar a tela de login.
- [x] Criar a tela inicial do dashboard.
- [x] Criar a tela de usuário com cadastro pendente.
- [X] Adicionar os campos de e-mail e senha.
- [X] Adicionar a opção para mostrar ou ocultar a senha.
- [X] Adicionar o link para cadastro de usuário.
- [X] Adicionar o link para recuperação de senha.
- [X] Criar a tela para cadastro rejeitado.
- [X] Aplicar um design clean, moderno e objetivo.
- [X] Tornar as telas responsivas utilizando Mobile First.

## Backend e autenticação

- [x] Criar as funcionalidades de login.
- [X] Criar a rota de autenticação.
- [X] Validar os campos de e-mail e senha.
- [X] Verificar se o e-mail está cadastrado.
- [X] Comparar a senha utilizando `bcrypt`.
- [X] Criar a sessão do usuário autenticado.
- [X] Criar middleware para proteger as rotas privadas.
- [X] Criar a funcionalidade para encerrar a sessão.
- [X] Impedir que senhas e credenciais sejam exibidas em logs ou erros.

## Situação do usuário

- [X] Verificar a situação do usuário após validar as credenciais.
- [X] Direcionar usuários ativos para o dashboard.
- [X] Impedir o acesso de usuários pendentes ao dashboard.
- [X] Exibir uma mensagem de aprovação pendente.
- [X] Listar os nomes e e-mails dos usuários master na tela de pendência.
- [X] Impedir o acesso de usuários rejeitados ao dashboard.
- [X] Exibir uma mensagem adequada para cadastros rejeitados.

## Tentativas de login

- [X] Criar um contador de tentativas consecutivas com senha incorreta.
- [X] Redirecionar para a recuperação de senha após três tentativas.
- [X] Não bloquear o usuário após as tentativas incorretas.
- [X] Reiniciar o contador após um login válido.

## Mensagens e validações

- [X] Informar quando o e-mail não estiver cadastrado.
- [X] Informar quando a senha estiver incorreta.
- [X] Informar quando os campos obrigatórios não forem preenchidos.
- [X] Validar o formato do e-mail.
- [X] Apresentar mensagens próximas aos respectivos campos.
- [X] Evitar a exposição de informações técnicas nos erros.

## Testes

- [X] Testar login com credenciais válidas.
- [X] Testar login com e-mail inexistente.
- [X] Testar login com senha incorreta.
- [X] Testar login com campos vazios.
- [X] Testar login de usuário ativo.
- [X] Testar login de usuário pendente.
- [X] Testar a exibição dos contatos dos usuários master.
- [X] Testar login de usuário rejeitado.
- [X] Testar o redirecionamento após três tentativas incorretas.
- [X] Testar se o usuário permanece desbloqueado.
- [X] Testar o encerramento da sessão.
- [X] Testar o acesso a rotas protegidas sem sessão.
- [X] Testar a interface em mobile, tablet e desktop.

## Critérios para conclusão

- [X] Usuários ativos conseguem acessar o dashboard.
- [X] Usuários pendentes visualizam a tela de aprovação pendente.
- [X] Usuários rejeitados não conseguem acessar o dashboard.
- [X] O sistema apresenta mensagens claras para e-mail e senha incorretos.
- [X] Após três tentativas incorretas, o usuário é direcionado para a recuperação.
- [X] As rotas privadas exigem uma sessão válida.
- [X] O usuário consegue encerrar a sessão.
- [X] A tela é responsiva, objetiva e de fácil utilização.

## Dependências

As seguintes especificações dependem da conclusão desta:

- `03-cadastro-tipos`;
- `04-cadastro-ativos`.