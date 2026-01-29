
export const G = 100; // Increased to compensate for lower mass values (1-10 range)
export const MIN_MASS = 1;
export const MAX_MASS = 10;
export const INITIAL_EARTH_MASS = 8;
export const INITIAL_MOON_MASS = 2;

export const EARTH_COLOR = '#1e40af'; // Deep blue
export const MOON_COLOR = '#94a3b8'; // Slate gray

export const COLORS = {
  forceEarth: '#ef4444', // Red-500
  forceMoon: '#22c55e',  // Green-500
  distance: '#eab308',  // Yellow-500
};

// Texture URLs - Using a very stable CDN (jsDelivr) with specific versioning
export const TEXTURES = {
  earth: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r169/examples/textures/planets/earth_daymap.jpg',
  moon: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r169/examples/textures/planets/moon_1024.jpg'
};
