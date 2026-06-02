let chart = null;
let currentColorScheme = 'random';

const colorSchemes = {
    random: () => `rgb(${Math.floor(Math.random()*200)}, ${Math.floor(Math.random()*200)}, ${Math.floor(Math.random()*200)})`,
    blue: () => ['#409EFF', '#66B1FF', '#79BBFF', '#8CC5FF', '#A0CFFF', '#B3D8FF', '#C6E2FF', '#D9ECFF', '#ECF5FF'][Math.floor(Math.random() * 9)],
    warm: () => ['#FF6B6B', '#FF8E53', '#FFE66D', '#F7DC6F', '#F9CA24'][Math.floor(Math.random() * 5)],
    cool: () => ['#00D2FF', '#3A7BD5', '#667eea', '#764ba2', '#11998e'][Math.floor(Math.random() * 5)],
    gradient: (index, total) => {
        const hue = (index / total) * 360;
        return `hsl(${hue}, 70%, 55%)`;
    },
    nature: () => ['#27AE60', '#2ECC71', '#1ABC9C', '#16A085', '#3498DB', '#2980B9'][Math.floor(Math.random() * 6)]
};

document.addEventListener('DOMContentLoaded', function() {
    chart = echarts.init(document.getElementById('chartContainer'));
    updateWordCloud();

    window.addEventListener('resize', () => { if (chart) chart.resize(); });
});

function toggleInputMode() {
    const mode = document.getElementById('inputMode').value;
    const label = document.getElementById('dataLabel');
    const textarea = document.getElementById('wordData');

    switch(mode) {
        case 'text':
            label.textContent = '输入文本（将自动分词）：';
            textarea.placeholder = '在此输入任意文本，系统会自动分析词频...';
            break;
        case 'weighted':
            label.textContent = '带权重的词语（每行一个，格式：词语:数值）：';
            textarea.placeholder = 'JavaScript:100\nPython:95\nJava:88\n...';
            break;
        case 'json':
            label.textContent = 'JSON 数据（数组格式 [{name:"词",value:数值}]）：';
            textarea.placeholder = '[{"name":"JavaScript","value":100}, ...]';
            break;
    }
}

function parseWordData(text) {
    const mode = document.getElementById('inputMode').value;

    if (mode === 'json') {
        try { return JSON.parse(text); } catch(e) { return []; }
    }

    if (mode === 'weighted') {
        return text.trim().split('\n')
            .map(line => {
                const parts = line.split(/[:：]/);
                if (parts.length >= 2) {
                    const name = parts[0].trim();
                    const value = parseFloat(parts.slice(1).join(':').trim());
                    if (name && !isNaN(value) && value > 0) return { name, value };
                }
                return null;
            })
            .filter(item => item !== null);
    }

    // Text mode - simple word frequency
    const words = text.toLowerCase()
        .replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 1);

    const freqMap = {};
    words.forEach(word => freqMap[word] = (freqMap[word] || 0) + 1);

    return Object.entries(freqMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 150);
}

function updateWordCloud() {
    if (!chart) return;

    const shape = document.getElementById('shape').value;
    currentColorScheme = document.getElementById('colorScheme').value;
    const minSize = parseInt(document.getElementById('minSize').value);
    const maxSize = parseInt(document.getElementById('maxSize').value);
    const rotateText = document.getElementById('rotateText').checked;
    const drawOut = document.getElementById('drawOutOfBound').checked;

    const rawData = parseWordData(document.getElementById('wordData').value);

    if (rawData.length === 0) {
        chart.clear();
        chart.setOption({ title: { text: '请输入有效数据', left: 'center', top: 'center', textStyle: { color: '#999' } } });
        return;
    }

    let colorFunc;
    if (currentColorScheme === 'gradient') {
        colorFunc = (params) => colorSchemes.gradient(params.dataIndex, rawData.length);
    } else {
        colorFunc = () => colorSchemes[currentColorScheme]();
    }

    const option = {
        tooltip: { show: true, formatter: function(p) { return `${p.name}: ${p.value}`; } },
        series: [{
            type: 'wordCloud',
            shape,
            left: 'center',
            top: 'center',
            width: '90%',
            height: '90%',
            sizeRange: [minSize, maxSize],
            rotationRange: rotateText ? [-45, 45] : [0, 0],
            rotationStep: rotateText ? 45 : 0,
            gridSize: 8,
            drawOutOfBound: drawOut,
            layoutAnimation: true,
            textStyle: {
                fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
                fontWeight: 'bold',
                color: colorFunc
            },
            emphasis: {
                focus: 'self',
                textStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' }
            },
            data: rawData.map(item => ({ name: item.name, value: item.value }))
        }]
    };

    chart.setOption(option, true);
}

function shuffleColors() {
    updateWordCloud();
}

function downloadWordCloud() {
    if (!chart) return;
    const url = chart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wordcloud.png';
    a.click();
    showToast(I18N.t('tools.wordcloud.generate').replace('生成词云', '') + I18N.t('common.download') + I18N.t('common.success'), 'success');
}

function loadSampleText() {
    document.getElementById('inputMode').value = 'text';
    toggleInputMode();
    document.getElementById('wordData').value = `人工智能正在改变我们的生活方式。从智能手机到自动驾驶汽车，从医疗诊断到金融科技，AI技术已经渗透到各个领域。
机器学习和深度学习是人工智能的核心技术。神经网络、自然语言处理、计算机视觉等技术不断突破。
云计算和大数据为AI提供了强大的算力支撑。TensorFlow、PyTorch、Keras等框架让开发变得更加便捷。
前端开发也在不断演进，Vue、React、Angular三大框架各具特色。TypeScript的普及提升了代码质量。
后端技术方面，Node.js、Go、Rust等语言展现出强大的性能优势。微服务架构成为主流选择。
DevOps文化推动了持续集成和持续部署的发展。Docker和Kubernetes改变了应用部署的方式。
网络安全日益重要，数据隐私保护受到广泛关注。区块链技术为去中心化提供了新的可能。
物联网连接了数十亿设备，5G网络为万物互联提供了基础设施。边缘计算正在兴起。
可持续发展成为全球共识，绿色技术和清洁能源备受关注。碳中和目标推动着技术创新。`;
    updateWordCloud();
}

function loadPreset(type) {
    document.getElementById('inputMode').value = 'weighted';
    toggleInputMode();

    if (type === 'tech') {
        document.getElementById('wordData').value = `JavaScript:100
Python:95
TypeScript:85
React:80
Vue.js:78
Node.js:75
AI:98
机器学习:92
深度学习:88
GPT:94
大语言模型:86
云计算:72
Docker:68
Kubernetes:64
Rust:60
Go:65
微服务:58
API:70
数据库:66
前端:82
后端:74
全栈:56
开源:54
Linux:52`;
    } else if (type === 'emotion') {
        document.getElementById('wordData').value = `快乐:100
幸福:95
爱:98
希望:90
梦想:87
勇气:84
感恩:88
和平:82
友谊:79
温暖:85
微笑:91
拥抱:83
信任:76
理解:78
宽容:72
善良:86
真诚:80
智慧:74
成长:81
自由:77`;
    }
    updateWordCloud();
}
