// Shenjat rrugore zyrtare (SVG në img/znaki/).
// Burimi: katalogu i shenjave të OpenStreetMap (@osm-traffic-signs), shenja zyrtare austriake (StVO)
// dhe polake – sipas Konventës së Vjenës, të njëjta me shenjat në Slloveni. Licenca: Public Domain.
// Shenja e autostradës është ringjyrosur me ngjyrë jeshile, si në Slloveni.
(function () {
  const DEFS = {
    // Shenjat e përparësisë
    stop: ['STOP – Ndalim i detyrueshëm', 'Ndaluni plotësisht te vija e ndalimit (ose para kryqëzimit) dhe jepuni përparësi të gjitha mjeteve.'],
    yield: ['Jepni përparësi', 'Duhet t’u jepni përparësi mjeteve në rrugën ku po hyni ose që po e kryqëzoni.'],
    priority: ['Rrugë me përparësi', 'Jeni në rrugën me përparësi. Mjetet nga rrugët anësore duhet t’ju japin përparësi.'],
    endPriority: ['Fundi i rrugës me përparësi', 'Përparësia përfundon. Në kryqëzimin e ardhshëm vlejnë shenjat ose rregulli i djathtës.'],
    yieldOncoming: ['Jepni përparësi mjeteve nga përballë', 'Në pjesën e ngushtë të rrugës duhet t’u jepni përparësi mjeteve që vijnë nga përballë.'],
    priorityOncoming: ['Përparësi ndaj mjeteve nga përballë', 'Në pjesën e ngushtë të rrugës ju keni përparësi ndaj mjeteve që vijnë nga përballë.'],
    // Shenjat e ndalimit
    noEntry: ['Ndalohet hyrja', 'Ndalohet hyrja e të gjitha mjeteve nga ky drejtim (zakonisht në fund të një rruge njëkahëshe).'],
    noVehicles: ['Ndalohet qarkullimi në të dy drejtimet', 'Ndalohet qarkullimi i të gjitha mjeteve në të dy drejtimet.'],
    speed50: ['Kufizim shpejtësie – 50 km/h', 'Shpejtësia më e lartë e lejuar është 50 km/h, deri në shenjën që e përfundon kufizimin.'],
    endSpeed: ['Fundi i kufizimit të shpejtësisë', 'Kufizimi i shpejtësisë përfundon; vlen përsëri kufiri i përgjithshëm për atë rrugë.'],
    noOvertaking: ['Ndalohet parakalimi', 'Ndalohet parakalimi i mjeteve motorike (përveç motoçikletave pa kosh anësor).'],
    endNoOvertaking: ['Fundi i ndalimit të parakalimit', 'Ndalimi i parakalimit përfundon.'],
    noUTurn: ['Ndalohet kthimi në U', 'Ndalohet kthimi i mjetit në drejtimin e kundërt.'],
    noLeftTurn: ['Ndalohet kthimi majtas', 'Te kryqëzimi i ardhshëm ndalohet kthimi majtas.'],
    noHorn: ['Ndalohet përdorimi i borisë', 'Ndalohet përdorimi i sinjalit zanor, përveç për të shmangur një rrezik të menjëhershëm.'],
    noParking: ['Ndalohet parkimi', 'Ndalohet parkimi. Ndalimi i shkurtër (p.sh. për të zbritur pasagjerët) lejohet.'],
    noStopping: ['Ndalohet ndalimi dhe parkimi', 'Nuk lejohet as ndalimi, as parkimi.'],
    snowChains: ['Zinxhirët e borës të detyrueshëm', 'Mund të vazhdoni vetëm me zinxhirë dëbore në rrotat lëvizëse.'],
    // Shenjat e rrezikut
    danger: ['Rrezik tjetër', 'Paralajmëron për një rrezik që nuk ka shenjë të veçantë. Shpesh ka tabelë shtesë me shpjegim.'],
    crossroadsEqual: ['Kryqëzim me rrugë të barasvlershme', 'Në kryqëzimin e ardhshëm vlen rregulli i djathtës: përparësi kanë mjetet që vijnë nga e djathta.'],
    crossroadsPriority: ['Kryqëzim me rrugë anësore pa përparësi', 'Ju jeni në rrugën me përparësi; mjetet nga rrugët anësore duhet t’ju japin përparësi.'],
    roundaboutAhead: ['Kryqëzim me qarkullim rrethor', 'Përpara është rrethrrotullim. Ngadalësoni dhe përgatituni t’u jepni përparësi mjeteve në rreth.'],
    curveRight: ['Kthesë e rrezikshme djathtas', 'Përpara është kthesë e fortë djathtas. Ngadalësoni para kthesës.'],
    narrowing: ['Ngushtim i rrugës', 'Rruga ngushtohet nga të dyja anët. Kini kujdes nga mjetet nga përballë.'],
    children: ['Fëmijë në rrugë', 'Kujdes – afër shkollës, kopshtit ose këndit të lojërave mund të dalin fëmijë në rrugë.'],
    pedestrianAhead: ['Vendkalim për këmbësorë përpara', 'Paralajmëron për vendkalim këmbësorësh. Ngadalësoni dhe jini gati të ndaleni.'],
    animals: ['Kafshë të egra', 'Mund të kalojnë kafshë të egra, sidomos në muzg dhe natën.'],
    slippery: ['Rrugë e rrëshqitshme', 'Rruga mund të jetë e rrëshqitshme (shi, akull, gjethe). Ngadalësoni dhe shmangni manovrat e papritura.'],
    crosswind: ['Erë anësore', 'Mund të fryjë erë e fortë anësore. Mbajeni timonin fort dhe ngadalësoni.'],
    roadworks: ['Punime në rrugë', 'Përpara ka punime. Ngadalësoni dhe ndiqni shenjat e përkohshme.'],
    trafficLightAhead: ['Semafor përpara', 'Përpara është kryqëzim ose vendkalim i rregulluar me semafor.'],
    railwayBarrier: ['Kalim hekurudhor me barriera', 'Përpara është kalim hekurudhor me barriera ose gjysmë-barriera.'],
    railwayNoBarrier: ['Kalim hekurudhor pa barriera', 'Përpara është kalim hekurudhor pa barriera. Ngadalësoni dhe shikoni nëse vjen treni.'],
    railway: ['Kryqi i Shën Andreas', 'Vendoset menjëherë para kalimit hekurudhor pa barriera. Treni ka gjithmonë përparësi – ndaluni nëse vjen treni.'],
    // Shenjat e detyrimit
    roundabout: ['Rrethrrotullim (qarkullim rrethor)', 'Qarkullim i detyrueshëm në drejtim të shigjetave, në kahun e kundërt të akrepave të orës.'],
    turnRight: ['Kthim i detyrueshëm djathtas', 'Te kryqëzimi i ardhshëm lejohet vetëm kthimi djathtas.'],
    // Shenjat e informimit
    oneWay: ['Rrugë njëkahëshe', 'Qarkullimi lejohet vetëm në drejtimin e shigjetës.'],
    pedestrian: ['Vendkalim për këmbësorë', 'Shënon vendkalimin për këmbësorë. Këmbësorët që janë në vendkalim ose që duan të kalojnë kanë përparësi.'],
    motorway: ['Autostradë', 'Fillimi i autostradës. Në Slloveni shenjat e autostradës janë jeshile. Nevojitet vinjeta elektronike.'],
    priorityBend: ['Tabelë shtesë: drejtimi i rrugës me përparësi', 'Vendoset nën shenjën e përparësisë. Vija e trashë tregon rrugën me përparësi që kthehet, vijat e holla rrugët anësore.'],
    deadEnd: ['Rrugë pa dalje', 'Rruga nuk ka dalje (rrugë qorre).'],
    livingStreet: ['Zonë e trafikut të qetësuar', 'Këmbësorët mund të përdorin gjithë rrugën dhe fëmijët mund të luajnë. Shpejtësia maksimale është 10 km/h.'],
  };

  const SIGNS = {};
  Object.entries(DEFS).forEach(([key, [name, desc]]) => {
    const src = `img/znaki/${key}.svg`;
    SIGNS[key] = { name, desc, src, svg: `<img src="${src}" alt="${name.replace(/"/g, '&quot;')}" loading="lazy">` };
  });

  window.SIGNS = SIGNS;
})();
