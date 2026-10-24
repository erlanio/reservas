# Tasks — Desativar ativos

## 1. Banco de dados

- [x] Adicionar o campo `status` na tabela de ativos.
- [x] Definir os valores permitidos para o status: `ativo` e `desativado`.
- [x] Definir `ativo` como status padrão.
- [x] Adicionar o campo `motivo_desativacao`.
- [x] Adicionar o campo `descricao_desativacao`.
- [x] Adicionar o campo `desativado_em`.
- [x] Adicionar o campo `desativado_por`, relacionando-o ao usuário responsável.
- [x] Adicionar controle para identificar reservas canceladas pela desativação do ativo.
- [x] Criar uma tabela para armazenar o histórico de desativações e reativações.
- [x] Criar e executar a migration correspondente.
- [x] Verificar se os ativos existentes permanecem com o status `ativo`.

## 2. Backend — Desativação

- [x] Criar o endpoint para desativar um ativo.
- [x] Permitir acesso ao endpoint somente para usuários master.
- [x] Validar se o ativo informado existe.
- [x] Validar se o ativo já está desativado.
- [x] Validar o preenchimento obrigatório do motivo.
- [x] Disponibilizar os motivos `defeito`, `manutencao`, `reforma` e `outro`.
- [x] Exigir uma descrição quando o motivo selecionado for `outro`.
- [x] Consultar se o ativo possui reservas futuras.
- [x] Retornar um alerta quando existirem reservas futuras vinculadas ao ativo.
- [x] Exigir confirmação para desativar um ativo com reservas futuras.
- [x] Cancelar reservas futuras quando a desativação for confirmada.
- [x] Alterar o status do ativo para `desativado`.
- [x] Registrar data, hora e usuário responsável pela desativação.
- [x] Registrar a operação no histórico do ativo.
- [x] Retornar uma mensagem de sucesso após a desativação.

## 3. Backend — Reativação

- [x] Criar o endpoint para reativar um ativo.
- [x] Permitir acesso ao endpoint somente para usuários master.
- [x] Validar se o ativo informado existe.
- [x] Validar se o ativo está desativado.
- [x] Alterar o status do ativo para `ativo`.
- [x] Restaurar reservas futuras canceladas pela desativação do ativo.
- [x] Limpar ou arquivar os dados da desativação atual.
- [x] Registrar data, hora e usuário responsável pela reativação.
- [x] Registrar a operação no histórico do ativo.
- [x] Retornar uma mensagem de sucesso após a reativação.

## 4. Integração com reservas

- [x] Impedir a criação de reservas para ativos desativados.
- [x] Impedir que ativos desativados sejam adicionados durante a edição de uma reserva.
- [x] Remover ativos desativados das opções disponíveis no formulário de reserva.
- [x] Exibir o status de indisponibilidade quando necessário.
- [x] Preservar as reservas concluídas vinculadas ao ativo.
- [x] Restaurar as reservas futuras canceladas automaticamente ao reativar o ativo.
- [x] Preservar o histórico de reservas do ativo.
- [x] Verificar novamente o status do ativo no backend antes de confirmar uma reserva.

## 5. Interface — Listagem de ativos

- [x] Exibir o status de cada ativo na listagem.
- [x] Adicionar identificação visual para ativos ativos e desativados.
- [x] Exibir a opção `Desativar` somente para usuários master.
- [x] Exibir a opção `Reativar` somente para usuários master.
- [x] Ocultar as opções de alteração de status para usuários comuns.
- [x] Atualizar a listagem após uma desativação ou reativação.
- [x] Garantir que a tabela seja responsiva em dispositivos móveis.

## 6. Interface — Desativação

- [x] Criar o modal ou formulário de desativação.
- [x] Exibir o nome e a identificação do ativo selecionado.
- [x] Criar o campo de seleção do motivo.
- [x] Exibir o campo de descrição quando o motivo for `outro`.
- [x] Validar os campos obrigatórios antes do envio.
- [x] Exibir um alerta quando o ativo possuir reservas futuras.
- [x] Solicitar confirmação antes de concluir a desativação.
- [x] Exibir mensagem de sucesso ou erro após a operação.
- [x] Garantir que o formulário seja responsivo.

## 7. Interface — Reativação

- [x] Criar o modal de confirmação da reativação.
- [x] Exibir o nome e a identificação do ativo.
- [x] Solicitar confirmação antes de reativar.
- [x] Exibir mensagem de sucesso ou erro após a operação.
- [x] Atualizar o status apresentado na interface.
- [x] Garantir que o modal seja responsivo.

## 8. Histórico

- [x] Criar o endpoint para consultar o histórico do ativo.
- [x] Restringir o acesso ao histórico conforme as permissões do sistema.
- [x] Exibir o tipo da operação: `desativacao` ou `reativacao`.
- [x] Exibir o motivo e a descrição da desativação.
- [x] Exibir o usuário responsável pela operação.
- [x] Exibir a data e a hora da operação.
- [x] Ordenar o histórico do registro mais recente para o mais antigo.
- [x] Criar uma interface responsiva para visualizar o histórico.

## 9. Segurança e validações

- [x] Validar a autenticação em todos os endpoints.
- [x] Validar no backend se o usuário possui perfil master.
- [x] Não confiar apenas na ocultação dos botões da interface.
- [x] Sanitizar os dados informados nos campos de texto.
- [x] Utilizar consultas parametrizadas no banco de dados.
- [x] Retornar códigos HTTP adequados para sucesso e erro.
- [x] Impedir alterações de status duplicadas ou inválidas.

## 10. Testes

- [x] Testar a desativação de um ativo sem reservas futuras.
- [x] Testar a desativação de um ativo com reservas futuras.
- [x] Testar a confirmação da desativação com reservas futuras.
- [x] Testar o cancelamento da desativação.
- [x] Testar a reativação de um ativo.
- [x] Testar a restauração das reservas futuras na reativação.
- [x] Testar a tentativa de desativação por usuário comum.
- [x] Testar a tentativa de reativação por usuário comum.
- [x] Testar a desativação sem motivo.
- [x] Testar o motivo `outro` sem descrição.
- [x] Testar a criação de reserva com ativo desativado.
- [x] Testar a edição de reserva com ativo desativado.
- [x] Testar a preservação de reservas concluídas.
- [x] Testar o registro do histórico.
- [x] Testar a interface em desktop, tablet e smartphone.

## 11. Critérios para conclusão

- [x] Somente usuários master conseguem desativar e reativar ativos.
- [x] Ativos desativados não podem receber novas reservas.
- [x] Reservas e registros anteriores permanecem preservados.
- [x] O sistema alerta sobre reservas futuras antes da desativação.
- [x] Todas as mudanças de status são registradas no histórico.
- [x] A interface funciona corretamente em diferentes tamanhos de tela.
- [x] Todos os testes foram executados com sucesso.
