import React from 'react';

// O "{ pedido }" aqui dentro dos parênteses são as PROPS. 
// É por aqui que esse componente vai receber as informações do App.jsx
const CardPedido = ({ pedido }) => {
  
  // Estilo isolado só para o cartão
  const cardStyle = {
    backgroundColor: '#FFFFFF',
    padding: '16px',
    borderRadius: '4px',
    border: '1px solid #E5E7EB', // Borda fina em vez de sombra gigante
    marginBottom: '12px'
  };

  return (
    <div style={cardStyle}>
      {/* Acessamos as propriedades (props) do pedido que veio de fora */}
      <strong style={{ display: 'block', marginBottom: '5px' }}>
        {pedido.titulo}
      </strong>
      
      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>
        {pedido.descricao}
      </p>
      
      <small style={{ color: '#777', fontWeight: 'bold' }}>
        {pedido.responsavel}
      </small>
    </div>
  );
};

export default CardPedido;