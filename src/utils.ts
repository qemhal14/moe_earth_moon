
import { Vector3D } from './types';
import { G } from './constants';

export const calculateDistance3D = (p1: Vector3D, p2: Vector3D): number => {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) + 
    Math.pow(p2.y - p1.y, 2) + 
    Math.pow(p2.z - p1.z, 2)
  );
};

export const calculateGravitationalForce = (m1: number, m2: number, distance: number): number => {
  if (distance < 1) return 0;
  return (G * m1 * m2) / Math.pow(distance, 2);
};

export const formatScientific = (num: number): string => {
  if (num < 0.001 && num > 0) return num.toExponential(2);
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
