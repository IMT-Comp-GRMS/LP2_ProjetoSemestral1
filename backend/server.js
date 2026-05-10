const express = require('express') 
const cors = require('cors')
const dotenv = require('dotenv').config()
const app = express()
const mysql = require('mysql2/promise')
app.use(cors())
app.use(express.json())

let conexao

async function conectar(){
    conexao = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USERBD,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    })
    console.log('Conectado ao MySQL!')
}

conectar()

app.get('/', (req, res) => {
    res.json({
        mensagem: 'Servidor funcionando'
    })
})

app.get('/tarefas', async (req, res) => {
    try{
        const [linhas] = await conexao.query('SELECT * FROM tarefas')
        res.json(linhas)
    } catch(erro){
        res.status(500).json({
            erro: 'Erro ao buscar tarefas.'
        })
    }
})

app.post('/tarefas', async (req, res) => {
    try{
        // Agora pegamos também o responsavel que vem do frontend
        const { titulo, descricao, responsavel } = req.body
        
        // Definimos que todo pedido novo nasce na primeira coluna ('Pedidos')
        const statusInicial = 'Pedidos' 

        const sql = 
            'INSERT INTO tarefas'
            + ' (titulo, descricao, responsavel, status)'
            + ' VALUES (?, ?, ?, ?)'
            
        const [resultado] = 
            await conexao.query(sql, [titulo, descricao, responsavel, statusInicial])
            
        res.status(201).json({
            id: resultado.insertId,
            titulo,
            descricao,
            responsavel,
            status: statusInicial
        })
    } catch(erro){
        console.error("Erro no POST:", erro);
        res.status(500).json({
            erro: 'Erro ao criar tarefa.'
        })
    }
})

// ==============================================================================
// ROTA PUT: Atualiza o status de um pedido existente (Mover no Kanban)
// ==============================================================================
app.put('/tarefas/:id', async (req, res) => {
  // 1. Pegamos o ID do pedido que veio na URL (ex: /tarefas/5)
  const idDoPedido = req.params.id; 
  
  // 2. Pegamos o novo status que o frontend nos enviou no corpo da requisição
  const { status } = req.body; 

  try {
    // 3. Comando SQL para atualizar APENAS a coluna 'status' do pedido com este ID
    const sql = 'UPDATE tarefas SET status = ? WHERE id = ?';
    
    const [resultado] = await conexao.execute(sql, [status, idDoPedido]);

    // Se o banco de dados não encontrou nenhuma linha com esse ID
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Pedido não encontrado no banco de dados.' });
    }

    // Devolve uma resposta de sucesso para o frontend
    res.status(200).json({ mensagem: 'Status atualizado com sucesso!' });
    
  } catch (erro) {
    console.error("Erro ao atualizar status:", erro);
    res.status(500).json({ erro: 'Erro interno no servidor ao tentar atualizar.' });
  }
});

// ==============================================================================
// ROTA DELETE: Remove um pedido do banco de dados
// ==============================================================================
app.delete('/tarefas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'DELETE FROM tarefas WHERE id = ?';
    const [resultado] = await conexao.query(sql, [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Pedido excluído com sucesso!' });
  } catch (erro) {
    console.error("Erro ao excluir:", erro);
    res.status(500).json({ erro: 'Erro ao excluir o pedido.' });
  }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000.')
})