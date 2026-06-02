let historyStack = [''];
let historyPosition = 0;
let isUserAction = true;

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('markdownInput');
    const preview = document.getElementById('markdownPreview');

    textarea.addEventListener('input', Utils.debounce(function() {
        if (isUserAction) {
            saveHistory();
        }
        renderMarkdown();
        updateCharCount();
    }, 150));

    textarea.addEventListener('scroll', function() {
        const previewEl = document.getElementById('markdownPreview');
        const percentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
        previewEl.scrollTop = percentage * (previewEl.scrollHeight - previewEl.clientHeight);
    });

    textarea.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    insertMd('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    insertMd('italic');
                    break;
                case 'z':
                    if (!e.shiftKey) {
                        e.preventDefault();
                        undoEdit();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    redoEdit();
                    break;
            }
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            insertAtCursor('    ');
        }
    });

    initResizer();
    renderMarkdown();
});

function initResizer() {
    const resizer = document.getElementById('resizer');
    const editorPanel = document.querySelector('.md-editor-panel');
    const previewPanel = document.querySelector('.md-preview-panel');

    let isResizing = false;

    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        const container = document.querySelector('.md-editor-container');
        const containerRect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width * 100);
        if (newWidth > 20 && newWidth < 80) {
            editorPanel.style.flex = `0 0 ${newWidth}%`;
            previewPanel.style.flex = `0 0 ${100 - newWidth}%`;
        }
    });

    document.addEventListener('mouseup', function() {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    });
}

function saveHistory() {
    const text = document.getElementById('markdownInput').value;
    if (historyStack[historyPosition] === text) return;

    historyStack = historyStack.slice(0, historyPosition + 1);
    historyStack.push(text);
    historyPosition = historyStack.length - 1;

    if (historyStack.length > 100) {
        historyStack.shift();
        historyPosition--;
    }
}

function undoEdit() {
    if (historyPosition > 0) {
        historyPosition--;
        isUserAction = false;
        document.getElementById('markdownInput').value = historyStack[historyPosition];
        renderMarkdown();
        updateCharCount();
        isUserAction = true;
    }
}

function redoEdit() {
    if (historyPosition < historyStack.length - 1) {
        historyPosition++;
        isUserAction = false;
        document.getElementById('markdownInput').value = historyStack[historyPosition];
        renderMarkdown();
        updateCharCount();
        isUserAction = true;
    }
}

function insertMd(type) {
    const textarea = document.getElementById('markdownInput');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let insertion = '';
    let cursorOffset = 0;

    switch (type) {
        case 'bold':
            insertion = `**${selectedText || '粗体文本'}**`;
            cursorOffset = selectedText ? insertion.length : 2;
            break;
        case 'italic':
            insertion = `*${selectedText || '斜体文本'}*`;
            cursorOffset = selectedText ? insertion.length : 1;
            break;
        case 'strikethrough':
            insertion = `~~${selectedText || '删除线文本'}~~`;
            cursorOffset = selectedText ? insertion.length : 2;
            break;
        case 'h1':
            insertion = `# ${selectedText || '一级标题'}`;
            cursorOffset = insertion.length;
            break;
        case 'h2':
            insertion = `## ${selectedText || '二级标题'}`;
            cursorOffset = insertion.length;
            break;
        case 'h3':
            insertion = `### ${selectedText || '三级标题'}`;
            cursorOffset = insertion.length;
            break;
        case 'ul':
            insertion = `- ${selectedText || '列表项'}`;
            cursorOffset = insertion.length;
            break;
        case 'ol':
            insertion = `1. ${selectedText || '有序列表项'}`;
            cursorOffset = insertion.length;
            break;
        case 'checklist':
            insertion = `- [ ] ${selectedText || '待办事项'}`;
            cursorOffset = insertion.length;
            break;
        case 'quote':
            insertion = `> ${selectedText || '引用内容'}`;
            cursorOffset = insertion.length;
            break;
        case 'code':
            insertion = `\`${selectedText || '代码'}\``;
            cursorOffset = selectedText ? insertion.length : 1;
            break;
        case 'codeblock':
            insertion = `\`\`\`javascript\n${selectedText || '// 在此输入代码'}\n\`\`\``;
            cursorOffset = 3;
            break;
        case 'link':
            insertion = `[${selectedText || '链接文字'}](url)`;
            cursorOffset = selectedText ? insertion.length - 4 : 1;
            break;
        case 'image':
            insertion = `![${selectedText || '图片描述'}](图片地址)`;
            cursorOffset = selectedText ? insertion.length - 6 : 2;
            break;
        case 'table':
            insertion = `| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容 | 内容 | 内容 |`;
            cursorOffset = insertion.length;
            break;
        case 'hr':
            insertion = `\n---\n`;
            cursorOffset = insertion.length;
            break;
    }

    textarea.value = textarea.value.substring(0, start) + insertion + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    saveHistory();
    renderMarkdown();
    updateCharCount();
}

