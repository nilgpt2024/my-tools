const heatUnits = {
    j: { name: '焦耳', symbol: 'J', toBase: 1, i18nKey: 'tools.heat.joule' },
    kj: { name: '千焦', symbol: 'kJ', toBase: 1000 },
    cal: { name: '卡路里', symbol: 'cal', toBase: 4.184, i18nKey: 'tools.heat.calorie' },
    kcal: { name: '千卡/大卡', symbol: 'kcal', toBase: 4184, i18nKey: 'tools.heat.kilocalorie' },
    btu: { name: '英热单位', symbol: 'BTU', toBase: 1055.06, i18nKey: 'tools.heat.btu' },
    kwh: { name: '千瓦时', symbol: 'kWh', toBase: 3600000, i18nKey: 'tools.heat.kwh' },
    wh: { name: '瓦时', symbol: 'Wh', toBase: 3600 },
    ev: { name: '电子伏特', symbol: 'eV', toBase: 1.602176634e-19, i18nKey: 'tools.heat.electronvolt' },
    therm: { name: '撒姆', symbol: 'thm', toBase: 105506000, i18nKey: 'tools.heat.therm' }
};

document.addEventListener('DOMContentLoaded', convert);

function convert() {
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    const baseValue = fromValue * heatUnits[fromUnit].toBase;
    const result = baseValue / heatUnits[toUnit].toBase;

    document.getElementById('toValue').value = formatNumber(result);
}

function formatNumber(num) {
    if (!isFinite(num)) return num > 0 ? '+∞' : '-∞';
    if (num === 0) return '0';
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 0.001 && num !== 0)) return num.toExponential(6);
    return parseFloat(num.toPrecision(10)).toString();
}
