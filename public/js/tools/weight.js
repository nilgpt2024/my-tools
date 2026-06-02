const weightUnits = {
    kg: { name: '千克', symbol: 'kg', toBase: 1, i18nKey: 'tools.weight.kilogram' },
    g: { name: '克', symbol: 'g', toBase: 0.001, i18nKey: 'tools.weight.gram' },
    mg: { name: '毫克', symbol: 'mg', toBase: 0.000001, i18nKey: 'tools.weight.milligram' },
    t: { name: '公吨', symbol: 't', toBase: 1000, i18nKey: 'tools.weight.ton' },
    lb: { name: '磅', symbol: 'lb', toBase: 0.45359237, i18nKey: 'tools.weight.pound' },
    oz: { name: '盎司', symbol: 'oz', toBase: 0.028349523125, i18nKey: 'tools.weight.ounce' },
    jin: { name: '斤', symbol: '斤', toBase: 0.5, i18nKey: 'tools.weight.jin' },
    liang: { name: '两', symbol: '两', toBase: 0.05, i18nKey: 'tools.weight.liang' },
    qian: { name: '钱', symbol: '钱', toBase: 0.005 },
    st: { name: '英石', symbol: 'st', toBase: 6.35029318 },
    ct: { name: '克拉', symbol: 'ct', toBase: 0.0002, i18nKey: 'tools.weight.carat' }
};

document.addEventListener('DOMContentLoaded', convert);

function convert() {
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    const baseValue = fromValue * weightUnits[fromUnit].toBase;
    const result = baseValue / weightUnits[toUnit].toBase;

    document.getElementById('toValue').value = formatNumber(result);
}

function formatNumber(num) {
    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 0.00001 && num !== 0)) return num.toExponential(6);
    return parseFloat(num.toPrecision(10)).toString();
}
