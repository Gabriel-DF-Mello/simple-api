# simple-api
This is a repository for a simple API, 

Isso é um repositório para uma API simples


## Informações Gerais
Essa API tem o propósito de permitir o gerenciamento de caixa e geração de relatórios, possuindo autenticação de dois tipos de usuários via JWT, eles são:
- comum (com privilégio de visualização) 
- administrador (com privilégio total)
As informações do sistema são armazenadas em um banco de dados relacional MySql.

## Específicos

### app.js
Servidor principal da API, possui as seguintes rotas:

#### /login
Rota pela qual um usuário é autenticado pelo sistema através de seu email e senha, e em seguida gera os tokens de acesso e reativação para o usuário

#### /logout
Rota pela qual o usuário sai do sistema e tem seus tokens apagados.

#### /refresh_token
Rota gera um novo token de acesso para o usuário através do token de reativação, permitindo que ele siga no sistema

### connection.js
Possui os métodos para gerar uma conexão com o banco de dados

### isAuth.js
Possui métodos para autenticação dos usuários

#### isAuth
Retorna o id do usuário caso ele esteja autenticado no sistema

#### isAdmin
Retorna o id do usuário caso ele esteja autenticado no sistema e é um administrador

### tokens.js
Possui os métodos referentes a criação e envio dos Tokens JWT que são utilizados para autenticação

#### createAccessToken
Cria token de acesso para o usuário, possuindo seu id e nível de permissão
#### createRefreshToken
Cria token de reativação para o usuário, possuindo seu id e nível de permissão
#### sendAccessToken
Envia o token de acesso
#### sendRefreshToken
Envia o token de reativação e cria um cookie local que o contém

### routes
Possui as rotas de gerenciamento dos diferentes módulos do sistema

#### usuarios.js
Possui o CRUD para os usuários, todos tem acesso a criação e visualização, apenas administradores podem editar ou excluir

#### pagamentos.js
possui o CRUD para saídas do caixa, todos tem acesso a visualização, apenas administradores podem criar, editar ou excluir

#### recebimentos.js
possui o CRUD para entradas no caixa, todos tem acesso a visualização, apenas administradores podem criar, editar ou excluir

#### relatorios.js
Possui métodos para geração de relatórios, todos os usuários tem acesso

## Banco de dados
O banco de dados do sistema possui as seguintes tabelas

### Usuarios
- id: (int) identificador
- nome: (varchar) nome do usuário
- email: (varchar) email do usuário
- senha: (varchar) senha criptografada do usuário
- permit: (boolean) nível do acesso do usuário

### Pagamentos
- id: (int) identificador
- valor: (numeric) valor do pagamento
- data_p: (date) data em que o pagamento foi ou vai ser realizado
- realizado: (boolean) denota se o valor ja foi retirado do caixa ou foi apenas agendado.

### Recebimentos
- id: (int) identificador
- valor: (numeric) valor recebido
- data_r: (date) data em que o recebimento foi ou vai ser realizado
- realizado: (boolean) denota se o valor ja foi depositado no caixa ou foi apenas agendado.

