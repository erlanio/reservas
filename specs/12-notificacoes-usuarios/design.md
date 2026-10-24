# Design — Notificações de usuários

## Visão geral da solução

A funcionalidade permitirá que usuários master e comuns recebam notificações sobre eventos relacionados ao cadastro e às reservas.

As notificações serão geradas quando:

- Um cadastro for aprovado;
- Um cadastro for rejeitado;
- Uma reserva for realizada;
- Uma reserva for aprovada;
- Uma reserva for alterada;
- Uma reserva for cancelada.

A aplicação deverá apresentar um ícone de notificações no cabeçalho ou menu principal, acompanhado da quantidade de notificações não lidas.

Cada usuário poderá visualizar e gerenciar somente suas próprias notificações.

## Dados utilizados

### Tabela de notificações

Deverá ser criada a tabela `notificacoes` com os seguintes campos:

- `id`: identificador da notificação;
- `usuario_id`: usuário destinatário;
- `tipo`: tipo da notificação;
- `titulo`: título exibido ao usuário;
- `mensagem`: conteúdo da notificação;
- `referencia_tipo`: tipo do registro relacionado;
- `referencia_id`: identificador do registro relacionado;
- `lida`: indica se a notificação foi lida;
- `lida_em`: data e hora da leitura;
- `created_at`: data e hora de criação;
- `updated_at`: data e hora da última atualização.

O campo `lida` deverá possuir o valor padrão `false`.

### Tipos de notificação

O campo `tipo` deverá aceitar:

- `cadastro_aprovado`;
- `cadastro_rejeitado`;
- `reserva_realizada`;
- `reserva_aprovada`;
- `reserva_alterada`;
- `reserva_cancelada`.

### Referências

As notificações poderão possuir referência a outros registros do sistema.

Para notificações relacionadas a reservas:

- `referencia_tipo`: `reserva`;
- `referencia_id`: identificação da reserva.

Para notificações relacionadas à validação cadastral, os campos de referência poderão ser nulos ou apontar para o cadastro correspondente.

## Fluxos

### Cadastro aprovado

1. O usuário master acessa a lista de cadastros pendentes.
2. O usuário master aprova um cadastro.
3. O backend conclui a atualização do cadastro.
4. O serviço de notificações cria uma notificação do tipo `cadastro_aprovado`.
5. A notificação informa que o acesso foi liberado.
6. O usuário visualiza a notificação após acessar o sistema.

### Cadastro rejeitado

1. O usuário master acessa a lista de cadastros pendentes.
2. O usuário master informa o motivo da rejeição.
3. O backend conclui a rejeição do cadastro.
4. O serviço cria uma notificação do tipo `cadastro_rejeitado`.
5. A notificação apresenta o motivo da rejeição.
6. O usuário visualiza a notificação ao acessar o sistema.

### Reserva realizada

1. Uma nova reserva é cadastrada.
2. O backend valida os dados e conclui a operação.
3. O serviço cria uma notificação do tipo `reserva_realizada`.
4. A notificação apresenta os dados principais da reserva.
5. A notificação é relacionada à reserva cadastrada.
6. O usuário poderá acessar os detalhes da reserva pela notificação.

### Reserva aprovada

1. Uma reserva fica aguardando aprovação.
2. O usuário master aprova a solicitação.
3. O backend atualiza a situação da reserva.
4. O serviço cria uma notificação do tipo `reserva_aprovada`.
5. O usuário solicitante recebe a notificação.
6. A notificação permite acessar os detalhes da reserva.

### Reserva alterada

1. Uma reserva existente é alterada.
2. O backend identifica as informações relevantes modificadas.
3. A alteração é concluída com sucesso.
4. O serviço cria uma notificação do tipo `reserva_alterada`.
5. A mensagem informa os principais dados modificados.
6. O usuário responsável pela reserva recebe a notificação.

### Reserva cancelada

1. Uma reserva existente é cancelada.
2. O responsável informa o motivo do cancelamento, quando necessário.
3. O backend conclui o cancelamento.
4. O serviço cria uma notificação do tipo `reserva_cancelada`.
5. A mensagem identifica a reserva, o responsável e o motivo do cancelamento.
6. O usuário solicitante recebe a notificação.

### Visualização das notificações

1. O usuário acessa o sistema.
2. O frontend consulta a quantidade de notificações não lidas.
3. O sistema apresenta o contador no ícone de notificações.
4. O usuário seleciona o ícone.
5. O sistema apresenta as notificações da mais recente para a mais antiga.
6. O usuário seleciona uma notificação.
7. O sistema marca a notificação como lida.
8. Quando houver uma referência válida, o usuário será direcionado ao registro relacionado.

### Marcar todas como lidas

1. O usuário acessa a lista de notificações.
2. O usuário seleciona `Marcar todas como lidas`.
3. O backend atualiza todas as notificações não lidas do usuário.
4. O frontend remove o contador de notificações não lidas.
5. A listagem é atualizada.

