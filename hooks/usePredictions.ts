'use client';
// hooks/usePredictions.ts - Predictions data hook
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Prediction } from '@/types';

export function usePredictions(userId: string | undefined) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false }); // Sort by Flutter schema's date attribute

      if (error) throw error;
      
      // Enforce strict local Date sorting to prevent alphabetical string-sort bugs from Supabase if date column is text
      const sortedData = (data || []).sort((a: any, b: any) => {
        const timeA = new Date(a.date || a.created_at || 0).getTime();
        const timeB = new Date(b.date || b.created_at || 0).getTime();
        return timeB - timeA; // Descending (newest first)
      });
      
      setPredictions(sortedData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch predictions');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  async function savePrediction(prediction: Omit<Prediction, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .insert(prediction)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setPredictions(prev => [data, ...prev]);
      }
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }

  async function deletePrediction(id: string) {
    try {
      const { error } = await supabase
        .from('predictions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPredictions(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  }

  const stats = {
    total: predictions.length,
    latest: predictions[0] || null,
    avgRisk: predictions.length > 0
      ? predictions.reduce((sum, p) => sum + (p.probability || 0), 0) / predictions.length
      : 0,
    highRiskCount: predictions.filter(p => (p.risk_level?.toLowerCase() || '') === 'high').length,
    lowRiskCount: predictions.filter(p => (p.risk_level?.toLowerCase() || '') === 'low').length,
  };

  return {
    predictions,
    loading,
    error,
    stats,
    refetch: fetchPredictions,
    savePrediction,
    deletePrediction,
  };
}
