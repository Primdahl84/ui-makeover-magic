# Exact Instructions for Claude Code

## Step 1: Replace the `<style>` block

In `web_dashboard.py`, find the `<style>` tag (around line 124) and the closing `</style>` tag (around line 245).
Replace **everything** between `<style>` and `</style>` with the contents of `lovable/lovable-theme.css`.

## Step 2: Fix ALL inline styles in the HTML

The HTML template has **hardcoded blue-tinted colors** in inline `style=""` attributes.
You MUST find and replace every single one:

### Background colors (blue → neutral)
```
FIND:    hsl(213 70% 5%/0.95)     →  REPLACE: hsl(240 15% 5%/0.95)
FIND:    hsl(213 50% 9%)          →  REPLACE: hsl(240 10% 8%)
FIND:    hsl(213 50% 10%)         →  REPLACE: hsl(240 10% 8%)
FIND:    hsl(213 50% 10%/0.7)     →  REPLACE: hsl(240 10% 12%/0.4)
FIND:    hsl(213 50% 7%)          →  REPLACE: hsl(240 10% 12%/0.3)
FIND:    hsl(213 50% 13%)         →  REPLACE: hsl(240 10% 12%)
FIND:    hsl(213,50%,7%)          →  REPLACE: hsl(240,10%,12%,0.3)
FIND:    hsl(213,45%,14%)         →  REPLACE: hsl(165,80%,48%)
FIND:    hsl(213 45% 12%)         →  REPLACE: hsl(240 10% 12%)
FIND:    hsl(213 48% 12%)         →  REPLACE: hsl(240 10% 12%)
```

### Border colors (blue → neutral)
```
FIND:    hsl(210 45% 18%/0.65)    →  REPLACE: hsl(240 10% 18%/0.5)
FIND:    hsl(210 45% 18%/0.45)    →  REPLACE: hsl(240 10% 14%/0.3)
FIND:    hsl(210 45% 16%/0.6)     →  REPLACE: hsl(240 10% 14%/0.6)
FIND:    hsl(210 44% 16%)         →  REPLACE: hsl(240 10% 18%)
FIND:    hsl(210 40% 16%/0.5)     →  REPLACE: hsl(240 10% 14%/0.5)
FIND:    hsl(210 40% 12%/0.6)     →  REPLACE: hsl(240 10% 12%/0.6)
FIND:    hsl(210 45% 13%/0.5)     →  REPLACE: hsl(240 10% 12%/0.4)
FIND:    hsl(210 50% 30%)         →  REPLACE: hsl(240 10% 18%)
FIND:    hsl(210 45% 22%)         →  REPLACE: hsl(240 10% 18%)
FIND:    hsl(210 55% 45%)         →  REPLACE: hsl(240 10% 25%)
```

### Hardcoded hex colors → HSL
```
FIND:    #22d3ee    →  REPLACE: hsl(165, 80%, 48%)
FIND:    #f87171    →  REPLACE: hsl(0, 85%, 62%)
FIND:    #c084fc    →  REPLACE: hsl(270, 60%, 60%)
FIND:    #ff6b6b    →  REPLACE: hsl(0, 85%, 62%)
```

