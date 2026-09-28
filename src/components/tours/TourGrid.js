import TourCard from './TourCard';

export default function TourGrid({ tours, emptyMessage = 'Derzeit stehen keine Reisen für diesen Zeitraum zur Verfügung.' }) {
  if (!tours || tours.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-paper-dark border border-stone-light/50 rounded-lg max-w-lg mx-auto space-y-3 font-sans">
        <p className="text-ink/60 font-medium">{emptyMessage}</p>
        <p className="text-xs text-ink/40">Bitte abonnieren Sie unsere Interessenliste oder kontaktieren Sie uns für private Gruppenreisen.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tours.map((tour) => (
        <TourGridItem key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

function TourGridItem({ tour }) {
  return <TourCard tour={tour} />;
}
