import { 
  useGetClientsQuery, 
  selectAllClients, 
  useAddClientMutation, 
  useUpdateClientMutation, 
  useDeleteClientMutation 
} from '@/src/app/store/clientsApiSlice';
import { useSelector } from 'react-redux';
import { useNotificationStore } from '@/src/app/store/notification.store';

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
      addNotification({
        type: 'success',
        title: 'Client ajouté',
        message: `Le client ${client.nom} a été ajouté avec succès.`,
      });
    } catch (err) {
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
      addNotification({
        type: 'success',
        title: 'Client mis à jour',
        message: `Le client ${client.nom} a été mis à jour.`,
      });
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de la mise à jour.",
      });
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id).unwrap();
      addNotification({
        type: 'success',
        title: 'Client supprimé',
        message: 'Le client a été supprimé avec succès.',
      });
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de la suppression.",
      });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
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
