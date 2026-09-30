'use client';

import { useState } from 'react';
import { resumeRegistrationCheckout } from '@/app/actions/registrations';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';

export default function ResumeCheckoutButton({ publicId, slug }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);
    const res = await resumeRegistrationCheckout(publicId);
    setLoading(false);

    if (res.alreadyPaid && res.slug) {
      router.push(`/reisen/${res.slug}/anmeldung/bestaetigt?id=${encodeURIComponent(publicId)}`);
      return;
    }

    if (res.success && res.checkoutUrl) {
      window.location.href = res.checkoutUrl;
      return;
    }

    setError(res.message || 'Zahlung konnte nicht gestartet werden.');
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="btn-primary py-3 px-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
      >
        <CreditCard className="w-4 h-4" />
        {loading ? 'Weiterleitung…' : 'Zahlung fortsetzen'}
      </button>
      {error && <p className="text-xs text-terracotta font-medium">{error}</p>}
      {!publicId && slug && (
        <p className="text-xs text-ink/50">Keine Buchungsnummer — bitte erneut anmelden.</p>
      )}
    </div>
  );
}
