
import React from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  Divider,
  Stack,
  Paper,
  Switch,
  FormControlLabel,
  Tooltip,
  Alert,
  Fade,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import { SimState } from '../types';
import { G } from '../constants';
import { calculateGravitationalForce } from '../utils';

interface Props {
  state: SimState;
  onUpdate: (updates: Partial<SimState>) => void;
}

const Sidebar: React.FC<Props> = ({ state, onUpdate }) => {
  const currentForce = calculateGravitationalForce(state.earth.mass, state.moon.mass, state.orbitRadius);

  const steps = [
    { title: "Step 1: Variables", desc: "First, let's identify the masses and distance involved." },
    { title: "Step 2: Formula", desc: "We apply Newton's Law of Gravitation formula." },
    { title: "Step 3: Calculation", desc: "Plugin the values to see the resulting force." },
    { title: "Step 4: Meaning", desc: "This force pulls both bodies together equally." }
  ];

  const nextStep = () => {
    if (state.learningStep < steps.length - 1) {
      onUpdate({ learningStep: state.learningStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.learningStep > 0) {
      onUpdate({ learningStep: state.learningStep - 1 });
    }
  };

  return (
    <Box sx={{
      width: 320,
      height: '100%',
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      overflowY: 'auto',
      zIndex: 10
    } as any}>
      {/* Header */}
      <Box sx={{ p: 4, pb: 2, background: 'linear-gradient(to bottom, #1e293b, #0f172a)' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <i className="fas fa-rocket" style={{ color: 'white' }}></i>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            NewtonLab 3D
          </Typography>
        </Stack>
        {/* <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 900, letterSpacing: 2 }}>
          Newtonian Mechanics */}
        {/* </Typography> */}
        <Typography variant="body2" sx={{ color: 'primary.light', fontWeight: 700, mt: 1, lineHeight: 1.2 }}>
          Example 2: Non-contact force between the Earth and the Moon
        </Typography>
      </Box>

      {/* Mode Toggles */}
      <Stack direction="row" spacing={1} sx={{ px: 2, mb: 2 }}>
        <Button
          fullWidth
          size="small"
          variant={state.isLearningMode ? "contained" : "outlined"}
          onClick={() => onUpdate({ isLearningMode: !state.isLearningMode, learningStep: 0 })}
          startIcon={<i className="fas fa-book-open"></i>}
          sx={{ py: 1.2 }}
        >
          {state.isLearningMode ? "Learning: ON" : "Learning Mode"}
        </Button>
      </Stack>

      {/* Learning Mode Panel */}
      <Fade in={state.isLearningMode}>
        <Box sx={{ px: 2, mb: 2, display: state.isLearningMode ? 'block' : 'none' }}>
          <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="caption" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>
              GUIDED PHYSICS MODE
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {steps[state.learningStep].title}
            </Typography>
            <Typography variant="body2" sx={{ display: 'block', mb: 2, opacity: 0.9 }}>
              {steps[state.learningStep].desc}
            </Typography>

            <Stack direction="row" justifyContent="space-between">
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={prevStep}
                disabled={state.learningStep === 0}
                sx={{ minWidth: 0, opacity: state.learningStep === 0 ? 0.3 : 1 }}
              >
                ◀ Prev
              </Button>
              <Typography variant="caption" sx={{ pt: 1, fontWeight: 'bold' }}>{state.learningStep + 1} / {steps.length}</Typography>
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={nextStep}
                disabled={state.learningStep === steps.length - 1}
                sx={{ minWidth: 0, opacity: state.learningStep === steps.length - 1 ? 0.3 : 1 }}
              >
                Next ▶
              </Button>
            </Stack>
          </Paper>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => onUpdate({ showTextbook: true })}
            startIcon={<i className="fas fa-file-alt"></i>}
            sx={{ mt: 1, py: 1, fontWeight: 800, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
          >
            Check Textbook Explanation
          </Button>
        </Box>
      </Fade>

      {/* Textbook Image Dialog */}
      <Dialog
        open={state.showTextbook}
        onClose={() => onUpdate({ showTextbook: false })}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: 'relative', bgcolor: '#0f172a' }}>
          <IconButton
            onClick={() => onUpdate({ showTextbook: false })}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white', zIndex: 1, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
          >
            <i className="fas fa-times"></i>
          </IconButton>
          <DialogContent sx={{ p: 0, display: 'flex' }}>
            <img
              src="/images/textbook_example_earth_moon.jpg"
              alt="Textbook Explanation"
              style={{ width: '50%', height: 'auto', display: 'block', margin: 'auto' }}
            />
          </DialogContent>
        </Box>
      </Dialog>

      <Box sx={{ px: 2, mb: 2 }}>
        <Alert severity="warning" variant="outlined" sx={{
          fontSize: '0.75rem',
          py: 0.5,
          bgcolor: 'rgba(234, 179, 8, 0.05)',
          borderColor: 'rgba(234, 179, 8, 0.2)',
          '& .MuiAlert-icon': { fontSize: '1rem', mt: 0.2 }
        }}>
          ⚠️ Values are in simulation units.
        </Alert>
      </Box>

      <Stack spacing={3} sx={{ p: 2.5, pt: 0, flex: 1, opacity: state.isLearningMode ? 0.7 : 1 }}>

        {/* Gravity Formula Section - ENHANCED READABILITY */}
        <Paper sx={{
          p: 3,
          bgcolor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: 2,
          outline: state.isLearningMode && state.learningStep >= 1 ? '3px solid #3b82f6' : 'none'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.light', fontSize: '0.8rem' }}>
              GRAVITY EQUATION
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  disabled={state.isLearningMode}
                  checked={state.isScientificMode || (state.isLearningMode && state.learningStep >= 2)}
                  onChange={(e) => onUpdate({ isScientificMode: e.target.checked })}
                />
              }
              label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 800 }}>MATH</Typography>}
              labelPlacement="start"
              sx={{ m: 0 }}
            />
          </Stack>

          <Box sx={{
            textAlign: 'center',
            py: 2,
            bgcolor: 'rgba(0,0,0,0.2)',
            borderRadius: 1,
            fontFamily: '"Times New Roman", serif',
            fontStyle: 'italic',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {(!state.isScientificMode && !(state.isLearningMode && state.learningStep >= 1)) ? (
              <>
                <Typography variant="h4" sx={{ color: 'text.primary', letterSpacing: 1 }}>
                  F ∝ (m₁ · m₂) / r²
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'normal', color: 'text.secondary', mt: 1 }}>
                  Force ∝ Masses / Distance²
                </Typography>
              </>
            ) : (
              <Stack spacing={1.5} alignItems="center">
                <Typography variant="h5" sx={{ color: 'text.primary', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1, fontWeight: 500 }}>
                  F = G · (m₁ · m₂) / r²
                </Typography>
                {(state.isScientificMode || state.learningStep >= 2) && (
                  <>
                    <Typography sx={{ fontSize: '0.85rem', fontFamily: 'monospace', fontStyle: 'normal', color: 'primary.light' }}>
                      F = {G} · ({state.earth.mass.toFixed(1)} · {state.moon.mass.toFixed(1)}) / {state.orbitRadius.toFixed(1)}²
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontStyle: 'normal', color: 'secondary.light' }}>
                      F = {currentForce.toFixed(2)} N
                    </Typography>
                  </>
                )}
              </Stack>
            )}
          </Box>
        </Paper>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Dynamic Controls */}
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary' }}>ORBITAL RADIUS (r)</Typography>
              {state.isLearningMode && state.learningStep === 0 && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6' }} />}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Slider
                disabled={state.isLearningMode}
                min={8}
                max={35}
                step={0.5}
                value={state.orbitRadius}
                onChange={(_, val) => onUpdate({ orbitRadius: val as number })}
              />
              <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 50, fontWeight: 'bold' }}>{state.orbitRadius.toFixed(1)}</Typography>
            </Stack>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary' }}>EARTH MASS (m₁)</Typography>
              {state.isLearningMode && state.learningStep === 0 && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6' }} />}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Slider
                disabled={state.isLearningMode}
                min={1}
                max={10}
                step={0.1}
                value={state.earth.mass}
                onChange={(_, val) => onUpdate({ earth: { ...state.earth, mass: val as number } })}
              />
              <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 50, fontWeight: 'bold' }}>{state.earth.mass.toFixed(1)}</Typography>
            </Stack>
          </Box>

          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary' }}>MOON MASS (m₂)</Typography>
              {state.isLearningMode && state.learningStep === 0 && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6' }} />}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Slider
                disabled={state.isLearningMode}
                min={1}
                max={10}
                step={0.1}
                value={state.moon.mass}
                onChange={(_, val) => onUpdate({ moon: { ...state.moon, mass: val as number } })}
              />
              <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 50, fontWeight: 'bold' }}>{state.moon.mass.toFixed(1)}</Typography>
            </Stack>
          </Box>
        </Box>

        <Button
          fullWidth
          disabled={state.isLearningMode}
          variant={state.isOrbiting ? "outlined" : "contained"}
          color={state.isOrbiting ? "secondary" : "primary"}
          onClick={() => onUpdate({ isOrbiting: !state.isOrbiting })}
          startIcon={<i className={`fas ${state.isOrbiting ? 'fa-pause' : 'fa-play'}`}></i>}
          sx={{ py: 1.5, fontSize: '1rem' }}
        >
          {state.isOrbiting ? 'Pause Orbit' : 'Resume Orbit'}
        </Button>
      </Stack>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(15, 23, 42, 0.8)' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block', textAlign: 'center', fontSize: '0.75rem' }}>
          Visualizing Physics for Students
        </Typography>
      </Box>
    </Box >
  );
};

export default Sidebar;
