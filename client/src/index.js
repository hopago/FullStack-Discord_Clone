import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './scss/index.scss';

import store, { persistor } from './lib/redux/store';
import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
