(function() {
    let isRolling = false;
    const history = [];
    const MAX_HISTORY = 50;

    const itemInput = document.getElementById('itemInput');
    const pickCountEl = document.getElementById('pickCount');
    const pickBtn = document.getElementById('pickBtn');
    const slotText = document.getElementById('slotText');
    const historyTags = document.getElementById('historyTags');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    function getItems() {
        return itemInput.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }

    function pick() {
        if (isRolling) return;
        const items = getItems();
        if (items.length === 0) {
            showToast(I18N.t('tools.random.items'), 'error');
            return;
        }

        let count = parseInt(pickCountEl.value) || 1;
        count = Math.min(count, items.length);

        isRolling = true;
        pickBtn.disabled = true;
        slotText.className = 'slot-text rolling';

        let rollCount = 0;
        const totalRolls = 25 + Math.floor(Math.random() * 15);
        const rollInterval = setInterval(() => {
            slotText.textContent = items[Math.floor(Math.random() * items.length)];
            rollCount++;
            if (rollCount >= totalRolls) {
                clearInterval(rollInterval);
                finishPick(items, count);
            }
        }, 55);
    }

    function finishPick(items, count) {
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, count);
        const resultStr = picked.join('、');

        slotText.textContent = resultStr;
        slotText.className = 'slot-text selected';

        history.unshift(resultStr);
        if (history.length > MAX_HISTORY) history.pop();
        renderHistory();

        setTimeout(() => {
            isRolling = false;
            pickBtn.disabled = false;
            slotText.classList.remove('selected');
        }, 500);
    }

    function renderHistory() {
        if (history.length === 0) {
            historyTags.innerHTML = '<span class="empty-tip">暂无记录</span>';
            return;
        }
        historyTags.innerHTML = history.map(item =>
            `<span class="history-tag">${Utils.escapeHtml(item)}</span>`
        ).join('');
    }

    function clearHistory() {
        history.length = 0;
        renderHistory();
        showToast(I18N.t('tools.random.clear') + I18N.t('common.success'), 'info');
    }

    pickBtn.addEventListener('click', pick);
    clearHistoryBtn.addEventListener('click', clearHistory);

    itemInput.value = '火锅\n烧烤\n日料\n西餐\n快餐\n自助餐\n串串\n披萨\n汉堡\n麻辣烫\n螺蛳粉\n炸鸡';

    document.addEventListener('keydown', function(e) {
        if ((e.code === 'Enter' || e.code === 'Space') && !isRolling && document.activeElement !== itemInput) {
            e.preventDefault();
            pick();
        }
    });
})();
