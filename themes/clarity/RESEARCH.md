# Clarity: evidence and design rationale

Reviewed 1 November 2026. These findings inform a preference-led design, not a clinical intervention.

- [Wery and Diliberto, 2017](https://pubmed.ncbi.nlm.nih.gov/26993270/): elementary students with dyslexia, alternating-treatment comparisons of OpenDyslexic, Arial and Times New Roman. Letter/word/nonsense-word tasks showed no reading-rate or accuracy improvement. This does not measure adult long-screen comfort.
- [Font meta-analysis, 2026](https://pubmed.ncbi.nlm.nih.gov/42536336/): 15 studies, 91 effects, 688 participants; no reliable speed/accuracy benefit for dyslexia-friendly fonts (g = -0.04, 95% interval -0.15 to 0.07). Do not substitute comprehension, preference or fatigue for those outcomes. Personal preference remains a valid reason to choose a face.
- [Buchner and Baumgartner, 2007](https://pubmed.ncbi.nlm.nih.gov/17510822/): dark-on-light improved proofreading across tested lighting/colour conditions; physiological and reported strain did not differ. This is performance evidence, not a fatigue benefit.
- [Piepenbrock et al., 2014](https://pubmed.ncbi.nlm.nih.gov/25141597/): positive-polarity proofreading advantage was greatest at smaller tested character sizes (8–14pt). It does not recommend small text.
- [Buchner et al., 2009](https://pubmed.ncbi.nlm.nih.gov/19562598/): the polarity advantage disappeared when overall luminance was equalised. CSS mode names cannot specify monitor brightness or room lighting.
- [Fan et al., 2024](https://europepmc.org/articles/PMC11175232): 50 adults aged 20–32 (27 men, 23 women), five between-subject text-colour groups, three within-subject illumination levels (0/5/10 lux) over three days. About 20 minutes of Chinese reading per day plus symbol/cognitive tasks; pupil, blink and self-report measures. Yellow/white performed better than red under these negative-polarity conditions. Colour-pair luminance contrasts differed (white 19.60, yellow 6.13, red 3.00), so hue alone cannot explain every difference. This is not an all-day reading trial or evidence that cream backgrounds work universally.

## Decisions and limits

Use OpenDyslexic because the reader requested it, with bundled assets rather than an installed-font assumption. Keep both polarities and reader choice. Use the genuine Maia/stone/teal preset bJy2uzsR: white/charcoal neutral reading surfaces and a restrained teal action accent. The white light ground is the upstream value, not the originally considered cream tint. The palette is a design judgement, not a scientifically superior combination.

Prioritise measured contrast, legible sizes, wrapping and adjustable presentation. The upstream muted-on-muted light pair and light sidebar-primary text pair miss normal-text contrast; DESIGN.md excludes those uses. Decorative borders/rings are not accessible control boundaries; use foreground outlines. Keep code intentionally monospace. A theme alone cannot establish WCAG conformance or prove reduced fatigue.

## Font rights

The exact unmodified modern WOFF2 files and matching SIL Open Font License 1.1 are pinned in fonts/font.json. The licence identifies copyright 2019 Abbie Gonzalez and the Reserved Font Name OpenDyslexic. Redistribution/embedding requires the notice and licence; do not sell the font alone or apply the reserved name to a modified derivative. This provenance does not relicense older Bitstream-licensed releases.
