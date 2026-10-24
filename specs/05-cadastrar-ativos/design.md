# Design — Cadastrar Ativos

## Visão geral da solução

O módulo permitirá que usuários master cadastrem, visualizem, editem, excluam e recuperem ativos e tipos de ativos.

A implementação deve seguir os requisitos definidos em:

`05-cadastrar-ativos/requirements.md`

## Controle de acesso

O item **Ativos** deve ser apresentado no menu lateral somente para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `master`.

As permissões devem ser verificadas no frontend e no backend.

## Estrutura do menu

O menu lateral deve possuir o item **Ativos** com os seguintes submenus:

- Todos os ativos;
- Cadastrar ativo;
- Tipos de ativos;
- Lixeira;
- Tipos cadastrados dinamicamente.

Os submenus dos tipos devem ser criados conforme os tipos forem cadastrados.

> **Exemplo:**
>
> - Ativos
>   - Todos os ativos
>   - Laboratórios
>   - Projetores
>   - Caixas de som
>   - Tipos de ativos
>   - Lixeira

Ao selecionar um tipo, o sistema deve apresentar somente os ativos vinculados a ele.

## Dados do ativo

O formulário deve possuir:

- Identificador;
- Descrição opcional;
- Tipo;
- Situação;
- Botão para salvar;
- Botão para cancelar.

## Dados do tipo de ativo

O gerenciamento de tipos deve utilizar:

- Descrição do tipo.

## Estrutura da tela de ativos

A tela deve possuir:

- Título da página;
- Botão **Cadastrar ativo**;
- Filtro por tipo;
- Filtro por situação;
- Ordenação;
- Tabela de ativos;
- Paginação;
- Acesso à lixeira;
- Mensagens de sucesso e erro.

## Tabela de ativos

A tabela deve apresentar:

- Identificador;
- Descrição;
- Tipo;
- Situação;
- Opções.

As opções disponíveis devem ser:

- Visualizar;
- Editar;
- Excluir.

Cada página deve apresentar no máximo dez ativos.

## Fluxo principal

1. O usuário master realiza o login.
2. O sistema direciona o usuário para o dashboard.
3. O usuário seleciona o item **Ativos**.
4. O sistema verifica a permissão.
5. O sistema apresenta a tabela de ativos.
6. O usuário pode cadastrar, visualizar, editar ou excluir um ativo.
7. O sistema atualiza a tabela após cada operação.

## Fluxo de cadastro de ativo

1. O usuário seleciona **Cadastrar ativo**.
2. O sistema apresenta o formulário.
3. O usuário informa o identificador, a descrição, o tipo e a situação.
4. O sistema valida os dados.
5. O sistema verifica se o identificador está disponível.
6. O usuário confirma o cadastro.
7. O sistema salva o ativo.
8. O sistema atualiza a tabela e os submenus.

## Gerenciamento de tipos no formulário

Ao lado do campo **Tipo**, deve existir um botão **+**.

Esse botão deve abrir o gerenciamento dos tipos em uma janela modal ou painel lateral, sem retirar o usuário da tela de cadastro do ativo.

O gerenciamento deve permitir:

- Cadastrar um tipo;
- Editar um tipo;
- Excluir um tipo;
- Visualizar os tipos existentes.

Os dados já preenchidos no formulário do ativo devem ser mantidos enquanto o usuário gerencia os tipos.

## Fluxo de cadastro de tipo

1. O usuário está preenchendo o formulário de ativo.
2. O usuário seleciona o botão **+**.
3. O sistema abre o gerenciamento de tipos.
4. O usuário informa a descrição.
5. O sistema verifica se a descrição está disponível.
6. O sistema salva o tipo.
7. O sistema atualiza o campo **Tipo**.
8. O sistema seleciona automaticamente o novo tipo.
9. O usuário continua o cadastro do ativo sem perder os dados informados.

## Fluxo de edição de tipo

1. O usuário abre o gerenciamento de tipos.
2. O usuário seleciona a opção **Editar**.
3. O sistema apresenta a descrição atual.
4. O usuário altera a descrição.
5. O sistema valida a nova descrição.
6. O sistema solicita confirmação.
7. O usuário confirma a alteração.
8. O sistema atualiza o campo de tipos e os submenus.

