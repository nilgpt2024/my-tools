(function() {
    let currentInput = '';
    let expression = '';
    let shouldReset = false;

    const BASIC_BUTTONS = [
        ['C', 'clear', 'btn-clear'], ['(', '(', 'btn-func'], [')', ')', 'btn-func'], ['DEL', 'del', 'btn-func'], ['/', '/', 'btn-op'],
        ['7', '7', 'btn-num'], ['8', '8', 'btn-num'], ['9', '9', 'btn-num'], ['*', '*', 'btn-op'], ['-', '-', 'btn-op'],
        ['4', '4', 'btn-num'], ['5', '5', 'btn-num'], ['6', '6', 'btn-op'], ['+', '+', 'btn-op'],
        ['1', '1', 'btn-num'], ['2', '2', 'btn-num'], ['3', '3', 'btn-num'], ['=', '=', 'btn-eq'],
        ['0', '0', 'btn-num btn-zero'], ['.', '.', 'btn-num']
    ];

    const SCI_BUTTONS = [
        ['C', 'clear', 'btn-clear'], ['sin', 'sin', 'btn-func'], ['cos', 'cos', 'btn-func'], ['tan', 'tan', 'btn-func'], ['DEL', 'del', 'btn-func'],
        ['log', 'log', 'btn-func'], ['ln', 'ln', 'btn-func'], ['^', '^', 'btn-op'], ['√', 'sqrt', 'btn-func'], ['/', '/', 'btn-op'],
        ['π', 'pi', 'btn-func'], ['7', '7', 'btn-num'], ['8', '8', 'btn-num'], ['9', '9', 'btn-num'], ['*', '*', 'btn-op'],
        ['e', 'e', 'btn-func'], ['4', '4', 'btn-num'], ['5', '5', 'btn-num'], ['6', '6', 'btn-num'], ['-', '-', 'btn-op'],
        ['!', 'fact', 'btn-func'], ['1', '1', 'btn-num'], ['2', '2', 'btn-num'], ['3', '3', 'btn-num'], ['+', '+', 'btn-op'],
        ['%', '%', 'btn-func'], ['0', '0', 'btn-num btn-zero'], ['.', '.', 'btn-num'], ['=', '=', 'btn-eq']
    ];

    const resultEl = document.getElementById('result');
    const expressionEl = document.getElementById('expression');
    const calcGridEl = document.getElementById('calcGrid');
    const modeBtns = document.querySelectorAll('.mode-btn');

    function renderGrid(buttons) {
        calcGridEl.innerHTML = buttons.map(([label, action, cls]) =>
            `<button class="calc-btn ${cls}" data-action="${action}">${label}</button>`
        ).join('');

        calcGridEl.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => handleAction(btn.dataset.action));
        });
    }

    function updateDisplay() {
        if (currentInput === '' || currentInput === '-') {
            resultEl.textContent = '0';
        } else {
            try {
                const formatted = formatNumber(currentInput);
                resultEl.textContent = formatted;
            } catch (e) {
                resultEl.textContent = currentInput;
            }
        }
        expressionEl.textContent = expression || '';
    }

    function formatNumber(numStr) {
        const num = parseFloat(numStr);
        if (isNaN(num)) return numStr;
        if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-8 && num !== 0)) {
            return num.toExponential(6);
        }
        return num.toLocaleString('en-US', { maximumFractionDigits: 10 });
    }

    function handleAction(action) {
        switch (action) {
            case 'C':
                currentInput = '';
                expression = '';
                shouldReset = false;
                break;
            case 'DEL':
                if (currentInput.length > 0) {
                    currentInput = currentInput.slice(0, -1);
                }
                break;
            case '=':
                calculate();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
            case '^':
            case '(':
            case ')':
            case '.':
                appendChar(action);
                break;
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                if (shouldReset) { currentInput = ''; shouldReset = false; }
                currentInput += action;
                break;
            case 'sin':
                wrapFunc('sin');
                break;
            case 'cos':
                wrapFunc('cos');
                break;
            case 'tan':
                wrapFunc('tan');
                break;
            case 'log':
                wrapFunc('log10');
                break;
            case 'ln':
                wrapFunc('log');
                break;
            case 'sqrt':
                wrapFunc('sqrt');
                break;
            case 'pi':
                if (shouldReset) { currentInput = ''; shouldReset = false; }
                currentInput += Math.PI.toString();
                break;
            case 'e':
                if (shouldReset) { currentInput = ''; shouldReset = false; }
                currentInput += Math.E.toString();
                break;
            case 'fact':
                factorial();
                return;
            case '%':
                percent();
                break;
        }
        updateDisplay();
    }

    function appendChar(char) {
        if (shouldReset) { currentInput = ''; shouldReset = false; }
        currentInput += char;
    }

    function wrapFunc(funcName) {
        expression = currentInput;
        currentInput = funcName + '(' + currentInput + ')';
        shouldReset = true;
    }

    function calculate() {
        if (!currentInput) return;
        expression = currentInput + ' =';

        try {
            let evalExpr = currentInput
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\^/g, '**')
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/log10/g, 'Math.log10')
                .replace(/ln/g, 'Math.log')
                .replace(/√/g, 'Math.sqrt')
                .replace(/π/g, '(' + Math.PI + ')')
                .replace(/e(?![a-z])/g, '(' + Math.E + ')');

            const result = Function('"use strict"; return (' + evalExpr + ')')();

            if (!isFinite(result)) throw new Error('Invalid');

            currentInput = String(result);
            shouldReset = true;
        } catch (e) {
            currentInput = 'Error';
            shouldReset = true;
        }
        updateDisplay();
    }

    function factorial() {
        const n = parseInt(currentInput);
        if (isNaN(n) || n < 0 || n > 170) {
            currentInput = 'Error';
            shouldReset = true;
            updateDisplay();
            return;
        }
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        expression = n + '! =';
        currentInput = String(result);
        shouldReset = true;
        updateDisplay();
    }

    function percent() {
        const val = parseFloat(currentInput);
        if (!isNaN(val)) {
            expression = currentInput + '% =';
            currentInput = String(val / 100);
            shouldReset = true;
        }
        updateDisplay();
    }

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid(btn.dataset.mode === 'scientific' ? SCI_BUTTONS : BASIC_BUTTONS);
        });
    });

    document.addEventListener('keydown', e => {
        const keyMap = {
            'Enter': '=', 'Escape': 'C', 'Backspace': 'DEL',
            '+': '+', '-': '-', '*': '*', '/': '/',
            '.': '.', '(': '(', ')': ')',
            '^': '^', '%': '%'
        };

        if (keyMap[e.key]) {
            e.preventDefault();
            handleAction(keyMap[e.key]);
        } else if (/^[0-9]$/.test(e.key)) {
            handleAction(e.key);
        }
    });

    renderGrid(BASIC_BUTTONS);
})();
