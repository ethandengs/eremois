export const colors = {
  red: '#EF4136',
  green: '#2BB673',
  blue: '#1B75BC',
  yellow: '#F7941D',
  darkBlue: '#1B1E33',
  pink: '#D53A75',
  darkRose: '#5D323A',
} as const;

// Type for the colors object
export type ColorKeys = keyof typeof colors;

// Function to get a color by key with type safety
export const getColor = (key: ColorKeys): string => colors[key];

export default colors; 