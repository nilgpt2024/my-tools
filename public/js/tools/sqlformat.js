function formatSqlCode() {
  const input = document.getElementById('sqlInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  const indentSize = parseInt(document.getElementById('sqlIndentSize').value);
  const uppercase = document.getElementById('sqlUppercase').checked;
  const lineBetween = document.getElementById('sqlLineBetween').checked;
  const indent = ' '.repeat(indentSize);

  try {
    const formatted = beautifySql(input, indent, uppercase, lineBetween);
    document.getElementById('sqlOutput').value = formatted;
    showToast(I18N.t('common.success'), 'success');
  } catch (e) {
    showToast(I18N.t('common.error') + ': ' + e.message, 'error');
  }
}

function compressSqlCode() {
  const input = document.getElementById('sqlInput').value;
  if (!input.trim()) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }

  let compressed = input;
  compressed = compressed.replace(/--.*$/gm, '');
  compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '');
  compressed = compressed.replace(/\s+/g, ' ').trim();

  document.getElementById('sqlOutput').value = compressed;
  showToast(I18N.t('common.success'), 'success');
}

function beautifySql(sql, indent, uppercase, lineBetween) {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'EXISTS',
    'BETWEEN', 'LIKE', 'IS', 'NULL', 'AS', 'ON', 'JOIN', 'INNER JOIN',
    'LEFT JOIN', 'RIGHT JOIN', 'OUTER JOIN', 'CROSS JOIN', 'FULL JOIN',
    'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'UNION', 'ALL', 'INTERSECT',
    'EXCEPT', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'ADD', 'COLUMN',
    'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT',
    'INDEX', 'VIEW', 'TRIGGER', 'PROCEDURE', 'FUNCTION',
    'BEGIN', 'END', 'IF', 'THEN', 'ELSE', 'ELSIF', 'CASE', 'WHEN', 'THEN',
    'DECLARE', 'RETURN', 'CURSOR', 'FETCH', 'CLOSE', 'OPEN',
    'WITH', 'RECURSIVE', 'OVER', 'PARTITION BY', 'ROWS', 'RANGE',
    'PRECEDING', 'FOLLOWING', 'CURRENT ROW', 'UNBOUNDED',
    'DISTINCT', 'TOP', 'INTO', 'CASCADE', 'RESTRICT', 'DEFAULT',
    'CHECK', 'UNIQUE', 'AUTO_INCREMENT', 'AUTOINCREMENT'
  ];

  const upperKeywords = keywords.map(k => k.toUpperCase());
  let result = sql;

  if (uppercase) {
    upperKeywords.forEach(kw => {
      const regex = new RegExp('\\b' + kw.replace(' ', '\\s+') + '\\b', 'gi');
      result = result.replace(regex, kw);
    });
  }

  result = result.replace(/\s+/g, ' ').trim();

  const clauseKeywords = [
    'SELECT', 'FROM', 'WHERE', 'GROUP\\s+BY', 'ORDER\\s+BY', 'HAVING',
    'LIMIT', 'OFFSET', 'UNION(\\s+ALL)?', 'INTERSECT', 'EXCEPT',
    'INSERT\\s+INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE\\s+FROM',
    'CREATE\\s+TABLE', 'ALTER\\s+TABLE', 'DROP\\s+TABLE',
    'LEFT\\s+(?:OUTER\\s+)?JOIN', 'RIGHT\\s+(?:OUTER\\s+)?JOIN',
    'INNER\\s+JOIN', 'CROSS\\s+JOIN', 'FULL\\s+(?:OUTER\\s+)?JOIN',
    '(?:LEFT|RIGHT)?\\s+(?:OUTER\\s+)?JOIN', 'ON', 'AND', 'OR',
    'WITH', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ];

  clauseKeywords.forEach(kw => {
    const regex = new RegExp(`\\s(${kw})\\s`, 'gi');
    result = result.replace(regex, lineBetween ? `\n${indent}$1 ` : ` $1 `);
  });

  const openParenKeywords = ['VALUES', '\\('];
  openParenKeywords.forEach(kw => {
    const regex = new RegExp(kw, 'gi');
    result = result.replace(regex, match => match + '\n' + indent.repeat(2));
  });

  result = result.replace(/\),/g, '),\n' + indent.repeat(2));
  result = result.replace(/\)/g, ')');

  result = result.split('\n').map(line => {
    line = line.trim();
    if (!line) return '';

    const trimmedUpper = line.toUpperCase().trim();
    const isMainClause = clauseKeywords.some(kw => new RegExp('^' + kw + '$').test(trimmedUpper));

    if (isMainClause && lineBetween) {
      return '\n' + line;
    }
    return line;
  }).join('\n');

  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  result = result.trim();

  return result;
}

function clearSqlInput() {
  document.getElementById('sqlInput').value = '';
  document.getElementById('sqlOutput').value = '';
}

function pasteSqlInput() {
  navigator.clipboard.readText().then(text => {
    document.getElementById('sqlInput').value = text;
  }).catch(() => showToast(I18N.t('common.error'), 'error'));
}

function copySqlOutput() {
  const output = document.getElementById('sqlOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(output, I18N.t('common.copied'));
}

function downloadSql() {
  const output = document.getElementById('sqlOutput').value;
  if (!output) {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  downloadFile(output, 'formatted.sql', 'application/sql');
}

function loadSqlSample() {
  document.getElementById('sqlInput').value = `SELECT u.id,u.username,u.email,COUNT(o.id) AS order_count,SUM(o.total_amount) AS total_spent FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.status='active' AND o.created_at >= '2024-01-01' GROUP BY u.id,u.username,u.email HAVING COUNT(o.id)>0 ORDER BY total_spent DESC LIMIT 20 OFFSET 0;`;
  showToast(I18N.t('common.success'), 'info');
}
