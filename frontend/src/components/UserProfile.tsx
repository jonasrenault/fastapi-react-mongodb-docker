import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { useSnackBar } from '../contexts/snackbar'
import userService from '../services/user.service'
import { GoogleIcon } from './LoginForm'
import { User } from '../models/user'
import { AxiosError } from 'axios'

interface UserProfileProps {
  userProfile: User
  onUserUpdated?: (user: User) => void
  allowDelete: boolean
}

export default function UserProfile(props: UserProfileProps) {
  const { userProfile, onUserUpdated } = props
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: userProfile,
  })
  const navigate = useNavigate()
  const { user: currentUser, setUser, logout } = useAuth()
  const { showSnackBar } = useSnackBar()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    reset(userProfile)
  }, [userProfile])

  const onSubmit: SubmitHandler<User> = async (data) => {
    let updatedUser: User
    try {
      if (currentUser?.uuid === userProfile.uuid) {
        // Updating user profile.
        updatedUser = await userService.updateProfile(data)
        setUser(updatedUser)
        showSnackBar('User profile updated successfully.', 'success')
      } else {
        // Updating user different from current user.
        updatedUser = await userService.updateUser(userProfile.uuid, data)
        showSnackBar('User profile updated successfully.', 'success')
      }
      if (onUserUpdated) {
        onUserUpdated(updatedUser)
      }
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

  const handleDeleteProfile = async () => {
    setOpen(true)
  }

  const handleCancel = () => setOpen(false)

  const handleConfirm = async () => {
    setOpen(false)
    await userService.deleteSelf()
    showSnackBar('You account has been deleted.', 'success')
    logout()
    navigate('/')
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton aria-label='upload picture' component='label' sx={{ mt: 1 }}>
          <input hidden accept='image/*' type='file' />
          <Avatar
            sx={{ width: 56, height: 56 }}
            alt={userProfile.first_name + ' ' + userProfile.last_name}
            src={userProfile.picture && userProfile.picture}
          />
        </IconButton>

        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
          key={userProfile.uuid}
          noValidate
          data-testid='user-profile-form'
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='given-name'
                fullWidth
                id='firstName'
                label='First Name'
                {...register('first_name')}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id='last_name'
                label='Last Name'
                autoComplete='family-name'
                {...register('last_name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='email'
                label='Email Address'
                autoComplete='email'
                required
                disabled={
                  userProfile.provider !== null &&
                  userProfile.provider !== undefined &&
                  userProfile.provider !== ''
                }
                error={!!errors.email}
                helperText={errors.email && 'Please provide an email address.'}
                {...register('email', { required: true })}
              />
            </Grid>

            {userProfile.provider && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Connected with'
                  id='provider'
                  disabled={true}
                  variant='standard'
                  InputProps={{
                    startAdornment: <GoogleIcon sx={{ mr: 1 }} />,
                  }}
                  {...register('provider')}
                />
              </Grid>
            )}

            {!userProfile.provider && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  {...register('password')}
                />
              </Grid>
            )}

            {currentUser?.is_superuser && (
              <>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={userProfile.is_active}
                        color='primary'
                        {...register('is_active')}
                      />
                    }
                    label='Is Active'
                    disabled={currentUser.uuid === userProfile.uuid}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={userProfile.is_superuser}
                        color='primary'
                        {...register('is_superuser')}
                      />
                    }
                    label='Is Super User'
                    disabled={currentUser.uuid === userProfile.uuid}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Update
          </Button>
          {props.allowDelete && (
            <Button
              fullWidth
              variant='outlined'
              sx={{ mb: 2 }}
              color='error'
              onClick={handleDeleteProfile}
            >
              Delete my account
            </Button>
          )}
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-describedby='alert-profile-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-profile-dialog-description'>
            Are you sure you want to delete your account ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant='contained' color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
