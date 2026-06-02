let currentType = 'text';
let qrInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fgColor').addEventListener('input', function() {
        document.getElementById('fgColorText').textContent = this.value;
    });
    document.getElementById('bgColor').addEventListener('input', function() {
        document.getElementById('bgColorText').textContent = this.value;
    });
});

function getCorrectLevel(level) {
    switch (level) {
        case 'L': return QRCode.CorrectLevel.L;
        case 'Q': return QRCode.CorrectLevel.Q;
        case 'H': return QRCode.CorrectLevel.H;
        default: return QRCode.CorrectLevel.M;
    }
}

function switchContentType(type) {
    currentType = type;

    const labels = { text: '文本', url: '网址', wifi: 'WiFi', vcard: '名片', email: '邮件' };
    document.querySelectorAll('.type-tab').forEach(tab => {
        tab.classList.toggle('active', tab.textContent.includes(labels[type]));
    });

    document.querySelectorAll('.dynamic-fields').forEach(field => field.classList.remove('active'));
    document.getElementById('field-' + type).classList.add('active');

    generateQR();
}

function getContent() {
    switch (currentType) {
        case 'text':
            return document.getElementById('textContent').value.trim();
        case 'url':
            const url = document.getElementById('urlContent').value.trim();
            return url ? (url.startsWith('http') ? url : 'https://' + url) : '';
        case 'wifi':
            const ssid = document.getElementById('wifiSsid').value.trim();
            if (!ssid) return '';
            let wifiStr = 'WIFI:T:' + document.getElementById('wifiSecurity').value + ';S:' + ssid + ';P:' + document.getElementById('wifiPassword').value + ';;';
            if (document.getElementById('wifiHidden').value === 'true') wifiStr += ';H:true';
            return wifiStr;
        case 'vcard':
            const name = document.getElementById('vcardName').value.trim();
            if (!name) return '';
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\nN:' + name + '\nFN:' + name;
            const phone = document.getElementById('vcardPhone').value;
            if (phone) vcard += '\nTEL:' + phone;
            const email = document.getElementById('vcardEmail').value;
            if (email) vcard += '\nEMAIL:' + email;
            const company = document.getElementById('vcardCompany').value;
            if (company) vcard += '\nORG:' + company;
            const addr = document.getElementById('vcardAddress').value;
            if (addr) vcard += '\nADR:;;' + addr + ';;;';
            vcard += '\nEND:VCARD';
            return vcard;
        case 'email':
            const to = document.getElementById('emailTo').value.trim();
            if (!to) return '';
            return 'mailto:' + to + '?subject=' + encodeURIComponent(document.getElementById('emailSubject').value) + '&body=' + encodeURIComponent(document.getElementById('emailBody').value);
        default:
            return '';
    }
}

function generateQR() {
    const content = getContent();
    const statusEl = document.getElementById('qrStatus');
    const container = document.getElementById('qrcodeCanvas').parentNode;

    if (!content) {
        statusEl.textContent = I18N.t('tools.qrcode.content');
        statusEl.style.color = 'var(--text-light)';
        if (qrInstance) {
            container.querySelector('canvas, img').style.display = 'none';
        }
        return;
    }

    const size = parseInt(document.getElementById('qrSize').value);
    const errorLevel = document.getElementById('errorLevel').value;
    const fgColor = document.getElementById('fgColor').value;
    const bgColor = document.getElementById('bgColor').value;

    if (qrInstance) {
        qrInstance.clear();
    } else {
        var oldEl = container.querySelector('canvas, img');
        if (oldEl) oldEl.remove();
        qrInstance = new QRCode(document.getElementById('qrcodeCanvas'), {
            width: size,
            height: size,
            colorDark: fgColor,
            colorLight: bgColor,
            correctLevel: getCorrectLevel(errorLevel),
            useSVG: false
        });
    }

    qrInstance.makeCode(content);

    var renderedEl = container.querySelector('canvas, img');
    if (renderedEl) {
        renderedEl.style.maxWidth = Math.min(size, 300) + 'px';
        renderedEl.style.maxHeight = Math.min(size, 300) + 'px';
        renderedEl.style.borderRadius = '8px';
        renderedEl.style.border = '1px solid var(--border-color)';
        renderedEl.style.padding = '16px';
        renderedEl.style.background = bgColor;
        renderedEl.style.display = 'inline-block';
    }

    statusEl.textContent = '✅ 二维码已生成（' + content.length + ' 个字符）';
    statusEl.style.color = '#67c23a';
}

function updateSizeValue() {
    document.getElementById('sizeValue').textContent = document.getElementById('qrSize').value;

    document.querySelectorAll('.size-preset-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.textContent === document.getElementById('qrSize').value);
    });
}

function setSize(size) {
    document.getElementById('qrSize').value = size;
    updateSizeValue();

    if (qrInstance) {
        qrInstance.clear();
        qrInstance = null;
    }
    generateQR();
}

function downloadQRCode() {
    const content = getContent();
    if (!content) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const container = document.getElementById('qrcodeCanvas').parentNode;
    const el = container.querySelector('canvas, img');

    if (!el) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const link = document.createElement('a');
    link.download = 'qrcode.png';

    if (el.tagName === 'CANVAS') {
        link.href = el.toDataURL('image/png');
    } else if (el.tagName === 'IMG') {
        link.href = el.src;
    } else {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    link.click();
    showToast(I18N.t('common.copied'), 'success');
}

function downloadSVG() {
    const content = getContent();
    if (!content) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const size = parseInt(document.getElementById('qrSize').value);
    const fgColor = document.getElementById('fgColor').value;
    const bgColor = document.getElementById('bgColor').value;

    try {
        var tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        var svgQr = new QRCode(tempDiv, {
            width: size,
            height: size,
            colorDark: fgColor,
            colorLight: bgColor,
            correctLevel: getCorrectLevel(document.getElementById('errorLevel').value),
            useSVG: true
        });

        svgQr.makeCode(content);

        setTimeout(function() {
            var svgEl = tempDiv.querySelector('svg');
            if (svgEl) {
                var svgData = new XMLSerializer().serializeToString(svgEl);
                var blob = new Blob([svgData], { type: 'image/svg+xml' });
                var url = URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.download = 'qrcode.svg';
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                showToast(I18N.t('common.copied'), 'success');
            } else {
                showToast(I18N.t('common.error'), 'error');
            }
            document.body.removeChild(tempDiv);
        }, 100);
    } catch (e) {
        showToast(I18N.t('common.error') + '：' + e.message, 'error');
    }
}

function copyQRImage() {
    const content = getContent();
    if (!content) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const container = document.getElementById('qrcodeCanvas').parentNode;
    const el = container.querySelector('canvas');

    if (el && el.tagName === 'CANVAS') {
        el.toBlob(function(blob) {
            navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]).then(function() {
                showToast(I18N.t('common.copied'), 'success');
            }).catch(function() {
                showToast(I18N.t('common.error'), 'error');
            });
        }, 'image/png');
    } else {
        var imgEl = container.querySelector('img');
        if (imgEl) {
            fetch(imgEl.src).then(function(res) { return res.blob(); }).then(function(blob) {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(function() {
                    showToast(I18N.t('common.copied'), 'success');
                }).catch(function() {
                    showToast(I18N.t('common.error'), 'error');
                });
            }).catch(function() {
                showToast(I18N.t('common.error'), 'error');
            });
        } else {
            showToast(I18N.t('common.error'), 'error');
        }
    }
}
