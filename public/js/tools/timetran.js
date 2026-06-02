function switchTab(btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.tab).classList.add('active');
}

function convertToDate() {
  const input = document.getElementById('timestampInput').value.trim();
  if (!input) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const unit = document.querySelector('input[name="tsUnit"]:checked').value;
  let timestamp = parseInt(input);

  if (isNaN(timestamp)) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  if (unit === 'ms') {
    if (timestamp > 9999999999999) {
      showToast(I18N.t('common.error'), 'error');
      return;
    }
  } else {
    if (timestamp > 9999999999) {
      showToast(I18N.t('common.error'), 'error');
      return;
    }
    timestamp *= 1000;
  }

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const resultDiv = document.getElementById('dateResult');
  resultDiv.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="padding:12px 16px;background:#f0f7ff;border:1px solid #b3d8ff;border-radius:8px;">
        <strong>${I18N.t('tools.timetran.fullDate')}：</strong><code style="font-size:15px;color:var(--primary-color);">${date.toLocaleString('zh-CN')}</code>
      </div>
      <div style="padding:12px 16px;background:#f8f9fa;border:1px solid var(--border-color);border-radius:8px;display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:14px;">
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.isoFormat')}：</span><code>${date.toISOString()}</code>
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.utcTime')}：</span><code>${date.toUTCString()}</code>
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.dateOnly')}：</span><code>${date.toLocaleDateString('zh-CN')}</code>
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.timeOnly')}：</span><code>${date.toLocaleTimeString('zh-CN')}</code>
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.secondTimestamp')}：</span><code>${Math.floor(timestamp / 1000)}</code>
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.millisecondTimestamp')}：</span><code>${timestamp}</code>
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.relativeTime')}：</span><span>${getRelativeTime(date)}</span>
      </div>
    </div>
  `;
}

function convertToTimestamp() {
  const input = document.getElementById('datetimeInput').value;
  if (!input) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const date = new Date(input);
  if (isNaN(date.getTime())) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const tsMs = date.getTime();
  const tsS = Math.floor(tsMs / 1000);

  document.getElementById('timestampResult').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="padding:12px 16px;background:#f0f7ff;border:1px solid #b3d8ff;border-radius:8px;">
        <strong>${I18N.t('tools.timetran.selectedTime')}：</strong><code style="font-size:15px;color:var(--primary-color);">${date.toLocaleString('zh-CN')}</code>
      </div>
      <div style="padding:12px 16px;background:#f8f9fa;border:1px solid var(--border-color);border-radius:8px;display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:14px;">
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.secondTimestamp')}：</span>
        <div style="display:flex;align-items:center;gap:8px;"><code id="tsSecond">${tsS}</code><button class="btn btn-secondary" style="padding:4px 10px;font-size:12px;" onclick="copyToClipboard('${tsS}')">📋</button></div>
        <span style="color:var(--text-secondary);">${I18N.t('tools.timetran.millisecondTimestamp')}：</span>
        <div style="display:flex;align-items:center;gap:8px;"><code id="tsMilli">${tsMs}</code><button class="btn btn-secondary" style="padding:4px 10px;font-size:12px;" onclick="copyToClipboard('${tsMs}')">📋</button></div>
      </div>
    </div>
  `;
}

function useCurrentTimestamp() {
  const now = Date.now();
  const unit = document.querySelector('input[name="tsUnit"]:checked').value;
  document.getElementById('timestampInput').value = unit === 'ms' ? now : Math.floor(now / 1000);
  convertToDate();
}

function useCurrentDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISO = new Date(now - offset).toISOString().slice(0, 16);
  document.getElementById('datetimeInput').value = localISO;
  convertToTimestamp();
}

function getRelativeTime(date) {
  const diff = Date.now() - date.getTime();
  const absDiff = Math.abs(diff);

  if (absDiff < 60000) return I18N.t('tools.timetran.justNow');
  if (absDiff < 3600000) return I18N.t('tools.timetran.minutesAgo', { n: Math.floor(absDiff / 60000) });
  if (absDiff < 86400000) return I18N.t('tools.timetran.hoursAgo', { n: Math.floor(absDiff / 3600000) });
  if (absDiff < 2592000000) return I18N.t('tools.timetran.daysAgo', { n: Math.floor(absDiff / 86400000) });
  return Math.floor(absDiff / 2592000000) + ' ' + I18N.t('tools.timetran.monthsAgo', { n: Math.floor(absDiff / 2592000000) });
}
