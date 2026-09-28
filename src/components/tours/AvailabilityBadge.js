export default function AvailabilityBadge({ state, humanNote }) {
  const badgeStyles = {
    AVAILABLE: 'bg-success/10 text-success border-success/20',
    LIMITED: 'bg-warning/10 text-warning border-warning/20',
    WAITLIST: 'bg-info/10 text-info border-info/20',
    SOLD_OUT: 'bg-error/10 text-error border-error/20',
    CLOSED: 'bg-stone/20 text-ink/60 border-stone/30',
  };

  const labels = {
    AVAILABLE: 'Plätze verfügbar',
    LIMITED: 'Wenige Plätze frei',
    WAITLIST: 'Warteliste / In Planung',
    SOLD_OUT: 'Ausgebucht',
    CLOSED: 'Anmeldung geschlossen',
  };

  const style = badgeStyles[state] || badgeStyles.CLOSED;
  const label = humanNote || labels[state] || labels.CLOSED;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold tracking-wide border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
      {label}
    </span>
  );
}
