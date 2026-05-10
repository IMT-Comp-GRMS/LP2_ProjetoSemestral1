import React from 'react';

// O "{ pedido }" aqui dentro dos parênteses são as PROPS. 
// É por aqui que esse componente vai receber as informações do App.jsx
const CardPedido = ({ pedido }) => {
  
  // Estilo isolado só para o cartão
  const cardStyle = {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    marginBottom: '10px' // Espaço entre um cartão e outro
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