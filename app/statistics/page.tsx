'use client';
// app/statistics/page.tsx - Advanced Analytics
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePredictions } from '@/hooks/usePredictions';
import { formatDate, calculateBMI } from '@/lib/utils';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from 'recharts';
import { StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { TrendingUp, TrendingDown, Minus, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';
import Link from 'next/link';

const COLORS = { low: '#1b6d24', medium: '#f57c00', high: '#b7181f' };
const CHART_COLORS = ['#005dac', '#1b6d24', '#b7181f', '#f57c00', '#7c3aed'];

export default function StatisticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { predictions, loading } = usePredictions(user?.id);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [authLoading, user, router]);

  const analytics = useMemo(() => {
    if (!predictions.length) return null;

    const riskScores = predictions.map(p => Math.round((p.probability || (p as any).risk_score || 0)));
    const avgRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    const maxRisk = Math.max(...riskScores);
    const minRisk = Math.min(...riskScores);

    // Trend: compare first half vs second half
    const half = Math.floor(predictions.length / 2);
    const firstHalf = predictions.slice(half).map(p => (p.probability || (p as any).risk_score || 0));
    const secondHalf = predictions.slice(0, half).map(p => (p.probability || (p as any).risk_score || 0));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / (firstHalf.length || 1);
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / (secondHalf.length || 1);
    const trend = secondAvg - firstAvg > 5 ? 'worsening' : secondAvg - firstAvg < -5 ? 'improving' : 'stable';

    // Monthly grouping
    const monthly: Record<string, number[]> = {};
    predictions.forEach(p => {
      const dateStr = p.date || (p as any).created_at || new Date().toISOString();
      const month = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!monthly[month]) monthly[month] = [];
      monthly[month].push(p.probability || (p as any).risk_score || 0);
    });
    const monthlyData = Object.entries(monthly).map(([month, scores]) => ({
      month,
      avgRisk: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    })).reverse();

    // Risk distribution
    const low = predictions.filter(p => p.risk_level?.toLowerCase() === 'low').length;
    const medium = predictions.filter(p => p.risk_level?.toLowerCase() === 'medium').length;
    const high = predictions.filter(p => p.risk_level?.toLowerCase() === 'high').length;

    // Health radar data
    const latest = predictions[0];
    const radarData = latest ? [
      { metric: 'Blood Pressure', value: Math.max(0, 100 - ((latest.ap_hi - 120) / 1.1)), fullMark: 100 },
      { metric: 'Cholesterol', value: latest.cholesterol === 1 ? 90 : latest.cholesterol === 2 ? 50 : 20, fullMark: 100 },
      { metric: 'Glucose', value: latest.gluc === 1 ? 90 : latest.gluc === 2 ? 55 : 25, fullMark: 100 },
      { metric: 'BMI Health', value: Math.max(0, 100 - Math.abs(calculateBMI(latest.weight, latest.height) - 22) * 5), fullMark: 100 },
      { metric: 'Activity', value: latest.active === 1 ? 85 : 25, fullMark: 100 },
      { metric: 'Non-Smoking', value: latest.smoke === 0 ? 90 : 10, fullMark: 100 },
    ] : [];

    // Timeline data
    const timelineData = [...predictions].reverse().map(p => ({
      date: formatDate(p.date || (p as any).created_at || new Date().toISOString()),
      risk: Math.round(p.probability || (p as any).risk_score || 0),
      level: p.risk_level,
    }));

    return { avgRisk, maxRisk, minRisk, trend, monthlyData, low, medium, high, radarData, timelineData };
  }, [predictions]);

  if (authLoading || loading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
        Loading analytics...
      </div>
    </AppLayout>
  );

  if (!analytics) return (
    <AppLayout>
      <div className="max-w-6xl">
        <h1 className="font-jakarta text-3xl font-bold text-on-surface dark:text-white mb-4">Statistics</h1>
        <div className="metric-card flex flex-col items-center py-16 gap-4">
          <BarChart3 className="w-16 h-16 text-on-surface-variant/30" />
          <p className="text-on-surface-variant text-lg">No data yet</p>
          <Link href="/predict" className="btn-primary px-6 py-2.5">Run First Prediction</Link>
        </div>
      </div>
    </AppLayout>
  );

  const trendIcon = analytics.trend === 'improving' ? TrendingDown : analytics.trend === 'worsening' ? TrendingUp : Minus;
  const trendColor = analytics.trend === 'improving' ? 'text-secondary' : analytics.trend === 'worsening' ? 'text-tertiary' : 'text-on-surface-variant';

  const pieData = [
    { name: 'Low Risk', value: analytics.low, color: COLORS.low },
    { name: 'Medium Risk', value: analytics.medium, color: COLORS.medium },
    { name: 'High Risk', value: analytics.high, color: COLORS.high },
  ].filter(d => d.value > 0);

  return (
    <AppLayout>
      <div className="max-w-6xl space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-jakarta text-3xl font-bold text-on-surface dark:text-white mb-1">Detailed Statistics</h1>
          <p className="text-on-surface-variant">Deep-dive analytics of your cardiovascular health journey</p>
        </motion.div>

        {/* Summary cards */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.06}>
          {[
            { label: 'Avg Risk', value: Math.round(analytics.avgRisk), suffix: '%', color: 'from-blue-500 to-indigo-600' },
            { label: 'Peak Risk', value: analytics.maxRisk, suffix: '%', color: 'from-rose-500 to-red-600' },
            { label: 'Best Risk', value: analytics.minRisk, suffix: '%', color: 'from-emerald-500 to-green-600' },
            { label: 'Total Checks', value: predictions.length, color: 'from-violet-500 to-purple-600' },
          ].map(({ label, value, suffix, color }) => (
            <StaggerItem key={label}>
              <div className="metric-card text-center">
                <div className={`text-4xl font-bold font-jakarta bg-gradient-to-br ${color} bg-clip-text text-transparent mb-1`}>
                  <AnimatedCounter end={value} suffix={suffix} />
                </div>
                <p className="text-sm text-on-surface-variant">{label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Trend indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="metric-card flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${analytics.trend === 'improving' ? 'bg-secondary/10' : analytics.trend === 'worsening' ? 'bg-tertiary/10' : 'bg-surface-container dark:bg-dark-surface'}`}>
            {(() => { const Icon = trendIcon; return <Icon className={`w-6 h-6 ${trendColor}`} />; })()}
          </div>
          <div>
            <p className="font-jakarta font-bold text-on-surface dark:text-white">
              Your trend is <span className={`capitalize ${trendColor}`}>{analytics.trend}</span>
            </p>
            <p className="text-sm text-on-surface-variant">
              {analytics.trend === 'improving' ? 'Great work! Your risk is decreasing over time.' :
               analytics.trend === 'worsening' ? 'Your risk is increasing. Consider consulting a doctor.' :
               'Your risk has been stable. Keep maintaining your healthy habits.'}
            </p>
          </div>
        </motion.div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="metric-card lg:col-span-2">
            <h3 className="font-jakarta font-bold text-on-surface dark:text-white mb-6">Complete Risk Timeline</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.timelineData}>
                <defs>
                  <linearGradient id="fullGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005dac" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#005dac" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,71,82,0.08)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#414752' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#414752' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(25,28,30,0.1)' }} />
                <Area type="monotone" dataKey="risk" stroke="#005dac" strokeWidth={2.5} fill="url(#fullGrad)"
                  dot={{ fill: '#005dac', r: 3 }} activeDot={{ r: 5, fill: '#1976D2' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly bar chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="metric-card">
            <h3 className="font-jakarta font-bold text-on-surface dark:text-white mb-6">Monthly Average Risk</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,71,82,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#414752' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#414752' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(25,28,30,0.1)' }} />
                <Bar dataKey="avgRisk" fill="#005dac" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="metric-card">
            <h3 className="font-jakarta font-bold text-on-surface dark:text-white mb-6">Risk Distribution</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    dataKey="value" paddingAngle={4} strokeWidth={0}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {pieData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm text-on-surface-variant">{name}</span>
                    </div>
                    <span className="font-bold text-on-surface dark:text-white text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Health radar */}
          {analytics.radarData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="metric-card lg:col-span-2">
              <h3 className="font-jakarta font-bold text-on-surface dark:text-white mb-6">Health Profile Radar (Latest Prediction)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={analytics.radarData}>
                  <PolarGrid stroke="rgba(65,71,82,0.12)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#414752' }} />
                  <Radar name="Health Score" dataKey="value" stroke="#005dac" fill="#005dac" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-on-surface-variant mt-2">Higher is better (100 = optimal health)</p>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
