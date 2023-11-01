import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { AuthProvider } from '../contexts/auth'
import { SnackBarProvider } from '../contexts/snackbar'
import { User } from '../models/user'
import UserProfile from './UserProfile'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

const server = setupServer(
  http.patch(API_URL + 'users/me', () => {
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
  const profile: User = {
    email: 'john@example.com',
    is_active: true,
    is_superuser: false,
    uuid: '48f0c771-1d00-4595-b1b4-f2ee060237bc',
  }
  const handleUpdate = vi.fn()

  const utils = render(
    <AuthProvider>
      <SnackBarProvider>
        <MemoryRouter initialEntries={[route]}>
          <UserProfile userProfile={profile} onUserUpdated={handleUpdate} allowDelete={false} />
        </MemoryRouter>
      </SnackBarProvider>
    </AuthProvider>,
  )
  const setEmailInput = (value: string) => user.type(utils.getByLabelText(/Email Address/i), value)
  const setPasswordInput = (value: string) => user.type(utils.getByLabelText(/Password/i), value)
  return {
    ...utils,
    user,
    profile,
    handleUpdate,
    setEmailInput,
    setPasswordInput,
  }
}

function setupForAdmin() {
  const currentUser: User = {
    email: 'admin@example.com',
    is_active: true,
    is_superuser: true,
    uuid: '6bb9c5ba-e558-4a2a-9a33-22b2f21072d0',
  }

  server.use(
    http.get(API_URL + 'users/me', () => {
      return HttpResponse.json(currentUser)
    }),
  )

  return { currentUser, ...setup() }
}

function setupForUser() {
  const currentUser: User = {
    email: 'john@example.com',
    is_active: true,
    is_superuser: false,
    uuid: '48f0c771-1d00-4595-b1b4-f2ee060237bc',
  }

  server.use(
    http.get(API_URL + 'users/me', () => {
      return HttpResponse.json(currentUser)
    }),
  )

  return { currentUser, ...setup() }
}

it('should render an update button', () => {
  const { getByRole } = setupForUser()
  expect(getByRole('button', { name: 'Update' })).toHaveTextContent(/Update/i)
})

it('should render default values of profile', () => {
  const { getByLabelText, profile } = setupForUser()
  expect(getByLabelText(/Email Address/i)).toHaveValue(profile.email)
})

it('should display required helper text', async () => {
  const { getByRole, getByText, user, getByLabelText } = setupForUser()
  await user.clear(getByLabelText(/Email Address/i))

  const updateBtn = getByRole('button', { name: 'Update' })
  await user.click(updateBtn)

  expect(getByText(/Please provide an email address./i)).toBeVisible()
})

it('should display is_active and is_superuser if admin', async () => {
  const { getByLabelText } = setupForAdmin()
  await waitFor(() => {
    expect(getByLabelText('Is Super User')).toBeInTheDocument()
    expect(getByLabelText('Is Active')).toBeInTheDocument()
  })
})

it('should update user profile', async () => {
  const { getByRole, user } = setupForUser()

  const updateBtn = getByRole('button', { name: 'Update' })
  await user.click(updateBtn)

  expect(getByRole('alert')).toHaveTextContent('User profile updated successfully.')
})

it('should update other user profile', async () => {
  const { getByRole, user, profile } = setupForAdmin()

  server.use(
    http.patch(API_URL + `users/${profile.uuid}`, () => {
      return HttpResponse.json(profile)
    }),
  )

  const updateBtn = getByRole('button', { name: 'Update' })
  await user.click(updateBtn)

  expect(getByRole('alert')).toHaveTextContent('User profile updated successfully.')
})

it('should call onUpdate', async () => {
  const { getByRole, user, profile, handleUpdate } = setupForAdmin()

  const updatedProfile = {
    email: 'adam@example.com',
  }
  server.use(
    http.patch(API_URL + `users/${profile.uuid}`, () => {
      return HttpResponse.json(updatedProfile)
    }),
  )

  const updateBtn = getByRole('button', { name: 'Update' })
  await user.click(updateBtn)

  expect(handleUpdate).toHaveBeenCalledWith(updatedProfile)
})

it('should handle server errors', async () => {
  const { getByRole, user } = setupForUser()

  const error = 'User with this email already exists'
  server.use(
    http.patch(API_URL + `users/me`, () => {
      return HttpResponse.json({ detail: error }, { status: 500 })
    }),
  )

  const updateBtn = getByRole('button', { name: 'Update' })
  await user.click(updateBtn)

  expect(getByRole('alert')).toHaveTextContent(error)
})
