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
    getAudit: builder.query<EntityState<AuditEntry, number>, void>({
      query: () => '/audit',
      transformResponse: (response: any) => {
        const data = Array.isArray(response) ? response : (response?.data || response?.audit || []);
        return auditAdapter.setAll(initialState, data.map((entry: any) => {
          let typeOp = String(entry.typeOperation ?? entry.type_operation ?? 'AJOUT').toUpperCase();
          
          // Map backend variants to frontend expected constants
          if (typeOp.includes('INSERT') || typeOp.includes('AJOUT')) typeOp = 'AJOUT';
          else if (typeOp.includes('UPDATE') || typeOp.includes('MODIF') || typeOp.includes('PATCH')) typeOp = 'MODIFICATION';
          else if (typeOp.includes('DELETE') || typeOp.includes('SUPPR') || typeOp.includes('REMOVE')) typeOp = 'SUPPRESSION';

          return {
            ...entry,
            id: Number(entry.id),
            typeOperation: typeOp,
            dateMiseAJour: entry.dateMiseAJour ?? entry.date_mise_a_jour ?? entry.created_at ?? new Date().toISOString()
          };
        }));
      },
      providesTags: (result) =>
        result
          ? [
            ...result.ids.map((id) => ({ type: 'Audit' as const, id })),
            { type: 'Audit', id: 'LIST' },
          ]
          : [{ type: 'Audit', id: 'LIST' }],
    }),
    getStats: builder.query<{ insertions: string | number; modifications: string | number; suppressions: string | number }, void>({
      query: () => '/audit/stats',
      transformResponse: (response: any) => {
        // Normalizing the response format just in case
        return {
          insertions: response.insertions ?? response.insert ?? 0,
          modifications: response.modifications ?? response.update ?? 0,
          suppressions: response.suppressions ?? response.delete ?? 0
        };
      },
      providesTags: [{ type: 'Audit', id: 'STATS' }],
    }),
    addAuditEntry: builder.mutation<AuditEntry, Partial<AuditEntry>>({
      query: (entry) => ({
        url: '/audit',
        method: 'POST',
        body: { ...entry, dateMiseAJour: new Date().toISOString() },
      }),
      invalidatesTags: [{ type: 'Audit', id: 'LIST' }, { type: 'Audit', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetAuditQuery,
  useGetStatsQuery,
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
