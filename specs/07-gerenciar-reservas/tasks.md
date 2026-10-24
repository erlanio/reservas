# Tasks — Gerenciar Reservas

## Banco de dados

- [x] Criar tabela de reservas com vínculo entre usuário, ativo, tempo e data.
- [x] Salvar cada combinação de ativo e tempo como uma reserva individual.
- [x] Criar regra para impedir duas reservas ativas do mesmo ativo, tempo e data.
- [X] Criar índices para consultas por data, ativo, usuário, tempo e situação.
- [X] Garantir a integridade dos relacionamentos com usuários, ativos e tempos.
- [X] Impedir conflitos causados por solicitações simultâneas.

## Controle de acesso

- [x] Criar a tela de reservas para usuários master e normais.
- [X] Permitir o acesso somente para usuários autenticados e ativos.
- [X] Proteger as rotas de reservas no backend.
- [X] Permitir que usuários normais reservem somente em seu próprio nome.
- [x] Permitir que usuários master reservem para outros usuários validados.
- [X] Impedir reservas para usuários pendentes, rejeitados ou excluídos.

## Navegação da tela

- [X] Criar as opções **Fazer reserva** e **Visualizar reservas**.
- [X] Posicionar as opções na parte superior da tela.
- [X] Destacar visualmente a opção selecionada.
- [X] Alternar entre os modos sem recarregar toda a página.
- [X] Manter as cores e a tipografia dos demais módulos.

## Seleção de data

- [x] Permitir a visualização das reservas por data.
- [X] Definir a data atual como padrão.
- [X] Impedir a seleção de datas anteriores na criação da reserva.
- [X] Validar a data novamente no backend.
- [X] Considerar o fuso horário configurado para o sistema.
- [X] Atualizar os ativos e tempos ao alterar a data.

## Seleção por tipo de ativo

- [X] Organizar os tipos de ativos em abas.
- [X] Apresentar somente tipos ativos.
- [X] Destacar a aba selecionada.
- [X] Permitir rolagem horizontal das abas no mobile.
- [X] Exibir uma mensagem quando o tipo não possuir ativos.
- [X] Atualizar os ativos ao trocar de aba.

## Seleção de ativos

- [x] Permitir filtro de reservas por ativo.
- [x] Permitir a seleção de múltiplos ativos.
- [X] Apresentar somente os ativos do tipo selecionado.
- [X] Impedir a seleção de ativos inativos, excluídos ou em manutenção.
- [X] Atualizar os tempos disponíveis ao alterar os ativos.
- [X] Exibir uma mensagem quando não existirem ativos disponíveis.

## Seleção de tempos

- [x] Permitir a seleção de múltiplos tempos.
- [X] Consultar a disponibilidade dos tempos pela data e pelos ativos selecionados.
- [X] Apresentar somente os tempos disponíveis no modo **Fazer reserva**.
- [X] Considerar reservas ativas e pendentes como bloqueios.
- [X] Desconsiderar reservas canceladas, rejeitadas ou excluídas.
- [X] Atualizar os tempos quando a data ou os ativos forem alterados.
- [X] Informar quando não existirem tempos disponíveis.
- [X] Exigir a seleção de pelo menos um tempo.

## Cadastro de reservas

- [x] Criar o cadastro de reservas com múltiplos ativos e múltiplos tempos.
- [X] Criar os campos de finalidade e observações.
- [X] Posicionar o botão **Reservar** abaixo dos ativos e tempos.
- [X] Manter o botão desabilitado enquanto houver dados obrigatórios ausentes.
- [X] Verificar novamente a disponibilidade antes de salvar.
- [X] Criar todas as combinações entre ativos e tempos selecionados.
- [X] Executar o cadastro das combinações em uma transação.
- [X] Cancelar toda a operação se qualquer combinação possuir conflito.
- [X] Exibir os horários conflitantes.
- [X] Atualizar a disponibilidade após o cadastro.
- [X] Exibir uma mensagem de confirmação.

## Visualização de reservas

