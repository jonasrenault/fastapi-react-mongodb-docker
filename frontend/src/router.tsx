import { createBrowserRouter } from 'react-router-dom'
import Root from './routes/root'
import Home from './routes/home'
import ErrorPage from './error-page'
import { Profile } from './routes/profile'
import Login from './routes/login'
import Register from './routes/register'
import Users, { loader as usersLoader } from './routes/users'

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'users',
        element: <Users />,
        loader: usersLoader,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
