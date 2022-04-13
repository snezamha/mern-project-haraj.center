import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Box from '@mui/material/Box';
import CheckoutWizard from '../components/CheckoutWizard';

export default function ShippingScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
      })
    );
    navigate('/payment');
  };
  return (
    <>
      <Helmet>
        <title>{t('common.shippingAddress')}</title>
      </Helmet>

      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
          <h2 className="text-2xl text-center font-extrabold tracking-tight dark:text-white">
            {t('common.shippingAddress')}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
          <CheckoutWizard activeStep={1} />
          <div className="px-4 py-5 sm:rounded-lg sm:px-10">
            <Box
              component="form"
              onSubmit={submitHandler}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                id="FullName"
                label={t('common.fullName')}
                margin="normal"
                required
                fullWidth
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <TextField
                id="address"
                label={t('common.address')}
                margin="normal"
                required
                fullWidth
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                id="city"
                label={t('common.city')}
                margin="normal"
                required
                fullWidth
                variant="outlined"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <TextField
                id="postalCode"
                label={t('common.postalCode')}
                margin="normal"
                required
                fullWidth
                variant="outlined"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />

              <Box textAlign="center">
                <div className="mt-6">
                  <button
                    type="submit"
                    className="bg-primary w-1/3

                  bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}