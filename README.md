# Patenta – Mëso për provimin e patentës (në shqip)

Aplikacion spletni za učenje teorije za vozniški izpit (kategorija B) **v albanskem jeziku**.
Vsebina temelji na slovenskih cestnoprometnih predpisih (ZPrCP).

Aplikacion në gjuhën shqipe për t’u përgatitur për provimin teorik të patentës (kategoria B),
sipas rregullave të trafikut në Slloveni.

## Funksionet / Funkcije
- **146 pyetje** në 10 kategori, secila me shpjegim (shenjat, përparësia, situata në kryqëzime, polici rregullon trafikun, shpejtësia, alkooli, mjeti, sjellja, ndihma e parë, autostrada)
- **38 situata të ilustruara** (kryqëzime nga lart, rrethrrotullime, rrugë, korridori i emergjencës) dhe **sinjalet e policit**
- **22 shenja rrugore** të vizatuara (SVG) me përshkrime
- **Simulim provimi**: 30 pyetje, 30 minuta, kalohet me 90%
- **Gabimet e mia**: përsëritja e pyetjeve të gabuara
- **Mëso teorinë**: rregullat kryesore shkurt
- Progresi ruhet në pajisje (localStorage); funksionon edhe pa internet (PWA)
- Shkurtore në tastierë: `1`–`4` për përgjigjet, `Enter` për kontroll/vazhdim, `←`/`→` në provim

## Zagon / Nisja
Statična stran, brez gradnje (build):

```bash
python3 -m http.server 8000
# odpri http://localhost:8000
```

Objaviš jo lahko na GitHub Pages (Settings → Pages → Deploy from branch).

## Dodajanje vprašanj
Vprašanja so v `js/questions.js` (`c` = indeksi pravilnih odgovorov; več indeksov = več pravilnih odgovorov).
Prometni znaki so v `js/signs.js`, situacije (križišča, ceste, policist) pa v `js/scenes.js`.
Vprašanju dodaš sliko situacije s poljem `scene`, npr.:

```js
scene: {
  signs: { S: 'yield', W: 'priority' },        // znaki po krakih (N, S, E, W)
  lights: { S: 'green' },                      // semafor: red | yellow | green | blink
  police: { facing: 'S', arms: 'out' },        // policist v križišču
  cars: [{ arm: 'S', label: 'A', turn: 'left' }, { arm: 'W', label: 'B', turn: 'straight' }],
}
```
Druge možnosti: `roundabout: true`, `arms: ['S','N','W']` (T-križišče), `main: ['S','W']` (dopolnilna tabla), `crosswalks`, `peds`, `type: 'road'` (odsek ceste). Gibe policista prikaže polje `figure: 'front' | 'back' | 'raised' | 'slow' | 'baton'`.

> Aplikacija je namenjena vadbi in ne nadomešča avtošole ali uradnih gradiv.
