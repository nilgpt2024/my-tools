let currentColor = { r: 64, g: 158, b: 255, a: 1 };
let recentColors = [];

const palettes = {
    basic: ['#FF6B6B', '#EE5A24', '#F79F1F', '#FFC312', '#C4E538', '#A3CB38', '#009432', '#00D2D3', '#01A3A4', '#1289A7', '#0652DD', '#3742FA', '#833471', '#FDA7DF', '#ED4C67', '#B53471', '#6AB04C', '#EB4D4B', '#686DE0', '#30336B', '#22A6B3', '#218C74', '#F9CA24', '#E056FD', '#686DE0'],
    material: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#FF4081', '#5C6BC0', '#26C6DA', '#66BB6A', '#FFA726', '#8D6E63', '#78909C'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#FFC8DD', '#BDE0FE', '#A2D2FF', '#CDB4DB', '#FFAFCC', '#B5E48C', '#DCD3FF', '#FFDAC1', '#E2CEAC', '#A0C4FF', '#FFADAD', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF', '#FFFFFC', '#FFD6A5'],
    gradient: [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)',
        'linear-gradient(135deg, #30cfd0, #330867)',
        'linear-gradient(135deg, #a8edea, #fed6e3)',
        'linear-gradient(135deg, #ff0844, #ffb199)',
        'linear-gradient(135deg, #f6d365, #fda085)',
        'linear-gradient(135deg, #96fbc4, #f9f586)',
        'linear-gradient(135deg, #cd9cf2, #f6f3ff)',
        'linear-gradient(135deg, #e0c3fc, #8ec5fc)'
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    showPalette('basic');
    updateAllDisplays();
});

function showPalette(type) {
    document.querySelectorAll('.palette-section .tab-btn').forEach((btn, i) => {
        const types = ['basic', 'material', 'pastel', 'gradient'];
        btn.classList.toggle('active', types[i] === type);
    });

    const grid = document.getElementById('paletteGrid');
    const colors = palettes[type];

    if (type === 'gradient') {
        grid.innerHTML = colors.map(c => 
            `<div class="palette-item" style="background: ${c}; width: 60px; height: 60px;" onclick="selectGradientColor('${c}')"></div>`
        ).join('');
    } else {
        grid.innerHTML = colors.map(c => 
            `<div class="palette-item" style="background: ${c};" onclick="setColorFromHex('${c}')"></div>`
        ).join('');
    }
}

function selectGradientColor(gradient) {
    showToast(I18N.t('common.copied'), 'info');
    navigator.clipboard.writeText(gradient);
}

function setColorFromHex(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        currentColor.r = parseInt(result[1], 16);
        currentColor.g = parseInt(result[2], 16);
        currentColor.b = parseInt(result[3], 16);
        updateAllDisplays();
        addRecentColor(hex);
    }
}

function updateFromNative(hex) {
    setColorFromHex(hex);
}

function updateFromHex() {
    let hex = document.getElementById('hexInput').value.trim();
    if (!hex.startsWith('#')) hex = '#' + hex;

    if (/^#?[a-f\d]{6}$/i.test(hex)) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            currentColor.r = parseInt(result[1], 16);
            currentColor.g = parseInt(result[2], 16);
            currentColor.b = parseInt(result[3], 16);
            updateAllDisplays();
        }
    }
}

function updateFromRGB() {
    const rgb = document.getElementById('rgbInput').value.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
        currentColor.r = Math.min(255, Math.max(0, parseInt(rgb[0])));
        currentColor.g = Math.min(255, Math.max(0, parseInt(rgb[1])));
        currentColor.b = Math.min(255, Math.max(0, parseInt(rgb[2])));
        updateAllDisplays();
    }
}

function updateFromHSL() {
    const h = parseInt(document.getElementById('hueSlider').value);
    const s = parseInt(document.getElementById('satSlider').value);
    const l = parseInt(document.getElementById('lightSlider').value);

    document.getElementById('sValue').textContent = s + '%';
    document.getElementById('lValue').textContent = l + '%';

    const rgb = hslToRgb(h, s, l);
    currentColor.r = rgb.r;
    currentColor.g = rgb.g;
    currentColor.b = rgb.b;
    updateAllDisplays();
}

function updateFromHSLInput() {
    const hsl = document.getElementById('hslInput').value.match(/\d+/g);
    if (hsl && hsl.length >= 3) {
        document.getElementById('hueSlider').value = hsl[0];
        document.getElementById('satSlider').value = hsl[1];
        document.getElementById('lightSlider').value = hsl[2];
        updateFromHSL();
    }
}

function updateAlpha() {
    const alpha = parseInt(document.getElementById('alphaSlider').value);
    currentColor.a = alpha / 100;
    document.getElementById('aValue').textContent = alpha + '%';
    updateRGBA();
}

function updateAllDisplays() {
    const hex = rgbToHex(currentColor.r, currentColor.g, currentColor.b);
    const rgb = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
    
    const hsl = rgbToHsl(currentColor.r, currentColor.g, currentColor.b);
    const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    document.getElementById('colorPreview').style.backgroundColor = hex;
    document.getElementById('hexInput').value = hex;
    document.getElementById('rgbInput').value = rgb;
    document.getElementById('hslInput').value = hslStr;
    document.getElementById('rgbaInput').value = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`;
    document.getElementById('nativeColorPicker').value = hex;

    document.getElementById('hueSlider').value = hsl.h;
    document.getElementById('satSlider').value = hsl.s;
    document.getElementById('lightSlider').value = hsl.l;
    document.getElementById('sValue').textContent = hsl.s + '%';
    document.getElementById('lValue').textContent = hsl.l + '%';
}

function updateRGBA() {
    document.getElementById('rgbaInput').value = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`;
}

function copyColor(type) {
    let value = '';
    switch(type) {
        case 'hex': value = document.getElementById('hexInput').value; break;
        case 'rgb': value = document.getElementById('rgbInput').value; break;
        case 'hsl': value = document.getElementById('hslInput').value; break;
        case 'rgba': value = document.getElementById('rgbaInput').value; break;
    }
    copyToClipboard(value, I18N.t('common.copied'));
    addRecentColor(document.getElementById('hexInput').value);
}

function addRecentColor(hex) {
    if (!recentColors.includes(hex)) {
        recentColors.unshift(hex);
        if (recentColors.length > 12) recentColors.pop();
        
        const container = document.getElementById('recentColors');
        container.innerHTML = recentColors.map(c => 
            `<div class="recent-color" style="background: ${c};" onclick="setColorFromHex('${c}')" title="${c}"></div>`
        ).join('');
    }
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
            case g: h = ((b - r) / d + 2) * 60; break;
            case b: h = ((r - g) / d + 4) * 60; break;
        }
    }

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
}
