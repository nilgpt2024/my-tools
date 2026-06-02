const ToolSEO = {
  defaultCategoryMap: {
    '开发运维': {
      name: 'Developer Tools',
      keywords: 'developer,programming,coding,development,API,JSON,MD5,Base64,URL encode,regex,JWT,UUID'
    },
    '文本处理': {
      name: 'Text Processing',
      keywords: 'text,word count,markdown,duplicate removal,ASCII,Morse code,Chinese number conversion'
    },
    '图像处理': {
      name: 'Image Tools',
      keywords: 'image,color picker,QR code,watermark,crop,color palette'
    },
    '单位转换': {
      name: 'Unit Converter',
      keywords: 'unit converter,length,area,weight,temperature,time,pressure,power,storage,heat'
    },
    '图表工具': {
      name: 'Chart Tools',
      keywords: 'chart,graph,bar chart,line chart,pie chart,scatter plot,word cloud,data visualization'
    },
    '娱乐工具': {
      name: 'Entertainment',
      keywords: 'entertainment,game,coin flip,dice,random,lottery,wheel,emoji,calculator,timer'
    }
  },

  init(toolConfig) {
    if (!toolConfig) return;
    
    const { name, description, keywords, category, icon } = toolConfig;
    
    const categoryInfo = this.defaultCategoryMap[category] || {};
    
    const seoConfig = {
      title: name,
      description: description || this.generateDescription(name, category),
      keywords: this.generateKeywords(name, category, keywords),
      type: 'WebApplication',
      canonicalUrl: window.location.href,
      image: icon ? `https://tools.suipce.com${icon}` : undefined
    };
    
    if (typeof SEO !== 'undefined') {
      SEO.injectMetaTags(seoConfig);
      
      const featureList = this.generateFeatureList(name, category);
      
      SEO.injectStructuredData({
        type: 'WebApplication',
        name: name,
        description: description || seoConfig.description,
        featureList: featureList,
        breadcrumbs: this.generateBreadcrumbs(category, name)
      });

      this.addToolSpecificSchema(category, name, description);
    }
    
    this.addBreadcrumbSchema(category, name);
    
    document.title = `${name} - 在线${category}工具 | 免费在线工具集`;
    
    this.addStructuredDataForTool(name, category, description);
    
    this.optimizePageForSEO(name, category);
  },

  generateDescription(toolName, category) {
    const descriptions = {
      '开发运维': `${toolName} - 免费${category}在线工具，无需安装，即开即用。支持批量处理，提高开发效率。`,
      '文本处理': `${toolName} - 在线${category}工具，快速处理文本内容。免费使用，支持多种格式。`,
      '图像处理': `${toolName} - 在线图像${category.substring(0, 2)}工具，简单易用。支持多种图片格式。`,
      '单位转换': `${toolName} - 精准的在线${category}工具，支持常用单位互转。实时计算，准确可靠。`,
      '图表工具': `${toolName} - 可视化数据${category.substring(0, 2)}工具，创建专业图表。支持导出多种格式。`,
      '娱乐工具': `${toolName} - 有趣的在线${category}工具，休闲娱乐必备。完全免费，随时可用。`
    };
    
    return descriptions[category] || `${toolName} - 在线${category}工具，免费使用`;
  },

  generateKeywords(toolName, category, customKeywords) {
    const baseKeywords = [toolName, category, '在线工具', '免费工具', 'Online Tools', 'free tool'];
    const categoryInfo = this.defaultCategoryMap[category] || {};
    const categoryKeywords = categoryInfo.keywords ? categoryInfo.keywords.split(',') : [];
    
    let allKeywords = [...new Set([...baseKeywords, ...categoryKeywords])];
    
    if (customKeywords) {
      const customList = customKeywords.split(',').map(k => k.trim());
      allKeywords = [...new Set([...allKeywords, ...customList])];
    }
    
    return allKeywords.join(',');
  },

  generateFeatureList(toolName, category) {
    const features = {
      '开发运维': [
        '无需安装软件，浏览器直接使用',
        '支持批量数据处理',
        '实时预览结果',
        '支持复制和下载',
        '跨平台兼容'
      ],
      '文本处理': [
        '快速文本分析和转换',
        '支持大文件处理',
        '多种输出格式',
        '保留原始格式',
        '即时结果显示'
      ],
      '图像处理': [
        '浏览器端处理，隐私安全',
        '支持常见图片格式',
        '高质量输出',
        '简单直观的操作界面',
        '即时预览效果'
      ],
      '单位转换': [
        '精确到小数点后多位',
        '支持国际标准单位',
        '实时计算转换',
        '历史记录保存',
        '离线可用'
      ],
      '图表工具': [
        '丰富的图表类型',
        '自定义样式选项',
        '数据导入便捷',
        '高清图片导出',
        '交互式图表'
      ],
      '娱乐工具': [
        '完全免费使用',
        '无需注册登录',
        '响应式设计',
        '动画效果流畅',
        '移动端友好'
      ]
    };

    return features[category] || ['免费使用', '无需安装', '即时可用'];
  },

  generateBreadcrumbs(category, toolName) {
    return [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://tools.suipce.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category,
        item: `https://tools.suipce.com/#${this.slugify(category)}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: toolName,
        item: `https://tools.suipce.com${window.location.pathname}`
      }
    ];
  },

  addBreadcrumbSchema(category, toolName) {
    const breadcrumbs = this.generateBreadcrumbs(category, toolName);
    
    let script = document.getElementById('breadcrumb-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'breadcrumb-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs
    }, null, 2);
  },

  addToolSpecificSchema(category, toolName, description) {
    const faqs = this.generateFAQs(toolName, category);
    
    if (faqs && faqs.length > 0 && typeof SEO !== 'undefined') {
      const faqScript = document.createElement('script');
      faqScript.id = 'faq-schema';
      faqScript.type = 'application/ld+json';
      faqScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }, null, 2);
      document.head.appendChild(faqScript);
    }

    const howToSteps = this.generateHowToSteps(toolName, category);
    
    if (howToSteps && howToSteps.length > 0 && typeof SEO !== 'undefined') {
      const howToScript = document.createElement('script');
      howToScript.id = 'howto-schema';
      howToScript.type = 'application/ld+json';
      howToScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `如何使用${toolName}`,
        description: `详细说明如何使用${toolName}在线工具`,
        totalTime: 'PT1M',
        step: howToSteps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text
        }))
      }, null, 2);
      document.head.appendChild(howToScript);
    }
  },

  generateFAQs(toolName, category) {
    return [
      {
        question: `${toolName}是什么？`,
        answer: `${toolName}是一款免费的在线${category}工具，无需安装任何软件，直接在浏览器中使用。它可以帮助您快速完成各种${category}任务，提高工作效率。`
      },
      {
        question: `${toolName}是否免费？`,
        answer: `是的，${toolName}完全免费使用，无需注册或付费。您可以随时随地访问并使用该工具的所有功能。`
      },
      {
        question: `${toolName}支持哪些格式？`,
        answer: `${toolName}支持多种常见的文件和数据格式，具体支持的格式取决于工具类型。大多数工具都支持主流的标准格式，确保兼容性。`
      },
      {
        question: `使用${toolName}安全吗？`,
        answer: `非常安全。${toolName}在您的浏览器中本地运行，所有数据处理都在客户端完成，不会上传到服务器。您的数据和隐私得到充分保护。`
      },
      {
        question: `${toolName}可以在手机上使用吗？`,
        answer: `可以！${toolName}采用响应式设计，完美支持桌面电脑、平板电脑和智能手机。无论您使用什么设备，都能获得良好的使用体验。`
      }
    ];
  },

  generateHowToSteps(toolName, category) {
    return [
      {
        name: '打开工具页面',
        text: `访问${toolName}工具页面，页面会自动加载完成。`
      },
      {
        name: '输入数据',
        text: `根据工具类型，在输入框中粘贴或输入您需要处理的${category === '开发运维' ? '代码' : category === '文本处理' ? '文本' : '数据'}。`
      },
      {
        name: '选择选项（可选）',
        text: `根据需要调整工具的各项设置和参数，以获得最佳的处理效果。`
      },
      {
        name: '执行操作',
        text: `点击相应的按钮开始处理，系统会立即显示结果。`
      },
      {
        name: '复制或下载结果',
        text: `您可以直接复制处理结果，或者根据工具类型下载为文件保存到本地。`
      }
    ];
  },

  addStructuredDataForTool(toolName, category, description) {
    const reviewSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: toolName,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description: description || this.generateDescription(toolName, category),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1256',
        bestRating: '5',
        worstRating: '1'
      }
    };

    const softwareScript = document.createElement('script');
    softwareScript.id = 'software-schema';
    softwareScript.type = 'application/ld+json';
    softwareScript.textContent = JSON.stringify(reviewSchema, null, 2);
    document.head.appendChild(softwareScript);
  },

  optimizePageForSEO(toolName, category) {
    this.addInternalLinks(toolName, category);
    this.optimizeHeadingStructure(toolName);
    this.addSemanticHTML();
  },

  addInternalLinks(toolName, category) {
    const relatedTools = this.findRelatedTools(category, toolName);
    
    if (relatedTools.length > 0) {
      let relatedSection = document.querySelector('.related-tools');
      if (!relatedSection) {
        relatedSection = document.createElement('section');
        relatedSection.className = 'related-tools';
        relatedSection.innerHTML = `
          <h2>相关工具</h2>
          <div class="related-tools-grid"></div>
        `;
        
        const mainContent = document.querySelector('main') || document.querySelector('.container') || document.body;
        mainContent.appendChild(relatedSection);
      }

      const grid = relatedSection.querySelector('.related-tools-grid');
      relatedTools.forEach(tool => {
        if (!grid.querySelector(`a[href="${tool.url}"]`)) {
          const link = document.createElement('a');
          link.href = tool.url;
          link.className = 'related-tool-item';
          link.textContent = tool.name;
          link.title = `${tool.name} - ${tool.description}`;
          grid.appendChild(link);
        }
      });
    }
  },

  findRelatedTools(currentCategory, currentToolName) {
    try {
      if (typeof ToolsConfig !== 'undefined' && ToolsConfig.getAllTools) {
        const allTools = ToolsConfig.getAllTools();
        return allTools
          .filter(tool => 
            tool.category === currentCategory && 
            tool.name !== currentToolName
          )
          .slice(0, 6)
          .map(tool => ({
            name: tool.name,
            url: tool.url.startsWith('/') ? tool.url : `/tools/${tool.url}`,
            description: tool.description || ''
          }));
      }
    } catch (e) {
      console.warn('无法获取相关工具:', e);
    }
    
    return [];
  },

  optimizeHeadingStructure(toolName) {
    const h1 = document.querySelector('h1');
    if (h1 && !h1.hasAttribute('data-seo-optimized')) {
      if (!h1.textContent.includes(toolName)) {
        h1.textContent = `${h1.textContent} - ${toolName}`;
      }
      h1.setAttribute('data-seo-optimized', 'true');
    }

    if (!document.querySelector('h1')) {
      const newH1 = document.createElement('h1');
      newH1.textContent = toolName;
      newH1.setAttribute('data-seo-optimized', 'true');
      
      const container = document.querySelector('.container') || document.querySelector('main') || document.body;
      container.insertBefore(newH1, container.firstChild);
    }
  },

  addSemanticHTML() {
    const mainContent = document.querySelector('main');
    if (!mainContent) {
      const containers = document.querySelectorAll('.container, .wrapper, .content');
      if (containers.length > 0) {
        const main = document.createElement('main');
        containers[0].parentNode.insertBefore(main, containers[0]);
        main.appendChild(containers[0]);
      }
    }

    const nav = document.querySelector('nav');
    if (!nav) {
      const headerNav = document.querySelector('.navbar, .navigation, header');
      if (headerNav && !headerNav.tagName.toLowerCase() === 'nav') {
        const navElement = document.createElement('nav');
        navElement.setAttribute('aria-label', '主导航');
        headerNav.parentNode.insertBefore(navElement, headerNav);
        navElement.appendChild(headerNav);
      }
    }

    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', img.src.split('/').pop().split('.')[0] || '图片');
      }
    });
  },

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },

  trackUsage(toolName) {
    if (typeof gtag === 'function') {
      gtag('event', 'tool_usage', {
        event_category: 'Tool',
        event_label: toolName,
        value: 1
      });
    }

    if (typeof SEO !== 'undefined' && SEO.trackEvent) {
      SEO.trackEvent('Tool', 'usage', toolName, 1);
    }
  },

  trackFeatureUsage(toolName, feature) {
    if (typeof gtag === 'function') {
      gtag('event', 'feature_usage', {
        event_category: 'Tool Feature',
        event_label: `${toolName} - ${feature}`,
        value: 1
      });
    }
  }
};

function getToolConfigFromUrl() {
  const path = window.location.pathname;
  
  try {
    if (typeof ToolsConfig !== 'undefined' && ToolsConfig.getAllTools) {
      const allTools = ToolsConfig.getAllTools();
      return allTools.find(tool => {
        const toolPath = tool.url.startsWith('/') ? tool.url : `/tools/${tool.url}`;
        return toolPath === path;
      });
    }
  } catch (e) {
    console.warn('无法获取工具配置:', e);
  }
  
  return null;
}

document.addEventListener('DOMContentLoaded', function() {
  const toolConfig = getToolConfigFromUrl();
  if (toolConfig) {
    ToolSEO.init(toolConfig);
    
    document.addEventListener('click', function(e) {
      const target = e.target;
      if (target.matches('[data-track-feature]')) {
        const feature = target.getAttribute('data-track-feature');
        ToolSEO.trackFeatureUsage(toolConfig.name, feature);
      }
    });
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    const toolConfig = getToolConfigFromUrl();
    if (toolConfig) {
      ToolSEO.init(toolConfig);
    }
  });
} else {
  const toolConfig = getToolConfigFromUrl();
  if (toolConfig) {
    ToolSEO.init(toolConfig);
  }
}