import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import Stack from '@mui/material/Stack';
import { toast } from 'react-toastify';
const moment = require('moment-jalaali');
const convertDate = (date) => {
  var change = moment(date).format('jYYYY/jM/jD HH:mm:ss');
  return change;
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
    loadingDeliver: false,
  });
  const { search } = useLocation();
  const status = new URLSearchParams(search).get('Status');
  const authority = new URLSearchParams(search).get('Authority');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        if (status && !data.isPaid) {
          dispatch({ type: 'PAY_REQUEST' });
          const amount = data.totalPrice;
          if (status === 'NOK') {
            dispatch({ type: 'PAY_FAIL' });
            toast.error('پرداخت  ناموفق بود');
          } else {
            const { data } = await axios.post(
              '/api/payment/zarinpal/verify',
              {
                amount: amount,
                authority: authority,
              },
              {
                headers: {
                  authorization: `Bearer ${userInfo.token}`,
                },
              }
            );
            try {
              dispatch({ type: 'PAY_REQUEST' });
              await axios.put(
                `/api/orders/${orderId}/pay`,
                {
                  id: data.ref_id,
                  status: 'OK',
                  update_time: Date.now(),
                  mobile: '',
                },
                {
                  headers: { authorization: `Bearer ${userInfo.token}` },
                }
              );
              dispatch({ type: 'PAY_SUCCESS', payload: data });
              toast.success('پرداخت انجام شد.');
            } catch (err) {
              dispatch({ type: 'PAY_FAIL', payload: getError(err) });
              toast.error(getError(err));
            }
          }
        }
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    }
  }, [
    order,
    userInfo,
    orderId,
    status,
    authority,
    navigate,
    successPay,
    successDeliver,
  ]);
  function createOrder(data, actions) {
    if (order.paymentMethod === 'ZarinPal') {
      const loadZarinPalScript = async () => {
        try {
          const { data } = await axios.post(
            '/api/payment/zarinpal/request',
            {
              amount: order.totalPrice,
              orderId: orderId,
            },
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          toast.success('به درگاه منتقل می شوید');
          window.location.href = 'https://www.zarinpal.com/pg/StartPay/' + data;
          dispatch({ type: 'PAY_REQUEST' });
        } catch (err) {
          toast.error(getError(err));
        }
      };
      loadZarinPalScript();
    }
  }
  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('وضعیت سفارش به تحویل شده تغیر کرد');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="error">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{t('common.order')}</title>
      </Helmet>
      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
          <h2 className="text-2xl text-center font-extrabold tracking-tight dark:text-white">
            {t('common.orderNumber')} : {orderId}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
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
                      {t('common.fullName')} : {order.shippingAddress.fullName}
                    </Typography>
                    <Typography variant="body2">
                      {t('common.city')} : {order.shippingAddress.city}
                    </Typography>
                    <Typography variant="body2">
                      {t('common.postalCode')} :{' '}
                      {order.shippingAddress.postalCode}
                    </Typography>
                    <Typography variant="body2">
                      {t('common.address')} : {order.shippingAddress.address}
                      &nbsp;
                      {order.shippingAddress.location &&
                        order.shippingAddress.location.lat && (
                          <a
                            target="_new"
                            href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                          >
                            {t('common.showOnMap')}
                          </a>
                        )}
                    </Typography>
                  </CardContent>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-center"
                    spacing={1}
                    marginX={2}
                    marginY={2}
                  >
                    {order.isDelivered ? (
                      <MessageBox variant="success">
                        {t('common.deliveredAt')} :{' '}
                        {convertDate(order.deliveredAt)}
                      </MessageBox>
                    ) : (
                      <MessageBox variant="error">
                        {t('common.notDelivered')}
                      </MessageBox>
                    )}
                  </Stack>
                </React.Fragment>
              </Card>
              <Card variant="outlined" className="mt-2">
                <React.Fragment>
                  <CardContent>
                    <Typography variant="body2">
                      {t('common.paymentMethod')} : {order.paymentMethod}
                    </Typography>
                  </CardContent>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-center"
                    spacing={1}
                    marginX={2}
                    marginY={2}
                  >
                    {order.isPaid ? (
                      <MessageBox variant="success">
                        {t('common.paidAt')} : {convertDate(order.paidAt)}
                      </MessageBox>
                    ) : (
                      <MessageBox variant="error">
                        {t('common.notPaid')}
                      </MessageBox>
                    )}
                  </Stack>
                </React.Fragment>
              </Card>
              <TableContainer className="my-5">
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
                    {order.orderItems.map((item) => (
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
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
            <section className="mt-16 border rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
              <h2 id="summary-heading" className="text-lg font-medium ">
                {t('common.subtotal')}
              </h2>

              <dl className="mt-6 space-y-4">
                {loadingPay && (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                )}
                {loadingDeliver && (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-sm text-gray-900">
                    {t('common.total')} :
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.itemsPrice.toLocaleString()} {t('common.rial')}
                  </dd>
                </div>
                <Tooltip
                  title="برای مبالغ بیش از دو میلیون ریال هزینه ارسال رایگان می باشد"
                  placement="bottom"
                >
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-900">
                      {t('common.shippingCost')} :{' '}
                    </dt>

                    <dd className="text-sm font-medium text-gray-900">
                      {order.shippingPrice.toLocaleString()} {t('common.rial')}
                    </dd>
                  </div>
                </Tooltip>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-900">{t('common.tax')}</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.taxPrice.toLocaleString()} {t('common.rial')}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium text-gray-900">
                    {t('common.finalTotal')} :
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {order.totalPrice.toLocaleString()} {t('common.rial')}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                {!order.isPaid && !userInfo.isAdmin && (
                  <button
                    type="submit"
                    onClick={createOrder}
                    className=" w-full mb-1 bg-yellow-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-yellow-500"
                  >
                    {t('common.payWithZarinPal')}
                  </button>
                )}
                {order.isPaid && userInfo.isAdmin && !order.isDelivered && (
                  <button
                    type="submit"
                    onClick={deliverOrderHandler}
                    className=" w-full mt-1 bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-yellow-500"
                  >
                    {t('common.orderDelivered')}
                  </button>
                )}
                {userInfo.isAdmin && (
                  <button
                    type="submit"
                    onClick={() => {
                      navigate(`/admin/orders`);
                    }}
                    className=" w-full mt-1 bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-yellow-500"
                  >
                    {t('common.ordersList')}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
