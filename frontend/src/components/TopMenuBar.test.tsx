import { expect, it } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/auth'
import { SnackBarProvider } from '../contexts/snackbar'
import TopMenuBar from './TopMenuBar'

const API_URL = import.meta.env.VITE_BACKEND_API_URL
const profile: User = {
  email: 'john@example.com',
  is_active: true,
  is_superuser: false,
  uuid: '48f0c771-1d00-4595-b1b4-f2ee060237bc',
}

const server = setupServer(
  rest.get(API_URL + 'users/me', (req, res, ctx) => {
    return res(ctx.status(401))
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
          <TopMenuBar />
        </MemoryRouter>
      </SnackBarProvider>
    </AuthProvider>,
  )

  return {
    ...utils,
    user,
  }
}

function setupLogged() {
  server.use(
    rest.get(API_URL + 'users/me', (req, res, ctx) => {
      return res(ctx.json(profile))
    }),
  )
  return setup()
}

it('should render login and register buttons', () => {
  const { getByText } = setup()
  expect(getByText(/Login/i)).toBeInTheDocument()
  expect(getByText(/Register/i)).toBeInTheDocument()
})

it('should render profile menu when logged in', async () => {
  const { queryByText, getByLabelText } = setupLogged()
  await waitFor(() => {
    expect(getByLabelText(/Account settings/i)).toBeInTheDocument()
    expect(queryByText(/Login/i)).not.toBeInTheDocument()
    expect(queryByText(/Register/i)).not.toBeInTheDocument()
  })
})

it('should show profile menu when clicked', async () => {
  const { findAllByRole, getByLabelText, user } = setupLogged()
  await waitFor(() => {
    expect(getByLabelText(/Account settings/i)).toBeInTheDocument()
  })
  const menuBtn = getByLabelText(/Account settings/i)

  await user.click(menuBtn)

  const menuItems = await findAllByRole('menuitem')
  expect(menuItems).toHaveLength(4)
  expect(menuItems[0]).toHaveTextContent(/Profile/i)
  expect(menuItems[3]).toHaveTextContent(/Logout/i)
})

it('should show users menu for admins', async () => {
  const admin: User = {
    email: 'admin@example.com',
    is_superuser: true,
    uuid: '48f0c771-1d00-4595-b1b4-f2ee060237bc',
  }
  server.use(
    rest.get(API_URL + 'users/me', (req, res, ctx) => {
      return res(ctx.json(admin))
    }),
  )
  const { getByText, getByLabelText } = setup()
  await waitFor(() => {
    expect(getByLabelText(/Account settings/i)).toBeInTheDocument()
    expect(getByText(/Users/i)).toBeInTheDocument()
  })
})

it('should logout', async () => {
  const { getByText, getByLabelText, queryByLabelText, user } = setupLogged()
  await waitFor(() => {
    expect(getByLabelText(/Account settings/i)).toBeInTheDocument()
  })
  const menuBtn = getByLabelText(/Account settings/i)
  await user.click(menuBtn)

  localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
  const logoutBtn = getByText(/Logout/i)
  await user.click(logoutBtn)

  expect(localStorage.getItem('token')).toBeNull()
  expect(queryByLabelText(/Account settings/i)).not.toBeInTheDocument()
})
