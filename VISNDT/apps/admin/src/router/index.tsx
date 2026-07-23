import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth } from '../auth';
import AdminLayout from '../layouts/AdminLayout';
import { DemandDetail, DemandList, Home, Login, MatchingMonitor, NotFound, OrganizationDetail, OrganizationList, ProductCreate, ProductDetail, ProductEdit, ProductList, UserCreate, UserDetail, UserEdit, UserList } from '../pages';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/create', element: <ProductCreate /> },
      { path: 'products/:id/edit', element: <ProductEdit /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'demands', element: <DemandList /> },
      { path: 'demands/:id', element: <DemandDetail /> },
      { path: 'matching', element: <MatchingMonitor /> },
      { path: 'users', element: <UserList /> },
      { path: 'users/create', element: <UserCreate /> },
      { path: 'users/:id/edit', element: <UserEdit /> },
      { path: 'users/:id', element: <UserDetail /> },
      { path: 'organizations', element: <OrganizationList /> },
      { path: 'organizations/:id', element: <OrganizationDetail /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;