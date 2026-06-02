function generateUUID() {
  const count = Math.min(parseInt(document.getElementById('uuidCount').value) || 5, 100);
  const uppercase = document.getElementById('uppercase').checked;
  const noHyphens = document.getElementById('noHyphens').checked;

  const uuids = [];
  for (let i = 0; i < count; i++) {
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    if (uppercase) uuid = uuid.toUpperCase();
    if (noHyphens) uuid = uuid.replace(/-/g, '');
    uuids.push(uuid);
  }

  displayUUIDs(uuids);
}

function displayUUIDs(uuids) {
  const display = document.getElementById('resultDisplay');
  display.innerHTML = uuids.map((uuid, idx) => `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;margin-bottom:6px;background:#f8f9fa;border-radius:8px;border:1px solid var(--border-color);">
      <span style="color:var(--text-light);font-size:13px;width:36px;flex-shrink:0;">#${idx + 1}</span>
      <code style="font-size:13px;font-family:'Consolas','Monaco',monospace;word-break:break-all;flex:1;color:var(--primary-color);">${Utils.escapeHtml(uuid)}</code>
      <button class="btn btn-secondary" onclick="copyToClipboard('${uuid}')" style="flex-shrink:0;padding:5px 10px;font-size:12px;" data-i18n="common.copy">📋 复制</button>
    </div>
  `).join('');
}

function copyAllUUIDs() {
  const display = document.getElementById('resultDisplay');
  const codes = display.querySelectorAll('code');
  if (codes.length === 0) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  const allText = Array.from(codes).map(c => c.textContent).join('\n');
  copyToClipboard(allText, I18N.t('common.copied'));
}

function downloadUUIDs() {
  const display = document.getElementById('resultDisplay');
  const codes = display.querySelectorAll('code');
  if (codes.length === 0) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  const allText = Array.from(codes).map(c => c.textContent).join('\n');
  downloadFile(allText, 'uuids.txt');
}

function clearResult() {
  document.getElementById('resultDisplay').innerHTML = '<div class="result-empty">' + I18N.t('tools.uuid.generated') + '</div>';
}
