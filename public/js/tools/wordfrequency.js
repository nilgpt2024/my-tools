const STOP_WORDS = new Set([
    '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
    '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
    '自己', '这', '他', '她', '它', '们', '那', '什么', '这个', '那个', '哪个',
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
    'them', 'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that',
    'these', 'those', 'am', 'and', 'but', 'or', 'if', 'then', 'than',
    'so', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for',
    'with', 'about', 'against', 'between', 'through', 'during', 'before',
    'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'too', 'very', 'just', 'also', 'now'
]);

document.addEventListener('DOMContentLoaded', function() {
    const inputEl = document.getElementById('inputText');
    if (inputEl) {
        inputEl.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                analyzeFrequency();
            }
        });
    }
});

function analyzeFrequency() {
    const text = document.getElementById('inputText').value.trim();
    if (!text) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const mode = document.getElementById('modeSelect').value;
    const ignoreCase = document.getElementById('ignoreCaseCheck').checked;
    const ignorePunct = document.getElementById('ignorePunctuationCheck').checked;
    const topCount = parseInt(document.getElementById('topCountSelect').value);
    const minFreq = parseInt(document.getElementById('minFreqInput').value) || 1;

    let words;

    switch (mode) {
        case 'char':
            words = splitByChar(text, ignorePunct);
            break;
        case 'word':
            words = splitByChineseWord(text, ignorePunct);
            break;
        case 'english':
            words = splitByEnglish(text, ignoreCase, ignorePunct);
            break;
        case 'mixed':
            words = splitMixed(text, ignoreCase, ignorePunct);
            break;
        default:
            words = splitByChar(text, ignorePunct);
    }

    const frequencyMap = calculateFrequency(words);
    const sortedResults = sortAndFilter(frequencyMap, topCount, minFreq);

    displayResults(sortedResults, text.length, words.length);
}

function splitByChar(text, ignorePunct) {
    let processed = text;
    if (ignorePunct) {
        processed = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
    }
    return processed.split('');
}

function splitByChineseWord(text, ignorePunct) {
    let processed = text;
    if (ignorePunct) {
        processed = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');
    }

    const words = [];
    const segments = processed.split(/\s+/).filter(s => s.trim());

    segments.forEach(segment => {
        if (/[\u4e00-\u9fa5]/.test(segment)) {
            for (let i = 0; i < segment.length; i++) {
                if (/[\u4e00-\u9fa5]/.test(segment[i])) {
                    if (i + 1 < segment.length && /[\u4e00-\u9fa5]/.test(segment[i + 1])) {
                        words.push(segment.substring(i, i + 2));
                    } else {
                        words.push(segment[i]);
                    }
                } else if (/[a-zA-Z0-9]+/.test(segment[i])) {
                    const match = segment.slice(i).match(/[a-zA-Z0-9]+/);
                    if (match) {
                        words.push(match[0]);
                        i += match[0].length - 1;
                    }
                }
            }
        } else {
            words.push(segment);
        }
    });

    return words.filter(w => w.trim());
}

function splitByEnglish(text, ignoreCase, ignorePunct) {
    let processed = text;
    if (ignorePunct) {
        processed = text.replace(/[^a-zA-Z0-9\s]/g, ' ');
    }

    let words = processed.split(/\s+/).filter(w => w.trim() && /[a-zA-Z]/.test(w));

    if (ignoreCase) {
        words = words.map(w => w.toLowerCase());
    }

    return words;
}

function splitMixed(text, ignoreCase, ignorePunct) {
    let processed = text;
    if (ignorePunct) {
        processed = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');
    }

    const words = [];
    const segments = processed.split(/\s+/).filter(s => s.trim());

    segments.forEach(segment => {
        let current = '';
        for (let i = 0; i < segment.length; i++) {
            const char = segment[i];
            if (/[\u4e00-\u9fa5]/.test(char)) {
                if (current) {
                    if (/[a-zA-Z0-9]/.test(current)) {
                        words.push(ignoreCase ? current.toLowerCase() : current);
                    }
                    current = '';
                }
                if (i + 1 < segment.length && /[\u4e00-\u9fa5]/.test(segment[i + 1])) {
                    words.push(char + segment[i + 1]);
                    i++;
                } else {
                    words.push(char);
                }
            } else if (/[a-zA-Z0-9]/.test(char)) {
                current += char;
            } else {
                if (current) {
                    words.push(ignoreCase ? current.toLowerCase() : current);
                    current = '';
                }
            }
        }
        if (current && /[a-zA-Z0-9]/.test(current)) {
            words.push(ignoreCase ? current.toLowerCase() : current);
        }
    });

    return words.filter(w => w.trim() && w.length > 0);
}

