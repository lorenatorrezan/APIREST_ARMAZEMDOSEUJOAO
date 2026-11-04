# API REST - Armazém do Seu João

API REST para gerenciar **produtos**, **clientes** e **pedidos** de um armazém.
Projeto da faculdade, feito em etapas (01 a 10).

## Tecnologias

- Node.js
- Express
- TypeScript
- SQLite (`sqlite3`)
- Zod (validação dos dados)
- tsx (executar TypeScript em desenvolvimento)

## Arquitetura

O projeto usa arquitetura em camadas:

```
Routes -> Controller -> Service -> Repository -> SQLite
```

- **Routes:** liga a URL ao controller.
- **Controller:** recebe a requisição, valida os dados com Zod e devolve a resposta.
- **Service:** guarda as regras de negócio.
- **Repository:** executa o SQL no banco.

## Estrutura de pastas

```
src/
├── app.ts
├── server.ts
├── config/          # conexão com o banco
├── controllers/
├── database/        # schema.sql, init.ts e seed.ts
├── errors/          # AppError
├── middlewares/     # tratador de erros
├── models/
├── repositories/
├── routes/
├── schemas/         # validações Zod
└── services/
```

## Como executar

Pré-requisitos: Node.js 20 ou superior e Git.

```bash
git clone https://github.com/lorenatorrezan/APIREST_ARMAZEMDOSEUJOAO.git
cd APIREST_ARMAZEMDOSEUJOAO
npm install
npm run db:init
npm run db:seed
npm run dev
```

A API sobe em `http://localhost:3000`.

| Comando | O que faz |
|---|---|
| `npm run db:init` | Cria o banco `database.db` e as tabelas |
| `npm run db:seed` | Insere dados de exemplo (rodar uma vez) |
| `npm run dev` | Sobe o servidor em modo desenvolvimento |
| `npm run build` | Compila o TypeScript para a pasta `dist` |
| `npm start` | Executa a versão compilada |

Para testar, use o arquivo `requests.http` com a extensão **REST Client** do VS Code.

## Endpoints

### Produtos (`/products`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/products` | Lista todos os produtos |
| GET | `/products/:id` | Busca um produto |
| POST | `/products` | Cria um produto |
| PUT | `/products/:id` | Atualiza um produto |
| DELETE | `/products/:id` | Remove um produto |

### Clientes (`/customers`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/customers` | Lista todos os clientes |
| GET | `/customers/:id` | Busca um cliente |
| GET | `/customers/:id/orders` | Lista os pedidos de um cliente |
| POST | `/customers` | Cria um cliente |
| PUT | `/customers/:id` | Atualiza um cliente |
| DELETE | `/customers/:id` | Remove um cliente |

### Pedidos (`/orders`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/orders` | Lista todos os pedidos |
| GET | `/orders/:id` | Busca um pedido, com os itens |
| POST | `/orders` | Cria um pedido |

## Exemplo: criar um pedido

`POST /orders`

```json
{
  "customer_id": 1,
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 2, "quantity": 3 }
  ]
}
```

Resposta (`201 Created`):

```json
{
  "id": 1,
  "customer_id": 1,
  "total": 86.3,
  "created_at": "2026-11-04 23:10:00",
  "items": [
    { "id": 1, "order_id": 1, "product_id": 1, "quantity": 2, "unit_price": 28.9 },
    { "id": 2, "order_id": 1, "product_id": 2, "quantity": 3, "unit_price": 9.5 }
  ]
}
```

O `total` é calculado pela API: 2 x 28,90 + 3 x 9,50 = 86,30.

## Regras de negócio

- **RN01:** não pode haver dois clientes com o mesmo e-mail.
- **RN05:** o preço de cada item é gravado no pedido no momento da venda, então mudar o preço do produto depois não altera pedidos antigos.
- **RN06:** um cliente que já tem pedidos não pode ser removido.
- **RN07:** um produto que já está em algum pedido não pode ser removido.
- Pedidos não podem ser alterados nem removidos.

## Códigos de resposta

| Código | Quando acontece |
|---|---|
| 200 | Consulta ou atualização feita com sucesso |
| 201 | Registro criado |
| 204 | Registro removido |
| 400 | Dados inválidos (validação do Zod) |
| 404 | Cliente, produto ou pedido não encontrado |
| 409 | Conflito com uma regra de negócio (e-mail duplicado, remoção bloqueada) |
| 500 | Erro interno no servidor |

## Autora

Lorena Torrezan
