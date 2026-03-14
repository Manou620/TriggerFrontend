import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { Sale } from '../../types';

/**
 * Entity Adapter for sales.
 * Sorts sales by date **descending** (newest first) via `b.date.localeCompare(a.date)`.
 */
const salesAdapter = createEntityAdapter<Sale>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = salesAdapter.getInitialState();

/**
 * RTK Query endpoints for **Sale** CRUD operations.
 *
 * Key differences from `clientsApiSlice`:
 * - `addSale` auto-injects `date` (now) and `status: 'En attente'` into the body.
 * - Mutations also invalidate `{ type: 'Audit', id: 'LIST' }` so the audit log
 *   is refreshed after every sale change.
 */
export const salesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<EntityState<Sale, string>, void>({
      query: () => '/sales',
      transformResponse: (response: Sale[]) => {
        return salesAdapter.setAll(initialState, response);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: 'Sale' as const, id })),
              { type: 'Sale', id: 'LIST' },
            ]
          : [{ type: 'Sale', id: 'LIST' }],
    }),
    addSale: builder.mutation<Sale, Partial<Sale>>({
      query: (sale) => ({
        url: '/sales',
        method: 'POST',
        body: { ...sale, date: new Date().toISOString(), status: 'En attente' },
      }),
      invalidatesTags: [{ type: 'Sale', id: 'LIST' }, { type: 'Audit', id: 'LIST' }],
    }),
    updateSale: builder.mutation<Sale, Partial<Sale>>({
      query: (sale) => ({
        url: `/sales/${sale.id}`,
        method: 'PATCH',
        body: sale,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Sale', id: arg.id }, { type: 'Audit', id: 'LIST' }],
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          salesApiSlice.util.updateQueryData('getSales', undefined, (draft) => {
            salesAdapter.updateOne(draft, { id: id!, changes: patch });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteSale: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Sale', id }, { type: 'Audit', id: 'LIST' }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          salesApiSlice.util.updateQueryData('getSales', undefined, (draft) => {
            salesAdapter.removeOne(draft, id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetSalesQuery,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} = salesApiSlice;

export const selectSalesResult = salesApiSlice.endpoints.getSales.select();

const selectSalesData = createSelector(
  selectSalesResult,
  (salesResult) => salesResult.data
);

export const {
  selectAll: selectAllSales,
  selectById: selectSaleById,
} = salesAdapter.getSelectors((state: any) => selectSalesData(state) ?? initialState);
