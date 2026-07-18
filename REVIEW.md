# Homepage Concept Review

## Comparative Assessment

Scores use a five-point scale. They describe the current prototypes, not an abstract design direction.

| Dimension | Concept A: Academic Editorial | Concept B: Research Index | Concept C: Modern Institution |
| --- | ---: | ---: | ---: |
| Brand distinctiveness | 5 | 4 | 4.5 |
| First-screen clarity | 4.5 | 4.5 | 4.5 |
| Content discoverability | 4.5 | 5 | 4 |
| Academic credibility | 5 | 4.5 | 4.5 |
| Visual rhythm | 5 | 4 | 4.5 |
| Mobile performance | 4.5 | 4.5 | 4 |
| Maintainability | 4.5 | 4 | 4.5 |

## Concept Notes

### Concept A: Academic Editorial

The opening spread, issue table of contents, editorial streams, and alternating project features produce the clearest expression of “modern academic editorial office × literature discovery platform.” It feels like a publication rather than a software landing page. Its main risk is that long English titles need careful ongoing copy and truncation discipline.

### Concept B: Research Index

This is the strongest discovery tool. The numbered ledger and category tabs make the information system immediately legible. It is also the densest option and can feel more like a research database than a content brand. It would suit a product-first homepage if search and filtering become the primary brand behavior.

### Concept C: Modern Institution

This has the calmest institutional confidence and the strongest project portfolio section. The full-width green publication bands are distinctive and make the two products feel substantial. On mobile it becomes the longest concept, and the institutional tone is slightly more formal than Academic Door’s current independent editorial identity.

## Recommendation

**Recommend Concept A: Academic Editorial.**

It best balances the four jobs of the homepage:

1. states what Academic Door does;
2. shows what is worth reading now;
3. presents the two projects as real working publications;
4. establishes trust without imitating a university department or administrative institution.

For the final homepage, retain Concept A’s overall architecture and visual system. Consider borrowing only one element from Concept B: the compact category switcher, if real content later becomes dynamically loaded.

## Emil Kowalski Motion Review

| Before | After | Why |
| --- | --- | --- |
| Buttons had hover movement but no explicit press state | Added `transform: scale(0.97)` on `:active` in `assets/prototypes.css:51` | Provides immediate physical feedback without decorative motion |
| Hero content uses a one-time `translateY(8px)` and opacity reveal | Retained at `240–280ms` with strong ease-out in `assets/prototypes.css:65-70` | Rare first-view motion has a clear purpose and remains under 300ms |
| Project screenshots shift slightly on hover | Retained at `240ms`, gated by hover-capable pointers in `assets/prototypes.css:283-289` | The crop change confirms interactivity without affecting touch users |
| Mobile navigation appears immediately | Retained without open/close animation in `assets/prototypes.js` | This is a frequently used navigation control; instant response is preferable |
| Research tabs switch immediately | Retained without crossfade or slide in `assets/prototypes.js` | Fast comparison matters more than visual flourish in a research index |
| Reduced-motion rule removes nonessential movement | Retained in `assets/prototypes.css:386` | Meets accessibility expectations and avoids motion being mandatory for comprehension |

**Verdict: Approve.** No feel-breaking motion, infinite animation, layout-property animation, `ease-in`, `scale(0)`, or ungated hover movement remains.

## Validation

- Tested widths: `1440`, `1024`, `768`, `390`
- HTTP status: `200` for all concepts and widths
- Horizontal overflow: none
- Console errors: none
- Mobile navigation: opens, closes after navigation, and exposes all four destinations
- Concept B tabs: all three streams switch without reflow errors
- Images: logo, QR code, and both real project previews load successfully
- Accessibility: semantic headings, skip links, focus-visible, reduced-motion, keyboard-operable controls

## Unresolved Before Production

- The prototype research records are current static examples. A production homepage should receive a small generated JSON feed from the two projects rather than duplicate data manually.
- Project screenshots will need a refresh policy when either project changes substantially.
- Final editorial copy and the number of visible papers should be confirmed after comparing the three prototypes at normal browser scale.
- The three prototypes use `noindex`; the selected production page must restore the existing canonical, Open Graph, and JSON-LD metadata from `index.html`.
- No formal reader usability test has yet been conducted.
