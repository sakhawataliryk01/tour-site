'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Archive,
  CheckCircle,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Pencil,
  Plus,
  X,
} from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import TourThumbnail from '@/components/admin/TourThumbnail';
import TourImageField from '@/components/admin/TourImageField';
import RichTextEditor from '@/components/ui/RichTextEditor';
import {
  archiveTour,
  createTour,
  duplicateTour,
  setTourStatus,
  updateTour,
  updateTourHeroImage,
} from '@/app/actions/admin';

const emptyForm = {
  title: '',
  subtitle: '',
  year: new Date().getFullYear() + 1,
  startDate: '',
  endDate: '',
  category: 'STANDARD',
  excerpt: '',
  overview: '',
  minParticipants: 22,
  targetGroupSize: 27,
  doubleRooms: 15,
  singleRooms: 5,
  priceLabel: 'Landprogramm (ohne Flug)',
  priceAmount: '',
  priceCurrency: 'EUR',
  registrationMode: 'OPEN',
  status: 'DRAFT',
};

const CATEGORY_LABELS = {
  STANDARD: 'Standard',
  BUDGET: 'Budget',
  YOUTH: 'Jugend',
  RELAXED: 'Erholung',
  SPECIAL: 'Sonder',
  PRIVATE: 'Privat',
};

