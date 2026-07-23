// ─────────────────────────────────────────────────────────────
//  i18n.js — lightweight, dependency-free internationalisation.
//
//  • English is the source of truth and ships inline in the HTML,
//    so English / first visits need no work (no flash, no swap).
//  • Non-English dictionaries list ONLY the keys that differ from
//    English; anything missing falls back to the English string.
//  • Elements opt in via attributes:
//       data-i18n="key"                 → textContent
//       data-i18n-html="key"            → innerHTML (trusted author
//                                         strings only — e.g. a link)
//       data-i18n-attr="attr:key;attr2:key2" → setAttribute per pair
//  • The visitor's choice is saved in localStorage('amt-lang') and
//    re-applied early by head.js (which also hides the body until we
//    reveal it here, preventing a flash of the inline English).
//
//  Translations are machine-authored — a native review is advisable
//  before treating them as final.
// ─────────────────────────────────────────────────────────────
(function () {
    'use strict';

    var STORAGE_KEY = 'amt-lang';

    // Order here is the order shown in the dropdown.
    var LANGS = [
        { code: 'en', label: 'English',            short: 'EN',   locale: 'en-US' },
        { code: 'id', label: 'Bahasa Indonesia',   short: 'ID',   locale: 'id-ID' },
        { code: 'ru', label: 'Русский',            short: 'RU',   locale: 'ru-RU' },
        { code: 'zh', label: '中文',                short: '中文', locale: 'zh-CN' },
        { code: 'es', label: 'Español',            short: 'ES',   locale: 'es-ES' },
        { code: 'pt', label: 'Português (BR)',     short: 'PT',   locale: 'pt-BR' },
    ];

    // ── Dictionaries ─────────────────────────────────────────
    var TRANSLATIONS = {
        // English = canonical source of truth (complete set).
        en: {
            'nav.features': 'Features',
            'nav.modspack': 'ModsPack',
            'nav.whatsnew': "What's New",
            'nav.faq': 'FAQ',
            'nav.download': 'Download',
            'nav.home': 'Home',
            'nav.updates': 'Updates',
            'nav.language': 'Change language',
            'nav.toggle': 'Toggle navigation',

            'hero.available': 'available',
            'hero.openSource': 'Open source',
            'hero.titleLine1': 'Dota 2 Mod',
            'hero.titleLine2': 'Manager.',
            'hero.sub': 'Install, manage, and organize Dota 2 cosmetic mods with a sleek one-click desktop app — backed by an always-updated ModsPack. Free forever.',
            'hero.ctaDownloads': 'Go to Downloads',
            'hero.ctaModspack': 'View ModsPack',
            'hero.statDownloads': 'Downloads',
            'hero.statHeroes': 'Hero Mods',
            'hero.statFree': 'Free',

            'features.headLine1': 'Everything you need,',
            'features.headLine2': 'in a single app',
            'features.headSub': 'ArdysaModsTools handles the whole modding workflow — from installing skins to keeping them updated — in one free, easy-to-use desktop app.',
            'features.tablist': 'App features',
            'features.tab1Title': 'One-Click Install',
            'features.tab1Desc': 'Apply the full ModsPack in a single click',
            'features.tab2Title': 'Mod Manager',
            'features.tab2Desc': 'Pick skins per hero — mix & match freely',
            'features.tab3Title': 'Auto Updates',
            'features.tab3Desc': 'Stay in sync after every Dota 2 patch',

            'modspack.headLine1': 'One ModsPack,',
            'modspack.headLine2': 'every hero covered',
            'modspack.headSub': 'Curated skins for the whole hero pool, refreshed regularly.',
            'modspack.latestUpdate': 'Latest update:',
            'modspack.browseAll': 'Browse all heroes',
            'modspack.more': 'more',
            'modspack.browseFallback': 'Browse the ModsPack',

            'trust.head': 'Built in the open',
            'trust.sub': 'No hidden magic — a desktop tool that mods your Dota 2 cosmetics locally, and puts everything back the way it was whenever you want.',
            'trust.item1Title': 'Source on GitHub',
            'trust.item1Desc': 'The app and every release are public on GitHub — fork it, audit it, build on it.',
            'trust.item2Title': 'Fully reversible',
            'trust.item2Desc': "Disable mods or restore Dota 2's default skins anytime, right from the app.",
            'trust.item3Title': 'Actively maintained',
            'trust.item3Desc': 'Frequent ModsPack refreshes and app updates, driven by the community.',

            'faq.head': 'Common questions',
            'faq.sub': 'Everything you need to know before getting started.',
            'faq.q1': 'Is ArdysaModsTools free?',
            'faq.a1': "Yes — the app and the ModsPack are completely free. Download the installer or the portable build and you're good to go. No sign-up, no paywalls.",
            'faq.q2': 'How do I install mods?',
            'faq.a2': 'Download and run ArdysaModsTools, let it detect your Dota 2 installation, then apply the ModsPack or pick skins per hero — the app handles the rest in one click.',
            'faq.q3': 'Do mods still work after a Dota 2 update?',
            'faq.a3': 'Game patches can reset modded files. When that happens, just re-apply your mods from the app — and keep an eye on <a href="whatsnew" data-modal data-modal-title="What\'s New" data-modal-icon="ti-bolt">What\'s New</a> for updated ModsPack releases.',
            'faq.q4': 'How do I uninstall or restore default skins?',
            'faq.a4': "The app can disable mods or restore Dota 2's original files at any time — no manual file digging required.",
            'faq.q5': 'Are the mods visual only?',
            'faq.a5': 'Yes. These are client-side cosmetic changes — only you see them, and gameplay is not affected.',
            'faq.q6': 'Where can I get help?',
            'faq.a6': 'The community lives on <a href="https://discord.gg/ffXw265Z7e" target="_blank" rel="noopener">Discord</a> — support, mod showcases, and ModsPack news all land there first.',
            'faq.askDiscord': 'More questions? Ask on Discord',

            'cta.head': 'Ready to mod your Dota 2?',
            'cta.sub': 'Download ArdysaModsTools and get started within minutes. No sign-up required.',
            'cta.installer': 'Download Installer',
            'cta.portable': 'Portable (.zip)',
            'cta.specPlatform': 'Platform',
            'cta.specVersion': 'Version',
            'cta.specPrice': 'Price',

            'modal.openFull': 'Open full page',

            'footer.brandTagline': 'A free desktop app for modding Dota 2 cosmetics — install, manage, and organize hero skins with one click.',
            'footer.product': 'Product',
            'footer.community': 'Community',
            'footer.resources': 'Resources',
            'footer.releases': 'Releases',
            'footer.reportIssue': 'Report an issue',
            'footer.rights': '© 2025-2026 Ardysa — All rights reserved',
            'footer.rightsShort': '© 2025-2026 Ardysa. All rights reserved.',
            'footer.trademark': 'Dota 2 is a trademark of Valve Corporation. Not affiliated with Valve.',

            'download.latestRelease': 'Latest release',
            'download.titleLine1': 'Download',
            'download.sub': 'Install, manage, and organize Dota 2 cosmetic mods — ready to go in under a minute.',
            'download.forWindows': 'Download for Windows',
            'download.autoUpdates': 'Installer includes automatic updates',
            'download.downloadsWord': 'downloads',
            'download.olderHead': 'Need an older version?',
            'download.olderSub': "Portable .zip downloads of past releases, kept around for compatibility. They no longer receive bug fixes or security updates, and won't automatically update.",
            'download.portableZip': 'Portable .zip',
            'download.browseAllReleases': 'Browse all releases on GitHub',
            'download.emptyHistory': 'No older releases available right now — check the GitHub releases page.',

            'updates.tag': 'Latest Changes',
            'updates.head': 'ModsPack Updates',
            'updates.sub': 'Stay up to date with the newest hero skins and improvements',
            'updates.dlMega': 'Download ModsPack (Mega)',
            'updates.dlMirror': 'Mirror (Mediafire)',
            'updates.searchPlaceholder': 'Search hero...',
            'updates.filterAll': 'Show All',
            'updates.filterStrength': 'Strength',
            'updates.filterAgility': 'Agility',
            'updates.filterIntelligence': 'Intelligence',
            'updates.filterUniversal': 'Universal',
            'updates.loading': 'Loading updates...',
            'updates.errorLoad': 'Unable to load updates at this time.',
            'updates.noResults': 'No updates found matching your criteria.',

            'whatsnew.tag': 'Changelog',
            'whatsnew.head': "What's New",
            'whatsnew.sub': 'Full release history and changelogs for ArdysaModsTools',
            'whatsnew.loading': 'Loading releases...',
            'whatsnew.latest': 'LATEST',
            'whatsnew.copyLink': 'Copy link to this release',
            'whatsnew.noReleases': 'No releases found.',
            'whatsnew.errorLoad': 'Failed to load releases. Please try again later.',
            'whatsnew.backToTop': 'Back to top',

            'notfound.head': 'Page not found',
            'notfound.sub': "The page you're looking for doesn't exist or may have moved. Let's get you back on track.",
            'notfound.backHome': 'Back to home',
        },

        // Indonesian
        id: {
            'nav.whatsnew': 'Yang Baru',
            'nav.download': 'Unduh',
            'nav.home': 'Beranda',
            'nav.updates': 'Pembaruan',
            'nav.language': 'Ganti bahasa',
            'nav.toggle': 'Alihkan navigasi',

            'hero.available': 'tersedia',
            'hero.openSource': 'Sumber terbuka',
            'hero.titleLine1': 'Pengelola Mod',
            'hero.titleLine2': 'Dota 2.',
            'hero.sub': 'Pasang, kelola, dan atur mod kosmetik Dota 2 dengan aplikasi desktop satu klik yang elegan — didukung ModsPack yang selalu diperbarui. Gratis selamanya.',
            'hero.ctaDownloads': 'Ke Unduhan',
            'hero.ctaModspack': 'Lihat ModsPack',
            'hero.statDownloads': 'Unduhan',
            'hero.statHeroes': 'Mod Hero',
            'hero.statFree': 'Gratis',

            'features.headLine1': 'Semua yang Anda butuhkan,',
            'features.headLine2': 'dalam satu aplikasi',
            'features.headSub': 'ArdysaModsTools menangani seluruh alur modding — dari memasang skin hingga menjaganya tetap diperbarui — dalam satu aplikasi desktop gratis yang mudah digunakan.',
            'features.tablist': 'Fitur aplikasi',
            'features.tab1Title': 'Pasang Satu Klik',
            'features.tab1Desc': 'Terapkan seluruh ModsPack dengan satu klik',
            'features.tab2Title': 'Pengelola Mod',
            'features.tab2Desc': 'Pilih skin per hero — campur & padukan sesuka hati',
            'features.tab3Title': 'Pembaruan Otomatis',
            'features.tab3Desc': 'Tetap sinkron setiap kali ada patch Dota 2',

            'modspack.headLine1': 'Satu ModsPack,',
            'modspack.headLine2': 'mencakup semua hero',
            'modspack.headSub': 'Skin pilihan untuk seluruh daftar hero, diperbarui secara berkala.',
            'modspack.latestUpdate': 'Pembaruan terakhir:',
            'modspack.browseAll': 'Jelajahi semua hero',
            'modspack.more': 'lainnya',
            'modspack.browseFallback': 'Jelajahi ModsPack',

            'trust.head': 'Dibangun secara terbuka',
            'trust.sub': 'Tanpa trik tersembunyi — alat desktop yang memod kosmetik Dota 2 Anda secara lokal, dan mengembalikan semuanya seperti semula kapan pun Anda mau.',
            'trust.item1Title': 'Kode di GitHub',
            'trust.item1Desc': 'Aplikasi dan setiap rilis bersifat publik di GitHub — fork, audit, dan kembangkan.',
            'trust.item2Title': 'Sepenuhnya dapat dibatalkan',
            'trust.item2Desc': 'Nonaktifkan mod atau pulihkan skin bawaan Dota 2 kapan saja, langsung dari aplikasi.',
            'trust.item3Title': 'Aktif dipelihara',
            'trust.item3Desc': 'ModsPack dan aplikasi sering diperbarui, didorong oleh komunitas.',

            'faq.head': 'Pertanyaan umum',
            'faq.sub': 'Semua yang perlu Anda ketahui sebelum memulai.',
            'faq.q1': 'Apakah ArdysaModsTools gratis?',
            'faq.a1': 'Ya — aplikasi dan ModsPack sepenuhnya gratis. Unduh installer atau versi portabel dan Anda siap menggunakannya. Tanpa pendaftaran, tanpa paywall.',
            'faq.q2': 'Bagaimana cara memasang mod?',
            'faq.a2': 'Unduh dan jalankan ArdysaModsTools, biarkan mendeteksi instalasi Dota 2 Anda, lalu terapkan ModsPack atau pilih skin per hero — aplikasi menangani sisanya dengan satu klik.',
            'faq.q3': 'Apakah mod tetap berfungsi setelah pembaruan Dota 2?',
            'faq.a3': 'Patch game dapat mengatur ulang file yang dimod. Jika itu terjadi, cukup terapkan ulang mod Anda dari aplikasi — dan pantau <a href="whatsnew" data-modal data-modal-title="What\'s New" data-modal-icon="ti-bolt">Yang Baru</a> untuk rilis ModsPack terbaru.',
            'faq.q4': 'Bagaimana cara menghapus atau memulihkan skin bawaan?',
            'faq.a4': 'Aplikasi dapat menonaktifkan mod atau memulihkan file asli Dota 2 kapan saja — tanpa perlu mengutak-atik file secara manual.',
            'faq.q5': 'Apakah mod hanya visual?',
            'faq.a5': 'Ya. Ini adalah perubahan kosmetik sisi klien — hanya Anda yang melihatnya, dan gameplay tidak terpengaruh.',
            'faq.q6': 'Di mana saya bisa mendapatkan bantuan?',
            'faq.a6': 'Komunitas berkumpul di <a href="https://discord.gg/ffXw265Z7e" target="_blank" rel="noopener">Discord</a> — dukungan, pamer mod, dan berita ModsPack semua muncul di sana lebih dulu.',
            'faq.askDiscord': 'Ada pertanyaan lain? Tanya di Discord',

            'cta.head': 'Siap memod Dota 2 Anda?',
            'cta.sub': 'Unduh ArdysaModsTools dan mulai dalam hitungan menit. Tanpa pendaftaran.',
            'cta.installer': 'Unduh Installer',
            'cta.portable': 'Portabel (.zip)',
            'cta.specPlatform': 'Platform',
            'cta.specVersion': 'Versi',
            'cta.specPrice': 'Harga',

            'modal.openFull': 'Buka halaman penuh',

            'footer.brandTagline': 'Aplikasi desktop gratis untuk memod kosmetik Dota 2 — pasang, kelola, dan atur skin hero dengan satu klik.',
            'footer.product': 'Produk',
            'footer.community': 'Komunitas',
            'footer.resources': 'Sumber Daya',
            'footer.releases': 'Rilis',
            'footer.reportIssue': 'Laporkan masalah',
            'footer.rights': '© 2025-2026 Ardysa — Semua hak dilindungi',
            'footer.rightsShort': '© 2025-2026 Ardysa. Semua hak dilindungi.',
            'footer.trademark': 'Dota 2 adalah merek dagang Valve Corporation. Tidak berafiliasi dengan Valve.',

            'download.latestRelease': 'Rilis terbaru',
            'download.titleLine1': 'Unduh',
            'download.sub': 'Pasang, kelola, dan atur mod kosmetik Dota 2 — siap digunakan dalam waktu kurang dari semenit.',
            'download.forWindows': 'Unduh untuk Windows',
            'download.autoUpdates': 'Penginstal menyertakan pembaruan otomatis',
            'download.downloadsWord': 'unduhan',
            'download.olderHead': 'Butuh versi lama?',
            'download.olderSub': 'Unduhan .zip portabel dari rilis sebelumnya, disimpan demi kompatibilitas. Versi ini tidak lagi menerima perbaikan bug atau pembaruan keamanan, dan tidak diperbarui otomatis.',
            'download.portableZip': 'Portabel .zip',
            'download.browseAllReleases': 'Jelajahi semua rilis di GitHub',
            'download.emptyHistory': 'Belum ada rilis lama saat ini — lihat halaman rilis GitHub.',

            'updates.tag': 'Perubahan Terbaru',
            'updates.head': 'Pembaruan ModsPack',
            'updates.sub': 'Tetap ikuti skin hero terbaru dan berbagai peningkatan',
            'updates.dlMega': 'Unduh ModsPack (Mega)',
            'updates.dlMirror': 'Cermin (Mediafire)',
            'updates.searchPlaceholder': 'Cari hero...',
            'updates.filterAll': 'Tampilkan Semua',
            'updates.loading': 'Memuat pembaruan...',
            'updates.errorLoad': 'Tidak dapat memuat pembaruan saat ini.',
            'updates.noResults': 'Tidak ada pembaruan yang cocok dengan kriteria Anda.',

            'whatsnew.head': 'Yang Baru',
            'whatsnew.sub': 'Riwayat rilis lengkap dan changelog untuk ArdysaModsTools',
            'whatsnew.loading': 'Memuat rilis...',
            'whatsnew.latest': 'TERBARU',
            'whatsnew.copyLink': 'Salin tautan ke rilis ini',
            'whatsnew.noReleases': 'Tidak ada rilis ditemukan.',
            'whatsnew.errorLoad': 'Gagal memuat rilis. Silakan coba lagi nanti.',
            'whatsnew.backToTop': 'Kembali ke atas',

            'notfound.head': 'Halaman tidak ditemukan',
            'notfound.sub': 'Halaman yang Anda cari tidak ada atau mungkin telah dipindahkan. Mari kembali ke jalur yang benar.',
            'notfound.backHome': 'Kembali ke beranda',
        },

        // Russian
        ru: {
            'nav.features': 'Возможности',
            'nav.whatsnew': 'Что нового',
            'nav.download': 'Скачать',
            'nav.home': 'Главная',
            'nav.updates': 'Обновления',
            'nav.language': 'Сменить язык',
            'nav.toggle': 'Открыть меню',

            'hero.available': 'доступна',
            'hero.openSource': 'Открытый код',
            'hero.titleLine1': 'Менеджер модов',
            'hero.titleLine2': 'Dota 2.',
            'hero.sub': 'Устанавливайте, управляйте и упорядочивайте косметические моды Dota 2 в стильном настольном приложении в один клик — с постоянно обновляемым ModsPack. Бесплатно навсегда.',
            'hero.ctaDownloads': 'К загрузкам',
            'hero.ctaModspack': 'Смотреть ModsPack',
            'hero.statDownloads': 'Загрузок',
            'hero.statHeroes': 'Модов героев',
            'hero.statFree': 'Бесплатно',

            'features.headLine1': 'Всё, что нужно,',
            'features.headLine2': 'в одном приложении',
            'features.headSub': 'ArdysaModsTools берёт на себя весь процесс моддинга — от установки скинов до их обновления — в одном бесплатном и удобном настольном приложении.',
            'features.tablist': 'Возможности приложения',
            'features.tab1Title': 'Установка в один клик',
            'features.tab1Desc': 'Примените весь ModsPack одним нажатием',
            'features.tab2Title': 'Менеджер модов',
            'features.tab2Desc': 'Выбирайте скины для каждого героя — сочетайте свободно',
            'features.tab3Title': 'Автообновления',
            'features.tab3Desc': 'Оставайтесь в актуальном состоянии после каждого патча Dota 2',

            'modspack.headLine1': 'Один ModsPack,',
            'modspack.headLine2': 'все герои в комплекте',
            'modspack.headSub': 'Подобранные скины для всего пула героев, регулярно обновляются.',
            'modspack.latestUpdate': 'Последнее обновление:',
            'modspack.browseAll': 'Смотреть всех героев',
            'modspack.more': 'ещё',
            'modspack.browseFallback': 'Открыть ModsPack',

            'trust.head': 'Разработка в открытую',
            'trust.sub': 'Никакой скрытой магии — настольный инструмент, который модифицирует косметику Dota 2 локально и возвращает всё как было в любой момент.',
            'trust.item1Title': 'Исходный код на GitHub',
            'trust.item1Desc': 'Приложение и каждый релиз открыты на GitHub — форкайте, проверяйте, дорабатывайте.',
            'trust.item2Title': 'Полностью обратимо',
            'trust.item2Desc': 'Отключайте моды или восстанавливайте стандартные скины Dota 2 в любой момент прямо из приложения.',
            'trust.item3Title': 'Активная поддержка',
            'trust.item3Desc': 'Частые обновления ModsPack и приложения при участии сообщества.',

            'faq.head': 'Частые вопросы',
            'faq.sub': 'Всё, что нужно знать перед началом.',
            'faq.q1': 'ArdysaModsTools бесплатен?',
            'faq.a1': 'Да — приложение и ModsPack полностью бесплатны. Скачайте установщик или портативную версию и приступайте. Без регистрации и платных стен.',
            'faq.q2': 'Как установить моды?',
            'faq.a2': 'Скачайте и запустите ArdysaModsTools, дайте ему определить вашу установку Dota 2, затем примените ModsPack или выберите скины для каждого героя — остальное приложение сделает в один клик.',
            'faq.q3': 'Работают ли моды после обновления Dota 2?',
            'faq.a3': 'Патчи игры могут сбросить изменённые файлы. Если это произошло, просто примените моды заново из приложения — и следите за разделом <a href="whatsnew" data-modal data-modal-title="What\'s New" data-modal-icon="ti-bolt">Что нового</a>, чтобы не пропустить свежие релизы ModsPack.',
            'faq.q4': 'Как удалить моды или вернуть стандартные скины?',
            'faq.a4': 'Приложение может отключить моды или восстановить оригинальные файлы Dota 2 в любой момент — без ручного копания в файлах.',
            'faq.q5': 'Моды только визуальные?',
            'faq.a5': 'Да. Это косметические изменения на стороне клиента — их видите только вы, на игровой процесс они не влияют.',
            'faq.q6': 'Где можно получить помощь?',
            'faq.a6': 'Сообщество живёт в <a href="https://discord.gg/ffXw265Z7e" target="_blank" rel="noopener">Discord</a> — поддержка, витрины модов и новости ModsPack появляются там раньше всего.',
            'faq.askDiscord': 'Остались вопросы? Спросите в Discord',

            'cta.head': 'Готовы модифицировать Dota 2?',
            'cta.sub': 'Скачайте ArdysaModsTools и начните за считанные минуты. Регистрация не нужна.',
            'cta.installer': 'Скачать установщик',
            'cta.portable': 'Портативная (.zip)',
            'cta.specPlatform': 'Платформа',
            'cta.specVersion': 'Версия',
            'cta.specPrice': 'Цена',

            'modal.openFull': 'Открыть полную страницу',

            'footer.brandTagline': 'Бесплатное настольное приложение для моддинга косметики Dota 2 — устанавливайте, управляйте и упорядочивайте скины героев в один клик.',
            'footer.product': 'Продукт',
            'footer.community': 'Сообщество',
            'footer.resources': 'Ресурсы',
            'footer.releases': 'Релизы',
            'footer.reportIssue': 'Сообщить о проблеме',
            'footer.rights': '© 2025-2026 Ardysa — Все права защищены',
            'footer.rightsShort': '© 2025-2026 Ardysa. Все права защищены.',
            'footer.trademark': 'Dota 2 — товарный знак Valve Corporation. Не связано с Valve.',

            'download.latestRelease': 'Последний релиз',
            'download.titleLine1': 'Скачать',
            'download.sub': 'Устанавливайте, управляйте и упорядочивайте косметические моды Dota 2 — готово менее чем за минуту.',
            'download.forWindows': 'Скачать для Windows',
            'download.autoUpdates': 'Установщик включает автоматические обновления',
            'download.downloadsWord': 'загрузок',
            'download.olderHead': 'Нужна более старая версия?',
            'download.olderSub': 'Портативные .zip-загрузки прошлых релизов сохранены для совместимости. Они больше не получают исправлений ошибок и обновлений безопасности и не обновляются автоматически.',
            'download.portableZip': 'Портативная .zip',
            'download.browseAllReleases': 'Все релизы на GitHub',
            'download.emptyHistory': 'Сейчас нет старых релизов — загляните на страницу релизов GitHub.',

            'updates.tag': 'Последние изменения',
            'updates.head': 'Обновления ModsPack',
            'updates.sub': 'Следите за новейшими скинами героев и улучшениями',
            'updates.dlMega': 'Скачать ModsPack (Mega)',
            'updates.dlMirror': 'Зеркало (Mediafire)',
            'updates.searchPlaceholder': 'Поиск героя...',
            'updates.filterAll': 'Показать все',
            'updates.loading': 'Загрузка обновлений...',
            'updates.errorLoad': 'Сейчас не удаётся загрузить обновления.',
            'updates.noResults': 'Обновлений по вашему запросу не найдено.',

            'whatsnew.tag': 'История изменений',
            'whatsnew.head': 'Что нового',
            'whatsnew.sub': 'Полная история релизов и списки изменений ArdysaModsTools',
            'whatsnew.loading': 'Загрузка релизов...',
            'whatsnew.latest': 'НОВЕЙШИЙ',
            'whatsnew.copyLink': 'Скопировать ссылку на этот релиз',
            'whatsnew.noReleases': 'Релизы не найдены.',
            'whatsnew.errorLoad': 'Не удалось загрузить релизы. Повторите попытку позже.',
            'whatsnew.backToTop': 'Наверх',

            'notfound.head': 'Страница не найдена',
            'notfound.sub': 'Страница, которую вы ищете, не существует или была перемещена. Давайте вернёмся на верный путь.',
            'notfound.backHome': 'На главную',
        },

        // Chinese (Simplified)
        zh: {
            'nav.features': '功能',
            'nav.whatsnew': '更新内容',
            'nav.faq': '常见问题',
            'nav.download': '下载',
            'nav.home': '首页',
            'nav.updates': '更新',
            'nav.language': '切换语言',
            'nav.toggle': '切换导航',

            'hero.available': '现已推出',
            'hero.openSource': '开源',
            'hero.titleLine1': 'Dota 2 模组',
            'hero.titleLine2': '管理器',
            'hero.sub': '通过简洁的一键式桌面应用安装、管理和整理 Dota 2 外观模组——由持续更新的 ModsPack 支持。永久免费。',
            'hero.ctaDownloads': '前往下载',
            'hero.ctaModspack': '查看 ModsPack',
            'hero.statDownloads': '下载量',
            'hero.statHeroes': '英雄模组',
            'hero.statFree': '免费',

            'features.headLine1': '你需要的一切，',
            'features.headLine2': '尽在一个应用中',
            'features.headSub': 'ArdysaModsTools 在一个免费易用的桌面应用中处理整个模组流程——从安装皮肤到保持更新。',
            'features.tablist': '应用功能',
            'features.tab1Title': '一键安装',
            'features.tab1Desc': '一键应用整个 ModsPack',
            'features.tab2Title': '模组管理器',
            'features.tab2Desc': '为每个英雄挑选皮肤——自由搭配',
            'features.tab3Title': '自动更新',
            'features.tab3Desc': '每次 Dota 2 更新后都保持同步',

            'modspack.headLine1': '一个 ModsPack，',
            'modspack.headLine2': '覆盖每个英雄',
            'modspack.headSub': '为全部英雄精选的皮肤，定期刷新。',
            'modspack.latestUpdate': '最近更新：',
            'modspack.browseAll': '浏览所有英雄',
            'modspack.more': '更多',
            'modspack.browseFallback': '浏览 ModsPack',

            'trust.head': '公开构建',
            'trust.sub': '没有隐藏的把戏——一个在本地修改 Dota 2 外观的桌面工具，随时可将一切恢复原样。',
            'trust.item1Title': 'GitHub 上的源代码',
            'trust.item1Desc': '应用和每个版本都在 GitHub 上公开——可复刻、审查、二次开发。',
            'trust.item2Title': '完全可逆',
            'trust.item2Desc': '随时在应用中停用模组或恢复 Dota 2 的默认皮肤。',
            'trust.item3Title': '持续维护',
            'trust.item3Desc': '由社区推动，ModsPack 和应用频繁更新。',

            'faq.head': '常见问题',
            'faq.sub': '开始之前你需要了解的一切。',
            'faq.q1': 'ArdysaModsTools 免费吗？',
            'faq.a1': '是的——应用和 ModsPack 完全免费。下载安装程序或便携版即可开始。无需注册，没有付费墙。',
            'faq.q2': '如何安装模组？',
            'faq.a2': '下载并运行 ArdysaModsTools，让它检测你的 Dota 2 安装，然后应用 ModsPack 或为每个英雄挑选皮肤——其余的应用会一键完成。',
            'faq.q3': 'Dota 2 更新后模组还有效吗？',
            'faq.a3': '游戏补丁可能会重置已修改的文件。发生这种情况时，只需在应用中重新应用模组——并关注 <a href="whatsnew" data-modal data-modal-title="What\'s New" data-modal-icon="ti-bolt">更新内容</a> 获取最新的 ModsPack 版本。',
            'faq.q4': '如何卸载或恢复默认皮肤？',
            'faq.a4': '应用可随时停用模组或恢复 Dota 2 的原始文件——无需手动翻找文件。',
            'faq.q5': '模组只是视觉效果吗？',
            'faq.a5': '是的。这些是客户端外观改动——只有你能看到，不影响游戏玩法。',
            'faq.q6': '在哪里可以获得帮助？',
            'faq.a6': '社区在 <a href="https://discord.gg/ffXw265Z7e" target="_blank" rel="noopener">Discord</a>——支持、模组展示和 ModsPack 资讯都会最先发布在那里。',
            'faq.askDiscord': '还有疑问？来 Discord 提问',

            'cta.head': '准备好改造你的 Dota 2 了吗？',
            'cta.sub': '下载 ArdysaModsTools，几分钟内即可上手。无需注册。',
            'cta.installer': '下载安装程序',
            'cta.portable': '便携版 (.zip)',
            'cta.specPlatform': '平台',
            'cta.specVersion': '版本',
            'cta.specPrice': '价格',

            'modal.openFull': '打开完整页面',

            'footer.brandTagline': '一款用于修改 Dota 2 外观的免费桌面应用——一键安装、管理和整理英雄皮肤。',
            'footer.product': '产品',
            'footer.community': '社区',
            'footer.resources': '资源',
            'footer.releases': '版本',
            'footer.reportIssue': '报告问题',
            'footer.rights': '© 2025-2026 Ardysa — 保留所有权利',
            'footer.rightsShort': '© 2025-2026 Ardysa。保留所有权利。',
            'footer.trademark': 'Dota 2 是 Valve Corporation 的商标。与 Valve 无关联。',

            'download.latestRelease': '最新版本',
            'download.titleLine1': '下载',
            'download.sub': '安装、管理和整理 Dota 2 外观模组——不到一分钟即可就绪。',
            'download.forWindows': '下载 Windows 版',
            'download.autoUpdates': '安装程序包含自动更新',
            'download.downloadsWord': '次下载',
            'download.olderHead': '需要旧版本？',
            'download.olderSub': '过往版本的便携 .zip 下载，为兼容性而保留。它们不再接收错误修复或安全更新，也不会自动更新。',
            'download.portableZip': '便携版 .zip',
            'download.browseAllReleases': '在 GitHub 上浏览所有版本',
            'download.emptyHistory': '目前没有可用的旧版本——请查看 GitHub 发布页面。',

            'updates.tag': '最新变化',
            'updates.head': 'ModsPack 更新',
            'updates.sub': '及时了解最新的英雄皮肤和改进',
            'updates.dlMega': '下载 ModsPack（Mega）',
            'updates.dlMirror': '镜像（Mediafire）',
            'updates.searchPlaceholder': '搜索英雄...',
            'updates.filterAll': '显示全部',
            'updates.filterStrength': '力量',
            'updates.filterAgility': '敏捷',
            'updates.filterIntelligence': '智力',
            'updates.filterUniversal': '全才',
            'updates.loading': '正在加载更新...',
            'updates.errorLoad': '当前无法加载更新。',
            'updates.noResults': '未找到符合条件的更新。',

            'whatsnew.tag': '更新日志',
            'whatsnew.head': '更新内容',
            'whatsnew.sub': 'ArdysaModsTools 的完整版本历史与更新日志',
            'whatsnew.loading': '正在加载版本...',
            'whatsnew.latest': '最新',
            'whatsnew.copyLink': '复制此版本的链接',
            'whatsnew.noReleases': '未找到版本。',
            'whatsnew.errorLoad': '加载版本失败。请稍后再试。',
            'whatsnew.backToTop': '返回顶部',

            'notfound.head': '页面未找到',
            'notfound.sub': '你要找的页面不存在或已被移动。让我们回到正轨。',
            'notfound.backHome': '返回首页',
        },

        // Spanish
        es: {
            'nav.features': 'Funciones',
            'nav.whatsnew': 'Novedades',
            'nav.download': 'Descargar',
            'nav.home': 'Inicio',
            'nav.updates': 'Actualizaciones',
            'nav.language': 'Cambiar idioma',
            'nav.toggle': 'Alternar navegación',

            'hero.available': 'disponible',
            'hero.openSource': 'Código abierto',
            'hero.titleLine1': 'Gestor de Mods',
            'hero.titleLine2': 'Dota 2.',
            'hero.sub': 'Instala, gestiona y organiza los mods cosméticos de Dota 2 con una elegante app de escritorio de un clic — respaldada por un ModsPack siempre actualizado. Gratis para siempre.',
            'hero.ctaDownloads': 'Ir a Descargas',
            'hero.ctaModspack': 'Ver ModsPack',
            'hero.statDownloads': 'Descargas',
            'hero.statHeroes': 'Mods de héroes',
            'hero.statFree': 'Gratis',

            'features.headLine1': 'Todo lo que necesitas,',
            'features.headLine2': 'en una sola app',
            'features.headSub': 'ArdysaModsTools gestiona todo el flujo de modding — desde instalar skins hasta mantenerlos actualizados — en una app de escritorio gratuita y fácil de usar.',
            'features.tablist': 'Funciones de la app',
            'features.tab1Title': 'Instalación con un clic',
            'features.tab1Desc': 'Aplica todo el ModsPack con un solo clic',
            'features.tab2Title': 'Gestor de mods',
            'features.tab2Desc': 'Elige skins por héroe — combina a tu gusto',
            'features.tab3Title': 'Actualizaciones automáticas',
            'features.tab3Desc': 'Mantente al día tras cada parche de Dota 2',

            'modspack.headLine1': 'Un ModsPack,',
            'modspack.headLine2': 'con todos los héroes',
            'modspack.headSub': 'Skins seleccionadas para todo el elenco de héroes, actualizadas con regularidad.',
            'modspack.latestUpdate': 'Última actualización:',
            'modspack.browseAll': 'Ver todos los héroes',
            'modspack.more': 'más',
            'modspack.browseFallback': 'Explorar el ModsPack',

            'trust.head': 'Construido en abierto',
            'trust.sub': 'Sin magia oculta — una herramienta de escritorio que modifica la cosmética de Dota 2 localmente y lo deja todo como estaba cuando quieras.',
            'trust.item1Title': 'Código en GitHub',
            'trust.item1Desc': 'La app y cada versión son públicas en GitHub — bifúrcala, audítala, construye sobre ella.',
            'trust.item2Title': 'Totalmente reversible',
            'trust.item2Desc': 'Desactiva los mods o restaura las skins predeterminadas de Dota 2 cuando quieras, desde la app.',
            'trust.item3Title': 'Mantenimiento activo',
            'trust.item3Desc': 'Actualizaciones frecuentes del ModsPack y de la app, impulsadas por la comunidad.',

            'faq.head': 'Preguntas frecuentes',
            'faq.sub': 'Todo lo que necesitas saber antes de empezar.',
            'faq.q1': '¿ArdysaModsTools es gratis?',
            'faq.a1': 'Sí — la app y el ModsPack son completamente gratuitos. Descarga el instalador o la versión portable y listo. Sin registro, sin muros de pago.',
            'faq.q2': '¿Cómo instalo los mods?',
            'faq.a2': 'Descarga y ejecuta ArdysaModsTools, deja que detecte tu instalación de Dota 2, luego aplica el ModsPack o elige skins por héroe — la app hace el resto con un clic.',
            'faq.q3': '¿Los mods siguen funcionando tras una actualización de Dota 2?',
            'faq.a3': 'Los parches del juego pueden restablecer los archivos modificados. Cuando eso ocurra, vuelve a aplicar tus mods desde la app — y no pierdas de vista <a href="whatsnew" data-modal data-modal-title="What\'s New" data-modal-icon="ti-bolt">Novedades</a> para ver los ModsPack más recientes.',
            'faq.q4': '¿Cómo desinstalo o restauro las skins predeterminadas?',
            'faq.a4': 'La app puede desactivar los mods o restaurar los archivos originales de Dota 2 en cualquier momento — sin hurgar en archivos manualmente.',
            'faq.q5': '¿Los mods son solo visuales?',
            'faq.a5': 'Sí. Son cambios cosméticos del lado del cliente — solo tú los ves y no afectan a la jugabilidad.',
            'faq.q6': '¿Dónde puedo obtener ayuda?',
            'faq.a6': 'La comunidad vive en <a href="https://discord.gg/ffXw265Z7e" target="_blank" rel="noopener">Discord</a> — soporte, muestras de mods y noticias del ModsPack llegan allí primero.',
            'faq.askDiscord': '¿Más preguntas? Pregunta en Discord',

            'cta.head': '¿Listo para modificar tu Dota 2?',
            'cta.sub': 'Descarga ArdysaModsTools y empieza en cuestión de minutos. Sin registro.',
            'cta.installer': 'Descargar instalador',
            'cta.portable': 'Portable (.zip)',
            'cta.specPlatform': 'Plataforma',
            'cta.specVersion': 'Versión',
            'cta.specPrice': 'Precio',

            'modal.openFull': 'Abrir página completa',

            'footer.brandTagline': 'Una app de escritorio gratuita para modificar la cosmética de Dota 2 — instala, gestiona y organiza skins de héroes con un clic.',
            'footer.product': 'Producto',
            'footer.community': 'Comunidad',
            'footer.resources': 'Recursos',
            'footer.releases': 'Versiones',
            'footer.reportIssue': 'Reportar un problema',
            'footer.rights': '© 2025-2026 Ardysa — Todos los derechos reservados',
            'footer.rightsShort': '© 2025-2026 Ardysa. Todos los derechos reservados.',
            'footer.trademark': 'Dota 2 es una marca registrada de Valve Corporation. No afiliado con Valve.',

            'download.latestRelease': 'Última versión',
            'download.titleLine1': 'Descargar',
            'download.sub': 'Instala, gestiona y organiza los mods cosméticos de Dota 2 — listo en menos de un minuto.',
            'download.forWindows': 'Descargar para Windows',
            'download.autoUpdates': 'El instalador incluye actualizaciones automáticas',
            'download.downloadsWord': 'descargas',
            'download.olderHead': '¿Necesitas una versión anterior?',
            'download.olderSub': 'Descargas .zip portables de versiones anteriores, conservadas por compatibilidad. Ya no reciben correcciones de errores ni actualizaciones de seguridad, y no se actualizan automáticamente.',
            'download.portableZip': 'Portable .zip',
            'download.browseAllReleases': 'Ver todas las versiones en GitHub',
            'download.emptyHistory': 'No hay versiones anteriores disponibles ahora — consulta la página de versiones de GitHub.',

            'updates.tag': 'Cambios recientes',
            'updates.head': 'Actualizaciones de ModsPack',
            'updates.sub': 'Mantente al día con las skins de héroes y mejoras más recientes',
            'updates.dlMega': 'Descargar ModsPack (Mega)',
            'updates.dlMirror': 'Espejo (Mediafire)',
            'updates.searchPlaceholder': 'Buscar héroe...',
            'updates.filterAll': 'Mostrar todo',
            'updates.loading': 'Cargando actualizaciones...',
            'updates.errorLoad': 'No se pueden cargar las actualizaciones en este momento.',
            'updates.noResults': 'No se encontraron actualizaciones que coincidan con tus criterios.',

            'whatsnew.tag': 'Registro de cambios',
            'whatsnew.head': 'Novedades',
            'whatsnew.sub': 'Historial completo de versiones y registros de cambios de ArdysaModsTools',
            'whatsnew.loading': 'Cargando versiones...',
            'whatsnew.latest': 'ÚLTIMA',
            'whatsnew.copyLink': 'Copiar enlace a esta versión',
            'whatsnew.noReleases': 'No se encontraron versiones.',
            'whatsnew.errorLoad': 'No se pudieron cargar las versiones. Inténtalo de nuevo más tarde.',
            'whatsnew.backToTop': 'Volver arriba',

            'notfound.head': 'Página no encontrada',
            'notfound.sub': 'La página que buscas no existe o puede haberse movido. Volvamos al camino correcto.',
            'notfound.backHome': 'Volver al inicio',
        },

        // Portuguese (Brazil)
        pt: {
            'nav.features': 'Recursos',
            'nav.whatsnew': 'Novidades',
            'nav.download': 'Baixar',
            'nav.home': 'Início',
            'nav.updates': 'Atualizações',
            'nav.language': 'Alterar idioma',
            'nav.toggle': 'Alternar navegação',

            'hero.available': 'disponível',
            'hero.openSource': 'Código aberto',
            'hero.titleLine1': 'Gerenciador de Mods',
            'hero.titleLine2': 'Dota 2.',
            'hero.sub': 'Instale, gerencie e organize mods cosméticos de Dota 2 com um elegante app de desktop de um clique — com o apoio de um ModsPack sempre atualizado. Grátis para sempre.',
            'hero.ctaDownloads': 'Ir para Downloads',
            'hero.ctaModspack': 'Ver ModsPack',
            'hero.statDownloads': 'Downloads',
            'hero.statHeroes': 'Mods de heróis',
            'hero.statFree': 'Grátis',

            'features.headLine1': 'Tudo o que você precisa,',
            'features.headLine2': 'em um único app',
            'features.headSub': 'O ArdysaModsTools cuida de todo o fluxo de modding — da instalação de skins à manutenção das atualizações — em um app de desktop gratuito e fácil de usar.',
            'features.tablist': 'Recursos do app',
            'features.tab1Title': 'Instalação com um clique',
            'features.tab1Desc': 'Aplique todo o ModsPack com um único clique',
            'features.tab2Title': 'Gerenciador de mods',
            'features.tab2Desc': 'Escolha skins por herói — combine à vontade',
            'features.tab3Title': 'Atualizações automáticas',
            'features.tab3Desc': 'Fique em dia após cada patch do Dota 2',

            'modspack.headLine1': 'Um ModsPack,',
            'modspack.headLine2': 'com todos os heróis',
            'modspack.headSub': 'Skins selecionadas para todo o elenco de heróis, atualizadas regularmente.',
            'modspack.latestUpdate': 'Última atualização:',
            'modspack.browseAll': 'Ver todos os heróis',
            'modspack.more': 'mais',
            'modspack.browseFallback': 'Explorar o ModsPack',

            'trust.head': 'Feito de forma aberta',
            'trust.sub': 'Sem mágica oculta — uma ferramenta de desktop que modifica os cosméticos do Dota 2 localmente e coloca tudo de volta como estava sempre que você quiser.',
            'trust.item1Title': 'Código no GitHub',
            'trust.item1Desc': 'O app e cada versão são públicos no GitHub — faça fork, audite, construa em cima.',
            'trust.item2Title': 'Totalmente reversível',
            'trust.item2Desc': 'Desative os mods ou restaure as skins padrão do Dota 2 a qualquer momento, direto do app.',
            'trust.item3Title': 'Mantido ativamente',
            'trust.item3Desc': 'Atualizações frequentes do ModsPack e do app, impulsionadas pela comunidade.',

            'faq.head': 'Perguntas frequentes',
            'faq.sub': 'Tudo o que você precisa saber antes de começar.',
            'faq.q1': 'O ArdysaModsTools é grátis?',
            'faq.a1': 'Sim — o app e o ModsPack são totalmente gratuitos. Baixe o instalador ou a versão portátil e pronto. Sem cadastro, sem paywalls.',
            'faq.q2': 'Como instalo os mods?',
            'faq.a2': 'Baixe e execute o ArdysaModsTools, deixe-o detectar sua instalação do Dota 2, então aplique o ModsPack ou escolha skins por herói — o app faz o resto com um clique.',
            'faq.q3': 'Os mods continuam funcionando após uma atualização do Dota 2?',
            'faq.a3': 'Os patches do jogo podem redefinir os arquivos modificados. Quando isso acontecer, basta reaplicar seus mods pelo app — e fique de olho em <a href="whatsnew" data-modal data-modal-title="What\'s New" data-modal-icon="ti-bolt">Novidades</a> para as versões mais recentes do ModsPack.',
            'faq.q4': 'Como desinstalo ou restauro as skins padrão?',
            'faq.a4': 'O app pode desativar os mods ou restaurar os arquivos originais do Dota 2 a qualquer momento — sem mexer nos arquivos manualmente.',
            'faq.q5': 'Os mods são apenas visuais?',
            'faq.a5': 'Sim. São alterações cosméticas do lado do cliente — só você as vê, e a jogabilidade não é afetada.',
            'faq.q6': 'Onde posso obter ajuda?',
            'faq.a6': 'A comunidade fica no <a href="https://discord.gg/ffXw265Z7e" target="_blank" rel="noopener">Discord</a> — suporte, vitrines de mods e novidades do ModsPack chegam lá primeiro.',
            'faq.askDiscord': 'Mais perguntas? Pergunte no Discord',

            'cta.head': 'Pronto para modificar seu Dota 2?',
            'cta.sub': 'Baixe o ArdysaModsTools e comece em poucos minutos. Sem cadastro.',
            'cta.installer': 'Baixar instalador',
            'cta.portable': 'Portátil (.zip)',
            'cta.specPlatform': 'Plataforma',
            'cta.specVersion': 'Versão',
            'cta.specPrice': 'Preço',

            'modal.openFull': 'Abrir página completa',

            'footer.brandTagline': 'Um app de desktop gratuito para modificar cosméticos do Dota 2 — instale, gerencie e organize skins de heróis com um clique.',
            'footer.product': 'Produto',
            'footer.community': 'Comunidade',
            'footer.resources': 'Recursos',
            'footer.releases': 'Versões',
            'footer.reportIssue': 'Relatar um problema',
            'footer.rights': '© 2025-2026 Ardysa — Todos os direitos reservados',
            'footer.rightsShort': '© 2025-2026 Ardysa. Todos os direitos reservados.',
            'footer.trademark': 'Dota 2 é uma marca registrada da Valve Corporation. Não afiliado à Valve.',

            'download.latestRelease': 'Versão mais recente',
            'download.titleLine1': 'Baixar',
            'download.sub': 'Instale, gerencie e organize mods cosméticos de Dota 2 — pronto em menos de um minuto.',
            'download.forWindows': 'Baixar para Windows',
            'download.autoUpdates': 'O instalador inclui atualizações automáticas',
            'download.downloadsWord': 'downloads',
            'download.olderHead': 'Precisa de uma versão anterior?',
            'download.olderSub': 'Downloads .zip portáteis de versões anteriores, mantidos por compatibilidade. Eles não recebem mais correções de bugs ou atualizações de segurança e não se atualizam automaticamente.',
            'download.portableZip': 'Portátil .zip',
            'download.browseAllReleases': 'Ver todas as versões no GitHub',
            'download.emptyHistory': 'Nenhuma versão anterior disponível no momento — veja a página de versões no GitHub.',

            'updates.tag': 'Mudanças recentes',
            'updates.head': 'Atualizações do ModsPack',
            'updates.sub': 'Fique por dentro das skins de heróis e melhorias mais recentes',
            'updates.dlMega': 'Baixar ModsPack (Mega)',
            'updates.dlMirror': 'Espelho (Mediafire)',
            'updates.searchPlaceholder': 'Buscar herói...',
            'updates.filterAll': 'Mostrar tudo',
            'updates.loading': 'Carregando atualizações...',
            'updates.errorLoad': 'Não é possível carregar as atualizações no momento.',
            'updates.noResults': 'Nenhuma atualização encontrada com seus critérios.',

            'whatsnew.tag': 'Registro de alterações',
            'whatsnew.head': 'Novidades',
            'whatsnew.sub': 'Histórico completo de versões e registros de alterações do ArdysaModsTools',
            'whatsnew.loading': 'Carregando versões...',
            'whatsnew.latest': 'MAIS RECENTE',
            'whatsnew.copyLink': 'Copiar link para esta versão',
            'whatsnew.noReleases': 'Nenhuma versão encontrada.',
            'whatsnew.errorLoad': 'Falha ao carregar as versões. Tente novamente mais tarde.',
            'whatsnew.backToTop': 'Voltar ao topo',

            'notfound.head': 'Página não encontrada',
            'notfound.sub': 'A página que você procura não existe ou pode ter sido movida. Vamos voltar ao caminho certo.',
            'notfound.backHome': 'Voltar ao início',
        },
    };

    // ── State ────────────────────────────────────────────────
    var byCode = {};
    LANGS.forEach(function (l) { byCode[l.code] = l; });

    function readStored() {
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            return v && byCode[v] ? v : 'en';
        } catch (e) { return 'en'; }
    }

    var current = readStored();

    function t(key) {
        var dict = TRANSLATIONS[current];
        if (dict && dict[key] != null) return dict[key];
        return TRANSLATIONS.en[key] != null ? TRANSLATIONS.en[key] : key;
    }

    function localeFor(code) {
        return (byCode[code || current] || byCode.en).locale;
    }

    // ── Apply translations to a DOM subtree ─────────────────
    function apply(root) {
        root = root || document;

        root.querySelectorAll('[data-i18n]').forEach(function (el) {
            var v = t(el.getAttribute('data-i18n'));
            if (v != null) el.textContent = v;
        });

        // Trusted author markup (e.g. an inline link) — dictionary values only.
        root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var v = t(el.getAttribute('data-i18n-html'));
            if (v != null) el.innerHTML = v;
        });

        // "attr:key;attr2:key2" → setAttribute(attr, t(key))
        root.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
                var idx = pair.indexOf(':');
                if (idx === -1) return;
                var attr = pair.slice(0, idx).trim();
                var key = pair.slice(idx + 1).trim();
                if (attr && key) el.setAttribute(attr, t(key));
            });
        });
    }

    // ── Switcher UI ─────────────────────────────────────────
    function refreshLabels() {
        var meta = byCode[current] || byCode.en;
        document.querySelectorAll('[data-lang-label]').forEach(function (el) {
            el.textContent = meta.short;
        });
        document.querySelectorAll('[data-lang-menu] [data-lang]').forEach(function (opt) {
            var active = opt.getAttribute('data-lang') === current;
            opt.setAttribute('aria-selected', active ? 'true' : 'false');
            opt.classList.toggle('is-active', active);
        });
    }

    function closeAllMenus() {
        document.querySelectorAll('[data-lang-switch]').forEach(function (sw) {
            var menu = sw.querySelector('[data-lang-menu]');
            var btn = sw.querySelector('.lang-switch__btn');
            if (menu) menu.hidden = true;
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }

    function set(code) {
        if (!byCode[code]) return;
        current = code;
        try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* ignore */ }
        document.documentElement.setAttribute('lang', code);
        apply(document);
        refreshLabels();
        closeAllMenus();
        document.documentElement.classList.remove('i18n-pending');
    }

    function buildSwitch(sw) {
        var menu = sw.querySelector('[data-lang-menu]');
        var btn = sw.querySelector('.lang-switch__btn');
        if (!menu || !btn) return;

        // Populate options once.
        menu.textContent = '';
        LANGS.forEach(function (l) {
            var li = document.createElement('li');
            li.className = 'lang-switch__option';
            li.setAttribute('role', 'option');
            li.setAttribute('data-lang', l.code);
            li.tabIndex = 0;
            var name = document.createElement('span');
            name.textContent = l.label;
            var code = document.createElement('span');
            code.className = 'lang-switch__code';
            code.textContent = l.short;
            li.append(name, code);
            li.addEventListener('click', function () { set(l.code); btn.focus(); });
            li.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(l.code); btn.focus(); }
            });
            menu.appendChild(li);
        });

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = btn.getAttribute('aria-expanded') === 'true';
            closeAllMenus();
            if (!isOpen) {
                menu.hidden = false;
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    function initSwitchers() {
        var switches = document.querySelectorAll('[data-lang-switch]');
        switches.forEach(buildSwitch);
        if (!switches.length) return;

        document.addEventListener('click', function (e) {
            if (!e.target.closest('[data-lang-switch]')) closeAllMenus();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeAllMenus();
        });
    }

    // ── Public API ──────────────────────────────────────────
    window.i18n = {
        current: function () { return current; },
        t: t,
        apply: apply,
        set: set,
        localeFor: function () { return localeFor(current); },
        languages: LANGS.slice(),
    };

    // ── Boot ────────────────────────────────────────────────
    function init() {
        document.documentElement.setAttribute('lang', current);
        // English ships inline — only translate when a non-English choice is
        // stored. Either way, reveal the page (head.js may have hidden it).
        if (current !== 'en') apply(document);
        initSwitchers();
        refreshLabels();
        document.documentElement.classList.remove('i18n-pending');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
