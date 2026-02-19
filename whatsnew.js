// ─────────────────────────────────────────────────────────────
//  whatsnew.js  –  Fetches GitHub releases and renders them
//                  as styled changelog cards.
// ─────────────────────────────────────────────────────────────

const RELEASES_API =
    'https://api.github.com/repos/Anneardysa/ArdysaModsTools/releases?per_page=100';

const EMPTY_BODY_FALLBACK = 'Bug Fixed';

// ── Lightweight Markdown → HTML ──────────────────────────────
// Converts a subset of GitHub-flavoured Markdown to HTML.
// Handles: headings, bold, italic, inline code, code blocks,
//          unordered / ordered lists, blockquotes, links, hrs.
// ─────────────────────────────────────────────────────────────

function markdownToHtml(md) {
    if (!md || !md.trim()) return `<p class="fallback-text"><i class="fas fa-wrench"></i> ${EMPTY_BODY_FALLBACK}</p>`;

    let html = '';
    const lines = md.replace(/\r\n/g, '\n').split('\n');

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        // ── Fenced code blocks ──────────────────────────────
        if (line.trim().startsWith('```')) {
            const lang = line.trim().slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(escapeHtml(lines[i]));
                i++;
            }
            i++; // skip closing ```
            html += `<pre><code${lang ? ` class="language-${lang}"` : ''}>${codeLines.join('\n')}</code></pre>\n`;
            continue;
        }

        // ── Horizontal rule ─────────────────────────────────
        if (/^(\s*[-*_]){3,}\s*$/.test(line)) {
            i++;
            html += '<hr>\n';
            continue;
        }

        // ── Headings ────────────────────────────────────────
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            // Clamp to h3–h5 range inside cards for visual hierarchy
            const tag = `h${Math.min(Math.max(level, 3), 5)}`;
            html += `<${tag}>${inlineMarkdown(headingMatch[2])}</${tag}>\n`;
            i++;
            continue;
        }

        // ── Blockquote ──────────────────────────────────────
        if (line.trimStart().startsWith('>')) {
            const quoteLines = [];
            while (i < lines.length && lines[i].trimStart().startsWith('>')) {
                quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
                i++;
            }
            html += `<blockquote>${inlineMarkdown(quoteLines.join(' '))}</blockquote>\n`;
            continue;
        }

        // ── Unordered list ──────────────────────────────────
        if (/^\s*[-*+]\s+/.test(line)) {
            html += '<ul>\n';
            while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
                const content = lines[i].replace(/^\s*[-*+]\s+/, '');
                html += `  <li>${inlineMarkdown(content)}</li>\n`;
                i++;
            }
            html += '</ul>\n';
            continue;
        }

        // ── Ordered list ────────────────────────────────────
        if (/^\s*\d+\.\s+/.test(line)) {
            html += '<ol>\n';
            while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                const content = lines[i].replace(/^\s*\d+\.\s+/, '');
                html += `  <li>${inlineMarkdown(content)}</li>\n`;
                i++;
            }
            html += '</ol>\n';
            continue;
        }

        // ── Empty line ──────────────────────────────────────
        if (!line.trim()) {
            i++;
            continue;
        }

        // ── Paragraph (default) ─────────────────────────────
        html += `<p>${inlineMarkdown(line)}</p>\n`;
        i++;
    }

    return html;
}

// ── Inline Markdown transforms ───────────────────────────────

function inlineMarkdown(text) {
    let s = escapeHtml(text);

    // Code spans  `code`
    s = s.replace(/`([^`]+?)`/g, '<code>$1</code>');
    // Bold + italic  ***text***
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold  **text**
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic  *text*
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Links  [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Strikethrough  ~~text~~
    s = s.replace(/~~(.+?)~~/g, '<del>$1</del>');

    return s;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Date formatting ──────────────────────────────────────────

function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// ── Render one release card ──────────────────────────────────

function createReleaseCard(release) {
    const card = document.createElement('div');
    card.className = 'release-card';

    const tag = release.tag_name || release.name || 'Unknown';
    const date = release.published_at ? formatDate(release.published_at) : 'Unknown date';
    const bodyHtml = markdownToHtml(release.body);
    const githubUrl = release.html_url || '#';

    // Determine if this is a "latest" release (first in the array)
    const isLatest = release._isLatest || false;

    // Anchor ID for deep-linking  (e.g.  #v2.1.13-beta)
    const anchorId = tag;
    card.id = anchorId;

    // Permalink for the copy button
    const permalink = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(anchorId)}`;

    card.innerHTML = `
        <div class="release-header">
            <div class="release-title-row">
                <a href="${githubUrl}" target="_blank" rel="noopener" class="release-version">
                    <i class="fas fa-tag"></i> ${escapeHtml(tag)}
                </a>
                ${isLatest ? '<span class="latest-badge">LATEST</span>' : ''}
            </div>
            <div class="release-meta">
                <span class="release-date"><i class="far fa-calendar-alt"></i> ${date}</span>
                <button class="copy-link-btn" data-link="${permalink}" title="Copy link to this release">
                    <i class="fas fa-link"></i>
                </button>
            </div>
        </div>
        <div class="release-body">${bodyHtml}</div>
    `;

    // Wire up the copy button
    const copyBtn = card.querySelector('.copy-link-btn');
    copyBtn.addEventListener('click', () => copyPermalink(copyBtn));

    return card;
}

// ── Copy permalink to clipboard ──────────────────────────────

function copyPermalink(btn) {
    const link = btn.getAttribute('data-link');
    navigator.clipboard.writeText(link).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i class="fas fa-link"></i>';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers / non-HTTPS
        const textarea = document.createElement('textarea');
        textarea.value = link;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i class="fas fa-link"></i>';
        }, 2000);
    });
}

// ── Scroll to hash target & highlight ────────────────────────

function scrollToHashTarget() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    // Scroll into view with offset for the fixed navbar
    const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    // Highlight the card briefly
    target.classList.add('highlighted');
    setTimeout(() => target.classList.remove('highlighted'), 3000);
}

// ── Main: fetch & render ─────────────────────────────────────

async function loadReleases() {
    const container = document.getElementById('releases-container');
    if (!container) return;

    try {
        const response = await fetch(RELEASES_API);
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

        const releases = await response.json();

        if (!releases.length) {
            container.innerHTML = `
                <div class="no-releases">
                    <i class="fas fa-inbox"></i>
                    <p>No releases found.</p>
                </div>`;
            return;
        }

        // Mark the first release as latest
        releases[0]._isLatest = true;

        // Clear loading placeholder
        container.innerHTML = '';

        // Render each release
        releases.forEach(release => {
            container.appendChild(createReleaseCard(release));
        });

        // After rendering, scroll to hash target if present
        requestAnimationFrame(() => scrollToHashTarget());
    } catch (error) {
        console.error('Failed to load releases:', error);
        container.innerHTML = `
            <div class="no-releases error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load releases. Please try again later.</p>
                <small>${escapeHtml(error.message)}</small>
            </div>`;
    }
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadReleases);

// Handle hash changes (e.g. user clicks a shared link while page is already open)
window.addEventListener('hashchange', scrollToHashTarget);
