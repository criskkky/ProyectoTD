import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Register from '@/pages/Register';
import Error404 from '@/pages/Error404';
import Root from '@/pages/Root';
import ProtectedRoute from '@/components/ProtectedRoute';
import '@/styles/styles.css';
import Dashboard from '@/pages/Dashboard';
import Explore from '@/pages/Explore';
import ServicioDetalle from '@/pages/ServicioDetalle';
import AdminPanel from '@/pages/AdminPanel';

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
      },
      {
        path: '/servicio/:id',
        element: <ServicioDetalle />
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
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
