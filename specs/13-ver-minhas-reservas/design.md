# Design — Visualizar minhas reservas

## Visão geral da solução

A funcionalidade permitirá que usuários autenticados visualizem exclusivamente as reservas vinculadas à sua conta.

A tela `Minhas reservas` apresentará uma listagem clara e responsiva, com filtros, pesquisa, ordenação, paginação e acesso aos detalhes de cada reserva.

Por padrão, a listagem será aberta com a situação `aceita`, data inicial no dia atual e sem data final definida.

A identificação do proprietário das reservas será obtida no backend por meio da sessão ou token de autenticação. O frontend não deverá enviar o identificador do usuário para definir quais reservas serão apresentadas.

## Dados utilizados

### Reserva

A funcionalidade utilizará os seguintes dados da reserva:

- `id`: identificação da reserva;
- `usuario_id`: identificação do usuário proprietário;
- `ativo_id`: identificação do ativo reservado;
- `data_reserva`: data de utilização;
- `hora_inicio`: horário de início;
- `hora_fim`: horário de término;
- `finalidade`: finalidade da reserva;
- `observacoes`: informações adicionais;
- `status`: situação atual;
- `motivo_cancelamento`: motivo do cancelamento;
- `motivo_rejeicao`: motivo da rejeição;
- `created_at`: data e hora de criação;
- `updated_at`: data e hora da última alteração.

### Ativo

A consulta deverá incluir os seguintes dados do ativo:

- `id`;
- `nome`;
- `identificacao`;
- `categoria`;
- `descricao`;
- `status`.

### Situações da reserva

O campo `status` deverá considerar:

- `aceita`;
- `concluida`;
- `cancelada`.

## Fluxos

### Visualizar minhas reservas

1. O usuário realiza a autenticação.
2. O usuário seleciona `Minhas reservas` no menu.
3. O frontend solicita as reservas ao backend.
4. O backend identifica o usuário pela sessão ou token.
5. O backend consulta somente as reservas vinculadas ao usuário.
6. As reservas são ordenadas pela data em ordem crescente, seguida pelo horário e pelo id.
7. O sistema apresenta a listagem e a quantidade de resultados.
8. O usuário poderá filtrar ou visualizar os detalhes.

### Usuário sem reservas

1. O usuário acessa `Minhas reservas`.
2. O backend realiza a consulta.
3. Nenhuma reserva é encontrada para o usuário.
4. O sistema apresenta uma mensagem informando que ainda não existem reservas.
5. Quando permitido, a interface poderá apresentar um botão para realizar uma nova reserva.

### Aplicar filtros

1. O usuário informa um ou mais filtros.
2. O frontend valida os campos.
3. Os filtros são enviados ao backend.
4. O backend valida e sanitiza os parâmetros.
5. A consulta aplica os filtros somente às reservas do usuário autenticado.
6. A listagem é atualizada.
7. A quantidade de resultados encontrados é apresentada.

### Limpar filtros

1. O usuário seleciona `Limpar filtros`.
2. Todos os campos retornam aos valores iniciais.
3. A página atual retorna para a primeira página.
4. O sistema consulta novamente as reservas aceitas a partir da data atual.
5. A ordenação padrão pela data da reserva é restaurada.

### Visualizar detalhes

1. O usuário seleciona uma reserva.
2. O frontend solicita os detalhes ao backend.
3. O backend identifica o usuário autenticado.
4. O backend verifica se a reserva existe.
5. O backend verifica se a reserva pertence ao usuário.
6. Os detalhes são retornados quando a autorização for válida.
7. O sistema apresenta as informações da reserva.
8. A consulta não altera a situação da reserva.

### Tentativa de acesso indevido

1. O usuário tenta acessar diretamente uma reserva de outra pessoa.
2. O backend identifica o usuário autenticado.
3. O backend verifica que a reserva não pertence ao usuário.
4. O acesso é negado.
5. Nenhuma informação da reserva é retornada.
6. A tentativa poderá ser registrada nos logs.

## Arquitetura

A solução será dividida em:

- Rota de reservas;
- Middleware de autenticação;
- Controlador de reservas;
- Serviço de consulta;
- Repositório ou camada de acesso ao banco;
- Interface de listagem;
- Interface de detalhes.

O backend será responsável por todas as regras de segurança, filtragem, paginação e ordenação.

O frontend será responsável pela apresentação, interação com filtros e comunicação com a API.

No modelo atual do sistema, reservas são aceitas automaticamente e não possuem campos persistidos de finalidade e observações. A tela preserva esses espaços nos detalhes para compatibilidade futura, exibindo vazio quando não houver dados.

## Consulta das reservas

A consulta deverá relacionar as tabelas de reservas e ativos.

Exemplo conceitual:

