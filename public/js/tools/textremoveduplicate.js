document.addEventListener('DOMContentLoaded', function() {
    const inputEl = document.getElementById('inputText');
    if (inputEl) {
        inputEl.addEventListener('input', Utils.debounce(updateInputStats, 200));
    }
});

function updateInputStats() {
    const text = document.getElementById('inputText').value;
    const lines = text.split('\n');
    const lineCount = text === '' ? 0 : lines.length;
    document.getElementById('inputLineCount').textContent = `行数：${lineCount}`;
    document.getElementById('inputCharCount').textContent = `字符数：${text.length.toLocaleString()}`;
}

function doDeduplicate() {
    const inputText = document.getElementById('inputText').value;
    if (!inputText.trim()) {
        showToast('请先输入需要去重的文本', 'error');
        return;
    }

    const mode = document.getElementById('dedupeMode').value;
    const ignoreCase = document.getElementById('ignoreCaseCheck').checked;
    const trimSpace = document.getElementById('trimSpaceCheck').checked;
    const removeEmpty = document.getElementById('removeEmptyCheck').checked;
    const sortMode = document.getElementById('sortMode').value;

    let result;
    let removedCount = 0;

    switch (mode) {
        case 'line':
            result = dedupeByLine(inputText, ignoreCase, trimSpace, removeEmpty, sortMode);
            break;
        case 'continuous':
            result = dedupeContinuous(inputText, trimSpace, removeEmpty);
            break;
        case 'character':
            result = dedupeByChar(inputText);
            break;
        default:
            result = dedupeByLine(inputText, ignoreCase, trimSpace, removeEmpty, sortMode);
    }

    document.getElementById('outputText').value = result.text;

    const outLines = result.text.split('\n');
    const outLineCount = result.text === '' ? 0 : outLines.length;
    document.getElementById('outputLineCount').textContent = `行数：${outLineCount}`;
    document.getElementById('outputCharCount').textContent = `字符数：${result.text.length.toLocaleString()}`;
    document.getElementById('removedCount').textContent = `已去除：${result.removed} 行重复`;

    showToast(`去重完成！共去除 ${result.removed} 条重复内容`, 'success');
}

function dedupeByLine(text, ignoreCase, trimSpace, removeEmpty, sortMode) {
    let lines = text.split('\n');

    const originalCount = lines.length;

    if (trimSpace) {
        lines = lines.map(line => line.trim());
    }

    if (removeEmpty) {
        lines = lines.filter(line => line !== '');
    }

    const seen = new Set();
    const uniqueLines = [];
    const orderMap = new Map();

    lines.forEach((line, index) => {
        const key = ignoreCase ? line.toLowerCase() : line;

        if (!seen.has(key)) {
            seen.add(key);
            uniqueLines.push(line);
            orderMap.set(key, index);
        }
    });

    let result = uniqueLines;

    if (sortMode === 'asc') {
        result = [...uniqueLines].sort((a, b) => {
            const aKey = ignoreCase ? a.toLowerCase() : a;
            const bKey = ignoreCase ? b.toLowerCase() : b;
            return aKey.localeCompare(bKey, 'zh-CN');
        });
    } else if (sortMode === 'desc') {
        result = [...uniqueLines].sort((a, b) => {
            const aKey = ignoreCase ? a.toLowerCase() : a;
            const bKey = ignoreCase ? b.toLowerCase() : b;
            return bKey.localeCompare(aKey, 'zh-CN');
        });
    }

    const removed = originalCount - result.filter(l => l !== '').length;
    return { text: result.join('\n'), removed };
}

function dedupeContinuous(text, trimSpace, removeEmpty) {
    let lines = text.split('\n');
    const originalCount = lines.length;

    if (trimSpace) {
        lines = lines.map(line => line.trim());
    }

    if (removeEmpty) {
        lines = lines.filter(line => line !== '');
    }

    const result = [];
    let lastLine = '';

    lines.forEach(line => {
        if (line !== lastLine) {
            result.push(line);
            lastLine = line;
        }
    });

    const removed = originalCount - result.length;
    return { text: result.join('\n'), removed };
}

function dedupeByChar(text) {
    const originalLength = text.length;
    const seen = new Set();
    let result = '';

    for (const char of text) {
        if (!seen.has(char)) {
            seen.add(char);
            result += char;
        }
    }

    return { text: result, removed: originalLength - result.length };
}

function clearInput() {
    document.getElementById('inputText').value = '';
    updateInputStats();
    showToast(I18N.t('common.clear'), 'info');
}

function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    updateInputStats();
    document.getElementById('outputLineCount').textContent = '行数：0';
    document.getElementById('removedCount').textContent = '已去除：0 行重复';
    document.getElementById('outputCharCount').textContent = '字符数：0';
    showToast(I18N.t('common.clear'), 'success');
}

async function pasteText() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('inputText').value = text;
        updateInputStats();
        showToast(I18N.t('common.success'), 'success');
    } catch (err) {
        showToast(I18N.t('common.error'), 'error');
    }
}

function loadExample() {
    const example = `苹果
香蕉
苹果
橙子
香蕉
葡萄
苹果
西瓜
芒果
香蕉
葡萄
樱桃
苹果
荔枝
香蕉`;
    document.getElementById('inputText').value = example;
    updateInputStats();
    showToast(I18N.t('common.success'), 'info');
}

function swapContent() {
    const inputEl = document.getElementById('inputText');
    const outputEl = document.getElementById('outputText');
    const temp = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = temp;
    updateInputStats();

    const outLines = outputEl.value.split('\n');
    const outLineCount = outputEl.value === '' ? 0 : outLines.length;
    document.getElementById('outputLineCount').textContent = `行数：${outLineCount}`;
    document.getElementById('outputCharCount').textContent = `字符数：${outputEl.value.length.toLocaleString()}`;

    showToast(I18N.t('common.success'), 'success');
}

function copyResult() {
    const result = document.getElementById('outputText').value;
    if (!result) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }
    copyToClipboard(result, I18N.t('common.copied'));
}

function downloadResult() {
    const result = document.getElementById('outputText').value;
    if (!result) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }
    downloadFile(result, `${I18N.t('tools.textremoveduplicate.name')}.txt`, 'text/plain;charset=utf-8');
}
