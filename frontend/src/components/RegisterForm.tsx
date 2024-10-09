import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Avatar, Box, Button, Collapse, Link, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSnackBar } from '../contexts/snackbar'
import { User } from '../models/user'
import authService from '../services/auth.service'
import { GoogleIcon } from './LoginForm'

const SHOW_EMAIL_REGISTER_FORM: string = import.meta.env.VITE_PWD_SIGNUP_ENABLED

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>()
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      await authService.register(data)
      showSnackBar('Registration successful.', 'success')
      navigate('/login')
    } catch (error) {
      let msg
      if (
        error instanceof AxiosError &&
        error.response &&
        typeof error.response.data.detail == 'string'
      )
        msg = error.response.data.detail
      else if (error instanceof Error) msg = error.message
      else msg = String(error)
      showSnackBar(msg, 'error')
    }
  }

  const handleGoogleLogin = async () => {
    window.location.href = authService.getGoogleLoginUrl()
  }

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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <Box>
          <Typography variant='subtitle1' gutterBottom sx={{ mt: 1, color: 'text.secondary' }}>
            No need to sign up, simply connect with your Google account and we&apos;ll import your
            profile.
          </Typography>
        </Box>
        <Button
          variant='outlined'
          startIcon={<GoogleIcon />}
          sx={{ width: 1.0, mt: 2 }}
          onClick={handleGoogleLogin}
        >
          Connect with Google
        </Button>

        {SHOW_EMAIL_REGISTER_FORM && SHOW_EMAIL_REGISTER_FORM.toLowerCase() === 'true' && (
          <Button variant='outlined' sx={{ width: 1.0, mt: 2 }} onClick={handleExpandClick}>
            Sign up with your email address
          </Button>
        )}

        <Collapse in={expanded} timeout='auto'>
          <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  autoComplete='given-name'
                  fullWidth
                  id='firstName'
                  label='First Name'
                  autoFocus
                  {...register('first_name')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Last Name'
                  autoComplete='family-name'
                  {...register('last_name')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  autoComplete='email'
                  error={!!errors.email}
                  helperText={errors.email && 'Please provide an email address.'}
                  {...register('email', { required: true })}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  error={!!errors.password}
                  helperText={errors.password && 'Please provide a password.'}
                  {...register('password', { required: true })}
                />
              </Grid>
            </Grid>
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid>
                <Link component={RouterLink} to='/login' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>
    </div>
  )
}
