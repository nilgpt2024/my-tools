const MORSE_CODE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-',
    '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
};

const REVERSE_MORSE = {};
for (const [char, code] of Object.entries(MORSE_CODE)) {
    REVERSE_MORSE[code] = char;
}

const PINYIN_MAP = {
    'a': 'A', 'ai': 'AI', 'an': 'AN', 'ang': 'ANG', 'ao': 'AO',
    'ba': 'BA', 'bai': 'BAN', 'ban': 'BANG', 'bang': 'BAO', 'bao': 'BEI', 'bei': 'BEN', 'ben': 'BENG', 'beng': 'BI', 'bi': 'BIAN', 'bian': 'BIAO', 'biao': 'BIE', 'bie': 'BIN', 'bin': 'BING', 'bing': 'BO', 'bo': 'BU', 'bu': 'CAI',
    'ca': 'CAI', 'cai': 'CAN', 'can': 'CANG', 'cang': 'CAO', 'cao': 'CE', 'ce': 'CEN', 'cen': 'CENG', 'ceng': 'CHA', 'cha': 'CHAI', 'chai': 'CHAN', 'chan': 'CHANG', 'chang': 'CHAO', 'chao': 'CHE', 'che': 'CHEN', 'chen': 'CHENG', 'cheng': 'CHI', 'chi': 'CHONG', 'chong': 'CHOU', 'chou': 'CHU', 'chu': 'CHUA', 'chua': 'CHUAI', 'chuai': 'CHUAN', 'chuan': 'CHUANG', 'chuang': 'CHUI', 'chui': 'CHUN', 'chun': 'CHUO', 'chuo': 'CI', 'ci': 'CONG', 'cong': 'COU', 'cou': 'CU', 'cu': 'CUAN', 'cuan': 'CUI', 'cui': 'CUN', 'cun': 'CUO', 'cuo': 'DA',
    'da': 'DAI', 'dai': 'DAN', 'dan': 'DANG', 'dang': 'DAO', 'dao': 'DE', 'de': 'DEI', 'dei': 'DEN', 'den': 'DENG', 'deng': 'DI', 'di': 'DIA', 'dia': 'DIAN', 'dian': 'DIAO', 'diao': 'DIE', 'die': 'DING', 'ding': 'DIU', 'diu': 'DONG', 'dong': 'DOU', 'dou': 'DU', 'du': 'DUAN', 'duan': 'DUI', 'dui': 'DUN', 'dun': 'DUO', 'duo': 'E',
    'e': 'EI', 'ei': 'EN', 'en': 'ENG', 'eng': 'ER', 'er': 'FA',
    'fa': 'FAN', 'fan': 'FANG', 'fang': 'FEI', 'fei': 'FEN', 'fen': 'FENG', 'feng': 'FO', 'fo': 'FOU', 'fou': 'FU', 'fu': 'GA',
    'ga': 'GAI', 'gai': 'GAN', 'gan': 'GANG', 'gang': 'GAO', 'gao': 'GE', 'ge': 'GEI', 'gei': 'GEN', 'gen': 'GENG', 'geng': 'GONG', 'gong': 'GOU', 'gou': 'GU', 'gu': 'GUA', 'gua': 'GUAI', 'guai': 'GUAN', 'guan': 'GUANG', 'guang': 'GUI', 'gui': 'GUN', 'gun': 'GUO', 'guo': 'HA',
    'ha': 'HAI', 'hai': 'HAN', 'han': 'HANG', 'hang': 'HAO', 'hao': 'HE', 'he': 'HEI', 'hei': 'HEN', 'hen': 'HENG', 'heng': 'HONG', 'hong': 'HOU', 'hou': 'HU', 'hu': 'HUA', 'hua': 'HUAI', 'huai': 'HUAN', 'huan': 'HUANG', 'huang': 'HUI', 'hui': 'HUN', 'hun': 'HUO', 'huo': 'JI',
    'ji': 'JIA', 'jia': 'JIAN', 'jian': 'JIANG', 'jiang': 'JIAO', 'jiao': 'JIE', 'jie': 'JIN', 'jin': 'JING', 'jing': 'JIONG', 'jiong': 'JIU', 'jiu': 'JU', 'ju': 'JUAN', 'juan': 'JUE', 'jue': 'JUN', 'jun': 'KA',
    'ka': 'KAI', 'kai': 'KAN', 'kan': 'KANG', 'kang': 'KAO', 'kao': 'KE', 'ke': 'KEN', 'ken': 'KENG', 'keng': 'KONG', 'kong': 'KOU', 'kou': 'KU', 'ku': 'KUA', 'kua': 'KUAI', 'kuai': 'KUAN', 'kuan': 'KUANG', 'kuang': 'KUI', 'kui': 'KUN', 'kun': 'KUO', 'kuo': 'LA',
    'la': 'LAI', 'lai': 'LAN', 'lan': 'LANG', 'lang': 'LAO', 'lao': 'LE', 'le': 'LEI', 'lei': 'LENG', 'leng': 'LI', 'li': 'LIA', 'lia': 'LIAN', 'lian': 'LIANG', 'liang': 'LIAO', 'liao': 'LIE', 'lie': 'LIN', 'lin': 'LING', 'ling': 'LIU', 'liu': 'LO', 'lo': 'LONG', 'long': 'LOU', 'lou': 'LU', 'lu': 'LV', 'lv': 'LUAN', 'luan': 'LUE', 'lue': 'LUN', 'lun': 'LUO', 'luo': 'MA',
    'ma': 'MAI', 'mai': 'MAN', 'man': 'MANG', 'mang': 'MAO', 'mao': 'ME', 'me': 'MEI', 'mei': 'MEN', 'men': 'MENG', 'meng': 'MI', 'mi': 'MIAN', 'mian': 'MIAO', 'miao': 'MIE', 'mie': 'MIN', 'min': 'MING', 'ming': 'MIU', 'miu': 'MO', 'mo': 'MOU', 'mou': 'MU', 'mu': 'NA',
    'na': 'NAI', 'nai': 'NAN', 'nan': 'NANG', 'nang': 'NAO', 'nao': 'NE', 'ne': 'NEI', 'nei': 'NEN', 'nen': 'NENG', 'neng': 'NI', 'ni': 'NIAN', 'nian': 'NIANG', 'niang': 'NIAO', 'niao': 'NIE', 'nie': 'NIN', 'nin': 'NING', 'ning': 'NIU', 'niu': 'NONG', 'nong': 'NOU', 'nou': 'NU', 'nu': 'NUAN', 'nuan': 'NUE', 'nue': 'NUO', 'nuo': 'O',
    'o': 'OU', 'ou': 'PA',
    'pa': 'PAI', 'pai': 'PAN', 'pan': 'PANG', 'pang': 'PAO', 'pao': 'PEI', 'pei': 'PEN', 'pen': 'PENG', 'peng': 'PI', 'pi': 'PIAN', 'pian': 'PIAO', 'piao': 'PIE', 'pie': 'PIN', 'pin': 'PING', 'ping': 'PO', 'po': 'POU', 'pou': 'PU', 'pu': 'QI',
    'qi': 'QIA', 'qia': 'QIAN', 'qian': 'QIANG', 'qiang': 'QIAO', 'qiao': 'QIE', 'qie': 'QIN', 'qin': 'QING', 'qing': 'QIONG', 'qiong': 'QIU', 'qiu': 'QU', 'qu': 'QUAN', 'quan': 'QUE', 'que': 'QUN', 'qun': 'RA',
    'ra': 'RAN', 'ran': 'RANG', 'rang': 'RAO', 'rao': 'RE', 're': 'REN', 'ren': 'RENG', 'reng': 'RI', 'ri': 'RONG', 'rong': 'ROU', 'rou': 'RU', 'ru': 'RUA', 'rua': 'RUAN', 'ruan': 'RUI', 'rui': 'RUN', 'run': 'RUO', 'ruo': 'SA',
    'sa': 'SAI', 'sai': 'SAN', 'san': 'SANG', 'sang': 'SAO', 'sao': 'SE', 'se': 'SEN', 'sen': 'SENG', 'seng': 'SHA', 'sha': 'SHAI', 'shai': 'SHAN', 'shan': 'SHANG', 'shang': 'SHAO', 'shao': 'SHE', 'she': 'SHEI', 'shei': 'SHEN', 'shen': 'SHENG', 'sheng': 'SHI', 'shi': 'SHOU', 'shou': 'SHU', 'shu': 'SHUA', 'shua': 'SHUAI', 'shuai': 'SHUAN', 'shuan': 'SHUANG', 'shuang': 'SHUI', 'shui': 'SHUN', 'shun': 'SHUO', 'shuo': 'SI',
    'si': 'SONG', 'song': 'SOU', 'sou': 'SU', 'su': 'SUAN', 'suan': 'SUI', 'sui': 'SUN', 'sun': 'SUO', 'suo': 'TA',
    'ta': 'TAI', 'tai': 'TAN', 'tan': 'TANG', 'tang': 'TAO', 'tao': 'TE', 'te': 'TENG', 'teng': 'TI', 'ti': 'TIAN', 'tian': 'TIAO', 'tiao': 'TIE', 'tie': 'TING', 'ting': 'TONG', 'tong': 'TOU', 'tou': 'TU', 'tu': 'TUAN', 'tuan': 'TUI', 'tui': 'TUN', 'tun': 'TUO', 'tuo': 'WA',
    'wa': 'WAI', 'wai': 'WAN', 'wan': 'WANG', 'wang': 'WEI', 'wei': 'WEN', 'wen': 'WENG', 'weng': 'WO', 'wo': 'WU', 'wu': 'XI',
    'xi': 'XIA', 'xia': 'XIAN', 'xian': 'XIANG', 'xiang': 'XIAO', 'xiao': 'XIE', 'xie': 'XIN', 'xin': 'XING', 'xing': 'XIONG', 'xiong': 'XIU', 'xiu': 'XU', 'xu': 'XUAN', 'xuan': 'XUE', 'xue': 'XUN', 'xun': 'YA',
    'ya': 'YAI', 'yai': 'YAN', 'yan': 'YANG', 'yang': 'YAO', 'yao': 'YE', 'ye': 'YI', 'yi': 'YIAN', 'yian': 'YIN', 'yin': 'YING', 'ying': 'YO', 'yo': 'YONG', 'yong': 'YOU', 'you': 'YU', 'yu': 'YUAN', 'yuan': 'YUE', 'yue': 'YUN', 'yun': 'ZA',
    'za': 'ZAI', 'zai': 'ZAN', 'zan': 'ZANG', 'zang': 'ZAO', 'zao': 'ZE', 'ze': 'ZEI', 'zei': 'ZEN', 'zen': 'ZENG', 'zeng': 'ZHA', 'zha': 'ZHAI', 'zhai': 'ZHAN', 'zhan': 'ZHANG', 'zhang': 'ZHAO', 'zhao': 'ZHE', 'zhe': 'ZHEI', 'zhei': 'ZHEN', 'zhen': 'ZHENG', 'zheng': 'ZHI', 'zhi': 'ZHONG', 'zhong': 'ZHOU', 'zhou': 'ZHU', 'zhu': 'ZHUA', 'zhua': 'ZHUAI', 'zhuai': 'ZHUAN', 'zhuan': 'ZHUANG', 'zhuang': 'ZHUI', 'zhui': 'ZHUN', 'zhun': 'ZHUO', 'zhuo': 'ZI',
    'zi': 'ZONG', 'zong': 'ZOU', 'zou': 'ZU', 'zu': 'ZUAN', 'zuan': 'ZUI', 'zui': 'ZUN', 'zun': 'ZUO', 'zuo': ''
};

