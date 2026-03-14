import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { AuditEntry } from '../../types';

/**
 * Entity Adapter for audit entries.
 * Sorted by `dateMiseAJour` descending (most recent operation first).
 */
const auditAdapter = createEntityAdapter<AuditEntry>({
  sortComparer: (a, b) => b.dateMiseAJour.localeCompare(a.dateMiseAJour),
});

const initialState = auditAdapter.getInitialState();

/**
 * RTK Query endpoints for the **Audit Log**.
 *
 * The audit log is mostly **read-only** from the user's perspective:
 * - `getAudit` → displayed on the Audit page.
 * - `addAuditEntry` → called programmatically by `useVentes` whenever
 *   a sale is created, updated, or deleted. It auto-injects the timestamp.
 */
export const auditApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAudit: builder.query<EntityState<AuditEntry, string>, void>({
      query: () => '/audit',
      transformResponse: (response: AuditEntry[]) => {
        return auditAdapter.setAll(initialState, response);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: 'Audit' as const, id })),
              { type: 'Audit', id: 'LIST' },
            ]
          : [{ type: 'Audit', id: 'LIST' }],
    }),
    addAuditEntry: builder.mutation<AuditEntry, Partial<AuditEntry>>({
      query: (entry) => ({
        url: '/audit',
        method: 'POST',
        body: { ...entry, dateMiseAJour: new Date().toISOString() },
      }),
      invalidatesTags: [{ type: 'Audit', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAuditQuery,
  useAddAuditEntryMutation,
} = auditApiSlice;

export const selectAuditResult = auditApiSlice.endpoints.getAudit.select();

const selectAuditData = createSelector(
  selectAuditResult,
  (auditResult) => auditResult.data
);

export const {
  selectAll: selectAllAudit,
} = auditAdapter.getSelectors((state: any) => selectAuditData(state) ?? initialState);
