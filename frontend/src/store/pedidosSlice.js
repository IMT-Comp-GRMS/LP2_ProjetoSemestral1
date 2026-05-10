import { createSlice } from '@reduxjs/toolkit';

/*
  =======================================================================
  SLICE DE PEDIDOS (Redux Toolkit - Apostila 09)
  =======================================================================
  Pense no "Slice" como um departamento específico do nosso Cofre Central.
  Este arquivo é o gerente que cuida EXCLUSIVAMENTE das regras de negócio 
  dos nossos cartões do Kanban. Se no futuro tivermos um microsserviço 
  de "Usuários", criaremos um "usuariosSlice.js" separado.
*/

const pedidosSlice = createSlice({
  // 1. Nome deste departamento
  name: 'pedidos', 

  // 2. Estado Inicial: Como essa gaveta começa quando o site carrega?
  // Começamos com uma lista vazia, pois ainda vamos buscar no banco (Node.js)
  initialState: {
    lista: [] 
  },

  // 3. Reducers: São as ÚNICAS funções autorizadas a alterar os dados desta gaveta.
  // Nenhum outro arquivo do projeto pode mudar a 'lista' sem passar por aqui.
  reducers: {
    
    // Ação: Pega os dados que vieram do banco e joga para dentro da gaveta global
    salvarPedidosNoCofre: (state, action) => {
      // 'action.payload' é a "encomenda" (os dados) que o App.jsx vai nos enviar
      state.lista = action.payload; 
    }

    // Nota para a equipe: Quando formos fazer a função de "Avançar Status" 
    // ou "Deletar Pedido", criaremos novas funções de Reducer aqui embaixo!
  }
});

// Exportamos a função de ação para que o App.jsx possa chamá-la
export const { salvarPedidosNoCofre } = pedidosSlice.actions;

// Exportamos o gerente inteiro para conectá-lo ao Cofre Central (index.js)
export default pedidosSlice.reducer;