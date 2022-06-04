import React from 'react';
import {
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CardMedia,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import MessageBox from '../components/MessageBox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CartScreen() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };
  return (
    <>
      <div>
        <Helmet>
          <title> {t('common.shoppingCart')}</title>
        </Helmet>
      </div>
      <div className="mx-auto ">
        <h2 className="text-2xl text-center font-extrabold tracking-tight">
          {t('common.shoppingCart')}
        </h2>
        <>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section
              aria-labelledby="cart-heading"
              className="lg:col-span-7 border rounded-lg px-4 py-6"
            >
              <TableContainer>
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
                      <TableCell align="center" className="font-vazir">
                        {t('common.action')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan="5">
                          <MessageBox variant="warning">
                            {t('common.emptyCart')}
                          </MessageBox>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell align="center">
                              <Link to={`/product/${item.slug}`}>
                                <CardMedia
                                  component="img"
                                  image={item.image}
                                  // image={item.image}
                                  alt={item.name}
                                />
                              </Link>
                            </TableCell>

                            <TableCell align="center">
                              <Link
                                style={{ textDecoration: 'none' }}
                                to={`/product/${item.slug}`}
                              >
                                <Typography className="font-vazir">
                                  {item.name}
                                </Typography>
                              </Link>
                            </TableCell>
                            <TableCell align="center" className="font-vazir">
                              <div style={{ display: 'inline-flex' }}>
                                <button
                                  aria-label=""
                                  type="button"
                                  onClick={() =>
                                    updateCartHandler(item, item.quantity + 1)
                                  }
                                  disabled={item.quantity === item.countInStock}
                                >
                                  <AddIcon fontSize="small" />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  aria-label=""
                                  type="button"
                                  onClick={() =>
                                    updateCartHandler(item, item.quantity - 1)
                                  }
                                  disabled={item.quantity === 1}
                                >
                                  <RemoveIcon fontSize="small" />
                                </button>
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              {item.price.toLocaleString()}
                              {'  '} {t('common.rial')}
                            </TableCell>
                            <TableCell align="center">
                              <button
                                aria-label=""
                                type="button"
                                onClick={() => removeItemHandler(item)}
                                className="m-1 h-8 w-8 rounded p-1"
                              >
                                <CloseIcon />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
            <section
              aria-labelledby="summary-heading"
              className="mt-16 border rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
            >
              <h2 id="summary-heading" className="text-lg font-medium ">
                {t('common.subtotal')}
                {' : '}
                {cartItems.reduce((a, c) => a + c.quantity, 0)}
                {'  '}
                {t('common.item')}
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-sm text-gray-900">{t('common.total')} :</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0).toLocaleString()}{' '}
                    ریال
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                  {t('common.proceedToCheckout')}
                </button>
              </div>
            </section>
          </div>
        </>
      </div>
    </>
  );
}
