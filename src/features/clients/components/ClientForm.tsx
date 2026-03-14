import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Client } from '@/src/types';
import { Button } from '@/src/components/ui/Button';

interface ClientFormProps {
  initialValues?: Partial<Client>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ClientSchema = Yup.object().shape({
  nom: Yup.string().required('Requis'),
  email: Yup.string().email('Email invalide').required('Requis'),
  telephone: Yup.string().required('Requis'),
  adresse: Yup.string().required('Requis'),
});

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
      <div className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