~~~sql
SELECT
    r.id,
    r.data_reserva,
    r.hora_inicio,
    r.hora_fim,
    r.finalidade,
    r.status,
    r.created_at,
    a.id AS ativo_id,
    a.nome AS ativo_nome,
    a.identificacao AS ativo_identificacao,
    a.categoria AS ativo_categoria
FROM reservas r
INNER JOIN ativos a ON a.id = r.ativo_id
WHERE r.usuario_id = ?
ORDER BY r.data_reserva ASC, t.hora_inicio ASC, r.id ASC
LIMIT ? OFFSET ?;
~~~

O valor utilizado em `r.usuario_id` deverá ser obtido exclusivamente pelo backend a partir da autenticação.

## Interface

### Item de menu

O menu principal deverá apresentar:

- Ícone de calendário ou reservas;
- Texto `Minhas reservas`;
- Destaque visual quando a página estiver ativa.

### Cabeçalho da página

A página deverá apresentar:

- Título `Minhas reservas`;
- Texto breve de orientação;
- Quantidade de reservas encontradas;
- Botão para realizar uma nova reserva, quando permitido.

### Filtros

A área de filtros deverá conter:

- Campo de pesquisa pelo nome ou identificação do ativo;
- Seleção da situação;
- Data inicial;
- Data final;
- Botão `Limpar filtros`.

Em dispositivos móveis, os filtros poderão ser apresentados em um painel recolhível.

### Listagem em telas maiores

Em telas maiores, as reservas poderão ser apresentadas em tabela com as colunas:

- Identificação;
- Ativo;
- Categoria;
- Data;
- Horário;
- Situação;
- Ações.

### Listagem em dispositivos móveis

Em telas menores, cada reserva deverá ser apresentada em um cartão contendo:

- Nome do ativo;
- Identificação da reserva;
- Data;
- Horário;
- Situação;
- Botão `Ver detalhes`.

### Identificação visual das situações

As situações deverão possuir texto, ícone e cor:

- `aceita`: verde;
- `concluida`: cinza;
- `cancelada`: vermelho.

As cores não deverão ser o único meio de identificação.

### Reservas prioritárias

A interface poderá destacar:

- Reservas aceitas do dia.

Reservas concluídas e canceladas deverão permanecer acessíveis sem o mesmo nível de destaque.

## Detalhes da reserva

A página ou modal de detalhes deverá apresentar:

### Identificação

- Número da reserva;
- Situação atual;
- Data de criação;
- Data da última alteração.

### Ativo

- Nome;
- Identificação;
- Categoria;
- Descrição;
- Situação do ativo.

### Agendamento

- Data da reserva;
- Horário de início;
- Horário de término;
- Duração calculada.

### Informações adicionais

- Finalidade;
- Observações;
- Motivo do cancelamento, quando aplicável;
- Motivo da rejeição, quando aplicável.

A interface deverá disponibilizar uma ação para retornar à listagem.

## Endpoints

### Listar minhas reservas

`GET /api/minhas-reservas`

Parâmetros opcionais:

- `pagina`;
- `limite`;
- `status`;
- `dataInicial`;
- `dataFinal`;
- `pesquisa`.

Quando `status` não for informado, o backend deverá usar `aceita`. Quando o usuário selecionar `Todas`, o frontend deverá enviar `status=todas`.

Exemplo:

~~~http
GET /api/minhas-reservas?pagina=1&limite=10&status=aceita&dataInicial=2026-09-09
~~~

Exemplo de resposta:

