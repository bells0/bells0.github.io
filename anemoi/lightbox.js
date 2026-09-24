'use strict';
(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-labelledby', 'viewer-title');
  dialog.innerHTML = `<div class="viewer-toolbar"><h2 id="viewer-title">原图预览</h2><button type="button" class="viewer-close" aria-label="关闭图片预览" autofocus>关闭 ×</button></div><div class="viewer-canvas"></div><div class="viewer-footer"><p class="viewer-status" role="status" aria-live="polite"></p><div class="viewer-actions"><button type="button" class="viewer-retry" hidden>重新加载</button><button type="button" class="viewer-zoom" aria-pressed="false" disabled>查看实际尺寸</button><a class="viewer-download" download>保存原图 ↓</a></div></div>`;
  document.body.append(dialog);
  const canvas = dialog.querySelector('.viewer-canvas');
  const status = dialog.querySelector('.viewer-status');
  const zoom = dialog.querySelector('.viewer-zoom');
  const retry = dialog.querySelector('.viewer-retry');
  let currentImage = null, opener = null, currentUrl = '', currentTitle = '', previousOverflow = '';
  function load() {
    canvas.classList.remove('zoomed');
    zoom.disabled = true; zoom.setAttribute('aria-pressed', 'false'); zoom.textContent = '查看实际尺寸';
    retry.hidden = true; status.textContent = '正在加载原图…';
    const img = new Image(); currentImage = img;
    img.alt = currentTitle; img.decoding = 'async'; img.hidden = true;
    canvas.replaceChildren(img);
    img.onload = async () => {
      try { await img.decode(); } catch { img.onerror(); return; }
      if (currentImage !== img || !dialog.open) return;
      img.hidden = false; zoom.disabled = false;
      status.textContent = `${img.naturalWidth} × ${img.naturalHeight} · 原图`;
    };
    img.onerror = () => {
      if (currentImage !== img || !dialog.open) return;
      status.textContent = '原图暂时加载失败，请重试。'; retry.hidden = false;
    };
    img.src = currentUrl;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || dialog.contains(link) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !/\.(?:jpe?g|png|webp)$/i.test(url.pathname)) return;
    event.preventDefault();
    opener = link; currentUrl = url.href;
    currentTitle = link.closest('.card')?.querySelector('.name')?.textContent || link.closest('figure')?.querySelector('img')?.alt || link.querySelector('img')?.alt || link.textContent.trim() || '原图预览';
    dialog.querySelector('#viewer-title').textContent = currentTitle;
    const download = dialog.querySelector('.viewer-download');
    download.href = currentUrl; download.download = decodeURIComponent(url.pathname.split('/').pop());
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal(); load();
  });
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  // Only a gesture starting and ending on the backdrop closes the viewer.
  let backdropStart = false;
  dialog.addEventListener('pointerdown', event => { backdropStart = event.target === dialog; });
  dialog.addEventListener('click', event => { if (event.target === dialog && backdropStart) dialog.close(); backdropStart = false; });
  dialog.addEventListener('close', () => {
    currentImage = null; canvas.replaceChildren();
    document.documentElement.style.overflow = previousOverflow;
    opener?.focus({preventScroll:true});
  });
  zoom.addEventListener('click', () => {
    const enlarged = canvas.classList.toggle('zoomed');
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.textContent = enlarged ? '适应窗口' : '查看实际尺寸';
    canvas.scrollTo(0, 0);
  });
  retry.addEventListener('click', load);
})();
