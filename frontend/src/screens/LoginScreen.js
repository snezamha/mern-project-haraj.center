import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Controller, useForm } from 'react-hook-form';
import { useContext, useEffect } from 'react';
import { Store } from '../Store';

export default function SigninScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const { state } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async ({ mobile }) => {
    try {
      await Axios.post('/api/users/login', {
        mobile,
      });
      navigate('/verify?number=' + mobile + '&redirect=' + redirect);
    } catch (err) {
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>{t('common.signIn')}</title>
      </Helmet>

      <div className="lg:max-w-7xl lg:mx-auto lg:px-8">
        <div className="px-4  text-center sm:px-6 lg:px-0">
          <h2 className="text-2xl text-center font-extrabold tracking-tight dark:text-white">
            {t('common.signIn')}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full">
          <div className="px-4 sm:rounded-lg sm:px-10">
            <form
              className="space-y-6"
              noValidate
              onSubmit={handleSubmit(submitHandler)}
            >
              <Controller
                name="mobile"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  pattern: /^09\d{9}$/,
                }}
                render={({ field }) => (
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    variant="outlined"
                    id="mobile"
                    label={t('common.mobile')}
                    inputProps={{ type: 'mobile' }}
                    error={Boolean(errors.mobile)}
                    helperText={
                      errors.mobile
                        ? errors.mobile.type === 'pattern'
                          ? 'تلفن همراه معتبر نیست . الگوی صحیح : 09XXXXXXXXX'
                          : 'تلفن همراه الزامی است'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>

              <Box textAlign="center">
                <div className="mt-2">
                  <button
                    type="submit"
                    className="bg-primary w-full

                  bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    {t('common.sendCode')}
                  </button>
                </div>
              </Box>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
