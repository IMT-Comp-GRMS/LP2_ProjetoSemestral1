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
    try {
        // 1. Pegamos a prioridade que veio do React (req.body)
        const { titulo, descricao, responsavel, prioridade } = req.body;
        const statusInicial = 'Pedidos'; 

        // 2. Adicionamos 'prioridade' no comando SQL
        const sql = 'INSERT INTO tarefas (titulo, descricao, responsavel, status, prioridade) VALUES (?, ?, ?, ?, ?)';
        
        // 3. Passamos o valor da prioridade para preencher o último '?'
        const [resultado] = await conexao.query(sql, [titulo, descricao, responsavel, statusInicial, prioridade]);
            
        res.status(201).json({
            id: resultado.insertId,
            titulo,
            descricao,
            responsavel,
            status: statusInicial,
            prioridade // Devolvemos para o React conferir
        });
    } catch(erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao criar pedido.' });
    }
});

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