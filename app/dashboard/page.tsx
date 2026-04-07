'use client';
// app/dashboard/page.tsx - Dashboard
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { usePredictions } from '@/hooks/usePredictions';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Heart, ArrowRight, Calendar, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import RiskGauge from '@/components/ui/RiskGauge';
import { formatDate, getRiskLabel } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal';
import RiskTrendChart from '@/components/dashboard/RiskTrendChart';
import HealthTips from '@/components/dashboard/HealthTips';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { predictions, loading: predLoading, stats } = usePredictions(user?.id);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [authLoading, user, router]);

  if (authLoading || predLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading your dashboard...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  const latestPrediction = stats.latest;
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const metricCards = [
    {
      label: 'Total Predictions',
      value: stats.total,
      icon: Activity,
      color: 'from-blue-500 to-indigo-600',
      change: '+1 this week',
    },
    {
      label: 'Average Risk Score',
      value: Math.round(stats.avgRisk || 0),
      suffix: '%',
      icon: Heart,
      color: 'from-rose-500 to-red-600',
      change: latestPrediction ? `Latest: ${Math.round(latestPrediction.probability || 0)}%` : 'No data',
    },
    {
      label: 'High Risk Alerts',
      value: stats.highRiskCount,
      icon: AlertTriangle,
      color: 'from-orange-500 to-amber-600',
      change: `${stats.lowRiskCount} low risk`,
    },
    {
      label: 'Days Tracked',
      value: predictions.length > 0
        ? Math.ceil((Date.now() - new Date(predictions[predictions.length - 1]?.date || (predictions[predictions.length - 1] as any)?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
      suffix: 'd',
      icon: Calendar,
      color: 'from-violet-500 to-purple-600',
      change: 'Since first check',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl">
        {/* Greeting header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-jakarta text-3xl font-bold text-on-surface dark:text-white">
              {greeting}, {profile?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-on-surface-variant mt-1">
              {latestPrediction
                ? `Your last check was on ${formatDate(latestPrediction.date)}`
                : "Let's start tracking your heart health today"}
            </p>
          </div>
          <Link href="/predict" className="btn-primary flex items-center gap-2 hidden sm:flex">
            <Activity className="w-4 h-4" />
            New Prediction
          </Link>
        </motion.div>

        {/* Summary row: Gauge + Metric Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk gauge card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="metric-card lg:col-span-1 flex flex-col items-center justify-center gap-4 py-8"
          >
            <h3 className="font-jakarta font-bold text-on-surface dark:text-white text-lg">Current Risk Level</h3>
            {latestPrediction ? (
              <RiskGauge
                score={Math.round(latestPrediction.probability || 0)}
                level={latestPrediction.risk_level as any}
                size={180}
              />
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-surface-container dark:bg-dark-surface-container flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-8 h-8 text-on-surface-variant" />
                </div>
                <p className="text-on-surface-variant text-sm">No predictions yet</p>
                <Link href="/predict" className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                  Run first prediction <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Metric cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <StaggerContainer className="contents" staggerDelay={0.07}>
              {metricCards.map(({ label, value, icon: Icon, color, change, suffix }) => (
                <StaggerItem key={label}>
                  <div className="metric-card h-full">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-3xl font-bold font-jakarta text-on-surface dark:text-white mb-1">
                      <AnimatedCounter end={value} suffix={suffix} />
                    </div>
                    <p className="text-sm font-medium text-on-surface dark:text-white/80 mb-1">{label}</p>
                    <p className="text-xs text-on-surface-variant">{change}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>

        {/* Chart + Tips row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-jakarta font-bold text-on-surface dark:text-white">Risk Trend</h3>
                <Link href="/statistics" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                  Full analytics <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <RiskTrendChart predictions={predictions} />
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="metric-card h-full"
            >
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-jakarta font-bold text-on-surface dark:text-white">Health Tips</h3>
              </div>
              <HealthTips riskLevel={latestPrediction?.risk_level?.toLowerCase() as any} />
            </motion.div>
          </div>
        </div>

        {/* Recent predictions */}
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="metric-card"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-jakarta font-bold text-on-surface dark:text-white">Recent Predictions</h3>
              <Link href="/history" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {predictions.slice(0, 5).map((pred, i) => (
                <motion.div
                  key={pred.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between py-3 border-b border-outline-variant/10 dark:border-dark-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      pred.risk_level?.toLowerCase() === 'low' ? 'bg-secondary' :
                      pred.risk_level?.toLowerCase() === 'medium' ? 'bg-orange-500' : 'bg-tertiary'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-on-surface dark:text-white">
                        {formatDate(pred.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`chip-${pred.risk_level?.toLowerCase()} text-xs`}>
                      {getRiskLabel((pred.risk_level?.toLowerCase() as any) || 'low')}
                    </span>
                    <span className="text-sm font-bold text-on-surface dark:text-white">
                      {Math.round(pred.probability || 0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
