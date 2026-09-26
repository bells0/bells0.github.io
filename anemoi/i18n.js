'use strict';
const D = window.anemoiTranslations;
(() => {
  const languages = ['zh', 'ja', 'en'];
  const param = new URLSearchParams(location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem('anemoi-language'); } catch { /* Private browsing may block storage. */ }
  const browser = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  let locale = languages.includes(param) ? param : languages.includes(saved) ? saved : browser.startsWith('zh') ? 'zh' : browser.startsWith('ja') ? 'ja' : 'en';
  const originals = new WeakMap();
  const attributes = new WeakMap();
  let explicit = languages.includes(param) || languages.includes(saved);
  const re = (pattern, text) => text.match(pattern);
  function t(source) {
    if (locale === 'zh' || typeof source !== 'string') return source;
    const exact = D[source]?.[locale];
    if (exact !== undefined) return exact;
    let m;
    if ((m = re(/^(\d+) × (\d+) · 原图$/, source))) return `${m[1]} × ${m[2]} · ${t('原图')}`;
    if ((m = re(/^事件 CG (\d+)$/, source))) return locale === 'ja' ? `イベントCG ${m[1]}` : `Event CG ${m[1]}`;
    if ((m = re(/^(\d+) 张$/, source))) return locale === 'ja' ? `${m[1]}枚` : `${m[1]} images`;
    if ((m = re(/^(\d+) 个地点$/, source))) return locale === 'ja' ? `${m[1]}か所` : `${m[1]} places`;
    if ((m = re(/^(.+) · (\d+)$/, source)) && D[m[1]]) return `${t(m[1])} · ${m[2]}`;
    if ((m = re(/^(\d{2}) \/ (苫前|羽幌|初山别|砂川)$/, source))) return `${m[1]} / ${t(m[2])}`;
    if ((m = re(/^这一程 · (.+)$/, source))) return `${locale === 'ja' ? 'このルート' : 'This route'} · ${t(m[1])}`;
    if ((m = re(/^(.+) ↗$/, source)) && D[m[1]]) return `${t(m[1])} ↗`;
    if ((m = re(/^(.+)：(.+)$/, source)) && D[m[2]]) return `${t(m[1])}: ${t(m[2])}`;
    if ((m = re(/^打开(.+?)(游戏画面|玩家实拍|周边实拍 · 非同机位|官方实景|砂川SA 实拍)原图$/, source))) return locale === 'ja' ? `${t(m[1])}の${t(m[2])}を原寸で見る` : `Open original ${t(m[2]).toLowerCase()} of ${t(m[1])}`;
    if ((m = re(/^打开(.+)原图$/, source))) return locale === 'ja' ? `${t(m[1])}の原寸画像を開く` : `Open original image of ${t(m[1])}`;
    if ((m = re(/^在地图中查看(.+)$/, source))) return locale === 'ja' ? `地図で${t(m[1])}を見る` : `View ${t(m[1])} on map`;
    if ((m = re(/^(收藏|取消收藏|标记)(.+?)(为已到访)?$/, source))) return locale === 'ja' ? `${t(m[2])}を${m[1] === '收藏' ? '保存' : m[1] === '取消收藏' ? '保存解除' : '訪問済みにする'}` : `${m[1] === '收藏' ? 'Save' : m[1] === '取消收藏' ? 'Remove' : 'Mark visited'} ${t(m[2])}`;
    if ((m = re(/^取消(.+)的到访标记$/, source))) return locale === 'ja' ? `${t(m[1])}の訪問済みを解除` : `Remove visited mark for ${t(m[1])}`;
    if ((m = re(/^(.+) · (游戏画面|玩家实拍|周边实拍 · 非同机位|官方实景|砂川SA 实拍)$/, source))) return `${t(m[1])} · ${t(m[2])}`;
    if ((m = re(/^来源采集：(\d{4}-\d\d-\d\d) · 现场机位尚未核实$/, source))) return `${t('来源采集：')}${m[1]} · ${t('现场机位尚未核实')}`;
    if ((m = re(/^风景模式 · 显示 (\d+) 张(匹配图片|风景与实拍) · 收起 (\d+) 张(匹配素材|其他素材)$/, source))) return locale === 'ja' ? `風景モード · ${m[1]}枚の${m[2] === '匹配图片' ? '一致画像' : '風景・現地写真'}を表示 · ${m[3]}枚の${m[4] === '匹配素材' ? '一致素材' : 'その他の素材'}を非表示` : `Scenery mode · ${m[1]} ${m[2] === '匹配图片' ? 'matching images' : 'scenery and real photos'} shown · ${m[3]} ${m[4] === '匹配素材' ? 'matching images' : 'other images'} hidden`;
    if ((m = re(/^全部素材 · 显示 (\d+) 张(匹配图片)?，可能含剧情画面、角色与对话$/, source))) return locale === 'ja' ? `全素材 · ${m[1]}枚${m[2] ? 'の一致画像' : ''}を表示。物語の場面・人物・台詞を含む場合があります` : `All images · ${m[1]}${m[2] ? ' matching' : ''} images shown; may include story scenes, characters, and dialogue`;
    if ((m = re(/^风景模式下没有匹配图片；另有 (\d+) 张匹配素材已收起。可调整搜索，或主动切换到全部素材。$/, source))) return locale === 'ja' ? `風景モードには一致する画像がありません。ほかに${m[1]}枚の一致素材が非表示です。検索を変えるか、全素材に切り替えてください。` : `No matching images in scenery mode; ${m[1]} matching images are hidden. Change your search or switch to all images.`;
    if (/^没有找到匹配图片，请试试其他地点、人物或文件名。$/.test(source)) return locale === 'ja' ? '一致する画像はありません。別の場所・人物・ファイル名を試してください。' : 'No matching images. Try another place, character, or filename.';
    if ((m = re(/^(.+?) \/ (.+?) \/ (\d{2})$/, source))) return `${t(m[1])} / ${t(m[2])} / ${m[3]}`;
    if ((m = re(/^(\d{2}) \/ (.+)$/, source))) return `${m[1]} / ${t(m[2])}`;
    return source;
  }
  function translateText(node) {
    if (!node.nodeValue?.trim() || node.parentElement?.closest('script,style,noscript,[data-no-translate]')) return;
    const raw = originals.has(node) ? originals.get(node) : node.nodeValue;
    if (!originals.has(node)) originals.set(node, raw);
    const leading = raw.match(/^\s*/u)?.[0] || '';
    const trailing = raw.match(/\s*$/u)?.[0] || '';
    const core = raw.trim();
    const originalLanguage = node.parentElement?.closest('[lang="ja"]');
    const next = originalLanguage && originalLanguage !== document.documentElement ? raw : leading + t(core) + trailing;
    if (node.nodeValue !== next) node.nodeValue = next;
  }
  function translateElement(el) {
    if (el.matches('script,style,noscript,[data-no-translate]')) return;
    const raw = attributes.get(el) || {};
    for (const name of ['alt', 'placeholder', 'aria-label', 'title']) {
      if (!el.hasAttribute(name)) continue;
      if (!(name in raw)) raw[name] = el.getAttribute(name);
      const next = t(raw[name]);
      if (el.getAttribute(name) !== next) el.setAttribute(name, next);
    }
    if (el.matches('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[property="og:site_name"]')) {
      if (!('content' in raw)) raw.content = el.getAttribute('content');
      const next = t(raw.content);
      if (el.getAttribute('content') !== next) el.setAttribute('content', next);
    }
    attributes.set(el, raw);
    if (el.matches('a[href]') && !el.hasAttribute('data-no-lang-link')) {
      if (!('href' in raw)) raw.href = el.getAttribute('href');
      let href = raw.href;
      if (explicit && !href.startsWith('#') && !/^(?:https?:|mailto:|javascript:)/i.test(href)) {
        const url = new URL(href, location.href);
        if (url.origin === location.origin && /^\/anemoi(?:\/|$)/.test(url.pathname)) {
          if (!/^\/anemoi\/(?:.*\.html|intro\/?)$/.test(url.pathname) && url.pathname !== '/anemoi/') return;
          url.searchParams.set('lang', locale);
          href = url.pathname + url.search + url.hash;
        }
      }
      if (el.getAttribute('href') !== href) el.setAttribute('href', href);
    }
  }
  function translate(root) {
    if (root.nodeType === Node.TEXT_NODE) { translateText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType === Node.TEXT_NODE) translateText(node);
      else translateElement(node);
    }
  }
  function apply() {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.documentElement.dataset.locale = locale;
    document.querySelectorAll('.quote-translation').forEach(el => { el.lang = locale === 'zh' ? 'zh-CN' : locale; });
    translate(document.documentElement);
    document.querySelectorAll('[data-lang-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.langChoice === locale)));
  }
  function choose(next) {
    if (!languages.includes(next) || next === locale && explicit) return;
    locale = next; explicit = true;
    try { localStorage.setItem('anemoi-language', next); } catch { /* URL remains shareable. */ }
    const url = new URL(location.href); url.searchParams.set('lang', next);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    apply();
    dispatchEvent(new CustomEvent('anemoi:languagechange', {detail:{locale}}));
  }
  window.anemoiI18n = {t, get language() { return locale; }, choose};
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-lang-choice]').forEach(button => button.addEventListener('click', () => choose(button.dataset.langChoice)));
    apply();
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') translateText(record.target);
        for (const node of record.addedNodes) translate(node);
      }
    });
    observer.observe(document.documentElement, {childList:true, characterData:true, subtree:true});
  });
})();
