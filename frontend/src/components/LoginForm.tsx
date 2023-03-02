import { Box, Avatar, Typography, Button, TextField, Link, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackBar } from '../contexts/snackbar';
import { useAuth } from '../contexts/auth';

export default function LoginForm() {
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      await login(data);
      showSnackBar('Login successful.', 'success', 3000);
      navigate('/');
    } catch (error) {
      console.log(error.message);
      showSnackBar(error.message, 'error', 3000);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Sign in
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email Address'
          name='username'
          autoComplete='email'
          autoFocus
        />
        <TextField
          margin='normal'
          required
          fullWidth
          name='password'
          label='Password'
          type='password'
          id='password'
          autoComplete='current-password'
        />
        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
        <Grid container justifyContent='flex-end'>
          <Grid item>
            <Link component={RouterLink} to='/register' variant='body2'>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
