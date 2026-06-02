(function() {
    const STATE = { IDLE: 'idle', WAITING: 'waiting', READY: 'ready', EARLY: 'early', RESULT: 'result' };

    let currentState = STATE.IDLE;
    let startTime = 0;
    let timeoutId = null;
    const results = [];

    const arena = document.getElementById('arena');
    const arenaIcon = document.getElementById('arenaIcon');
    const arenaText = document.getElementById('arenaText');
    const bestTimeEl = document.getElementById('bestTime');
    const avgTimeEl = document.getElementById('avgTime');
    const totalTestsEl = document.getElementById('totalTests');
    const historyList = document.getElementById('historyList');

    function setArena(state) {
        arena.className = 'test-arena ' + state;

        switch (state) {
            case 'waiting':
                arenaIcon.textContent = '👆';
                arenaText.innerHTML = I18N.t('tools.reactiontest.wait') + '...<br><small style="font-size:14px;opacity:0.8">不要提前点击！</small>';
                break;
            case 'ready':
                arenaIcon.textContent = '🟢';
                arenaText.innerHTML = I18N.t('tools.reactiontest.clickNow') + '!<br><small style="font-size:14px;opacity:0.8">越快越好！</small>';
                break;
            case 'early':
                arenaIcon.textContent = '😅';
                arenaText.innerHTML = I18N.t('tools.reactiontest.tooEarly') + '!<br><small style="font-size:14px;opacity:0.8">点击重新开始</small>';
                break;
            case 'result':
                const elapsed = Date.now() - startTime;
                arenaIcon.textContent = '✅';
                arenaText.innerHTML = `<div class="result-time">${elapsed}</div><div class="result-unit">${I18N.t('tools.reactiontest.milliseconds')}</div>`;
                recordResult(elapsed);
                break;
        }
    }

    function handleClick() {
        switch (currentState) {
            case STATE.IDLE:
            case STATE.EARLY:
                startWaiting();
                break;
            case STATE.WAITING:
                setArena('early');
                clearTimeout(timeoutId);
                currentState = STATE.EARLY;
                break;
            case STATE.READY:
                setArena('result');
                currentState = STATE.RESULT;
                break;
            case STATE.RESULT:
                startWaiting();
                break;
        }
    }

    function startWaiting() {
        currentState = STATE.WAITING;
        setArena('waiting');

        const delay = 1500 + Math.random() * 3500;
        timeoutId = setTimeout(() => {
            if (currentState === STATE.WAITING) {
                currentState = STATE.READY;
                startTime = Date.now();
                setArena('ready');
            }
        }, delay);
    }

    function recordResult(ms) {
        results.push(ms);
        updateStats();
        renderHistory();

        if (ms < 180) showToast('⚡ ' + I18N.t('tools.reactiontest.excellent') + ' ' + ms + 'ms', 'success');
        else if (ms < 220) showToast('🔥 ' + I18N.t('tools.reactiontest.great') + ' ' + ms + 'ms', 'success');
        else if (ms < 300) showToast('👍 ' + I18N.t('tools.reactiontest.good') + ' ' + ms + 'ms', 'info');
        else if (ms < 400) showToast('💪 ' + I18N.t('tools.reactiontest.average') + ' ' + ms + 'ms', 'info');
        else showToast('🐢 ' + I18N.t('tools.reactiontest.slow') + '~ ' + ms + 'ms', 'info');
    }

    function updateStats() {
        totalTestsEl.textContent = results.length;

        if (results.length > 0) {
            const best = Math.min(...results);
            const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);

            bestTimeEl.textContent = best + ' ms';
            avgTimeEl.textContent = avg + ' ms';
        }
    }

    function renderHistory() {
        const sorted = [...results].sort((a, b) => a - b).slice(0, 10);

        if (sorted.length === 0) {
            historyList.innerHTML = '<div class="empty-history">暂无记录，开始测试吧！</div>';
            return;
        }

        let html = '<div class="history-row header"><span>#</span><span>时间</span><span>评级</span></div>';

        sorted.forEach((time, i) => {
            let rankClass = 'normal';
            let rankLabel = '';
            if (i === 0) { rankClass = 'gold'; rankLabel = '🥇'; }
            else if (i === 1) { rankClass = 'silver'; rankLabel = '🥈'; }
            else if (i === 2) { rankClass = 'bronze'; rankLabel = '🥉'; }

            let rating = '';
            if (time < 180) rating = '超神';
            else if (time < 220) rating = '极速';
            else if (time < 300) rating = '优秀';
            else if (time < 400) rating = '良好';
            else rating = '一般';

            html += `<div class="history-row">
                <span><span class="rank-badge ${rankClass}">${rankLabel || i+1}</span></span>
                <span class="time-value">${time} ms</span>
                <span class="time-rank">${rating}</span>
            </div>`;
        });

        historyList.innerHTML = html;
    }

    arena.addEventListener('click', handleClick);

    document.addEventListener('keydown', function(e) {
        if ((e.code === 'Space' || e.code === 'Enter') && document.activeElement === arena) {
            e.preventDefault();
            handleClick();
        }
    });

    arena.focus();
})();
