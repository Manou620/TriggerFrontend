import React, { useState, useMemo } from 'react';
import { Card } from '@/src/components/ui/Card';
import { User, Mail, Phone, Edit2, Trash2, Plus, MapPin, Search, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/src/utils/format';
import { useClients } from '../hooks/useClients';
import { CardSkeleton } from '@/src/components/feedback/Skeleton';
import { ErrorFallback } from '@/src/components/feedback/ErrorFallback';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { ClientForm } from '../components/ClientForm';
import { Client } from '@/src/types';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';

const ClientsPage: React.FC = () => {
  const { 
    clients, 
    isLoading, 
    isError, 
    error, 
    refetch,
    handleAddClient,
    handleUpdateClient,
    handleDeleteClient,
    handleBulkDelete,
    isAdding,
    isUpdating,
    isDeleting
  } = useClients();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null; isBulk: boolean }>({
    isOpen: false,
    id: null,
    isBulk: false,
  });

  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.telephone.includes(searchQuery)
    );
  }, [clients, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
          <div className="h-10 w-32 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorFallback error={error} resetErrorBoundary={refetch} />;
  }

  const handleOpenAdd = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingClient) {
      await handleUpdateClient({ ...editingClient, ...values });
    } else {
      await handleAddClient(values);
    }
    setIsFormOpen(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredClients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClients.map(c => c.id));
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
      await handleDeleteClient(confirmDelete.id);
    }
    setConfirmDelete({ isOpen: false, id: null, isBulk: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion des Clients</h1>
          <p className="text-slate-500">Gérez votre base de données clients</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button 
              onClick={openBulkDeleteConfirm}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau Client
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Rechercher un client (nom, email, tel)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button 
          onClick={toggleSelectAll}
          className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          {selectedIds.length === filteredClients.length && filteredClients.length > 0 ? (
            <CheckSquare className="w-4 h-4 text-blue-600" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          Tout sélectionner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className={cn(
            "group hover:border-blue-500/50 transition-all relative",
            selectedIds.includes(client.id) && "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10"
          )}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleSelection(client.id)}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {selectedIds.includes(client.id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleOpenEdit(client)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => openDeleteConfirm(client.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{client.nom}</h3>
            <p className="text-xs font-mono text-slate-500 mb-4">ID: {client.id}</p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4" />
                {client.telephone}
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="line-clamp-2">{client.adresse}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className={cn(
                "px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700"
              )}>
                Actif
              </span>
              <button className="text-sm font-semibold text-blue-600 hover:underline">Voir profil</button>
            </div>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun client trouvé</h3>
          <p className="text-slate-500">Essayez de modifier votre recherche ou ajoutez un nouveau client.</p>
        </div>
      )}

      <Dialog 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingClient ? 'Modifier le client' : 'Ajouter un nouveau client'}
        </DialogTitle>
        <DialogContent>
          <div className="pt-4">
            <ClientForm 
              initialValues={editingClient || {}}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
              isLoading={isAdding || isUpdating}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.isBulk ? "Supprimer les clients" : "Supprimer le client"}
        message={confirmDelete.isBulk 
          ? `Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} clients sélectionnés ? Cette action est irréversible.`
          : "Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible."
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

export default ClientsPage;