function insertAtCursor(text) {
    const textarea = document.getElementById('markdownInput');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
    textarea.setSelectionRange(start + text.length, start + text.length);
    saveHistory();
    renderMarkdown();
}

function renderMarkdown() {
    const text = document.getElementById('markdownInput').value;
    const html = parseMarkdown(text);
    document.getElementById('markdownPreview').innerHTML = html;
}

function parseMarkdown(md) {
    if (!md) return '<p style="color:var(--text-light);padding:40px;text-align:center;">在左侧编辑器中输入 Markdown 内容，此处将实时显示渲染效果</p>';

    let html = Utils.escapeHtml(md);

    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');

    html = html.replace(/`(.*?)`/gim, '<code class="inline-code">$1</code>');

    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    html = html.replace(/^\-\s\[x\]\s(.*$)/gim, '<li class="task-done"><input type="checkbox" checked disabled> $1</li>');
    html = html.replace(/^\-\s\[\s\]\s(.*$)/gim, '<li class="task-todo"><input type="checkbox" disabled> $1</li>');
    html = html.replace(/^\-\s(.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\d+\.\s(.*$)/gim, '<li>$1</li>');

    html = html.replace(/\!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;">');
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    html = html.replace(/^---$/gim, '<hr>');

    html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, function(match, lang, code) {
        return `<pre class="code-block"><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    const lines = html.split('\n');
    let inList = false;
    let inBlockquote = false;
    let result = [];

    lines.forEach(line => {
        const trimmedLine = line.trim();

        if (/^<(li|blockquote|h[1-6]|hr|pre|img)/.test(trimmedLine)) {
            if (inList && !/^<li/.test(trimmedLine)) {
                result.push('</ul>');
                inList = false;
            }
            result.push(line);
        } else if (/^<li>/.test(trimmedLine)) {
            if (!inList) {
                result.push('<ul>');
                inList = true;
            }
            result.push(line);
        } else if (/^<blockquote>/.test(trimmedLine)) {
            if (!inBlockquote) {
                inBlockquote = true;
            }
            result.push(line);
        } else {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            if (trimmedLine !== '') {
                result.push('<p>' + line + '</p>');
            } else {
                result.push('');
            }
        }
    });

    if (inList) result.push('</ul>');

    html = result.join('\n');

    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    html = html.replace(/\n{2,}/g, '</p><p>');
    html = html.replace(/<p><(h[1-6]|ul|ol|blockquote|hr|pre|img)/g, '<$1');
    html = html.replace(/<\/(h[1-6]|ul|ol|blockquote|hr|pre)><\/p>/g, '</$1>');
    html = html.replace(/<p><\/p>/g, '');

    html = convertTable(html);

    return html;
}

function convertTable(html) {
    const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;

    return html.replace(tableRegex, function(match, header, body) {
        const headers = header.split('|').map(h => h.trim()).filter(h => h);
        const rows = body.trim().split('\n').map(row =>
            row.split('|').map(c => c.trim()).filter(c => c)
        );

        let tableHtml = '<table class="md-table"><thead><tr>';
        headers.forEach(h => {
            tableHtml += `<th>${h}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';

        rows.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => {
                tableHtml += `<td>${cell}</td>`;
            });
            tableHtml += '</tr>';
        });

        tableHtml += '</tbody></table>';
        return tableHtml;
    });
}

