import React, { useContext, useState, useReducer, useEffect } from 'react';
import { Store } from '../Store';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
const Input = styled('input')({
  display: 'none',
});
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};
export default function ProfileScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const params = useParams(); // /product/:id
  const { id: productId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('محصول با موفقیت ویرایش شد');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('تصویر با موفقیت اضافه شد. برای ثبت حتما بروزرسانی کنید');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success('تصویر با موفقیت حدف شد. برای ثبت حتما بروزرسانی کنید');
  };
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <>
      <Helmet>
        <title>
          {t('common.editProduct')} {productId}
        </title>
      </Helmet>

      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
        <h2 className="text-2xl text-center font-extrabold tracking-tight">
            {t('common.editProduct')} {productId}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
          <div className="px-4 py-5 sm:rounded-lg sm:px-10">
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={submitHandler}
            >
              <TextField
                id="name"
                label={t('common.title')}
                margin="normal"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                id="slug"
                label={t('common.slug')}
                margin="normal"
                fullWidth
                variant="outlined"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <TextField
                id="price"
                label={t('common.price')}
                margin="normal"
                fullWidth
                variant="outlined"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                id="image"
                label={t('common.image')}
                margin="normal"
                fullWidth
                disabled
                variant="outlined"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Stack direction="row" alignItems="center" spacing={2}>
                <label htmlFor="icon-button-file">
                  <Input
                    onChange={uploadFileHandler}
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                  />
                  <div style={{ width: '100%' }}>
                    <Box display="flex" p={1} style={{ alignItems: 'center' }}>
                      <Box p={1} flexGrow={1}>
                        <Typography className="font-vazir">
                            انتخاب تصویر اصلی محصول :
                        </Typography>
                      </Box>
                      <Box p={1}>
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          {loadingUpload ? (
                            <CircularProgress />
                          ) : (
                            <PhotoCamera />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  </div>
                </label>
              </Stack>
              <Form.Group className="mb-3" controlId="additionalImage">
                <Form.Label>تصاویر مکمل :</Form.Label>
                {images.length === 0 && <MessageBox>تصویری انتخاب نشده است</MessageBox>}
                <ListGroup variant="flush">
                  {images.map((x) => (
                    <ListGroup.Item key={x}>
                      {x}
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => deleteFileHandler(x)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="additionalImageFile">
                <Form.Label>افزودن تصویر</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => uploadFileHandler(e, true)}
                />
              </Form.Group>
              <TextField
                id="category"
                label={t('common.category')}
                margin="normal"
                fullWidth
                variant="outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <TextField
                id="countInStock"
                label={t('common.countInStock')}
                margin="normal"
                fullWidth
                variant="outlined"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
              <TextField
                id="description"
                label={t('common.description')}
                margin="normal"
                fullWidth
                multiline
                minRows={5}
                maxRows={5}
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

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
                      disabled={loadingUpdate}
                      className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {t('common.update')}
                    </button>
                  </Stack>
                </div>
              </Box>
            </Box>
          </div>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </div>
      </div>
    </>
  );
}
