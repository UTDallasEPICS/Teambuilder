export const capitalize = (string: string | null) => {
  if (!string) return null;
  return string[0].toUpperCase() + string.substring(1);
}