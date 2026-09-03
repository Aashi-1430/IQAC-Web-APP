"use client";

import { useState } from "react";

export default function CalendarModal({ open, onClose }) {
  if (!open) return null;

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];

  // Previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
    });
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: isToday(i),
    });
  }

  // Next month's leading days
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card calendar-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Calendar</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="calendar-container">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={prevMonth}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="calendar-month-year">
              {monthNames[month]} {year}
            </div>
            <button className="calendar-nav-btn" onClick={nextMonth}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-days">
              {days.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    !dayInfo.isCurrentMonth ? "calendar-day-other" : ""
                  } ${dayInfo.isToday ? "calendar-day-today" : ""}`}
                >
                  {dayInfo.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
