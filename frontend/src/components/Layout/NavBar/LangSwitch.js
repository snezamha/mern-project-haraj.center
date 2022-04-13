import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import cookies from 'js-cookie';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Flag from 'react-world-flags';
export default function DialogSelect() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    // if (reason !== 'backdropClick') {
    setOpen(false);
    // }
  };
  const { t, i18n } = useTranslation();

  const changeLanguageHandler = (code) => {
    const languageValue = code;
    i18n.changeLanguage(languageValue);
    setOpen(false);
  };
  const languages = [
    {
      code: 'fa',
      name: 'فارسی',
      dir: 'rtl',
    },
    {
      code: 'en',
      name: 'English',
    },
    {
      code: 'de',
      name: 'Deutsch',
    },
  ];
  const currentLanguageCode = cookies.get('i18next') || 'en';
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  useEffect(() => {
    document.body.dir = currentLanguage.dir || 'ltr';
  }, [currentLanguage, t]);
  return (
    <div>
      <IconButton
        color="inherit"
        onClick={handleClickOpen}
      >
        <LanguageIcon />
      </IconButton>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div className="flex flex-wrap content-end m-auto">
              <List>
                <ListItem disablePadding key="fa">
                  <ListItemButton
                    selected={'fa' === currentLanguageCode}
                    onClick={() => {
                      changeLanguageHandler('fa');
                    }}
                  >
                    <ListItemIcon>
                      <Flag code="ir" style={{ width: '30px' }} />
                    </ListItemIcon>
                    <ListItemText primary={t('common.persian')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding key="en">
                  <ListItemButton
                    selected={'en' === currentLanguageCode}
                    onClick={() => {
                      changeLanguageHandler('en');
                    }}
                  >
                    <ListItemIcon>
                      <Flag code="gb" style={{ width: '30px' }} />
                    </ListItemIcon>
                    <ListItemText primary={t('common.english')} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding key="de">
                  <ListItemButton
                    selected={'de' === currentLanguageCode}
                    onClick={() => {
                      changeLanguageHandler('de');
                    }}
                  >
                    <ListItemIcon>
                      <Flag code="de" style={{ width: '30px' }} />
                    </ListItemIcon>
                    <ListItemText primary={t('common.deutsch')} />
                  </ListItemButton>
                </ListItem>
              </List>
            </div>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions className="m-auto">
          <Button onClick={handleClose}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
