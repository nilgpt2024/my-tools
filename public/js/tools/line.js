let chart = null;

const colorSchemes = {
    blue: ['#409EFF', '#67C23A'],
    colorful: ['#F56C6C', '#E6A23C', '#409EFF', '#67C23A', '#909399'],
    warm: ['#FF6B6B', '#FFE66D', '#FF8E53', '#FC466B'],
    cool: ['#00D2FF, #3A7BD5', '#667eea', '#764ba2', '#11998e']
};

document.addEventListener('DOMContentLoaded', function() {
    chart = echarts.init(document.getElementById('chartContainer'));
    updateChart();

    window.addEventListener('resize', () => { if (chart) chart.resize(); });
});

function parseValues(str) {
    return str.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));
}

function updateChart() {
    if (!chart) return;

    const title = document.getElementById('chartTitle').value || '折线图';
    const categories = document.getElementById('categories').value.split(',').map(s => s.trim()).filter(s => s);
    const name1 = document.getElementById('name1').value || '系列1';
    const values1 = parseValues(document.getElementById('values1').value);
    const name2 = document.getElementById('name2').value || '';
    const values2 = parseValues(document.getElementById('values2').value);

    const lineStyle = document.getElementById('lineStyle').value;
    const scheme = document.getElementById('colorScheme').value;
    const showArea = document.getElementById('showArea').checked;
    const showPoint = document.getElementById('showPoint').checked;
    const showSymbol = document.getElementById('showSymbol').checked;

    const colors = colorSchemes[scheme] || colorSchemes.blue;

    if (categories.length === 0) {
        chart.clear();
        chart.setOption({ title: { text: '请输入有效数据', left: 'center', top: 'center', textStyle: { color: '#999' } } });
        return;
    }

    function createSeries(name, data, colorIndex) {
        return {
            name,
            type: 'line',
            smooth: lineStyle === 'smooth',
            step: lineStyle === 'step',
            data,
            symbol: showSymbol ? 'circle' : 'none',
            symbolSize: 8,
            itemStyle: { color: colors[colorIndex % colors.length] },
            areaStyle: showArea ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors[colorIndex % colors.length] + '40' },
                    { offset: 1, color: colors[colorIndex % colors.length] + '05' }
                ])
            } : undefined,
            label: { show: showPoint, position: 'top', fontSize: 11 },
            emphasis: { focus: 'series' }
        };
    }

    const series = [];
    series.push(createSeries(name1, values1, 0));
    if (name2 && values2.length > 0) {
        series.push(createSeries(name2, values2, 1));
    }

    const option = {
        title: { text: title, left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis' },
        legend: { data: series.map(s => s.name), bottom: 0 },
        grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: categories, axisLabel: { rotate: categories.length > 6 ? 30 : 0 } },
        yAxis: { type: 'value' },
        series
    };

    chart.setOption(option, true);
}

function downloadChart() {
    if (!chart) return;
    const url = chart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' });
    const a = document.createElement('a');
    a.href = url;
    a.download = 'line_chart.png';
    a.click();
    showToast(I18N.t('common.download') + I18N.t('common.success'), 'success');
}

function loadSampleData(type) {
    if (type === 'stock') {
        document.getElementById('chartTitle').value = '股票价格走势';
        document.getElementById('categories').value = '9:30,10:00,10:30,11:00,13:00,13:30,14:00,14:30,15:00';
        document.getElementById('name1').value = '股价A';
        document.getElementById('values1').value = '25.5,26.1,25.8,27.2,27.5,26.9,28.1,28.5,29.0';
        document.getElementById('name2').value = '股价B';
        document.getElementById('values2').value = '18.2,18.5,19.1,18.8,19.5,19.2,20.1,19.8,20.5';
    } else if (type === 'weather') {
        document.getElementById('chartTitle').value = '一周温度变化';
        document.getElementById('categories').value = '周一,周二,周三,周四,周五,周六,周日';
        document.getElementById('name1').value = '最高温';
        document.getElementById('values1').value='28,30,32,29,27,31,33';
        document.getElementById('name2').value = '最低温';
        document.getElementById('values2').value = '18,20,22,19,17,21,23';
    }
    updateChart();
}
