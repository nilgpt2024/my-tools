(function() {
    let currentColor = '#ffffff';
    let autoInterval = null;

    const stageArea = document.getElementById('stageArea');
    const danmakuInput = document.getElementById('danmakuInput');
    const sendBtn = document.getElementById('sendBtn');
    const speedSelect = document.getElementById('speedSelect');
    const sizeSelect = document.getElementById('sizeSelect');
    const autoModeEl = document.getElementById('autoMode');
    const clearStageBtn = document.getElementById('clearStageBtn');
    const colorPicker = document.getElementById('colorPicker');
    const presetTagsEl = document.getElementById('presetTags');

    const PRESETS = [
        '666666', '哈哈哈哈哈', '太强了吧！', '前方高能⚡',
        '厉害了', '笑死我了😂', '好家伙', '绝了绝了',
        '冲冲冲🚀', '爱了爱了❤️', 'awsl', '爷青回',
        '这波可以', '针不戳👍', '我裂开了', '芜湖起飞✈️'
    ];

    function renderPresets() {
        presetTagsEl.innerHTML = PRESETS.map(p =>
            `<span class="preset-tag">${p}</span>`
        ).join('');

        presetTagsEl.querySelectorAll('.preset-tag').forEach(tag => {
            tag.addEventListener('click', () => sendDanmaku(tag.textContent));
        });
    }

    function sendDanmaku(text) {
        if (!text || !text.trim()) return;

        const el = document.createElement('div');
        el.className = 'danmaku-item';
        el.textContent = text.trim();
        el.style.color = currentColor;
        el.style.fontSize = sizeSelect.value + 'px';

        const duration = parseFloat(speedSelect.value) + Math.random() * 3;
        el.style.animationDuration = duration + 's';

        const topPos = Math.random() * (stageArea.offsetHeight - 40) + 10;
        el.style.top = topPos + 'px';
        el.style.right = '-200px';

        stageArea.appendChild(el);

        el.addEventListener('animationend', () => el.remove());
    }

    function handleSend() {
        const val = danmakuInput.value.trim();
        if (!val) { showToast(I18N.t('tools.barrage.input'), 'error'); return; }
        sendDanmaku(val);
        danmakuInput.value = '';
        danmakuInput.focus();
    }

    sendBtn.addEventListener('click', handleSend);

    danmakuInput.addEventListener('keydown', e => {
        if (e.code === 'Enter') handleSend();
    });

    colorPicker.addEventListener('click', e => {
        const dot = e.target.closest('.color-dot');
        if (!dot) return;
        colorPicker.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentColor = dot.dataset.color;
    });

    clearStageBtn.addEventListener('click', () => {
        stageArea.querySelectorAll('.danmaku-item').forEach(el => el.remove());
        showToast('舞台已清空', 'info');
    });

    autoModeEl.addEventListener('change', function() {
        if (this.checked) {
            let idx = 0;
            autoInterval = setInterval(() => {
                sendDanmaku(PRESETS[idx % PRESETS.length]);
                idx++;
            }, 1200);
            showToast('已开启自动弹幕模式', 'info');
        } else {
            clearInterval(autoInterval);
            autoInterval = null;
            showToast('已关闭自动弹幕模式', 'info');
        }
    });

    renderPresets();
})();