function updateCharCount() {
    const count = document.getElementById('markdownInput').value.length;
    document.getElementById('charCount').textContent = `${count.toLocaleString()} 字符`;
}

function clearAll() {
    document.getElementById('markdownInput').value = '';
    historyStack = [''];
    historyPosition = 0;
    renderMarkdown();
    updateCharCount();
    showToast('已清空编辑器内容', 'success');
}

function copyMd() {
    const text = document.getElementById('markdownInput').value;
    if (!text) {
        showToast('没有可复制的内容', 'error');
        return;
    }
    copyToClipboard(text, 'Markdown内容已复制到剪贴板');
}

function copyHtml() {
    const html = document.getElementById('markdownPreview').innerHTML;
    if (!html || html.includes('在左侧编辑器中输入')) {
        showToast('没有可复制的HTML内容', 'error');
        return;
    }
    copyToClipboard(html, 'HTML内容已复制到剪贴板');
}

function downloadMd() {
    const text = document.getElementById('markdownInput').value;
    if (!text) {
        showToast('没有可下载的内容', 'error');
        return;
    }
    downloadFile(text, 'document.md', 'text/markdown;charset=utf-8');
}

function downloadHtml() {
    const mdText = document.getElementById('markdownInput').value;
    if (!mdText) {
        showToast('没有可下载的内容', 'error');
        return;
    }

    const bodyContent = parseMarkdown(mdText);
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.8; color: #333; }
        h1, h2, h3 { color: #333; margin-top: 1.5em; }
        h1 { border-bottom: 2px solid #409EFF; padding-bottom: 0.3em; }
        h2 { border-bottom: 1px solid #e4e7ed; padding-bottom: 0.3em; }
        code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
        pre { background: #282c34; color: #abb2bf; padding: 16px; border-radius: 8px; overflow-x: auto; }
        pre code { background: none; padding: 0; color: inherit; }
        blockquote { border-left: 4px solid #409EFF; padding-left: 16px; margin: 16px 0; color: #666; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #ddd; padding: 10px 14px; text-align: left; }
        th { background: #f5f7fa; font-weight: 600; }
        tr:nth-child(even) { background: #fafafa; }
        a { color: #409EFF; }
        hr { border: none; border-top: 2px solid #e4e7ed; margin: 24px 0; }
        ul, ol { padding-left: 24px; }
        li { margin: 4px 0; }
        img { max-width: 100%; border-radius: 8px; }
        del { color: #999; }
    </style>
</head>
<body>${bodyContent}</body>
</html>`;

    downloadFile(fullHtml, 'document.html', 'text/html;charset=utf-8');
}

function loadExample() {
    const example = `# Markdown 编辑器示例

这是一个 **在线 Markdown 编辑器**，支持实时预览。

## 功能特性

- ✅ 实时预览
- ✅ 支持常用语法
- ✅ 工具栏快捷操作
- ✅ 导出为 MD 或 HTML

### 代码示例

\`\`\`javascript
function hello(name) {
    console.log(\`Hello, \${name}!\`);
}
hello('World');
\`\`\`

### 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| 标题 | ✅ | 支持 H1-H3 |
| 列表 | ✅ | 有序/无序/任务 |
| 代码 | ✅ | 行内/代码块 |
| 表格 | ✅ | 完整支持 |

### 引用

> 这是一段引用文字。
> 可以包含多行内容。

---

*祝您使用愉快！ 🎉*
`;

    document.getElementById('markdownInput').value = example;
    saveHistory();
    renderMarkdown();
    updateCharCount();
    showToast(I18N.t('common.success'), 'info');
}
