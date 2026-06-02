function toUnicode() {
  const input = document.getElementById('unicodeInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const format = document.getElementById('unicodeFormat').value;
  let result = '';

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    switch (format) {
      case '\\u':
        result += '\\u' + code.toString(16).toUpperCase().padStart(4, '0');
        break;
      case '&#x':
        result += '&#x' + code.toString(16).toUpperCase().padStart(4, ';') + ';';
        break;
      case '&#':
        result += '&#' + code + ';';
        break;
      case 'U+':
        result += 'U+' + code.toString(16).toUpperCase().padStart(4, '0') + ' ';
        break;
    }
  }

  document.getElementById('unicodeOutput').value = result.trim();
  showToast(I18N.t('common.success'), 'success');
}

function fromUnicode() {
  const input = document.getElementById('unicodeInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  try {
    let text = input;

    text = text.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    text = text.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    text = text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
    text = text.replace(/U\+([0-9A-Fa-f]{4})\s?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    document.getElementById('unicodeOutput').value = text;
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function clearUnicodeInput() {
  document.getElementById('unicodeInput').value = '';
  document.getElementById('unicodeOutput').value = '';
}

function pasteUnicodeInput() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('unicodeInput').value = text;
  }).catch(() => showToast(I18N.t('common.error'), 'error'));
}

function copyUnicodeOutput() {
  const output = document.getElementById('unicodeOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}

function swapUnicodeContent() {
  const inEl = document.getElementById('unicodeInput');
  const outEl = document.getElementById('unicodeOutput');
  const temp = inEl.value;
  inEl.value = outEl.value;
  outEl.value = temp;
}
