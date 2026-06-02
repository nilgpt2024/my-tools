const CN_NUM_UPPER = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const CN_NUM_LOWER = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const CN_NUM_CAPITAL = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const CN_UNITS = ['', '拾', '佰', '仟'];
const CN_GROUP_UNITS = ['', '万', '亿', '兆'];
const CN_MONEY_UNITS = ['分', '角'];

const EXAMPLES = [
    { value: '2024', label: '整数' },
    { value: '3888.88', label: '小数' },
    { value: '150000000.00', label: '大额' },
    { value: '0', label: '零值' }
];

document.addEventListener('DOMContentLoaded', function() {
    const inputEl = document.getElementById('numberInput');

    inputEl.addEventListener('input', Utils.debounce(function() {
        if (document.getElementById('autoConvert').checked) {
            doConvert();
        }
    }, 300));

    inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            doConvert();
        }
    });

    doConvert();
});

function setExample(index) {
    const example = EXAMPLES[index];
    if (example) {
        document.getElementById('numberInput').value = example.value;
        doConvert();
    }
}

function doConvert() {
    const raw = document.getElementById('numberInput').value.trim();

    if (!raw) {
        showEmptyResult();
        return;
    }

    const num = parseFloat(raw.replace(/,/g, ''));

    if (isNaN(num)) {
        showErrorResult('请输入有效的数字');
        return;
    }

    if (!isFinite(num)) {
        showErrorResult('数字超出可处理范围');
        return;
    }

    const mode = document.getElementById('convertMode').value;

    let result;
    switch (mode) {
        case 'rmb':
            result = convertToRMB(num);
            break;
        case 'uppercase':
            result = convertToChineseUpper(num);
            break;
        case 'normal':
            result = convertToChineseNormal(num);
            break;
        case 'capital':
            result = convertToCapital(num);
            break;
        default:
            result = convertToRMB(num);
    }

    displayResult(result, num, raw);
}

function convertToRMB(num) {
    if (num === 0) return { full: '零元整', integer: '', decimal: '' };

    const absNum = Math.abs(num);
    const intPart = Math.floor(absNum);
    const decPart = Math.round((absNum - intPart) * 100);

    let intStr = '';
    if (intPart > 0) {
        intStr = numberToChinese(intPart, CN_NUM_UPPER, true);
        intStr += '元';
    } else {
        intStr = '零元';
    }

    let decStr = '';

    if (decPart > 0) {
        const jiao = Math.floor(decPart / 10);
        const fen = decPart % 10;

        if (jiao > 0) {
            decStr += CN_NUM_UPPER[jiao] + '角';
        }
        if (fen > 0) {
            decStr += CN_NUM_UPPER[fen] + '分';
        }
    } else {
        decStr = '整';
    }

    let prefix = num < 0 ? '负' : '';

    return {
        full: prefix + intStr + decStr,
        integer: prefix + intStr,
        decimal: decStr
    };
}

function convertToChineseUpper(num) {
    if (num === 0) return { full: '零', integer: '零', decimal: '' };

    const absNum = Math.abs(num);
    const intPart = Math.floor(absNum);
    const decPart = Math.round((absNum - intPart) * 10000);

    let result = numberToChinese(intPart, CN_NUM_UPPER, false);

    if (decPart > 0) {
        result += '点';
        const decStr = decPart.toString().padStart(4, '0');
        for (const ch of decStr) {
            result += CN_NUM_UPPER[parseInt(ch)];
        }
    }

    let prefix = num < 0 ? '负' : '';

    return {
        full: prefix + result,
        integer: prefix + numberToChinese(intPart, CN_NUM_UPPER, false),
        decimal: decPart > 0 ? ('点' + decPart.toString().padStart(4, '0').split('').map(c => CN_NUM_UPPER[parseInt(c)]).join('')) : ''
    };
}

