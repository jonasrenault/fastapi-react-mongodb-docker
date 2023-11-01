import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { AuthProvider } from '../contexts/auth'
import { SnackBarProvider } from '../contexts/snackbar'
import RegisterForm from './RegisterForm'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

const server = setupServer(
  // Upon loading the auth context tries to load user profile
  // return 401 to simulate logged out user
  http.get(API_URL + 'users/me', () => {
    return new HttpResponse(null, {
      status: 401,
    })
  }),

  http.post(API_URL + 'users', () => {
    return HttpResponse.json({
      email: 'john@example.com',
      is_active: true,
      is_superuser: false,
      uuid: '48f0c771-1d00-4595-b1b4-f2ee060237bc',
    })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function setup() {
  const user = userEvent.setup()
  const route = '/some-route'
  const utils = render(
    <AuthProvider>
      <SnackBarProvider>
        <MemoryRouter initialEntries={[route]}>
          <RegisterForm />
        </MemoryRouter>
      </SnackBarProvider>
    </AuthProvider>,
  )
  const setEmailInput = (value: string) => user.type(utils.getByLabelText(/Email Address/i), value)
  const setPasswordInput = (value: string) => user.type(utils.getByLabelText(/Password/i), value)
  return {
    ...utils,
    user,
    setEmailInput,
    setPasswordInput,
  }
}

it('should render a sign up button', async () => {
  const { getByRole, user } = setup()

  const registerByMailBtn = getByRole('button', { name: 'Sign up with your email address' })
  await user.click(registerByMailBtn)

  expect(getByRole('button', { name: 'Sign Up' })).toHaveTextContent(/Sign Up/i)
})

it('should display required helper text', async () => {
  const { getByRole, getByText, user } = setup()
  const registerByMailBtn = getByRole('button', { name: 'Sign up with your email address' })
  await user.click(registerByMailBtn)

  const registerBtn = getByRole('button', { name: 'Sign Up' })
  await user.click(registerBtn)

  expect(getByText(/Please provide an email address./i)).toBeVisible()
  expect(getByText(/Please provide a password./i)).toBeVisible()
})

it('should register user', async () => {
  const { getByRole, user, setEmailInput, setPasswordInput } = setup()
  const registerByMailBtn = getByRole('button', { name: 'Sign up with your email address' })
  await user.click(registerByMailBtn)

  await setEmailInput('john@example.com')
  await setPasswordInput('johnjohn')
  const registerBtn = getByRole('button', { name: 'Sign Up' })
  await user.click(registerBtn)

  expect(getByRole('alert')).toHaveTextContent('Registration successful.')
})

it('should handle server errors', async () => {
  const { getByRole, user, setEmailInput, setPasswordInput } = setup()
  const registerByMailBtn = getByRole('button', { name: 'Sign up with your email address' })
  await user.click(registerByMailBtn)

  await setEmailInput('john@example.com')
  await setPasswordInput('johnjohn')
  const registerBtn = getByRole('button', { name: 'Sign Up' })

  const error = 'User with that email already exists'
  server.use(
    http.post(API_URL + 'users', () => {
      return HttpResponse.json({ detail: error }, { status: 500 })
    }),
  )

  await user.click(registerBtn)

  expect(getByRole('alert')).toHaveTextContent(error)
})
