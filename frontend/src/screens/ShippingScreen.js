import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Box from '@mui/material/Box';
import CheckoutWizard from '../components/CheckoutWizard';
import Stack from '@mui/material/Stack';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';

export default function ShippingScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
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
    ctxDispatch({ type: 'SET_FULLBOX_OFF' });
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate, ctxDispatch, fullBox]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (!fullName || !address || !city || !postalCode) {
      toast.warning('لطفا همه ی موارد درخواستی را تکمیل نمایید');
    }
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        location: shippingAddress.location,
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
              <button
                type="submit"
                onClick={() => navigate('/map')}
                className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              >
                {t('common.chooseLocationOnMap')}
              </button>
              <Box sx={{ width: '100%', marginY: 3 }}>
                <Typography variant="body1" component="div" gutterBottom>
                  {shippingAddress.location && shippingAddress.location.lat ? (
                    <div>
                      {t('common.lat')} : {shippingAddress.location.lat}
                      {' '}
                      {t('common.lng')} :{shippingAddress.location.lng}
                    </div>
                  ) : (
                    <div>{t('common.noLocationSelected')}</div>
                  )}
                </Typography>
              </Box>

              <Box textAlign="center">
                <div className="mt-6">
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-center"
                    spacing={1}
                  >
                    <button
                      type="submit"
                      className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {t('common.continue')}
                    </button>
                  </Stack>
                </div>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}
