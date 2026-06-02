let ruleIndex = 1;

document.addEventListener('DOMContentLoaded', function() {
    const inputEl = document.getElementById('inputText');
    if (inputEl) {
        inputEl.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                doReplace();
            }
        });
    }

    document.querySelectorAll('.rule-regex').forEach(cb => {
        toggleRegexOptions(cb);
    });
});

function addRule() {
    const container = document.getElementById('rulesContainer');
    const ruleEl = document.createElement('div');
    ruleEl.className = 'rule-item';
    ruleEl.setAttribute('data-rule-index', ruleIndex++);
    ruleEl.innerHTML = `
        <div class="rule-row">
            <div class="rule-field">
                <label>查找内容</label>
                <input type="text" class="form-control rule-search" placeholder="输入要查找的文本或正则表达式">
            </div>
            <div class="rule-arrow">→</div>
            <div class="rule-field">
                <label>替换为</label>
                <input type="text" class="form-control rule-replace" placeholder="输入替换内容（留空表示删除）">
            </div>
            <div class="rule-actions">
                <button class="btn-remove-rule" onclick="removeRule(this)" title="删除规则">×</button>
            </div>
        </div>
        <div class="rule-options">
            <label><input type="checkbox" class="rule-regex" onchange="toggleRegexOptions(this)"> 正则表达式</label>
            <label><input type="checkbox" class="rule-global" checked> 全局匹配 (g)</label>
            <label><input type="checkbox" class="rule-case"> 忽略大小写 (i)</label>
            <label><input type="checkbox" class="rule-multiline"> 多行模式 (m)</label>
            <label class="regex-flag-label" style="display:none;">Flags: <input type="text" class="rule-flags" placeholder="gim" style="width:60px;padding:4px 8px;font-size:12px;border:1px solid var(--border-color);border-radius:4px;"></label>
        </div>
    `;
    container.appendChild(ruleEl);
}

function removeRule(btn) {
    const rules = document.querySelectorAll('.rule-item');
    if (rules.length <= 1) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }
    btn.closest('.rule-item').remove();
}

function toggleRegexOptions(checkbox) {
    const ruleItem = checkbox.closest('.rule-item');
    const flagLabel = ruleItem.querySelector('.regex-flag-label');
    const globalCb = ruleItem.querySelector('.rule-global');
    const caseCb = ruleItem.querySelector('.rule-case');
    const multiCb = ruleItem.querySelector('.rule-multiline');

    if (checkbox.checked) {
        flagLabel.style.display = '';
        document.getElementById('regexHelper').style.display = '';
    } else {
        flagLabel.style.display = 'none';
    }
}

function doReplace() {
    const inputText = document.getElementById('inputText').value;
    if (!inputText) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const rules = collectRules();
    if (rules.length === 0) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    let result = inputText;
    let totalMatches = 0;
    let errors = [];

    rules.forEach((rule, index) => {
        try {
            const replaceResult = applyRule(result, rule);
            result = replaceResult.text;
            totalMatches += replaceResult.matches;
        } catch (err) {
            errors.push(`规则 ${index + 1}: ${err.message}`);
        }
    });

    document.getElementById('outputText').value = result;

    const summaryEl = document.getElementById('replaceSummary');
    if (errors.length > 0) {
        summaryEl.innerHTML = `<span style="color: #f56c6c;">⚠️ 部分规则执行失败：${errors.join('; ')}</span>`;
    } else {
        summaryEl.innerHTML = `
            <span style="color: #67c23a;">✅ 替换完成！共执行 ${rules.length} 条规则，
            匹配 <strong>${totalMatches}</strong> 处，
            原文 ${inputText.length} 字符 → 结果 ${result.length} 字符</span>
        `;
    }
}

function collectRules() {
    const ruleItems = document.querySelectorAll('.rule-item');
    const rules = [];

    ruleItems.forEach(item => {
        const searchValue = item.querySelector('.rule-search').value;
        const replaceValue = item.querySelector('.rule-replace').value;
        const isRegex = item.querySelector('.rule-regex').checked;
        const isGlobal = item.querySelector('.rule-global').checked;
        const ignoreCase = item.querySelector('.rule-case').checked;
        const multiline = item.querySelector('.rule-multiline').checked;
        const flags = item.querySelector('.rule-flags')?.value || '';

        if (!searchValue) return;

        rules.push({
            search: searchValue,
            replace: replaceValue,
            isRegex,
            flags: flags || (isGlobal ? 'g' : '') + (ignoreCase ? 'i' : '') + (multiline ? 'm' : '')
        });
    });

    return rules;
}

function applyRule(text, rule) {
    if (rule.isRegex) {
        const regex = new RegExp(rule.search, rule.flags);
        const matches = text.match(regex);
        const matchCount = matches ? matches.length : 0;

        const replaced = text.replace(regex, rule.replace);

        return { text: replaced, matches: matchCount };
    } else {
        let count = 0;
        let pos = 0;
        const searchStr = rule.search;

        while ((pos = text.indexOf(searchStr, pos)) !== -1) {
            count++;
            pos += searchStr.length;
        }

        const replaced = text.split(searchStr).join(rule.replace);

        return { text: replaced, matches: count };
    }
}

function clearInput() {
    document.getElementById('inputText').value = '';
    showToast('已清空输入内容', 'info');
}

function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    document.getElementById('replaceSummary').textContent = '等待执行替换操作...';

    const container = document.getElementById('rulesContainer');
    container.innerHTML = '';
    ruleIndex = 1;
    addRule();

    showToast('已清空全部内容', 'success');
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

function swapContent() {
    const inputEl = document.getElementById('inputText');
    const outputEl = document.getElementById('outputText');
    const temp = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = temp;
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
    downloadFile(result, `${I18N.t('tools.textreplace.name')}.txt`, 'text/plain;charset=utf-8');
}
