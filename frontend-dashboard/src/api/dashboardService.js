/**
 * ============================================================================
 * CAMADA DE DADOS - Dashboard Velato
 * ============================================================================
 * Cada função exportada busca um conjunto de dados para o dashboard.
 *
 * ESTADO ATUAL: retornando MOCK DATA (dados simulados).
 *
 * COMO MIGRAR PARA O BACKEND REAL:
 *   1. Rode: npm install axios
 *   2. Descomente as linhas com "import axios" e "axios.get(...)"
 *   3. Apague o "return MOCK_..." correspondente de cada função
 *
 * Backend previsto do microsserviço Dashboard: http://localhost:4000
 * ============================================================================
 */

// import axios from 'axios'; // ← descomente quando o backend estiver pronto

// ============================================================================
// MOCK DATA
// Edite estes dados para simular diferentes cenários de teste.
// ============================================================================

const MOCK_KPIS = {
  totalPedidos: 47,
  entreguesHoje: 6,
  urgentesAberto: 4,
  totalProdutos: 8,
};

const MOCK_VOLUME_DIARIO = [
  { data: '19/05', pedidos: 3 },
  { data: '20/05', pedidos: 7 },
  { data: '21/05', pedidos: 5 },
  { data: '22/05', pedidos: 9 },
  { data: '23/05', pedidos: 4 },
  { data: '24/05', pedidos: 11 },
  { data: '25/05', pedidos: 8 },
];

const MOCK_PRODUTOS_MAIS_PEDIDOS = [
  { nome: 'Calça Cargo Preta', pedidos: 18 },
  { nome: 'Calça Slim Azul', pedidos: 14 },
  { nome: 'Calça Wide Leg Bege', pedidos: 11 },
  { nome: 'Calça Jogger Cinza', pedidos: 8 },
  { nome: 'Calça Skinny Branca', pedidos: 6 },
];

// ============================================================================
// FUNÇÕES DE SERVIÇO
// ============================================================================

/**
 * Busca os KPIs principais para os cards do topo.
 * @returns {{ totalPedidos, entreguesHoje, urgentesAberto, totalProdutos }}
 */
export async function buscarKpis() {
  // --- SUBSTITUIR POR: ---
  // const { data } = await axios.get('http://localhost:4000/dashboard/kpis');
  // return data;
  return MOCK_KPIS;
}

/**
 * Busca o volume de pedidos criados por dia (últimos 7 dias).
 * @returns {Array<{ data: string, pedidos: number }>}
 */
export async function buscarVolumeDiario() {
  // --- SUBSTITUIR POR: ---
  // const { data } = await axios.get('http://localhost:4000/dashboard/volume-diario');
  // return data;
  return MOCK_VOLUME_DIARIO;
}

/**
 * Busca o ranking de produtos que mais aparecem nos pedidos.
 * @returns {Array<{ nome: string, pedidos: number }>}
 */
export async function buscarProdutosMaisPedidos() {
  // --- SUBSTITUIR POR: ---
  // const { data } = await axios.get('http://localhost:4000/dashboard/produtos-mais-pedidos');
  // return data;
  return MOCK_PRODUTOS_MAIS_PEDIDOS;
}
