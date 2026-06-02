const CookieConsent = {
  config: {
    necessary: { name: 'necessary', required: true, enabled: true },
    analytics: { name: 'analytics', required: false, enabled: false },
    advertising: { name: 'advertising', required: false, enabled: false },
    functional: { name: 'functional', required: false, enabled: false }
  },

  STORAGE_KEY: 'cookie_consent',
  VERSION: '1.0',
  bannerId: 'cc-banner',
  settingsId: 'cc-settings',
  overlayId: 'cc-overlay',

  defaults: {
    'zh-CN': {
      title: 'Cookie 使用告知',
      description: '本网站使用 Cookie 来改善您的浏览体验、分析网站流量和展示个性化广告。您可以自由选择接受哪些类型的 Cookie。',
      acceptAll: '接受全部',
      manageSettings: '管理设置',
      necessaryOnly: '仅必要',
      learnMore: '了解更多',
      settingsTitle: 'Cookie 偏好设置',
      settingsDesc: '您可以选择要启用的 Cookie 类型。必要时 Cookie 始终启用，因为它们对于网站的基本功能是必需的。',
      necessary: '必要 Cookie',
      necessaryDesc: '这些 Cookie 对于网站的正常运行是必需的，无法关闭。它们通常仅在您执行相应操作时设置。',
      analytics: '分析 Cookie',
      analyticsDesc: '帮助我们了解访客如何与网站交互，收集的信息是匿名的。',
      advertising: '广告 Cookie',
      advertisingDesc: '用于为您展示相关的个性化广告。可能通过我们的广告合作伙伴设置。',
      functional: '功能 Cookie',
      functionalDesc: '记住您的偏好和设置，以提供增强的功能。',
      savePreferences: '保存偏好',
      cancel: '取消',
      privacyPolicy: '查看隐私政策',
      consentRecorded: '您的 Cookie 偏好已保存'
    },
    'en': {
      title: 'Cookie Notice',
      description: 'We use cookies to enhance your browsing experience, analyze site traffic, and display personalized ads. You can choose which types of cookies to accept.',
      acceptAll: 'Accept All',
      manageSettings: 'Manage Settings',
      necessaryOnly: 'Necessary Only',
      learnMore: 'Learn More',
      settingsTitle: 'Cookie Preferences',
      settingsDesc: 'You can choose which types of cookies to enable. Necessary cookies are always enabled as they are essential for basic site functionality.',
      necessary: 'Necessary Cookies',
      necessaryDesc: 'These cookies are essential for the website to function properly and cannot be disabled.',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Help us understand how visitors interact with our website. All data is anonymized.',
      advertising: 'Advertising Cookies',
      advertisingDesc: 'Used to display personalized ads. May be set by our advertising partners.',
      functional: 'Functional Cookies',
      functionalDesc: 'Remember your preferences and settings for enhanced functionality.',
      savePreferences: 'Save Preferences',
      cancel: 'Cancel',
      privacyPolicy: 'View Privacy Policy',
      consentRecorded: 'Your cookie preferences have been saved'
    }
  },

  t(key) {
    if (typeof I18N !== 'undefined' && I18N.t) {
      const val = I18N.t('cookie.' + key);
      if (val && val !== 'cookie.' + key) return val;
    }
    const lang = (typeof I18N !== 'undefined' && I18N.currentLang) || 'zh-CN';
    return (this.defaults[lang] || this.defaults['zh-CN'])[key] || key;
  },

  init() {
    this.injectStyles();
    const consent = this.getConsent();
    if (!consent) {
      this.showBanner();
    }
    this.dispatchConsentEvent();
  },

  getConsent() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  hasConsented(category) {
    const consent = this.getConsent();
    if (!consent) return this.config[category]?.required || false;
    return !!consent[category];
  },

  showBanner() {
    if (document.getElementById(this.bannerId)) return;
    const div = document.createElement('div');
    div.id = this.bannerId;
    div.innerHTML = this.renderBanner();
    div.style.opacity = '0';
    document.body.appendChild(div);
    requestAnimationFrame(() => { div.style.opacity = '1'; });
    this.bindBannerEvents(div);
  },

  hideBanner() {
    const el = document.getElementById(this.bannerId);
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  },

  showSettings() {
    if (document.getElementById(this.settingsId)) return;
    const overlay = document.createElement('div');
    overlay.id = this.overlayId;
    overlay.className = 'cc-overlay';
    document.body.appendChild(overlay);

    const modal = document.createElement('div');
    modal.id = this.settingsId;
    modal.innerHTML = this.renderSettings();
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.95)';
    document.body.appendChild(modal);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      modal.style.opacity = '1';
      modal.style.transform = 'scale(1)';
    });

    this.loadCurrentPrefs(modal);
    this.bindSettingsEvents(modal, overlay);
  },

  hideSettings() {
    const modal = document.getElementById(this.settingsId);
    const overlay = document.getElementById(this.overlayId);
    if (modal) {
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.95)';
      setTimeout(() => modal.remove(), 250);
    }
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 250);
    }
  },

  acceptAll() {
    const prefs = {};
    Object.keys(this.config).forEach(k => { prefs[k] = true; });
    this.savePreferences(prefs);
    this.hideBanner();
  },

  acceptNecessary() {
    const prefs = {};
    Object.keys(this.config).forEach(k => { prefs[k] = this.config[k].required; });
    this.savePreferences(prefs);
    this.hideBanner();
  },

  savePreferences(prefs) {
    const data = { ...prefs, timestamp: Date.now(), version: this.VERSION };
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {}
    this.dispatchConsentEvent();
    this.showToast(this.t('consentRecorded'));
  },

  saveFromSettings() {
    const modal = document.getElementById(this.settingsId);
    if (!modal) return;
    const prefs = { necessary: true };
    ['analytics', 'advertising', 'functional'].forEach(cat => {
      const toggle = modal.querySelector(`[data-cc-toggle="${cat}"]`);
      prefs[cat] = toggle ? toggle.classList.contains('cc-toggle-on') : false;
    });
    this.savePreferences(prefs);
    this.hideSettings();
    this.hideBanner();
  },

  loadCurrentPrefs(modal) {
    const consent = this.getConsent();
    ['analytics', 'advertising', 'functional'].forEach(cat => {
      const toggle = modal.querySelector(`[data-cc-toggle="${cat}"]`);
      if (!toggle) return;
      const enabled = consent ? !!consent[cat] : false;
      if (enabled) {
        toggle.classList.add('cc-toggle-on');
        toggle.classList.remove('cc-toggle-off');
      } else {
        toggle.classList.add('cc-toggle-off');
        toggle.classList.remove('cc-toggle-on');
      }
    });
  },

  dispatchConsentEvent() {
    const consent = this.getConsent();
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
  },

  renderBanner() {
    return `
      <div class="cc-banner-inner">
        <div class="cc-banner-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 12v4"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </div>
        <div class="cc-banner-content">
          <div class="cc-banner-title">${this.t('title')}</div>
          <div class="cc-banner-desc">${this.t('description')}</div>
        </div>
        <div class="cc-banner-actions">
          <button class="cc-btn cc-btn-primary" data-cc-action="acceptAll">${this.t('acceptAll')}</button>
          <button class="cc-btn cc-btn-secondary" data-cc-action="settings">${this.t('manageSettings')}</button>
          <button class="cc-btn cc-btn-outline" data-cc-action="necessary">${this.t('necessaryOnly')}</button>
        </div>
      </div>`;
  },

  renderSettings() {
    const categories = [
      { key: 'necessary', icon: '🔒' },
      { key: 'analytics', icon: '📊' },
      { key: 'advertising', icon: '📢' },
      { key: 'functional', icon: '⚙️' }
    ];
    const items = categories.map(c => `
      <div class="cc-setting-item ${c.key === 'necessary' ? 'cc-setting-disabled' : ''}">
        <div class="cc-setting-info">
          <div class="cc-setting-header">
            <span class="cc-setting-icon">${c.icon}</span>
            <span class="cc-setting-name">${this.t(c.key)}</span>
          </div>
          <div class="cc-setting-desc">${this.t(c.key + 'Desc')}</div>
        </div>
        <div class="cc-toggle ${c.key === 'necessary' ? 'cc-toggle-on cc-toggle-disabled' : 'cc-toggle-off'}"
             data-cc-toggle="${c.key}" ${c.key === 'necessary' ? 'disabled' : ''}>
          <div class="cc-toggle-knob"></div>
        </div>
      </div>`).join('');

    return `
      <div class="cc-settings-inner">
        <div class="cc-settings-header">
          <h3 class="cc-settings-title">${this.t('settingsTitle')}</h3>
          <button class="cc-settings-close" data-cc-action="closeSettings">&times;</button>
        </div>
        <p class="cc-settings-desc">${this.t('settingsDesc')}</p>
        <div class="cc-settings-list">${items}</div>
        <div class="cc-settings-footer">
          <button class="cc-btn cc-btn-secondary" data-cc-action="cancelSettings">${this.t('cancel')}</button>
          <button class="cc-btn cc-btn-primary" data-cc-action="saveSettings">${this.t('savePreferences')}</button>
        </div>
      </div>`;
  },

  bindBannerEvents(container) {
    container.addEventListener('click', e => {
      const action = e.target.closest('[data-cc-action]')?.dataset.ccAction;
      if (action === 'acceptAll') this.acceptAll();
      else if (action === 'settings') this.showSettings();
      else if (action === 'necessary') this.acceptNecessary();
    });
  },

  bindSettingsEvents(modal, overlay) {
    modal.addEventListener('click', e => {
      const action = e.target.closest('[data-cc-action]')?.dataset.ccAction;
      if (action === 'closeSettings' || action === 'cancelSettings') this.hideSettings();
      else if (action === 'saveSettings') this.saveFromSettings();

      const toggle = e.target.closest('[data-cc-toggle]');
      if (toggle && !toggle.disabled) {
        toggle.classList.toggle('cc-toggle-on');
        toggle.classList.toggle('cc-toggle-off');
      }
    });
    overlay.addEventListener('click', () => this.hideSettings());
  },

  showToast(message) {
    const existing = document.getElementById('cc-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'cc-toast';
    toast.className = 'cc-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('cc-toast-show'));
    setTimeout(() => {
      toast.classList.remove('cc-toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  },

  injectStyles() {
    if (document.getElementById('cc-styles')) return;
    const css = `
.cc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10001;opacity:0;transition:opacity .25s ease}
#cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:10000;background:rgba(15,23,42,.92);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,.1);padding:16px 20px;transition:opacity .35s ease;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
#cc-settings{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);z-index:10002;width:min(540px,92vw);max-height:85vh;overflow-y:auto;background:#fff;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,.3);transition:all .25s cubic-bezier(.4,0,.2,1);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.cc-banner-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.cc-banner-icon{flex-shrink:0;color:#f59e0b}
.cc-banner-content{flex:1;min-width:240px}
.cc-banner-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:4px}
.cc-banner-desc{font-size:13px;color:#cbd5e1;line-height:1.5}
.cc-banner-actions{display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap}
.cc-btn{padding:9px 18px;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s ease;white-space:nowrap}
.cc-btn-primary{background:#3b82f6;color:#fff}.cc-btn-primary:hover{background:#2563eb;transform:translateY(-1px)}
.cc-btn-secondary{background:#475569;color:#fff}.cc-btn-secondary:hover{background:#334155;transform:translateY(-1px)}
.cc-btn-outline{background:transparent;color:#94a3b8;border:1px solid #475569}.cc-btn-outline:hover{background:rgba(255,255,255,.05);color:#e2e8f0}
.cc-settings-inner{padding:24px}
.cc-settings-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.cc-settings-title{margin:0;font-size:20px;font-weight:700;color:#1e293b}
.cc-settings-close{width:32px;height:32px;border:none;background:#f1f5f9;border-radius:8px;font-size:22px;color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}.cc-settings-close:hover{background:#e2e8f0;color:#334155}
.cc-settings-desc{font-size:13px;color:#64748b;line-height:1.6;margin-bottom:20px}
.cc-settings-list{display:flex;flex-direction:column;gap:14px;margin-bottom:24px}
.cc-setting-item{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;transition:background .2s}
.cc-setting-item:hover{background:#f1f5f9}
.cc-setting-disabled{opacity:.7}
.cc-setting-info{flex:1}
.cc-setting-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.cc-setting-icon{font-size:18px}
.cc-setting-name{font-size:14px;font-weight:600;color:#1e293b}
.cc-setting-desc{font-size:12.5px;color:#64748b;line-height:1.5}
.cc-toggle{position:relative;width:48px;height:26px;border-radius:13px;cursor:pointer;transition:background .25s ease;flex-shrink:0;border:none;padding:0}
.cc-toggle-on{background:#3b82f6}.cc-toggle-off{background:#cbd5e1}
.cc-toggle-disabled{cursor:not-allowed;opacity:.6}
.cc-toggle-knob{position:absolute;top:3px;width:20px;height:20px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .25s cubic-bezier(.4,0,.2,1)}
.cc-toggle-on .cc-toggle-knob{transform:translateX(22px)}
.cc-toggle-off .cc-toggle-knob{transform:translateX(3px)}
.cc-settings-footer{display:flex;justify-content:flex-end;gap:10px;padding-top:16px;border-top:1px solid #e2e8f0}
.cc-toast{position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-20px);background:#1e293b;color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:500;z-index:10003;opacity:0;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:0 8px 30px rgba(0,0,0,.2);pointer-events:none}
.cc-toast-show{opacity:1;transform:translateX(-50%) translateY(0)}
@media(max-width:768px){
  #cc-banner{padding:14px 16px}
  .cc-banner-inner{flex-direction:column;align-items:stretch;gap:12px}
  .cc-banner-content{min-width:0}
  .cc-banner-actions{width:100%;justify-content:stretch}
  .cc-btn{flex:1;text-align:center;padding:11px 14px}
  #cc-settings{width:95vw;max-height:90vh}
  .cc-settings-inner{padding:18px}
  .cc-setting-item{flex-direction:column;gap:12px}
}`;
    const style = document.createElement('style');
    style.id = 'cc-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CookieConsent.init());
} else {
  CookieConsent.init();
}