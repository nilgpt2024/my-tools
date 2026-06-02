(function() {
    const originalEl = document.getElementById('originalText');
    const modifiedEl = document.getElementById('modifiedText');
    const compareBtn = document.getElementById('compareBtn');
    const diffOutput = document.getElementById('diffOutput');
    const statsDisplay = document.getElementById('statsDisplay');

    function computeDiff(originalLines, modifiedLines) {
        const m = originalLines.length;
        const n = modifiedLines.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

        for (let i = 1; i <= m; i++) dp[i][0] = i;
        for (let j = 1; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (originalLines[i - 1] === modifiedLines[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j - 1] + 1
                    );
                }
            }
        }

        const result = [];
        let i = m, j = n;

        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
                result.unshift({ type: 'equal', line: originalLines[i - 1], origNum: i, modNum: j });
                i--; j--;
            } else if (j > 0 && (i === 0 || dp[i][j - 1] <= dp[i - 1][j])) {
                result.unshift({ type: 'added', line: modifiedLines[j - 1], origNum: null, modNum: j });
                j--;
            } else if (i > 0) {
                result.unshift({ type: 'removed', line: originalLines[i - 1], origNum: i, modNum: null });
                i--;
            }
        }

        return result;
    }

    function compare() {
        const orig = originalEl.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
        const mod = modifiedEl.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

        let addedCount = 0, removedCount = 0, sameCount = 0;

        const diff = computeDiff(orig, mod);

        if (diff.length === 0) {
            diffOutput.innerHTML = '<div class="empty-result">' + I18N.t('tools.diff.empty') + '</div>';
            statsDisplay.innerHTML = '';
            return;
        }

        let html = '';
        diff.forEach(item => {
            switch (item.type) {
                case 'added':
                    addedCount++;
                    html += `<div class="diff-line added"><span class="line-num">${item.modNum || ''}</span><span class="line-prefix add">+</span><span class="line-content">${Utils.escapeHtml(item.line)}</span></div>`;
                    break;
                case 'removed':
                    removedCount++;
                    html += `<div class="diff-line removed"><span class="line-num">${item.origNum || ''}</span><span class="line-prefix remove">-</span><span class="line-content">${Utils.escapeHtml(item.line)}</span></div>`;
                    break;
                case 'equal':
                    sameCount++;
                    html += `<div class="diff-line same"><span class="line-num">${item.origNum || ''}</span><span class="line-prefix equal"> </span><span class="line-content">${Utils.escapeHtml(item.line)}</span></div>`;
                    break;
            }
        });

        diffOutput.innerHTML = html;
        statsDisplay.innerHTML =
            `<span class="stat-badge same">相同 ${sameCount} 行</span>` +
            `<span class="stat-badge removed">删除 ${removedCount} 行</span>` +
            `<span class="stat-badge added">新增 ${addedCount} 行</span>`;
    }

    compareBtn.addEventListener('click', compare);

    document.querySelectorAll('.clear-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target === 'original' ? originalEl : modifiedEl;
            targetId.value = '';
        });
    });

    originalEl.value = `function greet(name) {\n    console.log("Hello " + name);\n}\n\ngreet("World");`;
    modifiedEl.value = `function greet(name) {\n    console.log("Hello " + name + "!");\n    console.log("Welcome!");\n}\n\ngreet("World");\ngreet("User");`;
})();