function calculateFrequency(words) {
    const map = new Map();
    words.forEach(word => {
        const w = word.trim();
        if (!w || w.length === 0) return;
        map.set(w, (map.get(w) || 0) + 1);
    });
    return map;
}

function sortAndFilter(frequencyMap, topCount, minFreq) {
    let results = Array.from(frequencyMap.entries())
        .filter(([word, count]) => count >= minFreq)
        .sort((a, b) => b[1] - a[1]);

    if (topCount > 0) {
        results = results.slice(0, topCount);
    }

    return results;
}

function displayResults(results, totalChars, totalWords) {
    const container = document.getElementById('frequencyResult');
    if (results.length === 0) {
        container.innerHTML = '<div class="result-empty">未找到符合条件的词语，请尝试调整筛选条件</div>';
        return;
    }

    const maxCount = results[0][1];
    const uniqueWords = results.length;
    const totalFreq = results.reduce((sum, [, count]) => sum + count, 0);

    let html = `
        <div style="margin-bottom: 16px; padding: 12px; background: linear-gradient(135deg, rgba(64,158,255,0.05), rgba(118,75,162,0.05)); border-radius: 8px;">
            <div style="display: flex; gap: 24px; flex-wrap: wrap; font-size: 13px;">
                <div><strong>总字符数：</strong>${totalChars.toLocaleString()}</div>
                <div><strong>总词数：</strong>${totalWords.toLocaleString()}</div>
                <div><strong>不重复词：</strong>${uniqueWords.toLocaleString()}</div>
                <div><strong>最高频次：</strong>${maxCount.toLocaleString()}</div>
            </div>
        </div>
        <table class="freq-table">
            <thead>
                <tr>
                    <th width="60">排名</th>
                    <th width="30%">词语</th>
                    <th width="80">频次</th>
                    <th width="80">占比</th>
                    <th>频率分布</th>
                </tr>
            </thead>
            <tbody>
    `;

    results.forEach(([word, count], index) => {
        const percentage = ((count / totalFreq) * 100).toFixed(2);
        const barWidth = (count / maxCount * 100).toFixed(1);
        const barColor = getBarColor(index, results.length);

        html += `
            <tr>
                <td><span class="rank-badge ${index < 3 ? 'top-rank' : ''}">${index + 1}</span></td>
                <td><code class="word-code">${Utils.escapeHtml(word)}</code></td>
                <td><strong>${count.toLocaleString()}</strong></td>
                <td>${percentage}%</td>
                <td>
                    <div class="freq-bar-wrapper">
                        <div class="freq-bar" style="width: ${barWidth}%; background: ${barColor};"></div>
                    </div>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function getBarColor(index, totalLength) {
    const colors = [
        'linear-gradient(90deg, #409EFF, #667eea)',
        'linear-gradient(90deg, #67c23a, #85ce61)',
        'linear-gradient(90deg, #e6a23c, #f0c78a)',
        'linear-gradient(90deg, #f56c6c, #f89898)',
        'linear-gradient(90deg, #909399, #b1b3b8)'
    ];
    return colors[Math.min(Math.floor(index / (totalLength || 20) * colors.length), colors.length - 1)];
}

function clearInput() {
    document.getElementById('inputText').value = '';
    document.getElementById('frequencyResult').innerHTML = '<div class="result-empty">请输入文本后点击分析按钮查看词频统计</div>';
    showToast('已清空输入内容', 'info');
}

function clearAll() {
    clearInput();
}

async function pasteText() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('inputText').value = text;
        showToast(I18N.t('common.success'), 'success');
    } catch (err) {
        showToast(I18N.t('common.error'), 'error');
    }
}

function copyResult() {
    const container = document.getElementById('frequencyResult');
    const rows = container.querySelectorAll('tbody tr');
    if (rows.length === 0) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    let result = '排名\t词语\t频次\t占比\n';
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const rank = cells[0].textContent.trim();
            const word = cells[1].textContent.trim();
            const count = cells[2].textContent.trim();
            const pct = cells[3].textContent.trim();
            result += `${rank}\t${word}\t${count}\t${pct}\n`;
        }
    });

    copyToClipboard(result, I18N.t('common.copied'));
}

function downloadResult() {
    const container = document.getElementById('frequencyResult');
    const rows = container.querySelectorAll('tbody tr');
    if (rows.length === 0) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    let csv = '\ufeff排名,词语,频次,占比\n';
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const rank = cells[0].textContent.trim();
            const word = cells[1].textContent.trim().replace(/"/g, '""');
            const count = cells[2].textContent.trim();
            const pct = cells[3].textContent.trim();
            csv += `${rank},"${word}",${count},${pct}\n`;
        }
    });

    downloadFile(csv, `${I18N.t('tools.wordfrequency.name')}.csv`, 'text/csv;charset=utf-8');
}
