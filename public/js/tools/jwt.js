function decodeJWT() {
  const token = document.getElementById('jwtInput').value.trim();

  if (!token) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    showJwtError(I18N.t('common.error'));
    return;
  }

  try {
    function base64UrlDecode(str) {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonStr = atob(base64);
      try {
        return JSON.parse(jsonStr);
      } catch {
        return jsonStr;
      }
    }

    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);
    const signature = parts[2];

    document.getElementById('jwtHeader').innerHTML = syntaxHighlightJson(header);
    document.getElementById('jwtPayload').innerHTML = syntaxHighlightJson(payload);
    document.getElementById('jwtSignatureValue').textContent = signature;

    validateJwtInfo(payload);

    document.getElementById('jwtResult').style.display = 'block';
    document.getElementById('jwtError').style.display = 'none';

    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showJwtError(I18N.t('common.error') + ': ' + e.message);
  }
}

function syntaxHighlightJson(obj) {
  const json = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
  const escaped = Utils.escapeHtml(json);
  return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      cls = /:$/.test(match) ? 'key' : 'string';
    } else if (/true|false/.test(match)) cls = 'boolean';
    else if (/null/.test(match)) cls = 'null';
    const colors = { key: '#88139a', string: '#1677ff', number: '#098655', boolean: '#994500', null: '#808080' };
    return `<span style="color:${colors[cls]};font-weight:${cls === 'key' ? '600' : 'normal'}">${match}</span>`;
  });
}

function validateJwtInfo(payload) {
  const validationDiv = document.getElementById('jwtValidation');
  const now = Date.now() / 1000;
  let items = [];

  if (payload.exp) {
    const expDate = new Date(payload.exp * 1000);
    const isExpired = now > payload.exp;
    items.push({
      label: I18N.t('tools.jwt.expiration'),
      value: expDate.toLocaleString('zh-CN'),
      status: isExpired ? 'expired' : 'valid',
      icon: isExpired ? I18N.t('tools.jwt.expired') : I18N.t('tools.jwt.valid')
    });
  }

  if (payload.nbf) {
    const nbfDate = new Date(payload.nbf * 1000);
    const isActive = now >= payload.nbf;
    items.push({
      label: I18N.t('tools.jwt.notBefore'),
      value: nbfDate.toLocaleString('zh-CN'),
      status: isActive ? 'valid' : 'waiting',
      icon: isActive ? I18N.t('tools.jwt.valid') : I18N.t('tools.jwt.waiting')
    });
  }

  if (payload.iat) {
    const iatDate = new Date(payload.iat * 1000);
    items.push({
      label: I18N.t('tools.jwt.issuedAt'),
      value: iatDate.toLocaleString('zh-CN'),
      status: 'info',
      icon: '📅'
    });
  }

  if (payload.iss) {
    items.push({ label: I18N.t('tools.jwt.issuer'), value: payload.iss, status: 'info', icon: '🏢' });
  }
  if (payload.sub) {
    items.push({ label: I18N.t('tools.jwt.subject'), value: payload.sub, status: 'info', icon: '👤' });
  }
  if (payload.aud) {
    items.push({ label: I18N.t('tools.jwt.audience'), value: Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud, status: 'info', icon: '👥' });
  }

  if (items.length > 0) {
    validationDiv.style.background = '#fafafa';
    validationDiv.style.border = '1px solid var(--border-color)';
    validationDiv.innerHTML = `
      <h3 style="font-size:15px;font-weight:600;margin-bottom:12px;">📋 ${I18N.t('tools.jwt.validation')}</h3>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${items.map(item => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:white;border-radius:8px;border:1px solid var(--border-color);">
            <div style="display:flex;align-items:center;gap:10px;">
              <span>${item.icon}</span>
              <span style="font-size:14px;color:var(--text-secondary);">${item.label}</span>
            </div>
            <span style="font-size:14px;font-family:'Consolas','Monaco',monospace;color:${item.status === 'expired' ? '#f56c6c' : item.status === 'valid' ? '#67c23a' : 'var(--text-primary)'};">${item.value}</span>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    validationDiv.style.display = 'none';
  }
}

function showJwtError(msg) {
  document.getElementById('jwtResult').style.display = 'none';
  document.getElementById('jwtError').style.display = 'block';
  document.getElementById('jwtError').textContent = msg;
}

function clearJWT() {
  document.getElementById('jwtInput').value = '';
  document.getElementById('jwtResult').style.display = 'none';
  document.getElementById('jwtError').style.display = 'none';
}

function copyJwtHeader() {
  const header = document.getElementById('jwtHeader');
  copyToClipboard(header.textContent, I18N.t('common.copied'));
}

function copyJwtPayload() {
  const payload = document.getElementById('jwtPayload');
  copyToClipboard(payload.textContent, I18N.t('common.copied'));
}

function loadSampleJWT() {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: '1234567890',
    name: 'John Doe',
    admin: true,
    iat: now,
    exp: now + 3600
  }));
  const signature = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  document.getElementById('jwtInput').value = `${header}.${payload}.${signature}`;
  showToast(I18N.t('common.success'), 'info');
}
