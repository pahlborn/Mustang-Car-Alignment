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
    // Die Kennung gehoert zu den Feldern, nicht zu dieser Seite - sie steht in
    // field-sync.js. Zwei Zeichenketten waeren zwei Orte (Arbeitsregel 4).
    var STORAGE_KEY = FieldSync.STORAGE_KEY;
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
        // schonProtokolliert: der Abgleich traegt seine Fehler selbst ein,
        // mit Status und Antworttext - ein zweiter Eintrag waere doppelt.
        if (opts.isError && !opts.schonProtokolliert && typeof ErrorLog !== 'undefined') {
            ErrorLog.add(msg, opts.detail);
        }
    }

    /**
     * Fehlerprotokoll im Gist - seit v21 ein Kanal im gemeinsamen Lauf von
     * abgleich.js, kein eigener Schreibvorgang mehr.
     *
     * Bis v20 schrieb jeder Fehler sofort und ungelesen in den Gist. In
     * gt40-engine wurde so ein Fehler bei jeder Eingabe zu 48
     * Schreibvorgaengen, die selbst 409 ausloesten, und der Spiegel ersetzte
     * die Eintraege der anderen Geraete. Jetzt geht er mit dem naechsten Lauf
     * mit - liegt keiner an, spaetestens nach PROTOKOLL_MS - und vereinigt die
     * Eintraege aller Geraete. Das lokale Protokoll bleibt das eigene.
     */
    var PROTOKOLL_DATEI = GIST_FILENAME.replace('.json', '-errors.json');
    var _protokollStand = null;
    var _protokollTimer = null;
    function protokollVereinigen(a, b) {
        var gesehen = {}, alle = [];
        (a || []).concat(b || []).forEach(function (e) {
            if (!e) return;
            var k = e.zeit + '|' + (e.geraet || '') + '|' + e.nachricht;
            if (gesehen[k]) return;
            gesehen[k] = 1;
            alle.push(e);
        });
        alle.sort(function (x, y) { return String(x.zeit).localeCompare(String(y.zeit)); });
        return { eintraege: alle.slice(-200) };
    }
    if (typeof Abgleich !== 'undefined' && typeof ErrorLog !== 'undefined') {
        Abgleich.anmelden({
            datei: PROTOKOLL_DATEI,
            lokal: function () {
                return protokollVereinigen(_protokollStand ? _protokollStand.eintraege : [], ErrorLog.alle());
            },
            // Bis v20 lag hier eine nackte Liste; die wird uebernommen.
            mischen: function (cloud, lokal) {
                var liste = Array.isArray(cloud) ? cloud : ((cloud && cloud.eintraege) || []);
                return protokollVereinigen(liste, lokal.eintraege);
            },
            uebernehmen: function (d) { _protokollStand = d; }
        });
        ErrorLog.spiegelSetzen(function () {
            if (_protokollTimer) return;
            var ms = (typeof Abgleich.PROTOKOLL_MS === 'number') ? Abgleich.PROTOKOLL_MS : 300000;
            _protokollTimer = setTimeout(function () {
                _protokollTimer = null;
                if (isGistConfigured() && navigator.onLine !== false) abgleichen();
            }, ms);
        });
    }

    // ==== DATEN ====
    function collectData() { return FieldSync.collectFields(document); }

    function applyData(data) {
        isLoading = true;
        FieldSync.anwenden(data);
        isLoading = false;
    }

    function saveFieldsLocal() {
        var existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        var merged = FieldSync.mergeIntoExisting(existing, collectData(), { recordClears: dataLoaded, beruehrt: FieldSync.beruehrteAbholen() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
    }

    // ==== ABGLEICH ====
    // Der Ablauf steht in abgleich.js - hier meldet sich nur der Kanal der
    // Messwerte an. Bis v17 schrieb saveData() den lokalen Stand in den Gist,
    // ohne ihn vorher zu lesen: ein Geraet mit altem Stand ueberschrieb, was
    // ein anderes eingetragen hatte.
    if (typeof Abgleich !== 'undefined') {
        Abgleich.anmelden({
            datei: GIST_FILENAME,
            // Was im Feld steht, aber noch nicht gesichert ist, bekommt jetzt
            // seinen Zeitstempel - sonst gewaenne beim Mischen der aeltere
            // Cloudwert ueber eine frische Eingabe.
            vorher: function () { if (dataLoaded) saveFieldsLocal(); },
            lokal: function () { return FieldSync.lesen(); },
            // Pro Feld gewinnt der juengere Zeitstempel - auch ein leerer Wert.
            mischen: FieldSync.mergeRecords,
            uebernehmen: function (d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
        });
    }

    function abgleichen() {
        return (typeof Abgleich !== 'undefined')
            ? Abgleich.jetzt()
            : Promise.resolve({ ok: false, grund: 'lokal' });
    }

    /** Speichern-Knopf: lokal sichern, vormerken und sofort abgleichen. */
    async function saveData() {
        saveFieldsLocal();
        updateSaveStatus();
        return (typeof Abgleich !== 'undefined')
            ? Abgleich.hochladen()
            : { ok: false, grund: 'lokal' };
    }

    // Lokal nach 0,8 s; hochgeladen wird gebuendelt (abgleich.js, seit v20).
    function autoSave() {
        if (isLoading) return;
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(function () {
            saveFieldsLocal();
            updateSaveStatus();
            if (typeof Abgleich !== 'undefined') Abgleich.planen();
        }, 800);
    }

    /** Der Knopf: alle Kanaele, und hier - anders als im Hintergrund - mit Meldung. */
    async function syncFromCloud() {
        if (!isGistConfigured()) { openSettings(); return; }
        var r = await abgleichen();
        if (!r.ok && r.grund === 'offline') {
            showToast('Offline - abgeglichen wird, sobald wieder Verbindung besteht.');
        } else if (!r.ok) {
            // Der Fehler steht schon im Protokoll (abgleich.js).
            showToast('Sync-Fehler: ' + (r.fehler || 'unbekannt'),
                { sticky: true, isError: true, schonProtokolliert: true });
        }
        return r;
    }

    // Neue Werte aus der Cloud in die Felder tragen. Die abgeleiteten
    // Anzeigen lauschen selbst auf dasselbe Ereignis.
    document.addEventListener('daten-abgeglichen', function (e) {
        var k = (e.detail && e.detail.kanaele) || [];
        if (k.indexOf(GIST_FILENAME) === -1) return;
        applyData(FieldSync.lesen());
        updateSaveStatus();
    });
    document.addEventListener('abgleich-zustand', function () { updateSyncBadge(); });

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
        if (!isGistConfigured()) {
            b.innerHTML = '<span class="sync-badge offline"><span class="sync-dot"></span>Lokal</span>';
            return;
        }
        var z = (typeof Abgleich !== 'undefined') ? Abgleich.zustand() : { stand: 'ok' };
        var text = 'Cloud Sync', art = 'online', titel = '';
        if (z.stand === 'laeuft') text = 'gleicht ab \u2026';
        else if (z.stand === 'offline') { text = 'Offline'; art = 'offline'; }
        else if (z.stand === 'fehler') {
            text = 'Sync-Fehler'; art = 'offline';
            titel = z.fehler + (z.letzterErfolg
                ? ' \u2013 zuletzt erfolgreich ' + new Date(z.letzterErfolg).toLocaleString('de-DE')
                : '');
        }
        else if (z.stand === 'veraltet') { text = 'Neue Version \u2013 l\u00e4dt neu'; art = 'offline'; titel = z.fehler; }
        // Seit v20: Liegt etwas nur auf diesem Geraet, sagt der Kopf es. Es
        // wird automatisch nachgeholt.
        var nichtOben = z.ungesendet && z.stand !== 'laeuft' && z.stand !== 'veraltet';
        if (nichtOben) {
            text = (z.stand === 'fehler' ? 'Sync-Fehler \u2013 ' : z.stand === 'offline' ? 'Offline \u2013 ' : '')
                + 'Nicht hochgeladen';
            art = 'offline';
            titel = (titel ? titel + ' \u2013 ' : '') + 'Noch nicht in der Cloud, wird automatisch nachgeholt';
        }
        titel = titel.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        b.innerHTML = '<span class="sync-badge ' + art + '"' + (titel ? ' title="' + titel + '"' : '')
            + (nichtOben ? ' style="background:#dd6b20;color:#fff"' : '')
            + ' data-stand="' + z.stand + '" data-ungesendet="' + (z.ungesendet ? '1' : '0') + '"><span class="sync-dot"></span>' + text + '</span>';
    }

    function updateConnectionStatus() {
        var el = document.getElementById('connectionStatus');
        if (!el) return;
        if (isGistConfigured()) {
            var devId = typeof FieldSync !== 'undefined' ? FieldSync.getDeviceId() : '';
            el.innerHTML = 'Verbunden &mdash; Ger&auml;t: <code>' + (devId ? devId.substring(0, 12) : '?') + '</code>';
        } else if (getGistConfig().token) {
            // Ein Ruhezustand, kein Vorgang: hier sucht nichts (wie jerico v28).
            el.textContent = 'Token gesetzt, aber kein Datenspeicher verbunden - Werte bleiben auf diesem Geraet.';
        } else {
            el.textContent = 'Nicht verbunden';
        }
    }

    // ==== GIST EINRICHTEN ====
    //
    // Pruefen, suchen, anlegen und speichern macht github-zugang.js - wortgleich
    // in gt40, jerico und alignment (v27). Hier steht nur, was diese App
    // braucht: den Haken "gist" fuer den Cloud-Sync, Fotos gibt es keine.
    GithubZugang.einrichten({
        app: 'alignment',
        datei: GIST_FILENAME,
        beschreibung: 'Mustang 1966 Track Chassis Setup - Messwerte',
        gistIdKey: GIST_ID_KEY,
        pflicht: ['gist'],
        zusatz: {},
        startInhalt: function () { return localStorage.getItem(STORAGE_KEY) || '{}'; }
    });

    async function saveSettings() {
        var tokEl = document.getElementById('ghToken');
        var r = await GithubZugang.verbinden(tokEl ? tokEl.value : '', { melden: showToast });
        updateConnectionStatus();
        if (!r.ok) return;
        window.FIXED_GIST_ID = r.gistId;
        updateSyncBadge(); updateConnectionStatus(); closeSettings();
        // Gleich holen, was die anderen Geraete schon eingetragen haben.
        abgleichen();
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
                // Bis v18 blieb der Import auf diesem Geraet, bis zufaellig ein
                // Abgleich lief.
                if (typeof Abgleich !== 'undefined') Abgleich.planen();
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

        // Service Worker und neue Versionen: aktualisieren.js (seit v22). Bis
        // dahin wurde hier nur angemeldet - eine offene Seite behielt ihren
        // Code, bis man sie von Hand neu lud.

        // Beim Oeffnen holen, was andere Geraete eingetragen haben. Bis v17
        // geschah das nur per Knopf. Einen Takt spaeter, damit die Seiten-
        // module ihre Felder gebaut haben.
        setTimeout(abgleichen, 0);
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
        if (e.persisted) { restoreCollapseState(); restoreScroll(); abgleichen(); }
    });

    // Verbindung wieder da: das steht jetzt in abgleich.js und schiebt alle
    // Kanaele nach, nicht nur die Messwerte.

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
