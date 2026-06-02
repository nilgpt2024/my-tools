const pressureUnits = {
    pa: { name: '帕斯卡', symbol: 'Pa', toBase: 1, i18nKey: 'tools.pressure.pascal' },
    kpa: { name: '千帕', symbol: 'kPa', toBase: 1000, i18nKey: 'tools.pressure.kilopascal' },
    mpa: { name: '兆帕', symbol: 'MPa', toBase: 1000000 },
    bar: { name: '巴', symbol: 'bar', toBase: 100000, i18nKey: 'tools.pressure.bar' },
    mbar: { name: '毫巴', symbol: 'mbar', toBase: 100 },
    atm: { name: '标准大气压', symbol: 'atm', toBase: 101325, i18nKey: 'tools.pressure.atm' },
    psi: { name: '磅/平方英寸', symbol: 'psi', toBase: 6894.76, i18nKey: 'tools.pressure.psi' },
    mmhg: { name: '毫米汞柱', symbol: 'mmHg', toBase: 133.322, i18nKey: 'tools.pressure.mmHg' },
    torr: { name: '托', symbol: 'Torr', toBase: 133.322, i18nKey: 'tools.pressure.torr' },
    inh2o: { name: '英寸水柱', symbol: 'inH₂O', toBase: 248.84 }
};

document.addEventListener('DOMContentLoaded', convert);

function convert() {
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    const baseValue = fromValue * pressureUnits[fromUnit].toBase;
    const result = baseValue / pressureUnits[toUnit].toBase;

    document.getElementById('toValue').value = formatNumber(result);
}

function formatNumber(num) {
    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 0.00001 && num !== 0)) return num.toExponential(6);
    return parseFloat(num.toPrecision(10)).toString();
}
