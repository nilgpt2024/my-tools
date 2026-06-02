const entityMap = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;'
};

const reverseEntityMap = Object.fromEntries(
  Object.entries(entityMap).map(([k, v]) => [v, k])
);

const entityTableData = [
  ['&', '&amp;', '&#38;', '&#x26;'],
  ['<', '&lt;', '&#60;', '&#x3C;'],
  ['>', '&gt;', '&#62;', '&#x3E;'],
  ['"', '&quot;', '&#34;', '&#x22;'],
  ["'", '&#39;', '&#39;', '&#x27;'],
  [' ', '&nbsp;', '&#160;', '&#xA0;'],
  ['©', '&copy;', '&#169;', '&#xA9;'],
  ['®', '&reg;', '&#174;', '&#xAE;'],
  ['™', '&trade;', '&#8482;', '&#x2122;'],
  ['€', '&euro;', '&#8364;', '&#x20AC;'],
  ['£', '&pound;', '&#163;', '&#xA3;'],
  ['¥', '&yen;', '&#165;', '&#xA5;']
];

function encodeEntity() {
  const input = document.getElementById('entityInput').value;
  const mode = document.getElementById('entityMode').value;

  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  let result = '';
  for (let char of input) {
    const code = char.charCodeAt(0);
    if (entityMap[char] && mode === 'named') {
      result += entityMap[char];
    } else {
      switch (mode) {
        case 'named':
          result += entityMap[char] || `&#${code};`;
          break;
        case 'numeric':
          result += `&#${code};`;
          break;
        case 'hex':
          result += `&#x${code.toString(16).toUpperCase()};`;
          break;
      }
    }
  }

  document.getElementById('entityOutput').value = result;
  showToast(I18N.t('common.success'), 'success');
}

function decodeEntity() {
  const input = document.getElementById('entityInput').value;

  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  let result = input;

  result = result.replace(/&#[xX]([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  result = result.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));

  const namedEntities = [
    [/&amp;/gi, '&'], [/&lt;/gi, '<'], [/&gt;/gi, '>'], [/&quot;/gi, '"'],
    [/'/gi, "'"], [/&apos;/gi, "'"], [/&nbsp;/gi, ' '], [/&copy;/gi, '©'],
    [/&reg;/gi, '®'], [/&trade;/gi, '™'], [/&euro;/gi, '€'], [/&pound;/gi, '£'],
    [/&yen;/gi, '¥']
  ];

  namedEntities.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });

  document.getElementById('entityOutput').value = result;
  showToast(I18N.t('common.success'), 'success');
}

function clearEntityInput() {
  document.getElementById('entityInput').value = '';
  document.getElementById('entityOutput').value = '';
}

function pasteEntityInput() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('entityInput').value = text;
  }).catch(() => showToast(I18N.t('common.error'), 'error'));
}

function copyEntityOutput() {
  const output = document.getElementById('entityOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}

function swapEntityContent() {
  const inEl = document.getElementById('entityInput');
  const outEl = document.getElementById('entityOutput');
  const temp = inEl.value;
  inEl.value = outEl.value;
  outEl.value = temp;
}

function renderEntityTable() {
  const tbody = document.getElementById('entityTable');
  tbody.innerHTML = entityTableData.map(row => `
    <tr>
      <td style="padding:8px 12px;text-align:center;border:1px solid #e4e7ed;font-size:18px;">${row[0]}</td>
      <td style="padding:8px 12px;border:1px solid #e4e7ed;font-family:'Consolas','Monaco',monospace;color:var(--primary-color);">${row[1]}</td>
      <td style="padding:8px 12px;border:1px solid #e4e7ed;font-family:'Consolas','Monaco',monospace;color:var(--secondary-color);">${row[2]}</td>
      <td style="padding:8px 12px;border:1px solid #e4e7ed;font-family:'Consolas','Monaco',monospace;color:var(--accent-color);">${row[3]}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderEntityTable);
