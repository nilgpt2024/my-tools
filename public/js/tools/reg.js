const commonPatterns = [
  { name: '邮箱', pattern: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$' },
  { name: '手机号', pattern: '^1[3-9]\\d{9}$' },
  { name: 'URL', pattern: '^https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$' },
  { name: 'IP地址', pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$' },
  { name: '身份证号', pattern: '^\\d{17}[\\dXx]$' },
  { name: '日期YYYY-MM-DD', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$' },
  { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+' },
  { name: '数字', pattern: '^\\d+$' },
  { name: '字母', pattern: '^[a-zA-Z]+$' },
  { name: '密码(6-20位)', pattern: '^[a-zA-Z0-9_]{6,20}$' },
  { name: '邮政编码', pattern: '^[1-9]\\d{5}$' },
  { name: '颜色Hex', pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$' }
];

function testRegex() {
  const patternStr = document.getElementById('regexPattern').value;
  const testText = document.getElementById('testText').value;

  if (!patternStr) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  let flags = '';
  if (document.getElementById('flagG').checked) flags += 'g';
  if (document.getElementById('flagI').checked) flags += 'i';
  if (document.getElementById('flagM').checked) flags += 'm';
  if (document.getElementById('flagS').checked) flags += 's';

  try {
    const regex = new RegExp(patternStr, flags);
    const resultDiv = document.getElementById('matchResult');

    if (!testText) {
      resultDiv.innerHTML = '<div class="result-empty" style="text-align:center;color:var(--text-light);padding:30px;">' + I18N.t('tools.reg.testString') + '</div>';
      return;
    }

    if (flags.includes('g')) {
      const matches = [...testText.matchAll(regex)];
      if (matches.length === 0) {
        resultDiv.innerHTML = '<div style="text-align:center;padding:16px;color:#f56c6c;font-size:14px;">❌ ' + I18N.t('tools.reg.noMatch') + '</div>';
        return;
      }

      let highlighted = Utils.escapeHtml(testText);
      let offset = 0;
      matches.forEach(match => {
        const start = match.index + offset;
        const end = start + match[0].length;
        const replacement = `<mark style="background:#fff3cd;color:#856404;padding:2px 4px;border-radius:3px;font-weight:600;">${Utils.escapeHtml(match[0])}</mark>`;
        highlighted = highlighted.substring(0, start) + replacement + highlighted.substring(end);
        offset += replacement.length - match[0].length;
      });

      resultDiv.innerHTML = `
        <div style="margin-bottom:12px;font-size:14px;color:var(--primary-color);font-weight:600;">
          ✅ ${I18N.t('tools.reg.matches')}：${matches.length}
        </div>
        <div style="background:white;border:1px solid var(--border-color);border-radius:8px;padding:16px;font-size:14px;line-height:2;word-break:break-all;white-space:pre-wrap;">${highlighted}</div>
        <div style="margin-top:12px;display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;">
          ${matches.map((m, i) => `
            <div style="display:flex;gap:8px;font-size:13px;padding:4px 8px;background:#f8f9fa;border-radius:4px;">
              <span style="color:var(--text-light);flex-shrink:0;width:30px;">#${i + 1}</span>
              <span style="color:var(--text-secondary);flex-shrink:0;">${I18N.t('tools.reg.position')} ${m.index}:</span>
              <code style="color:var(--primary-color);word-break:break-all;">${Utils.escapeHtml(m[0])}</code>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      const match = testText.match(regex);
      if (!match || !match[0]) {
        resultDiv.innerHTML = '<div style="text-align:center;padding:16px;color:#f56c6c;font-size:14px;">❌ ' + I18N.t('tools.reg.noMatch') + '</div>';
        return;
      }

      let highlighted = Utils.escapeHtml(testText);
      const start = testText.indexOf(match[0]);
      if (start !== -1) {
        highlighted = highlighted.substring(0, start) +
          `<mark style="background:#fff3cd;color:#856404;padding:2px 4px;border-radius:3px;font-weight:600;">${Utils.escapeHtml(match[0])}</mark>` +
          highlighted.substring(start + match[0].length);
      }

      const groupsHtml = match.slice(1).map((g, i) =>
        `<span style="display:inline-block;margin:4px 8px 4px 0;padding:4px 10px;background:#e8f5e9;border:1px solid #c8e6c9;border-radius:4px;font-size:13px;"><strong>$${i + 1}:</strong> <code>${Utils.escapeHtml(g)}</code></span>`
      ).join('');

      resultDiv.innerHTML = `
        <div style="margin-bottom:12px;font-size:14px;color:var(--primary-color);font-weight:600;">✅ ${I18N.t('tools.reg.match')}</div>
        <div style="background:white;border:1px solid var(--border-color);border-radius:8px;padding:16px;font-size:14px;line-height:2;word-break:break-all;white-space:pre-wrap;">${highlighted}</div>
        <div style="margin-top:12px;">
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">${I18N.t('tools.reg.fullMatch')}：<code style="color:var(--primary-color);">${Utils.escapeHtml(match[0])}</code></div>
          ${match.length > 1 ? `<div style="font-size:13px;color:var(--text-secondary);">${I18N.t('tools.reg.groups')}：${groupsHtml}</div>` : ''}
        </div>
      `;
    }
  } catch (e) {
    document.getElementById('matchResult').innerHTML = `<div style="text-align:center;padding:16px;color:#f56c6c;font-size:14px;">❌ ${I18N.t('tools.reg.regexError')}: ${Utils.escapeHtml(e.message)}</div>`;
  }
}

function clearRegex() {
  document.getElementById('regexPattern').value = '';
  document.getElementById('testText').value = '';
  document.getElementById('matchResult').innerHTML = '<div class="result-empty" style="text-align:center;color:var(--text-light);padding:30px;" data-i18n="tools.reg.inputHint">' + I18N.t('tools.reg.inputHint') + '</div>';
}

function loadCommonPatterns() {
  const container = document.getElementById('commonPatterns');
  container.innerHTML = commonPatterns.map(p => `
    <button onclick="usePattern('${p.pattern.replace(/'/g, "\\'")}')" 
            style="padding:6px 14px;font-size:13px;border:1px solid var(--border-color);background:white;border-radius:20px;cursor:pointer;transition:all 0.2s;color:var(--text-secondary);"
            onmouseover="this.style.borderColor='var(--primary-color)';this.style.color='var(--primary-color)'"
            onmouseout="this.style.borderColor='var(--border-color)';this.style.color='var(--text-secondary)'">
      ${p.name}
    </button>
  `).join('');
}

function usePattern(pattern) {
  document.getElementById('regexPattern').value = pattern;
  showToast(I18N.t('common.success'), 'info');
}

document.addEventListener('DOMContentLoaded', loadCommonPatterns);

document.getElementById('regexPattern')?.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') testRegex();
});

document.getElementById('testText')?.addEventListener('input', Utils.debounce(testRegex, 300));
