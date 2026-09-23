# bells0.github.io

Personal portfolio and field notes for wonderbell.

The homepage presents AI agent systems across commerce, research, creative operations, knowledge workflows, and software delivery. It is intentionally dependency-free and deploys directly through GitHub Pages.

## Local preview

```bash
python3 -m http.server 4177 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4177/`.

The previous generated Hexo pages remain in Git history and their existing paths are left untouched during the initial portfolio rollout.

## anemoi 巡礼图库

入口：[anemoi 巡礼原图收藏](https://bells0.github.io/anemoi/)。

`anemoi/` 是自包含的静态图库：260 张公开来源的原始图片文件及 1 张单独标注的缩略图，按官方素材、游戏场景及巡礼实景分类，支持按地点、人物、文件名和来源搜索。列表使用单独生成的 WebP 预览图（最大 720 × 480、保持比例、不裁切、懒加载），只有点击图片或“打开原图”才请求原始文件。图片直接由 GitHub Pages 提供，不依赖 OSS 或国内服务器。

更新预览图：安装 Pillow 后运行 `python3 scripts/build-anemoi-thumbnails.py`。脚本生成 `anemoi/thumbnails/`，更新列表及清单中的预览路径，保留原图与原图链接。

图片尺寸与来源见 `anemoi/image-manifest.json` 和 `anemoi/图片来源与像素.csv`。图片版权归 VISUAL ARTS/Key、客座画师及摄影者；本站是非官方个人巡礼资料整理。原始文件保留来源站水印与像素，不代表美术制作源文件或完整游戏 CG 库。

Pages 是公开静态网站，没有登录保护；仓库仅包含公开网页素材与页面文件，不包含个人行程、密码、SSH 配置或 OSS 凭据。`.nojekyll` 保持原样，由现有 `main` 分支根目录发布。