const STATUS_LABELS = {
  PUBLISHED: 'Veröffentlicht',
  DRAFT: 'Entwurf',
  ARCHIVED: 'Archiviert',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function ToursAdmin({
  rows,
  total,
  page,
  pageSize,
  q,
  status,
  year,
  category,
  yearOptions = [],
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [heroFile, setHeroFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [replacingId, setReplacingId] = useState(null);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setHeroFile(null);
    setErrors({});
    setFeedback(null);
    setShowForm(true);
  };

  const openEditForm = (tour) => {
    const primaryPrice = tour.prices?.[0];
    setEditingId(tour.id);
    setForm({
      title: tour.title || '',
      subtitle: tour.subtitle || '',
      year: tour.year || new Date().getFullYear(),
      startDate: tour.startDate ? String(tour.startDate).slice(0, 10) : '',
      endDate: tour.endDate ? String(tour.endDate).slice(0, 10) : '',
      category: tour.category || 'STANDARD',
      excerpt: tour.excerpt || '',
      overview: tour.overview || '',
      minParticipants: tour.minParticipants ?? 22,
      targetGroupSize: tour.targetGroupSize ?? 27,
      doubleRooms: tour.capacity?.doubleRooms ?? 15,
      singleRooms: tour.capacity?.singleRooms ?? 5,
      priceLabel: primaryPrice?.label || 'Landprogramm (ohne Flug)',
      priceAmount: primaryPrice?.amount ?? '',
      priceCurrency: primaryPrice?.currency || 'EUR',
      registrationMode: tour.registrationMode || 'CLOSED',
      status: tour.status === 'ARCHIVED' ? 'DRAFT' : tour.status || 'DRAFT',
    });
    setHeroFile(null);
    setErrors({});
    setFeedback(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setHeroFile(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFeedback(null);
    setErrors({});

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value ?? ''));
    });
    if (heroFile) formData.append('heroImage', heroFile);

    const res = editingId
      ? await updateTour(editingId, null, formData)
      : await createTour(null, formData);
    setCreating(false);

    if (res.success) {
      setFeedback({ success: true, message: res.message });
      closeForm();
      router.refresh();
    } else {
      setErrors(res.errors || {});
      setFeedback({
        success: false,
        message: res.message || 'Speichern fehlgeschlagen.',
      });
    }
  };

  const handleDuplicate = async (tourId) => {
    setLoadingId(tourId);
    setFeedback(null);
    const res = await duplicateTour(tourId);
    setLoadingId(null);
    setFeedback({
      success: !!res.success,
      message: res.message || (res.success ? 'Dupliziert.' : 'Fehler'),
    });
    if (res.success) router.refresh();
  };

  const handleTogglePublish = async (tour) => {
    setLoadingId(tour.id);
    setFeedback(null);
    const nextStatus = tour.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const res = await setTourStatus(tour.id, nextStatus);
    setLoadingId(null);
    setFeedback({
      success: !!res.success,
      message: res.message || (res.success ? 'Status aktualisiert.' : 'Fehler'),
    });
    if (res.success) router.refresh();
  };

  const handleArchive = async (tourId) => {
    if (!window.confirm('Reise wirklich archivieren? Sie verschwindet von der öffentlichen Website.')) {
      return;
    }
    setLoadingId(tourId);
    setFeedback(null);
    const res = await archiveTour(tourId);
    setLoadingId(null);
    setFeedback({
      success: !!res.success,
      message: res.message || (res.success ? 'Archiviert.' : 'Fehler'),
    });
    if (res.success) router.refresh();
  };

  const handleReplaceHero = async (tourId, file) => {
    if (!file) return;
    setReplacingId(tourId);
    setFeedback(null);
    const formData = new FormData();
    formData.append('heroImage', file);
    const res = await updateTourHeroImage(tourId, formData);
    setReplacingId(null);
    setFeedback({
      success: !!res.success,
      message: res.message || (res.success ? 'Bild aktualisiert.' : 'Fehler'),
    });
    if (res.success) router.refresh();
  };

  const columns = useMemo(
    () => [
      {
        id: 'image',
        header: 'Bild',
        className: 'w-[4.5rem]',
        cell: (tour) => (
          <div className="flex flex-col items-start gap-1">
            <TourThumbnail media={tour.heroMedia} alt={tour.title} />
            <label className="inline-flex items-center gap-0.5 text-[9px] font-bold text-terracotta hover:underline cursor-pointer">
              <ImagePlus className="h-3 w-3" />
              {replacingId === tour.id ? '…' : tour.heroMedia ? 'Ersetzen' : 'Hochladen'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={replacingId === tour.id}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleReplaceHero(tour.id, file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        ),
      },
      {
        id: 'title',
        header: 'Reise',
        cell: (tour) => (
          <div className="min-w-[12rem] max-w-[18rem] space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-terracotta">
                {tour.id.slice(0, 5).toUpperCase()}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide ${
                  tour.status === 'PUBLISHED'
                    ? 'bg-olive/10 text-olive'
                    : 'bg-stone text-ink/60'
                }`}
              >
                {STATUS_LABELS[tour.status] || tour.status}
              </span>
            </div>
            <p className="font-serif font-bold text-sm text-olive leading-snug truncate">
              {tour.title}
            </p>
            {tour.subtitle ? (
              <p className="text-[10px] text-ink/50 font-medium truncate">{tour.subtitle}</p>
            ) : null}
          </div>
        ),
      },
      {
        id: 'dates',
        header: 'Zeitraum',
        hideOnMobile: true,
        cell: (tour) => (
          <div className="space-y-0.5 text-[11px] font-semibold text-ink/75 whitespace-nowrap">
            <p>
              {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
            </p>
            <p className="text-ink/45">
              {tour.durationDays} Tage · {tour.year}
            </p>
          </div>
        ),
      },
      {
        id: 'category',
        header: 'Kategorie',
        hideOnMobile: true,
        cell: (tour) => (
          <span className="text-[11px] font-semibold text-olive">
            {CATEGORY_LABELS[tour.category] || tour.category}
          </span>
        ),
      },
      {
        id: 'bookings',
        header: 'Buchungen',
        cell: (tour) => {
          const doubleCap = tour.capacity?.doubleRooms || 15;
          const singleCap = tour.capacity?.singleRooms || 5;
          const capacity = doubleCap * 2 + singleCap;
          return (
            <div className="text-[11px] font-semibold text-olive whitespace-nowrap">
              <span>{tour.registrationCount || 0}</span>
              <span className="text-ink/40"> / {capacity}</span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Aktionen',
        headerClassName: 'text-right',
        className: 'text-right',
        cell: (tour) => (
          <div className="inline-flex flex-wrap justify-end gap-1.5">
            {tour.status === 'PUBLISHED' ? (
              <Link
                href={`/reisen/${tour.slug}`}
                target="_blank"
                className="p-1.5 border border-stone-light rounded bg-paper text-ink/50 hover:text-terracotta"
                title="Öffentliche Seite"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ) : null}
            <button
              type="button"
              disabled={loadingId === tour.id}
              onClick={() => handleTogglePublish(tour)}
              className="inline-flex items-center gap-1 px-2 py-1.5 border border-stone rounded bg-paper text-[10px] font-bold text-olive hover:text-terracotta cursor-pointer disabled:opacity-50"
              title={tour.status === 'PUBLISHED' ? 'Als Entwurf' : 'Veröffentlichen'}
            >
              {tour.status === 'PUBLISHED' ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              <span className="hidden xl:inline">
                {tour.status === 'PUBLISHED' ? 'Entwurf' : 'Publish'}
              </span>
            </button>
            <button
              type="button"
              disabled={loadingId === tour.id}
              onClick={() => openEditForm(tour)}
              className="inline-flex items-center gap-1 px-2 py-1.5 border border-stone rounded bg-paper text-[10px] font-bold text-olive hover:text-terracotta cursor-pointer disabled:opacity-50"
              title="Bearbeiten"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Bearbeiten</span>
            </button>
            <button
              type="button"
              disabled={loadingId === tour.id}
              onClick={() => handleDuplicate(tour.id)}
              className="inline-flex items-center gap-1 px-2 py-1.5 border border-stone rounded bg-paper text-[10px] font-bold text-olive hover:text-terracotta cursor-pointer disabled:opacity-50"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Duplizieren</span>
            </button>
            {tour.status !== 'ARCHIVED' ? (
              <button
                type="button"
                disabled={loadingId === tour.id}
                onClick={() => handleArchive(tour.id)}
                className="inline-flex items-center gap-1 px-2 py-1.5 border border-stone rounded bg-paper text-[10px] font-bold text-ink/50 hover:text-terracotta cursor-pointer disabled:opacity-50"
                title="Archivieren"
              >
                <Archive className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        ),
      },
    ],
    [loadingId, replacingId]
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-paper-dark border border-stone-light/60 p-4 rounded-xl">
        <span className="text-xs font-semibold text-ink/65">
          {total} Reiseprogramme insgesamt
        </span>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              closeForm();
            } else {
              openCreateForm();
            }
          }}
          className="btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <span className="relative inline-flex h-4 w-4 shrink-0" aria-hidden>
            <Plus className={`absolute inset-0 h-4 w-4 ${showForm ? 'invisible' : ''}`} />
            <X className={`absolute inset-0 h-4 w-4 ${showForm ? '' : 'invisible'}`} />
          </span>
          {showForm ? 'Formular schliessen' : 'Neue Reise anlegen'}
        </button>
      </div>

      {feedback ? (
        <div
          className={`p-4 rounded-lg text-sm font-semibold flex gap-2.5 items-center ${
            feedback.success
              ? 'bg-olive/10 text-olive border border-olive/30'
              : 'bg-terracotta/10 text-terracotta border border-terracotta/30'
          }`}
        >
          <span className="relative inline-flex h-5 w-5 shrink-0" aria-hidden>
            <CheckCircle
              className={`absolute inset-0 h-5 w-5 ${feedback.success ? '' : 'invisible'}`}
            />
            <AlertCircle
              className={`absolute inset-0 h-5 w-5 ${feedback.success ? 'invisible' : ''}`}
            />
          </span>
          <p>{feedback.message}</p>
        </div>
      ) : null}

      <div className={showForm ? 'block' : 'hidden'}>
        <form
          onSubmit={handleSubmit}
          className="bg-paper-dark border border-stone p-6 rounded-xl space-y-5 shadow-sm"
        >
          <div className="border-b border-stone-light pb-3">
            <h2 className="text-lg font-serif font-bold text-olive">
              {editingId ? 'Reise bearbeiten' : 'Neue Israelreise anlegen'}
            </h2>
            <p className="text-xs text-ink/55 font-semibold mt-1">
              Basisdaten, Titelbild (16:9), Kapazität und Startpreis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-olive">
            <TourImageField value={null} onChange={setHeroFile} />

            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Titel *</label>
              <input
                required
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                placeholder="z.B. Frühjahrsreise 2028"
              />
              {errors.title && <p className="text-terracotta">{errors.title[0]}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Untertitel</label>
              <input
                value={form.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Jahr *</label>
              <input
                type="number"
                required
                value={form.year}
                onChange={(e) => updateField('year', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Kategorie *</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              >
                <option value="STANDARD">Standard-Studienreise</option>
                <option value="BUDGET">Budgetreise</option>
                <option value="YOUTH">Jugendreise</option>
                <option value="RELAXED">Erholungsreise</option>
                <option value="SPECIAL">Sonderreise</option>
                <option value="PRIVATE">Private Gruppe</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Startdatum *</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Enddatum *</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Doppelzimmer</label>
              <input
                type="number"
                min="0"
                value={form.doubleRooms}
                onChange={(e) => updateField('doubleRooms', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Einzelzimmer</label>
              <input
                type="number"
                min="0"
                value={form.singleRooms}
                onChange={(e) => updateField('singleRooms', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Preisbezeichnung *</label>
              <input
                required
                value={form.priceLabel}
                onChange={(e) => updateField('priceLabel', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase text-ink/55">Betrag *</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={form.priceAmount}
                  onChange={(e) => updateField('priceAmount', e.target.value)}
                  className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase text-ink/55">Währung</label>
                <select
                  value={form.priceCurrency}
                  onChange={(e) => updateField('priceCurrency', e.target.value)}
                  className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
                >
                  <option value="EUR">EUR</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Anmeldungsmodus</label>
              <select
                value={form.registrationMode}
                onChange={(e) => updateField('registrationMode', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              >
                <option value="CLOSED">Geschlossen</option>
                <option value="INTEREST">Interessenliste</option>
                <option value="OPEN">Online-Anmeldung offen</option>
                <option value="WAITLIST">Warteliste</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none"
              >
                <option value="DRAFT">Entwurf</option>
                <option value="PUBLISHED">Veröffentlicht</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">Kurzbeschreibung</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                className="w-full bg-paper p-3 border border-stone rounded-md focus:border-olive focus:outline-none font-medium"
                placeholder="Kurzer Teaser für Karten & SEO (Klartext)"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase text-ink/55">
                Überblick (Hauptbeschreibung)
              </label>
              <RichTextEditor
                key={editingId || 'new-tour'}
                value={form.overview}
                onChange={(html) => updateField('overview', html)}
                placeholder="Ausführliche Reisebeschreibung mit Formatierung…"
                minHeightClass="min-h-[220px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-stone-light">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 text-xs font-bold border border-stone rounded-md text-ink/60 hover:bg-paper cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={creating}
              className="btn-primary py-2 px-5 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {creating
                ? 'Wird gespeichert…'
                : editingId
                  ? 'Änderungen speichern'
                  : 'Reise speichern'}
            </button>
          </div>
        </form>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        pageSize={pageSize}
        searchValue={q}
        searchPlaceholder="Titel, Untertitel oder Slug suchen…"
        emptyMessage="Keine Reisen für die aktuellen Filter gefunden."
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: status,
            allLabel: 'Alle Status',
            options: [
              { value: 'PUBLISHED', label: 'Veröffentlicht' },
              { value: 'DRAFT', label: 'Entwurf' },
              { value: 'ARCHIVED', label: 'Archiviert' },
            ],
          },
          {
            id: 'year',
            label: 'Jahr',
            value: year,
            allLabel: 'Alle Jahre',
            options: yearOptions.map((y) => ({
              value: String(y),
              label: String(y),
            })),
          },
          {
            id: 'category',
            label: 'Kategorie',
            value: category,
            allLabel: 'Alle Kategorien',
            options: Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          },
        ]}
      />
    </div>
  );
}
