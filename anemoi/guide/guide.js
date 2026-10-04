// Facility searches stay distinct from community scene pins and photo locations.
const places = {
  sapporo:{query:'JR 札幌駅'},
  sapporo5:{query:'札幌駅前 高速バス 5番のりば'}, // Search area only: match the photo + official platform map.
  sapporo32:{query:'札幌駅前 32のりば 北5条西1丁目'},
  rumoiTerminal:{query:'北海道中央バス 留萌ターミナル'},
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
const googleRoute = (keys, mode='walking') => {
  const list=keys.split(',').map(k=>places[k]);
  const a=list[0], b=list.at(-1);
  return 'https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',origin:a.query,destination:b.query,travelmode:mode,...(a.id?{origin_place_id:a.id}:{}),...(b.id?{destination_place_id:b.id}:{}),...(list.length>2?{waypoints:list.slice(1,-1).map(p=>p.query).join('|')}:{})});
};
const community = id => 'https://www.anitabi.cn/map?bangumiId=465493&pid='+id;
const scenes = [
  {n:'1',group:'tomamae',place:'minshuku',name:'栄浜街道 · 民宿 30ノット',sub:'对照屋顶、路牌和远处的风车',photo:'sakaehama-street.jpg',pid:'alv8zs1',note:'先到民宿门外，顺着照片找街道的方向。这次只拍了外观，没有住这里；下面两张室内图来自补充资料，想进去看或拍照要先问老板。',next:'wind',nextName:'風来望',more:[
    {photo:'minshuku-bar.jpg',caption:'民宿吧台。室内照片来自补充资料，并非这次入内拍摄。'},
    {photo:'minshuku-tatami.jpg',caption:'榻榻米房间。对照窗户和顶灯；室内照片来自补充资料。'}]},
  {n:'2',group:'tomamae',place:'wind',name:'風来望 · 苫前风车',sub:'白色风机，近处可以拍仰视角度',photo:'windmill-base.jpg',pid:'45mprd4',note:'这张拍的角度和游戏里不同，可以先对照风车和旁边的路。附近只走开放道路，别为了凑角度跨过围栏。',next:'beach',nextName:'海岸弯道／白色沙滩',more:[{photo:'windmill-looking-up.jpg',caption:'另一张风车背景，可以试着从下面往上拍。'}]},
  {n:'3',group:'tomamae',place:'beach',name:'白色沙滩 · 海岸弯道',sub:'找沿海弯道和护栏，不是往沙滩正中走',photo:'coastal-bend.jpg',pid:'ez1whl4',note:'导航先到ホワイトビーチ附近。游戏里的路在海岸边，到附近后对着护栏和弯道找，别一直往沙滩里面走。',next:'park',nextName:'未来港公园',more:[{photo:'beach-evening-reference.jpg',caption:'宣传图是夕阳，下面拍的是白天海岸。用来对照地形，不是同一角度。'}]},
  {n:'4',group:'tomamae',place:'park',name:'夕陽ヶ丘未来港公园',sub:'海边的台阶、坡道和平台',photo:'mirai-stairs.jpg',pid:'alve9sm',note:'从开放步道进公园，找照片里的台阶和海边平台。这里和风车、海岸在同一片，可以一起逛。',next:'rest',nextName:'道の駅 風W',more:[{photo:'mirai-second-view.jpg',caption:'同一带的另一个角度，能看到海边步道和平台。'}]},
  {n:'5',group:'tomamae',place:'rest',name:'道の駅 風Wとままえ',sub:'海景平台，顺便歇一会儿',photo:'fuwatto-platform.jpg',pid:'gbiazd7',note:'走累了可以在这里休息，再往町内走。这张拍到了平台周边，但还没找到游戏里长椅的准确角度。',next:'seico',nextName:'Seicomart'},
  {n:'6',group:'tomamae',place:'seico',name:'Seicomart むらい苫前店',sub:'对照便利店门面，也可以顺路买水',photo:'seicomart.jpg',pid:'dm5fsj3',note:'找这家便利店的门面和出入口。顺路买点水和吃的，拍照时别挡住店门。',next:'temple',nextName:'久遠山大林寺'},
  {n:'7',group:'tomamae',place:'temple',name:'久遠山大林寺',sub:'山门、台阶和围墙都可以对照',photo:'dairinji.jpg',pid:'gbij60z',note:'先从外面拍山门和台阶。想进寺院的话看现场安排，碰到法事就别打扰。',next:'museum',nextName:'乡土资料馆'},
  {n:'8',group:'tomamae',place:'museum',name:'苫前町乡土资料馆',sub:'黄色的老校舍',photo:'museum-exterior.jpg',pid:'aj3chxn',note:'黄色校舍和屋顶很好认。想进馆看里面，先查当天是否开门；下面有一张馆内照片，不过CG对应哪间房还没对上。',next:'tomamae',nextName:'苫前上町回程站',more:[{photo:'museum-room-reference.jpg',caption:'馆内实拍。CG对应哪间房还没确认，这张暂时只看室内布局。'}]},
  {n:'9',group:'haboro',place:'street',name:'羽幌町 · 街道路口',sub:'对照超市、信号灯和路面标线',photo:'haboro-street.jpg',pid:'aj3f739',mapLabel:'照片里这个路口',note:'这个路口容易找偏，地图用了这次照片的位置。到了再对照超市、路牌和斑马线，别只看地图上的点。',next:'workman',nextName:'Workman House 羽幌'},
  {n:'10',group:'shosanbetsu',place:'observatory',name:'しょさんべつ天文台 · 正面',sub:'圆顶、圆窗和门前的砖路',photo:'observatory-front.jpg',pid:'3wvutqu',note:'从岬台公园走过来，先拍天文台正面。圆顶、圆窗和门前的路都能对上，花坛的样子会随季节变化。',next:'observatory',nextName:'圆窗大厅（馆内）',nextAnchor:'scene-11'},
  {n:'11',group:'shosanbetsu',place:'observatory',name:'天文台 · 圆窗大厅',sub:'进馆后看这面圆窗和中间的桌子',photo:'observatory-hall.jpg',pid:'eh2rfwi',note:'这里在馆内，要等开门后进去。主要对照圆窗、弧形墙面和中间的桌子，拍照前看看有没有其他访客入镜。',next:'observatory',nextName:'馆外草坪',nextAnchor:'scene-12'},
  {n:'12',group:'shosanbetsu',place:'observatory',name:'天文台 · 草坪',sub:'主视觉里的建筑和草坪',photo:'observatory-lawn.jpg',pid:'45l911q',note:'游戏主视觉是夜景，这张拍的是白天。可以对照圆顶和屋顶的方向，人物、花海和夜空就没法照着这张拍了。',next:'onsen',nextName:'温泉酒店／回程站'},
  {n:'A',group:'branch',place:'ranch',name:'小林牧场 · 入口',sub:'郊外的木牌和白色围栏',photo:'kobayashi-ranch.jpg',pid:'eh2oy6v',mapLabel:'牧场入口附近',note:'导航到牧场入口附近，对照木牌、白色围栏和远处的建筑。站在公共路边拍就好，不要往牧场里走。',next:'tomamae',nextName:'苫前上町（走回车站）'},
  {n:'B',group:'branch',place:'wheat',name:'栄浜／苫前町 · 麦田',sub:'秋天已经收割，和游戏里的夏天不一样',photo:'wheat-field-reference.jpg',pid:'dymy0us',mapLabel:'麦田附近',note:'10月来时已经收割了，拍摄的位置也和地图上的点有些距离。想拍游戏里的金色麦田，要另外考虑季节；田里不要进去。',next:'tomamae',nextName:'苫前上町（走回车站）'}
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
const localTimetable='https://www.engan-bus.co.jp/02_omnibus/01_routebus/12_horonobe_rumoi/index.html';
const expressTimetable='https://www.engan-bus.co.jp/01_expressbus/81_haboro_express/index.html';
const localStation = (lat,lng) => 'https://www.google.com/maps/d/viewer?'+new URLSearchParams({mid:'1bO7MHPAQLLZApTrgpgVafz2l0kA',ll:lat+','+lng,z:'19'});
const booking='https://secure.j-bus.co.jp/hon/Route/Highway?gpcd=010045&rocd=0001';
const busSteps=[
  {n:'direct',label:1,title:'札幌 → 苫前（推荐直达）',scope:'早上从札幌出发，省去留萌过夜',bus:'沿岸巴士 · 特急はぼろ号 0111便',time:'09:30 → 12:41',duration:'3小时11分',from:'札幌駅前 32のりば · 北5条西1丁目',board:'09:10左右到站等车。买票时下车站选“苫前上町”，不是羽幌。',to:'苫前上町',after:'中午下车后开始巡礼，傍晚再另坐当地巴士去羽幌。',keys:'sapporo32,tomamae',fare:'票价以订票页为准 · 全席指定，必须预约',extra:'这是走完后的推荐路线，不是本次实际乘车记录。当地巴士另付车费，不能用这张特急票继续坐。',station:googlePlace('sapporo32'),official:expressTimetable,walk:'sapporo,sapporo32',walkLabel:'札幌站 → 32号附近',stopKey:'tomamae',book:true,scene:'#tomamae',sceneLabel:'下车后，按这个顺序逛苫前'},
  {n:1,title:'札幌 → 留萌',scope:'先在留萌住一晚',bus:'北海道中央巴士 · 高速るもい号',time:'16:40 → 19:42',duration:'3小时02分',from:'札幌駅前 5番',board:'找写着“⑤／滝川・留萌方向”的站牌，照片在上面。',to:'留萌ターミナル',after:'晚上在留萌休息。第二天去苫前，要换到留萌駅前2号站牌。',keys:'sapporo5,rumoiTerminal',fare:'¥2,910 · 不用预约',extra:'想早点到，另有11:00 → 14:02这班。',station:'https://transfer.navitime.biz/chuo-bus/pc/diagram/BusAboardMap?stCode=00300912',official:'https://www.chuo-bus.co.jp/highway/index.cgi?n=14+&o=1&ope=pnt&t=21',walk:'sapporo,sapporo5',walkLabel:'札幌站 → 5号站牌附近',stopKey:'rumoiTerminal'},
  {n:2,title:'留萌 → 苫前',scope:'平日这班可以参考',bus:'沿岸巴士 · 12系統 幌延留萌線（北行）',time:'10:40 → 11:45',duration:'1小时05分',from:'留萌駅前 2のりば',board:'2号站牌，往小平、羽幌、幌延方向。',to:'苫前上町',after:'下车开始逛：民宿街道 → 风车 → 海岸 → 公园 → 町内。',keys:'rumoi,tomamae',fare:'¥1,350 · 不用预约',extra:'下车时顺便记一下返程站牌在哪边，回程要往羽幌方向。',station:'https://www.google.com/maps/d/viewer?ll=43.941731,141.6508611&mid=1ORkGVxz_XtF2nVgEJyxoAdXapB0&z=19',official:localTimetable,walk:'rumoiTerminal,rumoi',walkLabel:'留萌下车站 → 2号站牌',stopKey:'tomamae',scene:'#tomamae',sceneLabel:'看苫前怎么逛'},
  {n:3,title:'苫前 → 羽幌',scope:'逛到下午再走 · 平日班次',bus:'沿岸巴士 · 12系統 幌延留萌線（北行）',time:'16:50 → 17:06',duration:'16分钟',from:'苫前上町 · 羽幌方向站牌',board:'16:35左右回来等车，上车看往羽幌方向。',to:'羽幌ターミナル',after:'17:06到站就下车。可以先去酒店放箱子，再去拍羽幌街口。',keys:'tomamae,haboroBus',fare:'票价看时刻表／车内显示 · 不用预约',extra:'17:08是这辆车继续往北开，不是下车时间。',station:localStation('44.3109077','141.6560883'),official:localTimetable,walk:'museum,tomamae',walkLabel:'资料馆 → 回程站牌附近',stopKey:'haboroBus',scene:'#haboro',sceneLabel:'看羽幌街口和住宿'},
  {n:4,title:'羽幌 → 初山别温泉',scope:'周末／节假日的早班',bus:'沿岸巴士 · 12系統 幌延留萌線（北行）',time:'09:03 → 09:36',duration:'33分钟',from:'羽幌ターミナル／沿岸巴士羽幌营业所',board:'南7条4丁目，认往初山别／幌延方向的车。别走到本社ターミナル或渡轮码头。',to:'しょさんべつ温泉',after:'在岬の湯酒店前下车，再走去公园和天文台。不是初山別役場前。',keys:'haboroBus,onsen',fare:'¥1,250 · 不用预约',extra:'平日早班是07:43 → 08:16；12:03 → 12:36这班也要先查运行日。',station:localStation('44.360797','141.705957'),official:localTimetable,walk:'workman,haboroBus',walkLabel:'Workman House → 巴士站',stopKey:'onsen',scene:'#shosanbetsu',sceneLabel:'看天文台怎么逛'},
  {n:5,title:'初山别温泉 → 羽幌',scope:'当天回羽幌的话坐这班',bus:'沿岸巴士 · 12系統 幌延留萌線（南行）',time:'16:53 → 17:31',duration:'38分钟',from:'しょさんべつ温泉 · 酒店前回车场',board:'回到下车的地方等，往返共用站牌，不用去马路对面找。建议16:35回来，看往羽幌／留萌方向。',to:'羽幌ターミナル',after:'羽幌总站17:31到。时刻表上的17:28是本社ターミナル，别看错行。',keys:'onsen,haboroBus',fare:'¥1,250 · 不用预约',extra:'想留到晚上就考虑住岬の湯，第二天回羽幌的车要另查。',station:localStation('44.563396','141.7770949'),official:localTimetable,walk:'observatory,onsen',walkLabel:'天文台 → 回程站',stopKey:'haboroBus'},
  {n:6,title:'羽幌 → 札幌',scope:'这段要提前订票',bus:'沿岸巴士 · 特急はぼろ号 0041便',time:'13:04 → 16:27',duration:'3小时23分',from:'羽幌ターミナル／沿岸巴士羽幌营业所',board:'提前15–20分钟到，认准车票上的站名和车次。',to:'札幌駅前 32のりば',after:'回到札幌站前32号附近。经留萌走的高速るもい号在5号，别把站牌弄混。',keys:'haboroBus,sapporo32',fare:'普通¥4,700／网付¥4,420 · 全席指定，必须预约',extra:'付款后的邮件乘车票就能用，不用换实体票。收据不是车票，别只存收据。',station:localStation('44.360797','141.705957'),official:expressTimetable,walk:'workman,haboroBus',walkLabel:'Workman House → 巴士站',stopKey:'sapporo32',book:true}
];
for(const s of busSteps){
  const article=document.createElement('article');article.id='bus-'+s.n;article.className='bus-card bus-step'+(s.book?' reserved':'');
  const heading=document.createElement('div');heading.className='bus-step-heading';
  const number=document.createElement('span');number.className='number';number.textContent=s.label||(s.n<3?'备'+s.n:s.n-1);
  const wrap=document.createElement('div'),scope=document.createElement('span'),title=document.createElement('h3');scope.className='bus-label';scope.textContent=s.scope;title.textContent=s.title;wrap.append(scope,title);heading.append(number,wrap);article.append(heading);
  const bus=document.createElement('p');bus.className='bus-name';bus.textContent=s.bus;article.append(bus);
  const time=document.createElement('p');time.className='leg-time';time.textContent=s.time;
  const duration=document.createElement('span');duration.textContent='车程 '+s.duration;time.append(duration);article.append(time);
  const stops=document.createElement('dl');stops.className='stop-facts';
  for(const [label,name,note] of [['上车',s.from,s.board],['下车',s.to,s.after]]){const dt=document.createElement('dt'),dd=document.createElement('dd'),strong=document.createElement('strong'),p=document.createElement('p');dt.textContent=label;strong.textContent=name;p.textContent=note;dd.append(strong,p);stops.append(dt,dd);}article.append(stops);
  const fare=document.createElement('p');fare.className='leg-fare';fare.textContent=s.fare;article.append(fare);
  const links=document.createElement('div');links.className='scene-actions';links.append(external(s.walkLabel+' ↗',googleRoute(s.walk)),external('这段公交路线 ↗',googleRoute(s.keys,'transit'),'next'),external('上车站牌位置 ↗',s.station),external('下车站地图 ↗',googlePlace(s.stopKey)),external('时刻表 ↗',s.official));if(s.book)links.append(external('订票 ↗',booking));article.append(links);
  const extra=document.createElement('p');extra.className='small';extra.textContent=s.extra;article.append(extra);
  if(s.scene){const next=document.createElement('a');next.href=s.scene;next.className='text-link';next.textContent=s.sceneLabel+' ↓';article.append(next);}
  document.querySelector(s.n<3?'#alternative-bus-steps':'#bus-steps').append(article);
}
const flow=[['札幌 32','#bus-direct','sapporo32,tomamae'],['苫前','#tomamae','tomamae,haboroBus'],['羽幌','#haboro','haboroBus,onsen'],['初山别温泉','#shosanbetsu','onsen,haboroBus'],['羽幌','#bus-6','haboroBus,sapporo32'],['札幌 32','#bus-6']];
const flowRoot=document.querySelector('#transport-flow');
for(const [label,anchor,keys] of flow){const stop=document.createElement('a');stop.className='flow-stop';stop.href=anchor;stop.textContent=label;flowRoot.append(stop);if(keys){const leg=external('→',googleRoute(keys,'transit'),'flow-leg');leg.setAttribute('aria-label',label+'出发的下一段公交路线');flowRoot.append(leg);}}
for (const s of scenes) {
  const article=document.createElement('article');article.className='scene';article.id='scene-'+s.n;
  const head=document.createElement('div');head.className='scene-title';
  const number=document.createElement('span');number.className='number';number.textContent=s.n;
  const titleWrap=document.createElement('div'),title=document.createElement('h3'),sub=document.createElement('p');title.textContent=s.name;sub.textContent=s.sub;titleWrap.append(title,sub);head.append(number,titleWrap);
  article.append(head,image(s.photo,s.name));
  const body=document.createElement('div');body.className='scene-body';const note=document.createElement('p');note.textContent=s.note;body.append(note);
  const actions=document.createElement('div');actions.className='scene-actions';actions.append(external((s.mapLabel||'打开地图')+' ↗',googlePlace(s.place)));
  if(s.nextAnchor){const a=document.createElement('a');a.href='#'+s.nextAnchor;a.className='next';a.textContent='接着看 '+s.nextName+' ↓';actions.append(a);}
  else actions.append(external('走到下一处：'+s.nextName+' ↗',googleRoute(s.place+','+s.next),'next'));
  body.append(actions,external('Anitabi对照图 ↗',community(s.pid),'source-link'));
  if(s.more){const more=document.createElement('details');more.className='more-scenes';const summary=document.createElement('summary');summary.textContent='再看 '+s.more.length+' 张场景对照';more.append(summary);for(const m of s.more)more.append(image(m.photo,s.name,m.caption));body.append(more);}
  article.append(body);document.querySelector('#'+(s.group==='branch'?'branch':s.group)+'-scenes').append(article);
}
const order=document.querySelector('#tomamae-order');
for(const s of scenes.filter(s=>s.group==='tomamae')){const li=document.createElement('li'),a=document.createElement('a');a.href='#scene-'+s.n;a.textContent=s.n+' '+s.name.split(' · ')[0];li.append(a);order.append(li);}
for (const [label,keys] of [['到站 → 栄浜 → 风车 → 海岸 · 1.7km / 22分','tomamae,minshuku,wind,beach'],['海岸 → 公园 → 道の駅 · 1.4km / 20分','beach,park,rest'],['道の駅 → 便利店 → 寺院 → 资料馆 → 返站 · 2.3km / 33分','rest,seico,temple,museum,tomamae']]) document.querySelector('#tomamae-walks').append(external(label+' ↗',googleRoute(keys),'button'));
document.querySelectorAll('[data-place]').forEach(a=>a.href=googlePlace(a.dataset.place));
document.querySelectorAll('[data-route]').forEach(a=>a.href=googleRoute(a.dataset.route));
document.querySelectorAll('[data-transit]').forEach(a=>a.href=googleRoute(a.dataset.transit,'transit'));
const alternative=document.querySelector('#rumoi-alternative');
const revealAlternative=()=>{if(location.hash==='#rumoi-alternative'||location.hash==='#bus-1'||location.hash==='#bus-2')alternative.open=true;};
window.addEventListener('hashchange',revealAlternative);
revealAlternative();
