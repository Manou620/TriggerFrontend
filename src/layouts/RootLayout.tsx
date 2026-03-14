import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/navigation/Header';
import { NotificationDrawer } from '../components/navigation/NotificationDrawer';

/**
 * The main page layout shell shared by ALL routes.
 *
 * **Structure:**
 * ┌──────────┬───────────────────────────────────┐
 * │ Sidebar  │  Header (sticky top)              │
 * │ (fixed)  │─────────────────────────────────── │
 * │          │  <Outlet /> (page content)        │
 * │          │                                   │
 * └──────────┴───────────────────────────────────┘
 *
 * - The `Sidebar` is visible on `lg+` screens and toggleable on mobile.
 * - The `NotificationDrawer` slides in from the right when opened.
 * - `<Outlet />` is where React Router renders the matched child route
 *   (Dashboard, Ventes, Produits, Clients, or Audit page).
 */
export const RootLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Root container — full-screen horizontal flex (Sidebar | Content)
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Fixed left sidebar — navigation panel (hidden on mobile) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* Notification drawer — slides in from the right when bell icon is clicked */}
      <NotificationDrawer />
      
      {/* Main content area — everything to the right of the sidebar */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Sticky top bar — search, notifications bell, user info */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Page body — padded area where the active route renders */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {/* Centered content wrapper — max width 7xl */}
          <div className="max-w-7xl mx-auto">
            {/* Route outlet — renders Dashboard, Ventes, Produits, Clients, or Audit */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
