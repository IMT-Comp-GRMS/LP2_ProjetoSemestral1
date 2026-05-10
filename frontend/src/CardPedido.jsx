import React from 'react';
import { useDispatch } from 'react-redux';
import { salvarPedidosNoCofre } from './store/pedidosSlice';

const CardPedido = ({ pedido }) => {
  const dispatch = useDispatch();

  // 1. Definição da ordem das colunas (Igual ao que está no App.jsx)
  const ordemColunas = [
    'Pedidos', 
    'Pagamento Confirmado', 
    'Pedido separado', 
    'Pedido Enviado', 
    'Pedido Entregue'
  ];

  // 2. Função para atualizar o status no Backend
  const atualizarStatus = async (novoStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/tarefas/${pedido.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      if (response.ok) {
        // Após atualizar no banco, buscamos a lista nova para atualizar o Redux
        const resLista = await fetch('http://localhost:3000/tarefas');
        const listaAtualizada = await resLista.json();
        dispatch(salvarPedidosNoCofre(listaAtualizada));
      }
    } catch (error) {
      console.error("Erro ao mover pedido:", error);
    }
  };

  // 3. Lógica dos botões
  const indexAtual = ordemColunas.indexOf(pedido.status);

  const handleAvancar = () => {
    if (indexAtual < ordemColunas.length - 1) {
      atualizarStatus(ordemColunas[indexAtual + 1]);
    }
  };

  const handleVoltar = () => {
    if (indexAtual > 0) {
      atualizarStatus(ordemColunas[indexAtual - 1]);
    }
  };

  // 4. Estilos Minimalistas Velato
  const cardStyle = {
    backgroundColor: '#FFFFFF',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const botaoStyle = {
    flex: 1,
    padding: '5px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '1px solid #3c5262',
    backgroundColor: 'transparent',
    color: '#3c5262',
    borderRadius: '2px'
  };

  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: '700', fontSize: '14px' }}>{pedido.titulo}</div>
      <div style={{ fontSize: '12px', color: '#6B7280' }}>{pedido.descricao}</div>
      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#a79261' }}>
        Ref: {pedido.responsavel}
      </div>

      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
        {/* Só mostra o botão voltar se não estiver na primeira coluna */}
        {indexAtual > 0 && (
          <button onClick={handleVoltar} style={botaoStyle}> ⬅ Voltar </button>
        )}
        
        {/* Só mostra o botão avançar se não estiver na última coluna */}
        {indexAtual < ordemColunas.length - 1 && (
          <button 
            onClick={handleAvancar} 
            style={{ ...botaoStyle, backgroundColor: '#3c5262', color: '#f6f0e7' }}
          > 
            Avançar ➡ 
          </button>
        )}
      </div>
    </div>
  );
};

export default CardPedido;