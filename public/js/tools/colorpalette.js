(function() {
    const palettesOutput = document.getElementById('palettesOutput');
    const generateBtn = document.getElementById('generateBtn');

    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        const toHex = x => Math.round(255 * f(x)).toString(16).padStart(2, '0');
        return '#' + toHex(0) + toHex(8) + toHex(4);
    }

    function generatePalette() {
        const baseHue = Math.floor(Math.random() * 360);
        const schemeType = ['complementary', 'analogous', 'triadic', 'split-complementary'][Math.floor(Math.random() * 4)];
        const colors = [];

        switch (schemeType) {
            case 'complementary':
                colors.push({ h: baseHue, l: 45 });
                colors.push({ h: baseHue, l: 65 });
                colors.push({ h: baseHue, l: 25 });
                colors.push({ h: (baseHue + 180) % 360, l: 50 });
                colors.push({ h: (baseHue + 180) % 360, l: 70 });
                break;

            case 'analogous':
                for (let i = 0; i < 5; i++) {
                    colors.push({ h: (baseHue + i * 25) % 360, l: 40 + i * 8 });
                }
                break;

            case 'triadic':
                for (let i = 0; i < 5; i++) {
                    const hueOffset = i < 2 ? 0 : (i < 4 ? 120 : 240);
                    colors.push({ h: (baseHue + hueOffset) % 360, l: 35 + (i % 2) * 25 });
                }
                break;

            case 'split-complementary':
                colors.push({ h: baseHue, l: 55 });
                colors.push({ h: baseHue, l: 35 });
                colors.push({ h: (baseHue + 150) % 360, l: 50 });
                colors.push({ h: (baseHue + 210) % 360, l: 50 });
                colors.push({ h: (baseHue + 180) % 360, l: 75 });
                break;
        }

        return colors.map(c => ({
            hex: hslToHex(c.h, 65 + Math.random() * 20, c.l),
            h: c.h
        }));
    }

    function generateMultiplePalettes(count) {
        const palettes = [];
        for (let i = 0; i < count; i++) {
            palettes.push(generatePalette());
        }
        return palettes;
    }

    function renderPalettes() {
        const palettes = generateMultiplePalettes(4);

        let html = '';
        palettes.forEach((palette, idx) => {
            const paletteName = ['互补色方案', '类似色方案', '三角色方案', '分裂互补方案'][idx] || `配色方案 ${idx + 1}`;

            html += `<div class="palette-section">
                <div class="section-title">🎨 ${paletteName}</div>
                <div class="palette-card">
                    <div class="palette-preview">`;

            palette.forEach(color => {
                html += `<div class="preview-swatch" style="background:${color.hex}" data-color="${color.hex.toUpperCase()}"></div>`;
            });

            html += `</div><div class="palette-info"><div class="color-list">`;

            palette.forEach(color => {
                html += `<div class="color-item" data-hex="${color.hex}">
                    <span class="color-dot-small" style="background:${color.hex}"></span>
                    <span class="color-hex">${color.hex.toUpperCase()}</span>
                    <span class="copy-icon">📋</span>
                </div>`;
            });

            html += `</div></div></div></div>`;
        });

        palettesOutput.innerHTML = html;

        palettesOutput.querySelectorAll('.color-item').forEach(item => {
            item.addEventListener('click', () => {
                copyToClipboard(item.dataset.hex, I18N.t('common.copied') + ' ' + item.dataset.hex);
            });
        });

        palettesOutput.querySelectorAll('.preview-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                copyToClipboard(swatch.dataset.color, I18N.t('common.copied') + ' ' + swatch.dataset.color);
            });
        });
    }

    generateBtn.addEventListener('click', renderPalettes);

    renderPalettes();
})();
