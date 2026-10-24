# Reservas

Sistema web de reservas de recursos escolares, como projetores e laboratórios. A aplicação usa Node.js, Express, MySQL e páginas em HTML, CSS e JavaScript.

## Funcionalidades

- Cadastro, login e recuperação de senha de usuários.
- Aprovação de novos cadastros por um usuário master.
- Cadastro e gestão de tipos de ativos, ativos e horários de aula.
- Reserva, alteração e cancelamento de ativos por data e horário, com consulta das próprias reservas.
- Desativação e reativação de ativos, com histórico; lixeira e restauração de registros.
- Notificações sobre cadastros e reservas.
- Painel e páginas administrativas para usuários master.

## Requisitos

- Node.js com suporte a `node --test` e `node --watch` e npm.
- Servidor MySQL acessível e um usuário com permissão para criar o banco e suas tabelas.

## Executar localmente

1. Instale as dependências:

   ```bash
   npm ci
   ```

2. Copie `.env.example` para `.env` e preencha os dados do MySQL:

   ```bash
   cp .env.example .env
   ```

   | Variável | Uso |
   | --- | --- |
   | `HOST` | Endereço de escuta do servidor; padrão `127.0.0.1`. |
   | `PORT` | Porta HTTP; padrão `3000`. |
   | `DB_HOST` | Endereço do MySQL. |
   | `DB_PORT` | Porta do MySQL. |
   | `DB_NAME` | Nome do banco que será criado ou utilizado. |
   | `DB_USER` | Usuário do MySQL. |
   | `DB_PASSWORD` | Senha do usuário do MySQL. |

3. Crie ou atualize as tabelas e os horários iniciais:

   ```bash
   npm run db:init
   ```

4. Crie o primeiro usuário master:

   ```bash
   npm run db:create-master
   ```

   Sem argumentos, o comando usa `master@escola.local`, gera uma senha temporária e a mostra no terminal. Guarde essa senha para o primeiro acesso. Executar o comando novamente para o mesmo e-mail atualiza o cadastro e a senha desse usuário.

5. Inicie a aplicação:

   ```bash
   npm start
   ```

Abra `http://127.0.0.1:3000`. Para desenvolvimento com reinício automático, use `npm run dev`. O endpoint `GET /health` verifica a conexão com o banco.

Novos usuários podem se cadastrar pela página inicial. O acesso fica pendente até a aprovação por um master.

## Comandos

| Comando | Ação |
| --- | --- |
| `npm start` | Inicia o servidor. |
| `npm run dev` | Inicia o servidor com reinício ao alterar arquivos. |
| `npm run db:init` | Cria ou atualiza o banco e as tabelas. |
| `npm run db:create-master` | Cria ou atualiza o usuário master inicial. |
| `npm test` | Executa os testes automatizados. |

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `app/server.js` | Servidor Express, rotas e controle de acesso. |
| `app/services/` | Regras de usuários, ativos, horários, reservas e notificações. |
| `app/public/` | Páginas públicas, scripts e estilos. |
| `app/private/` | Páginas acessíveis após autenticação. |
| `scripts/` | Inicialização do banco e criação do master. |
| `specs/` | Requisitos, desenhos e tarefas das funcionalidades. |
| `tests/` | Testes dos serviços. |

## Observações de segurança

O projeto atualmente armazena senhas com MD5 e mantém sessões apenas na memória do processo. Essas escolhas exigem revisão antes de usar a aplicação com dados reais ou expô-la à internet. Não compartilhe o arquivo `.env` nem a senha temporária do master.
