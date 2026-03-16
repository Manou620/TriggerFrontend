import {
  useGetClientsQuery,
  selectAllClients,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation
} from '@/src/app/store/clientsApiSlice';
import { useSelector } from 'react-redux';
import { useNotificationStore } from '@/src/app/store/notification.store';
import { toast } from 'react-hot-toast';

/**
 * Custom hook that provides all client-related data and CRUD operations.
 *
 * **Purpose:** Acts as a "facade" between the ClientsPage component and
 * the RTK Query API slice. This keeps the page component clean by
 * centralizing error handling, notification dispatching, and loading states.
 *
 * **What it returns:**
 * - `clients` — flat array of all Client objects from the store.
 * - `handleAddClient(values)` — creates a client + pushes a notification.
 * - `handleUpdateClient(values)` — updates a client + pushes a notification.
 * - `handleDeleteClient(id)` — deletes a client + pushes a notification.
 * - `handleBulkDelete(ids)` — deletes multiple clients in parallel.
 * - `isAdding`, `isUpdating`, `isDeleting` — loading flags for button spinners.
 * - `isLoading`, `isError`, `error`, `refetch` — query state from RTK Query.
 */
export const useClients = () => {
  const { isLoading, isError, error, refetch } = useGetClientsQuery();
  const clients = useSelector(selectAllClients);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const [addClient, { isLoading: isAdding }] = useAddClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const handleAddClient = async (client: any) => {
    try {
      await addClient(client).unwrap();
      toast.success('Client ajouté avec succès');
      addNotification({
        type: 'success',
        title: 'Client ajouté',
        message: `Le client ${client.nom} a été ajouté avec succès.`,
      });
    } catch (err) {
      toast.error("Erreur lors de l'ajout du client.");
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de l'ajout du client.",
      });
    }
  };

  const handleUpdateClient = async (client: any) => {
    try {
      await updateClient(client).unwrap();
      toast.success('Client mis à jour');
      addNotification({
        type: 'success',
        title: 'Client mis à jour',
        message: `Le client ${client.nom} a été mis à jour.`,
      });
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de la mise à jour.",
      });
    }
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteClient(id).unwrap();
      toast.success('Client supprimé');
      addNotification({
        type: 'success',
        title: 'Client supprimé',
        message: 'Le client a été supprimé avec succès.',
      });
    } catch (err) {
      toast.error("Erreur lors de la suppression, le client est peut-etre utilisé");
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de la suppression.",
      });
    }
  };

  const handleBulkDelete = async (ids: number[]) => {
    try {
      await Promise.all(ids.map(id => deleteClient(id).unwrap()));
      addNotification({
        type: 'success',
        title: 'Clients supprimés',
        message: `${ids.length} clients ont été supprimés avec succès.`,
      });
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de la suppression groupée.",
      });
    }
  };

  return {
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
  };
};
