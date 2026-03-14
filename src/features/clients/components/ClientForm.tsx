import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Client } from '@/src/types';
import { Button } from '@/src/components/ui/Button';

interface ClientFormProps {
  /** Pre-filled values when editing an existing client. Empty `{}` for a new client. */
  initialValues?: Partial<Client>;
  /** Called with the form values on submit (after Yup validation passes). */
  onSubmit: (values: any) => void;
  /** Closes the dialog without saving. */
  onCancel: () => void;
  /** Disables the submit button and shows a spinner. */
  isLoading?: boolean;
}

/** Yup validation schema — all fields are required, email must be valid. */
const ClientSchema = Yup.object().shape({
  nom: Yup.string().required('Requis'),
  email: Yup.string().email('Email invalide').required('Requis'),
  telephone: Yup.string().required('Requis'),
  adresse: Yup.string().required('Requis'),
});

/**
 * Client create/edit form using Formik + Yup validation.
 *
 * **Dual-purpose:** If `initialValues.id` exists, the submit button
 * shows "Modifier"; otherwise, it shows "Ajouter".
 *
 * Rendered inside a MUI `<Dialog>` on the ClientsPage.
 */
export const ClientForm: React.FC<ClientFormProps> = ({ 
  initialValues, 
  onSubmit, 
  onCancel,
  isLoading 
}) => {
  const formik = useFormik({
    initialValues: {
      nom: initialValues?.nom || '',
      email: initialValues?.email || '',
      telephone: initialValues?.telephone || '',
      adresse: initialValues?.adresse || '',
      ...initialValues
    },
    validationSchema: ClientSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* All form fields — stacked vertically */}
      <div className="space-y-4">
        {/* Full-width "Nom Complet" field */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nom Complet</label>
          <input
            name="nom"
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={formik.handleChange}
            value={formik.values.nom}
          />
          {formik.errors.nom && formik.touched.nom && (
            <p className="text-xs text-red-500">{formik.errors.nom}</p>
          )}
        </div>

        {/* Email + telephone fields — side by side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email field — left column */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-xs text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Teléphone field — right column */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Téléphone</label>
            <input
              name="telephone"
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={formik.handleChange}
              value={formik.values.telephone}
            />
            {formik.errors.telephone && formik.touched.telephone && (
              <p className="text-xs text-red-500">{formik.errors.telephone}</p>
            )}
          </div>
        </div>

        {/* Full-width "Adresse" textarea */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Adresse</label>
          <textarea
            name="adresse"
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={formik.handleChange}
            value={formik.values.adresse}
          />
          {formik.errors.adresse && formik.touched.adresse && (
            <p className="text-xs text-red-500">{formik.errors.adresse}</p>
          )}
        </div>
      </div>

      {/* Footer buttons — right-aligned: Cancel (outline) + Submit (primary) */}
      <div className="flex justify-end gap-3 pt-4">
        {/* Cancel button — closes the dialog without saving */}
        <Button variant="outline" onClick={onCancel} type="button">
          Annuler
        </Button>
        {/* Submit button — "Ajouter" for new, "Modifier" for edit */}
        <Button type="submit" isLoading={isLoading}>
          {initialValues?.id ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};
