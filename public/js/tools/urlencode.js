function urlEncode() {
  const input = document.getElementById('inputText').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  const mode = document.getElementById('encodeMode').value;
  try {
    const result = mode === 'component' ? encodeURIComponent(input) : encodeURI(input);
    document.getElementById('outputText').value = result;
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function urlDecode() {
  const input = document.getElementById('inputText').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  try {
    const result = decodeURIComponent(input);
    document.getElementById('outputText').value = result;
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function clearInput() {
  document.getElementById('inputText').value = '';
}

function pasteInput() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('inputText').value = text;
  }).catch(() => {
    showToast(I18N.t('common.error'), 'error');
  });
}

function copyOutput() {
  const output = document.getElementById('outputText').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}

function swapContent() {
  const inputEl = document.getElementById('inputText');
  const outputEl = document.getElementById('outputText');
  const temp = inputEl.value;
  inputEl.value = outputEl.value;
  outputEl.value = temp;
}
