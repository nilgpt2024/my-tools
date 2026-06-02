let canvas, ctx, imageData;
let originalImage = null;
let pickedColors = [];
let scale = 1;

document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('imageCanvas');
    ctx = canvas.getContext('2d');

    const dropZone = document.getElementById('dropZone');
    dropZone.ondragover = (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--primary-color)'; };
    dropZone.ondragleave = () => dropZone.style.borderColor = 'var(--border-color)';
    dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) loadImageFile(file);
    };

    setupCanvasEvents();
});

function setupCanvasEvents() {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mouseleave', hideMagnifier);
}

function loadImage(e) {
    const file = e.target.files[0];
    if (file) loadImageFile(file);
}

function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            
            const maxWidth = Math.min(900, window.innerWidth - 80);
            let w = img.width, h = img.height;
            if (w > maxWidth) { scale = maxWidth / w; h *= scale; w = maxWidth; }

            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            imageData = ctx.getImageData(0, 0, w, h);

            document.getElementById('pickerSection').style.display = 'block';
            pickedColors = [];
            updatePickedColorsList();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleMouseMove(e) {
    if (!imageData) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        showMagnifier(e.clientX, e.clientY, x, y);
        updateCurrentColor(x, y);
    } else {
        hideMagnifier();
    }
}

function handleClick(e) {
    if (!imageData) return;

    const mode = document.getElementById('pickMode').value;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const color = getColorAt(x, y);
        
        if (mode === 'single') {
            pickedColors = [color];
        } else {
            if (!pickedColors.find(c => c.hex === color.hex)) {
                pickedColors.push(color);
            }
        }
        
        updatePickedColorsList();
        showToast(I18N.t('common.copied'), 'success');
    }
}

function showMagnifier(mouseX, mouseY, imgX, imgY) {
    const magnifier = document.getElementById('magnifier');
    const magCanvas = document.getElementById('magnifierCanvas');
    const magCtx = magCanvas.getContext('2d');

    magnifier.style.display = 'block';
    magnifier.style.left = (mouseX + 15) + 'px';
    magnifier.style.top = (mouseY + 15) + 'px';

    const zoomSize = 11;
    const pixelSize = 80 / zoomSize;

    for (let i = 0; i < zoomSize; i++) {
        for (let j = 0; j < zoomSize; j++) {
            const px = imgX + i - Math.floor(zoomSize / 2);
            const py = imgY + j - Math.floor(zoomSize / 2);
            
            if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
                const idx = (py * canvas.width + px) * 4;
                magCtx.fillStyle = `rgb(${imageData.data[idx]}, ${imageData.data[idx+1]}, ${imageData.data[idx+2]})`;
            } else {
                magCtx.fillStyle = '#ccc';
            }
            magCtx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
        }
    }

    magCtx.strokeStyle = 'rgba(64, 158, 255, 0.8)';
    magCtx.lineWidth = 1;
    magCtx.strokeRect(pixelSize * Math.floor(zoomSize/2), pixelSize * Math.floor(zoomSize/2), pixelSize, pixelSize);
}

function hideMagnifier() {
    document.getElementById('magnifier').style.display = 'none';
}

function updateCurrentColor(x, y) {
    const color = getColorAt(x, y);
    document.getElementById('currentSwatch').style.backgroundColor = color.hex;
    document.getElementById('currentColorInfo').innerHTML = `<strong>${color.hex}</strong> RGB(${color.r}, ${color.g}, ${color.b})`;
}

function getColorAt(x, y) {
    const idx = (y * canvas.width + x) * 4;
    const r = imageData.data[idx];
    const g = imageData.data[idx + 1];
    const b = imageData.data[idx + 2];

    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

    return { r, g, b, hex };
}

function copyCurrentColor() {
    const info = document.getElementById('currentColorInfo').textContent.match(/#[A-F0-9]{6}/);
    if (info) {
        copyToClipboard(info[0], I18N.t('common.copied'));
    }
}

function extractPalette() {
    if (!imageData) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const count = parseInt(document.getElementById('colorCount').value) || 8;
    const colorMap = new Map();
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(entry => {
            const [r, g, b] = entry[0].split(',').map(Number);
            return { r, g, b, hex: '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase() };
        });

    renderExtractedPalette(sortedColors);
}

function renderExtractedPalette(colors) {
    const section = document.getElementById('extractedPaletteSection');
    const container = document.getElementById('extractedPalette');

    section.style.display = 'block';
    container.innerHTML = colors.map(c =>
        `<div class="palette-color" style="background: ${c.hex};" title="${c.hex}" onclick="copyToClipboard('${c.hex}', I18N.t('common.copied'))"></div>`
    ).join('');
}

function updatePickedColorsList() {
    const section = document.getElementById('pickedColorsSection');
    const list = document.getElementById('pickedColorsList');
    const countEl = document.getElementById('pickedCount');

    if (pickedColors.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    countEl.textContent = pickedColors.length;

    list.innerHTML = pickedColors.map((c, i) => `
        <div class="picked-color-card">
            <div class="picked-color-swatch" style="background: ${c.hex};" onclick="copyToClipboard('${c.hex}', I18N.t('common.copied'))"></div>
            <div class="picked-color-info">
                <div>${c.hex}</div>
                <div>RGB(${c.r}, ${c.g}, ${c.b})</div>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px; margin-top: 4px;" onclick="removePickedColor(${i})">删除</button>
            </div>
        </div>
    `).join('');
}

function removePickedColor(index) {
    pickedColors.splice(index, 1);
    updatePickedColorsList();
}

function clearPickedColors() {
    pickedColors = [];
    updatePickedColorsList();
    document.getElementById('extractedPaletteSection').style.display = 'none';
}
