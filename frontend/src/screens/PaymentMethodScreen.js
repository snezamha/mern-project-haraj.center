import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Box from '@mui/material/Box';
import CheckoutWizard from '../components/CheckoutWizard';
import Stack from '@mui/material/Stack';
import { toast } from 'react-toastify';

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
export default function ShippingScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || '');
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/payment');
    }
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [userInfo, shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!paymentMethodName) {
      toast.warning('لطفا یک روش پرداخت فعال را انتخاب کنید');
    } else {
      ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
      localStorage.setItem('paymentMethod', paymentMethodName);
      navigate('/placeorder');
    }
  };
  return (
    <>
      <Helmet>
        <title>{t('common.paymentMethod')}</title>
      </Helmet>

      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
        <h2 className="text-2xl text-center font-extrabold tracking-tight">
            {t('common.paymentMethod')}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
          <CheckoutWizard activeStep={2} />
          <div className="px-4 py-5 sm:rounded-lg sm:px-10">
            <form className="mt-5 space-y-6" onSubmit={submitHandler}>
              <FormControl component="fieldset">
                <RadioGroup aria-label="Payment Method" name="paymentMethod">
                  <FormControlLabel
                    label="درگاه واسط زرین پال"
                    value="ZarinPal"
                    className="text-black"
                    checked={paymentMethodName === 'ZarinPal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    control={<Radio />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="درگاه اینترنتی امین پرداخت"
                    value="AminPay"
                    disabled
                    control={<Radio />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="درگاه اینترنتی پرداخت الکترونیک سامان"
                    value="Saman"
                    disabled
                    control={<Radio />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="پرداخت نقدی در محل"
                    value="Cash"
                    disabled
                    control={<Radio />}
                  ></FormControlLabel>
                </RadioGroup>
              </FormControl>

              <Box textAlign="center">
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-center"
                    spacing={1}
                    marginTop={5}
                  >
                    <button
                      type="submit"
                      className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {t('common.continue')}
                    </button>
                    <button
                      className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => navigate('/shipping')}
                    >
                      {t('common.previous')}
                    </button>
                  </Stack>
              </Box>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
