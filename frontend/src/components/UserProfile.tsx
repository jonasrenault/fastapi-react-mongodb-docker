import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Grid, Box, FormControlLabel, Checkbox } from '@mui/material';
import { useSnackBar } from '../contexts/snackbar';
import { User } from '../contexts/auth';

interface UserProfileProps {
  userProfile: User;
}

export default function UserProfile(props: UserProfileProps) {
  const { userProfile } = props;
  console.log(userProfile);
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      is_active: data.get('is_active'),
    });
    const userUpdate = Object.fromEntries(data);

    console.log(userUpdate);
    // try {
    //   const response = await authService.register(userData);
    //   console.log(response);
    //   showSnackBar('Registration successful.', 'success', 3000);
    //   navigate('/login');
    // } catch (error) {
    //   console.log(error.message);
    //   showSnackBar(error.message, 'error', 3000);
    // }
  };

  return (
    <div>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='given-name'
                name='first_name'
                required
                fullWidth
                id='firstName'
                label='First Name'
                defaultValue={userProfile.first_name}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id='last_name'
                label='Last Name'
                name='lastName'
                autoComplete='family-name'
                defaultValue={userProfile.last_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                defaultValue={userProfile.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='new-password'
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='is_active'
                    defaultChecked={userProfile.is_active}
                    color='primary'
                  />
                }
                label='Is Active'
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='is_superuser'
                    defaultChecked={userProfile.is_superuser}
                    color='primary'
                  />
                }
                label='Is Super User'
              />
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Update
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link component={RouterLink} to='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
