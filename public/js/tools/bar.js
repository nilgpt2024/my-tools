let chart = null;

document.addEventListener('DOMContentLoaded', function() {
    chart = echarts.init(document.getElementById('chartContainer'));
    updateChart();

    window.addEventListener('resize', function() {
        if (chart) chart.resize();
    });
});

function getChartData() {
    const categories = document.getElementById('categories').value.split(',').map(s => s.trim()).filter(s => s);
    const values = document.getElementById('values').value.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));
    return { categories, values };
}

function updateChart() {
    if (!chart) return;

    const title = document.getElementById('chartTitle').value || '柱状图';
    const seriesName = document.getElementById('seriesName').value || '数值';
    const barType = document.getElementById('barType').value;
    const primaryColor = document.getElementById('primaryColor').value;
    const showLabel = document.getElementById('showLabel').checked;
    const showGrid = document.getElementById('showGrid').checked;

    const data = getChartData();
    if (data.categories.length === 0 || data.values.length === 0) {
        chart.clear();
        chart.setOption({
            title: { text: '请输入有效数据', left: 'center', top: 'center', textStyle: { color: '#999' } }
        });
        return;
    }

    const isHorizontal = barType === 'horizontal';

    const option = {
        title: { text: title, left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: isHorizontal ? {} : { type: 'category', data: data.categories, axisLabel: { rotate: data.categories.length > 6 ? 30 : 0 } },
        yAxis: isHorizontal ? { type: 'category', data: data.categories } : { type: 'value' },
        series: [{
            name: seriesName,
            type: barType === 'horizontal' ? 'bar' : 'bar',
            data: data.values,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: primaryColor },
                    { offset: 1, color: adjustColor(primaryColor, -30) }
                ]),
                borderRadius: [4, 4, 0, 0]
            },
            label: { show: showLabel, position: isHorizontal ? 'right' : 'top', formatter: '{c}' },
            barMaxWidth: isHorizontal ? undefined : 60,
            stack: barType === 'stacked' ? 'total' : undefined
        }]
    };

    if (!showGrid) option.grid.show = false;

    chart.setOption(option, true);
}

function adjustColor(hex, amount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
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
    a.download = 'bar_chart.png';
    a.click();
    showToast(I18N.t('tools.bar.exportImage').replace('(PNG)', '') + I18N.t('common.success'), 'success');
}

function loadSampleData(type) {
    if (type === 'sales') {
        document.getElementById('chartTitle').value = '2024年月度销售额';
        document.getElementById('categories').value = '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月';
        document.getElementById('values').value = '120,200,150,80,70,110,130,160,180,220,190,250';
        document.getElementById('seriesName').value = '销售额（万元）';
    } else if (type === 'population') {
        document.getElementById('chartTitle').value = '世界人口排名TOP10';
        document.getElementById('categories').value = '中国,印度,美国,印尼,巴基斯坦,巴西,尼日利亚,孟加拉国,俄罗斯,墨西哥';
        document.getElementById('values').value = '14.1,14.2,3.31,2.77,2.31,2.15,2.17,1.71,1.44,1.28';
        document.getElementById('seriesName').value = '人口（亿）';
    }
    updateChart();
}
