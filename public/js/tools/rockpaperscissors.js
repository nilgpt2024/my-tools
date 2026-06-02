(function() {
    const CHOICES = ['rock', 'paper', 'scissors'];
    const EMOJI = { rock: '✊', paper: '✋', scissors: '✌️' };
    const LABELS = { rock: '石头', paper: '布', scissors: '剪刀' };

    let playerScore = 0;
    let computerScore = 0;
    let drawScore = 0;
    let isPlaying = false;

    const playerHandEl = document.getElementById('playerHand');
    const computerHandEl = document.getElementById('computerHand');
    const resultTextEl = document.getElementById('resultText');
    const playerScoreEl = document.getElementById('playerScore');
    const computerScoreEl = document.getElementById('computerScore');
    const drawScoreEl = document.getElementById('drawScore');
    const choiceBtns = document.querySelectorAll('.choice-btn');
    const resetBtn = document.getElementById('resetBtn');

    function getComputerChoice() {
        return CHOICES[Math.floor(Math.random() * CHOICES.length)];
    }

    function determineWinner(player, computer) {
        if (player === computer) return 'draw';
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'win';
        }
        return 'lose';
    }

    function play(playerChoice) {
        if (isPlaying) return;
        isPlaying = true;

        choiceBtns.forEach(btn => btn.disabled = true);
        resultTextEl.classList.remove('show', 'win', 'lose', 'draw');
        playerHandEl.textContent = '❓';
        computerHandEl.textContent = '❓';

        playerHandEl.classList.add('shaking');
        computerHandEl.classList.add('shaking');

        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
            playerHandEl.textContent = EMOJI[CHOICES[shakeCount % 3]];
            computerHandEl.textContent = EMOJI[CHOICES[(shakeCount + 1) % 3]];
            shakeCount++;
        }, 120);

        setTimeout(() => {
            clearInterval(shakeInterval);

            playerHandEl.classList.remove('shaking');
            computerHandEl.classList.remove('shaking');

            const computerChoice = getComputerChoice();
            playerHandEl.textContent = EMOJI[playerChoice];
            computerHandEl.textContent = EMOJI[computerChoice];

            const result = determineWinner(playerChoice, computerChoice);

            setTimeout(() => {
                let resultMsg = '';
                switch (result) {
                    case 'win':
                        playerScore++;
                        resultMsg = '🎉 ' + I18N.t('tools.rockpaperscissors.youWin') + ' ' + I18N.t('tools.rockpaperscissors.' + playerChoice).split(' ')[0] + ' 克 ' + I18N.t('tools.rockpaperscissors.' + computerChoice).split(' ')[0];
                        resultTextEl.className = 'result-text show win';
                        break;
                    case 'lose':
                        computerScore++;
                        resultMsg = '😢 ' + I18N.t('tools.rockpaperscissors.youLose') + ' ' + I18N.t('tools.rockpaperscissors.' + computerChoice).split(' ')[0] + ' 克 ' + I18N.t('tools.rockpaperscissors.' + playerChoice).split(' ')[0];
                        resultTextEl.className = 'result-text show lose';
                        break;
                    case 'draw':
                        drawScore++;
                        resultMsg = '🤝 ' + I18N.t('tools.rockpaperscissors.draw') + ' ' + I18N.t('tools.rockpaperscissors.' + playerChoice).split(' ')[0];
                        resultTextEl.className = 'result-text show draw';
                        break;
                }

                resultTextEl.textContent = resultMsg;
                playerScoreEl.textContent = playerScore;
                computerScoreEl.textContent = computerScore;
                drawScoreEl.textContent = drawScore;

                choiceBtns.forEach(btn => btn.disabled = false);
                isPlaying = false;
            }, 300);

        }, 1000);
    }

    function resetScores() {
        playerScore = 0;
        computerScore = 0;
        drawScore = 0;
        playerScoreEl.textContent = '0';
        computerScoreEl.textContent = '0';
        drawScoreEl.textContent = '0';
        playerHandEl.textContent = '❓';
        computerHandEl.textContent = '❓';
        resultTextEl.classList.remove('show', 'win', 'lose', 'draw');
        showToast(I18N.t('tools.rockpaperscissors.resetScore') + I18N.t('common.success'), 'info');
    }

    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => play(btn.dataset.choice));
    });

    resetBtn.addEventListener('click', resetScores);
})();