let audioContext = null;
let isPlaying = false;
let audioTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    renderReferenceTable();

    const encodeInput = document.getElementById('encodeInput');
    if (encodeInput) {
        encodeInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                doEncode();
            }
        });
    }

    const decodeInput = document.getElementById('decodeInput');
    if (decodeInput) {
        decodeInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                doDecode();
            }
        });
    }
});

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');

    if (tabId === 'reference' && !document.getElementById('alphaGrid').innerHTML) {
        renderReferenceTable();
    }

    stopAudio();
}

function doEncode() {
    const input = document.getElementById('encodeInput').value;
    if (!input.trim()) {
        showToast('请输入要编码的文字', 'error');
        return;
    }

    const separator = document.getElementById('separatorSelect').value;
    const toUpper = document.getElementById('uppercaseCheck').checked;
    const showChinese = document.getElementById('showChineseCheck').checked;

    let result = '';

    for (const char of input) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
            if (showChinese) {
                result += `[${char}] `;
            }
            continue;
        }

        let processedChar = char;

        if (toUpper && /[a-z]/.test(char)) {
            processedChar = char.toUpperCase();
        }

        if (MORSE_CODE[processedChar]) {
            result += MORSE_CODE[processedChar];
            if (separator && char !== ' ') result += separator;
        } else if (char === ' ' || char === '\n') {
            result += char;
        } else {
            result += char;
        }
    }

    document.getElementById('encodeOutput').value = result.trim();
    showToast(`${I18N.t('common.success')}！`, 'success');
}

