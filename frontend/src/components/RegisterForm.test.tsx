import { expect, it } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/auth'
import { SnackBarProvider } from '../contexts/snackbar'
import RegisterForm from './RegisterForm'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

const server = setupServer(
  // Upon loading the auth context tries to load user profile
  // return 401 to simulate logged out user
  rest.get(API_URL + 'users/me', (req, res, ctx) => {
    return res(ctx.status(401))
  }),

  rest.post(API_URL + 'users', (req, res, ctx) => {
    return res(
      ctx.json({
        email: 'john@example.com',
        is_active: true,
        is_superuser: false,
        uuid: '48f0c771-1d00-4595-b1b4-f2ee060237bc',
      }),
    )
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
  const setEmailInput = (value) => user.type(utils.getByLabelText(/Email Address/i), value)
  const setPasswordInput = (value) => user.type(utils.getByLabelText(/Password/i), value)
  return {
    ...utils,
    user,
    setEmailInput,
    setPasswordInput,
  }
}

it('should render a sign up button', () => {
  const { getByRole } = setup()
  expect(getByRole('button')).toHaveTextContent(/Sign Up/i)
})

it('should display required helper text', async () => {
  const { getByRole, getByText, user } = setup()
  const registerBtn = getByRole('button')

  await user.click(registerBtn)

  expect(getByText(/Please provide an email./i)).toBeVisible()
  expect(getByText(/Please provide a password./i)).toBeVisible()
})

it('should register user', async () => {
  const { getByRole, user, setEmailInput, setPasswordInput } = setup()
  await setEmailInput('john@example.com')
  await setPasswordInput('johnjohn')
  const registerBtn = getByRole('button')

  await user.click(registerBtn)

  expect(getByRole('alert')).toHaveTextContent('Registration successful.')
})

it('should handle server errors', async () => {
  const { getByRole, user, setEmailInput, setPasswordInput } = setup()
  await setEmailInput('john@example.com')
  await setPasswordInput('johnjohn')
  const registerBtn = getByRole('button')

  const error = 'User with that email already exists'
  server.use(
    rest.post(API_URL + 'users', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ detail: error }))
    }),
  )

  await user.click(registerBtn)

  expect(getByRole('alert')).toHaveTextContent(error)
})
