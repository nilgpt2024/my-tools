function switchTab(btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.tab).classList.add('active');
}

function encodeBase64Text() {
  const input = document.getElementById('b64TextInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    document.getElementById('b64TextOutput').value = encoded;
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function decodeBase64Text() {
  const input = document.getElementById('b64TextInput').value.trim();
  if (!input) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    document.getElementById('b64TextOutput').value = decoded;
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error'), 'error');
  }
}

function fileToBase64() {
  const file = document.getElementById('b64FileInput').files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result.split(',')[1];
    document.getElementById('b64FileOutput').value = base64;
    showToast(file.name + I18N.t('tools.base64.converted'), 'success');
  };
  reader.onerror = function() {
    showToast(I18N.t('common.error'), 'error');
  };
  reader.readAsDataURL(file);
}

function base64ToFile() {
  const base64 = document.getElementById('b64FileInputText').value.trim();
  const filename = document.getElementById('b64FileName').value || 'output.bin';

  if (!base64) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  try {
    let byteChars = atob(base64);
    const byteArray = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteArray[i] = byteChars.charCodeAt(i);
    }

    const blob = new Blob([byteArray]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(filename + I18N.t('tools.base64.downloaded'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function clearB64TextInput() {
  document.getElementById('b64TextInput').value = '';
  document.getElementById('b64TextOutput').value = '';
}

function pasteB64Text() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('b64TextInput').value = text;
  }).catch(() => showToast(I18N.t('common.error'), 'error'));
}

function copyB64TextOutput() {
  const output = document.getElementById('b64TextOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}

function swapB64Content() {
  const inEl = document.getElementById('b64TextInput');
  const outEl = document.getElementById('b64TextOutput');
  const temp = inEl.value;
  inEl.value = outEl.value;
  outEl.value = temp;
}

function copyB64FileOutput() {
  const output = document.getElementById('b64FileOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}
