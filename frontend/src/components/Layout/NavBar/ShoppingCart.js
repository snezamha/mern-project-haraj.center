import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { Store } from '../../../Store';
export default function ShoppingCart() {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <>
      <IconButton color="inherit" href='/cart'>
        <StyledBadge
          badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
          color="secondary"
        >
          <ShoppingCartIcon />
        </StyledBadge>
      </IconButton>
    </>
  );
}
