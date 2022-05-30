import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CheckoutWizard from '../components/CheckoutWizard';
import {
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  CardMedia,
  LinearProgress,
  Box,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Axios from 'axios';

import MessageBox from '../components/MessageBox';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Stack from '@mui/material/Stack';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default function PlaceOrderScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, cart } = state;
  const round = (num) => Math.round(num);

  const itemsPrice = cart.cartItems.reduce(
    (a, c) => a + c.price * c.quantity,
    0
  );
  const shippingPrice = itemsPrice > 2000000 ? 0 : 150000;
  const taxPrice = itemsPrice * 0.09;
  const totalPrice = round(itemsPrice + shippingPrice + taxPrice);
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
    if (cart.cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: itemsPrice,
          shippingPrice: shippingPrice,
          taxPrice: taxPrice,
          totalPrice: totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('common.placeOrder')}</title>
      </Helmet>
      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
          <h2 className="text-2xl text-center font-extrabold tracking-tight dark:text-white">
            {t('common.placeOrder')}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
          <CheckoutWizard activeStep={3} />
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section className="lg:col-span-7 border rounded-lg px-4 pt-6">
              <Card variant="outlined">
                <React.Fragment>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {t('common.shippingAddress')}
                    </Typography>

                    <Typography variant="body2">
                      {t('common.fullName')} : {cart.shippingAddress.fullName}
                    </Typography>
                    <Typography variant="body2">
                      {t('common.city')} : {cart.shippingAddress.city}
                    </Typography>
                    <Typography variant="body2">
                      {t('common.postalCode')} :{' '}
                      {cart.shippingAddress.postalCode}
                    </Typography>
                    <Typography variant="body2">
                      {t('common.address')} : {cart.shippingAddress.address}
                    </Typography>
                  </CardContent>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-center"
                    spacing={1}
                    marginX={2}
                    marginY={1}
                  >
                    <Button onClick={() => navigate('/shipping')} size="small">
                      {t('common.edit')}
                    </Button>
                  </Stack>
                </React.Fragment>
              </Card>
              <Card variant="outlined" className="mt-2">
                <React.Fragment>
                  <CardContent>
                    <Typography variant="body2">
                      {t('common.paymentMethod')} : {cart.paymentMethod}
                    </Typography>
                  </CardContent>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-center"
                    spacing={1}
                    marginX={2}
                    marginY={1}
                  >
                    <Button onClick={() => navigate('/payment')} size="small">
                      {t('common.edit')}
                    </Button>
                  </Stack>
                </React.Fragment>
              </Card>
              <TableContainer className="mt-5">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className="font-vazir">
                        {t('common.image')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.title')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.quantity')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.price')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.cartItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan="5">
                          <MessageBox variant="warning">
                            {t('common.emptyCart')}
                          </MessageBox>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {cart.cartItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell align="center">
                              <CardMedia
                                component="img"
                                image={item.image}
                                // image={item.image}
                                alt={item.name}
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Typography className="font-vazir">
                                {item.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" className="font-vazir">
                              <div style={{ display: 'inline-flex' }}>
                                <span>{item.quantity}</span>
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              {item.price.toLocaleString()}
                              {'  '} {t('common.rial')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="flex-center"
                  spacing={1}
                  marginY={1}
                >
                  <Button onClick={() => navigate('/cart')} size="small">
                    {t('common.edit')}
                  </Button>
                </Stack>
              </TableContainer>
            </section>
            <section className="mt-16 border rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
              <h2 id="summary-heading" className="text-lg font-medium ">
                {t('common.subtotal')}
              </h2>

              <dl className="mt-6 space-y-4">
                {loading && (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-sm text-gray-900">مجموع سفارش :</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {itemsPrice.toLocaleString()} ریال
                  </dd>
                </div>
                <Tooltip
                  title="برای مبالغ بیش از دو میلیون ریال هزینه ارسال رایگان می باشد"
                  placement="bottom"
                >
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-900">هزینه حمل و نقل :</dt>

                    <dd className="text-sm font-medium text-gray-900">
                      {shippingPrice.toLocaleString()} ریال
                    </dd>
                  </div>
                </Tooltip>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-900">مالیات :</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {taxPrice.toLocaleString()} ریال
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium text-gray-900">
                    جمع نهایی :
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {totalPrice.toLocaleString()} ریال
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                  className="bg-primary w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                  {t('common.finalAccept')}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
