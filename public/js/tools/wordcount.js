document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const realtimeCheck = document.getElementById('realtimeCheck');

    if (realtimeCheck && realtimeCheck.checked) {
        inputText.addEventListener('input', Utils.debounce(analyzeText, 200));
    }

    if (realtimeCheck) {
        realtimeCheck.addEventListener('change', function() {
            if (this.checked) {
                inputText.addEventListener('input', Utils.debounce(analyzeText, 200));
            } else {
                inputText.removeEventListener('input', analyzeText);
            }
        });
    }

    analyzeText();
});

function analyzeText() {
    const text = document.getElementById('inputText').value;
    const includeSpace = document.getElementById('includeSpaceCheck')?.checked !== false;
    const readSpeed = parseInt(document.getElementById('readSpeedSelect')?.value || 500);

    if (!text) {
        resetStats();
        return;
    }

    const stats = calculateStats(text, includeSpeed);
    displayStats(stats, readSpeed);
}

function calculateStats(text) {
    const result = {};

    result.charCount = text.length;
    result.charNoSpace = text.replace(/\s/g, '').length;

    const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
    result.chineseCount = chineseChars ? chineseChars.length : 0;

    const englishWords = text.match(/[a-zA-Z]+/g);
    result.englishWordCount = englishWords ? englishWords.length : 0;

    const numbers = text.match(/\d+/g);
    result.numberCount = numbers ? numbers.length : 0;

    const lines = text.split('\n');
    result.lineCount = text === '' ? 0 : lines.length;
    if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
        result.lineCount = Math.max(0, result.lineCount - 1);
    }

    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== '');
    result.paragraphCount = paragraphs.length || (text.trim() ? 1 : 0);

    const punctuation = text.match(/[，。！？、；：""''【】《》（）…—\-\.,!?;:'"\[\](){}]/g);
    result.punctuationCount = punctuation ? punctuation.length : 0;

    const sentences = text.split(/[。！？.!?]+/).filter(s => s.trim() !== '');
    result.sentenceCount = sentences.length;

    result.wordCount = result.chineseCount + result.englishWordCount;

    return result;
}

function displayStats(stats, readSpeed) {
    animateNumber('charCount', stats.charCount);
    animateNumber('charNoSpace', stats.charNoSpace);
    animateNumber('wordCount', stats.wordCount);
    animateNumber('chineseCount', stats.chineseCount);
    animateNumber('englishWordCount', stats.englishWordCount);
    animateNumber('numberCount', stats.numberCount);
    animateNumber('lineCount', stats.lineCount);
    animateNumber('paragraphCount', stats.paragraphCount);
    animateNumber('punctuationCount', stats.punctuationCount);
    animateNumber('sentenceCount', stats.sentenceCount);

    const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;
    const readingTime = Math.ceil(stats.wordCount / readSpeed);
    const speakingTime = Math.ceil(stats.wordCount / 200);

    const detailEl = document.getElementById('detailInfo');
    detailEl.innerHTML = `
        <div class="detail-row"><span class="detail-key">${t('tools.wordcount.readingTimeLabel', '预计阅读时间：')}</span><span class="detail-value highlight">${readingTime} ${t('tools.wordcount.minutes', '分钟')}</span></div>
        <div class="detail-row"><span class="detail-key">${t('tools.wordcount.speakingTimeLabel', '预计朗读时间：')}</span><span class="detail-value">${speakingTime} ${t('tools.wordcount.minutes', '分钟')}</span></div>
        <div class="detail-row"><span class="detail-key">${t('tools.wordcount.avgCharsPerLine', '平均每行字符：')}</span><span class="detail-value">${stats.lineCount > 0 ? Math.round(stats.charCount / stats.lineCount) : 0}</span></div>
        <div class="detail-row"><span class="detail-key">${t('tools.wordcount.avgCharsPerPara', '平均每段字符：')}</span><span class="detail-value">${stats.paragraphCount > 0 ? Math.round(stats.charCount / stats.paragraphCount) : 0}</span></div>
        <div class="detail-row"><span class="detail-key">${t('tools.wordcount.chineseRatio', '中文占比：')}</span><span class="detail-value">${stats.chineseCount > 0 ? (stats.chineseCount / stats.charCount * 100).toFixed(1) : 0}%</span></div>
        <div class="detail-row"><span class="detail-key">${t('tools.wordcount.englishRatio', '英文占比：')}</span><span class="detail-value">${stats.wordCount > 0 ? ((stats.charCount - stats.chineseCount) / stats.charCount * 100).toFixed(1) : 0}%</span></div>
    `;
}

function animateNumber(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const current = parseInt(el.textContent) || 0;
    const diff = targetValue - current;
    const duration = 300;
    const steps = 15;
    const stepValue = diff / steps;
    let step = 0;

    const timer = setInterval(function() {
        step++;
        if (step >= steps) {
            el.textContent = targetValue.toLocaleString();
            clearInterval(timer);
        } else {
            el.textContent = Math.round(current + stepValue * step).toLocaleString();
        }
    }, duration / steps);
}

function resetStats() {
    ['charCount', 'charNoSpace', 'wordCount', 'chineseCount', 'englishWordCount',
     'numberCount', 'lineCount', 'paragraphCount', 'punctuationCount', 'sentenceCount'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
    const detailEl = document.getElementById('detailInfo');
    const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;
    if (detailEl) detailEl.innerHTML = '<div class="detail-row"><span class="detail-key" style="color: var(--text-light);">' + t('tools.wordcount.inputToSeeDetails', '请输入文本以查看详细统计信息') + '</span></div>';
}

function clearInput() {
    document.getElementById('inputText').value = '';
    resetStats();
    showToast(I18N.t('common.clear'), 'info');
}

function clearAll() {
    clearInput();
    showToast(I18N.t('common.clear'), 'success');
}

async function pasteText() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('inputText').value = text;
        analyzeText();
        showToast(I18N.t('common.success'), 'success');
    } catch (err) {
        showToast(I18N.t('common.error'), 'error');
    }
}

