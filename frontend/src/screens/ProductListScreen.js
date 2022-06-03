import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { getError } from '../utils';
import { toast } from 'react-toastify';

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
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const { t } = useTranslation();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);
  const createHandler = async () => {
    if (window.confirm('آیا از ایجاد محصول جدید اطمینان دارید ?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('محصول با موفقیت ایجاد شد');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };
  const deleteHandler = async (product) => {
    if (window.confirm('آیا از خذف اطمینان دارید ?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('محصول با موفقیت خذف شد');
        dispatch({ type: 'DELETE_SUCCESS' });
        navigate(`/admin/products/`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>{t('common.productList')}</title>
      </Helmet>

      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {t('common.productList')}
            </h2>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <span className="sm:ml-3">
              <button
                type="button"
                onClick={createHandler}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t('common.createProduct')}
              </button>
            </span>
          </div>
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
                        {t('common.title')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.price')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.category')}
                      </TableCell>
                      <TableCell align="center" className="font-vazir">
                        {t('common.action')}
                      </TableCell>
                    </TableRow>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan="6">
                          <MessageBox variant="warning">
                            {t('common.emptyProduct')}
                          </MessageBox>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell align="center">{product._id}</TableCell>
                            <TableCell align="center">{product.name}</TableCell>
                            <TableCell align="center">
                              {' '}
                              {product.price.toLocaleString()}
                              {'  '} {t('common.rial')}
                            </TableCell>
                            <TableCell align="center">
                              {product.category}
                            </TableCell>
                            <TableCell align="center">
                              <button
                                type="submit"
                                onClick={() => {
                                  navigate(`/admin/product/${product._id}`);
                                }}
                                className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                {t('common.edit')}
                              </button>
                              <button
                                type="submit"
                                onClick={() => deleteHandler(product)}
                                className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                {t('common.delete')}
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
            <div className="flex justify-center">
              <nav
                className="relative py-2 z-0 inline-flex rounded-md  -space-x-px"
                aria-label="Pagination"
              >
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    className={
                      x + 1 === Number(page)
                        ? 'bg-gray-300 border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    }
                    key={x + 1}
                    to={`/admin/products?page=${x + 1}`}
                  >
                    {x + 1}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          {loadingCreate && <LoadingBox></LoadingBox>}
          {loadingDelete && <LoadingBox></LoadingBox>}
        </div>
      </div>
    </>
  );
}
