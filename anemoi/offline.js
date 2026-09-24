'use strict';
// A standalone document: all displayed images and styles travel with the file.
window.buildPilgrimagePack = async function (places, state, scope, onProgress) {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const urls = [...new Set(places.flatMap(p => [p.scene, p.photo].filter(Boolean).map(i => i.thumbnail)))];
  const embedded = new Map();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  let next = 0, done = 0;
  async function worker() {
    while (next < urls.length) {
      const path = urls[next++];
      const url = new URL(path, location.href);
      if (url.origin !== location.origin) throw new Error('图片不是站内缩略图');
      const response = await fetch(url, {signal:controller.signal});
      if (!response.ok) throw new Error('缩略图下载失败');
      const blob = await response.blob();
      if (!/^image\/(webp|png|jpeg)$/.test(blob.type)) throw new Error('图片格式无法读取');
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('图片读取失败'));
        reader.readAsDataURL(blob);
      });
      const image = new Image(); image.src = data; await image.decode();
      if (controller.signal.aborted) return;
      embedded.set(path, data);
      onProgress(++done, urls.length);
    }
  }
  try { await Promise.all([worker(), worker()]); }
  catch (error) { controller.abort(); throw error; }
  finally { clearTimeout(timeout); }
  function link(url, label) {
    // Local reference-image paths are omitted: they would break in a downloaded file.
    if (!/^https?:\/\//i.test(url || '')) return '';
    return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
  }
  function picture(image, label, name) {
    if (!image) return '';
    return `<figure><img src="${embedded.get(image.thumbnail)}" alt="${esc(name + ' · ' + label)}"><figcaption>${esc(label)} · ${esc(image.credit || (label === '游戏画面' ? '游戏图片' : 'wing'))}</figcaption></figure>`;
  }
  const created = new Date().toLocaleString('zh-CN', {hour12:false});
  const cards = places.map((p, index) => {
    const s = state[p.id] || {};
    const address = p.mapQuery || p.coordinates.join(', ');
    const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
    return `<article id="place-${esc(p.id)}"><p class="eyebrow">${String(index+1).padStart(2,'0')} / ${esc(p.region)}${s.saved ? ' · 已收藏' : ''}${s.visited ? ' · 已到访' : ''}</p><h2>${esc(p.name)}</h2><p lang="ja" class="japanese">${esc(p.japanese)}</p><div class="pictures ${p.scene ? '' : 'single'}">${picture(p.scene,'游戏画面',p.name)}${picture(p.photo,p.photo?.label || '玩家实拍',p.name)}</div><p>${esc(p.subtitle)}</p><p class="evidence">${esc(p.evidence)}</p><h3>取景提示</h3><p>${esc(p.note)}</p><h3>${p.mapQuery ? '地图搜索词' : '参考坐标（纬度，经度）'}</h3><p class="address">${esc(address)}</p><p class="small">${p.mapQuery ? '请核对实际入口。' : '社区参考坐标，不代表已确认的入口或拍摄站位。'} 来源采集：${esc(p.sourceDate)}。</p><div class="online"><strong>以下链接需联网</strong>${link(map,'打开地图')}${link(p.locationSource,p.locationSourceLabel || '点位考据')}${link(p.scene?.source,'游戏图片来源')}${link(p.photo?.source,(p.photo?.credit || 'wing') + ' 实拍来源')}${(p.additionalSources || []).map(s => link(s.url,s.label)).join('')}</div><a class="back" href="#contents">↑ 返回目录</a></article>`;
  }).join('');
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>anemoi · 离线巡礼手帖</title><style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f6f7f2;color:#243f3c;font:15px/1.8 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{max-width:940px;margin:auto;padding:32px 20px}header{padding:16px 0 30px}h1,h2{font-family:"Songti SC",serif;line-height:1.5}h1{font-size:32px;margin:10px 0}h2{font-size:25px;margin:5px 0}h3{font-size:14px;margin:22px 0 4px}p{margin:8px 0}a{color:#256b60;text-underline-offset:4px;overflow-wrap:anywhere}a:focus-visible{outline:3px solid #cc9a4a;outline-offset:3px}.eyebrow{font-size:12px;color:#256b60;letter-spacing:1px}.notice,.online{background:#e8efe6;border-radius:8px;padding:15px 18px}.small,.japanese,figcaption{font-size:12px;color:#667873}.notice{margin:20px 0}.contents{columns:2;padding-left:24px}.contents li{padding:5px 0;break-inside:avoid}article{padding:24px;background:white;border:1px solid #dce4db;border-radius:12px;margin:22px 0;scroll-margin-top:18px}.pictures{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.pictures.single{grid-template-columns:1fr}figure{margin:0;min-width:0}img{width:100%;height:auto;display:block}.evidence{font-size:12px;color:#256b60}.address{font-size:17px;overflow-wrap:anywhere}.online{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:20px;font-size:12px}.online strong{width:100%}.back{display:inline-block;margin-top:17px;font-size:12px}footer{font-size:12px;color:#667873;padding:20px 0}@media(max-width:600px){main{padding:18px 14px}article{padding:18px}.contents{columns:1}.pictures{grid-template-columns:1fr}h1{font-size:27px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style></head><body><main><header><p class="eyebrow">ANEMOI · HOKKAIDO FIELD NOTES</p><h1>把熟悉的风景，带在身边。</h1><p>离线巡礼手帖 · ${places.length} 个地点 · ${esc(scope)}</p><p class="small">导出时间：${esc(created)}（导出设备当地时间）</p><div class="notice">图片、日文地名、参考坐标和取景提示已保存在这个文件里，断网也能查看。图片为轻量缩略图，不含原图或离线地图。<br>收藏与到访为导出时的记录，文件内不可修改，也不会与网站同步。开放时间、交通与通行情况请在出发前联网核对。</div><nav id="contents" aria-label="地点目录"><h2>这一程，想去的地方</h2><ol class="contents">${places.map(p=>`<li><a href="#place-${esc(p.id)}">${esc(p.name)}</a></li>`).join('')}</ol></nav></header>${cards}<footer>游戏图片 © VISUAL ARTS / Key；实拍版权归原作者或机构，各地点保留来源链接。场景对应来自玩家考据，并非官方逐点认证。周边实拍不等于同机位；砂川为条件顺路点。<br>请尊重当地居民与管理规定，不进入私人或禁止通行区域。</footer></main></body></html>`;
  return new Blob([html], {type:'text/html;charset=utf-8'});
};
