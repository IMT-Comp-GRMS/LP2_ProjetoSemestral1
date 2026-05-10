import { configureStore } from '@reduxjs/toolkit';
import pedidosReducer from './pedidosSlice';

/*
  =======================================================================
  STORE GLOBAL (Redux Toolkit - Apostila 09)
  =======================================================================
  Este é o Banco Central da nossa aplicação Frontend.
  Ele junta todos os "gerentes" (Slices) em um lugar só. Dessa forma,
  qualquer componente do projeto (App, CardPedido, Modal, etc) pode plugar 
  aqui para ler ou alterar dados, sem precisarmos ficar passando "Props"
  de um arquivo para o outro infinitamente.
*/

export const store = configureStore({
  reducer: {
    // Cadastramos o nosso gerente de pedidos aqui.
    // Qualquer componente que pedir por "state.pedidos.lista" vai receber os cartões.
    pedidos: pedidosReducer
    
    // Futuros Microsserviços entrarão aqui embaixo. Exemplo:
    // usuarios: usuariosReducer,
    // pagamentos: pagamentosReducer
  }
});