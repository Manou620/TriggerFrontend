import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { RootLayout } from '../../layouts/RootLayout';
import { ROUTES } from '../config/constants';

// Lazy load pages
const Dashboard = React.lazy(() => import('../../features/audit/pages/Dashboard'));
const Ventes = React.lazy(() => import('../../features/ventes/pages/VentesPage'));
const Produits = React.lazy(() => import('../../features/produits/pages/ProduitsPage'));
const Clients = React.lazy(() => import('../../features/clients/pages/ClientsPage'));
const Audit = React.lazy(() => import('../../features/audit/pages/AuditPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<div className="p-8">Chargement...</div>}>
            <Dashboard />
          </React.Suspense>
        ),
      },
      {
        path: ROUTES.VENTES,
        element: (
          <React.Suspense fallback={<div className="p-8">Chargement...</div>}>
            <Ventes />
          </React.Suspense>
        ),
      },
      {
        path: ROUTES.PRODUITS,
        element: (
          <React.Suspense fallback={<div className="p-8">Chargement...</div>}>
            <Produits />
          </React.Suspense>
        ),
      },
      {
        path: ROUTES.CLIENTS,
        element: (
          <React.Suspense fallback={<div className="p-8">Chargement...</div>}>
            <Clients />
          </React.Suspense>
        ),
      },
      {
        path: ROUTES.AUDIT,
        element: (
          <React.Suspense fallback={<div className="p-8">Chargement...</div>}>
            <Audit />
          </React.Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
