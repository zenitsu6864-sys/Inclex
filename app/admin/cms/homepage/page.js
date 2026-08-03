'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Save, Eye } from 'lucide-react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Panel, Field } from '@/components/ui';
import { api } from '@/lib/api/client';

export default function HomepageCMS() {
  const [content, setContent] = useState(null); const [saving, setSaving] = useState(false);
  useEffect(() => { api.get('/api/admin/content/homepage').then(j => setContent(j.homepage)).catch(() => {}); }, []);

  async function save() {
    setSaving(true);
    try { await api.post('/api/admin/content/homepage', content); toast.success('Homepage updated'); }
    catch (e) { toast.error(e.message || 'Failed to save'); }
    finally { setSaving(false); }
  }

  if (!content) return <AdminShell title="Homepage"><div className="text-sm text-neutral-500">Loading…</div></AdminShell>;
  const set = (k) => (v) => setContent(c => ({ ...c, [k]: v }));

  return (
    <AdminShell title="Homepage CMS" subtitle="Edit hero, experience, sections and banners"
      actions={<div className="flex items-center gap-2"><Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-3 py-1.5 text-xs"><Eye className="h-3.5 w-3.5" /> Preview</Link><button onClick={save} disabled={saving} className="btn-dark !py-2 !px-4 text-xs"><Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Publish'}</button></div>}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Announcement Bar">
          <Field label="Left message" value={content.announcementBar} onChange={set('announcementBar')} />
          <Field label="Center coupon copy" value={content.couponBanner} onChange={set('couponBanner')} />
        </Panel>

        <Panel title="Hero Section">
          <Field label="Eyebrow" value={content.heroEyebrow} onChange={set('heroEyebrow')} />
          <Field label="Heading" value={content.heroHeading} onChange={set('heroHeading')} />
          <Field label="Subtitle" value={content.heroSubtitle} onChange={set('heroSubtitle')} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA text" value={content.heroPrimaryCta} onChange={set('heroPrimaryCta')} />
            <Field label="Primary link" value={content.heroPrimaryHref} onChange={set('heroPrimaryHref')} />
            <Field label="Secondary CTA text" value={content.heroSecondaryCta} onChange={set('heroSecondaryCta')} />
            <Field label="Secondary link" value={content.heroSecondaryHref} onChange={set('heroSecondaryHref')} />
          </div>
          <Field label="Hero Video URL (mp4)" value={content.heroVideo} onChange={set('heroVideo')} />
          <Field label="Hero Poster Image" value={content.heroPoster} onChange={set('heroPoster')} />
        </Panel>

        <Panel title="Experience Section">
          <Field label="Eyebrow" value={content.experienceEyebrow} onChange={set('experienceEyebrow')} />
          <Field label="Heading" value={content.experienceHeading} onChange={set('experienceHeading')} />
          <Field label="Subtitle" value={content.experienceSubtitle} onChange={set('experienceSubtitle')} />
          <Field label="Video URL (mp4)" value={content.experienceVideo} onChange={set('experienceVideo')} />
        </Panel>

        <Panel title="Customize Teaser">
          <Field label="Heading" value={content.customizeHeading} onChange={set('customizeHeading')} />
          <Field label="Subtitle" value={content.customizeSubtitle} onChange={set('customizeSubtitle')} />
        </Panel>

        <Panel title="Newsletter Section">
          <Field label="Heading" value={content.newsletterHeading} onChange={set('newsletterHeading')} />
          <Field label="Subtitle" value={content.newsletterSubtitle} onChange={set('newsletterSubtitle')} />
        </Panel>
      </div>
    </AdminShell>
  );
}
