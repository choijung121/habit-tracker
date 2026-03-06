import { GRID_DAYS, SHADE_SCALE } from "../constants";

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function shiftDate(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function buildCalendarDays(anchorDate: Date) {
  const end = new Date(anchorDate);
  end.setHours(0, 0, 0, 0);

  const start = shiftDate(end, -(GRID_DAYS - 1));
  const alignedStart = shiftDate(start, -start.getDay());

  return Array.from({ length: GRID_DAYS }, (_, index) => shiftDate(alignedStart, index));
}

export function getShadeColor(count: number) {
  if (count <= 0) return SHADE_SCALE[0];
  if (count === 1) return SHADE_SCALE[1];
  if (count === 2) return SHADE_SCALE[2];
  if (count === 3) return SHADE_SCALE[3];
  return SHADE_SCALE[4];
}
