# Dyson Swarm

A public website, simulator, asset library, and civilization-scale blueprint for a Dyson Swarm.

This project treats the Dyson Swarm as both:

1. a cinematic interactive simulation/game-like experience, and
2. a serious open blueprint for humanity-scale solar infrastructure if the right resources, investors, collaborators, researchers, and engineers were available.

The project is fictional in the sense that we are not claiming active deployment today. It is serious in the sense that every fictional system should be backed by research, physics, engineering logic, economics, supply-chain thinking, logistics, and clear assumptions.

## Current Public Build

The active website build lives in `website/`.

Primary entry points:

- `website/index.html` — landing page
- `website/simulators/dyson-swarm-simulator-v2.html` — modular V2 simulator
- `website/simulators/dyson-swarm-simulator-v2-standalone.html` — full standalone V2 HTML build
- `website/simulators/dyson-swarm-simulator-v1.html` — archived V1 build

GitHub Pages deployment is configured through `.github/workflows/deploy-pages.yml` and publishes the `website/` folder.

## Project Principle

If it feels like science fiction, make it visual.

If it makes a technical claim, ground it in research.

If it describes deployment, expose the assumptions.

If it asks for investment, show the roadmap, risks, and resource requirements.

Every simulator version should keep both a modular implementation and a full standalone HTML build.

## Repository Areas

- `website/` — main website, UI, tabs, interactive app code
- `assets/` — images, videos, 3D files, diagrams, branding, concept art
- `blueprint/` — integrated deployment blueprint and system-level plan
- `knowledge-tech-research/` — physics, technology, research notes, references
- `engineering-design/` — system architecture and subsystem design
- `simulations/` — calculators, orbital models, energy models, visualizers
- `business/` — business plan, investors, market logic, funding strategy
- `supply-chain-logistics/` — materials, sourcing, launch, manufacturing, transport
- `media-community/` — Discord onboarding, content, public education, launch copy
- `meta/` — philosophy, ethics, civilization-scale framing, lore

## Current Stage

Phase 1: website simulator foundation.

The immediate goal is to evolve the V2 simulator into a credible public platform with stronger physics, clearer assumptions, and investor/contributor onboarding.
