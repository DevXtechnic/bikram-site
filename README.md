# Bikram Gole - The Aura Website

Welcome to my personal website, where I mix space vibes, hacker energy, and controlled chaos.
If it looks dramatic, that is intentional.

Live site: `https://devxtechnic.github.io/bikram-site/`

## Why this exists

I wanted a website that feels like me:

- Dark, interactive, and slightly unhinged (in a good way)
- Personal, not corporate
- Fun enough that people remember it
- Technical enough that devs nod in approval

## What is inside

- Multi-page setup: `Home`, `About`, `Contact`
- Theme engine with many styles (including Liquid Glass and chaos modes)
- Persistent theme across page switches
- Mini terminal with commands
- Persona quiz game
- Live GitHub repo cards from `github.com/DevXtechnic`
- Easter eggs, pulse effects, and vibe-heavy UI interactions

## Tech stack (aka my weapons)

- HTML
- CSS
- Vanilla JavaScript
- GitHub Pages (hosting)
- GitHub API (repo data)

## Project map

- `index.html` -> main landing zone
- `about.html` -> lore, identity, interests
- `contact.html` -> direct channels
- `styles.css` -> all themes + UI styling
- `script.js` -> interactions, terminal logic, quiz logic, effects

## Run locally

```bash
cd bikram-site
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes from me

- `.nojekyll` is here so GitHub Pages serves files directly without Jekyll surprises.
- Theme state is stored in `localStorage`, so your selected theme stays consistent.
- Yes, I over-engineered parts of this for fun. No regrets.
