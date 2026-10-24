# Tasks — Ajustar Gerenciamento de Reservas

## Navegação da tela

- [x] Ajustar a tela para os modos **Fazer reserva** e **Visualizar reservas**.
- [X] Posicionar as duas opções na parte superior da tela.
- [X] Destacar visualmente a opção selecionada.
- [X] Permitir a troca de modo sem recarregar toda a página.
- [X] Manter o padrão de cores e tipografia do sistema.

## Seleção da data

- [X] Definir a data atual como padrão.
- [X] Impedir a seleção de datas anteriores no frontend.
- [X] Impedir reservas em datas anteriores no backend.
- [X] Considerar o fuso horário configurado no sistema.
- [X] Atualizar os ativos e tempos após a alteração da data.

## Organização por tipo de ativo

- [X] Apresentar os tipos de ativos em abas.
- [X] Apresentar somente os tipos ativos.
- [X] Destacar a aba selecionada.
- [X] Listar somente os ativos pertencentes ao tipo selecionado.
- [X] Informar quando o tipo não possuir ativos.
- [X] Permitir rolagem horizontal das abas no mobile.

## Seleção de ativos

- [X] Permitir a seleção de um ou mais ativos.
- [X] Não apresentar ativos inativos, excluídos ou em manutenção.
- [X] Atualizar os tempos disponíveis ao alterar os ativos.
- [X] Limpar tempos selecionados que deixarem de estar disponíveis.

## Disponibilidade dos tempos

- [x] Não apresentar tempos indisponíveis para o ativo selecionado.
- [X] Consultar a disponibilidade pela combinação de ativo, data e tempo.
- [X] Considerar reservas ativas como bloqueio.
- [X] Considerar reservas pendentes como bloqueio.
- [X] Desconsiderar reservas canceladas ou rejeitadas.
- [X] Apresentar apenas tempos disponíveis no modo **Fazer reserva**.
- [X] Apresentar todos os tempos e suas situações no modo **Visualizar reservas**.
- [X] Informar quando não existirem tempos disponíveis.
- [X] Atualizar os tempos sem recarregar toda a página.

## Cadastro da reserva

- [X] Permitir a seleção de um ou mais tempos.
- [X] Posicionar o botão **Reservar** abaixo dos ativos e tempos.
- [X] Manter o botão desabilitado enquanto houver dados obrigatórios ausentes.
- [X] Verificar novamente a disponibilidade antes de salvar.
- [X] Criar uma reserva para cada combinação de ativo e tempo.
- [X] Salvar todas as combinações em uma única transação.
- [X] Cancelar toda a operação quando existir um conflito.
- [X] Informar quais horários não estão mais disponíveis.
- [X] Atualizar os tempos após o cadastro.
- [X] Exibir uma mensagem de confirmação.

## Visualização das reservas

- [X] Apresentar os tipos de ativos em abas.
- [X] Permitir a seleção de um ativo específico.
- [X] Permitir a seleção da data.
- [X] Exibir todos os tempos do ativo.
- [X] Identificar os tempos como livre, reservado, pendente ou indisponível.
- [X] Exibir o responsável pela reserva conforme as permissões.
- [X] Exibir o horário, a finalidade e a situação.
- [X] Atualizar a agenda após cadastrar, editar ou cancelar uma reserva.

## Tratamento de conflitos

- [X] Impedir duas reservas ativas ou pendentes para o mesmo ativo, data e tempo.
- [X] Tratar tentativas simultâneas de reserva no backend.
- [X] Exibir uma mensagem quando a disponibilidade for alterada.
- [X] Atualizar imediatamente a lista de tempos após um conflito.

## Responsividade

- [X] Aplicar a abordagem Mobile First.
- [X] Adaptar as abas para telas pequenas.
- [X] Adaptar a seleção de ativos e tempos.
- [X] Garantir que os elementos sejam adequados para interação por toque.
- [X] Manter o botão **Reservar** visível e acessível.
- [X] Testar a tela em mobile, tablet e desktop.

## Testes

- [X] Testar a troca entre os modos da tela.
- [X] Testar a tentativa de reserva em uma data anterior.
- [X] Testar a seleção de tipos de ativos.
- [X] Testar a filtragem de ativos por tipo.
- [X] Testar a seleção de múltiplos ativos.
- [X] Testar a seleção de múltiplos tempos.
- [X] Testar a ocultação de tempos ocupados.
- [X] Testar um ativo sem tempos disponíveis.
- [X] Testar reservas ativas e pendentes como bloqueios.
- [X] Testar reservas canceladas e rejeitadas.
- [X] Testar a criação das combinações de ativos e tempos.
- [X] Testar duas tentativas simultâneas para o mesmo horário.
- [X] Testar a visualização por data, tipo e ativo.
- [X] Testar a atualização dinâmica da agenda.
- [X] Testar a interface em diferentes tamanhos de tela.

## Critérios para conclusão

- [X] O usuário alterna entre **Fazer reserva** e **Visualizar reservas**.
- [X] O sistema impede reservas em datas anteriores.
- [X] Os ativos são organizados por tipo.
- [X] Tempos ocupados não aparecem como disponíveis para reserva.
- [X] O botão **Reservar** fica abaixo da seleção de ativos e tempos.
- [X] A disponibilidade é verificada novamente antes do cadastro.
- [X] O sistema impede reservas conflitantes.
- [X] A visualização apresenta todos os tempos e suas situações.
- [X] A interface funciona em mobile, tablet e desktop.

## Dependências

Esta especificação depende de:

- `02-login`;
- `03-dashboard`;
- `04-gerenciar-usuarios`;
- `05-cadastrar-ativos`;
- `06-gerenciar-tempos`;
- `08-gerenciar-reservas`.