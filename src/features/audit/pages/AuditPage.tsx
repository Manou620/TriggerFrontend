import React, { useState, useMemo } from 'react';
import { 
  History, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Filter, 
  Download,
  Search
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { formatDate, cn } from '@/src/utils/format';

import { useAudit } from '../hooks/useAudit';
import { TableSkeleton } from '@/src/components/feedback/Skeleton';
import { ErrorFallback } from '@/src/components/feedback/ErrorFallback';

/**
 * Audit log page (route: `/audit`).
 *
 * **Read-only view** — displays all audit entries in a searchable table
 * with color-coded operation types (AJOUT=green, MODIFICATION=blue, SUPPRESSION=red).
 *
 * **Sections:**
 * 1. Header with "Filtrer" and "Exporter" buttons (currently non-functional placeholders).
 * 2. Full-text search across client name, product name, user, and operation type.
 * 3. Data table with columns: Type, Date, Client, Produit, Ancien, Nouveau, Utilisateur.
 * 4. Footer stats: aggregated counts of insert/update/delete operations.
 */
const AuditPage: React.FC = () => {
  const { auditData, stats, isLoading, isError, error, refetch } = useAudit();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAudit = useMemo(() => {
    return auditData.filter(entry => 
      entry.nomClient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.designProduit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.utilisateur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.typeOperation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [auditData, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 w-1/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
        <TableSkeleton rows={8} />
      </div>
    );
  }

  if (isError) {
    return <ErrorFallback error={error} resetErrorBoundary={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Page header row — title (left) + Filter/Export buttons (right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title block — left side */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Journal d'Audit</h1>
          <p className="text-slate-500">Supervision des opérations de vente et mouvements de stock</p>
        </div>
        {/* Action buttons — right side of header */}
        <div className="flex items-center gap-2">
          {/* Filter button — placeholder, not yet functional */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          {/* Export button — placeholder, not yet functional */}
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Main card — wraps the search bar, table, and footer stats */}
      <Card>
        {/* Search bar row — inside the card, above the table */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Full-text search input — searches client, product, user, and operation type */}
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher dans l'audit (client, produit, utilisateur, type)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" 
            />
          </div>
        </div>

        {/* Scrollable table container — the audit data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table header — column labels */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produit</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Ancien</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Nouveau</th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilisateur</th>
              </tr>
            </thead>
            {/* Table body — one row per audit entry */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAudit.map((entry) => (
                /* Single audit row — operation badge, date, client, product, old qty, new qty, user */
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  {/* Operation type badge — color-coded: green=AJOUT, blue=MODIFICATION, red=SUPPRESSION */}
                  <td className="py-4 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                      entry.typeOperation.includes('AJOUT') && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                      entry.typeOperation.includes('MODIF') && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                      entry.typeOperation.includes('SUPPR') && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {entry.typeOperation.includes('AJOUT') && <PlusCircle className="w-3 h-3" />}
                      {entry.typeOperation.includes('MODIF') && <Edit className="w-3 h-3" />}
                      {entry.typeOperation.includes('SUPPR') && <Trash2 className="w-3 h-3" />}
                      {entry.typeOperation}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {formatDate(entry.dateMiseAJour)}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-slate-900 dark:text-white">
                    {entry.nomClient}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {entry.designProduit}
                  </td>
                  <td className="py-4 px-4 text-sm text-center font-mono text-slate-500">
                    {entry.qteSortieAncien}
                  </td>
                  <td className="py-4 px-4 text-sm text-center font-mono font-semibold text-slate-900 dark:text-white">
                    {entry.qteSortieNouv}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {entry.utilisateur}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state — shown when search returns no results */}
        {filteredAudit.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucune entrée trouvée</h3>
            <p className="text-slate-500">Essayez de modifier votre recherche.</p>
          </div>
        )}

        {/* Footer Stats as requested */}
        {/* Footer stats row — 3 colored cards at the bottom: Insertions, Modifications, Suppressions */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Green card — total AJOUT operations */}
          <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Total Insertions</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.insert}</p>
          </div>
          {/* Blue card — total MODIFICATION operations */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Modifications</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{stats.update}</p>
          </div>
          {/* Red card — total SUPPRESSION operations */}
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Total Suppressions</p>
            <p className="text-2xl font-bold text-red-700 dark:text-green-300 mt-1">{stats.delete}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuditPage;
