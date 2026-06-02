const ToolsConfig = {
  categories: [
    {
      id: 'dev',
      title: '开发运维',
      icon: '💻',
      tools: [
        { name: '随机密码生成', url: 'tools/randompassword.html', icon: '🔑', desc: '生成安全的随机密码，支持自定义长度和字符类型' },
        { name: 'URL编码/解码', url: 'tools/urlencode.html', icon: '🔗', desc: '在线URL编码和解码工具' },
        { name: 'UUID生成器', url: 'tools/uuid.html', icon: '🆔', desc: '批量生成通用唯一识别码' },
        { name: '时间戳转换', url: 'tools/timetran.html', icon: '⏰', desc: '时间戳与日期格式互转' },
        { name: 'MD5加密', url: 'tools/md5.html', icon: '🔐', desc: 'MD5在线加密，支持32位和16位' },
        { name: 'JSON格式化', url: 'tools/json.html', icon: '📋', desc: 'JSON格式化、压缩、验证' },
        { name: '正则测试', url: 'tools/reg.html', icon: '🔍', desc: '正则表达式在线测试工具' },
        { name: 'Unicode转换', url: 'tools/unicode.html', icon: '🌐', desc: 'Unicode与中文相互转换' },
        { name: 'HTTP状态码', url: 'tools/httpstatuscode.html', icon: '🌐', desc: 'HTTP状态码查询与说明' },
        { name: 'JWT解析', url: 'tools/jwt.html', icon: '🎫', desc: 'JSON Web Token解析与验证' },
        { name: 'HTML实体转义', url: 'tools/htmlentity.html', icon: '📝', desc: 'HTML实体编码与解码' },
        { name: 'JS格式化', url: 'tools/jsformat.html', icon: '📜', desc: 'JavaScript代码格式化与压缩' },
        { name: 'HTML格式化', url: 'tools/htmlformat.html', icon: '🌐', desc: 'HTML代码格式化与美化' },
        { name: 'CSS格式化', url: 'tools/cssformat.html', icon: '🎨', desc: 'CSS代码格式化与压缩' },
        { name: 'Base64编解码', url: 'tools/base64.html', icon: '🔄', desc: 'Base64编码与解码工具' },
        { name: '进制转换', url: 'tools/scaletran.html', icon: '🔢', desc: '二进制、八进制、十进制、十六进制转换' },
        { name: 'Hash计算', url: 'tools/hashcalculator.html', icon: '#️⃣', desc: '多种Hash算法计算' },
        { name: 'SQL格式化', url: 'tools/sqlformat.html', icon: '🗄️', desc: 'SQL语句格式化与美化' },
        { name: 'XML格式化', url: 'tools/xmlformat.html', icon: '📄', desc: 'XML代码格式化与美化' }
      ]
    },
    {
      id: 'text',
      title: '文本处理',
      icon: '✍️',
      tools: [
        { name: '文本统计', url: 'tools/wordcount.html', icon: '📊', desc: '统计字数、字符数、行数等' },
        { name: '词频统计', url: 'tools/wordfrequency.html', icon: '📈', desc: '分析文本中词语出现频率' },
        { name: '文本去重', url: 'tools/textremoveduplicate.html', icon: '🗑️', desc: '去除重复的文本行' },
        { name: '文本替换', url: 'tools/textreplace.html', icon: '🔄', desc: '批量文本查找替换' },
        { name: 'Markdown编辑器', url: 'tools/markdown.html', icon: '📝', desc: '在线Markdown编辑与预览' },
        { name: 'ASCII艺术字', url: 'tools/asciiwordpic.html', icon: '🎨', desc: '文字转ASCII艺术字' },
        { name: '数字转中文', url: 'tools/numbertochinese.html', icon: '🔢', desc: '阿拉伯数字转中文大写' },
        { name: '莫斯电码', url: 'tools/morse.html', icon: '📡', desc: '莫斯电码编码与解码' }
      ]
    },
    {
      id: 'image',
      title: '图像处理',
      icon: '🖼️',
      tools: [
        { name: '图片裁剪', url: 'tools/imgcut.html', icon: '✂️', desc: '在线图片裁剪工具' },
        { name: '图片水印', url: 'tools/imagewatermark.html', icon: '💧', desc: '为图片添加文字或图片水印' },
        { name: '颜色选择器', url: 'tools/colorpicker.html', icon: '🎨', desc: '颜色选择与转换工具' },
        { name: '图片取色器', url: 'tools/imagecolorpicker.html', icon: '🖌️', desc: '从图片中提取颜色' },
        { name: '二维码生成', url: 'tools/qrcode.html', icon: '📱', desc: '在线二维码生成器' }
      ]
    },
    {
      id: 'unit',
      title: '单位转换',
      icon: '📏',
      tools: [
        { name: '长度转换', url: 'tools/length.html', icon: '📏', desc: '长度单位互相转换' },
        { name: '面积转换', url: 'tools/area.html', icon: '⬜', desc: '面积单位互相转换' },
        { name: '重量转换', url: 'tools/weight.html', icon: '⚖️', desc: '重量单位互相转换' },
        { name: '温度转换', url: 'tools/temperature.html', icon: '🌡️', desc: '温度单位互相转换' },
        { name: '时间转换', url: 'tools/time.html', icon: '⏱️', desc: '时间单位互相转换' },
        { name: '压力转换', url: 'tools/pressure.html', icon: '🎈', desc: '压力单位互相转换' },
        { name: '功率转换', url: 'tools/power.html', icon: '⚡', desc: '功率单位互相转换' },
        { name: '存储转换', url: 'tools/storageconverter.html', icon: '💾', desc: '存储容量单位转换' },
        { name: '热量转换', url: 'tools/heat.html', icon: '🔥', desc: '热量单位互相转换' }
      ]
    },
    {
      id: 'chart',
      title: '图表工具',
      icon: '📊',
      tools: [
        { name: '柱状图', url: 'tools/bar.html', icon: '📊', desc: '在线柱状图生成器' },
        { name: '折线图', url: 'tools/line.html', icon: '📈', desc: '在线折线图生成器' },
        { name: '饼图', url: 'tools/pie.html', icon: '🥧', desc: '在线饼图生成器' },
        { name: '散点图', url: 'tools/scatter.html', icon: '⭐', desc: '在线散点图生成器' },
        { name: '词云图', url: 'tools/wordcloud.html', icon: '☁️', desc: '在线词云图生成器' }
      ]
    },
    {
      id: 'fun',
      title: '娱乐工具',
      icon: '🎮',
      tools: [
        { name: '抛硬币', url: 'tools/coin.html', icon: '🪙', desc: '随机抛硬币模拟' },
        { name: '掷骰子', url: 'tools/dice.html', icon: '🎲', desc: '虚拟骰子投掷' },
        { name: '随机选择', url: 'tools/random.html', icon: '🎯', desc: '从列表中随机选择' },
        { name: '抽奖转盘', url: 'tools/lottery.html', icon: '🎡', desc: '创建抽奖转盘' },
        { name: '石头剪刀布', url: 'tools/rockpaperscissors.html', icon: '✊', desc: '经典猜拳游戏' },
        { name: '反应力测试', url: 'tools/reactiontest.html', icon: '⚡', desc: '测试你的反应速度' },
        { name: '番茄钟', url: 'tools/pomodoro.html', icon: '🍅', desc: '番茄工作法计时器' },
        { name: '弹幕生成', url: 'tools/barrage.html', icon: '💬', desc: '生成弹幕效果' },
        { name: '转盘', url: 'tools/wheel.html', icon: '🎯', desc: '自定义转盘选择器' },
        { name: 'Emoji表情', url: 'tools/emoji.html', icon: '😀', desc: 'Emoji表情复制' },
        { name: '文本对比', url: 'tools/diff.html', icon: '🔄', desc: '文本差异对比工具' },
        { name: '计算器', url: 'tools/calculator.html', icon: '🔢', desc: '科学计算器' },
        { name: '色板生成', url: 'tools/colorpalette.html', icon: '🎨', desc: '生成配色方案' },
        { name: 'IP查询', url: 'tools/ip.html', icon: '🌐', desc: '查询本机公网IP' },
        { name: '网站信息', url: 'tools/webinfo.html', icon: 'ℹ️', desc: '查询网站基本信息' }
      ]
    }
  ],

  getAllTools() {
    let allTools = [];
    this.categories.forEach(category => {
      category.tools.forEach(tool => {
        allTools.push({
          ...tool,
          category: category.title
        });
      });
    });
    return allTools;
  },

  searchTools(keyword) {
    if (!keyword) return this.getAllTools();
    const kw = keyword.toLowerCase();
    return this.getAllTools().filter(tool => 
      tool.name.toLowerCase().includes(kw) || 
      tool.desc.toLowerCase().includes(kw) ||
      tool.category.toLowerCase().includes(kw)
    );
  },

  getToolByUrl(url) {
    return this.getAllTools().find(tool => tool.url === url);
  }
};