## Fluxo de exclusão de tipo

1. O usuário abre o gerenciamento de tipos.
2. O usuário seleciona a opção **Excluir**.
3. O sistema verifica se existem ativos vinculados.
4. Se não existirem vínculos, o sistema solicita confirmação.
5. O usuário confirma a exclusão.
6. O sistema remove o tipo.
7. O sistema atualiza o campo de tipos e os submenus.

## Fluxo de edição de ativo

1. O usuário seleciona a opção **Editar**.
2. O sistema apresenta o formulário preenchido.
3. O usuário altera os dados.
4. O sistema valida as alterações.
5. O sistema apresenta uma mensagem de confirmação.
6. O usuário confirma a edição.
7. O sistema salva as alterações.
8. O sistema atualiza a tabela e os submenus.

## Fluxo de exclusão de ativo

1. O usuário seleciona a opção **Excluir**.
2. O sistema apresenta uma mensagem de confirmação.
3. O usuário confirma a exclusão.
4. O sistema registra a data da exclusão.
5. O sistema envia o ativo para a lixeira.
6. O sistema atualiza a tabela.

## Lixeira

A tela de ativos deve possuir um acesso para a opção **Lixeira**.

A lixeira deve apresentar:

- Identificador;
- Descrição;
- Tipo;
- Data da exclusão;
- Data prevista para exclusão definitiva;
- Opção para recuperar.

## Fluxo de recuperação

1. O usuário acessa a lixeira.
2. O sistema apresenta os ativos excluídos.
3. O usuário seleciona **Recuperar**.
4. O sistema verifica se o prazo de 30 dias ainda está válido.
5. O sistema verifica se o identificador está disponível.
6. O sistema verifica se o tipo ainda existe.
7. O sistema solicita confirmação.
8. O usuário confirma a recuperação.
9. O sistema restaura o ativo.
10. O sistema atualiza a tabela, a lixeira e os submenus.

## Validações

- O identificador é obrigatório e deve ser único.
- A descrição do ativo é opcional.
- O tipo é obrigatório.
- A descrição do tipo é obrigatória e deve ser única.
- As comparações devem ignorar diferenças entre letras maiúsculas e minúsculas.
- Um tipo relacionado a ativos não pode ser excluído.
- A edição e a exclusão devem exigir confirmação.
- Ativos excluídos devem permanecer na lixeira por 30 dias.
- A recuperação depende da disponibilidade do identificador.
- A recuperação depende da existência do tipo.
- Após 30 dias, o ativo deve ser excluído definitivamente.
- As operações principais devem exigir no máximo cinco cliques.

## Atualização dinâmica

Após cadastrar, editar ou excluir um ativo ou tipo, o sistema deve atualizar automaticamente:

- A tabela de ativos;
- O campo de seleção de tipos;
- Os submenus;
- Os filtros;
- A lixeira, quando necessário.

A atualização deve ocorrer sem recarregar toda a página.

## Decisões técnicas

- **Banco de dados:** MySQL;
- **Frontend:** HTML, CSS e JavaScript;
- **Backend:** Node.js;
- **Comunicação:** API REST;
- **Formato de dados:** JSON;
- **Controle de acesso:** sessão autenticada;
- **Exclusão de ativos:** lógica durante 30 dias;
- **Abordagem da interface:** Mobile First.

## Responsividade

- Todas as telas devem adaptar-se a celulares, tablets e computadores.
- Todas as tabelas devem ser responsivas.
- Em telas pequenas, as tabelas podem utilizar rolagem horizontal.
- As ações podem ser agrupadas em um menu no mobile.
- Os formulários devem utilizar uma coluna em telas pequenas.
- A janela de tipos deve adaptar-se à altura e à largura disponíveis.
- Os botões devem possuir tamanho adequado para interação por toque.
- O menu e os submenus devem funcionar corretamente no mobile.
- Nenhum conteúdo deve ultrapassar os limites da tela.