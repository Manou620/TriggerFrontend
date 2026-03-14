import { useGetAuditQuery, selectAllAudit } from '../../../app/store/auditApiSlice';
import { useSelector } from 'react-redux';

/**
 * Custom hook for the Audit page.
 *
 * Fetches all audit entries and computes aggregate statistics:
 * - `stats.insert` — count of AJOUT operations.
 * - `stats.update` — count of MODIFICATION operations.
 * - `stats.delete` — count of SUPPRESSION operations.
 *
 * These stats are displayed as colored cards at the bottom of the Audit page.
 */
export const useAudit = () => {
  const { isLoading, isError, error, refetch } = useGetAuditQuery();
  const auditData = useSelector(selectAllAudit);

  const stats = {
    insert: auditData.filter(a => a.typeOperation === 'AJOUT').length,
    update: auditData.filter(a => a.typeOperation === 'MODIFICATION').length,
    delete: auditData.filter(a => a.typeOperation === 'SUPPRESSION').length,
  };

  return {
    auditData,
    stats,
    isLoading,
    isError,
    error,
    refetch
  };
};
