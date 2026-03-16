import { useGetAuditQuery, selectAllAudit, useGetStatsQuery } from '../../../app/store/auditApiSlice';
import { useSelector } from 'react-redux';

/**
 * Custom hook for the Audit page.
 *
 * This hook now retrieves statistics directly from the backend via `useGetStatsQuery`.
 * - `stats.insert` — count of AJOUT operations.
 * - `stats.update` — count of MODIFICATION operations.
 * - `stats.delete` — count of SUPPRESSION operations.
 *
 * The `stats` mapping handles the potential naming differences between frontend (insert) 
 * and backend (insertions).
 */
export const useAudit = () => {
  const { 
    isLoading: isAuditLoading, 
    isError: isAuditError, 
    error: auditError, 
    refetch: refetchAudit 
  } = useGetAuditQuery();

  const {
    data: rawStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats
  } = useGetStatsQuery(undefined, { refetchOnMountOrArgChange: true });

  const auditData = useSelector(selectAllAudit);

  // Map backend property names to frontend UI expectations
  const stats = {
    insert: rawStats?.insertions ?? 0,
    update: rawStats?.modifications ?? 0,
    delete: rawStats?.suppressions ?? 0,
  };

  const refetch = () => {
    refetchAudit();
    refetchStats();
  };

  return {
    auditData,
    stats,
    isLoading: isAuditLoading || isStatsLoading,
    isError: isAuditError || isStatsError,
    error: auditError || statsError,
    refetch
  };
};