function doDecode() {
    const input = document.getElementById('decodeInput').value.trim();
    if (!input) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }

    const sepMode = document.getElementById('decodeSeparator').value;
    let tokens;

    if (sepMode === 'auto') {
        let normalized = input.replace(/[|\/]/g, ' ');
        tokens = normalized.split(/\s+/).filter(t => t.length > 0);
    } else if (sepMode === '') {
        tokens = [input];
    } else {
        tokens = input.split(sepMode).filter(t => t.trim());
    }

    let result = '';
    for (const token of tokens) {
        const cleanToken = token.trim();
        if (REVERSE_MORSE[cleanToken]) {
            result += REVERSE_MORSE[cleanToken];
        } else if (cleanToken === '/' || cleanToken === '') {
            result += ' ';
        } else {
            result += `【?${cleanToken}】`;
        }
    }

    document.getElementById('decodeOutput').value = result;
    showToast('解码完成！', 'success');
}

function playMorseAudio() {
    const morseText = document.getElementById('encodeOutput').value.trim();
    if (!morseText) {
        showToast('请先进行编码操作', 'error');
        return;
    }

    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        showToast('您的浏览器不支持音频播放', 'error');
        return;
    }

    isPlaying = true;
    document.getElementById('audioStatus').style.display = 'block';
    document.getElementById('playBtn').textContent = '⏸ 暂停';

    const dotDuration = 100;
    const dashDuration = 300;
    const symbolGap = 100;
    const letterGap = 300;
    const wordGap = 700;

    const symbols = morseText.split('');
    let currentTime = 0;
    const timeline = [];

    symbols.forEach((sym, i) => {
        if (sym === '.') {
            timeline.push({ time: currentTime, type: 'dot' });
            currentTime += dotDuration + symbolGap;
        } else if (sym === '-') {
            timeline.push({ time: currentTime, type: 'dash' });
            currentTime += dashDuration + symbolGap;
        } else if (sym === '/') {
            currentTime += wordGap - symbolGap;
        } else if (sym === ' ') {
            currentTime += letterGap - symbolGap;
        }
    });

    const totalDuration = currentTime;

    timeline.forEach(item => {
        setTimeout(() => {
            if (!isPlaying) return;
            playTone(item.type === 'dot' ? dotDuration : dashDuration);

            const progress = ((item.time + (item.type === 'dot' ? dotDuration : dashDuration)) / totalDuration * 100);
            document.getElementById('audioProgress').style.width = Math.min(progress, 100) + '%';
        }, item.time);
    });

    audioTimer = setTimeout(() => {
        stopAudio();
        showToast(I18N.t('common.success'), 'success');
    }, totalDuration + 500);
}

