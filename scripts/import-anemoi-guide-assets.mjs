// Copy selected, already-exported images intact. No resizing or photo edits.
// Usage: node scripts/import-anemoi-guide-assets.mjs /absolute/path/to/图片巡礼补全
import {readFile,copyFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=process.argv[2];
if(!root || !path.isAbsolute(root)) throw new Error('Provide the absolute collection directory.');
const target=fileURLToPath(new URL('../anemoi/guide/assets/',import.meta.url));
const manifest=JSON.parse(await readFile(path.join(root,'巡礼补全清单.json'),'utf8'));
const names={
  '01-栄浜街道':'sakaehama-street',
  '03-風来望·风车底座':'windmill-base',
  '03-苫前风车·仰望':'windmill-looking-up',
  '04-白色沙滩·沿海弯道':'coastal-bend',
  '04-白色沙滩·夕阳参考':'beach-evening-reference',
  '05-未来港公园·阶梯':'mirai-stairs',
  '05-未来港公园·补充视角':'mirai-second-view',
  '06-道の駅風W·海景平台':'fuwatto-platform',
  '07-苫前Seicomart':'seicomart',
  '08-久遠山大林寺':'dairinji',
  '10-羽幌街道路口':'haboro-street',
  '11-天文台正面':'observatory-front',
  '12-天文台圆窗大厅':'observatory-hall',
  '13-天文台草坪主视觉':'observatory-lawn',
  '09-乡土资料馆外观-补拍':'museum-exterior',
  '14-乡土资料馆室内-补拍':'museum-room-reference',
  '15-小林牧场入口':'kobayashi-ranch',
  '17-民宿30ノット-吧台室内':'minshuku-bar',
  '18-民宿30ノット-榻榻米室内':'minshuku-tatami',
  '16-栄浜苫前町麦田-周边补拍':'wheat-field-reference'
};
await mkdir(target,{recursive:true});
const sources=[];
for(const c of manifest.comparisons){
  const name=names[path.basename(c.file,'.jpg')];if(!name)throw new Error('Unmapped comparison: '+c.file);
  await copyFile(path.join(root,c.file),path.join(target,name+'.jpg'));
  sources.push({file:name+'.jpg',title:c.name,scene_source:c.source,scene_points:c.point_ids,photo_date:c.photo_day,photo_source:c.media_source||'2026年10月巡礼实拍',accuracy:c.status,note:c.note});
}
for(const [name,input] of Object.entries({
  'coast-windmill':'2026-10-02-IMG_20261002_125054',
  'rumoi-boarding':'2026-10-02-IMG_20261002_100939',
  'minshuku-exterior':'2026-10-02-IMG_20261002_115756',
  'workman-exterior':'2026-10-02-IMG_20261002_160644',
  'misakidai-sign':'2026-10-03-IMG_20261003_094326'
})){
  await copyFile(path.join(root,'照片预览',input+'.jpg'),path.join(target,name+'.jpg'));
  sources.push({file:name+'.jpg',title:name,photo_date:input.slice(0,10),photo_source:'巡礼实拍的现有预览导出'});
}
await writeFile(path.join(target,'sources.json'),JSON.stringify({updated:'2026-10-03',copyright:'游戏画面 © VISUAL ARTS / Key；实景摄影版权归摄影者。非官方巡礼资料。',sources},null,2)+'\n');
console.log(`Copied ${sources.length} images; 20 existing comparison exports reused without modification.`);
