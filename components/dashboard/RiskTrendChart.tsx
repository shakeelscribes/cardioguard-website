'use client';
// components/dashboard/RiskTrendChart.tsx
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { Prediction } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props {
  predictions: Prediction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const risk = payload[0].value;
    const level = risk < 30 ? 'low' : risk < 60 ? 'medium' : 'high';
    const colors = { low: '#1b6d24', medium: '#f57c00', high: '#b7181f' };
    return (
      <div className="bg-white dark:bg-dark-surface rounded-xl shadow-ambient-md p-3 border border-outline-variant/20 dark:border-dark-border text-sm">
        <p className="text-on-surface-variant text-xs mb-1">{label}</p>
        <p className="font-bold" style={{ color: colors[level] }}>
          Risk: {risk}%
        </p>
        <p className="text-xs text-on-surface-variant capitalize">{level} risk</p>
      </div>
    );
  }
  return null;
};

export default function RiskTrendChart({ predictions }: Props) {
  if (predictions.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-on-surface-variant text-sm">
        No prediction data yet. Run your first assessment!
      </div>
    );
  }

  const data = [...predictions]
    .reverse()
    .slice(-20)
    .map((p) => ({
      date: formatDate(p.date || (p as any).created_at || new Date().toISOString()),
      risk: Math.round(p.probability || (p as any).risk_score || 0),
    }));

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#005dac" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#005dac" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,71,82,0.08)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#414752' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#414752' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={60} stroke="#b7181f" strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine y={30} stroke="#1b6d24" strokeDasharray="4 4" strokeOpacity={0.4} />
          <Area
            type="monotone"
            dataKey="risk"
            stroke="#005dac"
            strokeWidth={2.5}
            fill="url(#riskGradient)"
            dot={{ fill: '#005dac', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#1976D2' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
