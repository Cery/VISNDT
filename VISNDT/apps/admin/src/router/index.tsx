import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth } from '../auth';
import AdminLayout from '../layouts/AdminLayout';
import { DemandDetail, DemandList, Home, Login, MatchDetail, MatchingMonitor, NotFound, NotificationDetail, NotificationList, OfferDetail, OfferList, OrganizationCreate, OrganizationDetail, OrganizationEdit, OrganizationList, ProductCreate, ProductDetail, ProductEdit, ProductList, RfqCreate, RfqDetail, RfqList, RfqResponseDetail, SupplierDetail, SupplierList, UserCreate, UserDetail, UserEdit, UserList } from '../pages';

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
      { path: 'demands/:demandId/matches/:matchId', element: <MatchDetail /> },
      { path: 'matching', element: <MatchingMonitor /> },
      { path: 'users', element: <UserList /> },
      { path: 'users/create', element: <UserCreate /> },
      { path: 'users/:id/edit', element: <UserEdit /> },
      { path: 'users/:id', element: <UserDetail /> },
      { path: 'organizations', element: <OrganizationList /> },
      { path: 'organizations/create', element: <OrganizationCreate /> },
      { path: 'organizations/:id/edit', element: <OrganizationEdit /> },
      { path: 'organizations/:id', element: <OrganizationDetail /> },
      { path: 'notifications', element: <NotificationList /> },
      { path: 'notifications/:id', element: <NotificationDetail /> },
      { path: 'rfqs/create', element: <RfqCreate /> },
      { path: 'rfqs', element: <RfqList /> },
      { path: 'rfqs/:id', element: <RfqDetail /> },
      { path: 'rfq-responses/:id', element: <RfqResponseDetail /> },
      { path: 'offers', element: <OfferList /> },
      { path: 'offers/:id', element: <OfferDetail /> },
      { path: 'suppliers', element: <SupplierList /> },
      { path: 'suppliers/:id', element: <SupplierDetail /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;