import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Package, CheckSquare, Square } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { useProducts } from '../hooks/useProducts';
import { TableSkeleton } from '@/src/components/feedback/Skeleton';
import { ErrorFallback } from '@/src/components/feedback/ErrorFallback';
import { formatCurrency } from '@/src/utils/format';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { ProductForm } from '../components/ProductForm';
import { Product } from '@/src/types';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';

/**
 * Products management page (route: `/produits`).
 *
 * Displays products in a **data table** with columns:
 * Product (icon + name), Category, Stock (red if < 20), Price, Actions.
 *
 * Features: search, select all, bulk delete, inline edit/delete buttons,
 * add/edit dialog with `ProductForm`, and a confirmation dialog for deletions.
 *
 * Same state pattern as `ClientsPage` — see its JSDoc for details.
 */
const ProduitsPage: React.FC = () => {
  const { 
    products, 
    isLoading, 
    isError, 
    error,
    refetch,
    handleAddProduct, 
    handleUpdateProduct, 
    handleDeleteProduct,
    handleBulkDelete,
    isAdding,
    isUpdating,
    isDeleting
  } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null; isBulk: boolean }>({
    isOpen: false,
    id: null,
    isBulk: false
  });

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.design.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
          <div className="h-10 w-32 bg-slate-200 animate-pulse rounded" />
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  if (isError) {
    return <ErrorFallback error={error} resetErrorBoundary={refetch} />;
  }

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingProduct) {
      await handleUpdateProduct({ ...editingProduct, ...values });
    } else {
      await handleAddProduct(values);
    }
    setIsFormOpen(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirm({ isOpen: true, id, isBulk: false });
  };

  const confirmBulkDelete = () => {
    setDeleteConfirm({ isOpen: true, id: null, isBulk: true });
  };

  const handleConfirmedDelete = async () => {
    if (deleteConfirm.isBulk) {
      await handleBulkDelete(selectedIds);
      setSelectedIds([]);
    } else if (deleteConfirm.id) {
      await handleDeleteProduct(deleteConfirm.id);
      setSelectedIds(prev => prev.filter(i => i !== deleteConfirm.id));
    }
    setDeleteConfirm({ isOpen: false, id: null, isBulk: false });
  };

  return (
    <div className="space-y-6">
      {/* Page header row — title (left) + bulk delete / add product buttons (right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title block */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion des Produits</h1>
          <p className="text-slate-500">Gérez votre inventaire et vos références</p>
        </div>
        {/* Action buttons — right side */}
        <div className="flex items-center gap-3">
          {/* Bulk delete button — only visible when rows are selected */}
          {selectedIds.length > 0 && (
            <button 
              onClick={confirmBulkDelete}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors font-medium border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer ({selectedIds.length})
            </button>
          )}
          {/* "Nouveau Produit" button — opens the add dialog */}
          <button 
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau Produit
          </button>
        </div>
      </div>

      {/* Main card — wraps search bar, filter, and product table */}
      <Card className="p-0 overflow-hidden">
        {/* Search + filter row — inside the card, above the table */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          {/* Filter button — placeholder */}
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>
        </div>

        {/* Scrollable product table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table header — select-all checkbox + column labels */}
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 w-10">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-blue-600 transition-colors">
                    {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prix Unitaire</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            {/* Table body — one row per product */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((product) => (
                /* Single product row — checkbox, name+icon, category badge, stock, price, edit/delete */
                <tr 
                  key={product.id} 
                  className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors ${selectedIds.includes(product.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                >
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(product.id)} className="text-slate-400 hover:text-blue-600 transition-colors">
                      {selectedIds.includes(product.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{product.design}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${product.stock < 20 ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {formatCurrency(product.price)}
                  </td>
                  {/* Actions cell — edit + delete buttons, right-aligned */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Edit button */}
                      <button 
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit dialog — MUI Dialog containing ProductForm */}
      <Dialog 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
        </DialogTitle>
        <DialogContent>
          <div className="pt-4">
            <ProductForm 
              initialValues={editingProduct || {}}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
              isLoading={isAdding || isUpdating}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog — used for single and bulk delete */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.isBulk ? "Suppression groupée" : "Supprimer le produit"}
        message={deleteConfirm.isBulk 
          ? `Êtes-vous sûr de vouloir supprimer ces ${selectedIds.length} produits ? Cette action est irréversible.`
          : "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
        }
        onConfirm={handleConfirmedDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, isBulk: false })}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProduitsPage;
