/**
 * GraficoProdutos — Gráfico de barras horizontal mostrando o ranking
 * dos produtos mais presentes nos pedidos.
 *
 * Props:
 *  - dados {Array<{ nome: string, pedidos: number }>}
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Paleta de cores da Velato aplicada barra a barra
const CORES_VELATO = ['#3c5262', '#a79261', '#ae4f48', '#2e1172', '#252623'];

// Tooltip customizado
const TooltipCustomizado = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#252623',
        color: '#f6f0e7',
        padding: '8px 14px',
        borderRadius: '4px',
        fontSize: '13px',
      }}>
        <div style={{ fontWeight: '700' }}>{payload[0].payload.nome}</div>
        <div>{payload[0].value} pedido{payload[0].value !== 1 ? 's' : ''}</div>
      </div>
    );
  }
  return null;
};

const GraficoProdutos = ({ dados = [] }) => {
  const containerStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '20px 24px',
    flex: '1 1 40%',
  };

  const tituloStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#3c5262',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={tituloStyle}>🛍️ Produtos Mais Pedidos</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={dados}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="nome"
            width={145}
            tick={{ fontSize: 11, fill: '#252623' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TooltipCustomizado />} />
          <Bar dataKey="pedidos" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {dados.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CORES_VELATO[index % CORES_VELATO.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoProdutos;
