/**
 * KpiCard — Card de métrica rápida para o topo do Dashboard.
 *
 * Props:
 *  - icone   {string}  Emoji ou símbolo exibido à esquerda do card.
 *  - titulo  {string}  Rótulo descritivo (ex: "Total de Pedidos").
 *  - valor   {number}  Número principal em destaque.
 *  - corDestaque {string} Cor CSS aplicada ao valor (usa paleta Velato).
 */
const KpiCard = ({ icone, titulo, valor, corDestaque = '#3c5262' }) => {
  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: '180px',
  };

  const iconeStyle = {
    fontSize: '32px',
    lineHeight: 1,
  };

  const textoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const tituloStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  };

  const valorStyle = {
    fontSize: '32px',
    fontWeight: '800',
    color: corDestaque,
    lineHeight: 1,
  };

  return (
    <div style={cardStyle}>
      <div style={iconeStyle}>{icone}</div>
      <div style={textoStyle}>
        <span style={tituloStyle}>{titulo}</span>
        <span style={valorStyle}>{valor}</span>
      </div>
    </div>
  );
};

export default KpiCard;
