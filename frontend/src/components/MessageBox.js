import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
export default function MessageBox(props) {
  return (
    <div>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert variant="filled" severity={props.variant || 'info'}>
          {props.children}
        </Alert>
      </Stack>
    </div>
  );
}
