(function () {
  'use strict';

  const EXAM = { count: 30, minutes: 30, pass: 0.9 };
  const STORE_KEY = 'patenta-al-v1';

  const CATS = window.CATEGORIES;
  const QS = window.QUESTIONS;
  const SIGNS = window.SIGNS;
  const SCENES = window.SCENES;
  const byId = Object.fromEntries(QS.map((q) => [q.id, q]));
  const catById = Object.fromEntries(CATS.map((c) => [c.id, c]));

  const app = document.getElementById('app');

  // ---------- Ruajtja e progresit ----------
  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        return { stats: data.stats || {}, exams: data.exams || [] };
      }
    } catch (e) {}
    return { stats: {}, exams: [] };
  }
  let store = loadStore();
  function saveStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (e) {}
  }
  function record(qid, ok) {
    const s = store.stats[qid] || { seen: 0, right: 0, last: null };
    s.seen++;
    if (ok) s.right++;
    s.last = ok;
    store.stats[qid] = s;
    saveStore();
  }

  // ---------- Ndihmës ----------
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const isMulti = (q) => q.c.length > 1;
  const mistakes = () => QS.filter((q) => store.stats[q.id] && store.stats[q.id].last === false);

  function catProgress(catId) {
    const qs = QS.filter((q) => q.cat === catId);
    const mastered = qs.filter((q) => store.stats[q.id] && store.stats[q.id].last === true).length;
    return { total: qs.length, mastered, pct: Math.round((mastered / qs.length) * 100) };
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    const s = new Set(a);
    return b.every((x) => s.has(x));
  }

  // Përgatit pyetjen me përgjigje të përziera.
  function prepare(q) {
    return { q, order: shuffle(q.a.map((_, i) => i)), picked: [], checked: false };
  }

  function fmtDate(ts) {
    const d = new Date(ts);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  // ---------- Pamjet ----------
  let session = null; // ushtrim
  let exam = null; // provim
  let timer = null;

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function header(title, back = '#/') {
    return `<header class="topbar">
      <a class="back" href="${back}" aria-label="Kthehu">←</a>
      <h1>${esc(title)}</h1>
    </header>`;
  }

  function renderHome() {
    const answered = Object.keys(store.stats).length;
    const totals = Object.values(store.stats).reduce(
      (acc, s) => ({ seen: acc.seen + s.seen, right: acc.right + s.right }),
      { seen: 0, right: 0 }
    );
    const accuracy = totals.seen ? Math.round((totals.right / totals.seen) * 100) : 0;
    const best = store.exams.reduce((m, e) => Math.max(m, Math.round((e.score / e.total) * 100)), 0);
    const nMistakes = mistakes().length;

    app.innerHTML = `
      <header class="hero">
        <div class="logo" aria-hidden="true">${SIGNS.priority.svg}</div>
        <div>
          <h1>Patenta</h1>
          <p>Mëso për provimin teorik të patentës – në gjuhën shqipe</p>
        </div>
      </header>

      <section class="stats">
        <div class="stat"><b>${answered}<small>/${QS.length}</small></b><span>pyetje të provuara</span></div>
        <div class="stat"><b>${accuracy}%</b><span>saktësia</span></div>
        <div class="stat"><b>${best}%</b><span>provimi më i mirë</span></div>
      </section>

      <section class="actions">
        <a class="action primary" href="#/exam">
          <span class="ai">📝</span><span><b>Simulim provimi</b><small>${EXAM.count} pyetje · ${EXAM.minutes} minuta</small></span>
        </a>
        <a class="action" href="#/practice/all">
          <span class="ai">🎯</span><span><b>Ushtrim i përzier</b><small>Të gjitha pyetjet, me shpjegime</small></span>
        </a>
        <a class="action ${nMistakes ? '' : 'disabled'}" href="${nMistakes ? '#/practice/mistakes' : '#/'}">
          <span class="ai">🔁</span><span><b>Gabimet e mia</b><small>${nMistakes ? `${nMistakes} pyetje për t’u përsëritur` : 'Asnjë gabim – bravo!'}</small></span>
        </a>
        <a class="action" href="#/signs">
          <span class="ai">🚸</span><span><b>Shenjat rrugore</b><small>${Object.keys(SIGNS).length} shenja me shpjegime</small></span>
        </a>
        <a class="action" href="#/learn">
          <span class="ai">📚</span><span><b>Mëso teorinë</b><small>Rregullat kryesore shkurt</small></span>
        </a>
      </section>

      <h2 class="section-title">Ushtro sipas kategorive</h2>
      <section class="cats">
        ${CATS.map((c) => {
          const p = catProgress(c.id);
          return `<a class="cat" href="#/practice/${c.id}">
            <span class="ci">${c.icon}</span>
            <span class="cn">${esc(c.name)}</span>
            <span class="cp">${p.mastered}/${p.total}</span>
            <span class="bar"><span style="width:${p.pct}%"></span></span>
          </a>`;
        }).join('')}
      </section>

      ${store.exams.length ? `
      <h2 class="section-title">Provimet e fundit</h2>
      <ul class="history">
        ${store.exams.slice(-5).reverse().map((e) => `
          <li><span>${fmtDate(e.date)}</span>
          <span>${e.score}/${e.total}</span>
          <span class="badge ${e.passed ? 'ok' : 'bad'}">${e.passed ? 'Kaluar' : 'Pa kaluar'}</span></li>`).join('')}
      </ul>` : ''}

      <footer class="foot">
        <p>Rregullat bazohen në legjislacionin e trafikut në Slloveni. Aplikacioni shërben për ushtrim dhe nuk e zëvendëson autoshkollën ose materialet zyrtare.</p>
        <button class="link" id="reset">Fshi progresin</button>
      </footer>`;

    document.getElementById('reset').addEventListener('click', () => {
      if (confirm('A jeni të sigurt që doni ta fshini gjithë progresin?')) {
        store = { stats: {}, exams: [] };
        saveStore();
        renderHome();
      }
    });
  }

  // ---------- Ushtrimi ----------
  function startPractice(kind) {
    let list;
    let title;
    if (kind === 'all') {
      list = QS;
      title = 'Ushtrim i përzier';
    } else if (kind === 'mistakes') {
      list = mistakes();
      title = 'Gabimet e mia';
    } else if (catById[kind]) {
      list = QS.filter((q) => q.cat === kind);
      title = catById[kind].name;
    } else {
      location.hash = '#/';
      return;
    }
    if (!list.length) {
      location.hash = '#/';
      return;
    }
    session = { kind, title, items: shuffle(list).map(prepare), index: 0, correct: 0 };
    renderPractice();
  }

  function questionBlock(item, { reveal }) {
    const q = item.q;
    let sign = q.sign && SIGNS[q.sign] ? `<div class="sign">${SIGNS[q.sign].svg}</div>` : '';
    if (q.figure) sign += `<div class="figure">${SCENES.policeFigure(q.figure)}</div>`;
    if (q.scene) {
      const hasA = (q.scene.cars || []).some((c) => c.label === 'A');
      const youA = hasA && !/\bA\b/.test(q.q) ? '<figcaption>Ju drejtoni mjetin A.</figcaption>' : '';
      sign += `<figure class="scene">${SCENES.render(q.scene)}${youA}</figure>`;
    }
    const multi = isMulti(q);
    const options = item.order
      .map((orig, pos) => {
        const picked = item.picked.includes(orig);
        let cls = picked ? 'picked' : '';
        if (reveal) {
          if (q.c.includes(orig)) cls += ' correct';
          else if (picked) cls += ' wrong';
        }
        return `<button class="opt ${cls}" data-opt="${orig}" ${reveal ? 'disabled' : ''}>
          <span class="key ${multi ? 'box' : ''}">${pos + 1}</span><span>${esc(q.a[orig])}</span></button>`;
      })
      .join('');
    return `${sign}
      <p class="question">${esc(q.q)}</p>
      ${multi ? '<p class="hint">Mund të ketë më shumë se një përgjigje të saktë.</p>' : ''}
      <div class="opts">${options}</div>`;
  }

  function renderPractice() {
    const s = session;
    if (s.index >= s.items.length) return renderPracticeDone();
    const item = s.items[s.index];
    const q = item.q;
    let feedback = '';
    if (item.checked) {
      const ok = sameSet(item.picked, q.c);
      feedback = `<div class="feedback ${ok ? 'ok' : 'bad'}">
        <b>${ok ? '✓ E saktë!' : '✗ Gabim'}</b>
        <p>${esc(q.e)}</p></div>`;
    }
    app.innerHTML = `${header(s.title)}
      <div class="progress"><span style="width:${(s.index / s.items.length) * 100}%"></span></div>
      <p class="counter">Pyetja ${s.index + 1} nga ${s.items.length} · <span class="tag">${esc(catById[q.cat].name)}</span></p>
      <article class="card">${questionBlock(item, { reveal: item.checked })}${feedback}</article>
      <div class="bottom">
        ${item.checked
          ? `<button class="btn primary" id="next">${s.index + 1 < s.items.length ? 'Vazhdo →' : 'Shiko rezultatin'}</button>`
          : `<button class="btn primary" id="check" ${item.picked.length ? '' : 'disabled'}>Kontrollo</button>`}
      </div>`;

    app.querySelectorAll('.opt').forEach((b) =>
      b.addEventListener('click', () => pick(item, Number(b.dataset.opt), renderPractice))
    );
    const check = document.getElementById('check');
    if (check) check.addEventListener('click', checkPractice);
    const next = document.getElementById('next');
    if (next) next.addEventListener('click', nextPractice);
  }

  function pick(item, orig, rerender) {
    if (item.checked) return;
    if (isMulti(item.q)) {
      item.picked = item.picked.includes(orig) ? item.picked.filter((x) => x !== orig) : item.picked.concat(orig);
    } else {
      item.picked = [orig];
    }
    rerender();
  }

  function checkPractice() {
    const item = session.items[session.index];
    if (!item.picked.length || item.checked) return;
    item.checked = true;
    const ok = sameSet(item.picked, item.q.c);
    if (ok) session.correct++;
    record(item.q.id, ok);
    renderPractice();
  }

  function nextPractice() {
    session.index++;
    renderPractice();
    window.scrollTo(0, 0);
  }

  function renderPracticeDone() {
    const s = session;
    const pct = Math.round((s.correct / s.items.length) * 100);
    app.innerHTML = `${header(s.title)}
      <article class="card result">
        <div class="score ${pct >= 90 ? 'ok' : pct >= 60 ? 'mid' : 'bad'}">${pct}%</div>
        <p>${s.correct} nga ${s.items.length} përgjigje të sakta.</p>
        <p class="muted">${pct >= 90 ? 'Shkëlqyeshëm! Je gati për këtë temë.' : 'Vazhdo të ushtrosh – përsërit gabimet derisa t’i zotërosh.'}</p>
      </article>
      <div class="bottom stack">
        <button class="btn primary" id="again">Provo përsëri</button>
        ${mistakes().length ? '<a class="btn" href="#/practice/mistakes">Përsërit gabimet</a>' : ''}
        <a class="btn" href="#/">Kthehu në fillim</a>
      </div>`;
    document.getElementById('again').addEventListener('click', () => startPractice(s.kind));
  }

  // ---------- Simulimi i provimit ----------
  function renderExamIntro() {
    stopTimer();
    exam = null;
    app.innerHTML = `${header('Simulim provimi')}
      <article class="card">
        <h2>Si funksionon</h2>
        <ul class="list">
          <li><b>${EXAM.count}</b> pyetje të rastësishme nga të gjitha kategoritë</li>
          <li>Koha: <b>${EXAM.minutes} minuta</b></li>
          <li>Për të kaluar duhen të paktën <b>${Math.ceil(EXAM.count * EXAM.pass)}</b> përgjigje të sakta (${Math.round(EXAM.pass * 100)}%)</li>
          <li>Përgjigjet e sakta shfaqen vetëm në fund</li>
          <li>Te pyetjet me disa përgjigje të sakta, duhen zgjedhur të gjitha</li>
        </ul>
        <p class="muted">Ky është simulim për ushtrim – formati i provimit zyrtar mund të ndryshojë.</p>
      </article>
      <div class="bottom"><button class="btn primary" id="start">Fillo provimin</button></div>`;
    document.getElementById('start').addEventListener('click', startExam);
  }

  function startExam() {
    // Shpërndarje e balancuar: pyetje nga çdo kategori, pastaj plotësim i rastësishëm.
    const perCat = Math.floor(EXAM.count / CATS.length);
    let chosen = [];
    CATS.forEach((c) => {
      chosen = chosen.concat(shuffle(QS.filter((q) => q.cat === c.id)).slice(0, perCat));
    });
    const rest = shuffle(QS.filter((q) => !chosen.includes(q)));
    chosen = chosen.concat(rest.slice(0, EXAM.count - chosen.length));
    exam = {
      items: shuffle(chosen).map(prepare),
      index: 0,
      endsAt: Date.now() + EXAM.minutes * 60 * 1000,
      done: false,
    };
    stopTimer();
    timer = setInterval(tick, 1000);
    renderExam();
  }

  function tick() {
    if (!exam || exam.done) return stopTimer();
    const left = Math.max(0, Math.round((exam.endsAt - Date.now()) / 1000));
    const el = document.getElementById('timer');
    if (el) {
      el.textContent = fmtTime(left);
      el.classList.toggle('low', left <= 120);
    }
    if (left <= 0) finishExam();
  }

  function renderExam() {
    const e = exam;
    const item = e.items[e.index];
    const left = Math.max(0, Math.round((e.endsAt - Date.now()) / 1000));
    const answered = e.items.filter((it) => it.picked.length).length;
    app.innerHTML = `
      <header class="topbar">
        <a class="back" href="#/" id="quit" aria-label="Dil">✕</a>
        <h1>Provimi</h1>
        <span class="timer ${left <= 120 ? 'low' : ''}" id="timer">${fmtTime(left)}</span>
      </header>
      <nav class="grid" aria-label="Pyetjet">
        ${e.items.map((it, i) => `<button class="cell ${i === e.index ? 'current' : ''} ${it.picked.length ? 'done' : ''}" data-go="${i}">${i + 1}</button>`).join('')}
      </nav>
      <p class="counter">Pyetja ${e.index + 1} nga ${e.items.length} · ${answered} të përgjigjura</p>
      <article class="card">${questionBlock(item, { reveal: false })}</article>
      <div class="bottom row">
        <button class="btn" id="prev" ${e.index === 0 ? 'disabled' : ''}>← Para</button>
        ${e.index + 1 < e.items.length
          ? '<button class="btn primary" id="nextq">Tjetra →</button>'
          : '<button class="btn primary" id="finish">Përfundo</button>'}
      </div>
      ${e.index + 1 < e.items.length ? '<div class="bottom"><button class="btn ghost" id="finish">Përfundo provimin</button></div>' : ''}`;

    app.querySelectorAll('.opt').forEach((b) =>
      b.addEventListener('click', () => pick(item, Number(b.dataset.opt), renderExam))
    );
    app.querySelectorAll('[data-go]').forEach((b) =>
      b.addEventListener('click', () => {
        e.index = Number(b.dataset.go);
        renderExam();
      })
    );
    const prev = document.getElementById('prev');
    prev.addEventListener('click', () => {
      if (e.index > 0) e.index--;
      renderExam();
    });
    const nextq = document.getElementById('nextq');
    if (nextq) nextq.addEventListener('click', () => {
      e.index++;
      renderExam();
    });
    document.getElementById('finish').addEventListener('click', () => {
      const missing = e.items.length - e.items.filter((it) => it.picked.length).length;
      if (missing && !confirm(`Keni ende ${missing} pyetje pa përgjigje. Ta përfundoni provimin?`)) return;
      finishExam();
    });
    document.getElementById('quit').addEventListener('click', (ev) => {
      if (!confirm('Ta ndërprisni provimin? Rezultati nuk do të ruhet.')) ev.preventDefault();
      else stopTimer();
    });
  }

  function finishExam() {
    if (!exam || exam.done) return;
    stopTimer();
    exam.done = true;
    let score = 0;
    exam.items.forEach((it) => {
      it.checked = true;
      const ok = it.picked.length > 0 && sameSet(it.picked, it.q.c);
      if (ok) score++;
      record(it.q.id, ok);
    });
    const total = exam.items.length;
    const passed = score / total >= EXAM.pass;
    store.exams.push({ date: Date.now(), score, total, passed });
    saveStore();
    exam.score = score;
    exam.passed = passed;
    renderExamResult();
  }

  function renderExamResult() {
    const e = exam;
    const pct = Math.round((e.score / e.items.length) * 100);
    const wrong = e.items.filter((it) => !sameSet(it.picked, it.q.c));
    app.innerHTML = `${header('Rezultati')}
      <article class="card result">
        <div class="score ${e.passed ? 'ok' : 'bad'}">${e.score}/${e.items.length}</div>
        <p class="verdict ${e.passed ? 'ok' : 'bad'}">${e.passed ? '🎉 Provimi u kalua!' : 'Provimi nuk u kalua'}</p>
        <p class="muted">${pct}% · nevojiten ${Math.ceil(e.items.length * EXAM.pass)} përgjigje të sakta</p>
      </article>
      <div class="bottom stack">
        <button class="btn primary" id="again">Provim i ri</button>
        <a class="btn" href="#/">Kthehu në fillim</a>
      </div>
      ${wrong.length ? `<h2 class="section-title">Gabimet (${wrong.length})</h2>
        ${wrong.map((it) => `<article class="card review">
          ${questionBlock(it, { reveal: true })}
          <div class="feedback bad"><p>${it.picked.length ? '' : '<b>Pa përgjigje.</b> '}${esc(it.q.e)}</p></div>
        </article>`).join('')}` : ''}`;
    document.getElementById('again').addEventListener('click', startExam);
  }

  // ---------- Shenjat dhe teoria ----------
  function renderSigns() {
    app.innerHTML = `${header('Shenjat rrugore')}
      <p class="muted pad">Prek një shenjë për ta zmadhuar.</p>
      <section class="signs">
        ${Object.entries(SIGNS).map(([key, s]) => `
          <details class="signcard">
            <summary><span class="sg">${s.svg}</span><span class="sn">${esc(s.name)}</span></summary>
            <p>${esc(s.desc)}</p>
          </details>`).join('')}
      </section>
      <div class="bottom"><a class="btn primary" href="#/practice/shenjat">Ushtro shenjat</a></div>`;
  }

  function renderLearn() {
    app.innerHTML = `${header('Mëso teorinë')}
      ${CATS.map((c) => `
        <article class="card learn">
          <h2>${c.icon} ${esc(c.name)}</h2>
          <ul class="list">${c.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          ${c.figures ? `<div class="figures">${c.figures.map((f) => `<div class="fig">${SCENES.policeFigure(f.pose)}<span>${esc(f.text)}</span></div>`).join('')}</div>` : ''}
          <a class="btn small" href="#/practice/${c.id}">Ushtro këtë temë →</a>
        </article>`).join('')}`;
  }

  // ---------- Tastiera ----------
  document.addEventListener('keydown', (ev) => {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const route = location.hash;
    const n = Number(ev.key);
    if (route.startsWith('#/practice') && session && session.index < session.items.length) {
      const item = session.items[session.index];
      if (n >= 1 && n <= item.order.length) pick(item, item.order[n - 1], renderPractice);
      else if (ev.key === 'Enter') {
        ev.preventDefault();
        item.checked ? nextPractice() : checkPractice();
      }
    } else if (route === '#/exam' && exam && !exam.done) {
      const item = exam.items[exam.index];
      if (n >= 1 && n <= item.order.length) pick(item, item.order[n - 1], renderExam);
      else if (ev.key === 'ArrowRight' && exam.index + 1 < exam.items.length) { exam.index++; renderExam(); }
      else if (ev.key === 'ArrowLeft' && exam.index > 0) { exam.index--; renderExam(); }
    }
  });

  // ---------- Ruteri ----------
  function route() {
    const hash = location.hash || '#/';
    const parts = hash.slice(2).split('/');
    if (parts[0] !== 'exam') stopTimer();
    window.scrollTo(0, 0);
    switch (parts[0]) {
      case 'practice':
        return startPractice(parts[1] || 'all');
      case 'exam':
        if (exam && !exam.done) {
          if (!timer) timer = setInterval(tick, 1000);
          return renderExam();
        }
        return renderExamIntro();
      case 'signs':
        return renderSigns();
      case 'learn':
        return renderLearn();
      default:
        exam = null;
        return renderHome();
    }
  }

  window.addEventListener('hashchange', route);
  route();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
