# 🧮 Calculator

A clean, responsive calculator built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

## Features

- **Four operations** — addition, subtraction, multiplication, division
- **Extra functions** — sign toggle (`+/−`), percentage (`%`), decimal input
- **Expression display** — shows the full equation above the result
- **Chained calculations** — e.g. `3 + 4 × 2` evaluated step by step
- **Division by zero** handled gracefully (shows `Error`)
- **Keyboard support** — type numbers and operators directly
- **Dark mode** — automatically adapts to system preference
- **Responsive** — centered layout works on any screen size

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0`–`9` | Enter digit |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Calculate |
| `Escape` | Clear (AC) |
| `Backspace` | Delete last digit |
| `%` | Percentage |

## File Structure

```
calculator/
├── index.html   ← markup & layout
├── style.css    ← CSS Grid layout, theming, dark mode
├── script.js    ← all calculator logic & keyboard events
└── README.md
```

## How to Run

1. Clone or download this repository.
2. Open `index.html` in any modern browser.
3. No build step or server required.

## Concepts Used

- **CSS Grid** — `repeat(4, 1fr)` for the button layout
- **Event delegation** — single listener on the grid handles all button clicks
- **`data-*` attributes** — drive button behaviour without touching JS for each button
- **Keyboard `keydown` events** — mapped via a plain object lookup
- **Floating-point cleanup** — `toPrecision(10)` prevents artifacts like `0.30000000000004`

## Live Demo

Open `index.html` locally or deploy to [GitHub Pages](https://pages.github.com/).

## License

MIT — free to use, modify, and share.
