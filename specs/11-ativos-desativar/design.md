# Design — Desativar ativos

## Visão geral da solução

A funcionalidade permitirá que usuários com perfil **master** desativem e reativem ativos.

A desativação será utilizada quando um ativo estiver indisponível por defeito, manutenção, reforma ou outro impedimento. O ativo continuará cadastrado no sistema, mas não poderá ser utilizado em novas reservas enquanto estiver desativado.

Antes da desativação, o sistema verificará se existem reservas futuras vinculadas ao ativo. Caso existam, será apresentado um alerta solicitando a confirmação do usuário master.

Quando o usuário master confirmar a desativação de um ativo com reservas futuras, essas reservas futuras serão canceladas.

Quando o ativo for reativado, as reservas futuras canceladas automaticamente por essa desativação serão restauradas.

Todas as desativações e reativações deverão ser registradas no histórico do ativo.

## Dados utilizados

### Ativo

A tabela de ativos deverá possuir os seguintes campos relacionados à funcionalidade:

- `status`: indica se o ativo está ativo ou desativado;
- `motivo_desativacao`: motivo selecionado pelo usuário;
- `descricao_desativacao`: informações adicionais sobre a desativação;
- `desativado_em`: data e hora da desativação;
- `desativado_por`: identificação do usuário responsável.

O campo `status` deverá aceitar os valores:

- `ativo`;
- `desativado`.

O valor padrão deverá ser `ativo`.

### Histórico do ativo

Deverá ser criada uma estrutura para registrar as alterações de status dos ativos.

A tabela de histórico deverá conter:

- `id`;
- `ativo_id`;
- `usuario_id`;
- `operacao`;
- `status_anterior`;
- `status_novo`;
- `motivo`;
- `descricao`;
- `data_hora`.

O campo `operacao` deverá aceitar:

- `desativacao`;
- `reativacao`.

## Fluxos

### Fluxo de desativação

1. O usuário master acessa a listagem de ativos.
2. O sistema apresenta a situação atual de cada ativo.
3. O usuário seleciona a opção `Desativar`.
4. O sistema abre o formulário de desativação.
5. O usuário seleciona o motivo.
6. Caso o motivo seja `Outro`, o sistema exibe o campo de descrição obrigatória.
7. O usuário confirma a operação.
8. O backend valida a autenticação e o perfil do usuário.
9. O sistema verifica se o ativo existe e está ativo.
10. O sistema consulta se existem reservas futuras para o ativo.
11. Caso existam reservas futuras, o sistema exibe um alerta.
12. O usuário poderá confirmar ou cancelar a desativação.
13. Após a confirmação, as reservas futuras vinculadas ao ativo serão canceladas.
14. O status do ativo será alterado para `desativado`.
15. O sistema registra a data, a hora, o motivo e o usuário responsável.
16. A operação será adicionada ao histórico do ativo.
17. O sistema atualiza a interface e exibe uma mensagem de sucesso.

### Fluxo de reativação

1. O usuário master acessa a listagem de ativos.
2. O usuário seleciona a opção `Reativar` em um ativo desativado.
3. O sistema exibe uma janela de confirmação.
4. O usuário confirma a reativação.
5. O backend valida a autenticação e o perfil do usuário.
6. O sistema verifica se o ativo existe e está desativado.
7. O status do ativo será alterado para `ativo`.
8. As reservas futuras canceladas pela desativação desse ativo serão restauradas.
9. A operação será registrada no histórico.
10. O ativo voltará a ficar disponível para novas reservas.
11. O sistema atualiza a interface e exibe uma mensagem de sucesso.

### Fluxo de tentativa por usuário comum

1. O usuário comum acessa a listagem de ativos.
2. O sistema apresenta o status dos ativos.
3. As opções `Desativar` e `Reativar` não são exibidas.
4. Caso o usuário tente acessar diretamente um endpoint restrito, o backend deverá negar a operação.

## Interface

### Listagem de ativos

A listagem deverá apresentar:

- Nome do ativo;
- Identificação;
- Categoria;
- Status;
- Ações disponíveis.

O status deverá ser representado visualmente:

- **Ativo**: indicador verde;
- **Desativado**: indicador vermelho ou cinza.

Para usuários master:

- Ativos ativos deverão apresentar a ação `Desativar`;
- Ativos desativados deverão apresentar a ação `Reativar`;
- A opção de visualizar o histórico deverá estar disponível.

Para usuários comuns:

- O status poderá ser visualizado;
- As opções de desativação e reativação não serão apresentadas.

### Modal de desativação

O modal deverá apresentar:

- Nome do ativo;
- Identificação do ativo;
- Campo para seleção do motivo;
- Campo de descrição;
- Botão `Cancelar`;
- Botão `Desativar ativo`.

Motivos disponíveis:

- Defeito;
- Manutenção;
- Reforma;
- Outro.

O campo de descrição deverá ser exibido e tornar-se obrigatório quando o motivo selecionado for `Outro`.

### Alerta de reservas futuras

Quando existirem reservas futuras, o sistema deverá apresentar:

