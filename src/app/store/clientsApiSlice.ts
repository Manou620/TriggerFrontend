import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { Client } from '../../types';

const clientsAdapter = createEntityAdapter<Client>();

const initialState = clientsAdapter.getInitialState();

export const clientsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<EntityState<Client, string>, void>({
      query: () => '/clients',
      transformResponse: (response: Client[]) => {
        return clientsAdapter.setAll(initialState, response);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: 'Client' as const, id })),
              { type: 'Client', id: 'LIST' },
            ]
          : [{ type: 'Client', id: 'LIST' }],
    }),
    addClient: builder.mutation<Client, Partial<Client>>({
      query: (client) => ({
        url: '/clients',
        method: 'POST',
        body: client,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    updateClient: builder.mutation<Client, Partial<Client>>({
      query: (client) => ({
        url: `/clients/${client.id}`,
        method: 'PATCH',
        body: client,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Client', id: arg.id }],
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          clientsApiSlice.util.updateQueryData('getClients', undefined, (draft) => {
            clientsAdapter.updateOne(draft, { id: id!, changes: patch });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteClient: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Client', id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          clientsApiSlice.util.updateQueryData('getClients', undefined, (draft) => {
            clientsAdapter.removeOne(draft, id);
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
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApiSlice;

export const selectClientsResult = clientsApiSlice.endpoints.getClients.select();

const selectClientsData = createSelector(
  selectClientsResult,
  (clientsResult) => clientsResult.data
);

export const {
  selectAll: selectAllClients,
  selectById: selectClientById,
} = clientsAdapter.getSelectors((state: any) => selectClientsData(state) ?? initialState);
