function generatePassword() {
  const length = parseInt(document.getElementById('pwdLength').value) || 16;
  const count = parseInt(document.getElementById('generateCount').value) || 1;
  const useUpper = document.getElementById('includeUpper').checked;
  const useLower = document.getElementById('includeLower').checked;
  const useNumbers = document.getElementById('includeNumbers').checked;
  const useSymbols = document.getElementById('includeSymbols').checked;

  let charset = '';
  if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumbers) charset += '0123456789';
  if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!charset) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const passwords = [];
  for (let i = 0; i < count; i++) {
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let j = 0; j < length; j++) {
      password += charset[array[j] % charset.length];
    }
    passwords.push(password);
  }

  displayPasswords(passwords);
}

function displayPasswords(passwords) {
  const display = document.getElementById('resultDisplay');
  if (passwords.length === 1) {
    display.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px;background:#f8f9fa;border-radius:8px;border:1px solid var(--border-color);">
      <code style="font-size:18px;font-family:'Consolas','Monaco',monospace;word-break:break-all;flex:1;">${Utils.escapeHtml(passwords[0])}</code>
      <button class="btn btn-secondary" onclick="copyToClipboard('${passwords[0]}')" style="flex-shrink:0;" data-i18n="common.copy">📋 复制</button>
    </div>`;
  } else {
    display.innerHTML = passwords.map((pwd, idx) => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;margin-bottom:8px;background:#f8f9fa;border-radius:8px;border:1px solid var(--border-color);">
        <span style="color:var(--text-light);font-size:13px;width:40px;flex-shrink:0;">#${idx + 1}</span>
        <code style="font-size:14px;font-family:'Consolas','Monaco',monospace;word-break:break-all;flex:1;">${Utils.escapeHtml(pwd)}</code>
        <button class="btn btn-secondary" onclick="copyToClipboard('${pwd}')" style="flex-shrink:0;padding:6px 12px;font-size:12px;">📋</button>
      </div>
    `).join('');
  }
}

function copyAllPasswords() {
  const display = document.getElementById('resultDisplay');
  const codes = display.querySelectorAll('code');
  if (codes.length === 0) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  const allText = Array.from(codes).map(c => c.textContent).join('\n');
  copyToClipboard(allText, I18N.t('common.copied'));
}

function clearResult() {
  const text = (typeof I18N !== 'undefined' ? I18N.t('tools.randompassword.clickToGenerate') : null) || '点击上方按钮生成密码';
  document.getElementById('resultDisplay').innerHTML = '<div class="result-empty">' + text + '</div>';
}
