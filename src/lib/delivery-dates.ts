// Utility functions for delivery date management

export type DeliveryDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DeliverySettings {
  deliveryDays: DeliveryDay[];
  weeksInAdvance: number;
  cutoffHours: number;
  isActive: boolean;
}

export interface DeliveryDate {
  date: Date;
  dayName: string;
  formatted: string;
  isAvailable: boolean;
}

const dayNames: { [key in DeliveryDay]: string } = {
  monday: 'Hétfő',
  tuesday: 'Kedd',
  wednesday: 'Szerda',
  thursday: 'Csütörtök',
  friday: 'Péntek',
  saturday: 'Szombat',
  sunday: 'Vasárnap'
};

const dayIndexes: { [key in DeliveryDay]: number } = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

export function getAvailableDeliveryDates(settings: DeliverySettings): DeliveryDate[] {
  const dates: DeliveryDate[] = [];
  const today = new Date();
  const cutoffTime = new Date(today.getTime() + (settings.cutoffHours * 60 * 60 * 1000));
  
  // Generate dates for the next X weeks
  for (let week = 0; week < settings.weeksInAdvance; week++) {
    for (const dayName of settings.deliveryDays) {
      const dayIndex = dayIndexes[dayName];
      const date = getNextDayOfWeek(today, dayIndex, week);
      
      // Check if this date is still available (after cutoff time)
      const isAvailable = date.getTime() > cutoffTime.getTime();
      
      dates.push({
        date,
        dayName: dayNames[dayName],
        formatted: formatDate(date),
        isAvailable
      });
    }
  }
  
  return dates.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getNextDayOfWeek(startDate: Date, targetDayIndex: number, weeksOffset: number = 0): Date {
  const date = new Date(startDate);
  const currentDay = date.getDay();
  
  // Calculate days until target day
  let daysUntilTarget = targetDayIndex - currentDay;
  if (daysUntilTarget <= 0) {
    daysUntilTarget += 7; // Next week
  }
  
  // Add weeks offset
  daysUntilTarget += (weeksOffset * 7);
  
  date.setDate(date.getDate() + daysUntilTarget);
  return date;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('hu-HU', {
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatDateWithDay(date: Date): string {
  return new Intl.DateTimeFormat('hu-HU', {
    weekday: 'long',
    month: 'long', 
    day: 'numeric'
  }).format(date);
}

export function getQuickSelectDates(settings: DeliverySettings, type: 'weekly' | 'biweekly'): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  
  if (type === 'weekly') {
    // Heti 1x: Next 4 Mondays
    for (let week = 0; week < 4; week++) {
      const monday = getNextDayOfWeek(today, dayIndexes.monday, week);
      dates.push(monday);
    }
  } else {
    // Heti 2x: Next 4 weeks (Monday + Wednesday)
    for (let week = 0; week < 4; week++) {
      const monday = getNextDayOfWeek(today, dayIndexes.monday, week);
      const wednesday = getNextDayOfWeek(today, dayIndexes.wednesday, week);
      dates.push(monday, wednesday);
    }
  }
  
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

export function getNearestAvailableDate(availableDates: DeliveryDate[]): Date | null {
  const available = availableDates.filter(d => d.isAvailable);
  return available.length > 0 ? available[0].date : null;
}

