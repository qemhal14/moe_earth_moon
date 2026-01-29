
import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Text, Billboard, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Paper, Typography, Stack, Divider, Fade } from '@mui/material';
import { SimState } from '../types';
import { COLORS, EARTH_COLOR, MOON_COLOR } from '../constants';
import { calculateGravitationalForce, formatScientific } from '../utils';

interface Props {
  state: SimState;
  onUpdate: (updates: Partial<SimState>) => void;
}

interface HUDRefs {
  forceAction: React.RefObject<HTMLDivElement>;
  forceReaction: React.RefObject<HTMLDivElement>;
}

// Simplified Arrow component that handles only geometry and glow
const ForceVector: React.FC<{
  color: string;
  magnitude: number;
  shaftLength: number;
  headLength: number;
}> = ({ color, magnitude, shaftLength, headLength }) => {
  const normMag = Math.min(Math.max(magnitude / 5, 0.5), 5);
  const thickness = 0.2 + (normMag * 0.08);
  const glowIntensity = Math.min(normMag * 0.4, 2);

  const containerRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (containerRef.current) {
      // Animate subtle "pull" pulse
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.03;
      containerRef.current.scale.set(pulse, 1, pulse);
    }
  });

  return (
    <group ref={containerRef}>
      <mesh name="shaft" position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness, shaftLength, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh name="head" position={[0, shaftLength + headLength / 2, 0]}>
        <coneGeometry args={[thickness * 2.5, headLength, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

const SceneContent: React.FC<Props & { hudRefs: HUDRefs }> = ({ state, hudRefs, onUpdate }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const orbitAngleRef = useRef(0);
  const feedbackTimerRef = useRef<number | null>(null);

  const arrowAtEarthRef = useRef<THREE.Group>(null);
  const arrowAtMoonRef = useRef<THREE.Group>(null);

  // Load textures using high-quality public domain images
  const [earthTexture, moonTexture] = useTexture([
    '/textures/earth.jpg',
    '/textures/moon.jpg'
  ]);

  const earthVisualRadius = useMemo(() => Math.pow(state.earth.mass / 8, 0.4) * 3.5, [state.earth.mass]);
  const moonVisualRadius = useMemo(() => Math.pow(state.moon.mass / 2, 0.4) * 1.5, [state.moon.mass]);

  useFrame((_, delta) => {
    if (!earthRef.current || !moonRef.current) return;

    earthRef.current.rotation.y += delta * 0.1;
    moonRef.current.rotation.y += delta * 0.15;

    if (state.isOrbiting) {
      orbitAngleRef.current += delta * 0.5;
    }

    const mPos = new THREE.Vector3(
      state.earth.position.x + Math.cos(orbitAngleRef.current) * state.orbitRadius,
      state.earth.position.y,
      state.earth.position.z + Math.sin(orbitAngleRef.current) * state.orbitRadius
    );
    moonRef.current.position.copy(mPos);

    const earthPos = earthRef.current.position;
    const moonPos = moonRef.current.position;
    const dist = earthPos.distanceTo(moonPos);
    const force = calculateGravitationalForce(state.earth.mass, state.moon.mass, dist);

    if (Math.abs(force - state.lastForce) > 0.05 && !state.feedbackVisible) {
      const isIncreasing = force > state.lastForce;
      onUpdate({
        lastForce: force,
        feedbackText: isIncreasing ? "Force Increased ↑" : "Force Decreased ↓",
        feedbackVisible: true
      });
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = window.setTimeout(() => {
        onUpdate({ feedbackVisible: false });
      }, 1500);
    }

    const formattedForce = formatScientific(force);
    if (hudRefs.forceAction.current) hudRefs.forceAction.current.innerText = formattedForce;
    if (hudRefs.forceReaction.current) hudRefs.forceReaction.current.innerText = formattedForce;

    const arrowLengthFactor = Math.min(Math.max(force * 0.4, 5), 25);
    const headLen = 1.5;
    const shaftLen = Math.max(0.1, arrowLengthFactor - headLen);

    const updateArrow = (group: THREE.Group | null, base: THREE.Vector3, target: THREE.Vector3, rad: number) => {
      if (!group) return;
      const dir = new THREE.Vector3().subVectors(target, base).normalize();
      group.position.copy(base.clone().add(dir.clone().multiplyScalar(rad + 0.2)));
      group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    };

    updateArrow(arrowAtEarthRef.current, earthPos, moonPos, earthVisualRadius);
    updateArrow(arrowAtMoonRef.current, moonPos, earthPos, moonVisualRadius);
  });

  const forceMagnitude = state.lastForce;
  const arrowLength = Math.min(Math.max(forceMagnitude * 0.4, 5), 25);
  const headLen = 1.5;
  const shaftLen = Math.max(0.1, arrowLength - headLen);

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[100, 100, 100]} intensity={2.5} />
      <pointLight position={[-50, 0, -50]} intensity={1.5} color="#ffffff" />
      <Stars radius={250} depth={70} count={7000} factor={6} saturation={0} fade speed={2} />

      <mesh ref={earthRef} position={[state.earth.position.x, state.earth.position.y, state.earth.position.z]}>
        <sphereGeometry args={[earthVisualRadius, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.7} metalness={0.1} />
      </mesh>

      <mesh ref={moonRef}>
        <sphereGeometry args={[moonVisualRadius, 48, 48]} />
        <meshStandardMaterial map={moonTexture} roughness={0.9} metalness={0.0} />
      </mesh>

      <group ref={arrowAtEarthRef}>
        <ForceVector color={COLORS.forceMoon} magnitude={forceMagnitude} shaftLength={shaftLen} headLength={headLen} />
        {/* Force on Moon text attached to arrow from Earth */}
        <Billboard position={[0, shaftLen + headLen + 1.5, 0]}>
          <Text fontSize={1.2} color="white" outlineWidth={0.08} outlineColor="#000000">Force on Moon</Text>
        </Billboard>
      </group>

      <group ref={arrowAtMoonRef}>
        <ForceVector color={COLORS.forceEarth} magnitude={forceMagnitude} shaftLength={shaftLen} headLength={headLen} />
        {/* Force on Earth text attached to arrow from Moon */}
        <Billboard position={[0, shaftLen + headLen + 1.5, 0]}>
          <Text fontSize={1.2} color="white" outlineWidth={0.08} outlineColor="#000000">Force on Earth</Text>
        </Billboard>
      </group>

      {state.showGrid && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[state.earth.position.x, state.earth.position.y, state.earth.position.z]}>
          <ringGeometry args={[state.orbitRadius - 0.1, state.orbitRadius + 0.1, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      <OrbitControls enableDamping dampingFactor={0.05} minDistance={10} maxDistance={200} />
    </>
  );
};

const SimulationCanvas: React.FC<Props> = ({ state, onUpdate }) => {
  const forceActionRef = useRef<HTMLDivElement>(null);
  const forceReactionRef = useRef<HTMLDivElement>(null);
  const ratioValueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ratioValueRef.current) {
      ratioValueRef.current.innerText = (state.earth.mass / state.moon.mass).toFixed(1);
    }
  }, [state.earth.mass, state.moon.mass]);

  return (
    <Box sx={{ flex: 1, position: 'relative', bgcolor: '#010208' }}>
      <Canvas shadows camera={{ position: [0, 70, 110], fov: 45 }} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 70, 110]} />
        <Suspense fallback={null}>
          <SceneContent state={state} onUpdate={onUpdate} hudRefs={{ forceAction: forceActionRef, forceReaction: forceReactionRef }} />
        </Suspense>
      </Canvas>

      <Box sx={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}>
        <Fade in={state.feedbackVisible} timeout={500}>
          <Typography variant="h3" sx={{
            fontWeight: 900,
            color: state.feedbackText.includes('Increased') ? '#22c55e' : '#ef4444',
            textShadow: '0 0 20px rgba(0,0,0,1)',
            letterSpacing: 2
          }}>
            {state.feedbackText}
          </Typography>
        </Fade>
      </Box>

      <Paper elevation={10} sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        p: 1.5,
        minWidth: 200,
        bgcolor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        pointerEvents: 'none'
      } as any}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main', animation: 'pulse 2s infinite' }} />
          <Typography variant="overline" sx={{ fontSize: '0.7rem', fontWeight: 900, color: 'primary.main', letterSpacing: 1.2 }}>
            Telemetry Data
          </Typography>
        </Stack>

        <Stack spacing={1.5}>
          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 800, display: 'block', mb: 0.2 }}>
              FORCE ON MOON (F₂)
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h5" ref={forceActionRef} sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'secondary.main', lineHeight: 1 }}>
                --
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>N</Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 800, display: 'block', mb: 0.2 }}>
              FORCE ON EARTH (F₁)
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h5" ref={forceReactionRef} sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#22c55e', lineHeight: 1 }}>
                --
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>N</Typography>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />

          <Box>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.2 }}>
              MASS RATIO (m₁:m₂)
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h5" ref={ratioValueRef} sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.light', lineHeight: 1 }}>
                --
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>: 1</Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        px: 4,
        py: 1.5,
        borderRadius: 10,
        bgcolor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
      } as any}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <i className="fas fa-mouse-pointer" style={{ fontSize: 12, color: '#3b82f6' }}></i>
            <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'text.primary', letterSpacing: 1 }}>ROTATE</Typography>
          </Stack>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <i className="fas fa-arrows-alt" style={{ fontSize: 12, color: '#22c55e' }}></i>
            <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'text.primary', letterSpacing: 1 }}>PAN</Typography>
          </Stack>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <i className="fas fa-mouse" style={{ fontSize: 12, color: '#eab308' }}></i>
            <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'text.primary', letterSpacing: 1 }}>ZOOM</Typography>
          </Stack>
        </Stack>
      </Paper>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </Box>
  );
};

export default SimulationCanvas;
