const lengthUnits = {
    m: { name: '米', symbol: 'm', toBase: 1, i18nKey: 'tools.length.units.meter' },
    km: { name: '千米', symbol: 'km', toBase: 1000, i18nKey: 'tools.length.units.kilometer' },
    cm: { name: '厘米', symbol: 'cm', toBase: 0.01, i18nKey: 'tools.length.units.centimeter' },
    mm: { name: '毫米', symbol: 'mm', toBase: 0.001, i18nKey: 'tools.length.units.millimeter' },
    um: { name: '微米', symbol: 'μm', toBase: 0.000001 },
    nm: { name: '纳米', symbol: 'nm', toBase: 0.000000001 },
    ft: { name: '英尺', symbol: 'ft', toBase: 0.3048, i18nKey: 'tools.length.units.inch' },
    in: { name: '英寸', symbol: 'in', toBase: 0.0254, i18nKey: 'tools.length.units.inch' },
    yd: { name: '码', symbol: 'yd', toBase: 0.9144, i18nKey: 'tools.length.units.yard' },
    mi: { name: '英里', symbol: 'mi', toBase: 1609.344, i18nKey: 'tools.length.units.mile' },
    nmi: { name: '海里', symbol: 'nmi', toBase: 1852 },
    li: { name: '里', symbol: 'li', toBase: 500 },
    zhang: { name: '丈', symbol: 'zhang', toBase: 3.33333 },
    chi: { name: '尺', symbol: 'chi', toBase: 0.333333 },
    cun: { name: '寸', symbol: 'cun', toBase: 0.0333333 },
    fen: { name: '分', symbol: 'fen', toBase: 0.00333333 },
    au: { name: '天文单位', symbol: 'AU', toBase: 149597870700 },
    ly: { name: '光年', symbol: 'ly', toBase: 9.461e+15, i18nKey: 'tools.length.units.lightYear' },
    pc: { name: '秒差距', symbol: 'pc', toBase: 3.086e+16 }
};

document.addEventListener('DOMContentLoaded', function() {
    convert();
    renderConversionTable();
});

function convert() {
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    const baseValue = fromValue * lengthUnits[fromUnit].toBase;
    const result = baseValue / lengthUnits[toUnit].toBase;

    document.getElementById('toValue').value = formatNumber(result);
}

function formatNumber(num) {
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 0.0001 && num !== 0)) {
        return num.toExponential(6);
    }
    return parseFloat(num.toPrecision(10)).toString();
}

function renderConversionTable() {
    const tbody = document.getElementById('conversionTable');
    const entries = Object.entries(lengthUnits);

    tbody.innerHTML = entries.map(([key, unit], index) => `
        <tr style="${index % 2 === 0 ? 'background: #fafafa;' : ''} border-bottom: 1px solid var(--border-color);">
            <td style="padding: 10px 12px;">${unit.name} (${unit.symbol})</td>
            <td style="padding: 10px 12px; text-align: right; font-family: monospace;">${unit.toBase === 1 ? '<strong>1</strong>' : formatNumber(unit.toBase)}</td>
        </tr>
    `).join('');
}
