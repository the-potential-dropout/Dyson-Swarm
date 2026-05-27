# Next Version Plan

## V3 Priorities

### Simulation Realism

- Expose true anomaly, mean anomaly, and eccentric anomaly controls in the UI
- Add collision risk scoring
- Add station-keeping delta-v estimates
- Add radiation-pressure perturbation estimates
- Add thermal modeling with albedo, emissivity, and heat-rejection assumptions

### Engineering Calculator

- Launch mass and launch count estimator
- Manufacturing throughput calculator
- Materials budget by collector architecture
- Energy transmission efficiency chain
- Receiver aperture sizing
- Scenario save/load as JSON

### Rendering

- More complete render-engine split
- GLSL file loading with inline fallbacks
- Volumetric corona and improved star shading
- Collector mesh impostors instead of point-only proxies
- Cinematic tour camera
- Planet and asteroid-belt context layers

### Product / Website

- Investor page
- Contributor onboarding page
- Research bibliography page
- Scenario gallery
- Automated standalone-build generation script

## Standing Rule

Every release must ship both a modular website build and a complete standalone HTML file.
