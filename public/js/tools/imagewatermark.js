let mainImage = null;
let watermarkImage = null;
let currentTab = 'text';

document.addEventListener('DOMContentLoaded', function() {
    setupSliders();
});

function setupSliders() {
    const sliders = [
        { id: 'textOpacity', display: 'textOpacityValue' },
        { id: 'imgOpacity', display: 'imgOpacityValue' },
        { id: 'imgScale', display: 'imgScaleValue', suffix: '%', multiply: 100 }
    ];

    sliders.forEach(slider => {
        const el = document.getElementById(slider.id);
        if (el) {
            el.addEventListener('input', function() {
                let val = this.value;
                if (slider.multiply) val = Math.round(val * slider.multiply);
                document.getElementById(slider.display).textContent = val + (slider.suffix || '%');
            });
        }
    });
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach((btn, index) => {
        btn.classList.toggle('active', (tab === 'text' && index === 0) || (tab === 'image' && index === 1));
    });
    document.getElementById('textTab').classList.toggle('active', tab === 'text');
    document.getElementById('imageTab').classList.toggle('active', tab === 'image');
}

function loadImage(input, type) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            mainImage = img;
            if (type === 'main') {
                document.getElementById('previewMain').src = e.target.result;
                document.getElementById('previewMain').style.display = 'block';
            }
            document.getElementById('previewArea').style.display = 'block';
            previewWatermark();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function loadWatermarkImage(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            watermarkImage = img;
            document.getElementById('previewWatermark').src = e.target.result;
            document.getElementById('previewWatermark').style.display = 'block';
            if (mainImage) previewWatermark();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function previewWatermark() {
    if (!mainImage) return;

    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');

    const maxSize = 800;
    let width = mainImage.width;
    let height = mainImage.height;

    if (width > maxSize) {
        height = (maxSize / width) * height;
        width = maxSize;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(mainImage, 0, 0, width, height);

    if (currentTab === 'text') {
        applyTextWatermark(ctx, width, height);
    } else if (watermarkImage) {
        applyImageWatermark(ctx, width, height);
    }
}

function applyTextWatermark(ctx, width, height) {
    const text = document.getElementById('watermarkText').value || '版权所有';
    const fontSize = parseInt(document.getElementById('fontSize').value) || 24;
    const opacity = parseFloat(document.getElementById('textOpacity').value) || 0.5;
    const color = document.getElementById('textColor').value || '#ffffff';
    const position = document.getElementById('textPosition').value;
    const rotate = document.getElementById('textRotate').checked;

    ctx.save();
    ctx.font = `bold ${fontSize}px "Microsoft YaHei", Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    if (position === 'tile') {
        const spacingX = textWidth + 80;
        const spacingY = textHeight + 60;
        for (let y = -height; y < height * 2; y += spacingY) {
            for (let x = -width; x < width * 2; x += spacingX) {
                ctx.save();
                ctx.translate(x, y);
                if (rotate) ctx.rotate(-Math.PI / 6);
                ctx.fillText(text, 0, 0);
                ctx.restore();
            }
        }
    } else {
        let x, y;
        const padding = 20;

        switch (position) {
            case 'top-left':
                x = padding + textWidth / 2;
                y = padding + textHeight / 2;
                break;
            case 'top-right':
                x = width - padding - textWidth / 2;
                y = padding + textHeight / 2;
                break;
            case 'bottom-left':
                x = padding + textWidth / 2;
                y = height - padding - textHeight / 2;
                break;
            case 'bottom-right':
                x = width - padding - textWidth / 2;
                y = height - padding - textHeight / 2;
                break;
            default:
                x = width / 2;
                y = height / 2;
        }

        ctx.save();
        ctx.translate(x, y);
        if (rotate && position !== 'tile') ctx.rotate(-Math.PI / 6);
        ctx.fillText(text, -textWidth / 2, 0);
        ctx.restore();
    }

    ctx.restore();
}

function applyImageWatermark(ctx, width, height) {
    if (!watermarkImage) return;

    const opacity = parseFloat(document.getElementById('imgOpacity').value) || 0.7;
    const scale = parseFloat(document.getElementById('imgScale').value) || 0.3;
    const position = document.getElementById('imgPosition').value;

    const wmWidth = watermarkImage.width * scale;
    const wmHeight = watermarkImage.height * scale;

    ctx.save();
    ctx.globalAlpha = opacity;

    if (position === 'tile') {
        const spacingX = wmWidth + 30;
        const spacingY = wmHeight + 30;
        for (let y = 0; y < height + wmHeight; y += spacingY) {
            for (let x = 0; x < width + wmWidth; x += spacingX) {
                ctx.drawImage(watermarkImage, x, y, wmWidth, wmHeight);
            }
        }
    } else {
        let x, y;
        const padding = 20;

        switch (position) {
            case 'top-left': x = padding; y = padding; break;
            case 'top-right': x = width - wmWidth - padding; y = padding; break;
            case 'bottom-left': x = padding; y = height - wmHeight - padding; break;
            case 'bottom-right': x = width - wmWidth - padding; y = height - wmHeight - padding; break;
            default:
                x = (width - wmWidth) / 2;
                y = (height - wmHeight) / 2;
        }

        ctx.drawImage(watermarkImage, x, y, wmWidth, wmHeight);
    }

    ctx.restore();
}

function applyWatermark() {
    if (!mainImage) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    if (currentTab === 'image' && !watermarkImage) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = mainImage.width;
    canvas.height = mainImage.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(mainImage, 0, 0);

    if (currentTab === 'text') {
        applyTextWatermark(ctx, canvas.width, canvas.height);
    } else {
        applyImageWatermark(ctx, canvas.width, canvas.height);
    }

    window.watermarkedDataUrl = canvas.toDataURL('image/png');
    document.getElementById('downloadBtn').disabled = false;

    showToast(I18N.t('common.success'), 'success');
}

function downloadWatermarked() {
    if (window.watermarkedDataUrl) {
        const a = document.createElement('a');
        a.href = window.watermarkedDataUrl;
        a.download = 'watermarked_image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(I18N.t('common.copied'), 'success');
    }
}

function resetAll() {
    mainImage = null;
    watermarkImage = null;
    document.getElementById('previewMain').style.display = 'none';
    document.getElementById('previewWatermark').style.display = 'none';
    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('imageInputText').value = '';
    document.getElementById('imageInputMain').value = '';
    document.getElementById('imageInputWatermark').value = '';
}