function convertToChineseNormal(num) {
    if (num === 0) return { full: '零', integer: '零', decimal: '' };

    const absNum = Math.abs(num);
    const intPart = Math.floor(absNum);
    const decPart = Math.round((absNum - intPart) * 10000);

    let result = numberToChinese(intPart, CN_NUM_LOWER, false);

    if (decPart > 0) {
        result += '点';
        const decStr = decPart.toString().padStart(4, '0');
        for (const ch of decStr) {
            result += CN_NUM_LOWER[parseInt(ch)];
        }
    }

    let prefix = num < 0 ? '负' : '';

    return {
        full: prefix + result,
        integer: prefix + numberToChinese(intPart, CN_NUM_LOWER, false),
        decimal: decPart > 0 ? ('点' + decPart.toString().padStart(4, '0').split('').map(c => CN_NUM_LOWER[parseInt(c)]).join('')) : ''
    };
}

function convertToCapital(num) {
    if (num === 0) return { full: '零', integer: '零', decimal: '' };
    return convertToChineseUpper(num);
}

function numberToChinese(num, digitMap, isMoney) {
    if (num === 0) return digitMap[0];

    let result = '';
    let needZero = false;
    let groupIndex = 0;

    while (num > 0) {
        const group = num % 10000;
        num = Math.floor(num / 10000);

        if (group !== 0) {
            let groupStr = '';
            let subNeedZero = false;

            for (let i = 0; i < 4; i++) {
                const posValue = Math.pow(10, 3 - i);
                const digit = Math.floor(group / posValue) % 10;

                if (digit !== 0) {
                    if (subNeedZero) {
                        groupStr += digitMap[0];
                        subNeedZero = false;
                    }
                    groupStr += digitMap[digit] + CN_UNITS[3 - i];
                } else if (groupStr.length > 0) {
                    subNeedZero = true;
                }
            }

            if (needZero && result.length > 0) {
                result = digitMap[0] + result;
                needZero = false;
            }

            result = groupStr + CN_GROUP_UNITS[groupIndex] + result;
        } else if (result.length > 0) {
            needZero = true;
        }

        groupIndex++;
    }

    if (isMoney) {
        result = result.replace(/零+$/, '');
    }

    return result || digitMap[0];
}

function formatNumber(num) {
    const parts = num.toFixed(2).split('.');
    parts[0] = parseInt(parts[0]).toLocaleString('en-US');
    return parts.join('.');
}

function displayResult(result, num, raw) {
    document.getElementById('resultValue').textContent = result.full;
    document.getElementById('originalNum').textContent = formatNumber(Math.abs(num));
    document.getElementById('integerPart').textContent = result.integer || '-';
    document.getElementById('decimalPart').textContent = result.decimal || '-';
    document.getElementById('charCount').textContent = `${result.full.length} 字符`;

    const mainCard = document.getElementById('mainResult');
    mainCard.style.animation = 'none';
    mainCard.offsetHeight;
    mainCard.style.animation = 'pulse 0.3s ease';
}

function showEmptyResult() {
    document.getElementById('resultValue').textContent = '请输入需要转换的数字';
    document.getElementById('resultValue').style.color = 'var(--text-light)';
    document.getElementById('originalNum').textContent = '-';
    document.getElementById('integerPart').textContent = '-';
    document.getElementById('decimalPart').textContent = '-';
    document.getElementById('charCount').textContent = '- 字符';
}

function showErrorResult(msg) {
    document.getElementById('resultValue').textContent = msg;
    document.getElementById('resultValue').style.color = '#f56c6c';
    showToast(msg, 'error');
}

function clearAll() {
    document.getElementById('numberInput').value = '';
    showEmptyResult();
    showToast(I18N.t('common.clear'), 'info');
}

function copyResult() {
    const text = document.getElementById('resultValue').textContent;
    if (!text || text.includes('请输入') || text.includes('错误')) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }
    copyToClipboard(text, I18N.t('common.copied'));
}
