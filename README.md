# PULSE EMS Studio — sito statico (100% gratuito)

Questo progetto è un sito **multi‑pagina** in **HTML/CSS/JS** (nessun CMS, nessun abbonamento, nessun plugin a pagamento).
Puoi pubblicarlo gratis su **GitHub Pages** o **Netlify**.

## 1) Personalizza in 2 minuti

### A) Link prenotazioni (Setmore)
Apri `assets/app.js` e sostituisci:

```js
const BOOKING_URL = "https://YOUR-SETMORE-LINK.setmore.com";
```

con il tuo link Setmore reale.

### B) Contatti / indirizzo
Cerca e sostituisci in tutte le pagine:
- `Via Roma 21, 46018 Sabbioneta (MN)`
- `+39 000 000 0000`
- `info@pulseems.it`

### C) Social
Nel footer sostituisci i link Instagram/TikTok (attualmente `#`).

## 2) Pubblica gratis (opzione A: GitHub Pages)

1. Crea un account GitHub (se non ce l’hai).
2. Crea un nuovo repository (es. `pulse-ems-site`).
3. Carica **tutti i file** (index.html, about.html, ecc. + cartella `assets`).
4. Vai su **Settings → Pages**
5. In “Build and deployment” seleziona:
   - Source: **Deploy from a branch**
   - Branch: **main** (root)
6. Salva. Dopo pochi minuti avrai il link pubblico.

## 3) Pubblica gratis (opzione B: Netlify)

1. Vai su Netlify e fai login.
2. “Add new site” → “Deploy manually”.
3. Trascina la cartella del progetto dentro Netlify.

## Note
- Il “form contatti” è volutamente **gratis**: apre un `mailto:` (nessun server, zero costi).
- Le transizioni “morph” usano `flubber` (MIT, gratuito) via CDN.
