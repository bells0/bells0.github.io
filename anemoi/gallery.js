'use strict';
(() => {
  const cards = [...document.querySelectorAll('.card')];
  const sections = [...document.querySelectorAll('main > section')];
  const query = document.querySelector('#q');
  const modes = [...document.querySelectorAll('[data-browse-mode]')];
  let mode = 'scenery';
  function filter() {
    const search = query.value.trim().toLocaleLowerCase();
    let shown = 0, withheld = 0;
    for (const card of cards) {
      const matches = card.dataset.search.includes(search);
      const allowed = mode === 'all' || card.dataset.browse === 'scenery';
      card.hidden = !matches || !allowed;
      if (matches && !allowed) withheld++;
      if (!card.hidden) shown++;
      const img = card.querySelector('img');
      // Withheld thumbnails have no src in the initial HTML, including without JS.
      if (img.dataset.src) {
        if (!card.hidden) img.setAttribute('src', img.dataset.src);
        else img.removeAttribute('src');
      }
    }
    for (const section of sections) {
      const count = [...section.querySelectorAll('.card')].filter(c => !c.hidden).length;
      section.hidden = !count;
      section.querySelector('h2 small').textContent = `${count} 张`;
      const nav = document.querySelector(`[data-category="${section.id}"]`);
      nav.hidden = !count;
      nav.textContent = `${nav.dataset.label} · ${count}`;
    }
    modes.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.browseMode === mode)));
    document.querySelector('#shown').textContent = `${shown} 张`;
    document.querySelector('#browse-status').textContent = mode === 'scenery'
      ? `风景模式 · 显示 ${shown} 张${search ? '匹配图片' : '风景与实拍'} · 收起 ${withheld} 张${search ? '匹配素材' : '其他素材'}`
      : `全部素材 · 显示 ${shown} 张${search ? '匹配图片' : ''}，可能含剧情画面、角色与对话`;
    const empty = document.querySelector('#gallery-empty');
    empty.hidden = shown > 0;
    document.querySelector('#empty-message').textContent = withheld
      ? `风景模式下没有匹配图片；另有 ${withheld} 张匹配素材已收起。可调整搜索，或主动切换到全部素材。`
      : '没有找到匹配图片，请试试其他地点、人物或文件名。';
    hashNotice();
  }
  function hashTarget() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return null; }
    return sections.find(s => s.id === id);
  }
  function hashNotice() {
    const target = hashTarget();
    const hiddenByMode = target && mode === 'scenery' && !target.querySelector('[data-browse="scenery"]');
    document.querySelector('#browse-link-note').hidden = !hiddenByMode;
  }
  modes.forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.browseMode;
    filter();
    const target = hashTarget();
    if (mode === 'all' && target && !target.hidden) target.scrollIntoView();
  }));
  query.addEventListener('input', filter);
  document.querySelector('#clear-search').addEventListener('click', () => { query.value = ''; filter(); query.focus(); });
  window.addEventListener('hashchange', hashNotice);
  // Opt-in is not persisted; opening or refreshing the gallery starts in scenery mode.
  filter();
})();
