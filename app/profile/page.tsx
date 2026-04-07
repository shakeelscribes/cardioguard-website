'use client';
// app/profile/page.tsx - User Profile with avatar upload
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Camera, User, Mail, Save, Loader2, Shield, LogOut, Ruler, Weight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  // NOTE: profile columns in Supabase (set by Flutter app):
  //   name, age, gender, height, weight, avatar_url
  const { user, profile, loading: authLoading, updateProfile, signOut } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [authLoading, user, router]);

  // Populate form from existing profile data
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        age: profile.age != null ? String(profile.age) : '',
        gender: profile.gender || '',
        height: profile.height != null ? String(profile.height) : '',
        weight: profile.weight != null ? String(profile.weight) : '',
      });
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateProfile({
      name: form.name,
      age: form.age ? Number(form.age) : null,
      gender: form.gender,
      height: form.height ? Number(form.height) : null,
      weight: form.weight ? Number(form.weight) : null,
    });
    if (!error) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const url = data.publicUrl + `?t=${Date.now()}`;
      setAvatarUrl(url);
      await updateProfile({ avatar_url: url });
      toast.success('Avatar updated!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (authLoading) return null;

  // Use `name` (the real DB column) for initials
  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? 'U');

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-jakarta text-3xl font-bold text-on-surface dark:text-white mb-1">Profile & Settings</h1>
          <p className="text-on-surface-variant">Manage your personal information and preferences</p>
        </motion.div>

        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="metric-card flex items-center gap-6">
          {/* Avatar */}
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary-gradient flex items-center justify-center flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-3xl font-jakarta">{initials}</span>
              )}
            </div>
            <div className={`absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${uploading ? 'opacity-100' : ''}`}>
              {uploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />

          {/* User info */}
          <div className="flex-1">
            <h2 className="font-jakarta text-2xl font-bold text-on-surface dark:text-white">
              {profile?.name || 'Your Name'}
            </h2>
            <p className="text-on-surface-variant">{user?.email}</p>
            {profile?.age && (
              <p className="text-sm text-on-surface-variant mt-0.5">Age: {profile.age}</p>
            )}
            <p className="text-xs text-on-surface-variant mt-1">
              Member since {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : 'recently'}
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              {avatarUrl ? 'Change photo' : 'Upload photo'}
            </button>
          </div>
        </motion.div>

        {/* Profile form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="metric-card">
          <h3 className="font-jakarta font-bold text-on-surface dark:text-white mb-6">Personal Information</h3>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Jane Smith"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field pl-10 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-2">Age (years)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={form.age}
                  onChange={e => update('age', e.target.value)}
                  placeholder="e.g. 35"
                  className="input-field"
                />
              </div>



              {/* Height */}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-2">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="number"
                    min={100}
                    max={250}
                    value={form.height}
                    onChange={e => update('height', e.target.value)}
                    placeholder="e.g. 170"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-2">Weight (kg)</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="number"
                    min={20}
                    max={300}
                    value={form.weight}
                    onChange={e => update('weight', e.target.value)}
                    placeholder="e.g. 70"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-2">Biological Sex</label>
              <div className="flex gap-3">
                {['Female', 'Male', 'Other'].map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update('gender', option)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      form.gender === option
                        ? 'bg-primary text-white shadow-glow'
                        : 'bg-surface-container dark:bg-dark-surface text-on-surface-variant hover:text-primary border border-outline-variant/20 dark:border-dark-border'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 mt-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>

        {/* Account section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="metric-card">
          <h3 className="font-jakarta font-bold text-on-surface dark:text-white mb-5">Account</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container dark:bg-dark-surface-container">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-on-surface dark:text-white">HIPAA Compliant Storage</p>
                  <p className="text-xs text-on-surface-variant">Your data is encrypted and secure</p>
                </div>
              </div>
              <span className="chip-low text-xs">Active</span>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-tertiary/5 text-tertiary transition-all text-left"
            >
              <LogOut className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs opacity-70">Sign out from all devices</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
