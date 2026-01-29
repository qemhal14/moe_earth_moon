
import { ThreeElements } from '@react-three/fiber';

// Fix for React Three Fiber intrinsic elements in TypeScript
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface CelestialBodyState {
  id: 'earth' | 'moon';
  mass: number;
  position: Vector3D;
  radius: number;
  color: string;
  name: string;
}

export interface SimState {
  earth: CelestialBodyState;
  moon: CelestialBodyState;
  isOrbiting: boolean;
  orbitSpeed: number;
  orbitRadius: number;
  showValues: boolean;
  showGrid: boolean;
  cameraView: 'perspective' | 'top' | 'side';
  isScientificMode: boolean;
  // Learning Mode State
  isLearningMode: boolean;
  learningStep: number;
  // Feedback State
  lastForce: number;
  feedbackText: string;
  feedbackVisible: boolean;
}
