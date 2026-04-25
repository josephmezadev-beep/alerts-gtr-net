import { toZonedTime, format } from 'date-fns-tz';
import { differenceInMinutes } from 'date-fns';

const PERU_TIMEZONE = 'America/Lima';

export function convertToPeruTime(utcDateString: string): Date {
  const utcDate = new Date(utcDateString);
  return toZonedTime(utcDate, PERU_TIMEZONE);
}

export function getCurrentPeruTime(): Date {
  return toZonedTime(new Date(), PERU_TIMEZONE);
}

export function getElapsedMinutes(modifiedDateString: string): number {
  const modifiedDate = new Date(modifiedDateString);
  const currentTime = new Date();
  return differenceInMinutes(currentTime, modifiedDate);
}

export function formatPeruTime(date: Date): string {
  return format(date, 'HH:mm:ss', { timeZone: PERU_TIMEZONE });
}

export function formatElapsedTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}min`;
}