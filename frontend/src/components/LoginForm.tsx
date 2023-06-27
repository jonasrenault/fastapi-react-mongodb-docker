import { useState } from 'react'
import {
  Box,
  Avatar,
  Typography,
  Button,
  TextField,
  Link,
  Grid,
  SvgIcon,
  SvgIconProps,
  Collapse,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSnackBar } from '../contexts/snackbar'
import { useAuth } from '../contexts/auth'
import authService from '../services/auth.service'
import { User } from '../models/user'
import { AxiosError } from 'axios'

export function GoogleIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 48 48'>
      <path
        fill='#FFC107'
        d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
      ></path>
      <path
        fill='#FF3D00'
        d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
      ></path>
      <path
        fill='#4CAF50'
        d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
      ></path>
      <path
        fill='#1976D2'
        d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
      ></path>
    </SvgIcon>
  )
}

export function FacebookIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 48 48'>
      <linearGradient
        id='Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1'
        x1='9.993'
        x2='40.615'
        y1='9.993'
        y2='40.615'
        gradientUnits='userSpaceOnUse'
      >
        <stop offset='0' stopColor='#2aa4f4'></stop>
        <stop offset='1' stopColor='#007ad9'></stop>
      </linearGradient>
      <path
        fill='url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)'
        d='M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z'
      ></path>
      <path
        fill='#fff'
        d='M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z'
      ></path>
    </SvgIcon>
  )
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>()
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()
  const { login } = useAuth()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const formData = new FormData()
      formData.append('username', data.email)
      formData.append('password', data.password as string)
      await login(formData)
      showSnackBar('Login successful.', 'success')
      navigate('/')
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
      <Button
        variant='outlined'
        startIcon={<GoogleIcon />}
        sx={{ width: 1.0, mt: 2 }}
        onClick={handleGoogleLogin}
      >
        Sign in with Google
      </Button>

      <Button variant='outlined' sx={{ width: 1.0, mt: 2 }} onClick={handleExpandClick}>
        Sign in with your email address
      </Button>

      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email address'
            autoComplete='email'
            autoFocus
            error={!!errors.email}
            helperText={errors.email && 'Please provide an email address.'}
            {...register('email', { required: true })}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            error={!!errors.password}
            helperText={errors.password && 'Please provide a password.'}
            {...register('password', { required: true })}
          />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link component={RouterLink} to='/register' variant='body2'>
                {"Don't have an account yet? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  )
}
