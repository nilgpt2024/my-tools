const areaUnits = {
    sqm: { name: '平方米', symbol: 'm²', toBase: 1, i18nKey: 'tools.area.squareMeter' },
    sqkm: { name: '平方公里', symbol: 'km²', toBase: 1000000, i18nKey: 'tools.area.squareKilometer' },
    hectare: { name: '公顷', symbol: 'ha', toBase: 10000, i18nKey: 'tools.area.hectare' },
    are: { name: '公亩', symbol: 'a', toBase: 100 },
    mu: { name: '亩', symbol: 'mu', toBase: 666.667, i18nKey: 'tools.area.mu' },
    qing: { name: '顷', symbol: 'qīng', toBase: 66666.7, i18nKey: 'tools.area.qing' },
    sqft: { name: '平方英尺', symbol: 'ft²', toBase: 0.092903, i18nKey: 'tools.area.squareFoot' },
    sqyd: { name: '平方码', symbol: 'yd²', toBase: 0.836127 },
    acre: { name: '英亩', symbol: 'acre', toBase: 4046.86, i18nKey: 'tools.area.acre' },
    sqmi: { name: '平方英里', symbol: 'mi²', toBase: 2589988 }
};

document.addEventListener('DOMContentLoaded', function() {
    convert();
    renderQuickRef();
});

function convert() {
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    const baseValue = fromValue * areaUnits[fromUnit].toBase;
    const result = baseValue / areaUnits[toUnit].toBase;

    document.getElementById('toValue').value = formatNumber(result);
}

function formatNumber(num) {
    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 0.00001 && num !== 0)) {
        return num.toExponential(6);
    }
    return parseFloat(num.toPrecision(10)).toString();
}

function renderQuickRef() {
    const container = document.getElementById('quickRef');
    const refs = [
        { title: '中国市制', items: [
            { label: '1 平方公里', value: '1500 亩' },
            { label: '1 公顷', value: '15 亩' },
            { label: '1 亩', value: '≈ 666.67 m²' },
            { label: '1 顷', value: '100 亩' }
        ]},
        { title: '国际单位', items: [
            { label: '1 km²', value: '100 公顷' },
            { label: '1 公顷', value: '10,000 m²' },
            { label: '1 英亩', value: '≈ 4046.86 m²' },
            { label: '1 mi²', value: '≈ 2.59 km²' }
        ]},
        { title: '英美单位', items: [
            { label: '1 ft²', value: '≈ 0.0929 m²' },
            { label: '1 yd²', value: '≈ 0.836 m²' },
            { label: '1 acre', value: '4840 yd²' },
            { label: '1 acre', value: '≈ 6.07 亩' }
        ]}
    ];

    container.innerHTML = refs.map(section => `
        <div style="background: linear-gradient(135deg, rgba(64,158,255,0.05), rgba(118,75,162,0.05)); padding: 20px; border-radius: var(--border-radius); border: 1px solid rgba(64,158,255,0.15);">
            <h4 style="font-size: 15px; margin-bottom: 12px; color: var(--primary-color);">${section.title}</h4>
            ${section.items.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed rgba(0,0,0,0.08);">
                    <span>${item.label}</span>
                    <strong style="color: var(--text-primary);">${item.value}</strong>
                </div>
            `).join('')}
        </div>
    `).join('');
}
