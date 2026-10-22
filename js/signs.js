// Shenjat rrugore të vizatuara si SVG (viewBox 0 0 100 100).
(function () {
  const RED = '#d32f2f';
  const BLUE = '#1d5fb4';
  const GREEN = '#1b7a3e';
  const YELLOW = '#f6c800';

  const svg = (body) =>
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${body}</svg>`;

  const warning = (inner) =>
    svg(`<polygon points="50,5 97,89 3,89" fill="${RED}" stroke="${RED}" stroke-width="4" stroke-linejoin="round"/>
         <polygon points="50,22 83,81 17,81" fill="#fff"/>${inner}`);

  const prohibitory = (inner, fill = '#fff') =>
    svg(`<circle cx="50" cy="50" r="46" fill="#fff"/>
         <circle cx="50" cy="50" r="40" fill="${fill}" stroke="${RED}" stroke-width="10"/>${inner}`);

  const mandatory = (inner) =>
    svg(`<circle cx="50" cy="50" r="47" fill="#fff"/><circle cx="50" cy="50" r="44" fill="${BLUE}"/>${inner}`);

  const square = (fill, inner) =>
    svg(`<rect x="3" y="3" width="94" height="94" rx="8" fill="#fff"/>
         <rect x="7" y="7" width="86" height="86" rx="6" fill="${fill}"/>${inner}`);

  const diamond = (inner = '') =>
    svg(`<rect x="15" y="15" width="70" height="70" fill="#fff" stroke="#555" stroke-width="1.5" transform="rotate(45 50 50)"/>
         <rect x="25" y="25" width="50" height="50" fill="${YELLOW}" transform="rotate(45 50 50)"/>${inner}`);

  const roundaboutArrows = [0, 120, 240]
    .map(
      (deg) => `<g transform="rotate(${deg} 50 50)">
        <path d="M57.2 23 A28 28 0 0 0 28.6 32" fill="none" stroke="#fff" stroke-width="8"/>
        <polygon points="22.2,39.7 34.7,37.1 22.5,26.9" fill="#fff"/></g>`
    )
    .join('');

  const SIGNS = {
    stop: {
      name: 'STOP – Ndalim i detyrueshëm',
      desc: 'Ndaluni plotësisht te vija e ndalimit (ose para kryqëzimit) dhe jepuni përparësi të gjitha mjeteve.',
      svg: svg(`<polygon points="94.3,68.4 68.4,94.3 31.6,94.3 5.7,68.4 5.7,31.6 31.6,5.7 68.4,5.7 94.3,31.6" fill="#fff"/>
        <polygon points="90.65,66.84 66.84,90.65 33.16,90.65 9.35,66.84 9.35,33.16 33.16,9.35 66.84,9.35 90.65,33.16" fill="${RED}"/>
        <text x="50" y="59" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="25" fill="#fff" text-anchor="middle">STOP</text>`),
    },
    yield: {
      name: 'Jepni përparësi',
      desc: 'Duhet t’u jepni përparësi mjeteve në rrugën ku po hyni ose që po e kryqëzoni.',
      svg: svg(`<polygon points="4,10 96,10 50,93" fill="${RED}" stroke="${RED}" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="21,19 79,19 50,72" fill="#fff"/>`),
    },
    priority: {
      name: 'Rrugë me përparësi',
      desc: 'Jeni në rrugën me përparësi. Mjetet nga rrugët anësore duhet t’ju japin përparësi.',
      svg: diamond(),
    },
    endPriority: {
      name: 'Fundi i rrugës me përparësi',
      desc: 'Përparësia përfundon. Në kryqëzimin e ardhshëm vlejnë shenjat ose rregulli i djathtës.',
      svg: diamond(`<line x1="28" y1="60" x2="60" y2="28" stroke="#222" stroke-width="4"/>
        <line x1="34" y1="66" x2="66" y2="34" stroke="#222" stroke-width="4"/>
        <line x1="40" y1="72" x2="72" y2="40" stroke="#222" stroke-width="4"/>`),
    },
    noEntry: {
      name: 'Ndalohet hyrja',
      desc: 'Ndalohet hyrja e të gjitha mjeteve nga ky drejtim (zakonisht në fund të një rruge njëkahëshe).',
      svg: svg(`<circle cx="50" cy="50" r="46" fill="${RED}" stroke="#fff" stroke-width="3"/>
        <rect x="18" y="42" width="64" height="16" fill="#fff"/>`),
    },
    noVehicles: {
      name: 'Ndalohet qarkullimi në të dy drejtimet',
      desc: 'Ndalohet qarkullimi i të gjitha mjeteve në të dy drejtimet.',
      svg: prohibitory(''),
    },
    speed50: {
      name: 'Kufizim shpejtësie – 50 km/h',
      desc: 'Shpejtësia më e lartë e lejuar është 50 km/h, deri në shenjën që e përfundon kufizimin ose deri në kryqëzimin e ardhshëm.',
      svg: prohibitory(`<text x="50" y="62" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="34" fill="#111" text-anchor="middle">50</text>`),
    },
    noOvertaking: {
      name: 'Ndalohet parakalimi',
      desc: 'Ndalohet parakalimi i mjeteve motorike (përveç motoçikletave pa kosh anësor).',
      svg: prohibitory(`<rect x="24" y="38" width="20" height="28" rx="5" fill="${RED}"/>
        <rect x="56" y="38" width="20" height="28" rx="5" fill="#111"/>
        <rect x="27" y="42" width="14" height="7" rx="2" fill="#fff"/>
        <rect x="59" y="42" width="14" height="7" rx="2" fill="#fff"/>`),
    },
    noParking: {
      name: 'Ndalohet parkimi',
      desc: 'Ndalohet parkimi. Ndalimi i shkurtër (p.sh. për të zbritur pasagjerët) lejohet.',
      svg: prohibitory(`<line x1="22" y1="22" x2="78" y2="78" stroke="${RED}" stroke-width="9"/>`, BLUE),
    },
    noStopping: {
      name: 'Ndalohet ndalimi dhe parkimi',
      desc: 'Nuk lejohet as ndalimi, as parkimi.',
      svg: prohibitory(`<line x1="22" y1="22" x2="78" y2="78" stroke="${RED}" stroke-width="9"/>
        <line x1="78" y1="22" x2="22" y2="78" stroke="${RED}" stroke-width="9"/>`, BLUE),
    },
    danger: {
      name: 'Rrezik tjetër',
      desc: 'Paralajmëron për një rrezik që nuk ka shenjë të veçantë. Shpesh ka tabelë shtesë me shpjegim.',
      svg: warning(`<rect x="46.5" y="38" width="7" height="25" rx="2" fill="#111"/><circle cx="50" cy="71" r="4" fill="#111"/>`),
    },
    crossroadsEqual: {
      name: 'Kryqëzim me rrugë të barasvlershme',
      desc: 'Në kryqëzimin e ardhshëm vlen rregulli i djathtës: përparësi kanë mjetet që vijnë nga e djathta.',
      svg: warning(`<line x1="39" y1="45" x2="61" y2="75" stroke="#111" stroke-width="6"/>
        <line x1="61" y1="45" x2="39" y2="75" stroke="#111" stroke-width="6"/>`),
    },
    crossroadsPriority: {
      name: 'Kryqëzim me rrugë anësore pa përparësi',
      desc: 'Ju jeni në rrugën me përparësi; mjetet nga rrugët anësore duhet t’ju japin përparësi.',
      svg: warning(`<line x1="50" y1="36" x2="50" y2="77" stroke="#111" stroke-width="8"/>
        <line x1="35" y1="58" x2="65" y2="58" stroke="#111" stroke-width="4"/>`),
    },
    children: {
      name: 'Fëmijë në rrugë',
      desc: 'Kujdes – afër shkollës, kopshtit ose këndit të lojërave mund të dalin fëmijë në rrugë.',
      svg: warning(`<circle cx="42" cy="44" r="4" fill="#111"/><circle cx="58" cy="48" r="3.5" fill="#111"/>
        <path d="M42 48 L41 62 M41 62 L36 74 M41 62 L46 74 M42 52 L50 58 M42 52 L35 58" stroke="#111" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M58 51 L58 63 M58 63 L54 74 M58 63 L62 74 M58 55 L50 58 M58 55 L64 61" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>`),
    },
    slippery: {
      name: 'Rrugë e rrëshqitshme',
      desc: 'Rruga mund të jetë e rrëshqitshme (shi, akull, gjethe). Ngadalësoni dhe shmangni manovrat e papritura.',
      svg: warning(`<rect x="38" y="42" width="24" height="14" rx="4" fill="#111"/>
        <rect x="36" y="54" width="7" height="5" fill="#111"/><rect x="57" y="54" width="7" height="5" fill="#111"/>
        <path d="M34 76 C40 68, 44 70, 47 64 M53 76 C59 68, 63 70, 66 64" stroke="#111" stroke-width="3" fill="none"/>`),
    },
    roadworks: {
      name: 'Punime në rrugë',
      desc: 'Përpara ka punime. Ngadalësoni dhe ndiqni shenjat e përkohshme (të verdha).',
      svg: warning(`<circle cx="46" cy="42" r="4" fill="#111"/>
        <path d="M46 46 L50 60 L44 74 M50 60 L56 72 M47 50 L58 56 L64 66" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>
        <polygon points="30,76 40,64 46,76" fill="#111"/>`),
    },
    railway: {
      name: 'Kryqëzim hekurudhor pa barriera',
      desc: 'Kryqi i Shën Andreas: kalim hekurudhor pa barriera. Ndaluni nëse vjen treni – treni ka gjithmonë përparësi.',
      svg: svg(`<g transform="rotate(38 50 50)"><rect x="43" y="4" width="14" height="92" fill="#fff" stroke="${RED}" stroke-width="3"/>
        <rect x="46" y="6" width="8" height="12" fill="${RED}"/><rect x="46" y="32" width="8" height="12" fill="${RED}"/>
        <rect x="46" y="58" width="8" height="12" fill="${RED}"/><rect x="46" y="82" width="8" height="12" fill="${RED}"/></g>
        <g transform="rotate(-38 50 50)"><rect x="43" y="4" width="14" height="92" fill="#fff" stroke="${RED}" stroke-width="3"/>
        <rect x="46" y="6" width="8" height="12" fill="${RED}"/><rect x="46" y="82" width="8" height="12" fill="${RED}"/></g>`),
    },
    roundabout: {
      name: 'Rrethrrotullim (qarkullim rrethor)',
      desc: 'Qarkullim i detyrueshëm në drejtim të shigjetave, në kahun e kundërt të akrepave të orës.',
      svg: mandatory(roundaboutArrows),
    },
    turnRight: {
      name: 'Kthim i detyrueshëm djathtas',
      desc: 'Te kryqëzimi i ardhshëm lejohet vetëm kthimi djathtas.',
      svg: mandatory(`<path d="M40 80 V50 Q40 38 52 38 H60" stroke="#fff" stroke-width="10" fill="none"/>
        <polygon points="58,24 80,38 58,52" fill="#fff"/>`),
    },
    oneWay: {
      name: 'Rrugë njëkahëshe',
      desc: 'Qarkullimi lejohet vetëm në drejtimin e shigjetës.',
      svg: square(BLUE, `<rect x="44" y="38" width="12" height="44" fill="#fff"/><polygon points="30,42 50,16 70,42" fill="#fff"/>`),
    },
    pedestrian: {
      name: 'Vendkalim për këmbësorë',
      desc: 'Shënon vendkalimin për këmbësorë. Këmbësorët që janë në vendkalim ose që duan të kalojnë kanë përparësi.',
      svg: square(BLUE, `<polygon points="50,14 87,82 13,82" fill="#fff"/>
        <rect x="26" y="74" width="8" height="5" fill="#111"/><rect x="38" y="74" width="8" height="5" fill="#111"/>
        <rect x="50" y="74" width="8" height="5" fill="#111"/><rect x="62" y="74" width="8" height="5" fill="#111"/>
        <circle cx="50" cy="38" r="5" fill="#111"/>
        <path d="M50 44 L48 58 L42 70 M48 58 L56 70 M49 48 L42 55 M49 48 L57 54" stroke="#111" stroke-width="3.5" fill="none" stroke-linecap="round"/>`),
    },
    motorway: {
      name: 'Autostradë',
      desc: 'Fillimi i autostradës. Në Slloveni shenjat e autostradës janë jeshile. Nevojitet vinjeta elektronike.',
      svg: square(GREEN, `<polygon points="30,86 45,46 55,46 70,86" fill="#fff"/>
        <rect x="48.5" y="54" width="3" height="8" fill="${GREEN}"/><rect x="48.5" y="68" width="3" height="10" fill="${GREEN}"/>
        <rect x="16" y="28" width="68" height="10" fill="#fff"/>
        <rect x="20" y="38" width="7" height="16" fill="#fff"/><rect x="73" y="38" width="7" height="16" fill="#fff"/>`),
    },
  };

  window.SIGNS = SIGNS;
})();