## Arquitetura

A solução deverá possuir um serviço centralizado de notificações.

Esse serviço será responsável por:

- Criar notificações;
- Validar os tipos permitidos;
- Definir o destinatário;
- Montar títulos e mensagens;
- Relacionar a notificação ao registro de origem;
- Evitar notificações duplicadas;
- Registrar falhas nos logs.

Os módulos de cadastro e reservas deverão chamar o serviço somente após a conclusão bem-sucedida da operação principal.

A falha na criação de uma notificação não deverá desfazer ou bloquear a operação principal.

## Serviço de notificações

O serviço deverá receber:

- Usuário destinatário;
- Tipo da notificação;
- Título;
- Mensagem;
- Tipo da referência;
- Identificação da referência;
- Identificador único do evento, quando aplicável.

Exemplo de uso:

~~~javascript
await notificationService.create({
  usuarioId: reserva.usuario_id,
  tipo: "reserva_aprovada",
  titulo: "Reserva aprovada",
  mensagem: "Sua reserva foi aprovada com sucesso.",
  referenciaTipo: "reserva",
  referenciaId: reserva.id
});
~~~

O serviço deverá validar:

- Existência do usuário destinatário;
- Tipo da notificação;
- Preenchimento do título;
- Preenchimento da mensagem;
- Existência do registro relacionado, quando aplicável;
- Duplicidade da notificação.

## Interface

### Indicador de notificações

O cabeçalho ou menu principal deverá apresentar:

- Ícone de sino;
- Contador de notificações não lidas;
- Descrição acessível;
- Ação para abrir a lista de notificações.

O contador deverá:

- Ser exibido somente quando houver notificações não lidas;
- Apresentar a quantidade total de notificações não lidas;
- Utilizar `99+` quando a quantidade for superior a 99;
- Ser atualizado após a leitura;
- Ser adaptado para telas menores.

### Lista resumida

Ao selecionar o ícone, o sistema poderá apresentar um painel contendo:

- As notificações mais recentes;
- Título;
- Resumo da mensagem;
- Data e hora;
- Indicador de leitura;
- Opção `Ver todas`;
- Opção `Marcar todas como lidas`.

### Página de notificações

A página completa deverá apresentar:

- Título da página;
- Filtro por tipo;
- Filtro por situação de leitura;
- Lista de notificações;
- Paginação ou carregamento progressivo;
- Ação para marcar todas como lidas.

Cada item deverá apresentar:

- Ícone associado ao tipo;
- Título;
- Mensagem;
- Data e hora;
- Indicador de notificação não lida;
- Link para o registro relacionado;
- Opção para marcar como lida.

### Estados da interface

A interface deverá tratar os seguintes estados:

- Carregamento;
- Lista vazia;
- Erro de carregamento;
- Notificações disponíveis;
- Nenhuma notificação não lida;
- Registro relacionado indisponível.

## Apresentação por tipo

As notificações poderão utilizar os seguintes indicadores:

- Cadastro aprovado: ícone de confirmação e cor verde;
- Cadastro rejeitado: ícone de alerta e cor vermelha;
- Reserva realizada: ícone de calendário e cor azul;
- Reserva aprovada: ícone de confirmação e cor verde;
- Reserva alterada: ícone de edição e cor laranja;
- Reserva cancelada: ícone de cancelamento e cor vermelha.

As cores não deverão ser utilizadas como único meio de identificação. Cada tipo também deverá possuir ícone e texto.

## Endpoints

### Listar notificações

`GET /api/notificacoes`

Parâmetros opcionais:

- `pagina`;
- `limite`;
- `tipo`;
- `lida`.

Exemplo de resposta:

