/**
 * Styles of the book, shared by the overlay on the download page and the
 * standalone HTML file. The standalone file cannot read the site's stylesheet,
 * so the Delft palette of app/globals.css is repeated here as custom
 * properties, and every rule is scoped under .anda-book so that it cannot leak
 * into the site around the overlay.
 *
 * The font stacks read the site's next/font variables first, fall back to the
 * Google Fonts families the standalone file links, and end on Georgia and the
 * system sans, so a copy opened offline still reads well.
 */
export const BOOK_CSS = `
.anda-book {
  --ab-paper: 247 243 236;
  --ab-ink: 11 27 51;
  --ab-delft: 26 63 139;
  --ab-gold: 242 193 98;
  --ab-blush: 212 140 122;
  --ab-sky-deep: 15 42 76;
  --ab-sky-mid: 29 75 133;
  --ab-sky-light: 62 115 185;
  --ab-display: var(--font-display, "Cormorant Garamond"), "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --ab-body: var(--font-body, "Public Sans"), "Public Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --ab-measure: 34rem;

  display: block;
  color: rgb(var(--ab-ink) / 0.88);
  font-family: var(--ab-body);
  font-size: 17px;
  line-height: 1.8;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  overflow-wrap: break-word;
  padding: clamp(2.5rem, 7vw, 4.5rem) clamp(1.25rem, 6vw, 4rem) clamp(3rem, 8vw, 5rem);
}

.anda-book *,
.anda-book *::before,
.anda-book *::after {
  box-sizing: border-box;
}

.anda-book ::selection {
  background: rgb(var(--ab-gold) / 0.4);
  color: rgb(var(--ab-ink));
}

.anda-book p,
.anda-book h1,
.anda-book h2,
.anda-book h3,
.anda-book ol,
.anda-book ul {
  margin: 0;
  padding: 0;
}

.anda-book a {
  color: rgb(var(--ab-delft));
  text-decoration: none;
  border-radius: 0.25rem;
  transition: color 200ms ease;
}

.anda-book a:hover {
  color: rgb(var(--ab-ink));
}

.anda-book a:focus-visible,
.anda-book [tabindex="-1"]:focus-visible {
  outline: 2px solid rgb(var(--ab-delft) / 0.6);
  outline-offset: 4px;
}

.anda-book [tabindex="-1"]:focus:not(:focus-visible) {
  outline: none;
}

/* The Endless Sky: a hairline of gold with a small open ring at its centre. */
.anda-book .ab-rule {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: min(14rem, 70%);
  margin: 0 auto 1.6rem;
}

.anda-book .ab-rule::before,
.anda-book .ab-rule::after {
  content: "";
  flex: 1;
  height: 1px;
}

.anda-book .ab-rule::before {
  background: linear-gradient(to right, rgb(var(--ab-gold) / 0), rgb(var(--ab-gold) / 0.9));
}

.anda-book .ab-rule::after {
  background: linear-gradient(to left, rgb(var(--ab-gold) / 0), rgb(var(--ab-gold) / 0.9));
}

.anda-book .ab-rule span {
  width: 0.7rem;
  height: 0.7rem;
  border: 1.5px solid rgb(var(--ab-gold));
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgb(var(--ab-gold) / 0.12);
}

/* Cover */
.anda-book .ab-cover {
  text-align: center;
  padding: clamp(1rem, 5vw, 3rem) 0 clamp(3rem, 9vw, 5rem);
}

.anda-book .ab-sky {
  display: block;
  width: clamp(5.5rem, 22vw, 7.5rem);
  height: auto;
  margin: 0 auto 2rem;
  color: rgb(var(--ab-delft));
}

.anda-book .ab-eyebrow {
  font-family: var(--ab-body);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgb(var(--ab-delft) / 0.8);
  margin-bottom: 1.25rem;
}

.anda-book .ab-title {
  font-family: var(--ab-display);
  font-weight: 600;
  font-size: clamp(2.1rem, 7vw, 3.4rem);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: rgb(var(--ab-ink));
  text-wrap: balance;
  max-width: 18ch;
  margin: 0 auto;
  hyphens: manual;
}

.anda-book .ab-byline {
  margin-top: 2.25rem;
  font-family: var(--ab-display);
  font-size: 1.25rem;
  color: rgb(var(--ab-ink) / 0.75);
}

.anda-book .ab-year {
  margin-top: 0.15rem;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  color: rgb(var(--ab-ink) / 0.5);
}

.anda-book .ab-notice {
  max-width: 24rem;
  margin: 1.5rem auto 0;
  font-size: 0.85rem;
  font-style: italic;
  line-height: 1.6;
  text-align: center;
  color: rgb(var(--ab-ink) / 0.6);
}

/* Contents and the pillars index */
.anda-book .ab-toc {
  max-width: 24rem;
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 3rem) 0;
}

.anda-book .ab-toc-title {
  font-family: var(--ab-display);
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
  color: rgb(var(--ab-ink));
  margin-bottom: 1.25rem;
}

.anda-book .ab-toc ol {
  list-style: none;
}

.anda-book .ab-toc li + li {
  border-top: 1px solid rgb(var(--ab-delft) / 0.1);
}

.anda-book .ab-toc a {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.7rem 0.25rem;
  font-family: var(--ab-display);
  font-size: 1.2rem;
  line-height: 1.35;
  color: rgb(var(--ab-ink) / 0.85);
}

.anda-book .ab-toc a:hover {
  color: rgb(var(--ab-delft));
}

.anda-book .ab-chapter.ab-toc ol {
  max-width: 24rem;
  margin: 0 auto;
}

.anda-book .ab-toc .ab-num {
  flex: none;
  min-width: 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgb(var(--ab-delft));
}

/* Chapters */
.anda-book .ab-chapter {
  max-width: var(--ab-measure);
  margin: 0 auto;
  padding-top: clamp(3.5rem, 10vw, 5.5rem);
}

.anda-book .ab-numeral {
  display: block;
  text-align: center;
  font-family: var(--ab-display);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.3em;
  padding-left: 0.3em;
  color: rgb(var(--ab-delft));
  margin-bottom: 0.4rem;
}

.anda-book .ab-chapter-title {
  font-family: var(--ab-display);
  font-weight: 600;
  font-size: clamp(1.75rem, 5.5vw, 2.35rem);
  line-height: 1.15;
  text-align: center;
  color: rgb(var(--ab-ink));
  text-wrap: balance;
  margin-bottom: clamp(1.75rem, 5vw, 2.5rem);
  scroll-margin-top: 1.5rem;
  hyphens: manual;
}

.anda-book .ab-section-title {
  font-size: clamp(1.3rem, 3.8vw, 1.6rem);
}

.anda-book .ab-chapter p {
  margin-bottom: 0.95em;
}

.anda-book .ab-lede {
  font-family: var(--ab-display);
  font-size: 1.4rem;
  line-height: 1.5;
  color: rgb(var(--ab-delft));
}

.anda-book .ab-dropcap::first-letter {
  float: left;
  font-family: var(--ab-display);
  font-weight: 600;
  font-size: 3.6em;
  line-height: 0.85;
  padding: 0.08em 0.12em 0 0;
  color: rgb(var(--ab-delft));
}

.anda-book .ab-chapter ol.ab-list {
  list-style: decimal;
  margin: 0.25rem 0 1.2em;
  padding: 0.9rem 1.25rem 0.9rem 3rem;
  border-left: 2px solid rgb(var(--ab-gold) / 0.7);
  background: rgb(var(--ab-gold) / 0.07);
  border-radius: 0 0.75rem 0.75rem 0;
}

.anda-book .ab-chapter ol.ab-list li {
  padding: 0.1rem 0 0.1rem 0.35rem;
}

.anda-book .ab-chapter ol.ab-list li::marker {
  font-family: var(--ab-display);
  font-weight: 600;
  color: rgb(var(--ab-delft));
}

/* The three short lines at the heart of the message read as a verse. */
.anda-book .ab-verse {
  margin: 2rem 0 2.25rem;
  text-align: center;
  font-family: var(--ab-display);
  font-size: 1.45rem;
  line-height: 1.55;
  color: rgb(var(--ab-delft));
}

.anda-book .ab-chapter .ab-verse p {
  margin: 0;
}

.anda-book .ab-chapter .ab-verse p + p {
  margin-top: 0.35rem;
}

/* The oath */
.anda-book .ab-oath {
  text-align: center;
}

.anda-book .ab-oath p {
  font-family: var(--ab-display);
  font-size: 1.3rem;
  line-height: 1.55;
  color: rgb(var(--ab-ink) / 0.9);
  text-wrap: balance;
}

.anda-book .ab-chapter .ab-oath p {
  margin-bottom: 0;
}

.anda-book .ab-oath p + p::before {
  content: "";
  display: block;
  width: 0.3rem;
  height: 0.3rem;
  margin: 1.1rem auto;
  border-radius: 50%;
  background: rgb(var(--ab-gold));
}

.anda-book .ab-chapter .ab-oath .ab-oath-final {
  font-weight: 600;
  font-size: clamp(1.6rem, 5vw, 1.95rem);
  line-height: 1.3;
  color: rgb(var(--ab-delft));
}

/* Colophon */
.anda-book .ab-colophon {
  max-width: var(--ab-measure);
  margin: clamp(4rem, 12vw, 6rem) auto 0;
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.7;
  color: rgb(var(--ab-ink) / 0.6);
}

.anda-book .ab-colophon .ab-colophon-title {
  font-family: var(--ab-display);
  font-size: 1.05rem;
  color: rgb(var(--ab-ink) / 0.8);
}

@media (max-width: 480px) {
  .anda-book {
    font-size: 16px;
    line-height: 1.75;
    hyphens: auto;
  }
}
`;

