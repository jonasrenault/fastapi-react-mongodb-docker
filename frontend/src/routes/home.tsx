import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, Button, Stack, Link } from '@mui/material';

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
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href='https://fastapi.tiangolo.com/'>
            <Box
              component='img'
              sx={{
                width: 250,
              }}
              alt='FastAPI'
              src='public/fastapi.png'
            />
          </Link>

          <Typography variant='h3' sx={{ mr: 2 }} color='text.secondary'>
            +
          </Typography>

          <Link href='https://reactjs.org/' underline='none'>
            <Box sx={{ display: 'flex' }}>
              <Box
                component='img'
                sx={{
                  width: 40,
                  mr: 1,
                }}
                alt='ReactIcon'
                src='public/react.svg'
              />
              <Typography variant='h3' align='center' color='rgb(97, 218, 251)'>
                React
              </Typography>
            </Box>
          </Link>

          <Typography variant='h3' sx={{ mx: 2 }} color='text.secondary'>
            +
          </Typography>

          <Link href='https://www.mongodb.com/'>
            <Box
              component='img'
              sx={{
                // height: 233,
                width: 250,
              }}
              alt='MongoDB'
              src='public/mongodb.png'
            />
          </Link>

          <Typography variant='h3' sx={{ mr: 2, ml: 1 }} color='text.secondary'>
            +
          </Typography>

          <Link href='https://www.docker.com/'>
            <Box
              component='img'
              sx={{
                // height: 233,
                width: 250,
              }}
              alt='Docker'
              src='public/docker.png'
            />
          </Link>
        </Box>

        {/* <Typography component='h1' variant='h2' align='center' color='text.primary' gutterBottom>
          FastAPI + React + MongoDB + Docker
        </Typography> */}
        <Typography variant='h3' align='center' color='text.secondary' sx={{ mt: 5 }}>
          = FARMD
        </Typography>
        <Stack sx={{ pt: 5 }} direction='row' spacing={2} justifyContent='center'>
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
