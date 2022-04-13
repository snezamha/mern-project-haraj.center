import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
// import { useTheme } from '@mui/material/styles';

export default function ThemeSwitch() {
  const [theme, setTheme] = useState(true);
  const icon = !theme ? <Brightness7Icon /> : <Brightness4Icon />;

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="mode"
        onClick={() => setTheme(!theme)}
      >
        {icon}
      </IconButton>
    </>
  );
}
