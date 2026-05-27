# Dyson Swarm Simulator V2 Context

V2 converts the prototype from a single-file experiment into a maintainable website architecture while preserving a complete standalone HTML build.

## What V2 Adds

- Landing page at `website/index.html`
- Modular simulator at `website/simulators/dyson-swarm-simulator-v2.html`
- Standalone V2 build at `website/simulators/dyson-swarm-simulator-v2-standalone.html`
- Shared CSS in `website/css/main.css`
- JavaScript modules in `website/js/v2/`
- Shader source references in `website/shaders/v2/`
- Audio, image, and model folders for future assets
- GitHub Pages deployment workflow

## Physics Implemented

- Circular orbit velocity: `v = sqrt(mu / r)`
- Orbital period: `T = 2*pi*sqrt(r^3 / mu)`
- Mean motion: `n = sqrt(mu / r^3)`
- Solar flux falloff: `I = 1361 * L / r^2`
- Shell coverage: `collector area / (4*pi*r^2)`
- Useful power: `coverage * stellar luminosity * efficiency`
- Equilibrium temperature scaling: `278.5 K * L^(1/4) / sqrt(r)`
- Dry mass: `collector area * areal density`

Visual collectors use proxy markers because realistic collector counts can range from millions to trillions.

## Known Limitations

- No collision-avoidance simulation yet
- No persistent scenario save/load yet
- Thermal model is a simple equilibrium estimate
- Beaming is visual rather than a full transmission-chain model
