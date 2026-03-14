import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Product, Client } from '@/src/types';

interface VenteFormProps {
  /** Pre-filled values for editing. Empty `{}` for a new sale. */
  initialValues?: any;
  /** Called with validated form values on submit. */
  onSubmit: (values: any) => void;
  /** Closes the dialog without saving. */
  onCancel: () => void;
  /** List of all products — used to populate the product `<select>` dropdown and validate stock. */
  products: Product[];
  /** List of all clients — used to populate the client `<select>` dropdown. */
  clients: Client[];
  /** Shows spinner on submit button. */
  isLoading?: boolean;
}

/**
 * Sale create/edit form (Formik + Yup).
 *
 * More complex than ClientForm/ProductForm because:
 * - It depends on **external data** (products and clients lists) for dropdowns.
 * - It has a **custom Yup validation** (`stock-check`) that verifies the
 *   requested quantity doesn't exceed available product stock.
 * - For edits, the original sale quantity is added back to stock before
 *   comparing, allowing the user to increase the quantity up to `stock + oldQty`.
 * - Uses `enableReinitialize: true` so the form updates when `initialValues` change
 *   (e.g. when the user clicks "Edit" on a different sale row).
 */
export const VenteForm: React.FC<VenteFormProps> = ({ 
  initialValues = {}, 
  onSubmit, 
  onCancel, 
  products, 
  clients,
  isLoading = false
}) => {
  const formik = useFormik({
    initialValues: {
      clientId: initialValues.clientId || '',
      productId: initialValues.productId || '',
      qteSortie: initialValues.qteSortie || 1,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      clientId: Yup.string().required('Le client est requis'),
      productId: Yup.string().required('Le produit est requis'),
      qteSortie: Yup.number()
        .min(1, 'La quantité doit être au moins 1')
        .required('La quantité est requise')
        .test('stock-check', 'Stock insuffisant', function(value) {
          const product = products.find(p => p.id === this.parent.productId);
          // If editing, we should account for the original quantity already taken from stock
          const originalQte = initialValues.id ? initialValues.qteSortie : 0;
          return product ? (value || 0) <= (product.stock + originalQte) : true;
        }),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Client dropdown — populated from the clients array prop */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client</label>
        <select 
          name="clientId"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.clientId}
          className={`w-full bg-slate-50 dark:bg-slate-800 border ${formik.touched.clientId && formik.errors.clientId ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20`}
        >
          <option value="">Sélectionner un client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        {formik.touched.clientId && formik.errors.clientId && (
          <p className="text-xs text-red-500 mt-1">{formik.errors.clientId as string}</p>
        )}
      </div>

      {/* Product dropdown — shows product name + current stock in each option */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Produit</label>
        <select 
          name="productId"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.productId}
          className={`w-full bg-slate-50 dark:bg-slate-800 border ${formik.touched.productId && formik.errors.productId ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20`}
        >
          <option value="">Sélectionner un produit</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.design} (Stock: {p.stock})
            </option>
          ))}
        </select>
        {formik.touched.productId && formik.errors.productId && (
          <p className="text-xs text-red-500 mt-1">{formik.errors.productId as string}</p>
        )}
      </div>

      {/* Quantity input — validated against product.stock via custom Yup test */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantité</label>
        <input 
          type="number" 
          name="qteSortie"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.qteSortie}
          className={`w-full bg-slate-50 dark:bg-slate-800 border ${formik.touched.qteSortie && formik.errors.qteSortie ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20`}
          placeholder="0" 
        />
        {formik.touched.qteSortie && formik.errors.qteSortie && (
          <p className="text-xs text-red-500 mt-1">{formik.errors.qteSortie as string}</p>
        )}
      </div>

      {/* Footer buttons — Cancel (left) + Submit (right), both flex-1 equal width */}
      <div className="mt-6 flex gap-3">
        {/* Cancel button — closes dialog without saving */}
        <button 
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        {/* Submit button — shows spinner while saving */}
        <button 
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </form>
  );
};
