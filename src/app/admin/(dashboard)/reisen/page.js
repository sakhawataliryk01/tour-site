import { Suspense } from 'react';
import { queryAdminTours } from '@/lib/admin/tours-query';
import ToursAdmin from '@/components/admin/ToursAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminReisenPage({ searchParams }) {
  const params = await searchParams;
  const data = await queryAdminTours(params || {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-olive">Touren & Israelreisen</h1>
        <p className="text-sm text-ink/65 font-semibold uppercase tracking-wider">
          Reiseprogramme verwalten und duplizieren
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-xl border border-stone-light/60 bg-paper-dark p-8 text-sm text-ink/50 font-semibold">
            Tabelle wird geladen…
          </div>
        }
      >
        <ToursAdmin
          rows={data.rows}
          total={data.total}
          page={data.page}
          pageSize={data.pageSize}
          q={data.q}
          status={data.status}
          year={data.year}
          category={data.category}
          yearOptions={data.yearOptions}
        />
      </Suspense>
    </div>
  );
}
