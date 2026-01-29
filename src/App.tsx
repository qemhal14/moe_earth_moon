
import React, { useState, useCallback, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { SimState } from './types';
import Sidebar from './components/Sidebar';
import SimulationCanvas from './components/SimulationCanvas';
import { INITIAL_EARTH_MASS, INITIAL_MOON_MASS, EARTH_COLOR, MOON_COLOR } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<SimState>({
    earth: {
      id: 'earth',
      name: 'Earth',
      mass: INITIAL_EARTH_MASS,
      position: { x: 0, y: 0, z: 0 },
      radius: 3,
      color: EARTH_COLOR,
    },
    moon: {
      id: 'moon',
      name: 'Moon',
      mass: INITIAL_MOON_MASS,
      position: { x: 15, y: 0, z: 0 },
      radius: 1,
      color: MOON_COLOR,
    },
    isOrbiting: true,
    orbitSpeed: 1.0,
    orbitRadius: 15,
    showValues: true,
    showGrid: true,
    cameraView: 'perspective',
    isScientificMode: false,
    isLearningMode: false,
    learningStep: 0,
    lastForce: 0,
    feedbackText: '',
    feedbackVisible: false,
  });

  const handleUpdate = useCallback((updates: Partial<SimState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#3b82f6' },
      secondary: { main: '#ef4444' },
      background: {
        default: '#000000',
        paper: '#0f172a',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiSlider: {
        styleOverrides: {
          root: { height: 4 },
          thumb: { width: 16, height: 16 },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <Sidebar
          state={state}
          onUpdate={handleUpdate}
        />
        <SimulationCanvas
          state={state}
          onUpdate={handleUpdate}
        />
      </Box>
    </ThemeProvider>
  );
};

export default App;
