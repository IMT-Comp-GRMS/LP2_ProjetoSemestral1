/**
 * GraficoVolumeDiario — Gráfico de área mostrando a quantidade de pedidos
 * criados por dia nos últimos 7 dias.
 *
 * Props:
 *  - dados {Array<{ data: string, pedidos: number }>}
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Tooltip customizado com a identidade visual da Velato
const TooltipCustomizado = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#252623',
        color: '#f6f0e7',
        padding: '8px 14px',
        borderRadius: '4px',
        fontSize: '13px',
      }}>
        <div style={{ fontWeight: '700' }}>{label}</div>
        <div>{payload[0].value} pedido{payload[0].value !== 1 ? 's' : ''}</div>
      </div>
    );
  }
  return null;
};

const GraficoVolumeDiario = ({ dados = [] }) => {
  const containerStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '20px 24px',
    flex: '1 1 55%',
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
      <div style={tituloStyle}>📈 Volume Diário de Pedidos</div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={dados} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          {/* Gradiente de preenchimento na cor principal Velato */}
          <defs>
            <linearGradient id="gradienteVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3c5262" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3c5262" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="data"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<TooltipCustomizado />} />
          <Area
            type="monotone"
            dataKey="pedidos"
            stroke="#3c5262"
            strokeWidth={2.5}
            fill="url(#gradienteVolume)"
            dot={{ r: 4, fill: '#3c5262', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#ae4f48' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoVolumeDiario;
