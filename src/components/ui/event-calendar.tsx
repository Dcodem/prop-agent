"use client";

import { useState, useMemo } from "react";

interface CalendarEvent {
  date: Date;
  title: string;
  type: "maintenance" | "lease" | "inspection" | "vendor";
  href?: string;
}

const EVENT_COLORS: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  maintenance: { dot: "bg-info", bg: "bg-info/10", text: "text-info", label: "Maintenance" },
  lease: { dot: "bg-caution", bg: "bg-caution/10", text: "text-caution", label: "Lease" },
  inspection: { dot: "bg-success", bg: "bg-success/10", text: "text-success", label: "Inspection" },
  vendor: { dot: "bg-warning", bg: "bg-warning/10", text: "text-warning-dim", label: "Vendor Visit" },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function EventCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  function getEventsForDay(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    return events.filter((e) => isSameDay(e.date, date));
  }

  const selectedEvents = selectedDate
    ? events.filter((e) => isSameDay(e.date, selectedDate))
    : [];

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events
      .filter((e) => e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [events]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (day: number) =>
    selectedDate && day === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Calendar Grid */}
      <div className="lg:col-span-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-surface">
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); }}
              className="px-3 py-1 rounded-lg text-xs font-bold text-accent hover:bg-accent/5 transition-colors"
            >
              Today
            </button>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-outline uppercase tracking-widest py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-px">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="h-14" />;
            const dayEvents = getEventsForDay(day);
            const uniqueTypes = [...new Set(dayEvents.map((e) => e.type))];
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(new Date(viewYear, viewMonth, day))}
                className={`h-14 flex flex-col items-center justify-center rounded-lg transition-all relative ${
                  isSelected(day)
                    ? "bg-accent text-on-accent shadow-md"
                    : isToday(day)
                    ? "bg-accent/10 text-accent font-extrabold"
                    : "hover:bg-surface-container-low text-on-surface"
                }`}
              >
                <span className={`text-sm ${isToday(day) && !isSelected(day) ? "font-extrabold" : "font-medium"}`}>
                  {day}
                </span>
                {uniqueTypes.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {uniqueTypes.slice(0, 3).map((type) => (
                      <span
                        key={type}
                        className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? "bg-on-accent/60" : EVENT_COLORS[type].dot}`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-outline-variant/10">
          {Object.entries(EVENT_COLORS).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${val.dot}`} />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar: Selected Day / Upcoming */}
      <div className="lg:col-span-2 space-y-4">
        {/* Selected Date Events */}
        {selectedDate && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow p-5">
            <h3 className="text-sm font-bold text-on-surface mb-3">
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-xs text-on-surface-variant">No events scheduled</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((evt, i) => {
                  const color = EVENT_COLORS[evt.type];
                  return (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${color.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${color.text}`}>{evt.title}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{color.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Upcoming Events */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-lg text-accent">event_upcoming</span>
            <h3 className="text-sm font-bold text-on-surface">Upcoming</h3>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-xs text-on-surface-variant">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((evt, i) => {
                const color = EVENT_COLORS[evt.type];
                const daysFromNow = Math.ceil((evt.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="text-center min-w-[40px]">
                      <p className="text-[10px] font-bold text-outline uppercase">
                        {evt.date.toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p className="text-lg font-extrabold text-on-surface leading-tight">{evt.date.getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{evt.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{color.label}</span>
                        <span className="text-[10px] text-outline">
                          {daysFromNow === 0 ? "Today" : daysFromNow === 1 ? "Tomorrow" : `in ${daysFromNow}d`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
