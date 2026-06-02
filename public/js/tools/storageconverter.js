const storageUnits = [
    { key: 'b', name: '位', symbol: 'bit', factor: 0.125, color: '#FF6B6B', i18nKey: 'tools.storageconverter.bit' },
    { key: 'B', name: '字节', symbol: 'B', factor: 1, color: '#4ECDC4', i18nKey: 'tools.storageconverter.byte' },
    { key: 'KB', name: '千字节', symbol: 'KB', factor: 1024, color: '#45B7D1', i18nKey: 'tools.storageconverter.kilobyte' },
    { key: 'MB', name: '兆字节', symbol: 'MB', factor: 1048576, color: '#96CEB4', i18nKey: 'tools.storageconverter.megabyte' },
    { key: 'GB', name: '吉字节', symbol: 'GB', factor: 1073741824, color: '#FFEAA7', i18nKey: 'tools.storageconverter.gigabyte' },
    { key: 'TB', name: '太字节', symbol: 'TB', factor: 1099511627776, color: '#DDA0DD', i18nKey: 'tools.storageconverter.terabyte' },
    { key: 'PB', name: '拍字节', symbol: 'PB', factor: 1125899906842624, color: '#98D8C8', i18nKey: 'tools.storageconverter.petabyte' },
    { key: 'EB', name: '艾字节', symbol: 'EB', factor: 1152921504606846976, color: '#F7DC6F' }
];

document.addEventListener('DOMContentLoaded', function() {
    convert();
});

function convert() {
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    const fromFactor = storageUnits.find(u => u.key === fromUnit).factor;
    const toFactor = storageUnits.find(u => u.key === toUnit).factor;

    const baseBytes = fromValue * fromFactor;
    const result = baseBytes / toFactor;

    document.getElementById('toValue').value = formatNumber(result);
    renderAllConversions(baseBytes);
    renderVisual(baseBytes);
}

function formatNumber(num) {
    if (!isFinite(num)) return '∞';
    if (num === 0) return '0';
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 0.001 && num !== 0)) return num.toExponential(4);
    return parseFloat(num.toPrecision(10)).toString();
}

function renderAllConversions(baseBytes) {
    const container = document.getElementById('allConversions');
    container.innerHTML = storageUnits.map(unit => {
        const value = baseBytes / unit.factor;
        return `
            <div style="background: linear-gradient(135deg, ${unit.color}15, ${unit.color}08); 
                        padding: 14px; border-radius: 8px; text-align: center; 
                        border-left: 3px solid ${unit.color};">
                <div style="font-size: 11px; color: var(--text-light);">${unit.name} (${unit.symbol})</div>
                <div style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${formatNumber(value)}</div>
            </div>
        `;
    }).join('');
}

function renderVisual(baseBytes) {
    const visual = document.getElementById('storageVisual');
    if (baseBytes === 0) {
        visual.innerHTML = '';
        return;
    }

    const values = storageUnits.map(u => Math.log10(Math.max(u.factor, 1)));
    const maxVal = Math.max(...values);
    const inputLog = Math.log10(Math.max(baseBytes, 1));

    visual.innerHTML = storageUnits.map((unit, i) => {
        const unitLog = Math.log10(unit.factor);
        let height = ((inputLog - unitLog + 5) / 10) * 100;
        height = Math.max(2, Math.min(100, height));

        return `<div class="storage-bar" style="height: ${height}%; background: ${unit.color}; opacity: ${height > 5 ? 1 : 0.3};"><span>${unit.symbol}</span></div>`;
    }).join('');
}
