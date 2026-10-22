// Situata në trafik të vizatuara si SVG: kryqëzime, rrethrrotullime, rrugë dhe sinjalet e policit.
// Kryqëzimi vizatohet nga lart (viewBox 300×300). Krahët: N (veri/lart), S (jug/poshtë), E (lindje/djathtas), W (perëndim/majtas).
// Qarkullimi është në të djathtë. Çdo element i krahut vizatohet si për krahun S dhe pastaj rrotullohet.
(function () {
  const ASPHALT = '#5d636b';
  const GRASS = '#d5e4c8';
  const LINE = '#ffffff';
  const NAVY = '#1b2a4a';
  const VEST = '#d7f205';
  const SKIN = '#f0c9a0';
  const ROT = { S: 0, W: 90, N: 180, E: 270 };
  const LABEL_COLORS = { A: '#e53935', B: '#1e88e5', C: '#f9a825', D: '#43a047', E: '#8e24aa' };

  function rotPoint(x, y, deg) {
    const r = (deg * Math.PI) / 180;
    const dx = x - 150;
    const dy = y - 150;
    return [150 + dx * Math.cos(r) - dy * Math.sin(r), 150 + dx * Math.sin(r) + dy * Math.cos(r)];
  }

  const wrap = (body, vb = '0 0 300 300') =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${body}</svg>`;

  // Shigjetë: rruga d, maja (tip) dhe drejtimi [dx, dy] i njësisë.
  function arrow(d, tip, dir, color) {
    const [tx, ty] = tip;
    const [dx, dy] = dir;
    const bx = tx - dx * 14;
    const by = ty - dy * 14;
    const px = -dy * 7;
    const py = dx * 7;
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 9" opacity=".95"/>
      <polygon points="${tx},${ty} ${bx + px},${by + py} ${bx - px},${by - py}" fill="${color}" stroke="#fff" stroke-width="1.5"/>`;
  }

  // ---------- Mjetet (të vizatuara me drejtim lart, në qendër 0,0) ----------
  function vehicleBody(v, color) {
    const blink = (side) => {
      const x = side === 'left' ? -10 : 10;
      return `<circle cx="${x}" cy="-17" r="4" fill="#ff9800" stroke="#fff" stroke-width="1.5"/>
        <circle cx="${x}" cy="17" r="4" fill="#ff9800" stroke="#fff" stroke-width="1.5"/>`;
    };
    let body;
    switch (v.type) {
      case 'bike':
        body = `<rect x="-2.5" y="-15" width="5" height="30" rx="2" fill="#263238"/>
          <ellipse cx="0" cy="1" rx="8" ry="5" fill="${color}"/><circle cx="0" cy="0" r="4.5" fill="${SKIN}" stroke="#333"/>`;
        break;
      case 'tractor':
        body = `<rect x="-14" y="-12" width="28" height="30" rx="3" fill="#2e7d32"/>
          <rect x="-12" y="-26" width="24" height="16" rx="3" fill="#388e3c"/>
          <rect x="-18" y="2" width="6" height="16" rx="2" fill="#222"/><rect x="12" y="2" width="6" height="16" rx="2" fill="#222"/>`;
        break;
      case 'truck':
        body = `<rect x="-14" y="-34" width="28" height="68" rx="4" fill="${color}" stroke="rgba(0,0,0,.35)"/>
          <rect x="-12" y="-32" width="24" height="12" rx="2" fill="#cfe3f5"/>`;
        break;
      case 'ambulance':
        body = `<rect x="-12" y="-22" width="24" height="44" rx="5" fill="#fff" stroke="#c62828" stroke-width="2"/>
          <rect x="-9" y="-16" width="18" height="6" rx="2" fill="#bcd7f0"/>
          <rect x="-10" y="-8" width="9" height="5" fill="#1565c0"/><rect x="1" y="-8" width="9" height="5" fill="#1565c0"/>
          <rect x="-2.5" y="2" width="5" height="14" fill="#c62828"/><rect x="-7" y="6.5" width="14" height="5" fill="#c62828"/>`;
        break;
      case 'policeCar':
        body = `<rect x="-11" y="-20" width="22" height="40" rx="6" fill="#fff" stroke="#1565c0" stroke-width="2"/>
          <rect x="-8" y="-13" width="16" height="6" rx="2" fill="#bcd7f0"/>
          <rect x="-9" y="-3" width="9" height="5" fill="#1565c0"/><rect x="0" y="-3" width="9" height="5" fill="#e53935"/>`;
        break;
      default:
        body = `<rect x="-11" y="-20" width="22" height="40" rx="6" fill="${color}" stroke="rgba(0,0,0,.35)"/>
          <rect x="-8" y="-13" width="16" height="7" rx="2" fill="#d6ebff" opacity=".9"/>
          <rect x="-8" y="9" width="16" height="5" rx="2" fill="#d6ebff" opacity=".8"/>`;
    }
    return body + (v.blink ? blink(v.blink) : '');
  }

  function label(x, y, text, color) {
    if (!text) return '';
    return `<circle cx="${x}" cy="${y}" r="10" fill="#fff" stroke="${color}" stroke-width="3"/>
      <text x="${x}" y="${y + 4.5}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="13" text-anchor="middle" fill="#111">${text}</text>`;
  }

  function vehicle(v, x, y, rot) {
    const color = v.color || LABEL_COLORS[v.label] || '#9e9e9e';
    const labelColor = LABEL_COLORS[v.label] || color;
    return `<g transform="translate(${x} ${y}) rotate(${rot})">${vehicleBody(v, color)}</g>${label(x, y, v.label, labelColor)}`;
  }

  function pedestrian(x, y, text) {
    return `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#ef6c00"/><circle cx="${x}" cy="${y}" r="4.5" fill="${SKIN}" stroke="#5d4037"/>
      ${text ? `<text x="${x}" y="${y - 10}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="11" text-anchor="middle" fill="#111">${text}</text>` : ''}`;
  }

  function nestedSign(key, cx, cy, size) {
    const s = window.SIGNS && window.SIGNS[key];
    if (!s) return '';
    return `<image href="${s.src}" x="${cx - size / 2}" y="${cy - size / 2}" width="${size}" height="${size}"/>`;
  }

  function trafficLight(state, cx, cy) {
    const on = { red: state === 'red', yellow: state === 'yellow' || state === 'blink', green: state === 'green' };
    const lamp = (c, y, lit) => `<circle cx="${cx}" cy="${y}" r="4.6" fill="${lit ? c : '#3a3a3a'}"/>`;
    return `<rect x="${cx - 7}" y="${cy - 17}" width="14" height="34" rx="3" fill="#111" stroke="#fff" stroke-width="1"/>
      ${lamp('#ff3b30', cy - 10, on.red)}${lamp('#ffcc00', cy, on.yellow)}${lamp('#34c759', cy + 10, on.green)}
      ${state === 'blink' ? `<path d="M${cx + 10} ${cy - 5} l5 -3 M${cx + 10} ${cy} h6 M${cx + 10} ${cy + 5} l5 3" stroke="#ffcc00" stroke-width="2"/>` : ''}`;
  }

  // Polici nga lart, me fytyrë drejt jugut (S) para rrotullimit.
  function policeTop(p) {
    const arms =
      p.arms === 'out'
        ? `<line x1="-36" y1="0" x2="36" y2="0" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>
           <circle cx="-37" cy="0" r="4.5" fill="#fff" stroke="#333"/><circle cx="37" cy="0" r="4.5" fill="#fff" stroke="#333"/>`
        : `<circle cx="-15" cy="3" r="4" fill="#fff" stroke="#333"/><circle cx="15" cy="3" r="4" fill="#fff" stroke="#333"/>`;
    return `<g transform="translate(150 150) rotate(${ROT[p.facing || 'S']}) scale(1.2)">
      <circle r="24" fill="#fff" opacity=".35"/>
      ${arms}
      <ellipse rx="15" ry="8" fill="${NAVY}"/><rect x="-13" y="-2" width="26" height="4" fill="${VEST}"/>
      <circle r="7.5" fill="${NAVY}"/><ellipse cx="0" cy="7" rx="6" ry="3" fill="#111"/>
    </g>`;
  }

  // Tabela shtesë zyrtare: rruga me përparësi kthehet. Origjinali tregon kthesën N–E; e rrotullojmë sipas kthesës.
  function mainPanel(main) {
    const key = main.slice().sort().join('');
    const rot = { EN: 0, ES: 90, SW: 180, NW: 270 }[key];
    if (rot === undefined || !window.SIGNS.priorityBend) return '';
    return `<rect x="6" y="6" width="68" height="68" rx="6" fill="#fff"/>
      <image href="${window.SIGNS.priorityBend.src}" x="10" y="10" width="60" height="60" transform="rotate(${rot} 40 40)"/>`;
  }

  // ---------- Kryqëzimi ----------
  function intersection(o) {
    const arms = o.arms || ['N', 'E', 'S', 'W'];
    const round = !!o.roundabout;
    const cross = o.crosswalks || [];
    let s = `<rect width="300" height="300" fill="${GRASS}"/>`;

    // Rrugët
    arms.forEach((a) => {
      s += `<g transform="rotate(${ROT[a]} 150 150)"><rect x="110" y="150" width="80" height="150" fill="${ASPHALT}"/></g>`;
    });
    if (round) {
      s += `<circle cx="150" cy="150" r="80" fill="${ASPHALT}"/>
        <circle cx="150" cy="150" r="42" fill="${GRASS}" stroke="#fff" stroke-width="3"/>
        <circle cx="150" cy="150" r="62" fill="none" stroke="${LINE}" stroke-width="1.5" stroke-dasharray="6 8" opacity=".6"/>`;
    } else {
      s += `<rect x="110" y="110" width="80" height="80" fill="${ASPHALT}"/>`;
    }

    // Shenjat në rrugë
    arms.forEach((a) => {
      const start = round ? 236 : 194;
      let g = `<line x1="150" y1="${start}" x2="150" y2="300" stroke="${LINE}" stroke-width="2.5" stroke-dasharray="12 9"/>`;
      if (cross.includes(a)) {
        for (let x = 114; x < 188; x += 13) g += `<rect x="${x}" y="196" width="7" height="18" fill="${LINE}"/>`;
      }
      const sign = o.signs && o.signs[a];
      if (sign === 'stop' || (o.lights && o.lights[a] && o.lights[a] !== 'blink')) {
        g += `<line x1="150" y1="222" x2="190" y2="222" stroke="${LINE}" stroke-width="4"/>`;
      } else if (sign === 'yield' && !round) {
        g += `<line x1="150" y1="222" x2="190" y2="222" stroke="${LINE}" stroke-width="4" stroke-dasharray="6 4"/>`;
      }
      s += `<g transform="rotate(${ROT[a]} 150 150)">${g}</g>`;
    });

    // Semaforët dhe shenjat
    if (o.lights) {
      Object.entries(o.lights).forEach(([a, st]) => {
        const [x, y] = rotPoint(205, 214, ROT[a]);
        s += trafficLight(st, x, y);
      });
    }
    if (o.signs) {
      Object.entries(o.signs).forEach(([a, key]) => {
        const [x, y] = rotPoint(o.lights && o.lights[a] ? 228 : 214, 246, ROT[a]);
        s += nestedSign(key, x, y, 34);
      });
    }

    // Shigjetat e drejtimit
    const cars = o.cars || [];
    cars.forEach((c) => {
      if (!c.arm || !c.turn) return;
      const color = c.color || LABEL_COLORS[c.label] || '#9e9e9e';
      const d = c.d || 0;
      const y0 = 228 + d;
      let path;
      if (c.turn === 'straight') path = arrow(`M170 ${y0} V105`, [170, 95], [0, -1], color);
      else if (c.turn === 'left') path = arrow(`M170 ${y0} V178 Q170 130 122 130 H105`, [95, 130], [-1, 0], color);
      else if (c.turn === 'right') path = arrow(`M170 ${y0} V200 Q170 170 200 170 H205`, [215, 170], [1, 0], color);
      s += `<g transform="rotate(${ROT[c.arm]} 150 150)">${path}</g>`;
    });

    // Këmbësorët
    (o.peds || []).forEach((p) => {
      const [x, y] = rotPoint(p.x || 150, 205, ROT[p.arm]);
      s += pedestrian(x, y, p.label);
    });

    if (o.police) s += policeTop(o.police);

    // Mjetet
    cars.forEach((c) => {
      let x, y, rot;
      if (c.at) [x, y, rot] = c.at;
      else if (c.ring !== undefined) {
        const t = (c.ring * Math.PI) / 180;
        x = 150 + 61 * Math.cos(t);
        y = 150 + 61 * Math.sin(t);
        rot = c.ring;
      } else {
        [x, y] = rotPoint(170, 252 + (c.d || 0), ROT[c.arm]);
        rot = ROT[c.arm];
      }
      const blink = c.blink || (c.turn === 'left' || c.turn === 'right' ? c.turn : null);
      s += vehicle({ ...c, blink }, x, y, rot);
    });

    if (o.main) s += mainPanel(o.main);
    if (o.inset) {
      s += `<rect x="226" y="6" width="68" height="92" rx="8" fill="#fff" stroke="#999"/>
        ${policeFigure(o.inset).replace('<svg ', '<svg x="230" y="10" width="60" height="84" ')}`;
    }
    return wrap(s);
  }

  // ---------- Rrugë e drejtë (pjesë rruge) ----------
  function road(o) {
    const lanes = o.lanes;
    const lw = 44;
    const sh = o.shoulder ? 30 : 0;
    const total = lanes.length * lw + sh;
    const x0 = 150 - total / 2;
    const end = o.endLane;
    let s = `<rect width="300" height="300" fill="${GRASS}"/>`;

    lanes.forEach((_, i) => {
      const top = end && end.lane === i ? end.y : 0;
      s += `<rect x="${x0 + i * lw}" y="${top}" width="${lw}" height="${300 - top}" fill="${ASPHALT}"/>`;
      if (end && end.lane === i) {
        const xl = x0 + i * lw;
        const xr = xl + lw;
        const pts = i > 0 ? `${xl},${top} ${xr},${top} ${xl},${top - 60}` : `${xl},${top} ${xr},${top} ${xr},${top - 60}`;
        s += `<polygon points="${pts}" fill="${ASPHALT}"/>`;
      }
    });
    if (sh) s += `<rect x="${x0 + lanes.length * lw}" y="0" width="${sh}" height="300" fill="${ASPHALT}"/>`;

    // Vijat
    const edge = (x, y1 = 0) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="300" stroke="${LINE}" stroke-width="3"/>`;
    s += edge(x0 + 2, end && end.lane === 0 ? end.y : 0) + edge(x0 + total - 2, end && end.lane === lanes.length - 1 && !sh ? end.y : 0);
    for (let i = 0; i < lanes.length - 1; i++) {
      const x = x0 + (i + 1) * lw;
      const y1 = end && (end.lane === i || end.lane === i + 1) ? end.y : 0;
      const solid = lanes[i] !== lanes[i + 1] && o.center === 'solid';
      s += `<line x1="${x}" y1="${y1}" x2="${x}" y2="300" stroke="${LINE}" stroke-width="3" ${solid ? '' : 'stroke-dasharray="16 12"'}/>`;
    }
    if (sh) s += edge(x0 + lanes.length * lw);
    if (o.zebra !== undefined) {
      for (let x = x0 + 6; x < x0 + total - 6; x += 14) s += `<rect x="${x}" y="${o.zebra}" width="8" height="22" fill="${LINE}"/>`;
    }

    (o.peds || []).forEach((p) => (s += pedestrian(p.x, p.y, p.label)));

    (o.cars || []).forEach((c) => {
      const up = c.rot !== undefined ? c.rot === 0 : c.lane >= lanes.length || lanes[c.lane] === 'up';
      const rot = c.rot !== undefined ? c.rot : up ? 0 : 180;
      const x = c.x !== undefined ? c.x : c.lane >= lanes.length ? x0 + lanes.length * lw + sh / 2 : x0 + c.lane * lw + lw / 2 + (c.shift || 0);
      const y = c.y;
      if (c.move) {
        const color = c.color || LABEL_COLORS[c.label] || '#9e9e9e';
        const dx = c.dx || lw;
        const fy = -24;
        let a;
        if (c.move === 'straight') a = arrow(`M0 ${fy} V-62`, [0, -72], [0, -1], color);
        else {
          const sx = c.move === 'left' ? -dx : dx;
          const len = Math.hypot(sx, 26);
          a = arrow(`M0 ${fy} Q0 -50 ${sx} -70`, [sx + (sx / len) * 6, -70 - (26 / len) * 6], [sx / len, -26 / len], color);
        }
        s += `<g transform="translate(${x} ${y}) rotate(${rot})">${a}</g>`;
      }
      const blink = c.blink || (c.move === 'left' || c.move === 'right' ? c.move : null);
      s += vehicle({ ...c, blink }, x, y, rot);
    });
    return wrap(s);
  }

  // ---------- Polici nga përpara (sinjalet me krahë) ----------
  function policeFigure(pose) {
    const back = pose === 'back';
    const arm = (x1, y1, x2, y2) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/>
       <circle cx="${x2}" cy="${y2}" r="5.5" fill="#fff" stroke="#333"/>`;
    let arms;
    let extra = '';
    switch (pose) {
      case 'raised':
        arms = arm(40, 50, 34, 6) + arm(60, 50, 64, 86);
        break;
      case 'front':
      case 'back':
        arms = arm(40, 50, 6, 50) + arm(60, 50, 94, 50);
        break;
      case 'slow':
        arms = arm(40, 50, 36, 86) + arm(60, 50, 92, 56);
        extra = `<path d="M92 28 v12 M87 33 l5 -6 5 6 M92 72 v12 M87 79 l5 6 5 -6" stroke="#c62828" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
        break;
      case 'baton':
        arms = arm(40, 50, 36, 86) + arm(60, 50, 80, 58);
        extra = `<line x1="80" y1="58" x2="96" y2="46" stroke="#ff1744" stroke-width="6" stroke-linecap="round"/>
          <circle cx="96" cy="46" r="8" fill="#ff1744" opacity=".35"/>
          <path d="M70 30 Q96 18 112 44" stroke="#ff1744" stroke-width="2" fill="none" stroke-dasharray="4 4"/>`;
        break;
      default:
        arms = arm(40, 50, 36, 86) + arm(60, 50, 64, 86);
    }
    const face = back
      ? `<circle cx="50" cy="32" r="10" fill="#4e342e"/>`
      : `<circle cx="50" cy="32" r="10" fill="${SKIN}"/><circle cx="46" cy="32" r="1.4" fill="#222"/><circle cx="54" cy="32" r="1.4" fill="#222"/>
         <path d="M46 37 q4 2 8 0" stroke="#7b4b2a" stroke-width="1.2" fill="none"/>`;
    const cap = back
      ? `<rect x="39" y="17" width="22" height="10" rx="4" fill="${NAVY}"/>`
      : `<rect x="39" y="16" width="22" height="10" rx="4" fill="${NAVY}"/><rect x="37" y="24" width="26" height="3.5" rx="1.5" fill="#111"/>
         <circle cx="50" cy="20" r="2" fill="#ffd54f"/>`;
    const body = `<rect x="41" y="92" width="8" height="34" rx="3" fill="${NAVY}"/><rect x="51" y="92" width="8" height="34" rx="3" fill="${NAVY}"/>
      <rect x="36" y="44" width="28" height="52" rx="7" fill="${NAVY}"/>
      <rect x="36" y="58" width="28" height="10" fill="${VEST}"/><rect x="36" y="76" width="28" height="5" fill="${VEST}"/>
      ${back ? '<text x="50" y="66" font-family="Arial, Helvetica, sans-serif" font-size="5.5" font-weight="700" text-anchor="middle" fill="#1b2a4a">POLICIJA</text>' : ''}`;
    return `<svg viewBox="-10 0 130 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${body}${arms}${face}${cap}${extra}</svg>`;
  }

  function render(scene) {
    if (!scene) return '';
    if (scene.type === 'road') return road(scene);
    return intersection(scene);
  }

  window.SCENES = { render, policeFigure };
})();
