// Metric Converter JS
// Add or modify units inside the "units" object.
// Each category uses a base unit; values are conversion factors to that base.

const UNITS = {
  Length: {
    base: 'm',
    units: {
      'km': 1000,
      'm': 1,
      'dm': 0.1,
      'cm': 0.01,
      'mm': 0.001,
      'mi': 1609.344,
      'yd': 0.9144,
      'ft': 0.3048,
      'in': 0.0254
    }
  },
  Volume: {
    base: 'L',
    units: {
      'm³': 1000,        // cubic meter to liters
      'L': 1,
      'mL': 0.001,
      'gal (US)': 3.785411784,
      'qt (US)': 0.946352946,
      'pt (US)': 0.473176473
    }
  },
  Mass: {
    base: 'kg',
    units: {
      't': 1000,
      'kg': 1,
      'g': 0.001,
      'mg': 0.000001,
      'lb': 0.45359237,
      'oz': 0.028349523125
    }
  },
  Area: {
    base: 'm²',
    units: {
      'km²': 1_000_000,
      'm²': 1,
      'cm²': 0.0001,
      'mm²': 0.000001,
      'acre': 4046.8564224
    }
  },
  Temperature: {
    // Temperature cannot use multiplicative-only conversion; special-handling used below.
    base: '°C',
    units: {
      '°C': 'c',
      '°F': 'f',
      'K': 'k'
    }
  }
};

// DOM
const categoryEl = document.getElementById('category');
const fromEl = document.getElementById('fromUnit');
const toEl = document.getElementById('toUnit');
const inputEl = document.getElementById('inputValue');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const swapBtn = document.getElementById('swapBtn');
const resultValueEl = document.getElementById('resultValue');
const resultMetaEl = document.getElementById('resultMeta');
const quickGrid = document.getElementById('quickGrid');

function populateCategories(){
  Object.keys(UNITS).forEach(cat=>{
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryEl.appendChild(opt);
  });
}

function populateUnits(category){
  fromEl.innerHTML = '';
  toEl.innerHTML = '';
  const u = UNITS[category].units;
  Object.keys(u).forEach(name=>{
    const a = document.createElement('option');
    a.value = name; a.textContent = name;
    fromEl.appendChild(a);
    const b = a.cloneNode(true);
    toEl.appendChild(b);
  });
}

function formatNumber(n){
  if (!isFinite(n)) return '—';
  if (Math.abs(n) >= 1) return Number(n.toFixed(6)).toLocaleString();
  return Number(n.toPrecision(6)).toString();
}

// Temperature conversions
function tempToC(value, unit){
  if (unit === '°C' || unit === 'c') return Number(value);
  if (unit === '°F' || unit === 'f') return (Number(value) - 32) * 5/9;
  if (unit === 'K' || unit === 'k') return Number(value) - 273.15;
  return NaN;
}
function cToTemp(celsius, unit){
  if (unit === '°C' || unit === 'c') return celsius;
  if (unit === '°F' || unit === 'f') return (celsius * 9/5) + 32;
  if (unit === 'K' || unit === 'k') return celsius + 273.15;
  return NaN;
}

function convert(){
  const category = categoryEl.value;
  const from = fromEl.value;
  const to = toEl.value;
  const raw = inputEl.value.trim();
  if (raw === '') {
    resultValueEl.textContent = '—';
    resultMetaEl.textContent = '';
    return;
  }
  const value = Number(raw);
  if (!isFinite(value)) {
    resultValueEl.textContent = 'Invalid';
    resultMetaEl.textContent = '';
    return;
  }

  if (category === 'Temperature'){
    const c = tempToC(value, from);
    const out = cToTemp(c, to);
    resultValueEl.textContent = `${formatNumber(out)} ${to}`;
    resultMetaEl.textContent = `${value} ${from} → ${formatNumber(out)} ${to}`;
    return;
  }

  const mapping = UNITS[category].units;
  const baseFrom = mapping[from];
  const baseTo = mapping[to];
  // convert to base, then to target
  const inBase = value * baseFrom;
  const out = inBase / baseTo;
  resultValueEl.textContent = `${formatNumber(out)} ${to}`;
  resultMetaEl.textContent = `${value} ${from} → ${formatNumber(out)} ${to}`;
}

function reset(){
  inputEl.value = '';
  resultValueEl.textContent = '—';
  resultMetaEl.textContent = '';
}

function swap(){
  const a = fromEl.value;
  fromEl.value = toEl.value;
  toEl.value = a;
  convert();
}

function buildQuick(){
  // small helpful presets
  const presets = [
    {cat:'Length', from:'km', to:'mi', v: '1'},
    {cat:'Length', from:'m', to:'ft', v: '10'},
    {cat:'Volume', from:'L', to:'gal (US)', v: '3.5'},
    {cat:'Mass', from:'kg', to:'lb', v: '5'},
    {cat:'Temperature', from:'°C', to:'°F', v: '20'}
  ];
  quickGrid.innerHTML = '';
  presets.forEach(p=>{
    const el = document.createElement('button');
    el.className = 'quick-item';
    el.textContent = `${p.v} ${p.from} → ${p.to}`;
    el.onclick = ()=>{
      categoryEl.value = p.cat;
      populateUnits(p.cat);
      fromEl.value = p.from;
      toEl.value = p.to;
      inputEl.value = p.v;
      convert();
    };
    quickGrid.appendChild(el);
  });
}

// events
convertBtn.addEventListener('click', convert);
resetBtn.addEventListener('click', reset);
swapBtn.addEventListener('click', swap);
categoryEl.addEventListener('change', ()=>{ populateUnits(categoryEl.value); reset(); });
[inputEl, fromEl, toEl].forEach(el => el.addEventListener('input', () => {
  // live convert on typing
  convert();
}));

// init
populateCategories();
categoryEl.value = Object.keys(UNITS)[0];
populateUnits(categoryEl.value);
buildQuick();