function playTone(duration) {
    if (!audioContext || !isPlaying) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function stopAudio() {
    isPlaying = false;
    if (audioTimer) {
        clearTimeout(audioTimer);
        audioTimer = null;
    }
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    document.getElementById('audioStatus').style.display = 'none';
    document.getElementById('playBtn').textContent = '▶ 播放';
    document.getElementById('audioProgress').style.width = '0%';
}

function renderReferenceTable() {
    const alphaGrid = document.getElementById('alphaGrid');
    const numGrid = document.getElementById('numGrid');
    const punctGrid = document.getElementById('punctGrid');

    if (!alphaGrid || alphaGrid.innerHTML) return;

    let alphaHtml = '', numHtml = '', punctHtml = '';

    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        alphaHtml += createMorseItem(char, MORSE_CODE[char]);
    }

    for (let i = 0; i <= 9; i++) {
        numHtml += createMorseItem(String(i), MORSE_CODE[String(i)]);
    }

    const puncList = [
        ['.', '.-.-.-'], [',', '--..--'], ['?', '..--..'], ["'", '.----.'],
        ['!', '-.-.--'], ['/', '-..-.'], ['(', '-.--.'], [')', '-.--.-'],
        ['&', '.-...'], [':', '---...'], [';', '-.-.-.'], ['=', '-...-'],
        ['+', '.-.-.'], ['-', '-....-'], ['_', '..--.-'], ['"', '.-..-.'],
        ['$', '...-..-'], ['@', '.--.-.']
    ];

    puncList.forEach(([char, code]) => {
        punctHtml += createMorseItem(Utils.escapeHtml(char), code);
    });

    alphaGrid.innerHTML = alphaHtml;
    numGrid.innerHTML = numHtml;
    punctGrid.innerHTML = punctHtml;
}

