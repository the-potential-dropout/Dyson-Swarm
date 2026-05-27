# Website Architecture

This folder is the public website for the Dyson Swarm project.

## Entry Points

- `index.html` — landing page and launch hub
- `simulators/dyson-swarm-simulator-v2.html` — modular V2 simulator
- `simulators/dyson-swarm-simulator-v2-standalone.html` — complete V2 single-file build
- `simulators/dyson-swarm-simulator-v1.html` — V1 archive

## Architecture

- `css/` — shared interface, HUD, calculator, and landing-page styling
- `js/simulator-v2.js` — V2 runtime controller
- `js/v2/` — math, orbital mechanics, and rendering modules
- `shaders/` — GLSL source references for future rendering upgrades
- `assets/audio/`, `assets/images/`, `assets/models/` — future media folders

## Deployment

GitHub Pages is configured through `.github/workflows/deploy-pages.yml` to publish the `website/` folder from the `main` branch.

## Standing Rule

Every simulator release keeps both a modular website build and a complete single-file HTML build.
