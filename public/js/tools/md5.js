function encryptMD5() {
  const input = document.getElementById('md5Input').value;
  if (!input) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const format = document.getElementById('md5Format').value;
  let hash = CryptoJS.MD5(input).toString();

  if (format === '32-lower') {
    hash = hash.toLowerCase();
  } else if (format === '16') {
    hash = CryptoJS.MD5(input).toString().toUpperCase().substring(8, 24);
  } else if (format === '16-lower') {
    hash = CryptoJS.MD5(input).toString().substring(8, 24);
  } else {
    hash = hash.toUpperCase();
  }

  document.getElementById('md5Output').value = hash;
  showToast(I18N.t('tools.md5.encrypted'), 'success');
}

function clearMd5Input() {
  document.getElementById('md5Input').value = '';
  document.getElementById('md5Output').value = '';
}

function pasteMd5Input() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('md5Input').value = text;
  }).catch(() => {
    showToast(I18N.t('common.error'), 'error');
  });
}

function copyMd5Output() {
  const output = document.getElementById('md5Output').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}
