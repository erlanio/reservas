# Design — Notificar Novos Usuários

## Visão geral da solução

O dashboard apresentará uma notificação aos usuários master quando existirem novos usuários aguardando aprovação.

A notificação exibirá a quantidade de cadastros pendentes e permitirá acessar diretamente a lista desses usuários.

## Controle de acesso

A notificação deve ser apresentada somente para usuários:

- Autenticados;
- Com situação `ativo`;
- Com nível de acesso `master`.

Usuários normais não devem visualizar nem consultar informações sobre cadastros pendentes.

## Dados utilizados

A funcionalidade utilizará:

- Identificador do usuário;
- Nome;
- E-mail;
- Situação do cadastro;
- Data do cadastro;
- Quantidade total de usuários pendentes.

A contagem deve considerar apenas usuários com situação `pendente` que não estejam na lixeira.

## Estrutura da notificação

A notificação deve apresentar:

- Ícone relacionado a usuários ou alerta;
- Título;
- Mensagem;
- Quantidade de cadastros pendentes;
- Ação para visualizar os usuários;
- Opção para fechar a notificação.

## Mensagens

Quando existir apenas um usuário pendente:

**“Existe 1 usuário aguardando aprovação.”**

Quando existirem vários usuários pendentes:

**“Existem X usuários aguardando aprovação.”**

Quando não existirem usuários pendentes, a notificação não deve ser apresentada.

## Indicador no menu

O item **Usuários** do menu lateral deve apresentar um indicador numérico com a quantidade de cadastros pendentes.

O indicador deve funcionar quando o menu estiver:

- Expandido;
- Recolhido;
- Aberto no mobile.

Quando a quantidade for zero, o indicador deve ser ocultado.

## Fluxo principal

1. O usuário master realiza o login.
2. O sistema direciona o usuário para o dashboard.
3. O frontend solicita a quantidade de usuários pendentes.
4. O backend verifica a autenticação e a permissão.
5. O backend consulta os usuários com situação `pendente`.
6. O backend retorna a quantidade.
7. O dashboard apresenta a notificação.
8. O menu apresenta o indicador numérico.
9. O master seleciona a notificação.
10. O sistema direciona para a tela de usuários.
11. O sistema aplica automaticamente o filtro `pendente`.

## Fluxo sem usuários pendentes

1. O usuário master acessa o dashboard.
2. O sistema consulta a quantidade de usuários pendentes.
3. O backend retorna a quantidade zero.
4. O dashboard não apresenta a notificação.
5. O menu não apresenta o indicador.

## Fluxo para fechar a notificação

1. O master seleciona a opção para fechar.
2. O sistema oculta temporariamente a notificação.
3. O indicador permanece disponível no menu.
4. Nenhum usuário é aprovado, rejeitado ou alterado.

## Fluxo de atualização

1. Um usuário realiza o autocadastro.
2. O sistema registra o cadastro como `pendente`.
3. O sistema atualiza a quantidade de pendências.
4. O dashboard e o indicador apresentam a nova quantidade.

A mesma atualização deve ocorrer após:

- Aprovação;
- Rejeição;
- Exclusão.

## Fluxo de erro

1. O dashboard solicita a quantidade de usuários pendentes.
2. Ocorre uma falha na consulta.
3. O dashboard continua funcionando.
4. O sistema registra o erro sem expor informações sensíveis.
5. O sistema pode apresentar a mensagem:

**“Não foi possível atualizar as notificações.”**

## Backend

O backend deve disponibilizar uma rota para consultar a quantidade de usuários pendentes.

### Exemplo de resposta com pendências

json
{
  "quantidade": 3
}