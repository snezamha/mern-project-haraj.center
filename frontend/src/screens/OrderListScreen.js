import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
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
  var change = moment(date).format('jYYYY/jM/jD HH:mm');
  return change;
};
export default function OrderListScreen() {
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
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const columns = [
    { name: '_id', label: t('common.id') },
    {
      name: 'createdAt',
      label: t('common.date'),
      options: {
        customBodyRender: (value, tableMeta, updateValue) => convertDate(value),
      },
    },
    {
      name: 'totalPrice',
      label: t('common.total'),
      options: {
        customBodyRender: (value, tableMeta, updateValue) =>
          value.toLocaleString() + ' ' + t('common.rial'),
      },
    },
    {
      name: 'isPaid',
      label: t('common.paid'),
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          if (orders[dataIndex].isPaid) {
            return (
              <>
                {t('common.paidAt')} : {convertDate(orders[dataIndex].paidAt)}
              </>
            );
          } else {
            return <>{t('common.notPaid')}</>;
          }
        },
      },
    },
    {
      name: 'isDelivered',
      label: t('common.delivered'),
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          if (orders[dataIndex].isDelivered) {
            return (
              <>
                {t('common.deliveredAt')} :{' '}
                {convertDate(orders[dataIndex].deliveredAt)}
              </>
            );
          } else {
            return <>{t('common.notDelivered')}</>;
          }
        },
      },
    },
    {
      name: '_id',
      label: t('common.action'),
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <>
              <button
                type="submit"
                onClick={() => {
                  navigate(`/order/${orders[dataIndex]._id}`);
                }}
                className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t('common.detail')}
              </button>
            </>
          );
        },
      },
    },
  ];
  const options = {
    sort: false,
    fixedHeader: true,
    rowHover: true,
    selectableRowsHideCheckboxes: true,
    download: true,
    print: true,
    viewColumns: false,
    filter: false,
    textLabels: {
      body: {
        noMatch: 'متاسفانه موردی مطابق  درخواست شما پیدا نشد',
      },
      pagination: {
        rowsPerPage: 'تعداد ردیف در هر صفحه',

        displayRows: 'از',
      },
      toolbar: {
        search: 'جستجو',
        downloadCsv: 'دانلود اکسل',
        print: 'چاپ',
      },
    },
  };
  return (
    <>
      <Helmet>
        <title>{t('common.ordersList')}</title>
      </Helmet>

      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
        <h2 className="text-2xl text-center font-extrabold tracking-tight">
            {t('common.ordersList')}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
          <div className="px-4 py-5 sm:rounded-lg sm:px-10">
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <MUIDataTable data={orders} columns={columns} options={options} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
