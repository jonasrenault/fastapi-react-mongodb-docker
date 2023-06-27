import { useEffect } from 'react'
import { Container } from '@mui/material'
import { redirect } from 'react-router-dom'
import authService from '../services/auth.service'
import userService from '../services/user.service'
import { useNavigate } from 'react-router-dom'
import { useSnackBar } from '../contexts/snackbar'
import { useAuth } from '../contexts/auth'
import { AxiosError } from 'axios'

export async function loader() {
  try {
    await authService.refreshToken()
    return null
  } catch {
    return redirect('/')
  }
}

/**
 * The loader function will try to refresh the user token using the
 * Authorization cookie set by sso login.
 * Upon loading this component, it will fetch the logged in user Profile
 * and set the user for the auth context, then redirect to Home.
 */
export default function SSOLogin() {
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()
  const { setUser } = useAuth()

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const user = await userService.getProfile()
        setUser(user)
        showSnackBar('Login successful.', 'success')
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
        setUser(undefined)
      } finally {
        navigate('/')
      }
    }
    fetchUserProfile()
  }, [])

  return <Container component='main' maxWidth='sm' sx={{ mb: 4 }}></Container>
}
