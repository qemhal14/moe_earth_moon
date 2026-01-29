# NewtonLab 3D: Earth-Moon Gravity Simulation

A high-fidelity 3D simulation of gravitational forces between the Earth and the Moon, built with React, Three.js, and Material-UI.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20.5 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/qemhal14/moe_earth_moon.git
   cd moe_earth_moon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🛠️ Development

To start the local development server:

```bash
npm start
```

This will launch the application using **Rsbuild**. Once started, you can view the simulation at:
`http://localhost:8000/`

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist/` directory, ready for deployment.

## 🔭 Features

- **Real-time Physics**: Interactive simulation of Newton's Law of Universal Gravitation.
- **3D Visualization**: High-quality textures and smooth animations using React Three Fiber.
- **Telemetry Dashboard**: Real-time data on gravitational force and mass ratios.
- **Learning Mode**: Guided tour of physics concepts for students.
- **Responsive UI**: Sleek, modern interface powered by Material-UI (MUI).

## 🧮 How to Use

- **Rotate**: Left-click and drag to rotate the camera.
- **Pan**: Right-click and drag to move the view.
- **Zoom**: Use the mouse wheel to zoom in and out.
- **Controls**: Use the sidebar to adjust masses and orbital radius in real-time to see how the force vectors change.
