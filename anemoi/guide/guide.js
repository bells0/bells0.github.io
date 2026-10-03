// Facility searches stay distinct from community scene pins and photo locations.
const places = {
  rumoi:{query:'留萌駅前',id:'ChIJVTmvlI1oDF8RvIM6Tzt_hdM'},
  tomamae:{query:'苫前上町',id:'ChIJBw7MVS0sDF8RQ-cuXmFSdfw'},
  minshuku:{query:'民宿30ノット 苫前町 栄浜121'},
  wind:{query:'苫前夕陽ヶ丘風力発電所 風来望'},
  beach:{query:'とままえ夕陽ケ丘ホワイトビーチ 55-3 Sakaehama'},
  park:{query:'Tomamae Yūhigaoka Mirai Port Park(campground)',id:'ChIJkz8Q6zMsDF8Ro9bQbNNQ1ZQ'},
  rest:{query:'道の駅 風Wとままえ'},
  seico:{query:'セイコーマートむらい苫前店'},
  temple:{query:'久遠山大林寺 苫前町'},
  museum:{query:'苫前町郷土資料館 393 Tomamae'},
  haboroBus:{query:'沿岸バス 羽幌営業所（羽幌ターミナル）',id:'ChIJdQyYILIsDF8R92Pp1_m6qKc'},
  workman:{query:'Workman House Haboro, 3 Chome-14-1 Kitaodori, Haboro'},
  street:{query:'44.357958,141.693272'}, // On-site photo GPS; not a claimed business entrance.
  onsen:{query:'しょさんべつ温泉 岬の湯'},
  observatory:{query:'しょさんべつ天文台'},
  ranch:{query:'44.304905,141.674093'}, // Anitabi eh2oy6v; public roadside viewpoint.
  wheat:{query:'44.312607,141.667837'} // Community field location, not exact photo camera position.
};
const googlePlace = key => {
  const p=places[key];
  return 'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:p.query,...(p.id?{query_place_id:p.id}:{})});
};
const googleRoute = (keys) => {
  const list=keys.split(',').map(k=>places[k]);
  const a=list[0], b=list.at(-1);
  return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:a.query,destination:b.query,travelmode:'walking',...(a.id?{origin_place_id:a.id}:{}),...(b.id?{destination_place_id:b.id}:{}),...(list.length>2?{waypoints:list.slice(1,-1).map(p=>p.query).join('|')}:{})});
};
const community = id => 'https://www.anitabi.cn/map?bangumiId=465493&pid='+id;
const scenes = [
  {n:'1',group:'tomamae',place:'minshuku',name:'栄浜街道 · 民宿 30ノット',sub:'认路：屋顶、路牌与远处风车',photo:'sakaehama-street.jpg',pid:'alv8zs1',note:'先找民宿外的公共街道与栄浜站牌，再对照道路方向。室内是营业空间，不是自由参观的景点。',next:'wind',nextName:'風来望',more:[
    {photo:'minshuku-bar.jpg',caption:'吧台室内 · 补充实景素材，非此次入住记录；拍摄前请询问。'},
    {photo:'minshuku-tatami.jpg',caption:'榻榻米空间 · 补充实景素材；可用窗户与天花板灯具对照。'}]},
  {n:'2',group:'tomamae',place:'wind',name:'風来望 · 苫前风车',sub:'认路：白色风机与环绕的公共道路',photo:'windmill-base.jpg',pid:'45mprd4',note:'游戏与实拍是不同角度，海的位置也不同。先确认风机与道路，不要为了同机位跨过封闭边界。',next:'beach',nextName:'海岸弯道／白色沙滩',more:[{photo:'windmill-looking-up.jpg',caption:'抬头看风车 · 另一张游戏背景的仰望视角。'}]},
  {n:'3',group:'tomamae',place:'beach',name:'白色沙滩 · 海岸弯道',sub:'认路：护栏、弯道与沿海道路',photo:'coastal-bend.jpg',pid:'ez1whl4',note:'地图按钮指向海滩设施，CG 对应的是附近沿海道路，不是沙滩正中。到入口后用弯道、护栏对照机位。',next:'park',nextName:'未来港公园',more:[{photo:'beach-evening-reference.jpg',caption:'宣传画的夕阳氛围参考；实拍为白天海岸，不是角色与滑翔伞场景复刻。'}]},
  {n:'4',group:'tomamae',place:'park',name:'夕陽ヶ丘未来港公园',sub:'认路：台阶、坡面与海边平台',photo:'mirai-stairs.jpg',pid:'alve9sm',note:'先沿开放步道进入公园。台阶实拍与游戏坡面的角度不同，同一带还可以回看风车和海岸。',next:'rest',nextName:'道の駅 風W',more:[{photo:'mirai-second-view.jpg',caption:'公园补充视角 · 同一区域的海边步道与平台。'}]},
  {n:'5',group:'tomamae',place:'rest',name:'道の駅 風Wとままえ',sub:'认路：海景平台 · 周边参考',photo:'fuwatto-platform.jpg',pid:'gbiazd7',note:'休息、补水后再往町内走。游戏中的具体长椅机位没有完整复刻，这张只用于平台周边与方向参考。',next:'seico',nextName:'Seicomart'},
  {n:'6',group:'tomamae',place:'seico',name:'Seicomart むらい苫前店',sub:'认路：便利店门面与出入口',photo:'seicomart.jpg',pid:'dm5fsj3',note:'这里可补给，也能对照便利店场景。拍门面时不要挡住顾客出入。',next:'temple',nextName:'久遠山大林寺'},
  {n:'7',group:'tomamae',place:'temple',name:'久遠山大林寺',sub:'认路：山门、台阶与围墙',photo:'dairinji.jpg',pid:'gbij60z',note:'优先从公开道路看外观；入内或拍摄遇到仪式时，先尊重寺院安排。',next:'museum',nextName:'乡土资料馆'},
  {n:'8',group:'tomamae',place:'museum',name:'苫前町乡土资料馆',sub:'认路：黄色旧校舍与山墙屋顶',photo:'museum-exterior.jpg',pid:'aj3chxn',note:'旧校舍外观很容易对照。室内另有实拍，但具体 CG 房间仍待确认；入馆要看当天开放情况。',next:'tomamae',nextName:'苫前上町回程站区',more:[{photo:'museum-room-reference.jpg',caption:'室内空间参考 · 已有馆内实拍，尚未确认这就是 CG 中的同一房间。'}]},
  {n:'9',group:'haboro',place:'street',name:'羽幌町 · 街道路口',sub:'认路：超市、路牌、信号灯与路面标线',photo:'haboro-street.jpg',pid:'aj3f739',mapLabel:'实拍路口位置',note:'社区曾修正过路口标点。此处地图使用这张实拍的 GPS 位置帮助找路口，不把旧社区坐标冒充准确机位；抵达后仍要对照路牌和道路走向。',next:'workman',nextName:'Workman House 羽幌'},
  {n:'10',group:'shosanbetsu',place:'observatory',name:'しょさんべつ天文台 · 正面',sub:'认路：圆顶、圆窗与门前砖路',photo:'observatory-front.jpg',pid:'3wvutqu',note:'从岬台公园的开放步道过来，先拍正面。与游戏建筑对应明显，但季节、花坛与路面状态会变化。',next:'observatory',nextName:'圆窗大厅（馆内）',nextAnchor:'scene-11'},
  {n:'11',group:'shosanbetsu',place:'observatory',name:'天文台 · 圆窗大厅',sub:'认路：圆窗、弧形墙面与中间桌子',photo:'observatory-hall.jpg',pid:'eh2rfwi',note:'这是开馆后才能看的室内空间。圆窗和整体布局可对照游戏画面；拍照时避开其他访客，现场要求优先。',next:'observatory',nextName:'馆外草坪',nextAnchor:'scene-12'},
  {n:'12',group:'shosanbetsu',place:'observatory',name:'天文台 · 草坪主视觉',sub:'认路：圆顶与屋顶坡面 · 氛围参考',photo:'observatory-lawn.jpg',pid:'45l911q',note:'白天草坪用于定位主视觉的建筑与周边。游戏中的夜空、人物和花海不是这张实拍所复刻的内容。',next:'onsen',nextName:'温泉酒店／回程站附近'},
  {n:'A',group:'branch',place:'ranch',name:'小林牧场 · 入口',sub:'另走郊外支线 · 公共路边取景',photo:'kobayashi-ranch.jpg',pid:'eh2oy6v',mapLabel:'社区入口点',note:'木牌、白色围栏和远处建筑可对照。地图为社区考据的入口位置，实拍 GPS 也在附近；只在公共道路边拍，不进入牧场或站到车道中间。',next:'tomamae',nextName:'苫前上町（步行返站）'},
  {n:'B',group:'branch',place:'wheat',name:'栄浜／苫前町 · 麦田周边',sub:'季节差异很大 · 非同机位',photo:'wheat-field-reference.jpg',pid:'dymy0us',mapLabel:'社区麦田点',note:'秋季实拍已经收割，拍摄处与社区标记也有距离。这张只帮助认田野、风车与建筑，不承诺精准复刻；不进入田地。',next:'tomamae',nextName:'苫前上町（步行返站）'}
];
const imageDimensions = {
  'windmill-looking-up.jpg':[1600,3756],
  'beach-evening-reference.jpg':[1600,4381],
  'seicomart.jpg':[1600,2079],
  'minshuku-tatami.jpg':[1600,2112],
  'wheat-field-reference.jpg':[1600,1811]
};
const image = (filename, alt, caption='上：游戏／宣传画面 · 下：实景') => {
  const figure=document.createElement('figure'); figure.className='comparison';
  const a=document.createElement('a');a.href='assets/'+filename;a.className='photo-link';a.setAttribute('aria-label','打开大图：'+alt);
  const img=document.createElement('img');img.src=a.href;img.alt=alt+'，游戏画面与实景上下对照';img.loading='lazy';img.decoding='async';
  [img.width,img.height]=imageDimensions[filename]||[1600,1812];
  const label=document.createElement('span');label.className='enlarge';label.textContent='点击看大图 ↗';
  a.append(img,label);const cap=document.createElement('figcaption');cap.textContent=caption;figure.append(a,cap);return figure;
};
const external = (label,href,className='') => {
  const a=document.createElement('a');a.textContent=label;a.href=href;a.target='_blank';a.rel='noopener';a.className=className;return a;
};
for (const s of scenes) {
  const article=document.createElement('article');article.className='scene';article.id='scene-'+s.n;
  const head=document.createElement('div');head.className='scene-title';
  const number=document.createElement('span');number.className='number';number.textContent=s.n;
  const titleWrap=document.createElement('div'),title=document.createElement('h3'),sub=document.createElement('p');title.textContent=s.name;sub.textContent=s.sub;titleWrap.append(title,sub);head.append(number,titleWrap);
  article.append(head,image(s.photo,s.name));
  const body=document.createElement('div');body.className='scene-body';const note=document.createElement('p');note.textContent=s.note;body.append(note);
  const actions=document.createElement('div');actions.className='scene-actions';actions.append(external((s.mapLabel||'Google 地点')+' ↗',googlePlace(s.place)));
  if(s.nextAnchor){const a=document.createElement('a');a.href='#'+s.nextAnchor;a.className='next';a.textContent='接着看 '+s.nextName+' ↓';actions.append(a);}
  else actions.append(external('下一段 → '+s.nextName+' ↗',googleRoute(s.place+','+s.next),'next'));
  body.append(actions,external('场景考据／取景点 ↗',community(s.pid),'source-link'));
  if(s.more){const more=document.createElement('details');more.className='more-scenes';const summary=document.createElement('summary');summary.textContent='再看 '+s.more.length+' 张场景对照';more.append(summary);for(const m of s.more)more.append(image(m.photo,s.name,m.caption));body.append(more);}
  article.append(body);document.querySelector('#'+(s.group==='branch'?'branch':s.group)+'-scenes').append(article);
}
const order=document.querySelector('#tomamae-order');
for(const s of scenes.filter(s=>s.group==='tomamae')){const li=document.createElement('li'),a=document.createElement('a');a.href='#scene-'+s.n;a.textContent=s.n+' '+s.name.split(' · ')[0];li.append(a);order.append(li);}
for (const [label,keys] of [['到站 → 栄浜 → 风车 → 海岸 · 1.7km / 22分','tomamae,minshuku,wind,beach'],['海岸 → 公园 → 道の駅 · 1.4km / 20分','beach,park,rest'],['道の駅 → 便利店 → 寺院 → 资料馆 → 返站 · 2.3km / 33分','rest,seico,temple,museum,tomamae']]) document.querySelector('#tomamae-walks').append(external(label+' ↗',googleRoute(keys),'button'));
document.querySelectorAll('[data-place]').forEach(a=>a.href=googlePlace(a.dataset.place));
document.querySelectorAll('[data-route]').forEach(a=>a.href=googleRoute(a.dataset.route));
