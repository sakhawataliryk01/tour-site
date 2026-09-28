'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Loader2,
} from 'lucide-react';

/**
 * Reusable server-driven DataTable.
 * Search, filters, page and pageSize are stored in the URL and executed on the server.
 *
 * @param {Array<{ id: string, header: string|ReactNode, cell: (row) => ReactNode, className?: string, headerClassName?: string, hideOnMobile?: boolean }>} columns
 * @param {Object[]} rows
 * @param {number} total
 * @param {number} page - 1-based
 * @param {number} pageSize
 * @param {Array<{ id: string, label: string, value?: string, options: Array<{ value: string, label: string }> }>} filters
 */
export default function DataTable({
  columns,
  rows,
  getRowId = (row) => row.id,
  total = 0,
  page = 1,
  pageSize = 10,
  searchKey = 'q',
  searchValue = '',
  searchPlaceholder = 'Suchen…',
  filters = [],
  pageSizeOptions = [10, 25, 50],
  emptyMessage = 'Keine Einträge gefunden.',
  toolbarExtra = null,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(searchValue || '');

  useEffect(() => {
    setLocalSearch(searchValue || '');
  }, [searchValue]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pushParams = useCallback(
    (updates, { resetPage = false } = {}) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      if (resetPage) {
        params.set('page', '1');
      }

      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [pathname, router, searchParams]
  );

  const submitSearch = (e) => {
    e?.preventDefault?.();
    pushParams({ [searchKey]: localSearch.trim() }, { resetPage: true });
  };

  const clearSearch = () => {
    setLocalSearch('');
    pushParams({ [searchKey]: '' }, { resetPage: true });
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Toolbar */}
      <div className="bg-paper-dark border border-stone-light/60 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <form onSubmit={submitSearch} className="relative flex-1 min-w-0 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/35 pointer-events-none" />
            <input
              type="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-paper pl-10 pr-9 py-2.5 text-xs border border-stone rounded-md focus:border-olive focus:outline-none font-medium"
            />
            {localSearch ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-olive cursor-pointer"
                aria-label="Suche zurücksetzen"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <label key={filter.id} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-ink/50">
                <span className="sr-only sm:not-sr-only sm:inline">{filter.label}</span>
                <select
                  value={filter.value || ''}
                  onChange={(e) =>
                    pushParams({ [filter.id]: e.target.value }, { resetPage: true })
                  }
                  className="bg-paper px-2.5 py-2 border border-stone rounded-md focus:border-olive focus:outline-none text-xs font-semibold text-olive min-w-[8rem]"
                >
                  <option value="">{filter.allLabel || `Alle ${filter.label}`}</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-ink/50">
              <span className="hidden sm:inline">Pro Seite</span>
              <select
                value={pageSize}
                onChange={(e) =>
                  pushParams({ pageSize: e.target.value, page: '1' })
                }
                className="bg-paper px-2.5 py-2 border border-stone rounded-md focus:border-olive focus:outline-none text-xs font-semibold text-olive"
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            {toolbarExtra}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-ink/50">
          <span>
            {total === 0
              ? '0 Einträge'
              : `${from}–${to} von ${total} Einträgen`}
          </span>
          {isPending ? (
            <span className="inline-flex items-center gap-1.5 text-olive">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Lädt…
            </span>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div
        className={`bg-paper-dark border border-stone-light/60 rounded-xl overflow-hidden shadow-sm transition-opacity ${
          isPending ? 'opacity-60' : 'opacity-100'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-paper border-b border-stone-light text-ink/50 uppercase tracking-wider font-bold">
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className={`px-3 sm:px-4 py-3 whitespace-nowrap ${col.headerClassName || ''} ${
                      col.hideOnMobile ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-light/30">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-14 text-ink/40 italic font-semibold"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={getRowId(row)}
                    className="hover:bg-paper/50 transition-colors align-middle"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`px-3 sm:px-4 py-3 ${col.className || ''} ${
                          col.hideOnMobile ? 'hidden md:table-cell' : ''
                        }`}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-stone-light/50 bg-paper/40">
          <span className="text-[11px] font-semibold text-ink/50">
            Seite {page} von {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1 || isPending}
              onClick={() => pushParams({ page: String(page - 1) })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-stone bg-paper text-xs font-bold text-olive disabled:opacity-40 hover:bg-paper-dark cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Zurück
            </button>

            {buildPageWindow(page, totalPages).map((p, idx) =>
              p === '…' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-ink/35 font-bold">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  disabled={isPending}
                  onClick={() => pushParams({ page: String(p) })}
                  className={`min-w-8 h-8 rounded-md text-xs font-bold cursor-pointer disabled:opacity-40 ${
                    p === page
                      ? 'bg-olive text-paper'
                      : 'border border-stone bg-paper text-olive hover:bg-paper-dark'
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              disabled={page >= totalPages || isPending}
              onClick={() => pushParams({ page: String(page + 1) })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-stone bg-paper text-xs font-bold text-olive disabled:opacity-40 hover:bg-paper-dark cursor-pointer disabled:cursor-not-allowed"
            >
              Weiter <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildPageWindow(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('…');
    }
    result.push(sorted[i]);
  }
  return result;
}
