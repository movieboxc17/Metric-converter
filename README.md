# Metric Converter (Web UI)

A small, responsive metric converter implemented with plain HTML, CSS and JavaScript.

Features:
- Convert between units in categories: Length, Volume, Mass, Area, Temperature
- Fast, client-side conversion using base-unit normalization
- Quick-presets for common conversions
- Easy to extend — add units in `script.js` under the UNITS object

How to use:
1. Place `index.html`, `styles.css`, and `script.js` in the same folder.
2. Open `index.html` in a browser.
3. Select a category, choose units, enter a value, and click Convert (or it converts live as you type).

Extending:
- To add new units or categories edit `UNITS` in `script.js`.
- For multiplicative categories, add unitName: factor, where factor is multiplicative to the category base.
- Temperature requires special handling (already implemented).

License: MIT (copy, change, reuse)
