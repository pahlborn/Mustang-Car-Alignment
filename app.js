/**
 * app.js - gemeinsames Verhalten aller Seiten.
 *
 * Alle Seiten laden dieselbe Datei. Im Vorbild gt40-engine steht dieser Teil
 * dreimal als Inline-Script in den Seiten - eine Korrektur muss dort an drei
 * Stellen nachgezogen werden, und convPower() steht dort tatsaechlich dreimal.
 * jerico hat es herausgeloest, aber erst nachtraeglich. Hier liegt es von
 * Anfang an zentral.
 *
 * Erwartet im <head> geladen: version.js, changelog.js, field-sync.js,
 * validation.js, errorlog.js
 *
 * Speicher (eigene Kennung - die Schwesterprojekte liegen auf derselben
 * Origin und wuerden sich sonst gegenseitig ueberschreiben):
 *   chassisSetup           Messwerte und Eingabefelder
 *   chassisLang            zuletzt gewaehlte Sprache
 *   chassis_gist_id        Gist fuer den Geraeteabgleich
 *   chassis_collapse_<s>   Klappzustand je Seite
 *   chassis_scroll_<s>     Scrollposition je Seite
 *   gh_token               GitHub-Token (mit den Schwesterprojekten geteilt)
 */
(function () {
    'use strict';

    // ==== KONFIGURATION ====
    var GIST_FILENAME = 'mustang-chassis-setup.json';
    var STORAGE_KEY = 'chassisSetup';
    var GIST_ID_KEY = 'chassis_gist_id';
    var PAGE = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    var COLLAPSE_KEY = 'chassis_collapse_' + PAGE;
    var SCROLL_KEY = 'chassis_scroll_' + PAGE;

    // Keine fest verdrahtete Gist-ID: dieses Projekt bekommt seinen eigenen,
    // und welcher das ist, weiss erst der Nutzer. Bis dahin laeuft alles lokal.
    window.FIXED_GIST_ID = localStorage.getItem(GIST_ID_KEY) || '';

    var isLoading = false;
    // Erst wenn die Daten im DOM stehen, darf ein leeres Feld als "bewusst
    // geleert" gewertet werden. Vorher sind alle Felder leer, weil noch nichts
    // geladen ist - ein Save in dem Moment wuerde alles ausradieren.
    var dataLoaded = false;
    var autoSaveTimer = null;

    function getGistConfig() { return { token: localStorage.getItem('gh_token') || '' }; }
    function isGistConfigured() { return getGistConfig().token.length > 0 && !!window.FIXED_GIST_ID; }

    // ==== VERSION ====
    function renderAppVersion() {
        var v = (typeof APP_VERSION === 'string') ? APP_VERSION : '';
        var gebaut = (typeof formatBuilt === 'function') ? formatBuilt() : '';
        // Nummer und Freigabezeitpunkt stehen getrennt, damit sie
        // unterschiedlich gewichtet werden koennen: die Nummer sagt, welcher
        // Stand das ist, der Zeitstempel, ob ein Geraet ihn schon geladen hat.
        document.querySelectorAll('#appVersion, .app-version').forEach(function (el) {
            el.textContent = v;
        });
        document.querySelectorAll('.ht-built, .app-built').forEach(function (el) {
            el.textContent = gebaut;
            el.title = gebaut ? ('Freigegeben ' + APP_BUILT) : '';
        });
    }

    // ==== TOAST ====
    /**
     * @param {string} msg
     * @param {object} [opts]
     * @param {boolean} [opts.sticky]  - bleibt stehen bis manuell geschlossen
     * @param {boolean} [opts.isError] - wird ins Fehlerprotokoll geschrieben
     * @param {object}  [opts.detail]  - Statuscode, Antworttext, Stack
     *
     * Erfolgsmeldungen gibt es bewusst nicht: der gruene Badge im Header sagt
     * dasselbe, ohne den Blick zu verlangen.
     */
    function showToast(msg, opts) {
        opts = opts || {};
        var t = document.getElementById('toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'toast';
            t.className = 'toast';
            document.body.appendChild(t);
        }
        if (opts.sticky || opts.isError) {
            t.innerHTML = '';
            var s = document.createElement('span');
            s.textContent = msg;
            var b = document.createElement('button');
            b.className = 'toast-close';
            b.type = 'button';
            b.innerHTML = '&times;';
            b.onclick = function () { t.classList.remove('show'); };
            t.appendChild(s); t.appendChild(b);
        } else {
            t.textContent = msg;
        }
        t.classList.toggle('toast-error', !!opts.isError);
        t.classList.add('show');
        clearTimeout(t._timer);
        if (!opts.sticky && !opts.isError) {
            t._timer = setTimeout(function () { t.classList.remove('show'); }, 2500);
        }
        // errorlog.js schreibt zuerst lokal; der Gist ist nur der Spiegel.
        if (opts.isError && typeof ErrorLog !== 'undefined') ErrorLog.add(msg, opts.detail);
    }

    /**
     * Optionaler Gist-Spiegel des Fehlerprotokolls.
     *
     * In jerico schrieb der Vorgaenger den Eintrag ausschliesslich in den Gist
     * - und las ihn vorher von dort. Beim Sync-Fehler, dem haeufigsten Fall,
     * schlug beides fehl und es wurde nichts protokolliert. Jetzt liegt der
     * Puffer lokal; schlaegt der Spiegel fehl, bleibt der Eintrag erhalten.
     */
    function spiegleProtokollInGist(eintraege) {
        if (!isGistConfigured() || !navigator.onLine) return;
        var logFile = GIST_FILENAME.replace('.json', '-errors.json');
        var files = {};
        files[logFile] = { content: JSON.stringify(eintraege, null, 2) };
        return fetch('https://api.github.com/gists/' + window.FIXED_GIST_ID, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + getGistConfig().token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ files: files })
        }).catch(function () { /* lokal ist der Eintrag bereits sicher */ });
    }
    if (typeof ErrorLog !== 'undefined') ErrorLog.spiegelSetzen(spiegleProtokollInGist);

    // ==== DATEN ====
    function collectData() { return FieldSync.collectFields(document); }

    function applyData(data) {
        isLoading = true;
        document.querySelectorAll('[data-field]').forEach(function (el) {
            var v = data[el.dataset.field];
            if (v === undefined) return;
            if (el.type === 'checkbox') el.checked = !!v;
            else el.value = v;
        });
        isLoading = false;
    }

    function saveFieldsLocal() {
        var existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        var merged = FieldSync.mergeIntoExisting(existing, collectData(), { recordClears: dataLoaded });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
    }

    async function saveData() {
        var merged = saveFieldsLocal();
        updateSaveStatus();
        if (!isGistConfigured() || !navigator.onLine) return;   // still lokal
        try {
            var files = {};
            files[GIST_FILENAME] = { content: JSON.stringify(merged, null, 2) };
            var res = await fetch('https://api.github.com/gists/' + window.FIXED_GIST_ID, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + getGistConfig().token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ files: files })
            });
            if (!res.ok) {
                // Erst den Rohtext, dann der Versuch, ihn als JSON zu lesen:
                // res.json() verbraucht den Koerper, und genau der Rohtext ist
                // es, der bei einem unerwarteten Fehler weiterhilft.
                var roh = ''; try { roh = await res.text(); } catch (e) {}
                var errText = ''; try { errText = (JSON.parse(roh).message) || ''; } catch (e) {}
                showToast('Sync-Fehler: ' + (errText || 'Status ' + res.status), {
                    sticky: true, isError: true,
                    detail: { quelle: 'saveData', status: res.status, statusText: res.statusText, antwort: roh }
                });
            }
        } catch (err) {
            showToast('Sync-Fehler: ' + err.message, {
                sticky: true, isError: true,
                detail: { quelle: 'saveData', stack: err.stack }
            });
        }
    }

    function autoSave() {
        if (isLoading) return;
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveData, 800);
    }

    async function syncFromCloud() {
        if (!isGistConfigured()) { openSettings(); return; }
        isLoading = true;
        try {
            var res = await fetch('https://api.github.com/gists/' + window.FIXED_GIST_ID,
                { headers: { 'Authorization': 'Bearer ' + getGistConfig().token } });
            if (!res.ok) {
                isLoading = false;
                var roh = ''; try { roh = await res.text(); } catch (e) {}
                showToast('Sync-Fehler: Status ' + res.status, {
                    sticky: true, isError: true,
                    detail: { quelle: 'syncFromCloud', status: res.status, antwort: roh }
                });
                return;
            }
            var gist = await res.json();
            var file = gist.files && gist.files[GIST_FILENAME];
            if (!file) { isLoading = false; return; }
            var cloudData = JSON.parse(file.content);
            var localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            // Pro Feld gewinnt der juengere Zeitstempel - auch ein leerer
            // Wert. Vorher galt "leer gewinnt nie", und ein geloeschter
            // Messwert kam beim naechsten Laden zurueck.
            var merged = FieldSync.mergeRecords(cloudData, localData);
            applyData(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            isLoading = false;
            updateSaveStatus();
            // Erfolg: kein Toast
        } catch (err) {
            isLoading = false;
            showToast('Sync-Fehler: ' + err.message, {
                sticky: true, isError: true,
                detail: { quelle: 'syncFromCloud', stack: err.stack }
            });
        }
    }

    function updateSaveStatus() {
        var el = document.getElementById('saveTime');
        if (!el) return;
        var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        el.textContent = data._savedAt
            ? 'Gespeichert ' + new Date(data._savedAt).toLocaleString('de-DE',
                { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
            : '';
    }

    function updateSyncBadge() {
        var b = document.getElementById('syncBadge');
        if (!b) return;
        b.innerHTML = isGistConfigured()
            ? '<span class="sync-badge online"><span class="sync-dot"></span>Cloud Sync</span>'
            : '<span class="sync-badge offline"><span class="sync-dot"></span>Lokal</span>';
    }

    function updateConnectionStatus() {
        var el = document.getElementById('connectionStatus');
        if (!el) return;
        if (isGistConfigured()) {
            var devId = typeof FieldSync !== 'undefined' ? FieldSync.getDeviceId() : '';
            el.innerHTML = 'Verbunden &mdash; Ger&auml;t: <code>' + (devId ? devId.substring(0, 12) : '?') + '</code>';
        } else if (getGistConfig().token) {
            el.textContent = 'Token gesetzt, suche Datenspeicher...';
        } else {
            el.textContent = 'Nicht verbunden';
        }
    }

    // ==== GIST EINRICHTEN ====
    async function findGistByFilename(token) {
        for (var page = 1; page <= 5; page++) {
            var res = await fetch('https://api.github.com/gists?per_page=100&page=' + page,
                { headers: { 'Authorization': 'Bearer ' + token } });
            if (!res.ok) return null;
            var list = await res.json();
            if (!list.length) return null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].files && list[i].files[GIST_FILENAME]) return list[i].id;
            }
        }
        return null;
    }

    async function createGist(token) {
        var files = {};
        files[GIST_FILENAME] = { content: localStorage.getItem(STORAGE_KEY) || '{}' };
        var res = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: 'Mustang 1966 Track Chassis Setup - Messwerte',
                public: false, files: files
            })
        });
        if (!res.ok) return null;
        return (await res.json()).id;
    }

    async function saveSettings() {
        var tokEl = document.getElementById('ghToken');
        var token = tokEl ? tokEl.value.trim() : '';
        if (!token) { showToast('Bitte Token eingeben!', { sticky: true, isError: true }); return; }
        try {
            showToast('Verbinde...');
            var res = await fetch('https://api.github.com/user', { headers: { 'Authorization': 'Bearer ' + token } });
            if (!res.ok) { showToast('Token ungueltig!', { sticky: true, isError: true }); return; }
            localStorage.setItem('gh_token', token);
            showToast('Suche Datenspeicher...');
            var gid = await findGistByFilename(token);
            if (!gid) {
                showToast('Lege neuen Datenspeicher an...');
                gid = await createGist(token);
                if (!gid) { showToast('Gist konnte nicht erstellt werden', { sticky: true, isError: true }); return; }
            }
            localStorage.setItem(GIST_ID_KEY, gid);
            window.FIXED_GIST_ID = gid;
            updateSyncBadge(); updateConnectionStatus(); closeSettings();
            // Erfolg: kein Toast, der Badge wechselt auf gruen
        } catch (err) {
            showToast('Verbindungsfehler: ' + err.message, { sticky: true, isError: true });
        }
    }

    function disconnectGist() {
        localStorage.removeItem('gh_token');
        localStorage.removeItem(GIST_ID_KEY);
        window.FIXED_GIST_ID = '';
        var tokEl = document.getElementById('ghToken');
        if (tokEl) tokEl.value = '';
        updateSyncBadge(); updateConnectionStatus();
        showToast('Verbindung getrennt.'); closeSettings();
    }

    // ==== EXPORT / IMPORT ====
    function exportJSON() {
        var data = saveFieldsLocal();
        var payload = {
            meta: {
                projekt: 'Mustang 1966 Track Chassis Setup',
                version: (typeof APP_VERSION === 'string' ? APP_VERSION : ''),
                exportiert: new Date().toISOString()
            },
            felder: data
        };
        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'chassis-setup-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function importJSON(event) {
        var file = event.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var parsed = JSON.parse(e.target.result);
                var felder = parsed.felder || parsed;
                var localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                var merged = FieldSync.mergeRecords(felder, localData);
                applyData(merged);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                updateSaveStatus();
            } catch (err) {
                showToast('Import fehlgeschlagen: ' + err.message, { sticky: true, isError: true });
            }
        };
        reader.readAsText(file);
        event.target.value = '';   // damit dieselbe Datei erneut gewaehlt werden kann
    }

    // ==== AUF- UND ZUKLAPPEN ====
    function saveCollapseState() {
        var state = {};
        document.querySelectorAll('.section-body').forEach(function (b, i) {
            if (b.classList.contains('collapsed')) state['sb_' + i] = 1;
        });
        try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function restoreCollapseState() {
        var raw = localStorage.getItem(COLLAPSE_KEY);
        if (!raw) return;
        try {
            var state = JSON.parse(raw);
            document.querySelectorAll('.section-body').forEach(function (b, i) {
                var zu = !!state['sb_' + i];
                b.classList.toggle('collapsed', zu);
                var head = b.previousElementSibling;
                if (head && head.classList.contains('section-header')) head.classList.toggle('collapsed', zu);
            });
        } catch (e) {}
    }

    function toggleSection(header) {
        header.classList.toggle('collapsed');
        var body = header.nextElementSibling;
        if (body) body.classList.toggle('collapsed');
        saveCollapseState();
    }

    function toggleGroup(btn, groupId) {
        var el = document.getElementById(groupId);
        var zu = btn.textContent.indexOf('ein') > -1;
        while (el && (el = el.nextElementSibling)) {
            if (el.classList.contains('group-divider')) break;
            if (!el.classList.contains('section')) continue;
            var head = el.querySelector('.section-header');
            var body = el.querySelector('.section-body');
            if (head) head.classList.toggle('collapsed', zu);
            if (body) body.classList.toggle('collapsed', zu);
        }
        btn.textContent = zu ? 'Alles aufklappen' : 'Alles einklappen';
        saveCollapseState();
    }

    // ==== WERKZEUGMENUE UND DIALOGE ====
    function toggleToolMenu() {
        var m = document.getElementById('toolMenu');
        if (m) m.style.display = m.style.display === 'block' ? 'none' : 'block';
    }
    function closeToolMenu() {
        var m = document.getElementById('toolMenu');
        if (m) m.style.display = 'none';
    }
    document.addEventListener('click', function (e) {
        var m = document.getElementById('toolMenu');
        if (!m || m.style.display !== 'block') return;
        if (e.target.closest('#toolMenu') || e.target.closest('#toolMenuBtn')) return;
        closeToolMenu();
    });

    function openSettings() {
        var m = document.getElementById('settingsModal');
        if (!m) return;
        var tokEl = document.getElementById('ghToken');
        if (tokEl) tokEl.value = getGistConfig().token;
        updateConnectionStatus();
        m.classList.add('show');
    }
    function closeSettings() {
        var m = document.getElementById('settingsModal');
        if (m) m.classList.remove('show');
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSettings();
    });

    // ==== SCROLLPOSITION ====
    // _scrollReady verhindert, dass das Wiederherstellen selbst als Scrollen
    // gewertet wird und die gemerkte Position sofort ueberschreibt.
    var _scrollReady = false;
    var _scrollTimer = null;
    window.addEventListener('scroll', function () {
        if (!_scrollReady) return;
        clearTimeout(_scrollTimer);
        _scrollTimer = setTimeout(function () {
            try { localStorage.setItem(SCROLL_KEY, String(window.scrollY)); } catch (e) {}
        }, 200);
    });

    function restoreScroll() {
        var pos = Number(localStorage.getItem(SCROLL_KEY) || 0);
        if (pos > 0) window.scrollTo(0, pos);
        // Zweiter Anlauf: Bilder und spaet gesetzte Inhalte verschieben das
        // Layout noch, nachdem der erste Sprung schon stattgefunden hat.
        setTimeout(function () { if (pos > 0) window.scrollTo(0, pos); }, 300);
        setTimeout(function () { _scrollReady = true; }, 500);
    }

    // ==== START ====
    function init() {
        renderAppVersion();
        restoreCollapseState();
        updateSyncBadge();
        updateSaveStatus();

        var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        applyData(data);
        dataLoaded = true;      // ab jetzt zaehlt ein geleertes Feld als Aussage

        if (typeof Validation !== 'undefined') Validation.init(document);

        restoreScroll();

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(function () {});
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Beim Verlassen synchron speichern - ein asynchroner Upload kaeme nicht
    // mehr durch.
    function persist() {
        if (!dataLoaded) return;
        saveFieldsLocal();
        saveCollapseState();
        try { localStorage.setItem(SCROLL_KEY, String(window.scrollY)); } catch (e) {}
    }
    window.addEventListener('beforeunload', persist);
    window.addEventListener('pagehide', persist);

    // Zurueck aus dem bfcache: Zustand wiederherstellen.
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) { restoreCollapseState(); restoreScroll(); }
    });

    // Verbindung wieder da - still nachschieben.
    window.addEventListener('online', function () { if (dataLoaded) saveData(); });

    // ==== EXPORT ====
    window.showToast = showToast;
    window.getGistConfig = getGistConfig;
    window.isGistConfigured = isGistConfigured;
    window.updateSaveStatus = updateSaveStatus;
    window.autoSave = autoSave;
    window.saveData = saveData;
    window.syncFromCloud = syncFromCloud;
    window.saveSettings = saveSettings;
    window.disconnectGist = disconnectGist;
    window.openSettings = openSettings;
    window.closeSettings = closeSettings;
    window.toggleToolMenu = toggleToolMenu;
    window.closeToolMenu = closeToolMenu;
    window.toggleSection = toggleSection;
    window.toggleGroup = toggleGroup;
    window.exportJSON = exportJSON;
    window.importJSON = importJSON;
})();
