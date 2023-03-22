
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const port = 3000

const transactions = [
  {
    "transactionType": "Egreso",
    "transactionDescription": "amburguesa",
    "transactionAmount": "10",
    "transactionCategory": "Comida",
    "transactionId": 1
  },
  {
    "transactionType": "Ingreso",
    "transactionDescription": "cheque",
    "transactionAmount": "500",
    "transactionCategory": "Salario",
    "transactionId": 7
  },
  {
    "transactionType": "Egreso",
    "transactionDescription": "billete tren",
    "transactionAmount": "7",
    "transactionCategory": "Tramsporte",
    "transactionId": 10
  },
  {
    "transactionType": "Ingreso",
    "transactionDescription": "salario",
    "transactionAmount": "1000",
    "transactionCategory": "Salario",
    "transactionId": 11
  },
  {
    "transactionType": "Egreso",
    "transactionDescription": "Discoteca",
    "transactionAmount": "150",
    "transactionCategory": "Diversion",
    "transactionId": 12
  }
]



app.get('/', (req, res) => {
  res.send(`OK, ingresaron al http://localhost!: ${port}`)
})

app.get('/transactions', (req, res) => {
  res.send(transactions)
})

//Tambien podemos pedir una transaccion en particular poniendole el id
app.get('/transactions/:id', (req, res) => {
  const transactionId = req.params.id;
  const selectedTransaction = transactions.filter(transaction => transaction.transactionId == transactionId);
  res.send(selectedTransaction)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost: ${port}`)
})