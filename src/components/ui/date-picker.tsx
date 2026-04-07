"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useClickOutside } from "@/components/ui/use-click-outside";
import clsx from "clsx";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  name?: string;
  minValue?: Date;
  maxValue?: Date;
  className?: string;
}

const CalendarIcon = () => (
  <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" className="fill-gray-700">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.5 0.5V1.25V2H10.5V1.25V0.5H12V1.25V2H14H15.5V3.5V13.5C15.5 14.8807 14.3807 16 13 16H3C1.61929 16 0.5 14.8807 0.5 13.5V3.5V2H2H4V1.25V0.5H5.5ZM2 3.5H14V6H2V3.5ZM2 7.5V13.5C2 14.0523 2.44772 14.5 3 14.5H13C13.5523 14.5 14 14.0523 14 13.5V7.5H2Z"
    />
  </svg>
);

const ChevronLeft = () => (
  <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" className="fill-gray-700">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
    />
  </svg>
);

const ChevronRight = () => (
  <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" className="fill-gray-700">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
    />
  </svg>
);

const ClearIcon = () => (
  <svg height="12" strokeLinejoin="round" viewBox="0 0 16 16" width="12" className="fill-gray-700">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
    />
  </svg>
);

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  name,
  minValue,
  maxValue,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  useEffect(() => {
    const close = () => setIsOpen(false);
    window.addEventListener("scroll", close);
    return () => window.removeEventListener("scroll", close);
  }, []);

  const daysArray = useMemo(() => {
    const days: Date[] = [];
    let day = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  const handleDateClick = (d: Date) => {
    onChange(d);
    setIsOpen(false);
  };

  return (
    <div className={clsx("relative", className)} ref={ref}>
      {/* Hidden input for form submission */}
      {name && (
        <input type="hidden" name={name} value={value ? format(value, "yyyy-MM-dd") : ""} />
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center gap-2 w-full px-3 py-2 text-sm font-sans rounded-lg border transition-all duration-150",
          "bg-background-100 border-gray-alpha-400 hover:border-gray-alpha-500",
          "focus:outline-none focus:shadow-focus-input focus:border-transparent",
          isOpen && "shadow-focus-input border-transparent"
        )}
      >
        <CalendarIcon />
        <span className={clsx("flex-1 text-left truncate", !value && "text-gray-700")}>
          {value ? format(value, "MMM dd, yyyy") : placeholder}
        </span>
        {value && (
          <span
            className="hover:fill-gray-1000 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          >
            <ClearIcon />
          </span>
        )}
      </button>

      {/* Popover calendar */}
      {isOpen && (
        <div className="absolute z-50 top-11 left-0 p-3 w-[280px] bg-background-100 rounded-xl shadow-menu font-sans">
          {/* Month navigation */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm text-gray-1000 font-medium">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex gap-0.5">
              <button type="button" className="p-1 hover:bg-gray-alpha-200 rounded" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft />
              </button>
              <button type="button" className="p-1 hover:bg-gray-alpha-200 rounded" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 text-center text-xs text-gray-900 uppercase mb-2">
            <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 items-center gap-y-1">
            {daysArray.map((d) => {
              const selected = value && isSameDay(d, value);
              const inMonth = isSameMonth(d, currentDate);
              const today = isToday(d);
              const allowed = (minValue ? d >= minValue : true) && (maxValue ? d <= maxValue : true);

              return (
                <div
                  key={d.toString()}
                  className="flex items-center justify-center"
                  onClick={() => allowed && handleDateClick(d)}
                >
                  <div
                    className={clsx(
                      "h-8 w-8 flex items-center justify-center rounded text-sm transition cursor-pointer",
                      !inMonth && "text-gray-700/40",
                      inMonth && !selected && !today && allowed && "text-gray-1000 hover:border hover:border-gray-alpha-500",
                      selected && "!bg-gray-1000 !text-background-100",
                      today && !selected && "!bg-blue-900 !text-background-100",
                      !allowed && "cursor-not-allowed opacity-40"
                    )}
                  >
                    {format(d, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 pt-2 border-t border-gray-alpha-100">
            <button
              type="button"
              className="w-full text-center text-xs font-medium text-gray-900 hover:text-gray-1000 py-1 rounded hover:bg-gray-alpha-200 transition"
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                handleDateClick(now);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
