import React, { useState, useEffect } from 'react';
import CardPedido from './CardPedido';

/* ==========================================================================
   1. IMPORTAÇÕES DE GERENCIAMENTO DE ESTADO (REDUX)
   ========================================================================== */
// useSelector: Hook para ler dados armazenados no estado global.
// useDispatch: Hook para disparar ações que alteram o estado global.
import { useSelector, useDispatch } from 'react-redux';
import { salvarPedidosNoCofre } from './store/pedidosSlice';

/**
 * Componente Principal da Aplicação Kanban - Velato
 * Responsável por renderizar a interface de colunas, orquestrar o estado
 * global dos pedidos e gerenciar a interface de criação de novas tarefas.
 */
const App = () => {
  /* ==========================================================================
     2. INICIALIZAÇÃO DE ESTADOS (REDUX E REACT HOOKS)
     ========================================================================== */
  const dispatch = useDispatch();
  
  // Acesso ao estado global: extrai a lista de pedidos gerenciada pelo Redux.
  const pedidos = useSelector((state) => state.pedidos.lista);

  // Estados locais: utilizados exclusivamente para o controle do formulário 
  // de criação de pedido e visibilidade do modal.
  const [catalogo, setCatalogo] = useState([]); // Guarda as calças vindas do banco
  const [produtosSelecionados, setProdutosSelecionados] = useState([]); // Guarda os IDs marcados
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [prioridade, setPrioridade] = useState(3); // Inicializa com prioridade Baixa (3)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('TODAS');

  /* ==========================================================================
     3. DEFINIÇÃO DE ESTILOS INLINE (CSS-in-JS) - IDENTIDADE VELATO
     ========================================================================== */
  // Container master que engloba toda a aplicação.
  const containerStyle = {
    backgroundColor: '#f6f0e7', 
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#252623'
  };

  // Estilo do cabeçalho de navegação superior.
  const headerVelatoStyle = {
    backgroundColor: '#f6f0e7',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '2px solid #3c5262',
    marginBottom: '30px'
  };

  // Estilo padronizado para o botão primário de ação (Call to Action).
  const botãoCriarPedido = {
    padding: '10px 24px',
    backgroundColor: '#ae4f48',
    color: '#f6f0e7',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  // Container que abriga o grid do Kanban, permitindo rolagem horizontal caso necessário.
  const kanbanContainerStyle = { 
    display: 'flex', 
    gap: '24px', 
    width: '100%', 
    padding: '0 40px 40px 40px',
    boxSizing: 'border-box',
    overflowX: 'auto'
  };

  // Container estrutural de cada coluna do Kanban. Define altura fixa para habilitar o scroll.
  const colunaStyle = { 
    backgroundColor: '#ffffff',
    flex: 1, 
    minWidth: '260px', 
    height: '75vh', // Limita a altura da coluna em 75% da janela
    borderRadius: '6px', 
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e5e7eb'
  };

  // Configuração semântica e visual das colunas do sistema.
  const colunas = [
    { titulo: 'Pedidos', cor: '#3c5262' },
    { titulo: 'Pagamento Confirmado', cor: '#a79261' },
    { titulo: 'Pedido separado', cor: '#ae4f48' },
    { titulo: 'Pedido Enviado', cor: '#252623' },
    { titulo: 'Pedido Entregue', cor: '#3c5262' },
  ];

  // Estilo da sobreposição escura atrás do modal.
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(37, 38, 35, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  // Estilo da caixa branca principal do modal.
  const modalContentStyle = {
    backgroundColor: '#f6f0e7',
    padding: '30px',
    borderRadius: '4px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    border: '1px solid #3c5262'
  };

  // Estilo genérico para inputs textuais e seletores do formulário.
  const inputStyle = {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #a79261',
    backgroundColor: '#ffffff',
    color: '#252623',
    fontFamily: 'inherit',
    fontSize: '14px'
  };

  /* ==========================================================================
     4. INTEGRAÇÃO COM A API E LÓGICA DE NEGÓCIO
     ========================================================================== */
  
  /**
   * Executa uma requisição GET ao Backend para obter a lista atualizada
   * de pedidos e os insere no estado global (Redux).
   */
  const carregarPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas');
      const data = await response.json();
      dispatch(salvarPedidosNoCofre(data));
    } catch (error) {
      console.error("Erro ao buscar tarefas do servidor:", error);
    }
  };

  const carregarCatalogo = async () => {
    try {
      const response = await fetch('http://localhost:3000/produtos');
      const data = await response.json();
      setCatalogo(data);
    } catch (error) {
      console.error("Erro ao buscar catálogo:", error);
    }
  };

  // useEffect: Aciona o carregamento inicial dos pedidos assim que o App é montado na tela.
  useEffect(() => {
    carregarPedidos();
    carregarCatalogo();
  }, []);

  const toggleProduto = (idProduto) => {
    setProdutosSelecionados(prev => 
      prev.includes(idProduto) 
        ? prev.filter(id => id !== idProduto) // Se já tem, tira
        : [...prev, idProduto] // Se não tem, coloca
    );
  };

  /**
   * Coleta os dados do formulário local, compila o payload e envia via POST
   * para o servidor persistir um novo pedido no banco de dados.
   */
  const handleCriarPedido = async () => {
    // 1. Trava de segurança: não deixa enviar sem escolher a calça
    if (produtosSelecionados.length === 0) {
      alert("Por favor, selecione pelo menos um produto para o pedido.");
      return;
    }

    // 2. Montamos o pacote com o array de IDs
    const novoPedido = { 
      descricao, 
      responsavel,
      prioridade,
      produtosIds: produtosSelecionados // NOVIDADE AQUI!
    };

    try {
        const response = await fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoPedido)
        });

        if (response.ok) {
          setMostrarModal(false);
          // Limpamos tudo após o sucesso, incluindo os checkboxes
          setDescricao(''); setResponsavel(''); setPrioridade(3); setProdutosSelecionados([]);
          carregarPedidos(); 
        }
    } catch (error) {
        console.error("Erro ao conectar:", error);
        alert("Não foi possível conectar ao servidor.");
    }
  };

  /* ==========================================================================
     5. RENDERIZAÇÃO DA INTERFACE (JSX)
     ========================================================================== */
  return (
    <div style={containerStyle}>
      
      {/* --- BLOCO DO MODAL DE CRIAÇÃO --- */}
      {/* A renderização condicional baseia-se no estado boolean 'mostrarModal' */}
      {mostrarModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 10px 0' }}>Novo Pedido - Velato</h3>
            
            {/* --- LISTA DE PRODUTOS (CHECKBOXES) --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #a79261', padding: '12px', borderRadius: '4px', backgroundColor: '#ffffff' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#3c5262' }}>SELECIONE OS PRODUTOS:</label>
              
              {catalogo.length === 0 ? (
                <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Carregando catálogo...</span>
              ) : (
                catalogo.map(produto => (
                  <label key={produto.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#252623' }}>
                    <input 
                      type="checkbox" 
                      checked={produtosSelecionados.includes(produto.id)}
                      onChange={() => toggleProduto(produto.id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    {produto.nome} <span style={{ color: '#a79261', fontWeight: 'bold' }}>(R$ {produto.preco})</span>
                  </label>
                ))
              )}
            </div>
            
            <textarea 
              placeholder="Descrição detalhada" 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              style={{ ...inputStyle, minHeight: '80px', resize: 'none' }}
            />
            
            <input 
              placeholder="Responsável" 
              value={responsavel} 
              onChange={(e) => setResponsavel(e.target.value)} 
              style={inputStyle}
            />
            
            {/* Componente de seleção de prioridade numérica */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#3c5262' }}>PRIORIDADE:</label>
              <select 
                value={prioridade} 
                onChange={(e) => setPrioridade(Number(e.target.value))} 
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value={1}>🔴 Alta (Urgente)</option>
                <option value={2}>🟡 Média (Padrão)</option>
                <option value={3}>🔵 Baixa (Opcional)</option>
              </select>
            </div>
            
            {/* Controles de submissão do formulário */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={handleCriarPedido}
                style={{ ...botãoCriarPedido, flex: 1, justifyContent: 'center' }}
              >
                Salvar
              </button>
              <button 
                onClick={() => setMostrarModal(false)}
                style={{ 
                  flex: 1, 
                  backgroundColor: 'transparent', 
                  border: '1px solid #E5E7EB', 
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- BLOCO DO CABEÇALHO (HEADER) --- */}
      <header style={headerVelatoStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#252623', letterSpacing: '2px' }}>
            VELATO
          </h1>
          <span style={{ fontWeight: '400', color: '#a79261', fontSize: '18px', paddingLeft: '10px', borderLeft: '1px solid #3c5262' }}>
            Orders
          </span>
        </div>
        
        {/* Aciona a visibilidade do formulário de criação */}
        <button style={botãoCriarPedido} onClick={() => setMostrarModal(true)}>
          <span style={{ fontSize: '18px', fontWeight: '400' }}>+</span> Novo Pedido
        </button>
      </header>

      <div style={{ padding: '0 40px 20px 40px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ fontWeight: '600', color: '#3c5262', fontSize: '14px' }}>
          Filtrar Pedidos:
        </div>
        
        <input 
          type="text"
          placeholder="Buscar por produto ou responsável..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={{ ...inputStyle, width: '300px', padding: '8px 12px' }}
        />

        <select
          value={filtroPrioridade}
          onChange={(e) => setFiltroPrioridade(e.target.value)}
          style={{ ...inputStyle, padding: '8px 12px', cursor: 'pointer' }}
        >
          <option value="TODAS">Todas as Prioridades</option>
          <option value="1"> Alta (Urgente)</option>
          <option value="2"> Média (Padrão)</option>
          <option value="3"> Baixa</option>
        </select>
        
        {(termoBusca !== '' || filtroPrioridade !== 'TODAS') && (
          <button 
            onClick={() => { setTermoBusca(''); setFiltroPrioridade('TODAS'); }}
            style={{ background: 'none', border: 'none', color: '#ae4f48', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textDecoration: 'underline' }}
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* --- BLOCO DO GRID DE COLUNAS (KANBAN) --- */}
      <div style={kanbanContainerStyle}>
        {/* Mapeia o array estrutural de colunas gerando a interface dinamicamente */}
        {colunas.map((col, index) => (
          <div key={index} style={colunaStyle}>
            
            {/* Título Fixo da Coluna */}
            <div style={{ 
              padding: '15px', 
              textAlign: 'center', 
              fontWeight: '700', 
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              backgroundColor: col.cor, 
              color: '#FFFFFF'
            }}>
              {col.titulo}
            </div>

            {/* Container Dinâmico de Cards. Garante renderização isolada e barra de rolagem (overflowY) independente. */}
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
              
              {/* --- O FUNIL DE DADOS ENTRA AQUI --- */}
              {pedidos
                .filter((pedido) => pedido.status === col.titulo)
                .filter((pedido) => {
                  if (termoBusca === '') return true;
                  const termo = termoBusca.toLowerCase();
                  return (
                    pedido.titulo.toLowerCase().includes(termo) ||
                    pedido.responsavel.toLowerCase().includes(termo)
                  );
                })
                .filter((pedido) => {
                  if (filtroPrioridade === 'TODAS') return true;
                  return pedido.prioridade === Number(filtroPrioridade);
                })
                .sort((a, b) => a.prioridade - b.prioridade) 
                .map((pedido) => (
                  <CardPedido key={pedido.id} pedido={pedido} />
                ))}

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default App;