- Mensagem informando que o ativo possui reservas futuras;
- Quantidade de reservas encontradas;
- Data da reserva mais próxima;
- Botão `Cancelar`;
- Botão `Desativar e cancelar`.

A confirmação deverá cancelar as reservas futuras vinculadas ao ativo. Reservas concluídas e registros anteriores permanecem preservados.

### Modal de reativação

O modal deverá apresentar:

- Nome do ativo;
- Mensagem de confirmação;
- Botão `Cancelar`;
- Botão `Reativar ativo`.

### Histórico do ativo

O histórico deverá apresentar:

- Tipo da operação;
- Status anterior;
- Status resultante;
- Motivo;
- Descrição;
- Usuário responsável;
- Data e hora.

Os registros deverão ser apresentados do mais recente para o mais antigo.

## Endpoints

### Desativar ativo

`PATCH /api/admin/ativos/:id/desativar`

Corpo da requisição:

~~~json
{
  "motivo": "manutencao",
  "descricao": "Manutenção preventiva do equipamento",
  "confirmarReservasFuturas": false
}
~~~

Possíveis respostas:

- `200`: ativo desativado com sucesso;
- `400`: dados inválidos ou confirmação necessária;
- `401`: usuário não autenticado;
- `403`: usuário sem permissão;
- `404`: ativo não encontrado;
- `409`: ativo já está desativado;
- `500`: erro interno do servidor.

### Reativar ativo

`PATCH /api/admin/ativos/:id/reativar`

Possíveis respostas:

- `200`: ativo reativado com sucesso;
- `401`: usuário não autenticado;
- `403`: usuário sem permissão;
- `404`: ativo não encontrado;
- `409`: ativo já está ativo;
- `500`: erro interno do servidor.

### Consultar histórico

`GET /api/admin/ativos/:id/historico`

Possíveis respostas:

- `200`: histórico retornado com sucesso;
- `401`: usuário não autenticado;
- `403`: usuário sem permissão;
- `404`: ativo não encontrado;
- `500`: erro interno do servidor.

## Validações

- O usuário deverá estar autenticado.
- Somente usuários master poderão alterar o status dos ativos.
- O motivo da desativação será obrigatório.
- O motivo deverá corresponder a uma opção válida.
- A descrição será obrigatória quando o motivo for `outro`.
- O ativo deverá existir.
- Apenas ativos ativos poderão ser desativados.
- Apenas ativos desativados poderão ser reativados.
- A confirmação será obrigatória quando existirem reservas futuras.
- Ativos desativados não poderão participar de novas reservas.
- Todas as validações de permissão deverão ser realizadas no backend.

## Integração com reservas

A consulta de ativos disponíveis deverá retornar somente ativos com status `ativo`.

O backend deverá verificar o status do ativo antes de:

- Criar uma reserva;
- Adicionar um ativo a uma reserva;
- Alterar o ativo associado a uma reserva;
- Confirmar uma reserva.

Caso o ativo esteja desativado, a operação deverá ser interrompida e uma mensagem deverá informar que ele está indisponível.

Reservas futuras vinculadas ao ativo serão canceladas quando a desativação for confirmada. Reservas concluídas e registros históricos não deverão ser removidos pela desativação.

Na reativação, somente as reservas futuras canceladas automaticamente pela desativação do ativo deverão ser restauradas. Cancelamentos manuais devem permanecer cancelados.

## Segurança

- Utilizar autenticação nos endpoints.
- Aplicar autorização por perfil no backend.
- Utilizar consultas parametrizadas.
- Sanitizar os campos de texto.
- Não utilizar apenas a ocultação dos botões como controle de acesso.
- Registrar o usuário responsável pelas alterações.
- Não permitir alterações diretas de status sem registro no histórico.

## Responsividade

A interface deverá seguir a abordagem **mobile first**.

Em telas menores:

- A listagem poderá ser apresentada em cartões;
- As ações deverão possuir áreas de toque adequadas;
- Os modais deverão ocupar a largura disponível;
- Os textos não deverão ultrapassar os limites da tela;
- Os botões poderão ocupar toda a largura;
- O histórico deverá permitir rolagem horizontal ou visualização em cartões.

A interface deverá adaptar-se a:

- Smartphones;
- Tablets;
- Notebooks;
- Monitores desktop.

## Decisões técnicas

- Banco de dados: MySQL;
- Backend: Node.js;
- Frontend: HTML, CSS e JavaScript;
- Arquitetura responsiva baseada em mobile first;
- Validação de permissões no frontend e no backend;
- Histórico persistido no banco de dados;
- Uso de transação para alterar o status e registrar o histórico;
- Preservação dos ativos e das reservas existentes;
- Comunicação entre frontend e backend por API REST.

## Tratamento de erros

O sistema deverá apresentar mensagens claras para:

- Usuário sem permissão;
- Ativo não encontrado;
- Ativo já desativado;
- Ativo já ativo;
- Motivo não informado;
- Descrição obrigatória não informada;
- Existência de reservas futuras;
- Falha de comunicação com o servidor;
- Erro ao registrar a alteração.

Em caso de erro ao registrar o histórico, a mudança de status deverá ser revertida para evitar inconsistências.