function copyResult() {
    const text = document.getElementById('inputText').value;
    if (!text) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const stats = calculateStats(text);
    let result = `=== ${I18N.t('tools.wordcount.statistics')} ===\n`;
    result += `${I18N.t('tools.wordcount.characters')}：${stats.charCount}\n`;
    result += `${I18N.t('tools.wordcount.characters')}(不含空格)：${stats.charNoSpace}\n`;
    result += `${I18N.t('tools.wordcount.words')}：${stats.wordCount}\n`;
    result += `${I18N.t('tools.wordcount.chineseChars')}：${stats.chineseCount}\n`;
    result += `${I18N.t('tools.wordcount.englishWords')}：${stats.englishWordCount}\n`;
    result += `${I18N.t('tools.wordcount.numbers')}：${stats.numberCount}\n`;
    result += `${I18N.t('tools.wordcount.lines')}：${stats.lineCount}\n`;
    result += `${I18N.t('tools.wordcount.paragraphs')}：${stats.paragraphCount}\n`;
    result += `${I18N.t('tools.wordcount.punctuation')}：${stats.punctuationCount}\n`;
    result += `${I18N.t('tools.wordcount.sentences')}：${stats.sentenceCount}`;

    copyToClipboard(result, I18N.t('common.copied'));
}

function downloadResult() {
    const text = document.getElementById('inputText').value;
    if (!text) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const stats = calculateStats(text);
    const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;
    let content = `${I18N.t('tools.wordcount.name')}${t('tools.wordcount.report', '报告')}\n`;
    content += `${t('tools.wordcount.generatedAt', '生成时间：')}${Utils.formatDate(new Date())}\n`;
    content += `${'='.repeat(40)}\n\n`;
    content += `${I18N.t('tools.wordcount.characters')}：${stats.charCount}\n`;
    content += `${I18N.t('tools.wordcount.characters')}(不含空格)：${stats.charNoSpace}\n`;
    content += `${I18N.t('tools.wordcount.words')}：${stats.wordCount}\n`;
    content += `${I18N.t('tools.wordcount.chineseChars')}：${stats.chineseCount}\n`;
    content += `${I18N.t('tools.wordcount.englishWords')}：${stats.englishWordCount}\n`;
    content += `${I18N.t('tools.wordcount.numbers')}：${stats.numberCount}\n`;
    content += `${I18N.t('tools.wordcount.lines')}：${stats.lineCount}\n`;
    content += `${I18N.t('tools.wordcount.paragraphs')}：${stats.paragraphCount}\n`;
    content += `${I18N.t('tools.wordcount.punctuation')}：${stats.punctuationCount}\n`;
    content += `${I18N.t('tools.wordcount.sentences')}：${stats.sentenceCount}\n\n`;
    content += `${'='.repeat(40)}\n`;
    content += `${t('tools.wordcount.preview', '原文预览（前500字符）：')}\n`;
    content += text.substring(0, 500) + (text.length > 500 ? '...' : '');

    downloadFile(content, `${I18N.t('tools.wordcount.name')}报告.txt`, 'text/plain;charset=utf-8');
}
