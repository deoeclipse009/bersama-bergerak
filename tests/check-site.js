const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
// Functional check of every page (ID + EN): links, menu, language switch, quizzes, checks, signal log, lead form.
// Run: node tests/check-site.js  (needs Playwright + Chromium)
const ROOT = path.resolve(__dirname, '..') + '/', U = f => 'file://' + ROOT + f;
const base = ['index.html','about.html','run-safe-playground.html','schedule.html','runner-reset-guide.html','work-with-us.html'];
const pages = base.concat(['partner-brief.html'], base.map(f => 'en/' + f));
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); return c; };
let n = 0; const t = (c, m) => { n++; ok(c, m); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext();
  await ctx.addInitScript(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return null; }; window.__printed = 0; window.print = () => { window.__printed++; window.__printClass = document.body.classList.contains('printing-log'); }; });
  const errs = [];
  const external = new Set();
  for (const f of pages) {
    for (const w of [1280, 390]) {
      const p = await ctx.newPage(); await p.setViewportSize({ width: w, height: 850 });
      p.on('pageerror', e => errs.push(f + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) errs.push(f + ' console: ' + m.text()); });
      await p.goto(U(f));
      t(await p.evaluate(() => document.documentElement.scrollWidth) <= w, `${f}@${w} overflows`);
      if (w === 390) { // mobile menu
        await p.click('.nav-toggle'); t(await p.isVisible('#site-nav'), `${f} menu does not open`);
        t(await p.getAttribute('.nav-toggle', 'aria-expanded') === 'true', `${f} aria-expanded`);
        await p.click('.nav-toggle'); t(!(await p.isVisible('#site-nav')), `${f} menu does not close`);
        await p.close(); continue;
      }
      // links and anchors
      for (const x of await p.evaluate(() => [...document.querySelectorAll('a[href],link[href],script[src],img[src]')].map(e => e.getAttribute('href') || e.getAttribute('src')))) {
        if (/^https?:/.test(x)) { external.add(x.split('?')[0]); continue; }
        const [file, hash] = x.split('#'); const target = file ? path.resolve(path.dirname(ROOT + f), file) : ROOT + f;
        t(fs.existsSync(target), `${f}: missing ${x}`);
        if (hash && fs.existsSync(target)) t(fs.readFileSync(target, 'utf8').includes(`id="${hash}"`), `${f}: missing anchor ${x}`);
      }
      // quizzes
      const quizzes = await p.$$('[data-quiz]');
      for (let q = 0; q < quizzes.length; q++) {
        const ids = await quizzes[q].$$eval('button[data-result]', bs => bs.map(x => x.dataset.result));
        for (const id of ids) {
          await p.click(`button[data-result="${id}"]`);
          const st = await quizzes[q].evaluate((el, id) => ({ shown: [...el.querySelectorAll('.result')].filter(r => !r.hidden).map(r => r.id), pressed: el.querySelector(`button[data-result="${id}"]`).getAttribute('aria-pressed'), text: (document.getElementById(id) || {}).innerText || '' }), id);
          t(st.shown.length === 1 && st.shown[0] === id && st.pressed === 'true' && st.text.trim().length > 20, `${f}: quiz option ${id} -> ${JSON.stringify(st.shown)}`);
          n++;
        }
      }
      // two-option checks
      const tools = await p.$$('[data-check]');
      for (let k = 0; k < tools.length; k++) {
        const tool = tools[k]; const rows = await tool.$$('.toggle-row');
        const state = () => tool.evaluate(el => ({ hint: !el.querySelector('.check-hint').hidden, flag: !el.querySelector('.check-flag').hidden, ok: !el.querySelector('.check-ok').hidden, items: [...el.querySelectorAll('.check-flag li')].map(l => l.textContent) }));
        await (await rows[0].$('[data-v="ok"]')).click();
        let s = await state(); t(s.hint && !s.flag && !s.ok, `${f} check${k}: partial answer state ${JSON.stringify(s)}`);
        for (const r of rows) await (await r.$('[data-v="ok"]')).click();
        s = await state(); t(s.ok && !s.flag && !s.hint, `${f} check${k}: all-ok state ${JSON.stringify(s)}`);
        await (await rows[1].$('[data-v="flag"]')).click(); await (await rows[3].$('[data-v="flag"]')).click();
        s = await state(); t(s.flag && !s.ok && s.items.length === 2, `${f} check${k}: flagged state ${JSON.stringify(s)}`);
        await (await rows[1].$('[data-v="ok"]')).click();
        s = await state(); t(s.items.length === 1, `${f} check${k}: unflag updates list`);
      }
      // signal log
      if (await p.$('#signal-log')) {
        await p.fill('#lg-race', 'UGM Trail Run'); await p.fill('#lg-good', 'Pace stabil'); await p.check('#signal-log .log-acts input >> nth=2');
        await p.reload();
        t(await p.inputValue('#lg-race') === 'UGM Trail Run' && await p.inputValue('#lg-good') === 'Pace stabil' && await p.isChecked('#signal-log .log-acts input >> nth=2'), `${f}: log not restored after reload`);
        await p.click('[data-print-log]');
        const pr = await p.evaluate(() => [window.__printed, window.__printClass, document.body.classList.contains('printing-log')]);
        t(pr[0] === 1 && pr[1] === true && pr[2] === false, `${f}: print log ${pr}`);
        await p.click('[data-clear-log]'); await p.reload();
        t(await p.inputValue('#lg-race') === '' && !(await p.isChecked('#signal-log .log-acts input >> nth=2')), `${f}: log not cleared`);
      }
      // lead form
      if (await p.$('#lead-form')) {
        await p.click('#lead-form button[type=submit]');
        t((await p.evaluate(() => window.__opened.length)) === 0 && !(await p.isVisible('#lead-success')), `${f}: empty form was accepted`);
        await p.check('#lead-form input[name=interest] >> nth=1'); await p.fill('#lf-name', 'Tes'); await p.fill('#lf-wa', '0812'); await p.fill('#lf-org', 'UGM');
        await p.click('#lead-form button[type=submit]');
        const url = decodeURIComponent(await p.evaluate(() => window.__opened[0] || ''));
        t(url.startsWith('https://wa.me/6289627609295?text=') && url.includes('Tes') && url.includes('UGM'), `${f}: whatsapp url ${url.slice(0, 60)}`);
        t(await p.isVisible('#lead-success') && (await p.textContent('#lead-summary')).includes('Tes'), `${f}: success message`);
        t(f.startsWith('en/') ? url.includes('Interested in') : url.includes('Tertarik dengan'), `${f}: whatsapp message language`);
      }
      // language switch
      const sw = await p.getAttribute('.lang-switch', 'href');
      await p.click('.lang-switch'); await p.waitForLoadState();
      const exp = f === 'partner-brief.html' ? 'en/index.html' : (f.startsWith('en/') ? f.slice(3) : 'en/' + f);
      t(p.url() === U(exp), `${f}: language switch went to ${p.url()} (href ${sw})`);
      await p.close();
    }
  }
  console.log('checks run:', n);
  console.log('external links (not fetched from sandbox):', [...external].filter(x => !/fonts|wa\.me/.test(x)));
  console.log('page errors:', errs.length ? errs : 'none');
  console.log(fails.length ? 'FAILURES:\n' + fails.join('\n') : 'ALL PASSED');
  await b.close();
})();
