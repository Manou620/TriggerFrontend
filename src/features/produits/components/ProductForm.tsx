import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Product } from '@/src/types';
import { Button } from '@/src/components/ui/Button';

interface ProductFormProps {
  /** Pre-filled values when editing. Empty `{}` for a new product. */
  initialValues?: Partial<Product>;
  /** Called with validated form values on submit. */
  onSubmit: (values: any) => void;
  /** Closes the dialog without saving. */
  onCancel: () => void;
  /** Shows spinner on submit button. */
  isLoading?: boolean;
}

/** Yup schema: stock and price must be non-negative numbers. */
const ProductSchema = Yup.object().shape({
  design: Yup.string().required('Requis'),
  category: Yup.string().required('Requis'),
  stock: Yup.number().min(0, 'Doit être positif').required('Requis'),
  price: Yup.number().min(0, 'Doit être positif').required('Requis'),
});

/**
 * Product create/edit form (Formik + Yup).
 * Same dual-purpose pattern as `ClientForm`.
 */
export const ProductForm: React.FC<ProductFormProps> = ({ 
  initialValues, 
  onSubmit, 
  onCancel,
  isLoading 
}) => {
  const formik = useFormik({
    initialValues: {
      design: initialValues?.design || '',
      category: initialValues?.category || '',
      stock: initialValues?.stock || 0,
      price: initialValues?.price || 0,
      ...initialValues
    },
    validationSchema: ProductSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* 2-column grid of form fields — Désignation, Catégorie, Stock, Prix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Désignation field — top-left */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Désignation</label>
          <input
            name="design"
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={formik.handleChange}
            value={formik.values.design}
          />
          {formik.errors.design && formik.touched.design && (
            <p className="text-xs text-red-500">{formik.errors.design}</p>
          )}
        </div>

        {/* Catégorie field — top-right */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Catégorie</label>
          <input
            name="category"
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={formik.handleChange}
            value={formik.values.category}
          />
          {formik.errors.category && formik.touched.category && (
            <p className="text-xs text-red-500">{formik.errors.category}</p>
          )}
        </div>

        {/* Stock field — bottom-left */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Stock Initial</label>
          <input
            name="stock"
            type="number"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={formik.handleChange}
            value={formik.values.stock}
          />
          {formik.errors.stock && formik.touched.stock && (
            <p className="text-xs text-red-500">{formik.errors.stock}</p>
          )}
        </div>

        {/* Prix Unitaire field — bottom-right */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Prix Unitaire</label>
          <input
            name="price"
            type="number"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={formik.handleChange}
            value={formik.values.price}
          />
          {formik.errors.price && formik.touched.price && (
            <p className="text-xs text-red-500">{formik.errors.price}</p>
          )}
        </div>
      </div>

      {/* Footer buttons — right-aligned: Cancel + Submit */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialValues?.id ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};
