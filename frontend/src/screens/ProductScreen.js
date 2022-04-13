import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { HeartIcon } from '@heroicons/react/outline';
import { Tab } from '@headlessui/react';
import Alert from '@mui/material/Alert';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { Store } from '../Store';
import Button from '@mui/material/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const { slug } = params;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };
  // function classNames(...classes) {
  //   return classes.filter(Boolean).join(' ');
  // }
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="error">{error}</MessageBox>
  ) : (
    <div className="mx-auto">
      <nav
        className="flex py-3 px-5 mb-5 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Breadcrumb"
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="none" color="inherit" href="/">
            {t('headerNav.homePage')}
          </Link>

          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
      </nav>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <Tab.Group as="div" className="flex flex-col-reverse">
          {/* Image selector */}
          <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
            <Tab.List className="grid grid-cols-4 gap-6">
              {/* {product.images.map((image) => (
                <Tab
                  key={image.id}
                  className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                >
                  {({ selected }) => (
                    <>
                      <span className="sr-only">{image.name}</span>
                      <span className="absolute inset-0 rounded-md overflow-hidden">
                        <img
                          src={image.src}
                          alt=""
                          className="w-full h-full object-center object-cover"
                        />
                      </span>
                      <span
                        className={classNames(
                          selected ? 'ring-indigo-500' : 'ring-transparent',
                          'absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none'
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Tab>
              ))} */}
            </Tab.List>
          </div>

          <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
            {/* {product.images.map((image) => (
              <Tab.Panel key={image.id}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-center object-cover sm:rounded-lg"
                />
              </Tab.Panel>
            ))} */}
          </Tab.Panels>
        </Tab.Group>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <h1 className="text-3xl font-extrabold tracking-tight ">
            {product.name}
          </h1>

          <div className="mt-3">
            <p className="text-3xl ">{product.price}</p>
          </div>

          <div className="mt-6">
            <div
              className="text-base space-y-6"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <form className="mt-6">
            <div className="mt-10 flex sm:flex-col1">
              {product.countInStock > 0 ? (
                <Button onClick={addToCartHandler} variant="contained">
                  Add to cart
                </Button>
              ) : (
                <Alert severity="error">موجود نیست</Alert>
              )}

              <button
                type="button"
                className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <HeartIcon
                  className="h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Add to favorites</span>
              </button>
            </div>
          </form>

          <section aria-labelledby="details-heading" className="mt-12">
            <h2 id="details-heading" className="sr-only">
              Additional details
            </h2>

            <div className="border-t divide-y divide-gray-200"></div>
          </section>
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;
