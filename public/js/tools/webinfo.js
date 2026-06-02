(function() {
    const urlInput = document.getElementById('urlInput');
    const queryBtn = document.getElementById('queryBtn');
    const resultSection = document.getElementById('resultSection');

    function normalizeUrl(url) {
        url = url.trim();
        if (!url) return '';
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        return url;
    }

    function getFaviconUrl(url) {
        try {
            const u = new URL(url);
            return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
        } catch (e) {
            return '';
        }
    }

    async function queryWebsite() {
        let url = normalizeUrl(urlInput.value);
        if (!url) {
            showToast(I18N.t('tools.webinfo.input'), 'error');
            return;
        }

        queryBtn.disabled = true;
        resultSection.innerHTML = '<div class="loading-placeholder"><div class="loading-spinner"></div><p style="margin-top:12px;">' + I18N.t('tools.webinfo.querying') + '</p></div>';

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const startTime = performance.now();

            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache',
                signal: controller.signal
            }).catch(() => null);

            clearTimeout(timeoutId);
            const elapsed = Math.round(performance.now() - startTime);

            const domain = (() => {
                try { return new URL(url).hostname; } catch (e) { return url; }
            })();

            const info = {
                title: domain,
                url: url,
                status: response ? (response.ok || response.type === 'opaque' ? '200' : String(response.status)) : '未知',
                statusText: response ? (response.ok || response.type === 'opaque' ? '可访问' : '异常') : '无法访问',
                server: response?.headers.get('server') || '-',
                contentType: response?.headers.get('content-type')?.split(';')[0] || '-',
                time: elapsed + 'ms',
                protocol: location.protocol === 'https:' ? 'HTTPS' : 'HTTP'
            };

            renderResult(info);

        } catch (err) {
            resultSection.innerHTML = `<div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <p style="font-size:18px;font-weight:600;margin-bottom:8px;">查询失败</p>
                <p>${err.name === 'AbortError' ? I18N.t('tools.webinfo.timeout') : err.message}</p>
            </div>`;
            showToast(I18N.t('common.error'), 'error');
        } finally {
            queryBtn.disabled = false;
        }
    }

    function renderResult(info) {
        const isUp = info.status !== '未知' && !info.status.startsWith('4') && !info.status.startsWith('5');

        let html = `
            <div class="site-header-card">
                <img class="site-favicon" src="${getFaviconUrl(info.url)}" alt="" onerror="this.style.display='none'">
                <div class="site-title">${Utils.escapeHtml(info.title)}</div>
                <div class="site-url">${Utils.escapeHtml(info.url)}</div>
                <div style="margin-top:10px;">
                    <span class="status-badge ${isUp ? 'up' : 'down'}">${isUp ? '✅ 网站正常' : '❌ 网站异常'}</span>
                </div>
            </div>

            <div class="info-table">
                <div class="info-row"><span class="info-label">🌐 域名</span><span class="info-value">${Utils.escapeHtml(new URL(info.url).hostname)}</span></div>
                <div class="info-row"><span class="info-label">📡 协议</span><span class="info-value">${info.protocol}</span></div>
                <div class="info-row"><span class="info-label">📊 状态码</span><span class="info-value">${info.status}</span></div>
                <div class="info-row"><span class="info-label">⏱️ 响应时间</span><span class="info-value">${info.time}</span></div>
                <div class="info-row"><span class="info-label">🖥️ 服务器</span><span class="info-value">${Utils.escapeHtml(info.server)}</span></div>
                <div class="info-row"><span class="info-label">📄 内容类型</span><span class="info-value">${Utils.escapeHtml(info.contentType)}</span></div>
            </div>
        `;

        resultSection.innerHTML = html;
        showToast(I18N.t('common.success'), 'success');
    }

    queryBtn.addEventListener('click', queryWebsite);

    urlInput.addEventListener('keydown', e => {
        if (e.code === 'Enter') queryWebsite();
    });
})();
