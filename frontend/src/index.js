import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import './i18n';
import LoadingBox from './components/LoadingBox';
import { StoreProvider } from './Store';
const loadingMartkup = (
  <div>
    <LoadingBox />
  </div>
);
ReactDOM.render(
  <Suspense fallback={loadingMartkup}>
    <React.StrictMode>
      <StoreProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StoreProvider>
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
