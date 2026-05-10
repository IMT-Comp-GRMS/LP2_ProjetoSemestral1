import React, { useState, useEffect } from 'react';
import CardPedido from './CardPedido';

// 1. IMPORTAÇÕES DO REDUX
// useSelector: Para ler dados do cofre
// useDispatch: Para enviar comandos de mudança para o cofre
import { useSelector, useDispatch } from 'react-redux';
import { salvarPedidosNoCofre } from './store/pedidosSlice';
import logoVelato from './assets/logo-velato.png';

const App = () => {
  // 2. CONFIGURAÇÃO DO REDUX
  const dispatch = useDispatch();
  
  // Aqui "plugamos" na gaveta de pedidos e pegamos a lista global
  // state.pedidos.lista vem do nome que demos no store/index.js e no slice
  const pedidos = useSelector((state) => state.pedidos.lista);

  // 3. ESTADOS LOCAIS 
  // Estados de formulário e modal continuam aqui porque são "temporários"
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  // 4. ESTILOS 
  // 1. Estilos Minimalistas - Identidade Velato (Cores Oficiais)
  const containerStyle = {
    backgroundColor: '#f6f0e7', // Fundo principal (laranja claro/bege)
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#252623' // Texto principal
  };

  const headerVelatoStyle = {
    backgroundColor: '#f6f0e7',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '2px solid #3c5262', // Linha inferior com o Azure apagado
    marginBottom: '30px'
  };

  const botãoCriarPedido = {
    padding: '10px 24px',
    backgroundColor: '#ae4f48', // Vermelho da marca para destacar a ação primária
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

  const kanbanContainerStyle = { 
    display: 'flex', 
    gap: '24px', 
    width: '100%', 
    padding: '0 40px 40px 40px',
    boxSizing: 'border-box',
    overflowX: 'auto'
  };

  const colunaStyle = { 
    backgroundColor: '#ffffff', // Fundo branco para as colunas, dando destaque aos cartões
    flex: 1, 
    minWidth: '260px', 
    minHeight: '650px', 
    borderRadius: '6px', 
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e5e7eb' // Borda neutra muito subtil
  };

  // Aplicação estrita da paleta Velato nos cabeçalhos das colunas
  const colunas = [
    { titulo: 'Pedidos', cor: '#3c5262' },            // Azure apagado
    { titulo: 'Pagamento Confirmado', cor: '#a79261' }, // Laranja apagado (Mostarda/Castanho)
    { titulo: 'Pedido separado', cor: '#ae4f48' },      // Vermelho
    { titulo: 'Pedido Enviado', cor: '#252623' },       // Gradiente escuro (sólido)
    { titulo: 'Pedido Entregue', cor: '#3c5262' },      // Azure apagado para fechar o ciclo
  ];

  // Estilos do Modal (Janela de Novo Pedido) - Identidade Velato
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(37, 38, 35, 0.8)', // Fundo escuro transparente (cor #252623)
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: '#f6f0e7', // Fundo principal da marca
    padding: '30px',
    borderRadius: '4px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    border: '1px solid #3c5262' // Borda Azure
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #a79261', // Borda Mostarda
    backgroundColor: '#ffffff',
    color: '#252623',
    fontFamily: 'inherit',
    fontSize: '14px'
  };

  // 5. BUSCA DE DADOS COM REDUX
  const carregarPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas');
      const data = await response.json();
      
      // Em vez de setPedidos(data), enviamos para o Redux
      // O 'dispatch' entrega a lista para o 'salvarPedidosNoCofre' do Slice
      dispatch(salvarPedidosNoCofre(data));
      
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const handleCriarPedido = async () => {
    const novoPedido = { titulo, descricao, responsavel };

    try {
        const response = await fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoPedido)
        });

        if (response.ok) {
          alert("Pedido salvo com sucesso!");
          setMostrarModal(false);
          setTitulo(''); setDescricao(''); setResponsavel('');
          carregarPedidos(); // Recarrega a lista no Redux
        }
    } catch (error) {
        console.error("Erro ao conectar:", error);
        alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div style={containerStyle}>
      {/* 1. JANELA MODAL  */}
      {mostrarModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 10px 0' }}>Novo Pedido - Velato</h3>
            <input 
              placeholder="Título do Pedido (Ex: Calça Jeans Slim)" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              style={inputStyle}
            />
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

      {/* 2. CABEÇALHO DA MARCA (Identidade Visual Velato) */}
      <header style={headerVelatoStyle}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Assim que tiver o PNG importado, remova o comentário da tag <img> abaixo 
            e apague a tag <h1>. Por agora, deixo a versão em texto com as cores corretas.
          */}
          {/* <img src={logoVelato} alt="Logo Velato" style={{ height: '40px' }} /> */}
          
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#252623', letterSpacing: '2px' }}>
            VELATO
          </h1>
          <span style={{ fontWeight: '400', color: '#a79261', fontSize: '18px', paddingLeft: '10px', borderLeft: '1px solid #3c5262' }}>
            Orders
          </span>
        </div>
        
        <button style={botãoCriarPedido} onClick={() => setMostrarModal(true)}>
          <span style={{ fontSize: '18px', fontWeight: '400' }}>+</span> Novo Pedido
        </button>
      </header>

      {/* 3. GRID DO KANBAN (Ocupa a largura total da tela) */}
      <div style={kanbanContainerStyle}>
        {colunas.map((col, index) => (
          <div key={index} style={colunaStyle}>
            
            {/* Título da Coluna com a cor da marca */}
            <div style={{ 
              padding: '15px', 
              textAlign: 'center', 
              fontWeight: '700', 
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              backgroundColor: col.cor, 
              color: '#FFFFFF',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              {col.titulo}
            </div>

            {/* Espaço onde os cards de calças serão renderizados */}
            <div style={{ 
              padding: '15px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              flex: 1,
              overflowY: 'auto' 
            }}>
              {pedidos
                .filter((pedido) => pedido.status === col.titulo)
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