import { useGetAuditQuery, selectAllAudit } from '../../../app/store/auditApiSlice';
import { useSelector } from 'react-redux';

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
