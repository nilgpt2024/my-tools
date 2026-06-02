const ToolSEO = {
  init(toolConfig) {
    if (!toolConfig) return;
    
    const { name, description, keywords, category, icon } = toolConfig;
    
    const seoConfig = {
      title: name,
      description: description || `${name} - 在线${category}工具，免费使用`,
      keywords: `${name},${category},在线工具,免费工具,Online Tools`,
      type: 'WebApplication',
      canonicalUrl: window.location.href
    };
    
    if (typeof SEO !== 'undefined') {
      SEO.injectMetaTags(seoConfig);
      
      SEO.injectStructuredData({
        type: 'WebApplication',
        name: name,
        description: description || seoConfig.description,
        breadcrumbs: this.generateBreadcrumbs(category, name)
      });
    }
    
    this.addBreadcrumbSchema(category, name);
    
    document.title = `${name} - ${name}在线工具 | 在线工具集`;
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
        item: `https://tools.suipce.com/#categories`
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

  trackUsage(toolName) {
    if (typeof gtag === 'function') {
      gtag('event', 'tool_usage', {
        event_category: 'Tool',
        event_label: toolName,
        value: 1
      });
    }
  }
};

function getToolConfigFromUrl() {
  const path = window.location.pathname;
  const allTools = ToolsConfig.getAllTools();
  return allTools.find(tool => tool.url === path.replace(/^\//, ''));
}

document.addEventListener('DOMContentLoaded', function() {
  const toolConfig = getToolConfigFromUrl();
  if (toolConfig) {
    ToolSEO.init(toolConfig);
  }
});
