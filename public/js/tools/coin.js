(function() {
    let headsCount = 0;
    let tailsCount = 0;
    let isFlipping = false;

    const coin = document.getElementById('coin');
    const flipBtn = document.getElementById('flipBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultText = document.getElementById('resultText');
    const headsCountEl = document.getElementById('headsCount');
    const tailsCountEl = document.getElementById('tailsCount');
    const container = document.getElementById('coinContainer');

    function flipCoin() {
        if (isFlipping) return;
        isFlipping = true;
        flipBtn.disabled = true;
        resultText.classList.remove('show', 'heads', 'tails');

        const isHeads = Math.random() < 0.5;
        const finalRotation = isHeads ? 3600 : 3780;
        coin.style.setProperty('--final-rotation', finalRotation + 'deg');

        coin.classList.remove('flipping');
        void coin.offsetWidth;
        coin.classList.add('flipping');
        container.classList.add('flipping');

        setTimeout(() => {
            if (isHeads) {
                headsCount++;
                resultText.textContent = '👑 ' + I18N.t('tools.coin.heads') + '！';
                resultText.className = 'result-text show heads';
            } else {
                tailsCount++;
                resultText.textContent = '🌸 ' + I18N.t('tools.coin.tails') + '！';
                resultText.className = 'result-text show tails';
            }

            headsCountEl.textContent = headsCount;
            tailsCountEl.textContent = tailsCount;
            container.classList.remove('flipping');
            isFlipping = false;
            flipBtn.disabled = false;
        }, 2000);
    }

    function resetStats() {
        headsCount = 0;
        tailsCount = 0;
        headsCountEl.textContent = '0';
        tailsCountEl.textContent = '0';
        resultText.classList.remove('show', 'heads', 'tails');
        resultText.textContent = '';
        coin.classList.remove('flipping');
        coin.style.transform = '';
    }

    flipBtn.addEventListener('click', flipCoin);
    resetBtn.addEventListener('click', resetStats);

    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !isFlipping) {
            e.preventDefault();
            flipCoin();
        }
    });
})();
