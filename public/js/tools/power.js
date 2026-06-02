const powerUnits = {
    w: { name: '瓦特', symbol: 'W', toBase: 1, i18nKey: 'tools.power.watt' },
    kw: { name: '千瓦', symbol: 'kW', toBase: 1000, i18nKey: 'tools.power.kilowatt' },
    mw: { name: '兆瓦', symbol: 'MW', toBase: 1000000 },
    hp: { name: '英制马力', symbol: 'hp', toBase: 745.699872, i18nKey: 'tools.power.horsepower' },
    ps: { name: '公制马力', symbol: 'PS', toBase: 735.49875 },
    btuh: { name: '英热/时', symbol: 'BTU/h', toBase: 0.293071, i18nKey: 'tools.power.btuPerHour' },
    cals: { name: '卡/秒', symbol: 'cal/s', toBase: 4.184 },
    ftlb: { name: '英尺·磅/秒', symbol: 'ft·lb/s', toBase: 1.35582 }
};

document.addEventListener('DOMContentLoaded', convert);

function convert() {
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    const baseValue = fromValue * powerUnits[fromUnit].toBase;
    const result = baseValue / powerUnits[toUnit].toBase;

    document.getElementById('toValue').value = formatNumber(result);
}

function formatNumber(num) {
    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 0.00001 && num !== 0)) return num.toExponential(6);
    return parseFloat(num.toPrecision(10)).toString();
}
