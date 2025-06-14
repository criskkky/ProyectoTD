import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Users from '@/pages/Users';
import Register from '@/pages/Register';
import Error404 from '@/pages/Error404';
import Root from '@/pages/Root';
import ProtectedRoute from '@/components/ProtectedRoute';
import '@/styles/styles.css';
import Dashboard from '@/pages/Dashboard';
import Explore from '@/pages/Explore';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/explore',
        element: (
            <Explore />
        ),
      }
    ],
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
