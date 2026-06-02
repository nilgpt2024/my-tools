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
    this.addSecurityHeaders();
    this.optimizeForCoreWebVitals();
  },

  injectMetaTags(pageConfig = {}) {
    const { siteName, siteUrl, ogImage, twitterHandle } = this.config;
    const {
      title,
      description,
      keywords,
      ogType = 'website',
      canonicalUrl,
      noIndex = false,
      author,
      publishedDate,
      modifiedDate,
      image
    } = pageConfig;

    const fullTitle = title ? `${title} - ${siteName}` : siteName;
    const fullDescription = description || '免费、实用的在线工具集合，提供开发运维、文本处理、图像处理等60+在线工具';
    const url = canonicalUrl || `${siteUrl}${window.location.pathname}`;
    const finalImage = image || `${siteUrl}${ogImage}`;

    const metaTags = [
      { name: 'description', content: fullDescription },
      { name: 'keywords', content: keywords || '在线工具,JSON格式化,MD5加密,Base64,URL编码,开发工具,Online Tools' },
      { name: 'author', content: author || siteName },
      { name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' },
      { name: 'googlebot', content: noIndex ? 'noindex, nofollow' : 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'charset', content: 'UTF-8' },
      { name: 'theme-color', content: '#409EFF' },
      
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: fullDescription },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: url },
      { property: 'og:image', content: finalImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${siteName} - ${fullDescription}` },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: this.config.locale },
      { property: 'og:locale:alternate', content: this.config.alternateLocale },
      
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: fullDescription },
      { name: 'twitter:image', content: finalImage },
      { name: 'twitter:site', content: twitterHandle }
    ];

    if (publishedDate) {
      metaTags.push({ property: 'article:published_time', content: publishedDate });
    }

    if (modifiedDate) {
      metaTags.push({ property: 'article:modified_time', content: modifiedDate });
    }

    metaTags.forEach(meta => {
      this.setMetaTag(meta);
    });

    this.setCanonicalUrl(url);
    
    if (title || fullTitle) {
      document.title = fullTitle;
    }
  },

  setMetaTag({ name, property, content }) {
    if (!content) return;

    let meta;
    if (name === 'charset') {
      meta = document.querySelector('meta[charset]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('charset', content);
        document.head.insertBefore(meta, document.head.firstChild);
      }
      return;
    }

    if (name === 'viewport') {
      meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
      return;
    }

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

  addSecurityHeaders() {
    const securityMeta = [
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'referrer-policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityMeta.forEach(meta => {
      let element;
      if (meta['http-equiv']) {
        element = document.querySelector(`meta[http-equiv="${meta['http-equiv']}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('http-equiv', meta['http-equiv']);
          document.head.appendChild(element);
        }
      } else if (meta.name) {
        element = document.querySelector(`meta[name="${meta.name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.name = meta.name;
          document.head.appendChild(element);
        }
      }
      if (element && meta.content) {
        element.setAttribute('content', meta.content);
      }
    });
  },

  optimizeForCoreWebVitals() {
    const preloadHints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' }
    ];

    preloadHints.forEach(hint => {
      if (!document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`)) {
        const link = document.createElement('link');
        Object.keys(hint).forEach(key => {
          link.setAttribute(key, hint[key]);
        });
        document.head.insertBefore(link, document.head.firstChild);
      }
    });

    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img:not([loading])').forEach(img => {
        img.loading = 'lazy';
      });
    }
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
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              availableLanguage: ['Chinese', 'English']
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
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          },
          aggregateRating: pageConfig.aggregateRating || null,
          browserRequirements: 'Requires JavaScript. Requires HTML5.',
          featureList: pageConfig.featureList || [],
          ...customData
        };
        
        if (!structuredData.aggregateRating) {
          delete structuredData.aggregateRating;
        }
        break;

      case 'BreadcrumbList':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: pageConfig.breadcrumbs || []
        };
        break;

      case 'FAQPage':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: (pageConfig.faqs || []).map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          })),
          ...customData
        };
        break;

      case 'HowTo':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: pageConfig.name || '',
          description: pageConfig.description || '',
          totalTime: pageConfig.totalTime || 'PT1M',
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: '0'
          },
          step: (pageConfig.steps || []).map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
            image: step.image || undefined
          })).filter(step => step.image !== undefined || true),
          ...customData
        };
        break;

      case 'Article':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: pageConfig.title || '',
          description: pageConfig.description || '',
          image: pageConfig.image ? [pageConfig.image] : [],
          author: {
            '@type': 'Organization',
            name: siteName
          },
          publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}${ogImage}`
            }
          },
          datePublished: pageConfig.publishedDate || new Date().toISOString(),
          dateModified: pageConfig.modifiedDate || new Date().toISOString(),
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}${window.location.pathname}`
          },
          ...customData
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

  generateFAQSchema(faqs) {
    return {
      type: 'FAQPage',
      faqs: faqs
    };
  },

  generateHowToSchema(steps) {
    return {
      type: 'HowTo',
      steps: steps
    };
  },

  trackPageView(toolName) {
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: toolName,
        page_location: window.location.href
      });
    }
  },

  trackEvent(category, action, label, value) {
    if (typeof gtag === 'function') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  },

  updateLastModified() {
    const lastModified = new Date().toISOString();
    this.setMetaTag({
      name: 'last-modified',
      content: lastModified
    });
    return lastModified;
  },

  addOpenGraphAudio(audioUrl, secureUrl) {
    this.setMetaTag({ property: 'og:audio', content: audioUrl });
    if (secureUrl) {
      this.setMetaTag({ property: 'og:audio:secure_url', content: secureUrl });
    }
    this.setMetaTag({ property: 'og:audio:type', content: 'audio/mpeg' });
  },

  addOpenGraphVideo(videoUrl, secureUrl) {
    this.setMetaTag({ property: 'og:video', content: videoUrl });
    if (secureUrl) {
      this.setMetaTag({ property: 'og:video:secure_url', content: secureUrl });
    }
    this.setMetaTag({ property: 'og:video:type', content: 'video/mp4' });
  }
};