- [x] Permitir a visualização por data.
- [x] Permitir o filtro por ativo.
- [X] Organizar a visualização por tipo de ativo.
- [X] Apresentar os tipos em abas.
- [X] Permitir a seleção de um ativo específico.
- [X] Exibir todos os tempos do ativo selecionado.
- [X] Identificar os tempos como livre, reservado, pendente ou indisponível.
- [X] Exibir o responsável pela reserva conforme as permissões.
- [X] Exibir horário, finalidade e situação.
- [X] Atualizar a visualização após alterações nas reservas.

## Edição de reservas

- [x] Criar a edição de reservas.
- [x] Solicitar confirmação antes de salvar.
- [X] Verificar novamente a disponibilidade antes da edição.
- [X] Impedir que a edição gere conflito com outra reserva.
- [X] Atualizar a agenda após a edição.
- [X] Registrar quem realizou a alteração.

## Cancelamento de reservas

- [x] Tratar a exclusão como cancelamento.
- [x] Registrar quem realizou o cancelamento.
- [x] Manter reservas canceladas como histórico.
- [x] Impedir a recuperação ou exclusão definitiva de reservas canceladas.
- [X] Solicitar confirmação antes do cancelamento.
- [X] Registrar a data e o motivo do cancelamento.
- [X] Liberar os tempos após o cancelamento.
- [X] Atualizar a agenda após o cancelamento.

## Atualização dinâmica

- [X] Atualizar os tempos sem recarregar toda a página.
- [X] Atualizar a agenda após cadastrar, editar ou cancelar.
- [X] Exibir um indicador durante o carregamento.
- [X] Manter a data, o tipo e o ativo selecionados quando possível.
- [X] Informar quando a disponibilidade for alterada por outro usuário.

## Responsividade

- [X] Aplicar a abordagem Mobile First.
- [X] Adaptar as abas para dispositivos móveis.
- [X] Adaptar a seleção de ativos e tempos.
- [X] Garantir que os elementos sejam adequados para interação por toque.
- [X] Ajustar o botão **Reservar** para telas pequenas.
- [X] Adaptar a visualização das reservas para mobile, tablet e desktop.
- [X] Impedir que conteúdos ultrapassem os limites da tela.

## Testes

- [X] Testar o acesso de usuário normal.
- [X] Testar o acesso de usuário master.
- [X] Testar a tentativa de acesso de usuário não autenticado.
- [X] Testar a reserva para a data atual.
- [X] Testar a tentativa de reserva em uma data anterior.
- [X] Testar a seleção de tipos de ativos.
- [X] Testar o filtro de ativos por tipo.
- [X] Testar a seleção de múltiplos ativos.
- [X] Testar a seleção de múltiplos tempos.
- [X] Testar a criação de todas as combinações.
- [X] Testar a tentativa de reservar um tempo ocupado.
- [X] Testar duas solicitações simultâneas para o mesmo horário.
- [X] Testar a reserva de um master para outro usuário.
- [X] Testar a tentativa de reservar para um usuário pendente.
- [X] Testar a visualização por data, tipo e ativo.
- [X] Testar a edição sem conflito.
- [X] Testar a edição com conflito.
- [X] Testar a confirmação da edição.
- [X] Testar o cancelamento.
- [X] Testar a liberação do tempo após o cancelamento.
- [X] Testar a preservação do histórico.
- [X] Testar a interface em mobile, tablet e desktop.

## Critérios para conclusão

- [X] Apenas usuários autenticados e ativos acessam o módulo.
- [X] O usuário pode alternar entre criar e visualizar reservas.
- [X] O sistema impede reservas em datas anteriores.
- [X] Os ativos são organizados por tipo.
- [X] Tempos ocupados não aparecem como disponíveis para reserva.
- [X] O sistema impede conflitos de ativo, tempo e data.
- [X] Reservas com múltiplos ativos e tempos são salvas corretamente.
- [X] Usuários master conseguem reservar para outros usuários ativos.
- [X] As reservas podem ser visualizadas por data, tipo e ativo.
- [X] A edição exige confirmação e não gera conflitos.
- [X] O cancelamento mantém o histórico e libera o horário.
- [X] A interface funciona em mobile, tablet e desktop.

## Dependências

Esta especificação depende de:

- `02-login`;
- `03-dashboard`;
- `04-gerenciar-usuarios`;
- `05-cadastrar-ativos`;
- `06-gerenciar-tempos`.

O dashboard de reservas depende da conclusão desta especificação.