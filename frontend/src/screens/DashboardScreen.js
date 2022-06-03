import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const { t } = useTranslation();

  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
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
  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Helmet>
            <title>{t('common.orderHistory')}</title>
          </Helmet>

          <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
            <div className="px-4  text-center sm:px-6 lg:px-0">
              <h2 className="text-2xl text-center font-extrabold tracking-tight dark:text-white">
                {t('common.dashboard')}
              </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full">
              <div className="px-4 py-5 sm:rounded-lg sm:px-10">
                {loading ? (
                  <LoadingBox></LoadingBox>
                ) : error ? (
                  <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                  <>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 1, sm: 3, md: 6 }}
                    >
                      <Grid item xs={1} sm={1} md={2}>
                        <Card>
                          <CardContent>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              {t('common.orders')}
                              {' :'}
                            </Typography>

                            <Typography color="text.secondary">
                              {summary.orders && summary.orders[0]
                                ? summary.orders[0].numOrders
                                : 0}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={1} sm={1} md={2}>
                        <Card>
                          <CardContent>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              {t('common.total')}
                              {' :'}
                            </Typography>

                            <Typography color="text.secondary">
                              {summary.orders && summary.orders[0]
                                ? summary.orders[0].totalSales.toLocaleString()
                                : 0}{' '}
                              {t('common.rial')}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={1} sm={1} md={2}>
                        <Card>
                          <CardContent>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              {t('common.users')}
                              {' :'}
                            </Typography>

                            <Typography color="text.secondary">
                              {summary.users && summary.users[0]
                                ? summary.users[0].numUsers
                                : 0}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    <Card sx={{ marginY: 2 }}>
                      <CardContent>
                        <h2>
                          {t('common.sales')} {' :'}
                        </h2>
                        <br></br>
                        {summary.dailyOrders.length === 0 ? (
                          <MessageBox>{t('common.noSale')}</MessageBox>
                        ) : (
                          <Chart
                            width="100%"
                            height="400px"
                            chartType="AreaChart"
                            loader={<div>Loading Chart...</div>}
                            data={[
                              ['', ''],
                              ...summary.dailyOrders.map((x) => [
                                x._id,
                                x.sales,
                              ]),
                            ]}
                          ></Chart>
                        )}
                      </CardContent>
                    </Card>
                    <Card sx={{ marginY: 2 }}>
                      <CardContent>
                        <h2>
                          {t('common.categories')} {' :'}
                        </h2>
                        <br></br>
                        {summary.productCategories.length === 0 ? (
                          <MessageBox>{t('common.noCategories')}</MessageBox>
                        ) : (
                          <Chart
                            width="100%"
                            height="400px"
                            chartType="PieChart"
                            loader={<div>Loading Chart...</div>}
                            data={[
                                ['', ''],
                                ...summary.productCategories.map((x) => [
                                x._id,
                                x.count,
                              ]),
                            ]}
                          ></Chart>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
