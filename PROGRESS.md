# Abhishar V16.0 — Build Progress

## Section 17 Build Order Status

| Step | Section | Status | Component(s) |
|------|---------|--------|---------------|
| 1 | Design system, globals, layout | ✅ Done | `globals.css`, `layout.tsx`, `content.ts` |
| 2 | Header, Footer, Hero + BrushSweep, PaintCursor | ✅ Done | `Header.tsx`, `Footer.tsx`, `Hero.tsx`, `BrushSweep.tsx`, `PaintCursor.tsx` |
| 3 | Theme section + Types of Art panels | ✅ Done | `ThemeSection.tsx`, `TypePanel.tsx`, `TypesSection.tsx` |
| 4 | Featured Articles (picture frame reveal) | ✅ Done | `FeaturedArticles.tsx` |
| 5 | Lifescape horizontal scroll + lightbox | ✅ Done | `LifescapeSection.tsx` |
| 6 | Video, Flipbook, Downloads, About | ✅ Done | `VideoFlipbookDownload.tsx`, `AboutSection.tsx` |
| 7 | Polish & responsive pass | ✅ Done | Layout alignment, shared container, section padding |
| 8 | Wide-window alignment + HardCopy removal | ✅ Done | Playwright-verified at 8 viewports |
| 9 | Content: hero tagline + Lifescape cards | ✅ Done | `content.ts`, `LifescapeSection.tsx` |
| 10 | Featured Articles: 3 frames + real content | ✅ Done | `FeaturedArticles.tsx`, `content.ts`, `globals.css` |

## Recent Changes

### 2026-11-20: Gallery redesign ("museum" art theme)

All text content and section order unchanged. Visual + animation overhaul:
- **Root-cause fix:** the unlayered `* { margin:0; padding:0 }` reset in `globals.css` overrode every Tailwind spacing utility (Tailwind v4 utilities live in `@layer utilities`; unlayered CSS always wins). Reset moved into `@layer base`, so Tailwind classes work again.
- Type: Playfair Display (display, italic accents) + Outfit (body). Gallery palette (oxblood, verdigris, ultramarine, umber, gold); animated canvas-grain overlay; gilded-frame utility.
- New high-res public-domain artwork in `public/images/art/` (Met Museum Open Access CC0 + Wikimedia PD-art): hero = Hokusai, Raja Ravi Varma, Bruegel, Van Gogh, F. E. Church; panels = Vermeer, Carpeaux, Unicorn Tapestry, Ravenna mosaic. Credits shown on-page (`artist` / `artwork` fields in `content.ts`).
- Hero: letter-mask wordmark reveal, scroll parallax, museum "Now viewing" label, CSS fallback image while the canvas preloads.
- Type panels: museum "rooms" with Roman numerals, framed art + labels, parallax; sticky `top` is measured so panels taller than the viewport scroll fully before pinning (previously the next panel covered their artwork on phones/short laptops).
- Featured: velvet-curtain reveal, picture lights, 3D tilt, brass plaques. Lifescape: framed cards, snap scroll, progress rail, gilded lightbox.
- Video poster extracted with ffmpeg (`public/images/video-poster.jpg`).
- Bug fixes: header active link never cleared; paint cursor created DOM nodes every 50ms forever; `#` social links opened blank tabs; refs read during render (lint errors); dev badge hidden (`devIndicators: false`).
- Playwright verified at 360/390/768/1024/1280/1440/1920/2560: no horizontal scroll, no console errors, every panel artwork visible.

### 2026-11-19: Featured Articles — 3 frames with real content

- Added third frame (feature-03.png, wheat field with cypress trees) with Delft-blue lacquer + gold inner line ornament
- Frame colours driven from `content.ts` (`frameColor`, `frameHighlight`, `accentColor` per article) — no hardcoded variants
- Real titles: "Let\u2019s Get Ripped!", "The Art Of Problem Solving", "Study The Systems You Can\u2019t Build" (typographic apostrophes)
- Real authors: Guna Shekar Proddaturi, Ritu Raj, Aditya Kumar Singh
- Removed "Coming soon" note — if no link, nothing shows after reveal
- Museum plaque: title in display font (20px desktop / 18px phones), thin accent-coloured divider, "By Author" line; all plaques same min-height so author lines align
- Layout: 3-col desktop (≥1024px, 40px gaps, max 1120px), 2+1 tablet (640–1023px, third centred), 1-col phone (<640px, max 320px, 32px gaps)
- Responsive grid CSS in `globals.css` (`.featured-frames-grid`) — `styled jsx` couldn't target `:last-child` across component boundaries
- Frame 3 image: `object-position: 65% 50%` to keep cypress trees in view
- Playwright verified at 360, 390, 768, 1024, 1280, 1470, 1920, 2560 — all frames same size, group centred within 0px, no horizontal scroll

### 2026-11-19: Content update — hero tagline + Lifescape cards

**Change 1 — Hero tagline:**
- Replaced "A journey through the forms of art" → "A Timeless Voyage Through Art and Culture" in `content.ts`, `layout.tsx` metadata description, and `layout.tsx` OpenGraph description
- Verified no other occurrence remains in any `.ts`, `.tsx`, `.md`, or `.json` file

