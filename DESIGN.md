# Academic Door Homepage Redesign

## Brand Positioning

Academic Door / 学术传送门 is a Chinese-language academic content brand and an economics literature discovery entrance. It serves economics readers, undergraduate and graduate students, and early-career researchers who need a dependable way to discover, understand, and revisit current research.

The homepage has one job: make a first-time visitor understand what Academic Door publishes, what is worth reading now, where to enter the two literature projects, and why the work is trustworthy.

Core statement: **读好文献，用好论文**.

## Information Architecture

1. Persistent brand and navigation
2. Hero thesis and current-paper preview
3. Latest research in three editorial streams
4. Two public project entrances with real interface previews
5. Publishing workflow
6. Editorial principles
7. About and WeChat follow module
8. Project, GitHub, copyright, and update footer

The three prototypes intentionally interpret this structure differently:

- **Concept A / Academic Editorial**: a contemporary academic review with a strong masthead, issue preview, and editorial columns.
- **Concept B / Research Index**: a compact discovery index organized around filters, numbered records, and switchable research streams.
- **Concept C / Modern Institution**: a calm publishing institution with a manifesto-led opening, structured research ledger, and full-width project bands.

## Color

Shared base palette:

- Paper background: `#F4F2ED`
- Raised surface: `#FAF9F6`
- Primary text: `#17201C`
- Secondary text: `#626A65`
- Academic green: `#234D47`
- Editorial red: `#B64A3A`
- Border: `rgba(23, 32, 28, 0.14)`

Concept accents remain within this system. Color communicates source, state, or action; it is not used as atmospheric decoration.

## Typography

- Chinese display: `"Songti SC", "STSong", "Noto Serif CJK SC", "Source Han Serif SC", SimSun, serif`
- English display: `"Iowan Old Style", Baskerville, "Times New Roman", serif`
- Body and controls: `Inter, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif`
- Data and issue labels: `"SFMono-Regular", Consolas, "Liberation Mono", monospace`

No remote font service is required. Chinese titles use serif type selectively to suggest publication rather than an institutional noticeboard; body text remains modern and highly legible.

## Grid

- Desktop maximum width: `1180px`
- Reading measure: `680–760px`
- Desktop: 12-column conceptual grid
- Tablet: 8-column conceptual grid
- Mobile: single reading column with preserved source/date hierarchy

The page uses rules, alignment, numbering, and column shifts as structure. Cards are reserved for genuinely framed artifacts such as a project interface preview, not every section.

## Spacing

Base unit: `4px`.

Primary spacing steps: `8, 12, 16, 24, 32, 48, 64, 80`.

Section spacing is generally `64–80px` on desktop and `48–64px` on mobile. Large empty areas must carry editorial purpose; no arbitrary 100px-plus gaps are used to manufacture prestige.

## Component Rules

- Header: light sticky treatment, visible focus, reliable mobile disclosure.
- Buttons: command-oriented text, maximum `6px` radius, clear primary/secondary hierarchy.
- Paper records: title first, then author, source/date, and a one-sentence research question.
- Editorial ordering: China research prioritizes journals in the existing `hourly_crossref_priority` TOP/A+ source set, then recency; the latest NBER stream places verified China-related papers before the remaining weekly records.
- Tags: small topical metadata, not pill decoration.
- Project previews: real screenshots, cropped to show the product interface rather than generic atmosphere.
- QR code: integrated with the follow message and project statement.
- Dividers: encode hierarchy between issues, streams, and records.

## Motion

- Duration: `160–280ms`
- Easing: ease-out or `cubic-bezier(0.22, 1, 0.36, 1)`
- Allowed: initial content reveal, navigation disclosure, button feedback, image crop shift on hover
- Properties: primarily `opacity` and `transform`
- Reduced motion: all nonessential animation disabled
- No scroll hijacking, ambient loops, parallax, or ornamental motion

## Explicitly Prohibited

- Blue-purple technology gradients
- Glassmorphism
- Full-page rounded card grids
- Generic SaaS dashboards
- Decorative icon collections
- Giant logo backgrounds
- Empty space used only to fill the viewport
- One repeated card component for all content
- AI landing-page copy and layouts
- Remote fonts that are unreliable in mainland China
- Infinite decorative animation

## Signature Elements

- **Concept A**: the hero behaves like the opening spread of an academic review, with an annotated current-issue table of contents.
- **Concept B**: the homepage behaves like a precise, browsable research index with a visible record system.
- **Concept C**: the project portfolio becomes a pair of full-width editorial publications inside one calm institutional identity.
