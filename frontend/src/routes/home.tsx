import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Home() {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth='sm'>
        <Typography component='h1' variant='h2' align='center' color='text.primary' gutterBottom>
          FastAPI + React + MongoDB + Docker
        </Typography>
        <Typography variant='h5' align='center' color='text.secondary' paragraph>
          = FARMD
        </Typography>
        <Stack sx={{ pt: 4 }} direction='row' spacing={2} justifyContent='center'>
          <Button variant='contained' component={RouterLink} to='/login'>
            Login
          </Button>
          <Button variant='outlined' component={RouterLink} to='/register'>
            Register
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
