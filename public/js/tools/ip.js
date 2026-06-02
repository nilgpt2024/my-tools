(function() {
    const ipDisplay = document.getElementById('ipDisplay');
    const queryBtn = document.getElementById('queryBtn');
    const infoGrid = document.getElementById('infoGrid');

    async function queryIP() {
        queryBtn.disabled = true;
        queryBtn.textContent = '⏳ ' + I18N.t('tools.ip.querying');
        infoGrid.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p style="margin-top:12px;">' + I18N.t('tools.ip.fetching') + '</p></div>';

        try {
            const response = await fetch('http://ip-api.com/json/?lang=zh-CN&fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query');
            if (!response.ok) throw new Error('请求失败');

            const data = await response.json();

            if (data.status !== 'success') throw new Error(data.message || '查询失败');

            ipDisplay.textContent = data.query;

            const fields = [
                { icon: '🌏', label: '国家/地区', value: data.country || '-' },
                { icon: '📍', label: '省份/州', value: data.regionName || '-' },
                { icon: '🏙️', label: '城市', value: data.city || '-' },
                { icon: '📮', label: '邮编', value: data.zip || '-' },
                { icon: '🌐', label: '时区', value: data.timezone || '-' },
                { icon: '📡', label: 'ISP运营商', value: data.isp || '-' },
                { icon: '🏢', label: '组织/机构', value: data.org || '-' },
                { icon: '🔢', label: 'AS号码', value: data.as || '-' },
                { icon: '🧭', label: '纬度', value: data.lat ? data.lat.toFixed(4) : '-' },
                { icon: '🧭', label: '经度', value: data.lon ? data.lon.toFixed(4) : '-' }
            ];

            let html = '';
            fields.forEach(f => {
                html += `<div class="info-card">
                    <div class="info-card-icon">${f.icon}</div>
                    <div class="info-card-label">${f.label}</div>
                    <div class="info-card-value">${Utils.escapeHtml(f.value)}</div>
                </div>`;
            });

            infoGrid.innerHTML = html;

            showToast(I18N.t('common.success'), 'success');
        } catch (err) {
            ipDisplay.textContent = I18N.t('common.error');
            infoGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px;color:#f56c6c;">
                <p style="font-size:18px;font-weight:600;margin-bottom:8px;">⚠️ ` + I18N.t('tools.ip.queryError') + `</p>
                <p style="color:var(--text-secondary);">${err.message}</p>
                <p style="color:var(--text-light);font-size:13px;margin-top:8px;">` + I18N.t('tools.ip.retry') + `</p>
            </div>`;
            showToast(I18N.t('common.error'), 'error');
        } finally {
            queryBtn.disabled = false;
            queryBtn.textContent = '🔄 ' + I18N.t('tools.ip.requery');
        }
    }

    queryBtn.addEventListener('click', queryIP);
})();
