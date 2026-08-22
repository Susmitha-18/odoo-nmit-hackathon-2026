/**
 * Date and time formatting utilities for Dayflow HRMS.
 */

/**
 * Format an ISO date string to DD MMM YYYY
 * e.g. "2024-07-22" → "22 Jul 2024"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format an ISO datetime string to HH:MM AM/PM
 * e.g. "2024-07-22T09:15:00.000Z" → "9:15 AM"
 */
export function formatTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format hours as "8h 30m"
 */
export function formatHours(hours) {
  if (hours == null || hours === 0) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Get a greeting based on current time.
 * @returns {"Good morning" | "Good afternoon" | "Good evening"}
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Return today's date as YYYY-MM-DD
 */
export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Format a currency value in INR.
 * e.g. 67000 → "₹67,000"
 */
export function formatCurrency(amount) {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate the number of days between two date strings (inclusive).
 */
export function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
}
