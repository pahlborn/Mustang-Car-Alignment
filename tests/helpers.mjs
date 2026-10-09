// Test-Infrastruktur: statischer Server, Browser-Setup, Mini-Assertions.
//
// Aus den Schwesterprojekten gt40-engine und jerico uebernommen. Dort steht
// zusaetzlich stubGitHub() samt Tree-Fixture fuer die Fotogalerie; das kommt
// hier erst dazu, wenn es eine Galerie gibt. Eine Fixture fuer etwas, das es
// noch nicht gibt, waere ein Test, der nie rot werden kann.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(HERE, '..');

/**
 * Browser starten. CHROMIUM_PATH erlaubt einen vorinstallierten Browser
 * (z.B. in Containern), sonst nimmt Playwright den selbst heruntergeladenen.
 *
 * Steht hier und nicht in den Testdateien: in jerico stand der Handgriff
 * zuerst nur in ui.test.mjs, und die naechste Testdatei startete ohne ihn -
 * sie lief ueberall dort nicht, wo kein Browser heruntergeladen ist.
 */
export function browserStarten(opts = {}) {
  const pfad = process.env.CHROMIUM_PATH;
  return chromium.launch(pfad ? { executablePath: pfad, ...opts } : opts);
}

/**
 * Kontext fuer einen Test. Der Service Worker bleibt aus.
 *
 * app.js registriert sw.js. Sobald der aktiv ist, laufen die Requests der
 * Seite durch ihn - und an page.route() vorbei. Stubs greifen dann nicht
 * mehr, der Aufruf scheitert als "Failed to fetch", und der Test prueft einen
 * Fehler, den er selbst erzeugt hat. In jerico wurde das erst daran sichtbar,
 * dass dieselbe Pruefung mit einer Wartezeit davor fehlschlug und ohne sie
 * nicht.
 */
export function neuerKontext(browser, opts = {}) {
  return browser.newContext({ serviceWorkers: 'block', ...opts });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf'
};

/** Statischer Server fuer das Repo-Verzeichnis, auf einem freien Port. */
export function startServer() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(REPO_ROOT, rel);
    // Kein Ausbruch aus dem Repo-Verzeichnis
    if (!file.startsWith(REPO_ROOT)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404).end('not found'); return; }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, base: 'http://127.0.0.1:' + server.address().port });
    });
  });
}

// ==== Mini-Test-Runner ====
const results = [];
let currentSuite = '';

export function suite(name) { currentSuite = name; console.log('\n' + name); }

export async function test(name, fn) {
  try {
    await fn();
    results.push({ name, suite: currentSuite, ok: true });
    console.log('  PASS  ' + name);
  } catch (err) {
    results.push({ name, suite: currentSuite, ok: false, err });
    console.log('  FAIL  ' + name);
    console.log('        ' + String(err && err.message || err).split('\n')[0]);
  }
}

export function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion fehlgeschlagen');
}

export function assertEqual(actual, expected, msg) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) throw new Error((msg ? msg + ': ' : '') + 'erwartet ' + e + ', war ' + a);
}

export function summary() {
  const failed = results.filter((r) => !r.ok);
  console.log('\n' + '-'.repeat(52));
  console.log(results.length - failed.length + '/' + results.length + ' Tests bestanden');
  if (failed.length) {
    console.log('\nFehlgeschlagen:');
    for (const f of failed) console.log('  - ' + f.name + '\n    ' + String(f.err && f.err.stack || f.err));
  }
  return failed.length;
}
