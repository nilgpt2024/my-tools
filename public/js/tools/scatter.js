let chart = null;

document.addEventListener('DOMContentLoaded', function() {
    chart = echarts.init(document.getElementById('chartContainer'));
    updateChart();

    window.addEventListener('resize', () => { if (chart) chart.resize(); });
});

function parseScatterData(text) {
    return text.trim().split('\n').map(line => {
        const parts = line.split(',').map(s => parseFloat(s.trim()));
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return [parts[0], parts[1], parts.length > 3 && !isNaN(parts[2]) ? parts[2] : undefined];
        }
        return null;
    }).filter(d => d !== null);
}

function calculateLinearRegression(data) {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    data.forEach(point => {
        sumX += point[0];
        sumY += point[1];
        sumXY += point[0] * point[1];
        sumX2 += point[0] * point[0];
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const xMin = Math.min(...data.map(p => p[0]));
    const xMax = Math.max(...data.map(p => p[0]));

    return [
        [xMin, slope * xMin + intercept],
        [xMax, slope * xMax + intercept]
    ];
}

function updateChart() {
    if (!chart) return;

    const title = document.getElementById('chartTitle').value || '散点图';
    const xName = document.getElementById('xName').value || 'X';
    const yName = document.getElementById('yName').value || 'Y';
    const scatterType = document.getElementById('scatterType').value;
    const primaryColor = document.getElementById('primaryColor').value;
    const symbolSize = parseInt(document.getElementById('symbolSize').value);
    const showTrendLine = document.getElementById('showTrendLine').checked;

    const rawData = parseScatterData(document.getElementById('scatterData').value);

    if (rawData.length === 0) {
        chart.clear();
        chart.setOption({ title: { text: '请输入有效数据', left: 'center', top: 'center', textStyle: { color: '#999' } } });
        return;
    }

    const series = [];
    series.push({
        name: '数据',
        type: scatterType === 'effect' ? 'effectScatter' : 'scatter',
        data: rawData.map(d => d[2] !== undefined ? { value: [d[0], d[1]], symbolSize: d[2] * symbolSize / 10 } : [d[0], d[1]]),
        symbolSize: scatterType === 'bubble' ? function(data) { return Math.max(8, Math.min(40, (data[2] || 1) * 3)); } : symbolSize,
        itemStyle: {
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                { offset: 0, color: primaryColor },
                { offset: 1, color: adjustColor(primaryColor, -40) + 'cc' }
            ]),
            shadowBlur: 10,
            shadowColor: primaryColor + '40'
        },
        emphasis: { itemStyle: { shadowBlur: 20, shadowColor: primaryColor + '80' } }
    });

    if (showTrendLine && rawData.length > 1) {
        const trendData = calculateLinearRegression(rawData);
        series.push({
            name: '趋势线',
            type: 'line',
            data: trendData,
            symbol: 'none',
            lineStyle: { color: '#f56c6c', width: 2, type: 'dashed' },
            tooltip: { show: false }
        });
    }

    const option = {
        title: { text: title, left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
        tooltip: { trigger: 'item', formatter: function(params) { return `${xName}: ${params.value[0]}<br/>${yName}: ${params.value[1]}`; } },
        grid: { left: '3%', right: '8%', bottom: '8%', containLabel: true },
        xAxis: { type: 'value', name: xName, splitLine: { show: true, lineStyle: { type: 'dashed' } } },
        yAxis: { type: 'value', name: yName, splitLine: { show: true, lineStyle: { type: 'dashed' } } },
        series
    };

    chart.setOption(option, true);
}

function adjustColor(hex, amount) {
    let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function downloadChart() {
    if (!chart) return;
    const url = chart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scatter_chart.png';
    a.click();
    showToast(I18N.t('common.download') + I18N.t('common.success'), 'success');
}

function loadSampleData(type) {
    if (type === 'height') {
        document.getElementById('chartTitle').value = '成人身高体重分布';
        document.getElementById('xName').value = '身高 (cm)';
        document.getElementById('yName').value = '体重 (kg)';
        document.getElementById('scatterData').value = `158,48
162,53
165,55
167,58
168,57
169,61
170,62
171,63
172,66
173,67
174,68
175,70
176,71
177,74
178,75
179,78
181,80
183,83
185,86`;
    } else if (type === 'gdp') {
        document.getElementById('chartTitle').value = '各国GDP与预期寿命';
        document.getElementById('xName').value = '人均GDP (千美元)';
        document.getElementById('yName').value = '预期寿命 (岁)';
        document.getElementById('scatterData').value = `2.3,54
4.5,65
6.2,70
12.5,76
25.3,79
42.1,81
55.6,82
63.2,84
78.5,85
95.2,84
110.3,83`;
    }
    updateChart();
}
