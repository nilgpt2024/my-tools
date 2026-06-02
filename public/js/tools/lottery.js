(function() {
    const COLORS = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
        '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];

    let prizes = [
        { name: '一等奖', color: COLORS[0] },
        { name: '二等奖', color: COLORS[1] },
        { name: '三等奖', color: COLORS[2] },
        { name: '参与奖', color: COLORS[3] },
        { name: '谢谢参与', color: COLORS[4] },
        { name: '再来一次', color: COLORS[5] }
    ];

    let isSpinning = false;
    let currentRotation = 0;

    const canvas = document.getElementById('lotteryCanvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinBtn');
    const prizeListEl = document.getElementById('prizeList');
    const addPrizeBtn = document.getElementById('addPrizeBtn');
    const resetPrizesBtn = document.getElementById('resetPrizesBtn');
    const resultText = document.getElementById('resultText');

    function drawWheel() {
        const size = canvas.width;
        const center = size / 2;
        const radius = center - 10;
        ctx.clearRect(0, 0, size, size);

        if (prizes.length === 0) {
            ctx.fillStyle = '#eee';
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#999';
            ctx.font = 'bold 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('请添加奖品', center, center);
            return;
        }

        const sliceAngle = (Math.PI * 2) / prizes.length;

        prizes.forEach((prize, i) => {
            const startAngle = i * sliceAngle + currentRotation - Math.PI / 2;
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = prize.color;
            ctx.fill();

            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = getContrastColor(prize.color);
            ctx.font = 'bold 30px "Microsoft YaHei", sans-serif';
            const text = prize.name.length > 6 ? prize.name.slice(0, 6) + '..' : prize.name;
            ctx.fillText(text, radius - 25, 0);
            ctx.restore();
        });

        ctx.beginPath();
        ctx.arc(center, center, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = 'var(--primary-color)';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    function getContrastColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#333' : '#fff';
    }

    function spin() {
        if (isSpinning || prizes.length === 0) return;
        isSpinning = true;
        spinBtn.disabled = true;
        resultText.classList.remove('show');

        const winIndex = Math.floor(Math.random() * prizes.length);
        const sliceAngle = (Math.PI * 2) / prizes.length;
        const targetAngle = -(winIndex * sliceAngle + sliceAngle / 2);
        const spins = 6 + Math.floor(Math.random() * 4);
        const totalRotation = spins * Math.PI * 2 + targetAngle - (currentRotation % (Math.PI * 2));

        const startRotation = currentRotation;
        const startTime = performance.now();
        const duration = 4500 + Math.random() * 1500;

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            currentRotation = startRotation + totalRotation * eased;
            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                finishSpin(winIndex);
            }
        }

        requestAnimationFrame(animate);
    }

    function finishSpin(index) {
        resultText.textContent = '🎉 ' + I18N.t('tools.lottery.winner') + '：' + prizes[index].name + ' 🎉';
        resultText.classList.add('show');

        isSpinning = false;
        spinBtn.disabled = false;
    }

    function renderPrizeList() {
        prizeListEl.innerHTML = prizes.map((prize, i) => `
            <div class="prize-item">
                <span class="color-dot" style="background:${prize.color}"></span>
                <input type="text" value="${Utils.escapeHtml(prize.name)}" data-index="${i}" placeholder="奖品名称">
                <button class="remove-prize-btn" data-remove="${i}">×</button>
            </div>
        `).join('');

        prizeListEl.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', function() {
                const idx = parseInt(this.dataset.index);
                if (idx >= 0 && idx < prizes.length) {
                    prizes[idx].name = this.value || ('奖品' + (idx + 1));
                    drawWheel();
                }
            });
        });

        prizeListEl.querySelectorAll('.remove-prize-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.remove);
                if (prizes.length > 1) {
                    prizes.splice(idx, 1);
                    renderPrizeList();
                    drawWheel();
                } else {
                    showToast(I18N.t('tools.lottery.prizes'), 'error');
                }
            });
        });

        drawWheel();
    }

    function addPrize() {
        if (prizes.length >= 12) {
            showToast(I18N.t('tools.lottery.addPrize').replace('+ ', ''), 'error');
            return;
        }
        const colorIndex = prizes.length % COLORS.length;
        prizes.push({ name: '奖品' + (prizes.length + 1), color: COLORS[colorIndex] });
        renderPrizeList();
    }

    function resetPrizes() {
        prizes = [
            { name: '一等奖', color: COLORS[0] },
            { name: '二等奖', color: COLORS[1] },
            { name: '三等奖', color: COLORS[2] },
            { name: '参与奖', color: COLORS[3] },
            { name: '谢谢参与', color: COLORS[4] },
            { name: '再来一次', color: COLORS[5] }
        ];
        resultText.classList.remove('show');
        renderPrizeList();
        showToast(I18N.t('tools.lottery.reset') + I18N.t('common.success'), 'info');
    }

    spinBtn.addEventListener('click', spin);
    addPrizeBtn.addEventListener('click', addPrize);
    resetPrizesBtn.addEventListener('click', resetPrizes);

    renderPrizeList();
})();
