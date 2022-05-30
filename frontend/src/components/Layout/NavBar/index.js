import * as React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LangSwitch from './LangSwitch';
import ThemeSwitch from './ThemeSwitch';
import ShoppingCart from './ShoppingCart';
import Link from '@mui/material/Link';
import { useContext } from 'react';
import { Store } from '../../../Store';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from './Drawer';
export default function NavBar() {
  const { t } = useTranslation();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/'
    toast.success(t('common.logOutSuccess'));
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const Pages = [
    t('headerNav.homePage'),
    t('headerNav.aboutUs'),
    t('headerNav.contactUs'),
  ];

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <LangSwitch />
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <ThemeSwitch />
            {userInfo ? (
              <>
                <IconButton color="inherit" onClick={handleClick}>
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <Link href="/profile" underline="none" color="inherit">
                    <MenuItem>{t('common.profile')}</MenuItem>
                  </Link>
                  <Link href="/orderhistory" underline="none" color="inherit">
                    <MenuItem>{t('common.orderHistory')}</MenuItem>
                  </Link>

                  <MenuItem onClick={signoutHandler}>
                    {t('common.logOut')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton color="inherit" href="/login">
                <AccountCircleIcon />
              </IconButton>
            )}

            <ShoppingCart />
          </Box>
        </Toolbar>
      </AppBar>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Link underline="none" color="inherit" href="/">
            <Typography> {t('common.siteTitle')}</Typography>
          </Link>
          {isMobile ? (
            <>
              <Drawer />
            </>
          ) : (
            <>
              <Box style={{ marginRight: '25px', marginLeft: '25px' }}>
                {Pages.map((page, index) => (
                  <Button key={index}>{page}</Button>
                ))}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
