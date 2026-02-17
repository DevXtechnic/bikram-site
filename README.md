# Bikram Gole - Personal Website

This is my personal website.
I built it as a chaotic-fun, space-themed profile to show my personality, interests, and coding vibe.

Live URL: `https://devxtechnic.github.io/bikram-site/`

## What I put in this site

- Multi-page setup: Home, About, Contact
- Theme engine with multiple visual modes
- Persistent theme across all pages
- Mini terminal with commands
- Persona quiz game
- Live GitHub repo cards from `github.com/DevXtechnic`
- Custom interactions, pulse effects, and easter eggs

## Tech stack

- HTML
- CSS
- Vanilla JavaScript
- GitHub Pages for hosting
- GitHub API for repo fetch

## Project structure

- `index.html` -> home page
- `about.html` -> profile + identity snapshot
- `contact.html` -> contact links
- `styles.css` -> all styling and themes
- `script.js` -> interactions, effects, terminal, quiz, and theme logic

## Run locally

```bash
cd bikram-site
python -m http.server 8000
```

Open `http://localhost:8000`.

## Notes

- `.nojekyll` is included so GitHub Pages serves files directly without Jekyll processing.
- Theme selection is saved in `localStorage` and synced through URL params for page-to-page consistency.
