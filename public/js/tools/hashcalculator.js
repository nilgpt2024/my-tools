const hashAlgorithms = [
  { name: 'MD5', key: 'MD5', color: '#f56c6c' },
  { name: 'SHA-1', key: 'SHA1', color: '#e6a23c' },
  { name: 'SHA-256', key: 'SHA256', color: '#67c23a' },
  { name: 'SHA-224', key: 'SHA224', color: '#409eff' },
  { name: 'SHA-384', key: 'SHA384', color: '#909399' },
  { name: 'SHA-512', key: 'SHA512', color: '#764ba2' },
  { name: 'SHA-3', key: 'SHA3', color: '#13ce66' },
  { name: 'RIPEMD-160', key: 'RIPEMD160', color: '#ff6600' }
];

function switchTab(btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.tab).classList.add('active');
}

function calculateTextHash() {
  const input = document.getElementById('hashInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const container = document.getElementById('textHashResults');
  container.innerHTML = '<div class="loading-text">' + I18N.t('tools.hashcalculator.calculating') + '</div>';

  setTimeout(() => {
    container.innerHTML = hashAlgorithms.map(algo => {
      let hash;
      try {
        hash = CryptoJS[algo.key](input).toString();
      } catch (e) {
        hash = I18N.t('common.error');
      }

      return `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;background:white;border:1px solid var(--border-color);border-left:4px solid ${algo.color};border-radius:8px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <h3 style="font-size:15px;font-weight:600;display:flex;align-items:center;gap:8px;">
              <span style="width:10px;height:10px;border-radius:50%;background:${algo.color};"></span>
              ${algo.name}
            </h3>
            <button onclick="copyToClipboard('${hash}')" style="padding:6px 14px;font-size:12px;border:1px solid var(--border-color);background:white;border-radius:6px;cursor:pointer;" data-i18n="common.copy">📋 复制</button>
          </div>
          <code style="font-size:13px;font-family:'Consolas','Monaco',monospace;word-break:break-all;line-height:1.6;color:${algo.color};letter-spacing:0.5px;">${hash}</code>
          <div style="font-size:12px;color:var(--text-light);">${I18N.t('tools.hashcalculator.length')}: ${hash.length} ${I18N.t('tools.hashcalculator.chars')}</div>
        </div>
      `;
    }).join('');
    showToast(I18N.t('common.success'), 'success');
  }, 100);
}

async function calculateFileHash(event) {
  const file = event.target.files[0];
  if (!file) return;

  const progressDiv = document.getElementById('fileHashProgress');
  const progressBar = document.getElementById('hashProgressBar');
  const progressText = document.getElementById('hashProgressText');
  const resultsDiv = document.getElementById('fileHashResults');

  progressDiv.style.display = 'block';
  progressBar.style.width = '0%';
  progressText.textContent = I18N.t('tools.hashcalculator.readingFile');
  resultsDiv.innerHTML = '';

  try {
    const arrayBuffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

    progressText.textContent = I18N.t('tools.hashcalculator.calculating');
    progressBar.style.width = '30%';

    resultsDiv.innerHTML = hashAlgorithms.map((algo, idx) => {
      let hash;
      try {
        hash = CryptoJS[algo.key](wordArray).toString();
      } catch (e) {
        hash = I18N.t('common.error');
      }

      const progress = 30 + ((idx + 1) / hashAlgorithms.length) * 70;
      progressBar.style.width = progress.toFixed(0) + '%';
      progressText.textContent = algo.name + I18N.t('tools.hashcalculator.done');

      return `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;background:white;border:1px solid var(--border-color);border-left:4px solid ${algo.color};border-radius:8px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <h3 style="font-size:15px;font-weight:600;display:flex;align-items:center;gap:8px;">
              <span style="width:10px;height:10px;border-radius:50%;background:${algo.color};"></span>
              ${algo.name}
            </h3>
            <button onclick="copyToClipboard('${hash}')" style="padding:6px 14px;font-size:12px;border:1px solid var(--border-color);background:white;border-radius:6px;cursor:pointer;" data-i18n="common.copy">📋 复制</button>
          </div>
          <code style="font-size:13px;font-family:'Consolas','Monaco',monospace;word-break:break-all;line-height:1.6;color:${algo.color};letter-spacing:0.5px;">${hash}</code>
          <div style="font-size:12px;color:var(--text-light);">${I18N.t('tools.hashcalculator.file')}: ${file.name} (${formatFileSize(file.size)}) | ${I18N.t('tools.hashcalculator.length')}: ${hash.length} ${I18N.t('tools.hashcalculator.chars')}</div>
        </div>
      `;
    }).join('');

    progressBar.style.width = '100%';
    progressText.textContent = I18N.t('tools.hashcalculator.allDone');
    showToast(file.name + I18N.t('tools.hashcalculator.completed'), 'success');
  } catch (e) {
    progressDiv.style.display = 'none';
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function clearHashInput() {
  document.getElementById('hashInput').value = '';
  document.getElementById('textHashResults').innerHTML = '';
}
