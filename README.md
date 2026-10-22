# Patenta – Mëso për provimin e patentës (në shqip)

Aplikacion spletni za učenje teorije za vozniški izpit (kategorija B) **v albanskem jeziku**.
Vsebina temelji na slovenskih cestnoprometnih predpisih (ZPrCP).

Aplikacion në gjuhën shqipe për t’u përgatitur për provimin teorik të patentës (kategoria B),
sipas rregullave të trafikut në Slloveni.

## Funksionet / Funkcije
- **116 pyetje** në 8 kategori, secila me shpjegim (shenjat, përparësia, shpejtësia, alkooli, mjeti, sjellja, ndihma e parë, autostrada)
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
Prometni znaki so v `js/signs.js`.

> Aplikacija je namenjena vadbi in ne nadomešča avtošole ali uradnih gradiv.
