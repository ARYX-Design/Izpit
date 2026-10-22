# Patenta – Mëso për provimin e patentës (në shqip)

Aplikacion spletni za učenje teorije za vozniški izpit (kategorija B) **v albanskem jeziku**.
Vsebina temelji na slovenskih cestnoprometnih predpisih (ZPrCP).

Aplikacion në gjuhën shqipe për t’u përgatitur për provimin teorik të patentës (kategoria B),
sipas rregullave të trafikut në Slloveni.

## Funksionet / Funkcije
- **157 pyetje** në 10 kategori, secila me shpjegim (shenjat, përparësia, situata në kryqëzime, polici rregullon trafikun, shpejtësia, alkooli, mjeti, sjellja, ndihma e parë, autostrada)
- **38 situata të ilustruara** (kryqëzime nga lart, rrethrrotullime, rrugë, korridori i emergjencës) dhe **sinjalet e policit**
- **42 shenja rrugore zyrtare** (SVG) me përshkrime
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
Seznam znakov je v `js/signs.js` (datoteke v `img/znaki/`), situacije (križišča, ceste, policist) pa v `js/scenes.js`.
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

## Prometni znaki – vir in licenca
Znaki v `img/znaki/` so uradni prometni znaki (avstrijski StVO in poljski, po Dunajski konvenciji – enaki slovenskim)
iz kataloga [OSM Traffic Sign Tool](https://github.com/osmberlin/osm-traffic-sign-tool) (paket `@osm-traffic-signs/converter`),
izvorno z OpenStreetMap Wiki / Wikimedia Commons. Licenca: **Public Domain**.
Znak za avtocesto je prebarvan v zeleno, kot v Sloveniji; pri Andrejevem križu je odstranjena podlaga.
