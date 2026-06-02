(function() {
    let diceCount = 1;
    let isRolling = false;
    const history = [];
    const MAX_HISTORY = 30;

    const DICE_IMAGES = [
        '../assets/images/dice/dice1.png',
        '../assets/images/dice/dice2.png',
        '../assets/images/dice/dice3.png',
        '../assets/images/dice/dice4.png',
        '../assets/images/dice/dice5.png',
        '../assets/images/dice/dice6.png'
    ];

    const ROLL_IMAGES = [
        '../assets/images/dice/dice_run1.png',
        '../assets/images/dice/dice_run2.png',
        '../assets/images/dice/dice_run3.png',
        '../assets/images/dice/dice_run4.png'
    ];

    const diceArea = document.getElementById('diceArea');
    const rollBtn = document.getElementById('rollBtn');
    const resultValue = document.getElementById('resultValue');
    const resultTotal = document.getElementById('resultTotal');
    const diceCountDisplay = document.getElementById('diceCountDisplay');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const historyList = document.getElementById('historyList');

    function createDiceElements() {
        diceArea.innerHTML = '';
        for (let i = 0; i < diceCount; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'dice-wrapper';
            wrapper.innerHTML = `
                <div class="dice" data-index="${i}">
                    <img src="${DICE_IMAGES[0]}" alt="骰子${i+1}">
                </div>
            `;
            diceArea.appendChild(wrapper);
        }
    }

    function rollDice() {
        if (isRolling || diceCount === 0) return;
        isRolling = true;
        rollBtn.disabled = true;
        resultValue.classList.remove('show');

        const diceEls = diceArea.querySelectorAll('.dice');
        let frameIndex = 0;
        const totalFrames = 12;

        const rollInterval = setInterval(() => {
            diceEls.forEach(die => {
                const img = die.querySelector('img');
                img.src = ROLL_IMAGES[frameIndex % ROLL_IMAGES.length];
            });
            frameIndex++;
        }, 60);

        setTimeout(() => {
            clearInterval(rollInterval);

            const results = [];
            diceEls.forEach((die, index) => {
                const value = Math.floor(Math.random() * 6) + 1;
                results.push(value);
                const img = die.querySelector('img');

                const rotations = {
                    1: { rx: 0, ry: 0, rz: 0 },
                    2: { rx: -90, ry: 0, rz: 0 },
                    3: { rx: 0, ry: -90, rz: 0 },
                    4: { rx: 0, ry: 90, rz: 0 },
                    5: { rx: 90, ry: 0, rz: 0 },
                    6: { rx: 180, ry: 0, rz: 0 }
                };

                const rot = rotations[value];
                die.style.setProperty('--rx', rot.rx + 'deg');
                die.style.setProperty('--ry', rot.ry + 'deg');
                die.style.setProperty('--rz', rot.rz + 'deg');
                die.classList.add('rolling');

                setTimeout(() => {
                    img.src = DICE_IMAGES[value - 1];
                }, 400);
            });

            setTimeout(() => {
                const total = results.reduce((a, b) => a + b, 0);
                resultValue.textContent = results.join(' + ') + ' = ' + total;
                resultValue.classList.add('show');
                resultTotal.textContent = I18N.t('tools.dice.total').replace('{count}', diceCount).replace('{total}', total);

                addToHistory(results, total);

                diceEls.forEach(die => die.classList.remove('rolling'));
                isRolling = false;
                rollBtn.disabled = false;
            }, 900);

        }, 720);
    }

    function addToHistory(results, total) {
        history.unshift({ results: [...results], total });
        if (history.length > MAX_HISTORY) history.pop();
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<span style="color: var(--text-light); font-style: italic;">暂无记录</span>';
            return;
        }
        historyList.innerHTML = history.map((item, i) =>
            `<span class="history-item">${item.total}</span>`
        ).join('');
    }

    function updateDiceCount(delta) {
        const newCount = diceCount + delta;
        if (newCount >= 1 && newCount <= 6) {
            diceCount = newCount;
            diceCountDisplay.textContent = diceCount;
            createDiceElements();
            resultValue.classList.remove('show');
            resultTotal.textContent = '';
        }
    }

    rollBtn.addEventListener('click', rollDice);
    decreaseBtn.addEventListener('click', () => updateDiceCount(-1));
    increaseBtn.addEventListener('click', () => updateDiceCount(1));

    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !isRolling) {
            e.preventDefault();
            rollDice();
        }
    });

    createDiceElements();
})();
