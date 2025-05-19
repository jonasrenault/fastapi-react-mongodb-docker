import { createBrowserRouter } from 'react-router'
import ErrorPage from './error-page'
import { HydrateFallback } from './fallback'
import Home, { loader as homeLoader } from './routes/home'
import Login from './routes/login'
import { Profile } from './routes/profile'
import Register from './routes/register'
import Root from './routes/root'
import SSOLogin, { loader as ssoLoader } from './routes/sso.login'
import Users, { loader as usersLoader } from './routes/users'

export const routes = [
  {
    path: '/',
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Home, HydrateFallback: HydrateFallback, loader: homeLoader },
      {
        path: 'sso-login-callback',
        Component: SSOLogin,
        loader: ssoLoader,
      },
      {
        path: 'profile',
        Component: Profile,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
      {
        path: 'users',
        Component: Users,
        HydrateFallback: HydrateFallback,
        loader: usersLoader,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