**Change 2 — Lifescape cards:**
- Replaced all 12 placeholder cards with 8 real cards using images from `/public/images/lifescape/lifescape-01.jpeg` to `lifescape-08.jpeg`
- Originals backed up to `/originals-backup/lifescape/`
- All images already under 600KB (max 398KB); no optimisation needed
- Removed `title`, `medium`, `placeholder` fields from card data
- Cards now show: picture → caption (bold) → artist name. Nothing else
- Lightbox: full uncropped picture (`object-fit: contain`), caption, artist, counter "n of 8"
- Alt text format: "Caption, by Artist name"
- Generated 4 captions (marked with `// GENERATED, replace if needed`):
  - 01: "Dark knight in the rain"
  - 04: "Skull aglow in warm embers"
  - 06: "Bearded man in a turban"
  - 07: "Café light on a rainy night"
- No placeholder text ("Placeholder title", "Student artist name", "Medium and year") remains anywhere

### 2026-11-19: Playwright-verified alignment pass + HardCopy removal

**Root cause fixed:** Tailwind v4 utility classes (`inline-block`, `max-w-*`, `mx-auto`) were not generating CSS in this project. All critical centering properties moved to inline `style={{ }}` attributes using CSS custom properties from `globals.css`.

**Changes made:**
- **ThemeSection**: Removed inner `max-w-4xl` wrapper; quote `<p>` and followUp `<p>` use inline `maxWidth` + `marginInline: 'auto'`; parent div has `textAlign: 'center'`
- **TypesSection**: Heading wrapper uses inline `textAlign: 'center'` and `marginBottom: var(--heading-to-chips)`; chips flex-wrap with inline `justifyContent: 'center'` and `marginInline: 'auto'`; h3 uses inline `display: 'inline-block', position: 'relative'` (Tailwind classes were silently failing)
- **FeaturedArticles**: Intro wrapper centered with inline styles; intro `<p>` has `maxWidth: '42rem', marginInline: 'auto'`; frames flex-row centred with `justifyContent: 'center'`
- **LifescapeSection**: Heading container centered with inline styles; intro `<p>` has `marginInline: 'auto'`; carousel uses dynamic padding formula `max(var(--container-px), calc((100vw - 1280px) / 2 + var(--container-px)))`
- **VideoFlipbookDownload**: All headings/tips use CSS var spacing; download icon centred with `marginInline: 'auto'`; download grid fills container
- **AboutSection**: Cover image uses `mx-auto md:mx-0`
- **HardCopySection**: Deleted component and removed from `page.tsx`; `content.ts` CTA link changed from `#hardcopy` to `#footer`
- **globals.css**: Added responsive CSS custom properties (`--heading-to-intro`, `--intro-to-content`, `--heading-to-chips`, `--theme-heading-gap`, `--subsection-gap`, `--chip-gap`) with phone/tablet/desktop breakpoints

**Playwright verification — ALL PASSED at 8 widths:**
| Width | HScroll | All centred (≤4px) | Lifescape card aligned |
|-------|---------|-------------------|----------------------|
| 360   | ✅ No   | ✅ Yes            | ✅ Yes               |
| 390   | ✅ No   | ✅ Yes            | ✅ Yes               |
| 768   | ✅ No   | ✅ Yes            | ✅ Yes               |
| 1024  | ✅ No   | ✅ Yes            | ✅ Yes               |
| 1280  | ✅ No   | ✅ Yes            | ✅ Yes               |
| 1470  | ✅ No   | ✅ Yes            | ✅ Yes               |
| 1920  | ✅ No   | ✅ Yes            | ✅ Yes               |
| 2560  | ✅ No   | ✅ Yes            | ✅ Yes               |

### Previous Changes
- Flipbook: Heyzine iframe embed with responsive aspect ratio (~16:10 desktop, ~3:4 phone), loading skeleton, 8s timeout fallback, "Open full screen" link
- Download cards: clickable `<a download>` cards showing real file sizes (Low Res 17.2 MB, High Res 441.9 MB), disabled state if file missing
- Video section: native `<video>` player with play button, keyboard access, error fallback, 848×480 landscape (7.1 MB, no optimization needed)
- About section: replaced swan placeholder with `about-cover.jpg` (978×1280), `object-fit: contain`, caption "Abhishar V16.0, cover"
- Originals backed up to `/originals-backup/`
- 10-item layout fix pass (container system, word spacing, hero crop, header nav gaps)
- Items A, B, C layout alignment pass (Types panels, chip row, global container)
- Types panels alignment + chip row styling

## Known Issues
- Flipbook pages and download URLs are populated; flipbookUrl stored in content.ts
- No ffmpeg available — video poster not auto-extracted; video uses its own first frame via `preload="metadata"`
- Google Fonts fail in sandbox (no network) — works fine in real browser
- Dev server must run with `--webpack` flag (Turbopack has a CSS processing bug on this system)
- Tailwind v4 utility classes unreliable in this project — all critical layout uses inline styles