~~~json
{
  "reservas": [
    {
      "id": 42,
      "dataReserva": "2026-09-15",
      "horaInicio": "08:00",
      "horaFim": "10:00",
      "finalidade": "Apresentação de trabalho",
      "status": "aceita",
      "createdAt": "2026-09-09T10:30:00.000Z",
      "ativo": {
        "id": 7,
        "nome": "Projetor multimídia",
        "identificacao": "PROJ-007",
        "categoria": "Equipamento audiovisual"
      }
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 10,
    "total": 1,
    "totalPaginas": 1
  }
}
~~~

Possíveis respostas:

- `200`: reservas retornadas;
- `400`: filtros ou parâmetros inválidos;
- `401`: usuário não autenticado;
- `500`: erro interno do servidor.

### Visualizar detalhes

`GET /api/minhas-reservas/:id`

Exemplo de resposta:

~~~json
{
  "id": 42,
  "dataReserva": "2026-09-15",
  "horaInicio": "08:00",
  "horaFim": "10:00",
  "finalidade": "Apresentação de trabalho",
  "observacoes": "O equipamento será utilizado no auditório.",
  "status": "aceita",
  "motivoCancelamento": null,
  "motivoRejeicao": null,
  "createdAt": "2026-09-09T10:30:00.000Z",
  "updatedAt": "2026-09-09T11:00:00.000Z",
  "ativo": {
    "id": 7,
    "nome": "Projetor multimídia",
    "identificacao": "PROJ-007",
    "categoria": "Equipamento audiovisual",
    "descricao": "Projetor com entrada HDMI.",
    "status": "ativo"
  }
}
~~~

Possíveis respostas:

- `200`: reserva retornada;
- `401`: usuário não autenticado;
- `403`: acesso não autorizado;
- `404`: reserva não encontrada;
- `500`: erro interno do servidor.

## Filtros

### Situação

O filtro deverá aceitar somente:

- `aceita`;
- `concluida`;
- `cancelada`.

### Período

- `dataInicial` deverá possuir formato válido.
- `dataFinal` deverá possuir formato válido.
- A data inicial não poderá ser posterior à data final.
- O usuário poderá informar apenas uma das datas.
- A consulta deverá considerar a data da reserva.

### Pesquisa

A pesquisa deverá consultar:

- Nome do ativo;
- Identificação do ativo.

O texto deverá ser sanitizado antes de ser utilizado na consulta.

## Ordenação

A ordenação será fixa e aplicada pelo backend:

- Data da reserva em ordem crescente, usando horário e id como desempate.

## Paginação

A paginação deverá utilizar:

- `pagina`: página solicitada;
- `limite`: quantidade de registros por página;
- `total`: quantidade total de reservas;
- `totalPaginas`: quantidade total de páginas.

O limite deverá possuir valor padrão e máximo definido pelo backend.

Exemplo:

- Limite padrão: 10;
- Limite máximo: 50.

Quando os filtros forem alterados, a interface deverá retornar à primeira página.

## Estados da interface

### Carregamento

Enquanto a consulta estiver em andamento, o sistema deverá apresentar um indicador de carregamento.

### Lista vazia

Quando o usuário não possuir reservas, apresentar:

`Você ainda não possui reservas cadastradas.`

### Nenhum resultado

Quando os filtros não retornarem registros, apresentar:

`Nenhuma reserva foi encontrada com os filtros informados.`

### Erro

Quando ocorrer uma falha, apresentar:

`Não foi possível carregar suas reservas. Tente novamente.`

A interface deverá disponibilizar uma opção para repetir a consulta.

### Acesso negado

Quando o usuário tentar visualizar uma reserva sem autorização, apresentar:

`Você não possui permissão para visualizar esta reserva.`

Nenhum dado da reserva deverá ser exibido.

## Segurança

- Todos os endpoints deverão exigir autenticação.
- O usuário deverá ser identificado pela sessão ou token.
- O backend não deverá aceitar `usuario_id` para definir o proprietário da consulta.
- Todas as consultas deverão incluir o filtro do usuário autenticado.
- O usuário não poderá acessar reservas de outras pessoas.
- As consultas deverão ser parametrizadas.
- Os filtros deverão ser validados e sanitizados.
- Os campos de ordenação deverão ser comparados com uma lista permitida.
- Informações pessoais de outros usuários não deverão ser retornadas.
- Tentativas de acesso indevido poderão ser registradas nos logs.

## Responsividade

A interface deverá seguir a abordagem **mobile first**.

Em dispositivos móveis:

- As reservas deverão ser apresentadas em cartões;
- Os filtros poderão ficar em um painel recolhível;
- Os botões deverão ocupar a largura disponível quando necessário;
- Os controles deverão possuir áreas de toque adequadas;
- Os textos deverão ser quebrados corretamente;
- Nenhum conteúdo deverá ultrapassar a largura da tela.

Em telas maiores:

- A listagem poderá ser apresentada em tabela;
- Os filtros poderão ser exibidos em uma única linha;
- As principais informações deverão permanecer visíveis;
- As ações deverão ser agrupadas na última coluna.

A interface deverá adaptar-se a:

- Smartphones;
- Tablets;
- Notebooks;
- Monitores desktop.

## Acessibilidade

- Todos os campos deverão possuir rótulos.
- Os botões deverão possuir nomes acessíveis.
- A situação da reserva deverá ser informada por texto.
- O foco dos elementos deverá ser visível.
- A navegação deverá funcionar por teclado.
- Os indicadores deverão possuir contraste adequado.
- As mensagens de carregamento e erro deverão ser anunciadas por leitores de tela.
- A tabela deverá possuir cabeçalhos corretamente identificados.

## Decisões técnicas

- Banco de dados: MySQL;
- Backend: Node.js;
- Frontend: HTML, CSS e JavaScript;
- Comunicação entre frontend e backend por API REST;
- Autenticação por sessão ou token já utilizado pelo sistema;
- Identificação do usuário exclusivamente no backend;
- Consultas parametrizadas;
- Paginação realizada no servidor;
- Filtros e ordenação realizados no servidor;
- Interface desenvolvida com abordagem mobile first;
- Tabela para telas maiores e cartões para dispositivos móveis;
- Preservação das reservas concluídas e canceladas.
