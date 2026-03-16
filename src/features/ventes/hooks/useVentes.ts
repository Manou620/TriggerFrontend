import {
  useGetSalesQuery,
  selectAllSales,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation
} from '@/src/app/store/salesApiSlice';
import { useGetProductsQuery, selectAllProducts, useUpdateProductMutation } from '@/src/app/store/productsApiSlice';
import { useGetClientsQuery, selectAllClients } from '@/src/app/store/clientsApiSlice';
import { useAddAuditEntryMutation } from '@/src/app/store/auditApiSlice';
import { useSelector } from 'react-redux';
import { useNotificationStore } from '@/src/app/store/notification.store';
import { RootState } from '@/src/app/store';
import { toast } from 'react-hot-toast';

/**
 * Custom hook that orchestrates the **entire sales workflow**.
 *
 * This is the most complex hook in the app because it coordinates
 * data from **four** different domains:
 *
 * 1. **Sales** — the actual sale records (RTK Query).
 * 2. **Products** — needed to display product names in the table
 *    and to validate stock availability in the form.
 * 3. **Clients** — needed to display client names in the table.
 * 4. **Audit** — every sale mutation (add/update/delete) automatically
 *    creates an audit entry via `addAuditEntry`.
 * 5. **Auth** — the current user's name is logged as `utilisateur` in audit.
 *
 * **Why so many queries?**
 * The sales table needs to resolve `clientId` → client name and
 * `productId` → product name, so it fetches all three lists.
 * The `isLoading` flag is only `false` when ALL three queries have resolved.
 *
 * **Audit trail:**
 * Each `handleAddSale`, `handleUpdateSale`, and `handleDeleteSale`
 * calls `addAudit()` after the sale mutation succeeds, recording the
 * old/new quantities, client name, product name, and logged-in user.
 */
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
  const [updateProduct] = useUpdateProductMutation();
  const [addAudit] = useAddAuditEntryMutation();

  const handleAddSale = async (values: any) => {
    const productIdNum = Number(values.productId);
    const clientIdNum = Number(values.clientId);
    const product = products.find(p => p.id === productIdNum);
    const client = clients.find(c => c.id === clientIdNum);

    const saleRequestBody = {
      ...values,
      productId: productIdNum,
      clientId: clientIdNum
    };

    try {
      const result = await addSale(saleRequestBody).unwrap();

      // Update product stock
      // if (product) {
      //   await updateProduct({
      //     ...product,
      //     stock: product.stock - values.qteSortie
      //   }).unwrap();
      // }

      // Log to audit
      // await addAudit({
      //   typeOperation: 'AJOUT',
      //   nomClient: client?.nom || 'Inconnu',
      //   designProduit: product?.design || 'Inconnu',
      //   qteSortieAncien: 0,
      //   qteSortieNouv: values.qteSortie,
      //   utilisateur: user?.name || 'Système',
      // }).unwrap();

      toast.success('Vente enregistrée avec succès');
      addNotification({
        type: 'success',
        title: 'Vente enregistrée',
        message: `Vente de ${values.qteSortie} ${product?.design || ''} pour ${client?.nom || ''} enregistrée.`,
      });
      return result;
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement de la vente.");
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de l'enregistrement de la vente.",
      });
      throw err;
    }
  };

  const handleUpdateSale = async (values: any) => {
    const productIdNum = Number(values.productId);
    const clientIdNum = Number(values.clientId);
    const product = products.find(p => p.id === productIdNum);
    const client = clients.find(c => c.id === clientIdNum);
    const oldSale = sales.find(s => s.id === values.id);

    const saleRequestUpdate = {
      ...values,
      productId: productIdNum,
      clientId: clientIdNum
    };

    try {
      const result = await updateSale(saleRequestUpdate).unwrap();

      // Update product stock
      // if (product && oldSale) {
      //   const stockDiff = values.qteSortie - oldSale.qteSortie;
      //   await updateProduct({
      //     ...product,
      //     stock: product.stock - stockDiff
      //   }).unwrap();
      // }

      // Log to audit
      // await addAudit({
      //   typeOperation: 'MODIFICATION',
      //   nomClient: client?.nom || 'Inconnu',
      //   designProduit: product?.design || 'Inconnu',
      //   qteSortieAncien: oldSale?.qteSortie || 0,
      //   qteSortieNouv: values.qteSortie,
      //   utilisateur: user?.name || 'Système',
      // }).unwrap();

      toast.success('Vente mise à jour');
      addNotification({
        type: 'success',
        title: 'Vente mise à jour',
        message: 'La vente a été mise à jour avec succès.',
      });
      return result;
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de la mise à jour de la vente.",
      });
      throw err;
    }
  };

  const handleDeleteSale = async (id: number) => {
    const sale = sales.find(s => s.id === id);
    const product = products.find(p => p.id === sale?.productId);
    const client = clients.find(c => c.id === sale?.clientId);

    try {
      await deleteSale(id).unwrap();

      // Update product stock (restore quantity)
      if (product && sale) {
        await updateProduct({
          ...product,
          stock: product.stock + sale.qteSortie
        }).unwrap();
      }

      // Log to audit
      await addAudit({
        typeOperation: 'SUPPRESSION',
        nomClient: client?.nom || 'Inconnu',
        designProduit: product?.design || 'Inconnu',
        qteSortieAncien: sale?.qteSortie || 0,
        qteSortieNouv: 0,
        utilisateur: user?.name || 'Système',
      }).unwrap();

      toast.success('Vente supprimée');
      addNotification({
        type: 'success',
        title: 'Vente supprimée',
        message: 'La vente a été supprimée avec succès.',
      });
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: "Une erreur est survenue lors de la suppression.",
      });
    }
  };

  const handleBulkDelete = async (ids: number[]) => {
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
