const timeUnits = {
    ms: { name: '毫秒', symbol: 'ms', toBase: 0.001, i18nKey: 'tools.time.millisecond' },
    s: { name: '秒', symbol: 's', toBase: 1, i18nKey: 'tools.time.second' },
    min: { name: '分钟', symbol: 'min', toBase: 60, i18nKey: 'tools.time.minute' },
    h: { name: '小时', symbol: 'h', toBase: 3600, i18nKey: 'tools.time.hour' },
    d: { name: '天', symbol: 'd', toBase: 86400, i18nKey: 'tools.time.day' },
    w: { name: '周', symbol: 'week', toBase: 604800, i18nKey: 'tools.time.week' },
    mo: { name: '月', symbol: 'month', toBase: 2592000, i18nKey: 'tools.time.month' },
    q: { name: '季度', symbol: 'quarter', toBase: 7776000 },
    y: { name: '年', symbol: 'year', toBase: 31536000, i18nKey: 'tools.time.year' }
};

document.addEventListener('DOMContentLoaded', convert);

function convert() {
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    const baseValue = fromValue * timeUnits[fromUnit].toBase;
    const result = baseValue / timeUnits[toUnit].toBase;

    document.getElementById('toValue').value = formatNumber(result);
}

function formatNumber(num) {
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 0.000001 && num !== 0)) return num.toExponential(6);
    return parseFloat(num.toPrecision(10)).toString();
}
