import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import ShippingScreen from './screens/ShippingScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import VerifyScreen from './screens/VerifyScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import cookies from 'js-cookie';
import Layout from './components/Layout';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
function App() {
  const [darkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: ['Vazir FD'].join(','),
    },
    direction: 'rtl',
  });
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  const cacheLtr = createCache({
    key: 'ltr',
  });

  const languages = [
    {
      code: 'fa',
      name: 'فارسی',
      dir: 'rtl',
    },
    {
      code: 'en',
      name: 'English',
    },
    {
      code: 'de',
      name: 'Deutsch',
    },
  ];
  const currentLanguageCode = cookies.get('i18next') || 'fa';
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  useEffect(() => {
    document.body.dir = currentLanguage.dir || 'ltr';
  }, [currentLanguage]);
  return (
    <CacheProvider value={currentLanguageCode === 'fa' ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ToastContainer
            position="bottom-center"
            rtl={currentLanguageCode === 'fa' ? true : false}
            limit="1"
          />
          <Layout>
            <Routes>
              <Route
                path="/orderhistory"
                element={<OrderHistoryScreen />}
              ></Route>
              <Route path="/profile" element={<ProfileScreen />}></Route>
              <Route path="/order/:id" element={<OrderScreen />}></Route>
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/verify" element={<VerifyScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
