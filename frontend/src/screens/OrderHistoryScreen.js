import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const moment = require('moment-jalaali');
const convertDate = (date) => {
  var change = moment(date).format('jYYYY/jM/jD HH:mm:ss');
  return change;
};
export default function OrderHistoryScreen() {
  const { t } = useTranslation();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <>
      <Helmet>
        <title>{t('common.orderHistory')}</title>
      </Helmet>

      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
          <h2 className="text-2xl text-center font-extrabold tracking-tight dark:text-white">
            {t('common.orderHistory')}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
          <div className="px-4 py-5 sm:rounded-lg sm:px-10">
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className="font-vazir">
                        {t('common.id')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.date')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.total')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.paid')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.delivered')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.action')}
                      </TableCell>
                    </TableRow>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan="6">
                          <MessageBox variant="warning">
                            {t('common.emptyOrder')}
                          </MessageBox>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell align="center">{order._id}</TableCell>
                            <TableCell align="center">
                              {convertDate(order.createdAt)}
                            </TableCell>
                            <TableCell align="center">
                              {' '}
                              {order.totalPrice.toLocaleString()}
                              {'  '} {t('common.rial')}
                            </TableCell>
                            <TableCell align="center">
                              {order.isPaid ? (
                                <>
                                  {t('common.paidAt')} :{' '}
                                  {convertDate(order.paidAt)}
                                </>
                              ) : (
                                <>{t('common.notPaid')}</>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {order.isDelivered ? (
                                <>
                                  {t('common.deliveredAt')} :{' '}
                                  {convertDate(order.deliveredAt)}
                                </>
                              ) : (
                                <>{t('common.notDelivered')}</>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <button
                                type="submit"
                                onClick={() => {
                                  navigate(`/order/${order._id}`);
                                }}
                                className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                {t('common.detail')}
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableHead>
                  <TableBody></TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
