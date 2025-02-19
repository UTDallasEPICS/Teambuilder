export const getRandomElement = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
}