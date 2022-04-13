import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';

const DrawerMenu = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const { t } = useTranslation();

  const Pages = [
    t('headerNav.homePage'),
    t('headerNav.aboutUs'),
    t('headerNav.contactUs'),
  ];
  return (
    <React.Fragment>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor={'bottom'}
      >
        <List>
          {Pages.map((page, index) => (
            <ListItemButton key={index} onClick={() => setOpenDrawer(false)}>
              <ListItemIcon>
                <ListItemText>{page}</ListItemText>
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <IconButton
        color="inherit"
        sx={{
          marginLeft: 'auto',
        }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon />
      </IconButton>
    </React.Fragment>
  );
};
export default DrawerMenu;
