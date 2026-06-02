const PerformanceOptimizer = {
  init() {
    this.preloadCriticalResources();
    this.setupLazyLoading();
    this.setupResourceHints();
  },

  preloadCriticalResources() {
    const criticalResources = [
      { rel: 'preload', href: '/css/common.css', as: 'style' },
      { rel: 'preload', href: '/js/common.js', as: 'script' },
      { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
      { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' }
    ];

    criticalResources.forEach(({ rel, href, as }) => {
      const link = document.createElement('link');
      link.rel = rel;
      if (as) link.as = as;
      link.href = href;
      
      if (!document.querySelector(`link[href="${href}"]`)) {
        document.head.appendChild(link);
      }
    });
  },

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  },

  setupResourceHints() {
    const hints = [
      { rel: 'prefetch', href: '/tools/md5.html' },
      { rel: 'prefetch', href: '/tools/json.html' },
      { rel: 'prefetch', href: '/tools/base64.html' }
    ];

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const isSlowConnection = connection.saveData || (connection.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType));
      
      if (isSlowConnection) {
        console.log('检测到慢速网络，减少预加载资源');
        return;
      }
    }

    hints.forEach(({ rel, href }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      document.head.appendChild(link);
    });
  },

  measurePerformance() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const [navigation] = performance.getEntriesByType('navigation');
          
          if (navigation) {
            const metrics = {
              DNS: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
              TCP: Math.round(navigation.connectEnd - navigation.connectStart),
              TTFB: Math.round(navigation.responseStart - navigation.requestStart),
              Download: Math.round(navigation.responseEnd - navigation.responseStart),
              DOMContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.responseStart),
              Load: Math.round(navigation.loadEventEnd - navigation.responseStart)
            };

            Object.entries(metrics).forEach(([name, value]) => {
              console.log(`%c⚡ ${name}: ${value}ms`, 'color: #409EFF; font-weight: bold;');
            });

            if (typeof gtag === 'function') {
              gtag('event', 'web_vitals', {
                event_category: 'Performance',
                value: metrics.Load
              });
            }
          }

          const paintMetrics = performance.getEntriesByType('paint');
          paintMetrics.forEach(paint => {
            console.log(`%c🎨 ${paint.name}: ${Math.round(paint.startTime)}ms`, 
                 paint.name === 'first-contentful-paint' ? 'color: #67C23A;' : 'color: #E6A23C;');
          });
        }, 0);
      });
    }
  },

  reportWebVitals() {
    if ('PerformanceObserver' in window) {
      try {
        const vitalsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            console.log(`%c📊 ${entry.name}: ${Math.round(entry.value)}ms`, 'color: #F56C6C; font-weight: bold;');
            
            if (entry.name === 'LCP') {
              document.body.classList.add(entry.value <= 2500 ? 'fast-lcp' : 'slow-lcp');
            }
          });
        });
        
        vitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        console.warn('Web Vitals monitoring not supported:', e);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PerformanceOptimizer.init();
  
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    PerformanceOptimizer.measurePerformance();
    PerformanceOptimizer.reportWebVitals();
  }
});
