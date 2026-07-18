// ─────────────────────────────────────────────────────────────
//  head.js — shared <head> bootstrap, loaded synchronously as the
//  first script on every page (required by the strict CSP: no
//  inline scripts are allowed).
//
//  1) Embed mode: when a page is opened inside the landing-page
//     modal (?embed=1), tag <html> so page chrome is hidden via CSS.
//     Must run before first paint — hence the synchronous load.
//  2) Language gate: if the visitor previously chose a non-English
//     language, tag <html> early so CSS can hide the body until
//     i18n.js applies the translation — preventing a flash of the
//     English text baked into the HTML. A safety timer clears the
//     gate even if i18n.js fails, so content can never stay hidden.
//  3) Google Analytics (gtag) init. Embedded pages skip the
//     pageview so modal opens don't double-count visits.
// ─────────────────────────────────────────────────────────────
(function () {
    var html = document.documentElement;

    var isEmbed = new URLSearchParams(location.search).has('embed');
    if (isEmbed) html.classList.add('embed');

    // Language gate (see note 2). English needs no swap, so no gate.
    try {
        var lang = localStorage.getItem('amt-lang');
        if (lang && lang !== 'en') {
            html.setAttribute('lang', lang);
            html.classList.add('i18n-pending');
            setTimeout(function () { html.classList.remove('i18n-pending'); }, 1500);
        }
    } catch (e) { /* localStorage blocked — stay English, no gate */ }

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-4NVXQ1EYMC', isEmbed ? { send_page_view: false } : {});
})();
