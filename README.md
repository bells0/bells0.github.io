# bells0.github.io

Personal portfolio for wonderbell.

The homepage presents current Amazon-first research and Listing production work, public Codex tools, a personal anemoi introduction, and clearly labeled earlier projects. Project screenshots on the homepage have been replaced by typographic workflow illustrations. The About page explains the current focus; older blog posts remain available in the archive. The site is dependency-free and deploys directly through GitHub Pages.

## Local preview

```bash
python3 -m http.server 4177 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4177/`.

The previous generated Hexo pages remain in Git history and their existing paths are left untouched during the initial portfolio rollout.

## anemoi 巡礼图库

介绍入口：[anemoi](https://bells0.github.io/anemoi/intro/)；从这里可进入官方作品资料和本站图库。首页专题使用仓库中已有的 Key 官方主视觉，并在图片旁标注来源与非官方性质。

入口：[anemoi 巡礼原图收藏](https://bells0.github.io/anemoi/)。

`anemoi/` 是自包含的静态图库：260 张公开来源的原始图片文件及 1 张单独标注的缩略图，按官方素材、游戏场景及巡礼实景分类，支持按地点、人物、文件名和来源搜索。列表使用单独生成的 WebP 预览图（最大 720 × 480、保持比例、不裁切、懒加载），只有点击图片或“打开原图”才请求原始文件。图片直接由 GitHub Pages 提供，不依赖 OSS 或国内服务器。

更新预览图：安装 Pillow 后运行 `python3 scripts/build-anemoi-thumbnails.py`。脚本生成 `anemoi/thumbnails/`，更新列表及清单中的预览路径，保留原图与原图链接。

图片尺寸与来源见 `anemoi/image-manifest.json` 和 `anemoi/图片来源与像素.csv`。图片版权归 VISUAL ARTS/Key、客座画师及摄影者；本站是非官方个人巡礼资料整理。原始文件保留来源站水印与像素，不代表美术制作源文件或完整游戏 CG 库。

Pages 是公开静态网站，没有登录保护；仓库仅包含公开网页素材与页面文件，不包含个人行程、密码、SSH 配置或 OSS 凭据。`.nojekyll` 保持原样，由现有 `main` 分支根目录发布。

## anemoi 图文交通指南

`anemoi/guide/` 是从札幌开始的中文图文攻略：札幌站、⑤站牌、中央巴士三张实拍先帮助认路，再按六段公交卡接苫前、羽幌与初山别的20组游戏／实景上下对照。每段公交写明上车站、车名与方向、下车站、示例时刻和运行日；分别提供步行到站、Google公交区间、官方站位和时刻入口。另列札幌直达苫前的预约制方案，不把私人行程当成唯一走法。住宿推荐附民宿电话、羽幌备选官网、初山别温泉预约入口。

本地预览：`http://127.0.0.1:4177/anemoi/guide/`。当前待用户确认后再发布；本地完成不等于线上已更新。图片点击直接打开文件，不用弹窗。所用文件来自已有无 EXIF 预览与对照导出，不包含私人票据或订单。

选择性重新导入素材：`node scripts/import-anemoi-guide-assets.mjs /absolute/path/to/图片巡礼补全 /absolute/path/to/2026-10-01-selected`。第二个目录是已去EXIF的札幌出发照片导出；不直接使用手机原片。来源记录在 `anemoi/guide/assets/sources.json`；保留补充实景、周边参考及房间对应待确认等状态。⑤站牌Google搜索仍有同名歧义，页面明确以实拍和中央巴士官方站位图确认，不宣称该搜索结果是精确站牌。
