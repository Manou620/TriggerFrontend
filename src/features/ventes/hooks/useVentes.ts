import { 
  useGetSalesQuery, 
  selectAllSales, 
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation
} from '@/src/app/store/salesApiSlice';
import { useGetProductsQuery, selectAllProducts } from '@/src/app/store/productsApiSlice';
import { useGetClientsQuery, selectAllClients } from '@/src/app/store/clientsApiSlice';
import { useAddAuditEntryMutation } from '@/src/app/store/auditApiSlice';
import { useSelector } from 'react-redux';
import { useNotificationStore } from '@/src/app/store/notification.store';
import { RootState } from '@/src/app/store';

export const useVentes = () => {
  const { isLoading: salesLoading, isError: salesError, error: salesErr, refetch: refetchSales } = useGetSalesQuery();
  const { isLoading: productsLoading } = useGetProductsQuery();
  const { isLoading: clientsLoading } = useGetClientsQuery();
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  const sales = useSelector(selectAllSales);
  const products = useSelector(selectAllProducts);
  const clients = useSelector(selectAllClients);
  const { user } = useSelector((state: RootState) => state.auth);

  const [addSale, { isLoading: isAdding }] = useAddSaleMutation();
  const [updateSale, { isLoading: isUpdating }] = useUpdateSaleMutation();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();
  const [addAudit] = useAddAuditEntryMutation();

  const handleAddSale = async (values: any) => {
    const product = products.find(p => p.id === values.productId);
    const client = clients.find(c => c.id === values.clientId);

    try {
      const result = await addSale(values).unwrap();
      
      // Log to audit
      await addAudit({
        typeOperation: 'AJOUT',
        nomClient: client?.nom || 'Inconnu',
        designProduit: product?.design || 'Inconnu',
        qteSortieAncien: 0,
        qteSortieNouv: values.qteSortie,
        utilisateur: user?.name || 'Système',
      }).unwrap();

      addNotification({
        type: 'success',
        title: 'Vente enregistrée',
        message: `Vente de ${values.qteSortie} ${product?.design || ''} pour ${client?.nom || ''} enregistrée.`,
      });
      return result;
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de l'enregistrement de la vente.",
      });
      throw err;
    }
  };

  const handleUpdateSale = async (values: any) => {
    const product = products.find(p => p.id === values.productId);
    const client = clients.find(c => c.id === values.clientId);
    const oldSale = sales.find(s => s.id === values.id);

    try {
      const result = await updateSale(values).unwrap();
      
      // Log to audit
      await addAudit({
        typeOperation: 'MODIFICATION',
        nomClient: client?.nom || 'Inconnu',
        designProduit: product?.design || 'Inconnu',
        qteSortieAncien: oldSale?.qteSortie || 0,
        qteSortieNouv: values.qteSortie,
        utilisateur: user?.name || 'Système',
      }).unwrap();

      addNotification({
        type: 'success',
        title: 'Vente mise à jour',
        message: 'La vente a été mise à jour avec succès.',
      });
      return result;
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de la mise à jour de la vente.",
      });
      throw err;
    }
  };

  const handleDeleteSale = async (id: string) => {
    const sale = sales.find(s => s.id === id);
    const product = products.find(p => p.id === sale?.productId);
    const client = clients.find(c => c.id === sale?.clientId);

    try {
      await deleteSale(id).unwrap();
      
      // Log to audit
      await addAudit({
        typeOperation: 'SUPPRESSION',
        nomClient: client?.nom || 'Inconnu',
        designProduit: product?.design || 'Inconnu',
        qteSortieAncien: sale?.qteSortie || 0,
        qteSortieNouv: 0,
        utilisateur: user?.name || 'Système',
      }).unwrap();

      addNotification({
        type: 'success',
        title: 'Vente supprimée',
        message: 'La vente a été supprimée avec succès.',
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
      await Promise.all(ids.map(id => deleteSale(id).unwrap()));
      addNotification({
        type: 'success',
        title: 'Ventes supprimées',
        message: `${ids.length} ventes ont été supprimées avec succès.`,
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
    sales,
    products,
    clients,
    isLoading: salesLoading || productsLoading || clientsLoading,
    isError: salesError,
    error: salesErr,
    refetch: refetchSales,
    handleAddSale,
    handleUpdateSale,
    handleDeleteSale,
    handleBulkDelete,
    isAdding,
    isUpdating,
    isDeleting
  };
};
