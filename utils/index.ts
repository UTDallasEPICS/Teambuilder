// Returns a string where only the first letter is capitalized.
export const capitalizeFirst = (string: string | null) => {
  if (!string) return null;
  return string[0].toUpperCase() + string.substring(1).toLowerCase();
}