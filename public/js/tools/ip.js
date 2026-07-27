(function() {
    const ipDisplay = document.getElementById('ipDisplay');
    const queryBtn = document.getElementById('queryBtn');
    const infoGrid = document.getElementById('infoGrid');

    async function queryIP() {
        queryBtn.disabled = true;
        queryBtn.textContent = '⏳ ' + I18N.t('tools.ip.querying');
        infoGrid.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p style="margin-top:12px;">' + I18N.t('tools.ip.fetching') + '</p></div>';

        try {
            const response = await fetch('https://ipwho.is/?lang=zh-CN');
            if (!response.ok) throw new Error(I18N.t('tools.ip.requestFailed') || '请求失败');

            const data = await response.json();

            if (data.success === false) throw new Error(data.message || I18N.t('tools.ip.queryError') || '查询失败');

            ipDisplay.textContent = data.ip || '-';

            const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;
            const fields = [
                { icon: '🌏', label: t('tools.ip.country', '国家/地区'), value: data.country || '-' },
                { icon: '📍', label: t('tools.ip.region', '省份/州'), value: data.region || '-' },
                { icon: '🏙️', label: t('tools.ip.city', '城市'), value: data.city || '-' },
                { icon: '📮', label: t('tools.ip.postal', '邮编'), value: data.postal || '-' },
                { icon: '🌐', label: t('tools.ip.timezone', '时区'), value: (data.timezone && data.timezone.id) || data.timezone || '-' },
                { icon: '📡', label: t('tools.ip.isp', 'ISP运营商'), value: data.isp || '-' },
                { icon: '🏢', label: t('tools.ip.org', '组织/机构'), value: data.org || '-' },
                { icon: '🔢', label: t('tools.ip.as', 'AS号码'), value: (data.asn && data.asn.asn) || data.asn || '-' },
                { icon: '🧭', label: t('tools.ip.latitude', '纬度'), value: data.latitude ? data.latitude.toFixed(4) : '-' },
                { icon: '🧭', label: t('tools.ip.longitude', '经度'), value: data.longitude ? data.longitude.toFixed(4) : '-' }
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
