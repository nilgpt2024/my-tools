function formatJsCode() {
  const input = document.getElementById('jsInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const indentSize = document.getElementById('jsIndentSize').value;
  const indentChar = indentSize === '\t' ? '\t' : ' '.repeat(parseInt(indentSize));

  try {
    const formatted = beautifyJs(input, indentChar);
    document.getElementById('jsOutput').value = formatted;

    const originalLen = input.length;
    const formattedLen = formatted.length;
    showStats(originalLen, formattedLen);
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function compressJsCode() {
  const input = document.getElementById('jsInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  let compressed = input;
  compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '');
  compressed = compressed.replace(/\/\/.*$/gm, '');
  compressed = compressed.replace(/\s+/g, ' ');
  compressed = compressed.replace(/\s*([{}();,\[\]=+\-*\/<>!&|~%^?:])\s*/g, '$1');
  compressed = compressed.replace(/\s+/g, ' ').trim();

  document.getElementById('jsOutput').value = compressed;

  const originalLen = input.length;
  const compressedLen = compressed.length;
  const ratio = ((1 - compressedLen / originalLen) * 100).toFixed(1);
  showStats(originalLen, compressedLen, I18N.t('tools.jsformat.compressRatio') + ': ' + ratio + '%');
  showToast(I18N.t('common.success'), 'success');
}

function beautifyJs(code, indent) {
  let result = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let inLineComment = false;
  let inBlockComment = false;
  let lineStart = true;

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const nextCh = code[i + 1];
    const prevCh = code[i - 1];

    if (inLineComment) {
      result += ch;
      if (ch === '\n') inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      result += ch;
      if (ch === '*' && nextCh === '/') {
        result += '/';
        i++;
        inBlockComment = false;
      }
      continue;
    }

    if (inString) {
      result += ch;
      if (ch === '\\' && nextCh) {
        result += code[++i];
      } else if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if ((ch === '/' && nextCh === '/')) {
      inLineComment = true;
      result += ch;
      continue;
    }

    if ((ch === '/' && nextCh === '*')) {
      inBlockComment = true;
      result += ch;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      result += ch;
      continue;
    }

    if ('{'.includes(ch)) {
      if (!lineStart) result += '\n';
      result += ch;
      depth++;
      result += '\n' + indent.repeat(depth);
      lineStart = true;
      continue;
    }

    if ('}'.includes(ch)) {
      depth = Math.max(0, depth - 1);
      result += '\n' + indent.repeat(depth) + ch;
      if ('}]'.includes(nextCh)) {
        result += '\n' + indent.repeat(Math.max(0, depth - 1));
      } else {
        result += '\n' + indent.repeat(depth);
      }
      lineStart = true;
      continue;
    }

    if (';'.includes(ch)) {
      result += ch;
      result += '\n' + indent.repeat(depth);
      lineStart = true;
      continue;
    }

    if (','.includes(ch)) {
      result += ch + ' ';
      continue;
    }

    if (':'.includes(ch)) {
      result += ch + ' ';
      continue;
    }

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      if (!lineStart) result += ' ';
      continue;
    }

    result += ch;
    lineStart = false;
  }

  return result;
}

function showStats(original, compressed, extra) {
  const statsDiv = document.getElementById('jsStats');
  statsDiv.style.display = 'block';
  statsDiv.innerHTML = `
    <span>${I18N.t('tools.jsformat.originalSize')}: <strong>${original}</strong> ${I18N.t('tools.jsformat.chars')}</span>
    <span style="margin-left:20px;">${I18N.t('tools.jsformat.processed')}: <strong>${compressed}</strong> ${I18N.t('tools.jsformat.chars')}</span>
    ${extra ? `<span style="margin-left:20px;">${extra}</span>` : ''}
  `;
}

function clearJsInput() {
  document.getElementById('jsInput').value = '';
  document.getElementById('jsOutput').value = '';
  document.getElementById('jsStats').style.display = 'none';
}

function pasteJsInput() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('jsInput').value = text;
  }).catch(() => showToast(I18N.t('common.error'), 'error'));
}

function copyJsOutput() {
  const output = document.getElementById('jsOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}

function downloadJs() {
  const output = document.getElementById('jsOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  downloadFile(output, 'formatted.js', 'application/javascript');
}

function loadJsSample() {
  document.getElementById('jsInput').value = `function greet(name){console.log("Hello, "+name+"!");}class Calculator{
constructor(){this.result=0;}
add(value){this.result+=value;return this;}
subtract(value){this.result-=value;return this;}
multiply(value){this.result*=value;return this;}
divide(value){
if(value===0){throw new Error("Division by zero");}
this.result/=value;return this;}
getResult(){return this.result;}
reset(){this.result=0;return this;}}
const calc=new Calculator();
calc.add(10).subtract(3).multiply(2).divide(7);
console.log("Result:",calc.getResult());`;
  showToast(I18N.t('common.success'), 'info');
}