~~~json
{
  "notificacoes": [
    {
      "id": 15,
      "tipo": "reserva_aprovada",
      "titulo": "Reserva aprovada",
      "mensagem": "Sua reserva do ativo Projetor 01 foi aprovada.",
      "referenciaTipo": "reserva",
      "referenciaId": 42,
      "lida": false,
      "lidaEm": null,
      "createdAt": "2026-09-09T10:30:00.000Z"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 1,
    "totalPaginas": 1
  }
}
~~~

Possíveis respostas:

- `200`: notificações retornadas;
- `400`: filtros inválidos;
- `401`: usuário não autenticado;
- `500`: erro interno do servidor.

### Consultar quantidade não lida

`GET /api/notificacoes/nao-lidas/quantidade`

Exemplo de resposta:

~~~json
{
  "quantidade": 4
}
~~~

### Consultar uma notificação

`GET /api/notificacoes/:id`

Possíveis respostas:

- `200`: notificação encontrada;
- `401`: usuário não autenticado;
- `403`: notificação pertence a outro usuário;
- `404`: notificação não encontrada;
- `500`: erro interno do servidor.

### Marcar como lida

`PATCH /api/notificacoes/:id/lida`

Exemplo de resposta:

~~~json
{
  "mensagem": "Notificação marcada como lida.",
  "notificacao": {
    "id": 15,
    "lida": true,
    "lidaEm": "2026-09-09T10:35:00.000Z"
  }
}
~~~

Possíveis respostas:

- `200`: notificação marcada como lida;
- `401`: usuário não autenticado;
- `403`: notificação pertence a outro usuário;
- `404`: notificação não encontrada;
- `500`: erro interno do servidor.

### Marcar todas como lidas

`PATCH /api/notificacoes/marcar-todas-como-lidas`

Exemplo de resposta:

~~~json
{
  "mensagem": "Todas as notificações foram marcadas como lidas.",
  "quantidadeAtualizada": 4
}
~~~

## Atualização das notificações

Inicialmente, o frontend poderá utilizar consultas periódicas para verificar novas notificações.

O intervalo deverá ser configurável e não deverá gerar requisições excessivas.

Fluxo recomendado:

1. Consultar a quantidade ao carregar a aplicação.
2. Repetir a consulta periodicamente enquanto o usuário estiver autenticado.
3. Atualizar o contador quando a quantidade for alterada.
4. Atualizar a lista quando o painel de notificações estiver aberto.
5. Interromper as consultas quando o usuário sair do sistema.

O projeto poderá adotar WebSocket ou Server-Sent Events posteriormente, caso seja necessária atualização em tempo real.

## Segurança

- Todos os endpoints deverão exigir autenticação.
- O backend deverá identificar o usuário por meio da sessão ou token.
- O usuário não deverá informar o próprio `usuario_id` para listar notificações.
- Cada consulta deverá ser limitada ao usuário autenticado.
- O sistema deverá impedir leitura ou alteração de notificações de outros usuários.
- Os filtros deverão ser validados.
- Os campos de texto deverão ser sanitizados.
- As consultas ao banco deverão ser parametrizadas.
- Informações sensíveis não deverão ser incluídas nas mensagens.
- Os links das notificações deverão respeitar as permissões do usuário.

## Prevenção de duplicidade

Cada evento poderá possuir uma chave única para impedir notificações duplicadas.

Exemplos:

- `cadastro_aprovado:{usuario_id}`;
- `cadastro_rejeitado:{usuario_id}:{data_evento}`;
- `reserva_realizada:{reserva_id}`;
- `reserva_aprovada:{reserva_id}`;
- `reserva_alterada:{reserva_id}:{versao}`;
- `reserva_cancelada:{reserva_id}`.

Antes de criar uma notificação, o serviço deverá verificar se a chave do evento já foi registrada.

## Tratamento de erros

O sistema deverá apresentar mensagens claras para:

- Falha ao carregar notificações;
- Notificação não encontrada;
- Tentativa de acesso não autorizado;
- Falha ao marcar como lida;
- Falha ao marcar todas como lidas;
- Registro relacionado não encontrado;
- Falha temporária de conexão.

Caso a criação da notificação falhe:

1. A operação principal deverá permanecer concluída.
2. O erro deverá ser registrado nos logs.
3. O sistema poderá realizar uma nova tentativa posteriormente.

## Responsividade

A interface deverá seguir a abordagem **mobile first**.

Em dispositivos móveis:

- O painel poderá ocupar toda a largura da tela;
- A lista deverá ser apresentada em cartões;
- Os textos deverão ser quebrados corretamente;
- Os controles deverão possuir áreas de toque adequadas;
- Os filtros poderão ser apresentados de forma recolhível;
- Os botões poderão ocupar toda a largura disponível.

A funcionalidade deverá adaptar-se a:

- Smartphones;
- Tablets;
- Notebooks;
- Monitores desktop.

## Acessibilidade

- O ícone deverá possuir um nome acessível.
- O contador deverá ser anunciado por leitores de tela.
- As notificações não lidas deverão possuir identificação textual.
- Os controles deverão ser acessíveis por teclado.
- O foco deverá ser visível.
- As cores deverão possuir contraste adequado.
- Ícones deverão ser acompanhados de texto ou descrição.
- Mensagens importantes poderão utilizar uma região `aria-live`.

## Decisões técnicas

- Banco de dados: MySQL;
- Backend: Node.js;
- Frontend: HTML, CSS e JavaScript;
- Comunicação por API REST;
- Autenticação por sessão ou token já utilizado pelo projeto;
- Serviço centralizado para criação de notificações;
- Interface desenvolvida com abordagem mobile first;
- Consultas periódicas para atualização inicial;
- Possibilidade de evolução para WebSocket ou Server-Sent Events;
- Paginação para evitar carregamento excessivo;
- Persistência das notificações após a leitura;
- Registro de erros em logs;
- Proteção contra notificações duplicadas.