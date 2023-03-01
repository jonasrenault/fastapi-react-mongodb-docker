import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Grid, Box, FormControlLabel, Checkbox } from '@mui/material';
import { useSnackBar } from '../contexts/snackbar';
import { useAuth, User } from '../contexts/auth';
import userService from '../services/user.service';

interface UserProfileProps {
  userProfile: User;
}

export default function UserProfile(props: UserProfileProps) {
  const { userProfile } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();

  const onSubmit = async (data) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    console.log(data);

    // Updating user profile
    if (user.uuid === userProfile.uuid) {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
    } else {
      await userService.updateUser(userProfile.uuid, data);
    }
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    //   is_active: data.get('is_active'),
    // });
    // const userUpdate = Object.fromEntries(data);

    // console.log(userUpdate);
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
        <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='given-name'
                name='first_name'
                fullWidth
                id='firstName'
                label='First Name'
                defaultValue={userProfile.first_name}
                {...register('first_name')}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id='last_name'
                label='Last Name'
                name='lastName'
                autoComplete='family-name'
                defaultValue={userProfile.last_name}
                {...register('last_name')}
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
                {...register('email', { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='new-password'
                {...register('password')}
              />
            </Grid>
            {user?.is_superuser && (
              <>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name='is_active'
                        defaultChecked={userProfile.is_active}
                        color='primary'
                        {...register('is_active')}
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
                        {...register('is_superuser')}
                      />
                    }
                    label='Is Super User'
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Update
          </Button>
        </Box>
      </Box>
    </div>
  );
}