function createMorseItem(char, code) {
    return `
        <div class="morse-item">
            <span class="morse-char">${char}</span>
            <span class="morse-code">${code}</span>
        </div>
    `;
}

function clearEncodeInput() {
    document.getElementById('encodeInput').value = '';
    document.getElementById('encodeOutput').value = '';
    stopAudio();
    showToast(I18N.t('common.clear'), 'info');
}

function clearEncodeAll() {
    clearEncodeInput();
}

function clearDecodeInput() {
    document.getElementById('decodeInput').value = '';
    document.getElementById('decodeOutput').value = '';
    showToast(I18N.t('common.clear'), 'info');
}

function clearDecodeAll() {
    clearDecodeInput();
}

async function pasteText() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('encodeInput').value = text;
        showToast(I18N.t('common.success'), 'success');
    } catch (err) {
        showToast(I18N.t('common.error'), 'error');
    }
}

async function pasteDecodeText() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('decodeInput').value = text;
        showToast(I18N.t('common.success'), 'success');
    } catch (err) {
        showToast(I18N.t('common.error'), 'error');
    }
}

function copyEncoded() {
    const text = document.getElementById('encodeOutput').value;
    if (!text) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }
    copyToClipboard(text, I18N.t('common.copied'));
}

function copyDecoded() {
    const text = document.getElementById('decodeOutput').value;
    if (!text) {
        showToast(I18N.t('common.error'), 'error');
        return;
    }
    copyToClipboard(text, I18N.t('common.copied'));
}
