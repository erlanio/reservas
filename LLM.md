# Instruções do Projeto para o Codex

## Sobre o projeto

Sistema de reservas de projetores, laboratórios, caixas de som ou outros tipos de ativos para um colégio. 

## Regras não-negociáveis

- Apenas usuários com nívei de acesso master poderá cadastrar, editar ou remover ativos (projetores, laboratórios, caixas de som ou outros tipos)

- Banco **MySQL**. Use o banco de dados MySQL para toda á aplicação.

- Interface obrigatória usando HTML, CSS,JavaScript e node. Ela deve ser responsiva, dinâmica com cores modernas e fontes modernas. 

- Use a ideia de **mobile first** para toda a aplicação. 

- Credenciais de banco **nunca** no código. Usar variáveis de ambiente `.env`.

- Sempre filtrar as reservas por data. 

### Como trabalhar neste repositório

1. Antes de implementar, leia a spec em `specs/<funcionalidade>` (requirements.md, desing.md, tasks.md).

2. Não implemente nada fora da spec. Se algo estiver ambíguo ou uma coluna não existir no diagrama, pare e pergunte, não invente.

3. Siga a ordem numérica das pastas em `specs/`.

4. Código fonte em `app/`, Testes em `tests/`. Crie `requirements.txt` com as dependências usadas.