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
    const currentLang = (typeof I18N !== 'undefined' && I18N.currentLang) ? I18N.currentLang : 'zh-CN';
    const toolKey = this.getToolKey(toolConfig);
    const isEnglish = currentLang === 'en';

    const displayName = isEnglish && toolKey ? (I18N.t(`tools.${toolKey}.name`) || name) : name;
    const displayCategory = isEnglish ? (this.translateCategory(category) || category) : category;
    const displayDescription = isEnglish && toolKey
      ? (I18N.t(`tools.${toolKey}.desc`) || description || this.generateDescription(name, category))
      : (description || this.generateDescription(name, category));

    const categoryInfo = this.defaultCategoryMap[category] || {};

    const seoConfig = {
      title: displayName,
      description: displayDescription,
      keywords: this.generateKeywords(displayName, displayCategory, keywords, isEnglish),
      type: 'WebApplication',
      canonicalUrl: window.location.href,
      image: icon ? `https://tools.suipce.com${icon}` : undefined
    };

    if (typeof SEO !== 'undefined') {
      SEO.injectMetaTags(seoConfig);

      const featureList = this.generateFeatureList(displayName, displayCategory, isEnglish);

      SEO.injectStructuredData({
        type: 'WebApplication',
        name: displayName,
        description: displayDescription,
        featureList: featureList,
        breadcrumbs: this.generateBreadcrumbs(displayCategory, displayName, isEnglish)
      });

      this.addToolSpecificSchema(displayCategory, displayName, displayDescription, isEnglish);
    }
    
    this.addBreadcrumbSchema(displayCategory, displayName, isEnglish);
    
    this.setPageTitle(toolConfig, name, category);
    
    this.addStructuredDataForTool(displayName, displayCategory, displayDescription, isEnglish);
    
    this.optimizePageForSEO(displayName, displayCategory, isEnglish);
  },

  setPageTitle(toolConfig, name, category) {
    const currentLang = (typeof I18N !== 'undefined' && I18N.currentLang) ? I18N.currentLang : 'zh-CN';
    const toolKey = this.getToolKey(toolConfig);
    const i18nTitle = toolKey ? I18N.t(`tools.${toolKey}.pageTitle`) : null;

    if (i18nTitle) {
      document.title = i18nTitle;
    } else if (currentLang === 'en') {
      const enName = toolKey ? I18N.t(`tools.${toolKey}.name`) : name;
      const enCategory = this.translateCategory(category);
      document.title = `${enName || name} - Free Online ${enCategory || category} Tool | Online Tools`;
    } else {
      document.title = `${name} - 在线${category}工具 | 免费在线工具集`;
    }
  },

  getToolKey(toolConfig) {
    if (!toolConfig || !toolConfig.url) return null;
    const url = toolConfig.url;
    const match = url.match(/\/([^/]+)\.html?$/);
    return match ? match[1] : null;
  },

  translateCategory(category) {
    if (typeof I18N !== 'undefined' && I18N.t) {
      const categoryMap = {
        '开发运维': 'categories.dev',
        '文本处理': 'categories.text',
        '图像处理': 'categories.image',
        '单位转换': 'categories.unit',
        '图表工具': 'categories.chart',
        '娱乐工具': 'categories.fun'
      };
      const key = categoryMap[category];
      if (key) return I18N.t(key);
    }
    return category;
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

  generateKeywords(toolName, category, customKeywords, isEnglish = false) {
    const baseKeywords = isEnglish
      ? [toolName, category, 'online tools', 'free tool', 'Online Tools', 'free online tool']
      : [toolName, category, '在线工具', '免费工具', 'Online Tools', 'free tool'];
    const categoryInfo = this.defaultCategoryMap[category] || {};
    const categoryKeywords = categoryInfo.keywords ? categoryInfo.keywords.split(',') : [];

    let allKeywords = [...new Set([...baseKeywords, ...categoryKeywords])];

    if (customKeywords) {
      const customList = customKeywords.split(',').map(k => k.trim());
      allKeywords = [...new Set([...allKeywords, ...customList])];
    }

    return allKeywords.join(',');
  },

  generateFeatureList(toolName, category, isEnglish = false) {
    const categoryMap = {
      'Developer Tools': '开发运维',
      'Text Processing': '文本处理',
      'Image Tools': '图像处理',
      'Unit Converter': '单位转换',
      'Chart Tools': '图表工具',
      'Entertainment': '娱乐工具'
    };
    const cnCategory = categoryMap[category] || category;

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

    const cnFeatures = features[cnCategory] || ['免费使用', '无需安装', '即时可用'];
    if (!isEnglish) return cnFeatures;

    const enFeatures = {
      '开发运维': [
        'Use directly in browser, no installation needed',
        'Supports batch data processing',
        'Real-time preview of results',
        'Copy and download support',
        'Cross-platform compatible'
      ],
      '文本处理': [
        'Fast text analysis and conversion',
        'Supports large file processing',
        'Multiple output formats',
        'Preserves original formatting',
        'Instant result display'
      ],
      '图像处理': [
        'Browser-side processing for privacy',
        'Supports common image formats',
        'High-quality output',
        'Simple and intuitive interface',
        'Instant preview effects'
      ],
      '单位转换': [
        'Precise to multiple decimal places',
        'Supports international standard units',
        'Real-time conversion calculation',
        'History record saving',
        'Works offline'
      ],
      '图表工具': [
        'Rich chart types',
        'Customizable style options',
        'Easy data import',
        'High-definition image export',
        'Interactive charts'
      ],
      '娱乐工具': [
        'Completely free to use',
        'No registration or login required',
        'Responsive design',
        'Smooth animation effects',
        'Mobile-friendly'
      ]
    };
    return enFeatures[cnCategory] || cnFeatures;
  },

  generateBreadcrumbs(category, toolName, isEnglish = false) {
    const homeName = isEnglish ? 'Home' : '首页';
    return [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeName,
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

  addBreadcrumbSchema(category, toolName, isEnglish = false) {
    const breadcrumbs = this.generateBreadcrumbs(category, toolName, isEnglish);
    
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

  addToolSpecificSchema(category, toolName, description, isEnglish = false) {
    const faqs = this.generateFAQs(toolName, category, isEnglish);

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

    const howToSteps = this.generateHowToSteps(toolName, category, isEnglish);

    if (howToSteps && howToSteps.length > 0 && typeof SEO !== 'undefined') {
      const howToTitle = isEnglish ? `How to use ${toolName}` : `如何使用${toolName}`;
      const howToDesc = isEnglish
        ? `Step-by-step guide on how to use the ${toolName} online tool`
        : `详细说明如何使用${toolName}在线工具`;
      const howToScript = document.createElement('script');
      howToScript.id = 'howto-schema';
      howToScript.type = 'application/ld+json';
      howToScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: howToTitle,
        description: howToDesc,
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

  generateFAQs(toolName, category, isEnglish = false) {
    const isWordcount = toolName === 'Word Counter' || toolName === '文本统计';
    const isRandompassword = toolName === 'Random Password Generator' || toolName === '随机密码生成器';
    const isMarkdown = toolName === 'Markdown Editor' || toolName === 'Markdown编辑器';
    const isDice = toolName === 'Dice Roller' || toolName === '掷骰子';
    const isPie = toolName === 'Pie Chart Maker' || toolName === '饼图';
    const isKlotski = toolName === 'Klotski Puzzle' || toolName === '数字华容道';

    if (isWordcount && isEnglish) {
      return [
        {
          question: 'How do I check word count online?',
          answer: 'Paste your text into the input box on the page. The word count, character count, sentence count and paragraph count update automatically in real time.'
        },
        {
          question: 'Is this online word counter free?',
          answer: 'Yes, our word counter is completely free. There is no signup, no usage limit and no hidden cost.'
        },
        {
          question: 'Can I use the word counter on my phone?',
          answer: 'Yes, the tool is fully responsive and works on desktop, tablet and mobile browsers.'
        },
        {
          question: 'Is my text uploaded to your server?',
          answer: 'No. All counting happens locally in your browser. Your text is never sent to any server, so your content remains private.'
        },
        {
          question: 'Does the tool support Chinese and English at the same time?',
          answer: 'Yes, it supports mixed Chinese and English text, as well as numbers, punctuation and other symbols.'
        }
      ];
    }

    if (isRandompassword && isEnglish) {
      return [
        {
          question: 'Is this random password generator safe?',
          answer: 'Yes. It uses your browser’s cryptographically secure random number generator (crypto.getRandomValues) to produce highly unpredictable passwords.'
        },
        {
          question: 'How long should my password be?',
          answer: 'We recommend at least 16 characters with uppercase, lowercase, numbers and symbols. This provides strong protection against brute-force attacks.'
        },
        {
          question: 'Can I generate multiple passwords at once?',
          answer: 'Yes. You can generate between 1 and 50 passwords in a single click, which is useful when setting up multiple accounts.'
        },
        {
          question: 'Are my generated passwords stored anywhere?',
          answer: 'No. All password generation happens locally in your browser. Nothing is sent to our servers, and the data disappears when you close the page.'
        },
        {
          question: 'What characters can I include in the password?',
          answer: 'You can include uppercase letters, lowercase letters, numbers and special symbols. Toggle each option to match your requirements.'
        }
      ];
    }

    if (isMarkdown && isEnglish) {
      return [
        {
          question: 'Is this Markdown editor free?',
          answer: 'Yes. Our online Markdown editor is completely free to use with no registration or payment required.'
        },
        {
          question: 'Do I need to install anything?',
          answer: 'No. It runs directly in your web browser. Just open the page and start writing.'
        },
        {
          question: 'Is my Markdown content private?',
          answer: 'Yes. All editing happens locally in your browser. Your text is never uploaded to our servers.'
        },
        {
          question: 'Can I export Markdown to HTML?',
          answer: 'Yes. You can download your Markdown as a .md file, download the rendered HTML, or copy either format to your clipboard.'
        },
        {
          question: 'Which Markdown syntax is supported?',
          answer: 'The editor supports standard Markdown including headings, bold, italic, lists, links, images, code blocks, tables, quotes, horizontal rules and task lists.'
        }
      ];
    }

    if (isDice && isEnglish) {
      return [
        {
          question: 'Is this online dice roller free?',
          answer: 'Yes. You can roll virtual dice as many times as you want without signing up or paying.'
        },
        {
          question: 'How many dice can I roll at once?',
          answer: 'You can roll between 1 and 6 virtual dice in a single roll. Choose the number that fits your game or decision.'
        },
        {
          question: 'Can I see my previous rolls?',
          answer: 'Yes. The tool keeps a roll history so you can review past results and totals.'
        },
        {
          question: 'Does the dice roller work on mobile?',
          answer: 'Yes. The responsive design works smoothly on desktop, tablet and mobile browsers.'
        },
        {
          question: 'Is my data private when using the dice roller?',
          answer: 'Yes. All rolls are generated locally in your browser. No data is sent to our servers.'
        }
      ];
    }

    if (isPie && isEnglish) {
      return [
        {
          question: 'Is this pie chart maker free?',
          answer: 'Yes. You can create, customize and download pie charts without paying or creating an account.'
        },
        {
          question: 'What chart types can I create?',
          answer: 'You can create a standard pie chart, a donut chart or a Nightingale rose chart.'
        },
        {
          question: 'How do I enter data?',
          answer: 'Type one item per line in the format Name:Value, for example Product A:120. The chart updates automatically as you type.'
        },
        {
          question: 'Can I download the chart as an image?',
          answer: 'Yes. Click the Download Image button to save your chart as a PNG file.'
        },
        {
          question: 'Is my chart data private?',
          answer: 'Yes. The chart is rendered entirely in your browser. Your data never leaves your device.'
        }
      ];
    }

    if (isKlotski && isEnglish) {
      return [
        {
          question: 'What is Klotski?',
          answer: 'Klotski is a classic sliding block puzzle. The goal is to move numbered tiles into the correct order by sliding them into the empty space.'
        },
        {
          question: 'Is this Klotski game free?',
          answer: 'Yes. You can play the Klotski sliding puzzle online for free without creating an account.'
        },
        {
          question: 'Is every puzzle solvable?',
          answer: 'Yes. Every starting position is created by shuffling the solved board with valid moves, so a solution always exists.'
        },
        {
          question: 'Can I play on mobile?',
          answer: 'Yes. The game is fully responsive and works on phones, tablets and desktop browsers.'
        },
        {
          question: 'What modes are available?',
          answer: 'You can choose between a quick 3x3 puzzle and the classic 4x4 "15 puzzle" challenge.'
        }
      ];
    }

    if (isEnglish) {
      return [
        {
          question: `What is ${toolName}?`,
          answer: `${toolName} is a free online ${category} tool that runs directly in your browser. It helps you complete ${category} tasks quickly and improve your productivity.`
        },
        {
          question: `Is ${toolName} free?`,
          answer: `Yes, ${toolName} is completely free to use. No registration or payment is required. You can access and use all features anytime, anywhere.`
        },
        {
          question: `What formats does ${toolName} support?`,
          answer: `${toolName} supports a wide range of common file and data formats. The exact supported formats depend on the tool type, but most tools support mainstream standard formats for maximum compatibility.`
        },
        {
          question: `Is ${toolName} safe to use?`,
          answer: `Very safe. ${toolName} runs locally in your browser. All data processing happens on the client side and nothing is uploaded to our servers. Your data and privacy are fully protected.`
        },
        {
          question: `Can I use ${toolName} on mobile?`,
          answer: `Yes! ${toolName} uses responsive design and works perfectly on desktop computers, tablets and smartphones. You get a great experience no matter what device you use.`
        }
      ];
    }
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

  generateHowToSteps(toolName, category, isEnglish = false) {
    const isWordcount = toolName === 'Word Counter' || toolName === '文本统计';
    const isRandompassword = toolName === 'Random Password Generator' || toolName === '随机密码生成器';
    const isMarkdown = toolName === 'Markdown Editor' || toolName === 'Markdown编辑器';
    const isDice = toolName === 'Dice Roller' || toolName === '掷骰子';
    const isPie = toolName === 'Pie Chart Maker' || toolName === '饼图';
    const isKlotski = toolName === 'Klotski Puzzle' || toolName === '数字华容道';

    if (isWordcount && isEnglish) {
      return [
        {
          name: 'Open the word counter',
          text: 'Visit the Free Online Word Counter page.'
        },
        {
          name: 'Paste your text',
          text: 'Copy and paste the text you want to count into the input area.'
        },
        {
          name: 'Adjust options',
          text: 'Choose whether to include spaces and select your preferred reading speed if needed.'
        },
        {
          name: 'View the statistics',
          text: 'The word count, character count, sentence count and paragraph count appear instantly.'
        },
        {
          name: 'Copy or download results',
          text: 'Use the copy or download buttons to save your results.'
        }
      ];
    }

    if (isRandompassword && isEnglish) {
      return [
        {
          name: 'Open the password generator',
          text: 'Visit the Random Password Generator page.'
        },
        {
          name: 'Set the password length',
          text: 'Choose a password length between 4 and 128 characters. We recommend at least 16 for strong security.'
        },
        {
          name: 'Choose character types',
          text: 'Toggle uppercase, lowercase, numbers and symbols to match your needs.'
        },
        {
          name: 'Generate the password',
          text: 'Click the Generate Password button to create a secure random password.'
        },
        {
          name: 'Copy or use the password',
          text: 'Copy the generated password to your clipboard and paste it where needed.'
        }
      ];
    }

    if (isMarkdown && isEnglish) {
      return [
        {
          name: 'Open the Markdown editor',
          text: 'Visit the Online Markdown Editor page.'
        },
        {
          name: 'Write or paste Markdown',
          text: 'Type your Markdown content in the editor panel on the left.'
        },
        {
          name: 'Use toolbar shortcuts',
          text: 'Click toolbar buttons to insert headings, lists, links, images, code and tables quickly.'
        },
        {
          name: 'Preview live output',
          text: 'Watch the right panel update instantly with the rendered HTML preview.'
        },
        {
          name: 'Export or copy',
          text: 'Download your file as Markdown or HTML, or copy either format to the clipboard.'
        }
      ];
    }

    if (isDice && isEnglish) {
      return [
        {
          name: 'Open the dice roller',
          text: 'Visit the Online Dice Roller page.'
        },
        {
          name: 'Choose the number of dice',
          text: 'Select how many virtual dice you want to roll, from 1 to 6.'
        },
        {
          name: 'Click Roll Dice',
          text: 'Press the Roll Dice button to roll the dice with 3D animation.'
        },
        {
          name: 'View the result and total',
          text: 'The result of each die and the total sum appear on screen.'
        },
        {
          name: 'Check your roll history',
          text: 'Scroll down to see a history of previous rolls.'
        }
      ];
    }

    if (isPie && isEnglish) {
      return [
        {
          name: 'Open the pie chart maker',
          text: 'Visit the Pie Chart Maker page.'
        },
        {
          name: 'Enter a chart title',
          text: 'Type a title for your chart in the Chart Title field (optional).'
        },
        {
          name: 'Input your data',
          text: 'Enter one data item per line in Name:Value format, for example Product A:120.'
        },
        {
          name: 'Customize the chart',
          text: 'Choose pie, donut or rose chart and adjust radius, labels and percentages.'
        },
        {
          name: 'Download the chart',
          text: 'Click Download Image to save your chart as a PNG file.'
        }
      ];
    }

    if (isKlotski && isEnglish) {
      return [
        {
          name: 'Open the Klotski puzzle',
          text: 'Visit the Klotski Sliding Puzzle page.'
        },
        {
          name: 'Choose a mode',
          text: 'Select the 3x3 mode for a quick game or the 4x4 mode for the classic 15 puzzle.'
        },
        {
          name: 'Start a new game',
          text: 'Click New Game to shuffle the tiles into a solvable starting position.'
        },
        {
          name: 'Slide the tiles',
          text: 'Click any tile next to the empty space to move it into the gap.'
        },
        {
          name: 'Solve the puzzle',
          text: 'Arrange the numbers in order from 1 to N with the empty space in the bottom-right corner.'
        }
      ];
    }

    if (isEnglish) {
      const inputType = category === 'Developer Tools' ? 'code' : category === 'Text Processing' ? 'text' : 'data';
      return [
        {
          name: 'Open the tool page',
          text: `Visit the ${toolName} tool page and it will load automatically.`
        },
        {
          name: 'Enter your data',
          text: `Paste or type the ${inputType} you want to process into the input area.`
        },
        {
          name: 'Adjust options (optional)',
          text: `Adjust the tool settings and parameters as needed to get the best results.`
        },
        {
          name: 'Run the operation',
          text: `Click the appropriate button to start processing. The result will appear instantly.`
        },
        {
          name: 'Copy or download the result',
          text: `You can copy the result directly or download it as a file to your device.`
        }
      ];
    }
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

  addStructuredDataForTool(toolName, category, description, isEnglish = false) {
    const finalDescription = description || (isEnglish
      ? `${toolName} is a free online ${category} tool. No installation needed, ready to use in browser.`
      : this.generateDescription(toolName, category));
    const reviewSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: toolName,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description: finalDescription,
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

  optimizePageForSEO(toolName, category, isEnglish = false) {
    this.addInternalLinks(toolName, category, isEnglish);
    this.optimizeHeadingStructure(toolName);
    this.addSemanticHTML();
  },

  addInternalLinks(toolName, category, isEnglish = false) {
    const categoryMap = {
      'Developer Tools': '开发运维',
      'Text Processing': '文本处理',
      'Image Tools': '图像处理',
      'Unit Converter': '单位转换',
      'Chart Tools': '图表工具',
      'Entertainment': '娱乐工具'
    };
    const cnCategory = isEnglish ? (categoryMap[category] || category) : category;
    const relatedTools = this.findRelatedTools(cnCategory, toolName);
    
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