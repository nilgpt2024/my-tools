function formatJson() {
  const input = document.getElementById('jsonInput').value.trim();
  if (!input) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  hideError();

  try {
    const obj = JSON.parse(input);
    const indent = document.getElementById('indentSize').value;
    const formatted = JSON.stringify(obj, null, indent);
    displayJsonOutput(formatted, true);
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showError(I18N.t('tools.json.error') + ': ' + e.message);
  }
}

function compressJson() {
  const input = document.getElementById('jsonInput').value.trim();
  if (!input) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  hideError();

  try {
    const obj = JSON.parse(input);
    const compressed = JSON.stringify(obj);
    displayJsonOutput(compressed, false);
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showError(I18N.t('tools.json.error') + ': ' + e.message);
  }
}

function validateJson() {
  const input = document.getElementById('jsonInput').value.trim();
  if (!input) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  hideError();

  try {
    JSON.parse(input);
    showToast(I18N.t('tools.json.valid'), 'success');
  } catch (e) {
    showError(I18N.t('tools.json.invalid') + ': ' + e.message);
  }
}

function escapeJson() {
  const input = document.getElementById('jsonInput').value;
  document.getElementById('jsonInput').value = input.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  showToast(I18N.t('common.success'), 'success');
}

function unescapeJson() {
  const input = document.getElementById('jsonInput').value;
  try {
    document.getElementById('jsonInput').value = input.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error'), 'error');
  }
}

function displayJsonOutput(json, pretty) {
  const output = document.getElementById('jsonOutput');

  if (pretty) {
    const highlighted = syntaxHighlight(json);
    output.innerHTML = highlighted;
  } else {
    output.textContent = json;
    output.style.whiteSpace = 'pre-wrap';
    output.style.wordBreak = 'break-all';
  }
}

function syntaxHighlight(json) {
  json = Utils.escapeHtml(json);
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
        match = match.slice(0, -1) + '<span style="color:#666;">:</span>';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }

    const colors = { key: '#88139a', string: '#1677ff', number: '#098655', boolean: '#994500', null: '#808080' };
    return `<span style="color:${colors[cls]};font-weight:${cls === 'key' ? '600' : 'normal'}">${match}</span>`;
  });
}

function showError(msg) {
  const errEl = document.getElementById('jsonError');
  errEl.textContent = msg;
  errEl.style.display = 'block';
}

function hideError() {
  document.getElementById('jsonError').style.display = 'none';
}

function clearJsonInput() {
  const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;
  document.getElementById('jsonInput').value = '';
  document.getElementById('jsonOutput').innerHTML = '<div class="result-empty" style="text-align:center;color:var(--text-light);padding:40px 20px;">' + t('tools.json.outputPlaceholder', '输出结果将显示在这里...') + '</div>';
  hideError();
}

function pasteJsonInput() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('jsonInput').value = text;
  }).catch(() => showToast(I18N.t('common.error'), 'error'));
}

function copyJsonOutput() {
  const output = document.getElementById('jsonOutput');
  const text = output.textContent;
  const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;
  if (!text || text.includes(t('tools.json.outputPlaceholder', '输出结果将显示'))) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(text, I18N.t('common.copied'));
}

function downloadJson() {
  const output = document.getElementById('jsonOutput');
  const text = output.textContent;
  const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;
  if (!text || text.includes(t('tools.json.outputPlaceholder', '输出结果将显示'))) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  downloadFile(text, 'formatted.json', 'application/json');
}

function loadSample() {
  document.getElementById('jsonInput').value = JSON.stringify({
    name: "在线工具集",
    version: "1.0.0",
    description: "一个免费的在线工具平台",
    categories: ["开发运维", "文本处理", "图像处理"],
    features: {
      free: true,
      privacy: "本地运行",
      responsive: true
    },
    tools: [
      { name: "JSON格式化", type: "dev", popular: true },
      { name: "MD5加密", type: "dev", popular: true },
      { name: "Base64编解码", type: "dev", popular: false }
    ]
  }, null, 2);
  showToast(I18N.t('common.success'), 'info');
}
