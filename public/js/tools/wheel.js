(function() {
    const COLORS = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#74B9FF', '#FDCB6E',
        '#A29BFE', '#55EFC4', '#FAB1A0', '#81ECEC'
    ];

    let options = [
        '火锅', '烧烤', '日料', '西餐',
        '快餐', '自助餐', '串串', '披萨'
    ];

    let isSpinning = false;
    let currentRotation = 0;

    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinBtn');
    const optionListEl = document.getElementById('optionList');
    const addOptBtn = document.getElementById('addOptBtn');
    const resetOptsBtn = document.getElementById('resetOptsBtn');
    const resultTextEl = document.getElementById('resultText');

    function drawWheel() {
        const size = canvas.width;
        const center = size / 2;
        const radius = center - 12;
        ctx.clearRect(0, 0, size, size);

        if (options.length === 0) {
            ctx.fillStyle = '#eee';
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#999';
            ctx.font = 'bold 26px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('请添加选项', center, center);
            return;
        }

        const sliceAngle = (Math.PI * 2) / options.length;

        options.forEach((opt, i) => {
            const startAngle = i * sliceAngle + currentRotation - Math.PI / 2;
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.fill();

            ctx.strokeStyle = 'rgba(255,255,255,0.55)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = getContrastColor(COLORS[i % COLORS.length]);
            ctx.font = 'bold 28px "Microsoft YaHei", sans-serif';

            let text = opt.trim();
            if (text.length > 5) text = text.slice(0, 5) + '..';
            ctx.fillText(text, radius - 22, 0);
            ctx.restore();
        });

        ctx.beginPath();
        ctx.arc(center, center, 36, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#764ba2';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    function getContrastColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return ((r * 299 + g * 587 + b * 114) / 1000 > 128) ? '#333' : '#fff';
    }

    function spin() {
        if (isSpinning || options.length === 0) return;
        isSpinning = true;
        spinBtn.disabled = true;
        resultTextEl.classList.remove('show');

        const winIndex = Math.floor(Math.random() * options.length);
        const sliceAngle = (Math.PI * 2) / options.length;
        const targetAngle = -(winIndex * sliceAngle + sliceAngle / 2);
        const spins = 5 + Math.floor(Math.random() * 4);
        const totalRotation = spins * Math.PI * 2 + targetAngle - (currentRotation % (Math.PI * 2));

        const startRot = currentRotation;
        const startTime = performance.now();
        const duration = 4000 + Math.random() * 1500;

        function animate(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            currentRotation = startRot + totalRotation * eased;
            drawWheel();

            if (progress < 1) requestAnimationFrame(animate);
            else finishSpin(winIndex);
        }

        requestAnimationFrame(animate);
    }

    function finishSpin(index) {
        resultTextEl.textContent = '🎉 ' + I18N.t('tools.wheel.result') + '：' + options[index];
        resultTextEl.classList.add('show');
        isSpinning = false;
        spinBtn.disabled = false;
    }

    function renderOptionList() {
        optionListEl.innerHTML = options.map((opt, i) => `
            <div class="option-row">
                <input type="text" value="${Utils.escapeHtml(opt)}" data-index="${i}" placeholder="选项名称">
                <button class="remove-opt-btn" data-remove="${i}">×</button>
            </div>
        `).join('');

        optionListEl.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', function() {
                const idx = parseInt(this.dataset.index);
                if (idx >= 0 && idx < options.length) {
                    options[idx] = this.value || ('选项' + (idx + 1));
                    drawWheel();
                }
            });
        });

        optionListEl.querySelectorAll('.remove-opt-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.remove);
                if (options.length > 2) {
                    options.splice(idx, 1);
                    renderOptionList();
                    drawWheel();
                } else showToast(I18N.t('tools.wheel.options'), 'error');
            });
        });

        drawWheel();
    }

    addOptBtn.addEventListener('click', () => {
        if (options.length >= 12) { showToast('最多12个选项', 'error'); return; }
        options.push('选项' + (options.length + 1));
        renderOptionList();
    });

    resetOptsBtn.addEventListener('click', () => {
        options = ['火锅', '烧烤', '日料', '西餐', '快餐', '自助餐', '串串', '披萨'];
        resultTextEl.classList.remove('show');
        renderOptionList();
        showToast('已重置', 'info');
    });

    spinBtn.addEventListener('click', spin);
    renderOptionList();
})();
