'use client';
// app/history/page.tsx - Prediction History with filters
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePredictions } from '@/hooks/usePredictions';
import { formatDateTime, getRiskLabel } from '@/lib/utils';
import { Search, Filter, Trash2, Download, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type FilterRisk = 'all' | 'low' | 'medium' | 'high';
type SortBy = 'date_desc' | 'date_asc' | 'risk_desc' | 'risk_asc';

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { predictions, loading, deletePrediction } = usePredictions(user?.id);

  const [filterRisk, setFilterRisk] = useState<FilterRisk>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date_desc');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [authLoading, user, router]);

  const filtered = useMemo(() => {
    let result = [...predictions];

    if (filterRisk !== 'all') {
      result = result.filter(p => p.risk_level?.toLowerCase() === filterRisk);
    }
    if (dateFrom) {
      result = result.filter(p => new Date(p.date || (p as any).created_at || 0) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter(p => new Date(p.date || (p as any).created_at || 0) <= new Date(dateTo + 'T23:59:59'));
    }

    result.sort((a, b) => {
      const timeA = new Date(a.date || (a as any).created_at || 0).getTime();
      const timeB = new Date(b.date || (b as any).created_at || 0).getTime();
      if (sortBy === 'date_desc') return timeB - timeA;
      if (sortBy === 'date_asc') return timeA - timeB;
      
      const riskA = parseFloat((a.probability || (a as any).risk_score || 0).toString());
      const riskB = parseFloat((b.probability || (b as any).risk_score || 0).toString());
      if (sortBy === 'risk_desc') return riskB - riskA;
      if (sortBy === 'risk_asc') return riskA - riskB;
      return 0;
    });

    return result;
  }, [predictions, filterRisk, sortBy, dateFrom, dateTo]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this prediction?')) return;
    const { error } = await deletePrediction(id);
    if (!error) toast.success('Prediction deleted');
    else toast.error('Failed to delete');
  }

  function exportCSV() {
    const headers = ['Date', 'Risk Level', 'Risk Score', 'Age', 'Gender', 'Height', 'Weight', 'Systolic BP', 'Diastolic BP', 'Cholesterol', 'Glucose'];
    const rows = filtered.map(p => [
      formatDateTime(p.date || (p as any).created_at || new Date().toISOString()),
      p.risk_level,
      Math.round(p.probability || 0) + '%',
      p.age_years,
      p.gender === 1 ? 'Male' : 'Female',
      p.height + ' cm',
      p.weight + ' kg',
      p.ap_hi,
      p.ap_lo,
      p.cholesterol,
      p.gluc,
    ]);
    const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cardioguard-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('History exported!');
  }

  if (authLoading) return null;

  return (
    <AppLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-jakarta text-3xl font-bold text-on-surface dark:text-white mb-1">Prediction History</h1>
            <p className="text-on-surface-variant">{filtered.length} of {predictions.length} predictions</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="btn-ghost flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <Link href="/predict" className="btn-primary flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />
              New Prediction
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="metric-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Risk filter */}
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-2">Risk Level</label>
              <div className="flex gap-1">
                {(['all', 'low', 'medium', 'high'] as FilterRisk[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterRisk(f)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                      filterRisk === f ? 'bg-primary text-white' : 'bg-surface-container dark:bg-dark-surface text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortBy)}
                className="input-field text-sm"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="risk_desc">Highest Risk First</option>
                <option value="risk_asc">Lowest Risk First</option>
              </select>
            </div>

            {/* Date range */}
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-2">From Date</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-2">To Date</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field text-sm" />
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="metric-card overflow-hidden p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-on-surface-variant">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
              Loading history...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Activity className="w-12 h-12 text-on-surface-variant/30" />
              <p className="text-on-surface-variant">No predictions found</p>
              <Link href="/predict" className="btn-primary text-sm px-4 py-2">Run First Prediction</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/10 dark:border-dark-border">
                    {['Date & Time', 'Risk Level', 'Risk Score', 'Age', 'BP', 'BMI', 'Actions'].map(col => (
                      <th key={col} className="text-left px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pred, i) => (
                    <motion.tr
                      key={pred.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-outline-variant/8 dark:border-dark-border/50 hover:bg-surface-container/40 dark:hover:bg-dark-surface-container/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                          <span className="text-sm text-on-surface dark:text-white">{formatDateTime(pred.date || (pred as any).created_at || new Date().toISOString())}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`chip-${pred.risk_level?.toLowerCase()}`}>{getRiskLabel((pred.risk_level?.toLowerCase() as any) || 'low')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 rounded-full bg-surface-container dark:bg-dark-surface">
                            <div
                              className={`h-full rounded-full ${pred.risk_level?.toLowerCase() === 'low' ? 'bg-secondary' : pred.risk_level?.toLowerCase() === 'medium' ? 'bg-orange-500' : 'bg-tertiary'}`}
                              style={{ width: `${Math.round(pred.probability || 0)}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-on-surface dark:text-white">
                            {Math.round(pred.probability || 0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface dark:text-white">{pred.age_years}y</td>
                      <td className="px-6 py-4 text-sm text-on-surface dark:text-white">{pred.ap_hi}/{pred.ap_lo}</td>
                      <td className="px-6 py-4 text-sm text-on-surface dark:text-white">
                        {pred.height && pred.weight ? (parseFloat(((pred.weight / ((pred.height/100) ** 2)).toFixed(1))).toString()) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(pred.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