function loadNavbar(currentPath = '') {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;
  const isHomePage = currentPath === '' || currentPath.endsWith('index.html') || currentPath === '/';
  
  navbar.innerHTML = `
    <div class="container">
      <a href="../index.html" class="navbar-brand">
        <img src="../assets/images/logo.png" alt="Logo" onerror="this.style.display='none'">
        <span>${t('siteName', '在线工具集')}</span>
      </a>
      
      <ul class="navbar-nav" id="mainNav">
        <li><a href="../index.html" class="${isHomePage ? 'active' : ''}">${t('nav.home', '首页')}</a></li>
        <li><a href="../index.html#categories">${t('nav.allTools', '全部工具')}</a></li>
        <li><a href="../about.html">${t('nav.about', '关于')}</a></li>
        <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
      </ul>
      
      <button class="menu-toggle" onclick="toggleMobileMenu()" aria-label="${t('nav.menu', '菜单')}">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    
    <div class="mobile-menu-overlay" onclick="toggleMobileMenu()"></div>
    <div class="mobile-menu" id="mobileMenu">
      <h3 style="margin-bottom: 20px; font-size: 18px;">${t('nav.navMenu', '导航菜单')}</h3>
      <nav style="display: flex; flex-direction: column; gap: 12px;">
        <a href="../index.html" style="padding: 12px; border-radius: 8px; color: var(--text-primary); text-decoration: none; transition: all 0.2s;" 
           onmouseover="this.style.background='#f0f2f5'" onmouseout="this.style.background='transparent'">🏠 ${t('nav.home', '首页')}</a>
        ${ToolsConfig.categories.map(cat => `
          <a href="#${cat.id}" style="padding: 12px; border-radius: 8px; color: var(--text-primary); text-decoration: none; transition: all 0.2s;"
             onmouseover="this.style.background='#f0f2f5'" onmouseout="this.style.background='transparent'">${cat.icon} ${t('categories.' + cat.id, cat.title)}</a>
        `).join('')}
      </nav>
    </div>
  `;
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  
  if (menu && overlay) {
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  }
}

function loadFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  const t = (key, fallback) => (typeof I18N !== 'undefined' ? I18N.t(key) : null) || fallback;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>${t('footer.aboutTitle', '关于我们')}</h3>
          <p>${t('footer.aboutDesc1', '在线工具集是一个免费的在线工具平台，提供开发运维、文本处理、图像处理等多种实用工具。')}</p>
          <p>${t('footer.aboutDesc2', '所有工具均在浏览器本地运行，保护您的数据隐私。')}</p>
          <a href="about.html">${t('common.learnMore', '了解更多')} →</a>
        </div>

        <div class="footer-section">
          <h3>${t('footer.hotTools', '热门工具')}</h3>
          <a href="tools/json.html">${t('tools.json.name', 'JSON格式化')}</a>
          <a href="tools/md5.html">${t('tools.md5.name', 'MD5加密')}</a>
          <a href="tools/base64.html">${t('tools.base64.name', 'Base64编解码')}</a>
          <a href="tools/urlencode.html">${t('tools.urlencode.name', 'URL编解码')}</a>
          <a href="tools/timetran.html">${t('tools.timetran.name', '时间戳转换')}</a>
          <a href="tools/qrcode.html">${t('tools.qrcode.name', '二维码生成')}</a>
        </div>

        <div class="footer-section">
          <h3>${t('footer.toolCategories', '工具分类')}</h3>
          ${ToolsConfig.categories.slice(0, 6).map(cat => `
            <a href="#${cat.id}">${cat.icon} ${t('categories.' + cat.id, cat.title)}</a>
          `).join('')}
        </div>

        <div class="footer-section">
          <h3>${t('footer.contactTitle', '法律信息')}</h3>
          <a href="privacy-policy.html">📋 ${t('common.privacyPolicy', '隐私政策')}</a>
          <a href="terms-of-service.html">📜 ${t('common.termsOfService', '服务条款')}</a>
          <a href="about.html">ℹ️ ${t('common.aboutUs', '关于我们')}</a>
        </div>
      </div>

      <div class="footer-bottom">
        <div style="margin-bottom:8px;font-size:12px;color:var(--text-light);text-align:center;">
          📢 <strong>${t('footer.adDisclosure', '广告披露')}：</strong>${t('footer.adDisclosureText', '本网站使用 Google AdSense 展示广告。Google 可能使用 Cookie 来展示与您兴趣相关的广告。')}
          <a href="privacy-policy.html" style="color:var(--primary-color);">${t('common.learnMore', '了解详情')}</a>
        </div>
        <p>&copy; ${new Date().getFullYear()} ${t('siteName', '在线工具集')}. All rights reserved. | 
           ${t('footer.copyright', '本站所有工具免费使用，数据仅在本地处理')}</p>
      </div>
    </div>  `;
}

function copyToClipboard(text, successMessage) {
  if (!successMessage) {
    successMessage = (typeof I18N !== 'undefined' ? I18N.t('common.copySuccess') : null) || '复制成功！';
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage, 'success');
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showToast(successMessage, 'success');
  } catch (err) {
    showToast((typeof I18N !== 'undefined' ? I18N.t('common.copyFailed') : null) || '复制失败，请手动复制', 'error');
  }
  
  document.body.removeChild(textarea);
}

function showToast(message, type = 'info') {
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`${(typeof I18N !== 'undefined' ? I18N.t('common.fileDownloaded') : null) || '文件'} "${filename}" ${(typeof I18N !== 'undefined' ? I18N.t('common.downloaded') : null) || '已下载'}`, 'success');
}

const Utils = {
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const map = {
      'YYYY': d.getFullYear(),
      'MM': String(d.getMonth() + 1).padStart(2, '0'),
      'DD': String(d.getDate()).padStart(2, '0'),
      'HH': String(d.getHours()).padStart(2, '0'),
      'mm': String(d.getMinutes()).padStart(2, '0'),
      'ss': String(d.getSeconds()).padStart(2, '0')
    };
    
    let result = format;
    for (const [key, value] of Object.entries(map)) {
      result = result.replace(key, value);
    }
    return result;
  },

  generateId(prefix = '') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  unescapeHtml(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;

  if (typeof I18N !== 'undefined') {
    I18N.init();
  }

  loadNavbar(path);
  loadFooter();

  if (typeof SEO !== 'undefined') {
    SEO.init();
  }

  if (typeof CookieConsent !== 'undefined') {
    CookieConsent.init();
  } else {
    const script = document.createElement('script');
    script.src = (path.includes('/tools/') ? '../' : '') + 'js/cookie-consent.js';
    script.onload = function() {
      if (typeof CookieConsent !== 'undefined') CookieConsent.init();
    };
    document.head.appendChild(script);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    }
  });

  window.addEventListener('scroll', Utils.throttle(function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
      }
    }
  }, 100));
});
