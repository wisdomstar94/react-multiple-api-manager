export function isNumber(value: any): value is number {
  if (typeof value !== 'number') return false;
  if (isNaN(value)) return false;
  return true;
}