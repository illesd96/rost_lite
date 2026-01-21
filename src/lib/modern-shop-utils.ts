export const formatCurrency = (amount: number): string => {
  // Manually format with regex to enforce thousand separators (non-breaking spaces) for ALL numbers
  // This fixes the issue where browsers' Intl.NumberFormat skips grouping for 4-digit numbers (e.g. 5700 vs 5 700)
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") + "\u00A0Ft";
};

export const getMondayDate = (startDate: Date, weeksToAdd: number): Date => {
  const d = new Date(startDate);
  d.setDate(startDate.getDate() + (weeksToAdd * 7));
  return d;
};

// Handles the logic where index < 100 is Monday, index >= 100 is Tuesday (index - 100)
export const getDateFromIndex = (startDate: Date, index: number): Date => {
  const isTuesday = index >= 100;
  const weekIndex = isTuesday ? index - 100 : index;
  const date = getMondayDate(startDate, weekIndex);
  
  if (isTuesday) {
    // Add 1 day for Tuesday
    date.setDate(date.getDate() + 1);
  }
  return date;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatTaxId = (value: string): string => {
  const clean = value.replace(/[^0-9]/g, '');
  if (clean.length > 8) {
    if (clean.length > 9) {
      return `${clean.slice(0, 8)}-${clean.slice(8, 9)}-${clean.slice(9, 11)}`;
    }
    return `${clean.slice(0, 8)}-${clean.slice(8, 9)}`;
  }
  return clean;
};

export const formatPhone = (value: string): string => {
  if (!value) return '+36';
  if (!value.startsWith('+36')) return '+36';
  const clean = value.substring(3).replace(/[^0-9]/g, '');
  return `+36${clean.substring(0, 9)}`;
};


