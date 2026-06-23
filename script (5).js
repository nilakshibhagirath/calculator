// ============================================================
// Calculator — script.js
// ============================================================

// ---------- State ----------
let current    = '0';   // number currently being entered or displayed
let previous   = '';    // left-hand operand
let operator   = '';    // pending operator ( + − × ÷ )
let freshResult = false; // true after = or after choosing an operator

// ---------- DOM References ----------
const resultEl     = document.getElementById('result');
const expressionEl = document.getElementById('expression');

// ============================================================
// Display helpers
// ============================================================

/**
 * Clamp a numeric string to avoid overflowing the display.
 * Numbers with more than 12 digits are shown in scientific notation.
 */
function formatDisplay(value) {
  if (value === 'Error') return 'Error';
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  if (Math.abs(num) >= 1e13 || (Math.abs(num) < 1e-7 && num !== 0)) {
    return num.toExponential(5);
  }
  return parseFloat(num.toPrecision(10)).toString();
}

/** Push values to the screen. */
function updateDisplay() {
  resultEl.textContent = formatDisplay(current);
}

// ============================================================
// Core arithmetic
// ============================================================

/**
 * Compute a binary operation.
 * @param {string} a  - left operand (string)
 * @param {string} op - operator symbol
 * @param {string} b  - right operand (string)
 * @returns {number|'Error'}
 */
function compute(a, op, b) {
  const fa = parseFloat(a);
  const fb = parseFloat(b);

  switch (op) {
    case '+': return fa + fb;
    case '−': return fa - fb;
    case '×': return fa * fb;
    case '÷': return fb === 0 ? 'Error' : fa / fb;
    default:  return fb;
  }
}

/** Round away floating-point artifacts and return a clean string. */
function cleanNum(n) {
  if (n === 'Error') return n;
  return parseFloat(parseFloat(n).toPrecision(10)).toString();
}

// ============================================================
// Action handlers
// ============================================================

/** AC — reset everything. */
function handleClear() {
  current     = '0';
  previous    = '';
  operator    = '';
  freshResult = false;
  expressionEl.textContent = '';
  updateDisplay();
}

/** +/− — toggle the sign of the current number. */
function handleSign() {
  if (current === '0' || current === 'Error') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

/** % — divide the current number by 100. */
function handlePercent() {
  if (current === 'Error') return;
  current = cleanNum(parseFloat(current) / 100);
  updateDisplay();
}

/** 0–9 — append a digit. */
function handleDigit(val) {
  if (freshResult) {
    current     = val;
    freshResult = false;
  } else {
    if (current.length >= 15) return;          // cap input length
    current = (current === '0') ? val : current + val;
  }
  updateDisplay();
}

/** . — append a decimal point (only once). */
function handleDecimal() {
  if (freshResult) {
    current     = '0.';
    freshResult = false;
    updateDisplay();
    return;
  }
  if (!current.includes('.')) {
    current += '.';
    updateDisplay();
  }
}

/** ÷ × − + — store the operator and left-hand operand. */
function handleOperator(op) {
  // If there is already a pending operator and the user hasn't
  // started typing a new number, chain the operations.
  if (operator && !freshResult) {
    const res = compute(previous, operator, current);
    expressionEl.textContent = `${previous} ${operator} ${current} =`;
    current  = (typeof res === 'number') ? cleanNum(res) : res;
    previous = current;
  } else {
    previous = current;
  }

  operator    = op;
  freshResult = true;
  expressionEl.textContent = `${previous} ${op}`;
  updateDisplay();
}

/** = — evaluate the pending operation. */
function handleEquals() {
  if (!operator) return;

  const res = compute(previous, operator, current);
  expressionEl.textContent = `${previous} ${operator} ${current} =`;
  current     = (typeof res === 'number') ? cleanNum(res) : res;
  previous    = '';
  operator    = '';
  freshResult = true;
  updateDisplay();
}

/** Backspace — delete the last character of the current input. */
function handleBackspace() {
  if (freshResult || current === 'Error') return;
  current = (current.length > 1) ? current.slice(0, -1) : '0';
  updateDisplay();
}

// ============================================================
// Event delegation — button clicks
// ============================================================

document.querySelector('.grid').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;

  // Use if-else to dispatch to the correct handler
  if (action === 'clear') {
    handleClear();
  } else if (action === 'sign') {
    handleSign();
  } else if (action === 'percent') {
    handlePercent();
  } else if (action === 'num') {
    handleDigit(btn.dataset.val);
  } else if (action === 'decimal') {
    handleDecimal();
  } else if (action === 'op') {
    handleOperator(btn.dataset.op);
  } else if (action === 'equals') {
    handleEquals();
  }
});

// ============================================================
// Keyboard support
// ============================================================

/**
 * Map of keyboard keys to calculator actions.
 * Lets users type calculations without touching the mouse.
 */
const KEY_MAP = {
  '0': () => handleDigit('0'),
  '1': () => handleDigit('1'),
  '2': () => handleDigit('2'),
  '3': () => handleDigit('3'),
  '4': () => handleDigit('4'),
  '5': () => handleDigit('5'),
  '6': () => handleDigit('6'),
  '7': () => handleDigit('7'),
  '8': () => handleDigit('8'),
  '9': () => handleDigit('9'),
  '.': () => handleDecimal(),
  '+': () => handleOperator('+'),
  '-': () => handleOperator('−'),
  '*': () => handleOperator('×'),
  '/': () => handleOperator('÷'),
  'Enter': () => handleEquals(),
  '=': () => handleEquals(),
  'Escape': () => handleClear(),
  'Backspace': () => handleBackspace(),
  '%': () => handlePercent(),
};

document.addEventListener('keydown', function (e) {
  const handler = KEY_MAP[e.key];
  if (handler) {
    e.preventDefault(); // prevent "/" from opening browser quick-find etc.
    handler();
  }
});
