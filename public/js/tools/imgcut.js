let canvas, ctx;
let originalImage = null;
let isDrawing = false;
let startX, startY;
let cropRect = { x: 0, y: 0, width: 0, height: 0 };
let scale = 1;
let aspectRatio = null;

document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    const dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('click', function() {
        document.getElementById('imageInput').click();
    });

    const qualitySlider = document.getElementById('quality');
    qualitySlider.addEventListener('input', function() {
        document.getElementById('qualityValue').textContent = Math.round(this.value * 100) + '%';
    });

    const formatSelect = document.getElementById('outputFormat');
    formatSelect.addEventListener('change', function() {
        document.getElementById('qualityGroup').style.display = this.value === 'png' ? 'none' : 'flex';
    });
});

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').style.borderColor = 'var(--primary-color)';
    document.getElementById('dropZone').style.background = 'rgba(64, 158, 255, 0.05)';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').style.borderColor = 'var(--border-color)';
    document.getElementById('dropZone').style.background = '#fafafa';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').style.borderColor = 'var(--border-color)';
    document.getElementById('dropZone').style.background = '#fafafa';

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        loadImage(files[0]);
    } else {
        showToast(I18N.t('common.error'), 'error');
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            displayImage(img);
            document.getElementById('editorSection').style.display = 'block';
            document.getElementById('resultSection').style.display = 'none';
            document.getElementById('imageSizeInfo').textContent = `${img.width} × ${img.height}`;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayImage(img) {
    const maxWidth = Math.min(800, window.innerWidth - 80);
    const maxHeight = 600;

    let displayWidth = img.width;
    let displayHeight = img.height;

    if (displayWidth > maxWidth) {
        scale = maxWidth / displayWidth;
        displayWidth = maxWidth;
        displayHeight *= scale;
    }

    if (displayHeight > maxHeight) {
        const tempScale = maxHeight / displayHeight;
        scale *= tempScale;
        displayHeight = maxHeight;
        displayWidth *= tempScale;
    }

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

    cropRect = { x: 0, y: 0, width: 0, height: 0 };
    updateCropBox();
    initCanvasEvents();
}

function initCanvasEvents() {
    canvas.onmousedown = startCrop;
    canvas.onmousemove = drawCrop;
    canvas.onmouseup = endCrop;
    canvas.onmouseleave = endCrop;

    canvas.ontouchstart = function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        startCrop({ offsetX: touch.offsetX, offsetY: touch.offsetY });
    };
    canvas.ontouchmove = function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        drawCrop({ offsetX: touch.offsetX, offsetY: touch.offsetY });
    };
    canvas.ontouchend = endCrop;
}

function startCrop(e) {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    cropRect = { x: startX, y: startY, width: 0, height: 0 };
}

function drawCrop(e) {
    if (!isDrawing || !originalImage) return;

    let currentX = e.offsetX;
    let currentY = e.offsetY;

    let width = currentX - startX;
    let height = currentY - startY;

    if (aspectRatio) {
        height = width / aspectRatio;
        if (currentY - startY < 0) {
            height = -height;
        }
    }

    cropRect.x = width < 0 ? startX + width : startX;
    cropRect.y = height < 0 ? startY + height : startY;
    cropRect.width = Math.abs(width);
    cropRect.height = Math.abs(height);

    redrawCanvas();
    updateCropBox();
}

function endCrop() {
    isDrawing = false;
}

function redrawCanvas() {
    if (!originalImage) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    if (cropRect.width > 0 && cropRect.height > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
        ctx.drawImage(originalImage,
            cropRect.x / scale, cropRect.y / scale,
            cropRect.width / scale, cropRect.height / scale,
            cropRect.x, cropRect.y,
            cropRect.width, cropRect.height
        );

        ctx.strokeStyle = '#409EFF';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
        ctx.setLineDash([]);
    }
}

function updateCropBox() {
    const cropBox = document.getElementById('cropBox');
    const info = document.getElementById('cropInfo');

    if (cropRect.width > 10 && cropRect.height > 10) {
        const realWidth = Math.round(cropRect.width / scale);
        const realHeight = Math.round(cropRect.height / scale);
        info.textContent = `${realWidth} × ${realHeight} 像素`;
    } else {
        info.textContent = I18N.t('common.reset');
    }
}

function changeCropMode() {
    const mode = document.getElementById('cropMode').value;
    if (mode === 'free') {
        aspectRatio = null;
    } else {
        const parts = mode.split(':');
        aspectRatio = parseInt(parts[0]) / parseInt(parts[1]);
    }
    resetCrop();
}

function resetCrop() {
    if (!originalImage) return;
    cropRect = { x: 0, y: 0, width: 0, height: 0 };
    redrawCanvas();
    updateCropBox();
}

function cropImage() {
    if (!originalImage || cropRect.width < 10 || cropRect.height < 10) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const realX = cropRect.x / scale;
    const realY = cropRect.y / scale;
    const realWidth = cropRect.width / scale;
    const realHeight = cropRect.height / scale;

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = realWidth;
    outputCanvas.height = realHeight;
    const outputCtx = outputCanvas.getContext('2d');

    outputCtx.drawImage(
        originalImage,
        realX, realY, realWidth, realHeight,
        0, 0, realWidth, realHeight
    );

    const format = document.getElementById('outputFormat').value;
    const quality = parseFloat(document.getElementById('quality').value);
    const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';

    const dataUrl = outputCanvas.toDataURL(mimeType, quality);

    document.getElementById('resultImage').src = dataUrl;
    document.getElementById('resultInfo').textContent = `尺寸：${Math.round(realWidth)} × ${Math.round(realHeight)} 像素 | 格式：${format.toUpperCase()}`;

    let fileSize = Math.round((dataUrl.length - 'data:image/png;base64,'.length) * 3 / 4 / 1024);
    document.getElementById('resultInfo').textContent += ` | 大小：约 ${fileSize} KB`;

    document.getElementById('editorSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';

    window.currentResultDataUrl = dataUrl;
    window.resultFileName = `cropped_image.${format}`;

    showToast(I18N.t('common.success'), 'success');
}

function downloadResult() {
    if (window.currentResultDataUrl) {
        const a = document.createElement('a');
        a.href = window.currentResultDataUrl;
        a.download = window.resultFileName || 'cropped_image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(I18N.t('common.copied'), 'success');
    }
}

function backToEdit() {
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('editorSection').style.display = 'block';
}
