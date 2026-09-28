"use client";

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Coffee, HelpCircle } from 'lucide-react';

export default function ItineraryTimeline({ days }) {
  const [openDays, setOpenDays] = useState({ 0: true }); // Keep first day open by default

  const toggleDay = (index) => {
    setOpenDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    const all = {};
    days.forEach((_, i) => {
      all[i] = true;
    });
    setOpenDays(all);
  };

  const collapseAll = () => {
    setOpenDays({});
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getMealAbbreviation = (meals) => {
    if (!meals || meals.length === 0) return null;
    // e.g. ["BREAKFAST", "DINNER"] => "F, A" (Frühstück, Abendessen)
    const mapping = {
      BREAKFAST: 'F',
      LUNCH: 'M',
      DINNER: 'A',
    };
    return meals.map(m => mapping[m]).filter(Boolean).join(', ');
  };

  const getMealFullText = (meals) => {
    if (!meals || meals.length === 0) return '';
    const mapping = {
      BREAKFAST: 'Frühstück',
      LUNCH: 'Mittagessen',
      DINNER: 'Abendessen',
    };
    return meals.map(m => mapping[m]).filter(Boolean).join(' & ');
  };

  return (
    <div className="space-y-4">
      {/* Accordion Controls */}
      <div className="flex justify-end gap-3 text-xs font-semibold text-terracotta font-sans">
        <button onClick={expandAll} className="hover:underline cursor-pointer">
          Alle Tage aufklappen
        </button>
        <span className="text-stone">|</span>
        <button onClick={collapseAll} className="hover:underline cursor-pointer">
          Alle einklappen
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 font-sans">
        {days.map((day, index) => {
          const meals = [];
          if (day.mealsBreakfast) meals.push('BREAKFAST');
          if (day.mealsLunch) meals.push('LUNCH');
          if (day.mealsDinner) meals.push('DINNER');
          const hasMeals = meals.length > 0;
          const isOpen = !!openDays[index];

          return (
            <div
              key={day.id}
              className={`border rounded-lg transition-all overflow-hidden ${
                isOpen 
                  ? 'border-stone bg-paper-dark shadow-sm' 
                  : 'border-stone-light/60 bg-paper hover:border-stone/60'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleDay(index)}
                className="w-full text-left p-4 sm:p-5 flex items-start gap-4 focus:outline-none cursor-pointer group"
              >
                {/* Day Marker */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center border font-serif ${
                  isOpen 
                    ? 'bg-olive text-paper border-olive' 
                    : 'bg-paper-dark text-olive border-stone-light group-hover:border-stone'
                }`}>
                  <span className="text-xs font-bold uppercase leading-none">Tag</span>
                  <span className="text-lg font-bold leading-none">{day.dayNumber}</span>
                </div>

                {/* Day Summary */}
                <div className="flex-grow space-y-1 mt-0.5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-xs font-bold text-terracotta font-mono tracking-wider uppercase">
                      {formatDate(day.date)}
                    </span>
                    {day.accommodationLabel && (
                      <span className="text-xs font-semibold text-ink/50 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-olive/70" />
                        {day.accommodationLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-olive">
                    {day.title}
                  </h3>
                </div>

                {/* Toggle Icon */}
                <div className="flex-shrink-0 mt-2 text-ink/40 group-hover:text-olive">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Body */}
              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 border-t border-stone-light/40 pt-4 space-y-4">
                  {/* Daily Narrative */}
                  <div className="text-sm sm:text-base text-ink/85 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                    {day.description}
                  </div>

                  {/* Highlights / Scripture References */}
                  {day.notes && day.notes.trim() !== "" && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {day.notes.split(",").map((ref, rIdx) => (
                        <span
                          key={rIdx}
                          className="inline-flex items-center gap-1 bg-paper border border-stone-light px-2.5 py-1 rounded text-xs font-semibold text-olive font-mono"
                        >
                          📖 {ref.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Accomodation & Meals Row */}
                  {(day.accommodationLabel || hasMeals) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-light/35 text-xs text-ink/75 font-medium">
                      {day.accommodationLabel && (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-olive">Unterkunft:</span>
                          <span className="text-ink/85">{day.accommodationLabel}</span>
                        </div>
                      )}
                      {hasMeals && (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-olive">Verpflegung:</span>
                          <span className="text-ink/85 flex items-center gap-1.5">
                            <Coffee className="w-3.5 h-3.5 text-terracotta" />
                            {getMealFullText(meals)} ({getMealAbbreviation(meals)})
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
