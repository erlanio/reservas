# Design — Gerenciar Usuários

## Visão geral da solução

O módulo permitirá que usuários master visualizem, editem, aprovem, rejeitem, excluam e recuperem usuários cadastrados.

A implementação deve seguir os requisitos definidos em:

`04-gerenciar-usuarios/requirements.md`

## Controle de acesso

O item **Usuários** deve ser apresentado no menu lateral somente para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `master`.

As permissões devem ser verificadas no frontend e no backend.

## Estrutura da tela

A tela deverá possuir:

- Título da página;
- Tabela de usuários;
- Ordenação por nome;
- Paginação;
- Opções de edição, exclusão, aprovação e rejeição;
- Link ou botão para acessar a lixeira;
- Mensagens de confirmação, sucesso e erro.

## Dados apresentados

A tabela principal deverá apresentar somente:

- Nome;
- E-mail;
- Situação;
- Opções.

Cada página deve apresentar no máximo dez usuários.

## Opções da tabela

As opções disponíveis devem ser:

- **Editar:** disponível para usuários cadastrados;
- **Excluir:** disponível para usuários que não estão na lixeira;
- **Aprovar:** disponível para usuários pendentes;
- **Rejeitar:** disponível para usuários pendentes;
- **Visualizar:** permite consultar todos os dados do usuário.

## Fluxo principal

1. O usuário master realiza o login.
2. O sistema direciona o usuário para o dashboard.
3. O master seleciona o item **Usuários**.
4. O sistema verifica a permissão de acesso.
5. O sistema apresenta a tabela de usuários.
6. O master pode ordenar a lista por nome.
7. O master seleciona uma ação.
8. O sistema executa a ação após as validações.
9. O sistema atualiza a tabela.

## Fluxo de edição

1. O master seleciona a opção **Editar**.
2. O sistema apresenta o formulário preenchido.
3. O master altera os dados desejados.
4. O sistema valida os dados.
5. O sistema apresenta uma mensagem de confirmação.
6. O master confirma a alteração.
7. O sistema atualiza o usuário.
8. O sistema apresenta uma mensagem de sucesso.
9. O sistema atualiza a tabela.

## Campos de edição

O master poderá editar:

- Nome;
- E-mail;
- Data de nascimento;
- Nível de acesso;
- Situação;
- Senha.

A senha atual nunca deve ser exibida. Caso seja necessário alterá-la, o master deverá informar uma nova senha, que será protegida utilizando `bcrypt`.

## Fluxo de aprovação

1. O master localiza um usuário pendente.
2. O master seleciona a opção **Aprovar**.
3. O sistema apresenta uma mensagem de confirmação.
4. O master confirma a aprovação.
5. O sistema altera a situação para `ativo`.
6. O sistema atualiza a tabela.

## Fluxo de rejeição

1. O master localiza um usuário pendente.
2. O master seleciona a opção **Rejeitar**.
3. O sistema apresenta uma mensagem de confirmação.
4. O master confirma a rejeição.
5. O sistema altera a situação para `rejeitado`.
6. O sistema atualiza a tabela.

## Fluxo de exclusão

1. O master seleciona a opção **Excluir**.
2. O sistema apresenta uma mensagem de confirmação.
3. O master confirma a exclusão.
4. O sistema registra a data da exclusão.
5. O sistema envia o usuário para a lixeira.
6. O sistema informa que o usuário permanecerá na lixeira por 30 dias.
7. O sistema atualiza a tabela.

## Lixeira

A tela de usuários deverá possuir um botão ou link chamado **Lixeira**.

A lixeira deverá apresentar:

- Nome;
- E-mail;
- Data da exclusão;
- Data da exclusão definitiva;
- Opção para recuperar.

## Fluxo de recuperação

1. O master acessa a lixeira.
2. O sistema apresenta os usuários excluídos.
3. O master seleciona a opção **Recuperar**.
4. O sistema verifica se o prazo de 30 dias ainda está válido.
5. O sistema verifica se o e-mail está disponível.
6. O sistema solicita confirmação.
7. O master confirma a recuperação.
8. O sistema restaura o usuário.
9. O sistema atualiza a listagem e a lixeira.

## Validações

- Apenas usuários master podem acessar o módulo.
- O e-mail deve ser válido e único.
- O sistema não deve apresentar usuários da lixeira na tabela principal.
- A edição deve exigir confirmação.
- A exclusão deve exigir confirmação.
- A aprovação e a rejeição devem exigir confirmação.
- Um master não pode excluir a própria conta.
- O último usuário master ativo não pode ser excluído ou rebaixado.
- A recuperação somente pode ocorrer dentro do prazo de 30 dias.
- A recuperação deve ser impedida quando o e-mail estiver em uso.
- Após 30 dias, o usuário deve ser excluído definitivamente.

## Atualização dinâmica

Após editar, aprovar, rejeitar, excluir ou recuperar um usuário, o sistema deverá atualizar automaticamente:

- A tabela principal;
- A paginação;
- A quantidade de usuários pendentes;
- A lixeira.

A atualização deve ocorrer sem recarregar toda a página.

## Decisões técnicas

- **Banco de dados:** MySQL;
- **Frontend:** HTML, CSS e JavaScript;
- **Backend:** Node.js;
- **Comunicação:** API REST;
- **Formato de dados:** JSON;
- **Proteção de senhas:** `bcrypt`;
- **Controle de acesso:** sessão autenticada;
- **Exclusão:** lógica durante 30 dias;
- **Abordagem da interface:** Mobile First.

## Responsividade

- A tela deve adaptar-se a celulares, tablets e computadores.
- A tabela deve ser responsiva.
- Em telas pequenas, a tabela poderá utilizar rolagem horizontal.
- As opções podem ser agrupadas em um menu no mobile.
- Os botões devem possuir tamanho adequado para interação por toque.
- A paginação deve adaptar-se à largura da tela.
- Nenhum conteúdo deve ultrapassar os limites da tela.