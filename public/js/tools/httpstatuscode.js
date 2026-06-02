const httpStatusCodes = [
  { code: 100, name: 'Continue', desc: '服务器已收到请求的初始部分，客户端应继续发送请求的其余部分', descEn: 'The server has received the request headers, and the client should proceed to send the request body' },
  { code: 101, name: 'Switching Protocols', desc: '服务器根据客户端请求切换协议', descEn: 'The server is switching protocols as requested by the client' },
  { code: 102, name: 'Processing', desc: 'WebDAV请求可能需要很长时间才能完成', descEn: 'WebDAV request may take a long time to complete' },
  { code: 103, name: 'Early Hints', desc: '用于在最终HTTP消息之前返回一些响应头', descEn: 'Used to return some response headers before the final HTTP message' },

  { code: 200, name: 'OK', desc: '请求成功，请求的数据在响应体中返回', descEn: 'Request succeeded, the requested data is returned in the response body' },
  { code: 201, name: 'Created', desc: '请求成功并创建了新资源', descEn: 'Request succeeded and a new resource was created' },
  { code: 202, name: 'Accepted', desc: '请求已被接受，但尚未处理完成', descEn: 'Request has been accepted for processing, but not yet completed' },
  { code: 203, name: 'Non-Authoritative Information', desc: '请求成功，但返回的信息可能来自其他来源', descEn: 'Request succeeded, but returned information may be from another source' },
  { code: 204, name: 'No Content', desc: '请求成功，但没有返回内容', descEn: 'Request succeeded but no content is returned' },
  { code: 206, name: 'Partial Content', desc: '服务器成功处理了部分GET请求（范围请求）', descEn: 'Server successfully processed a partial GET request (range request)' },

  { code: 301, name: 'Moved Permanently', desc: '资源被永久移动到新位置，以后应使用新URI访问', descEn: 'Resource moved permanently to a new URI, future requests should use the new URI' },
  { code: 302, name: 'Found', desc: '资源临时移动到新位置，客户端应继续使用原始URI', descEn: 'Resource temporarily moved to a new location, client should continue using original URI' },
  { code: 303, name: 'See Other', desc: '资源存在于另一个URI，应使用GET方法获取', descEn: 'Resource can be found at a different URI, should be retrieved using GET method' },
  { code: 304, name: 'Not Modified', desc: '资源未修改，可使用缓存版本', descEn: 'Resource has not modified, cached version can be used' },
  { code: 307, name: 'Temporary Redirect', desc: '资源临时重定向，方法和主体不变', descEn: 'Resource temporarily redirected, method and body unchanged' },
  { code: 308, name: 'Permanent Redirect', desc: '资源永久重定向，方法和主体不变', descEn: 'Resource permanently redirected, method and body unchanged' },

  { code: 400, name: 'Bad Request', desc: '服务器无法理解请求的语法', descEn: 'Server could not understand the request syntax' },
  { code: 401, name: 'Unauthorized', desc: '请求需要身份验证', descEn: 'Authentication is required for this request' },
  { code: 403, name: 'Forbidden', desc: '服务器拒绝执行请求，无权限访问', descEn: 'Server refused to execute the request, access forbidden' },
  { code: 404, name: 'Not Found', desc: '服务器找不到请求的资源', descEn: 'Server cannot find the requested resource' },
  { code: 405, name: 'Method Not Allowed', desc: '请求方法不被允许', descEn: 'Request method is not allowed for this resource' },
  { code: 406, name: 'Not Acceptable', desc: '服务器无法生成客户端可接受的内容', descEn: 'Server cannot generate content acceptable to the client' },
  { code: 408, name: 'Request Timeout', desc: '服务器等待请求超时', descEn: 'Server timed out waiting for the request' },
  { code: 409, name: 'Conflict', desc: '请求与当前资源状态冲突', descEn: 'Request conflicts with current state of the resource' },
  { code: 410, name: 'Gone', desc: '资源已永久删除', descEn: 'Resource is permanently deleted' },
  { code: 413, name: 'Payload Too Large', desc: '请求实体过大', descEn: 'Request payload is too large' },
  { code: 414, name: 'URI Too Long', desc: '请求的URI过长', descEn: 'Request URI is too long' },
  { code: 415, name: 'Unsupported Media Type', desc: '请求的媒体格式不被支持', descEn: 'Requested media format is not supported' },
  { code: 422, name: 'Unprocessable Entity', desc: '请求格式正确但语义错误', descEn: 'Request format is correct but contains semantic errors' },
  { code: 429, name: 'Too Many Requests', desc: '请求次数超过限制（限流）', descEn: 'Request count exceeded rate limit (throttled)' },

  { code: 500, name: 'Internal Server Error', desc: '服务器内部错误，无法完成请求', descEn: 'Internal server error, unable to complete the request' },
  { code: 501, name: 'Not Implemented', desc: '服务器不支持请求的功能', descEn: 'Server does not support the requested functionality' },
  { code: 502, name: 'Bad Gateway', desc: '网关或代理从上游服务器收到了无效响应', descEn: 'Gateway or proxy received an invalid response from upstream server' },
  { code: 503, name: 'Service Unavailable', desc: '服务暂时不可用（过载或维护）', descEn: 'Service temporarily unavailable (overloaded or maintenance)' },
  { code: 504, name: 'Gateway Timeout', desc: '网关或代理没有及时从上游服务器收到响应', descEn: 'Gateway or proxy did not receive timely response from upstream server' },
  { code: 505, name: 'HTTP Version Not Supported', desc: '服务器不支持请求的HTTP版本', descEn: 'Server does not support the HTTP version used in the request' }
];

