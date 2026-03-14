import { GRID_DAYS } from "../constants";

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

export function getShadeColor(count: number, shadeScale: string[]) {
  if (shadeScale.length === 0) return "#FFFFFF";
  if (count <= 0) return shadeScale[0] ?? "#FFFFFF";
  if (count === 1) return shadeScale[1] ?? shadeScale[0] ?? "#FFFFFF";
  if (count === 2) return shadeScale[2] ?? shadeScale[shadeScale.length - 1] ?? "#FFFFFF";
  if (count === 3) return shadeScale[3] ?? shadeScale[shadeScale.length - 1] ?? "#FFFFFF";
  return shadeScale[4] ?? shadeScale[shadeScale.length - 1] ?? "#FFFFFF";
}
