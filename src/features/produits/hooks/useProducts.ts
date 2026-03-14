import { 
  useGetProductsQuery, 
  selectAllProducts, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from '../../../app/store/productsApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useNotificationStore } from '@/src/app/store/notification.store';

export const useProducts = () => {
  const { isLoading, isError, error, refetch } = useGetProductsQuery();
  const products = useSelector(selectAllProducts);
  const addNotification = useNotificationStore(state => state.addNotification);

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleAddProduct = async (product: any) => {
    try {
      await addProduct(product).unwrap();
      toast.success('Produit ajouté avec succès');
      addNotification({
        title: 'Produit Ajouté',
        message: `Le produit ${product.design} a été ajouté à l'inventaire.`,
        type: 'success'
      });
    } catch (err) {
      toast.error('Erreur lors de l\'ajout');
      addNotification({
        title: 'Erreur Ajout',
        message: `Impossible d'ajouter le produit ${product.design}.`,
        type: 'error'
      });
    }
  };

  const handleUpdateProduct = async (product: any) => {
    try {
      await updateProduct(product).unwrap();
      toast.success('Produit mis à jour');
      addNotification({
        title: 'Produit Mis à Jour',
        message: `Les informations de ${product.design} ont été modifiées.`,
        type: 'success'
      });
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
      addNotification({
        title: 'Erreur Mise à Jour',
        message: `Impossible de modifier le produit ${product.design}.`,
        type: 'error'
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    try {
      await deleteProduct(id).unwrap();
      toast.success('Produit supprimé');
      addNotification({
        title: 'Produit Supprimé',
        message: `Le produit ${product?.design || id} a été retiré de l'inventaire.`,
        type: 'success'
      });
    } catch (err) {
      toast.error('Erreur lors de la suppression');
      addNotification({
        title: 'Erreur Suppression',
        message: `Impossible de supprimer le produit ${product?.design || id}.`,
        type: 'error'
      });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => deleteProduct(id).unwrap()));
      toast.success(`${ids.length} produits supprimés`);
      addNotification({
        title: 'Suppression Groupée',
        message: `${ids.length} produits ont été retirés de l'inventaire.`,
        type: 'success'
      });
    } catch (err) {
      toast.error('Erreur lors de la suppression groupée');
    }
  };

  return {
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
  };
};
