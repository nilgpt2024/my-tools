function formatCssCode() {
  const input = document.getElementById('cssInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const indentSize = parseInt(document.getElementById('cssIndentSize').value);
  const newlineEachProp = document.getElementById('cssNewlineEachProp').checked;
  const semicolonLast = document.getElementById('cssSemicolonLast').checked;
  const indent = ' '.repeat(indentSize);

  try {
    const formatted = beautifyCss(input, indent, newlineEachProp, semicolonLast);
    document.getElementById('cssOutput').value = formatted;
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function compressCssCode() {
  const input = document.getElementById('cssInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  let compressed = input;

  compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '');
  compressed = compressed.replace(/\s+/g, ' ');
  compressed = compressed.replace(/\s*{\s*/g, '{');
  compressed = compressed.replace(/\s*}\s*/g, '}');
  compressed = compressed.replace(/\s*:\s*/g, ':');
  compressed = compressed.replace(/\s*;\s*/g, ';');
  compressed = compressed.replace(/\s*,\s*/g, ',');

  document.getElementById('cssOutput').value = compressed.trim();
  showToast(I18N.t('common.success'), 'success');
}

function beautifyCss(css, indent, newlineEachProp, semicolonLast) {
  let result = '';

  css = css.replace(/\/\*[\s\S]*?\*\//g, match => '\n' + match + '\n');
  css = css.replace(/\{/g, '{\n');
  css = css.replace(/\}/g, '\n}\n');
  css = css.replace(/;/g, ';\n');

  const lines = css.split('\n');
  let inBlock = false;
  let blockIndent = '';

  for (let line of lines) {
    line = line.trim();

    if (!line) continue;

    if (line === '}') {
      inBlock = false;
      result += blockIndent.substring(0, blockIndent.length - indent.length) + '}\n';
      continue;
    }

    if (line === '{') {
      inBlock = true;
      result += ' {\n';
      blockIndent = indent;
      continue;
    }

    if (line.startsWith('/*') || line.endsWith('*/')) {
      result += line + '\n';
      continue;
    }

    if (inBlock) {
      let propLine = line;

      if (propLine.endsWith(';')) {
        propLine = propLine.slice(0, -1);
      }

      if (semicolonLast || propLine !== '') {
        propLine += ';';
      }

      result += blockIndent + propLine + (newlineEachProp ? '\n' : ' ');
      if (!newlineEachProp) {
        continue;
      }
    } else {
      result += line + ' ';
    }
  }

  return result.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/\s+$/gm, '').trim();
}

function clearCssInput() {
  document.getElementById('cssInput').value = '';
  document.getElementById('cssOutput').value = '';
}

function pasteCssInput() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('cssInput').value = text;
  }).catch(() => showToast(I18N.t('common.error'), 'error'));
}

function copyCssOutput() {
  const output = document.getElementById('cssOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}

function downloadCss() {
  const output = document.getElementById('cssOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  downloadFile(output, 'formatted.css', 'text/css');
}

function loadCssSample() {
  document.getElementById('cssInput').value = `.container{max-width:1200px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:40px 20px;text-align:center;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.15)}.header h1{font-size:36px;font-weight:700;margin-bottom:10px}.header p{font-size:18px;opacity:.9}.card{background:white;border-radius:12px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.1);transition:all .3s ease;margin-bottom:20px}.card:hover{transform:translateY(-4px);box-shadow:0 4px 24px rgba(0,0,0,.15)}.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 28px;font-size:16px;font-weight:600;border:none;border-radius:8px;cursor:pointer;transition:all .3s ease;color:white;background:linear-gradient(135deg,#409EFF,#667eea)}.btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(64,158,255,.4)}@media(max-width:768px){.container{padding:16px}.header h1{font-size:28px}}`;
  showToast(I18N.t('common.success'), 'info');
}