### Hardcoded rgba market colors → HSL
```
FIND:    rgba(74,184,122,0.18)    →  REPLACE: hsl(165 80% 48% / 0.15)
FIND:    rgba(74,184,122,0.13)    →  REPLACE: hsl(165 80% 48% / 0.1)
FIND:    rgba(74,184,122,0.30)    →  REPLACE: hsl(165 80% 48% / 0.25)
FIND:    #4ab87a                  →  REPLACE: hsl(165, 80%, 48%)

FIND:    rgba(91,159,212,0.18)    →  REPLACE: hsl(215 80% 60% / 0.15)
FIND:    rgba(91,159,212,0.13)    →  REPLACE: hsl(215 80% 60% / 0.1)
FIND:    rgba(91,159,212,0.30)    →  REPLACE: hsl(215 80% 60% / 0.25)
FIND:    #5b9fd4                  →  REPLACE: hsl(215, 80%, 60%)

FIND:    rgba(200,184,74,0.18)    →  REPLACE: hsl(45 95% 55% / 0.15)
FIND:    rgba(200,184,74,0.13)    →  REPLACE: hsl(45 95% 55% / 0.1)
FIND:    rgba(200,184,74,0.30)    →  REPLACE: hsl(45 95% 55% / 0.25)
FIND:    #c8b84a                  →  REPLACE: hsl(45, 95%, 55%)

FIND:    rgba(224,123,84,0.18)    →  REPLACE: hsl(15 75% 55% / 0.15)
FIND:    rgba(224,123,84,0.13)    →  REPLACE: hsl(15 75% 55% / 0.1)
FIND:    rgba(224,123,84,0.30)    →  REPLACE: hsl(15 75% 55% / 0.25)
FIND:    #e07b54                  →  REPLACE: hsl(15, 75%, 55%)

FIND:    rgba(232,168,56,0.18)    →  REPLACE: hsl(35 85% 55% / 0.15)
FIND:    rgba(232,168,56,0.13)    →  REPLACE: hsl(35 85% 55% / 0.1)
FIND:    rgba(232,168,56,0.30)    →  REPLACE: hsl(35 85% 55% / 0.25)
FIND:    #e8a838                  →  REPLACE: hsl(35, 85%, 55%)

FIND:    rgba(126,200,200,0.18)   →  REPLACE: hsl(180 50% 60% / 0.15)
FIND:    rgba(126,200,200,0.13)   →  REPLACE: hsl(180 50% 60% / 0.1)
FIND:    rgba(126,200,200,0.30)   →  REPLACE: hsl(180 50% 60% / 0.25)
FIND:    #7ec8c8                  →  REPLACE: hsl(180, 50%, 60%)

FIND:    rgba(176,127,212,0.18)   →  REPLACE: hsl(270 40% 65% / 0.15)
FIND:    rgba(176,127,212,0.13)   →  REPLACE: hsl(270 40% 65% / 0.1)
FIND:    rgba(176,127,212,0.30)   →  REPLACE: hsl(270 40% 65% / 0.25)
FIND:    #b07fd4                  →  REPLACE: hsl(270, 40%, 65%)
```

### Body background in `<style>` `:root`
```
FIND:    --bg: hsl(215,70%,6%)    →  REPLACE: --bg: hsl(240, 15%, 5%)
```

### Navbar header inline style
```
FIND:    background:hsl(213 70% 5%/0.95)
REPLACE: background:hsl(240 15% 5%/0.95)

FIND:    border-bottom:1px solid hsl(210 45% 16%/0.6)
REPLACE: border-bottom:1px solid hsl(240 10% 14%/0.6)
```

### Tab active style (THE BIG VISUAL DIFFERENCE)
The old theme uses a dark grey tab active state. The Lovable version uses **bright teal**:
```
OLD:     .tab-active { background:hsl(213,45%,14%) !important;color:var(--fg) !important;box-shadow:0 1px 4px rgba(0,0,0,.4); }
NEW:     .tab-active { background:hsl(165, 80%, 48%) !important;color:hsl(240, 15%, 5%) !important;font-weight:700;box-shadow:0 2px 12px hsl(165 80% 48% / 0.3); }
```

### Win rate gauge stroke color
```
FIND:    stroke:#22d3ee
REPLACE: stroke:hsl(165, 80%, 48%)

FIND:    filter:drop-shadow(0 0 5px hsl(165 80% 48%/0.5))
(keep this one as-is, it's already correct)
```

### Win/Loss dot colors in HTML
```
FIND:    background:#22d3ee  →  REPLACE: background:hsl(165, 80%, 48%)
FIND:    background:#f87171  →  REPLACE: background:hsl(0, 85%, 62%)
```

## Step 3: Verify these key visual differences

After applying all changes, confirm:
1. ✅ Background is neutral dark (NOT blue-tinted)
2. ✅ Active tab is BRIGHT TEAL with dark text (not grey)
3. ✅ Glass cards have neutral tint (not blue tint)
4. ✅ Win rate gauge ring is teal (not cyan)
5. ✅ Scrollbar thumb is teal-tinted
6. ✅ Market badges use HSL colors (not rgba/hex)
7. ✅ Positive values are teal green, negative are red
8. ✅ Borders are neutral grey, not blue-grey

## Prompt for Claude Code

Copy and paste this into Claude Code:

```
Read lovable/lovable-theme.css and lovable/CLAUDE_CODE_INSTRUCTIONS.md. 
Apply ALL changes described in the instructions to web_dashboard.py.
Replace the entire <style> block with the theme CSS, then do every 
find-and-replace for inline styles listed in the instructions file.
Do not skip any replacements. Every hsl(213...) and hsl(210...) and 
#22d3ee must be replaced.
```
