document.addEventListener('DOMContentLoaded', function() {
    setTemp(25);
});

function cToF(c) { return c * 9/5 + 32; }
function fToC(f) { return (f - 32) * 5/9; }
function cToK(c) { return c + 273.15; }
function kToC(k) { return k - 273.15; }

function formatTemp(num) {
    if (num === null || isNaN(num)) return '';
    const rounded = Math.round(num * 100) / 100;
    return rounded.toString();
}

function updateThermometer(c) {
    const fill = document.getElementById('thermoFill');
    let percent = ((c + 50) / 350) * 100;
    percent = Math.max(0, Math.min(100, percent));
    fill.style.height = percent + '%';
}

function updateAll(c) {
    document.getElementById('celsius').value = formatTemp(c);
    document.getElementById('fahrenheit').value = formatTemp(cToF(c));
    document.getElementById('kelvin').value = formatTemp(cToK(c));
    updateThermometer(c);
}

function convertFromC() {
    const c = parseFloat(document.getElementById('celsius').value);
    if (!isNaN(c)) updateAll(c);
}

function convertFromF() {
    const f = parseFloat(document.getElementById('fahrenheit').value);
    if (!isNaN(f)) updateAll(fToC(f));
}

function convertFromK() {
    const k = parseFloat(document.getElementById('kelvin').value);
    if (!isNaN(k)) updateAll(kToC(k));
}

function setTemp(c) {
    updateAll(c);
}
