const SEO = {
  defaultConfig: {
    siteName: '在线工具集 | Online Tools Hub',
    siteUrl: 'https://tools.suipce.com',
    locale: 'zh-CN',
    alternateLocale: 'en',
    ogImage: '/assets/images/logo.png',
    twitterHandle: '@yourhandle'
  },

  init(config = {}) {
    this.config = { ...this.defaultConfig, ...config };
    this.injectMetaTags();
    this.injectStructuredData();
    this.addHreflangLinks();
  },

  injectMetaTags(pageConfig = {}) {
    const { siteName, siteUrl, ogImage, twitterHandle } = this.config;
    const {
      title,
      description,
      keywords,
      ogType = 'website',
      canonicalUrl,
      noIndex = false
    } = pageConfig;

    const fullTitle = title ? `${title} - ${siteName}` : siteName;
    const fullDescription = description || '免费、实用的在线工具集合，提供开发运维、文本处理、图像处理等60+在线工具';
    const url = canonicalUrl || `${siteUrl}${window.location.pathname}`;

    const metaTags = [
      { name: 'description', content: fullDescription },
      { name: 'keywords', content: keywords || '在线工具,JSON格式化,MD5加密,Base64,URL编码,开发工具,Online Tools' },
      { name: 'author', content: siteName },
      { name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' },
      { name: 'googlebot', content: noIndex ? 'noindex, nofollow' : 'index, follow' },
      
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: fullDescription },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${siteUrl}${ogImage}` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: this.config.locale },
      { property: 'og:locale:alternate', content: this.config.alternateLocale },
      
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: fullDescription },
      { name: 'twitter:image', content: `${siteUrl}${ogImage}` },
      { name: 'twitter:site', content: twitterHandle }
    ];

    metaTags.forEach(meta => {
      this.setMetaTag(meta);
    });

    this.setCanonicalUrl(url);
    document.title = fullTitle;
  },

  setMetaTag({ name, property, content }) {
    if (!content) return;

    let meta;
    if (name) {
      meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
    } else if (property) {
      meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
    }

    if (meta) {
      meta.setAttribute('content', content);
    }
  },

  setCanonicalUrl(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  },

  addHreflangLinks() {
    const { siteUrl } = this.config;
    const basePath = window.location.pathname;

    const locales = [
      { hreflang: 'zh-CN', url: `${siteUrl}${basePath}?lang=zh-CN` },
      { hreflang: 'en', url: `${siteUrl}${basePath}?lang=en` },
      { hreflang: 'x-default', url: `${siteUrl}${basePath}` }
    ];

    locales.forEach(({ hreflang, url }) => {
      let link = document.querySelector(`link[hreflang="${hreflang}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = url;
    });
  },

  injectStructuredData(pageConfig = {}) {
    const { siteName, siteUrl, ogImage } = this.config;
    const { type = 'WebSite', ...customData } = pageConfig;

    let structuredData;

    switch (type) {
      case 'WebSite':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: siteUrl,
          description: '免费、实用的在线工具集合，提供60+常用在线工具',
          inLanguage: [this.config.locale, this.config.alternateLocale],
          image: `${siteUrl}${ogImage}`,
          publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}${ogImage}`
            }
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${siteUrl}/?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          },
          ...customData
        };
        break;

      case 'WebApplication':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: pageConfig.name || siteName,
          url: `${siteUrl}${window.location.pathname}`,
          description: pageConfig.description || '',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          browserRequirements: 'Requires JavaScript. Requires HTML5.',
          ...customData
        };
        break;

      case 'BreadcrumbList':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: pageConfig.breadcrumbs || []
        };
        break;

      default:
        structuredData = customData;
    }

    let script = document.getElementById('structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(structuredData, null, 2);
  },

  generateBreadcrumbs(items) {
    return items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }));
  },

  trackPageView(toolName) {
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: toolName,
        page_location: window.location.href
      });
    }
  }
};
