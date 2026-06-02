(function() {
    const MODES = {
        work: { name: '专注', duration: 25, color: '#e74c3c', icon: '🍅' },
        shortBreak: { name: '短休息', duration: 5, color: '#27ae60', icon: '☕' },
        longBreak: { name: '长休息', duration: 15, color: '#3498db', icon: '🌴' }
    };

    let currentMode = 'work';
    let timeLeft = MODES.work.duration * 60;
    let totalTime = MODES.work.duration * 60;
    let isRunning = false;
    let intervalId = null;
    let completedPomodoros = 0;
    let totalFocusMinutes = 0;

    const canvas = document.getElementById('timerCanvas');
    const ctx = canvas.getContext('2d');
    const timerTimeEl = document.getElementById('timerTime');
    const timerLabelEl = document.getElementById('timerLabel');
    const playBtn = document.getElementById('playBtn');
    const resetBtn = document.getElementById('resetBtn');
    const skipBtn = document.getElementById('skipBtn');
    const completedEl = document.getElementById('completedPomodoros');
    const totalMinEl = document.getElementById('totalMinutes');
    const modeTabs = document.querySelectorAll('.mode-tab');

    function drawRing(progress, color) {
        const size = canvas.width;
        const center = size / 2;
        const radius = (size / 2) - 18;

        ctx.clearRect(0, 0, size, size);

        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (progress > 0) {
            ctx.beginPath();
            ctx.arc(center, center, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
            ctx.strokeStyle = color;
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    function updateDisplay() {
        const progress = (totalTime - timeLeft) / totalTime;
        const mode = MODES[currentMode];
        drawRing(Math.max(0, progress), mode.color);
        timerTimeEl.textContent = formatTime(timeLeft);

        if (!isRunning && timeLeft === totalTime) {
            timerLabelEl.textContent = I18N.t('common.reset') + I18N.t('tools.pomodoro.' + currentMode);
        } else if (isRunning) {
            timerLabelEl.textContent = `${MODES[currentMode].icon} ${I18N.t('tools.pomodoro.' + currentMode)}...`;
        } else {
            timerLabelEl.textContent = I18N.t('tools.pomodoro.pause');
        }

        document.title = formatTime(timeLeft) + ' - 🍅番茄钟';
    }

    function tick() {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            completeSession();
        }
    }

    function completeSession() {
        pause();

        if (currentMode === 'work') {
            completedPomodoros++;
            totalFocusMinutes += Math.round(totalTime / 60);
            completedEl.textContent = completedPomodoros;
            totalMinEl.textContent = totalFocusMinutes;

            if (completedPomodoros % 4 === 0) {
                showToast('🎉 ' + I18N.t('tools.pomodoro.completed') + '4' + I18N.t('tools.pomodoro.pomodoros') + '! ' + I18N.t('tools.pomodoro.longBreak') + '~', 'success');
                switchMode('longBreak');
            } else {
                showToast('🍅 ' + I18N.t('tools.pomodoro.completed') + '! ' + I18N.t('tools.pomodoro.breakTime') + '~', 'success');
                switchMode('shortBreak');
            }
        } else {
            showToast('💪 ' + I18N.t('tools.pomodoro.breakTime') + I18N.t('tools.pomodoro.work') + '!', 'info');
            switchMode('work');
        }

        playSound();
    }

    function playSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch(e) {}
    }

    function togglePlay() {
        if (isRunning) {
            pause();
        } else {
            start();
        }
    }

    function start() {
        if (timeLeft <= 0) return;
        isRunning = true;
        playBtn.innerHTML = '⏸';
        playBtn.classList.add('running');
        intervalId = setInterval(tick, 1000);
        updateDisplay();
    }

    function pause() {
        isRunning = false;
        playBtn.innerHTML = '▶';
        playBtn.classList.remove('running');
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        updateDisplay();
    }

    function resetTimer() {
        pause();
        const mode = MODES[currentMode];
        timeLeft = getModeDuration(currentMode) * 60;
        totalTime = timeLeft;
        updateDisplay();
    }

    function skip() {
        if (confirm('确定要跳过当前时段吗？')) {
            completeSession();
        }
    }

    function switchMode(mode) {
        currentMode = mode;
        pause();
        timeLeft = getModeDuration(mode) * 60;
        totalTime = timeLeft;

        modeTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });

        updateDisplay();
    }

    function getModeDuration(mode) {
        switch (mode) {
            case 'work': return parseInt(document.getElementById('workDuration').value) || 25;
            case 'shortBreak': return parseInt(document.getElementById('shortBreakDuration').value) || 5;
            case 'longBreak': return parseInt(document.getElementById('longBreakDuration').value) || 15;
            default: return 25;
        }
    }

    playBtn.addEventListener('click', togglePlay);
    resetBtn.addEventListener('click', resetTimer);
    skipBtn.addEventListener('click', skip);

    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => switchMode(tab.dataset.mode));
    });

    ['workDuration', 'shortBreakDuration', 'longBreakDuration'].forEach(id => {
        document.getElementById(id).addEventListener('change', function() {
            if (!isRunning && currentMode === this.id.replace('Duration', '')) {
                resetTimer();
            }
        });
    });

    document.addEventListener('keydown', e => {
        if (e.code === 'Space' && !(e.target instanceof HTMLInputElement)) {
            e.preventDefault();
            togglePlay();
        }
    });

    updateDisplay();
})();
