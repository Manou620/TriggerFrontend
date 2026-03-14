import React, { useState, useMemo } from 'react';
import { Card } from '@/src/components/ui/Card';
import { ShoppingCart, Plus, Search, Filter, ArrowRight, Trash2, Edit2, CheckSquare, Square } from 'lucide-react';
import { cn, formatDate } from '@/src/utils/format';
import { VenteForm } from '../components/VenteForm';
import { useVentes } from '../hooks/useVentes';
import { TableSkeleton } from '@/src/components/feedback/Skeleton';
import { ErrorFallback } from '@/src/components/feedback/ErrorFallback';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { Sale } from '@/src/types';

/**
 * Sales management page (route: `/ventes`).
 *
 * Displays all sales in a **data table** with resolved names:
 * - `clientId` → client name (looked up from the clients array).
 * - `productId` → product name (looked up from the products array).
 *
 * Features: search across ID/client/product/status, select all,
 * bulk delete, inline edit/delete, and "Détails" link (currently placeholder).
 *
 * **Audit integration:** Every add/update/delete automatically creates
 * an audit entry (handled by `useVentes` hook).
 *
 * Same state pattern as `ClientsPage`/`ProduitsPage`.
 */
const VentesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null; isBulk: boolean }>({
    isOpen: false,
    id: null,
    isBulk: false,
  });

  const { 
    sales, 
    products, 
    clients, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    handleAddSale,
    handleUpdateSale,
    handleDeleteSale,
    handleBulkDelete,
    isAdding,
    isUpdating,
    isDeleting
  } = useVentes();

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const client = clients.find(c => c.id === sale.clientId);
      const product = products.find(p => p.id === sale.productId);
      const searchStr = searchQuery.toLowerCase();
      
      return (
        sale.id.toLowerCase().includes(searchStr) ||
        client?.nom.toLowerCase().includes(searchStr) ||
        product?.design.toLowerCase().includes(searchStr) ||
        sale.status.toLowerCase().includes(searchStr)
      );
    });
  }, [sales, clients, products, searchQuery]);

  const handleOpenAdd = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const onFormSubmit = async (values: any) => {
    try {
      if (editingSale) {
        await handleUpdateSale({ ...editingSale, ...values });
      } else {
        await handleAddSale(values);
      }
      setIsModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSales.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSales.map(s => s.id));
    }
  };

  const openDeleteConfirm = (id: string) => {
    setConfirmDelete({ isOpen: true, id, isBulk: false });
  };

  const openBulkDeleteConfirm = () => {
    setConfirmDelete({ isOpen: true, id: null, isBulk: true });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.isBulk) {
      await handleBulkDelete(selectedIds);
      setSelectedIds([]);
    } else if (confirmDelete.id) {
      await handleDeleteSale(confirmDelete.id);
    }
    setConfirmDelete({ isOpen: false, id: null, isBulk: false });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 w-1/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (isError) {
    return <ErrorFallback error={error} resetErrorBoundary={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Page header row — title (left) + bulk delete / add sale buttons (right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title block */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Opérations de Vente</h1>
          <p className="text-slate-500">Enregistrez et suivez les sorties de stock</p>
        </div>
        {/* Action buttons — right side */}
        <div className="flex items-center gap-2">
          {/* Bulk delete button — only visible when rows are selected */}
          {selectedIds.length > 0 && (
            <button 
              onClick={openBulkDeleteConfirm}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer ({selectedIds.length})
            </button>
          )}
          {/* "Nouvelle Vente" button — opens the add dialog */}
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Vente
          </button>
        </div>
      </div>

      {/* Main card — wraps search bar, select-all, filter, and sales table */}
      <Card>
        {/* Search + action buttons row — inside the card, above the table */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search input */}
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une vente (ID, client, produit)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" 
            />
          </div>
          {/* Select-all + filter buttons */}
          <div className="flex gap-2">
            {/* "Tout sélectionner" toggle */}
            <button 
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {selectedIds.length === filteredSales.length && filteredSales.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Tout sélectionner
            </button>
            {/* Status filter button — placeholder */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium">
              <Filter className="w-4 h-4" />
              Statut
            </button>
          </div>
        </div>

        {/* Scrollable sales table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table header — column labels */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-4 w-10"></th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produit</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Qté</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSales.map((sale) => {
                const client = clients.find(c => c.id === sale.clientId);
                const product = products.find(p => p.id === sale.productId);
                const isSelected = selectedIds.includes(sale.id);
                return (
                  /* Single sale row — checkbox, ID, date, client name, product name, qty, status badge, actions */
                  <tr key={sale.id} className={cn(
                    "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                    isSelected && "bg-blue-50/30 dark:bg-blue-900/10"
                  )}>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => toggleSelection(sale.id)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-sm font-mono text-slate-500">{sale.id}</td>
                    <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{formatDate(sale.date)}</td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{client?.nom || sale.clientId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{product?.design || sale.productId}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{sale.qteSortie}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        sale.status === 'Validé' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {sale.status}
                      </span>
                    </td>
                    {/* Actions cell — edit, delete, and "Détails" buttons, right-aligned */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit button */}
                        <button 
                          onClick={() => handleOpenEdit(sale)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(sale.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                          Détails <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Empty state — shown when no sales match the search */}
        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucune vente trouvée</h3>
            <p className="text-slate-500">Essayez de modifier votre recherche ou enregistrez une nouvelle vente.</p>
          </div>
        )}
      </Card>

      {/* Add/Edit dialog — MUI Dialog containing VenteForm */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSale ? 'Modifier la vente' : 'Nouvelle Vente'}
        </DialogTitle>
        <DialogContent>
          <div className="pt-4">
            <VenteForm 
              initialValues={editingSale || {}}
              onSubmit={onFormSubmit} 
              onCancel={() => setIsModalOpen(false)} 
              products={products}
              clients={clients}
              isLoading={isAdding || isUpdating}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog — used for both single and bulk delete */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.isBulk ? "Supprimer les ventes" : "Supprimer la vente"}
        message={confirmDelete.isBulk 
          ? `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} ventes sélectionnées ? Cette action est irréversible.`
          : "Êtes-vous sûr de vouloir supprimer cette vente ? Cette action est irréversible."
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null, isBulk: false })}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default VentesPage;
