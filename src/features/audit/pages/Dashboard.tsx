import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { useProducts } from '../../produits/hooks/useProducts';
import { useClients } from '../../clients/hooks/useClients';
import { useVentes } from '../../ventes/hooks/useVentes';
import { TableSkeleton, CardSkeleton } from '@/src/components/feedback/Skeleton';
import { ErrorFallback } from '@/src/components/feedback/ErrorFallback';
import { cn } from '@/src/utils/format';

/**
 * Dashboard page — the application landing page (route: `/`).
 *
 * **What it displays:**
 * - 4 stat cards: total sales, active clients, products in stock, low-stock alerts.
 * - "Ventes récentes" — last 5 sales with client name lookup.
 * - "Alertes Stock" — products with stock < 30, with a visual progress bar.
 *
 * **Data sources:** Pulls from ALL three features (products, clients, sales)
 * via their respective hooks. Waits for all three to finish loading before rendering.
 *
 * **Note:** The trend percentages (e.g. "+12%") are currently **hardcoded** —
 * they are not computed from real data. Replace with actual calculations when needed.
 */
const Dashboard: React.FC = () => {
  const { products, isLoading: productsLoading, isError: productsError } = useProducts();
  const { clients, isLoading: clientsLoading, isError: clientsError } = useClients();
  const { sales, isLoading: salesLoading, isError: salesError } = useVentes();

  if (productsLoading || clientsLoading || salesLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TableSkeleton rows={5} />
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  if (productsError || clientsError || salesError) {
    return <ErrorFallback type="500" error={productsError || clientsError || salesError} />;
  }

  const totalSales = sales.length;
  const totalProducts = products.length;
  const totalClients = clients.length;
  const lowStock = products.filter(p => p.stock < 20).length;

  const stats = [
    { label: 'Ventes totales', value: totalSales, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%', up: true },
    { label: 'Clients actifs', value: totalClients, icon: Users, color: 'text-green-600', bg: 'bg-green-100', trend: '+5%', up: true },
    { label: 'Produits en stock', value: totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', trend: '-2%', up: false },
    { label: 'Stock faible', value: lowStock, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100', trend: 'Attention', up: false },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading block — title + subtitle at the top */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
        <p className="text-slate-500">Bienvenue sur votre interface de gestion StockPro</p>
      </div>

      {/* Stats cards row — 4 cards in a responsive grid below the heading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          /* Single stat card — icon (top-right), label + value (top-left), trend (bottom) */
          <Card key={i} className="relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              {stat.up ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={cn("text-sm font-medium", stat.up ? "text-green-600" : "text-red-600")}>
                {stat.trend}
              </span>
              <span className="text-sm text-slate-400 ml-1">vs mois dernier</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom section — two cards side by side (left: recent sales, right: stock alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left card — "Ventes récentes": last 5 sales with client name lookup */}
        <Card title="Ventes récentes" subtitle="Dernières transactions effectuées">
          <div className="space-y-4">
            {sales.slice(0, 5).map((sale) => (
              /* Single sale row — cart icon + sale ID + client name (left), qty + date (right) */
              <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Vente #{sale.id}</p>
                    <p className="text-xs text-slate-500">
                      {clients.find(c => c.id === sale.clientId)?.nom || `Client ${sale.clientId}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Qté: {sale.qteSortie}</p>
                  <p className="text-xs text-slate-500">{new Date(sale.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right card — "Alertes Stock": products with stock < 30 + visual progress bar */}
        <Card title="Alertes Stock" subtitle="Produits nécessitant un réapprovisionnement">
          <div className="space-y-4">
            {products.filter(p => p.stock < 30).slice(0, 5).map((product) => (
              /* Single stock alert row — amber icon + product name (left), stock count + progress bar (right) */
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.design}</p>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">Stock: {product.stock}</p>
                  <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
