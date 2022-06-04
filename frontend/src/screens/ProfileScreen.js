import React, { useContext, useState, useReducer } from 'react';
import { Store } from '../Store';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
}
export default function ProfileScreen() {
  const { t } = useTranslation();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [fullName, setFullName] = useState(userInfo.fullName);
  const [mobile, setMobile] = useState(userInfo.mobile);
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({
        type: 'UPDATE_REQUEST',
      });
      const { data } = await axios.put(
        '/api/users/profile',
        {
          fullName,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'UPDATE_SUCCESS', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('اطلاعات به روزرسانی شد');
    } catch (err) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
    }
  };
  return loadingUpdate ? (
    <LoadingBox></LoadingBox>
  ) : (
    <>
      <Helmet>
        <title>{t('common.profile')}</title>
      </Helmet>

      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
        <h2 className="text-2xl text-center font-extrabold tracking-tight">
            {t('common.profile')}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
          <div className="px-4 py-5 sm:rounded-lg sm:px-10">
            <Box
              component="form"
              onSubmit={submitHandler}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                id="mobile"
                label={t('common.mobile')}
                margin="normal"
                fullWidth
                variant="outlined"
                disabled={true}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <TextField
                id="FullName"
                label={t('common.fullName')}
                margin="normal"
                fullWidth
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                      className="mx-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {t('common.update')}
                    </button>
                  </Stack>
                </div>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}
