import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { Product } from '../../types';

/**
 * Entity Adapter for products.
 * Sorts products alphabetically by `design` (product name) by default.
 */
const productsAdapter = createEntityAdapter<Product>({
  sortComparer: (a, b) => a.design.localeCompare(b.design),
});

const initialState = productsAdapter.getInitialState();

/**
 * RTK Query endpoints for **Product** CRUD operations.
 * Same pattern as `clientsApiSlice`: optimistic updates on PATCH/DELETE.
 * See `clientsApiSlice.ts` for a detailed explanation of the pattern.
 */
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<EntityState<Product, number>, void>({
      query: () => '/produits',
      transformResponse: (response: any) => {
        const data = Array.isArray(response) ? response : (response?.data || response?.produits || response?.products || []);
        const transformedData = data.map((product: any) => ({
          ...product,
          id: Number(product.id)
        }));
        return productsAdapter.setAll(initialState, transformedData);
      },
      providesTags: (result) =>
        result
          ? [
            ...result.ids.map((id) => ({ type: 'Product' as const, id })),
            { type: 'Product', id: 'LIST' },
          ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: '/produits',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: `/produits/${product.id}`,
        method: 'PATCH',
        body: product,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: arg.id }, 
        { type: 'Audit', id: 'STATS' }
      ],
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productsApiSlice.util.updateQueryData('getProducts', undefined, (draft) => {
            productsAdapter.updateOne(draft, { id: id!, changes: patch });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/produits/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Product', id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productsApiSlice.util.updateQueryData('getProducts', undefined, (draft) => {
            productsAdapter.removeOne(draft, id);
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
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;

// ─── Selectors ──────────────────────────────────────────────────────
// Allow reading product data from the Redux store via `useSelector`.
export const selectProductsResult = productsApiSlice.endpoints.getProducts.select();

const selectProductsData = createSelector(
  selectProductsResult,
  (productsResult) => productsResult.data
);

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = productsAdapter.getSelectors((state: any) => selectProductsData(state) ?? initialState);
