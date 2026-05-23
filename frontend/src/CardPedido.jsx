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

  const handleExcluir = async () => {
    // Uma confirmação simples para evitar cliques acidentais
    if (window.confirm(`Tem certeza que deseja excluir o pedido "${pedido.titulo}"?`)) {
      try {
        const response = await fetch(`http://localhost:3000/tarefas/${pedido.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Atualiza o Redux buscando a lista nova (igual fazemos no mover)
          const resLista = await fetch('http://localhost:3000/tarefas');
          const listaAtualizada = await resLista.json();
          dispatch(salvarPedidosNoCofre(listaAtualizada));
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  };

  // 4. Estilos Minimalistas Velato
  // Mapeamento de cores da Velato para prioridades
  const coresPrioridade = {
    1: '#ae4f48', // Alta - Vermelho
    2: '#a79261', // Média - Mostarda
    3: '#3c5262'  // Baixa - Azure/Cinza
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    padding: '15px',
    borderRadius: '4px',
    // Adiciona a borda colorida na esquerda baseada na prioridade
    borderLeft: `6px solid ${coresPrioridade[pedido.prioridade] || '#3c5262'}`,
    borderBottom: '1px solid #E5E7EB',
    borderRight: '1px solid #E5E7EB',
    borderTop: '1px solid #E5E7EB',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    cursor: 'pointer'
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
      {/* 1. O BOTÃO DE EXCLUIR ENTRA AQUI NO TOPO */}
      <button 
        onClick={handleExcluir}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#ae4f48', // Vermelho Velato
          zIndex: 10
        }}
        title="Excluir Pedido"
      >
        🗑️
      </button>

      {/* 2. CONTEÚDO DO CARD */}
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#071227' }}>
        ID: {pedido.id}
      </div>

      <div style={{ fontWeight: '700', fontSize: '14px', paddingRight: '20px' }}>
        {pedido.titulo}
      </div>
      
      <div style={{ fontSize: '12px', color: '#6B7280' }}>
        {pedido.descricao}
      </div>
      
      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#a79261' }}>
        Ref: {pedido.responsavel}
      </div>


      {/* 3. BOTÕES DE NAVEGAÇÃO NO RODAPÉ DO CARD */}
      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
        {indexAtual > 0 && (
          <button onClick={handleVoltar} style={botaoStyle}> ⬅ Voltar </button>
        )}
        
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