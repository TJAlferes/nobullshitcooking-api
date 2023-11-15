export function format(data: any[]) {
  return data.flatMap(row => Object.values(row));
}
