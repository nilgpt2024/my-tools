function formatHtmlCode() {
  const input = document.getElementById('htmlInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const indentSize = parseInt(document.getElementById('htmlIndentSize').value);
  const indent = ' '.repeat(indentSize);

  try {
    const formatted = beautifyHtml(input, indent);
    document.getElementById('htmlOutput').value = formatted;
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function compressHtmlCode() {
  const input = document.getElementById('htmlInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  let compressed = input;

  compressed = compressed.replace(/<!--[\s\S]*?-->/g, '');
  compressed = compressed.replace(/\s+/g, ' ');
  compressed = compressed.replace(/>\s+</g, '><');
  compressed = compressed.replace(/\s+>/g, '>').replace(/<\s+/g, '<');

  document.getElementById('htmlOutput').value = compressed.trim();
  showToast(I18N.t('common.success'), 'success');
}

function beautifyHtml(html, indent) {
  let result = '';
  let depth = 0;
  const voidElements = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
  const inlineElements = ['a','abbr','acronym','b','bdo','big','br','button','cite','code','dfn','em','i','img','input','kbd','label','map','object','output','q','samp','script','select','small','span','strong','sub','sup','textarea','time','tt','var'];

  html = html.replace(/(<[^>]+>)/g, '\n$1\n').replace(/\n+/g, '\n').trim();
  const lines = html.split('\n');

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.match(/^<\/\w/)) {
      depth = Math.max(0, depth - 1);
    } else if (line.match(/^<\w[^>]*\/>/)) {
    } else if (line.match(/^<\w/)) {
      const tagMatch = line.match(/^<(\w+)/);
      if (tagMatch && !voidElements.includes(tagMatch[1].toLowerCase())) {
        if (!inlineElements.includes(tagMatch[1].toLowerCase()) && !line.endsWith('/>')) {
        }
      }
    }

    if (line.startsWith('</') || (line.match(/^<\w/) && !line.match(/\/>$/) && (() => { const m = line.match(/^<(\w+)/); return m && voidElements.includes(m[1].toLowerCase()); })())) {
      result += indent.repeat(depth) + line + '\n';
    } else if (line.match(/^<\w/)) {
      result += indent.repeat(depth) + line + '\n';
      const tagMatch = line.match(/^<(\w+)/);
      if (tagMatch && !voidElements.includes(tagMatch[1].toLowerCase()) && !inlineElements.includes(tagMatch[1].toLowerCase()) && !line.endsWith('/>')) {
        depth++;
      }
    } else {
      result += indent.repeat(depth) + line + '\n';
    }

    if (line.match(/^<\/\w/)) {
    }
  }

  return result.trim();
}

function clearHtmlInput() {
  document.getElementById('htmlInput').value = '';
  document.getElementById('htmlOutput').value = '';
}

function pasteHtmlInput() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('htmlInput').value = text;
  }).catch(() => showToast(I18N.t('common.error'), 'error'));
}

function copyHtmlOutput() {
  const output = document.getElementById('htmlOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}

function downloadHtml() {
  const output = document.getElementById('htmlOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  downloadFile(output, 'formatted.html', 'text/html');
}

function loadHtmlSample() {
  document.getElementById('htmlInput').value = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>示例页面</title><style>body{font-family:sans-serif;margin:20px;}.container{max-width:800px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px;}h1{color:#333;text-align:center;}</style></head><body><div class="container"><h1>欢迎访问</h1><p>这是一个HTML格式化工具的示例页面。</p><ul><li>项目一</li><li>项目二</li><li>项目三</li></ul><footer><p>&copy;2024 示例网站</p></footer></div></body></html>`;
  showToast(I18N.t('common.success'), 'info');
}
