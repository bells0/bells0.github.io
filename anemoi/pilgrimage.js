'use strict';
(() => {
  const KEY = 'anemoi-pilgrimage-v1';
  const $ = selector => document.querySelector(selector);
  const grid = $('#place-grid');
  let places = [], state = {}, view = location.hash === '#saved' ? 'saved' : 'all', region = 'all';
  let storageAvailable = true;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function normalize(raw) {
    const clean = {};
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      for (const p of places) {
        const item = raw[p.id];
        if (item && typeof item === 'object') clean[p.id] = {saved:item.saved === true, visited:item.visited === true};
      }
    }
    return clean;
  }
  function storageWarning() {
    storageAvailable = false;
    $('#storage-note').textContent = '浏览器目前无法保存清单：本次仍可使用，关闭或刷新后可能丢失。请允许此站点使用本地存储。';
    $('#storage-note').classList.add('warning');
  }
  function load() {
    let raw;
    try { raw = localStorage.getItem(KEY); } catch { storageWarning(); return; }
    try { state = normalize(raw ? JSON.parse(raw) : {}); }
    catch { state = {}; $('#storage-note').textContent = '旧清单无法读取，已显示空清单。你可以重新收藏地点；新选择将保存在当前浏览器。'; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch { storageWarning(); }
  }
  function picture(image, name, label) {
    if (!image) return `<figure><div class="missing-photo"><span>待补一张实景</span>期待亲自走到这里</div><figcaption><span>实景对照</span><span>尚未收录</span></figcaption></figure>`;
    return `<figure><a href="${esc(image.file)}" target="_blank" rel="noopener noreferrer" aria-label="打开${esc(name)}${label}原图"><img src="${esc(image.thumbnail)}" alt="${esc(name)} · ${label}" loading="lazy" decoding="async" width="720" height="540"></a><figcaption><span>${label}</span><a href="${esc(image.source)}" target="_blank" rel="noopener noreferrer">${esc(image.credit || (label === '玩家实拍' ? 'wing' : '图片来源'))} ↗</a></figcaption></figure>`;
  }
  function card(p, i) {
    const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.coordinates.join(','));
    return `<article class="place-card" id="place-${esc(p.id)}" data-place="${esc(p.id)}">
      <div class="card-top"><span class="region-tag">${String(i+1).padStart(2,'0')} / ${esc(p.region)}</span><button class="save-button" type="button" data-action="saved" data-id="${esc(p.id)}" aria-pressed="false" aria-label="收藏${esc(p.name)}"><span aria-hidden="true">♡</span>想去</button></div>
      <div class="card-title"><h3>${esc(p.name)}</h3><p class="japanese" lang="ja">${esc(p.japanese)}</p></div>
      <div class="compare">${picture(p.scene,p.name,'游戏画面')}${picture(p.photo,p.name,p.photo?.label || '玩家实拍')}</div>
      <div class="card-content"><p class="subtitle">${esc(p.subtitle)}</p><span class="evidence">${esc(p.evidence)}</span>
      <div class="card-actions"><a class="map-link" href="${map}" target="_blank" rel="noopener noreferrer" aria-label="在地图中查看${esc(p.name)}社区参考点">打开地图 <span aria-hidden="true">↗</span></a><button class="visit-button" type="button" data-action="visited" data-id="${esc(p.id)}" aria-pressed="false" aria-label="标记${esc(p.name)}为已到访">○ 标记已到访</button></div>
      <details class="place-details"><summary>取景提示与来源</summary><p class="detail-note">${esc(p.note)}</p><div class="source-links"><a href="${esc(p.locationSource)}" target="_blank" rel="noopener noreferrer">anitabi 点位考据 ↗</a>${p.photo ? `<a href="${esc(p.photo.source)}" target="_blank" rel="noopener noreferrer">${esc(p.photo.credit || 'wing')} 巡礼记录 ↗</a>` : ''}${(p.additionalSources || []).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}${p.id === 'observatory' ? '<a href="https://www.vill.shosanbetsu.lg.jp/kankoumiryoku/tenmondai/annai/index.html" target="_blank" rel="noopener noreferrer">天文台官方信息 ↗</a>' : ''}</div><p class="source-date">来源采集：${esc(p.sourceDate)} · 现场机位尚未核实<br>地图为社区参考坐标，不代表已确认的入口或拍摄站位。</p></details></div></article>`;
  }
  function update() {
    const query = $('#place-search').value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const p of places) {
      const s = state[p.id] || {};
      const node = document.getElementById('place-' + p.id);
      const match = (view === 'all' || s[view]) && (region === 'all' || p.region === region) && `${p.name} ${p.japanese} ${p.region}`.toLocaleLowerCase().includes(query);
      node.hidden = !match;
      if (match) shown++;
      const saveButton = node.querySelector('[data-action="saved"]');
      saveButton.setAttribute('aria-pressed', String(!!s.saved));
      saveButton.setAttribute('aria-label', (s.saved ? '取消收藏' : '收藏') + p.name);
      saveButton.innerHTML = s.saved ? '<span aria-hidden="true">♥</span>已收藏' : '<span aria-hidden="true">♡</span>想去';
      const visitButton = node.querySelector('[data-action="visited"]');
      visitButton.setAttribute('aria-pressed',String(!!s.visited));
      visitButton.setAttribute('aria-label', (s.visited ? '取消' : '标记') + p.name + (s.visited ? '的到访标记' : '为已到访'));
      visitButton.textContent = s.visited ? '✓ 已到访' : '○ 标记已到访';
    }
    const saved = places.filter(p=>state[p.id]?.saved).length;
    const visited = places.filter(p=>state[p.id]?.visited).length;
    $('#saved-count').textContent = $('#nav-count').textContent = saved;
    $('#visited-count').textContent = visited;
    $('#result-count').textContent = `${shown} 个地点`;
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
    document.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region===region)));
    $('#empty').hidden = shown > 0;
    $('#empty-title').textContent = query || region !== 'all' ? '没有找到符合条件的地点' : view === 'visited' ? '旅程，等你留下第一个脚印' : '清单还没有目的地';
    $('#empty-text').textContent = query || region !== 'all' ? '试试其他地名，或清除筛选条件。' : view === 'visited' ? '到达现场后，点一下「标记已到访」。' : '遇见喜欢的风景，点一下卡片上的爱心。';
  }
  function switchView(next, reset = false) {
    view = next;
    if (reset) { region = 'all'; $('#place-search').value = ''; }
    update();
  }
  grid.addEventListener('click', e => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const {id, action} = button.dataset;
    const p = places.find(p=>p.id===id);
    if (!p) return;
    // Merge changes made in another tab before toggling this field.
    if (storageAvailable) {
      try { state = normalize(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { /* Keep this tab's choices if storage is unavailable. */ }
    }
    state[id] ||= {saved:false,visited:false};
    state[id][action] = !state[id][action];
    save(); update();
    $('#announcement').textContent = `${p.name}：${action === 'saved' ? (state[id].saved ? '已加入清单' : '已取消收藏') : (state[id].visited ? '已标记到访' : '已取消到访标记')}`;
    if (button.closest('article').hidden) document.querySelector(`[data-view="${view}"]`).focus();
  });
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{
    switchView(b.dataset.view);
    history.replaceState(null,'', view === 'saved' ? '#saved' : '#places');
  }));
  document.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>{region=b.dataset.region;update();}));
  $('#place-search').addEventListener('input',update);
  $('#reset-filters').addEventListener('click',()=>{switchView('all',true);history.replaceState(null,'','#places');});
  $('#saved-link').addEventListener('click',e=>{e.preventDefault();switchView('saved',true);history.replaceState(null,'','#saved');$('#places').scrollIntoView({behavior:'auto'});});
  window.addEventListener('hashchange',()=>{if(places.length && location.hash==='#saved') {switchView('saved',true);$('#places').scrollIntoView();}});
  window.addEventListener('storage',e=>{if(e.key===KEY || e.key===null){load();if(places.length)update();}});
  fetch('places.json').then(r=>{if(!r.ok)throw new Error('Unable to load places');return r.json();}).then(data=>{
    places=data; load(); grid.innerHTML=places.map(card).join(''); update();
    if(location.hash==='#saved') $('#places').scrollIntoView({behavior:'auto'});
  }).catch(()=>{
    $('#result-count').textContent='地点暂时加载失败';
    grid.innerHTML='<p>请刷新页面重试，或先<a href="index.html">打开原图收藏</a>。</p>';
  });
})();
