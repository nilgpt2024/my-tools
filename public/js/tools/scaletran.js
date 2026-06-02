function convertScale() {
  const input = document.getElementById('scaleInput').value.trim();
  if (!input) {
    resetScaleResults();
    return;
  }

  const fromBase = parseInt(document.getElementById('fromBase').value);
  const strVal = input.toUpperCase().replace(/^0X/, '');

  try {
    const decimalValue = parseInt(strVal, fromBase);

    if (isNaN(decimalValue)) {
      resetScaleResults();
      return;
    }

    document.getElementById('resultBinary').textContent = decimalValue.toString(2);
    document.getElementById('resultOctal').textContent = decimalValue.toString(8);
    document.getElementById('resultDecimal').textContent = decimalValue.toString(10);
    document.getElementById('resultHex').textContent = decimalValue.toString(16).toUpperCase();

    document.getElementById('resultBinary').style.color = '#098655';
    document.getElementById('resultOctal').style.color = '#1677ff';
    document.getElementById('resultDecimal').style.color = '#88139a';
    document.getElementById('resultHex').style.color = '#994500';

    showScaleInfo(decimalValue);
  } catch (e) {
    resetScaleResults();
  }
}

function resetScaleResults() {
  document.getElementById('resultBinary').textContent = '-';
  document.getElementById('resultOctal').textContent = '-';
  document.getElementById('resultDecimal').textContent = '-';
  document.getElementById('resultHex').textContent = '-';

  ['Binary', 'Octal', 'Decimal', 'Hex'].forEach(id => {
    document.getElementById('result' + id).style.color = 'var(--text-light)';
  });
}

function showScaleInfo(decimalValue) {
  const infoDiv = document.getElementById('scaleInfo');
  if (!infoDiv && Number.isFinite(decimalValue) && decimalValue >= 32 && decimalValue <= 126) {
    const char = String.fromCharCode(decimalValue);
  }
}

function copyScaleResult(type) {
  const el = document.getElementById({
    binary: 'resultBinary',
    octal: 'resultOctal',
    decimal: 'resultDecimal',
    hex: 'resultHex'
  }[type]);

  const value = el.textContent;
  if (value === '-') {
    showToast(I18N.t('common.error'), 'error');
    return;
  }
  copyToClipboard(value, I18N.t('common.copied'));
}

function clearScale() {
  document.getElementById('scaleInput').value = '';
  resetScaleResults();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('scaleInput').addEventListener('input', Utils.debounce(convertScale, 200));
});