/**
 * Page rules of the standalone file only: the night sky behind a sheet of
 * porcelain paper, and a plain paper version for print.
 */
export const STANDALONE_CSS = `
html {
  background: rgb(11 27 51);
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  padding: clamp(1rem, 4vw, 3rem) clamp(0.75rem, 3vw, 2rem);
  background-color: rgb(11 27 51);
  background-image:
    radial-gradient(circle at 20% 15%, rgb(62 115 185 / 0.35), transparent 45%),
    radial-gradient(circle at 80% 25%, rgb(242 193 98 / 0.18), transparent 50%),
    linear-gradient(160deg, rgb(11 27 51) 0%, rgb(15 42 76 / 0.95) 55%, rgb(29 75 133 / 0.9) 100%);
  background-attachment: fixed;
}

body > .anda-book {
  position: relative;
  max-width: 46rem;
  margin: 0 auto;
  border-radius: 1.25rem;
  background-color: rgb(247 243 236);
  background-image:
    radial-gradient(circle at 15% 8%, rgb(26 63 139 / 0.07), transparent 40%),
    radial-gradient(circle at 85% 4%, rgb(242 193 98 / 0.14), transparent 40%),
    linear-gradient(120deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0) 65%);
  box-shadow:
    0 0 0 1px rgb(242 193 98 / 0.25),
    0 30px 80px -30px rgb(0 0 0 / 0.6);
}

@media print {
  @page {
    margin: 2cm 2.2cm;
  }

  html,
  body {
    background: none;
    padding: 0;
  }

  body > .anda-book {
    max-width: none;
    padding: 0;
    border-radius: 0;
    background: none;
    box-shadow: none;
  }

  .anda-book .ab-cover {
    padding-top: 30vh;
  }

  .anda-book .ab-toc,
  .anda-book .ab-chapter,
  .anda-book .ab-colophon {
    break-before: page;
  }

  .anda-book .ab-chapter {
    padding-top: 0;
  }

  .anda-book .ab-chapter-title,
  .anda-book .ab-numeral,
  .anda-book .ab-rule {
    break-after: avoid;
  }

  .anda-book a {
    color: inherit;
  }
}
`;
