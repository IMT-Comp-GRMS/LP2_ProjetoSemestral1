import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/* IMPORTAÇÕES DO REDUX 
  Provider: É a "tomada" que liga o React ao Redux
  store: É o nosso Cofre Central que acabamos de criar
*/
import { Provider } from 'react-redux';
import { store } from './store/index.js';

/*
  =======================================================================
  PONTO DE ENTRADA DO REACT
  =======================================================================
  Ao envolver o <App /> com o <Provider store={store}>, nós garantimos que
  absolutamente TODAS as telas e componentes do nosso Kanban tenham acesso
  imediato e global aos dados do Redux.
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);