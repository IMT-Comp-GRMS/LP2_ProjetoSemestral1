const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())

app.post('/eventos', (req, res) => {
    const evento = req.body
    //envia o evento para o microsserviço de criar pedido (vem do configurar pedido)
    axios.post('http://localhost:3000/eventos', evento)
    .catch((err) => {
        console.log('Microsserviço de lembretes fora do ar.')
    })
    axios.post('http://localhost:3001/eventos', evento)
    .catch((err) => {
        console.log('Microsserviço de observações fora do ar.')
    })
    //envia o evento para o microsserviço de dashboard (vem de criar pedido)
    axios.post('http://localhost:6000/eventos', evento)
    .catch((err) => {
        console.log('Microsserviço de consulta fora do ar.')
    })
    res.status(200).send({msg: 'ok'})
})

app.listen(10000, () => {
    console.log('Barramento de eventos. Porta 10000.')
})