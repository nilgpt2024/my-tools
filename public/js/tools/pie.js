let chart = null;

const defaultColors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];

document.addEventListener('DOMContentLoaded', function() {
    chart = echarts.init(document.getElementById('chartContainer'));
    updateChart();

    window.addEventListener('resize', () => { if (chart) chart.resize(); });
});

function parsePieData(text) {
    const lines = text.trim().split('\n');
    return lines.map(line => {
        const parts = line.split(/[:：]/);
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const value = parseFloat(parts.slice(1).join(':').trim());
            if (name && !isNaN(value)) return { name, value };
        }
        return null;
    }).filter(item => item !== null);
}

function updateChart() {
    if (!chart) return;

    const title = document.getElementById('chartTitle').value || '饼图';
    const pieType = document.getElementById('pieType').value;
    const radiusPercent = parseInt(document.getElementById('radiusSize').value);
    const showLabel = document.getElementById('showLabel').checked;
    const showPercent = document.getElementById('showPercent').checked;

    const rawData = parsePieData(document.getElementById('pieData').value);

    if (rawData.length === 0) {
        chart.clear();
        chart.setOption({ title: { text: '请输入有效数据', left: 'center', top: 'center', textStyle: { color: '#999' } } });
        return;
    }

    let radius, innerRadius;
    if (pieType === 'doughnut') {
        innerRadius = `${Math.max(20, 100 - radiusPercent)}%`;
        radius = `${radiusPercent}%`;
    } else {
        radius = pieType === 'rose' ? ['10%', radiusPercent + '%'] : radiusPercent + '%';
        innerRadius = '0%';
    }

    const option = {
        title: { text: title, left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', left: 'left', top: 'middle' },
        color: defaultColors,
        series: [{
            name: '数据',
            type: 'pie',
            radius: pieType === 'doughnut' ? [innerRadius, radius] : radius,
            center: pieType === 'rose' || pieType === 'doughnut' ? ['55%', '50%'] : ['50%', '50%'],
            roseType: pieType === 'rose' && document.getElementById('roseType').checked ? 'area' : undefined,
            data: rawData,
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
            label: showLabel ? {
                show: true,
                formatter: showPercent ? '{b}\n{d}%' : '{b}'
            } : { show: false },
            itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 }
        }]
    };

    chart.setOption(option, true);
}

function downloadChart() {
    if (!chart) return;
    const url = chart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pie_chart.png';
    a.click();
    showToast(I18N.t('common.download') + I18N.t('common.success'), 'success');
}

function loadSampleData(type) {
    if (type === 'browser') {
        document.getElementById('chartTitle').value = '2024 浏览器市场份额';
        document.getElementById('pieData').value = `Chrome:65.5%
Safari:18.7%
Edge:5.2%
Firefox:3.0%
Opera:2.9%
其他:4.7%`;
    } else if (type === 'os') {
        document.getElementById('chartTitle').value = '2024 桌面操作系统份额';
        document.getElementById('pieData').value = `Windows:72.1%
macOS:15.4%
Linux:4.0%
ChromeOS:3.2%
其他:5.3%`;
    }
    updateChart();
}