let currentFilter = 'all';

function renderStatusCodes(codes) {
  const container = document.getElementById('statusList');
  container.innerHTML = codes.map(item => {
    const categoryClass = getCategoryClass(item.code);
    const categoryLabel = I18N.t(getCategoryKey(item.code));
    return `
      <div style="display:flex;gap:16px;padding:16px;background:white;border:1px solid var(--border-color);border-radius:12px;transition:all 0.2s;"
           onmouseover="this.style.boxShadow='var(--shadow)';this.style.transform='translateY(-2px)'"
           onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)'">
        <div style="flex-shrink:0;width:72px;height:72px;display:flex;align-items:center;justify-content:center;border-radius:12px;font-size:24px;font-weight:800;font-family:'Consolas','Monaco',monospace;${categoryClass}">
          ${item.code}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <h3 style="font-size:16px;font-weight:700;color:var(--text-primary);">${item.name}</h3>
            <span style="padding:2px 8px;font-size:11px;font-weight:600;border-radius:10px;${getCategoryTagClass(item.code)}">${categoryLabel}</span>
          </div>
          <p style="font-size:14px;color:var(--text-primary);line-height:1.6;margin-bottom:4px;">${item.desc}</p>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.5;font-style:italic;">${item.descEn}</p>
        </div>
      </div>
    `;
  }).join('');
}

function getCategoryClass(code) {
  if (code < 200) return 'background:linear-gradient(135deg,#e3f2fd,#bbdefb);color:#1565c0;';
  if (code < 300) return 'background:linear-gradient(135deg,#e8f5e9,#c8e6c9);color:#2e7d32;';
  if (code < 400) return 'background:linear-gradient(135deg,#fff8e1,#ffecb3);color:#ef6c00;';
  if (code < 500) return 'background:linear-gradient(135deg,#fce4ec,#f8bbd0);color:#c62828;';
  return 'background:linear-gradient(135deg,#efebe9,#d7ccc8);color:#4e342e;';
}

function getCategoryTagClass(code) {
  if (code < 200) return 'background:#e3f2fd;color:#1565c0;';
  if (code < 300) return 'background:#e8f5e9;color:#2e7d32;';
  if (code < 400) return 'background:#fff8e1;color:#ef6c00;';
  if (code < 500) return 'background:#fce4ec;color:#c62828;';
  return 'background:#efebe9;color:#4e342e;';
}

function getCategoryKey(code) {
  if (code < 200) return 'tools.httpstatuscode.information';
  if (code < 300) return 'tools.httpstatuscode.success';
  if (code < 400) return 'tools.httpstatuscode.redirection';
  if (code < 500) return 'tools.httpstatuscode.clientError';
  return 'tools.httpstatuscode.serverError';
}

function filterStatus(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');

  let filtered = httpStatusCodes;
  if (filter !== 'all') {
    const prefix = parseInt(filter.charAt(0));
    filtered = httpStatusCodes.filter(s => Math.floor(s.code / 100) === prefix);
  }

  const searchVal = document.getElementById('statusCodeSearch').value.toLowerCase();
  if (searchVal) {
    filtered = filtered.filter(s =>
      s.code.toString().includes(searchVal) ||
      s.name.toLowerCase().includes(searchVal) ||
      s.desc.toLowerCase().includes(searchVal) ||
      s.descEn.toLowerCase().includes(searchVal)
    );
  }

  renderStatusCodes(filtered);
}

function searchStatusCode() {
  filterStatus(currentFilter, document.querySelector(`.tab-btn[data-tab="${currentFilter}"]`));
}

document.addEventListener('DOMContentLoaded', () => renderStatusCodes(httpStatusCodes));
