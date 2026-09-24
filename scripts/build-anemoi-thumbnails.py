#!/usr/bin/env python3
"""Create lightweight previews without changing any original image file.

Requires Pillow. Run from any directory with --gallery to target another copy.
"""
import argparse
import html
import json
from pathlib import Path

from PIL import Image, ImageOps


def build(gallery):
    gallery = gallery.resolve()
    manifest = gallery / "image-manifest.json"
    records = json.loads(manifest.read_text())
    page_path = gallery / "index.html"
    page = page_path.read_text()
    for record in records:
        relative = Path(record["file"])
        if relative.is_absolute() or ".." in relative.parts:
            raise ValueError(f"Invalid image path: {relative}")
        thumbnail = Path("thumbnails") / (relative.as_posix() + ".webp")
        target = gallery / thumbnail
        target.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(gallery / relative) as source:
            preview = ImageOps.exif_transpose(source)
            preview.thumbnail((720, 480), Image.Resampling.LANCZOS)
            if preview.mode not in ("RGB", "RGBA"):
                preview = preview.convert("RGBA" if "transparency" in preview.info else "RGB")
            preview.save(target, "WEBP", quality=78, method=4)
            width, height = preview.size
        original_src = f'<img src="{html.escape(relative.as_posix(), quote=True)}"'
        thumbnail_src = f'<img src="{html.escape(thumbnail.as_posix(), quote=True)}"'
        if original_src in page:
            page = page.replace(original_src, thumbnail_src + ' decoding="async"')
        elif thumbnail_src not in page and thumbnail_src.replace('<img src=', '<img data-src=') not in page:
            raise ValueError(f"No gallery image element for {relative}")
        record.update(thumbnail=thumbnail.as_posix(), thumbnail_bytes=target.stat().st_size,
                      thumbnail_width=width, thumbnail_height=height)
    page = page.replace(">打开文件</a>", ">打开原图</a>")
    preview_note = '<p class="preview-note">列表使用轻量缩略图，点击图片或“打开原图”查看完整尺寸。</p>'
    if 'class="preview-note"' not in page:
        page = page.replace('<div class="featured">', preview_note + '\n<div class="featured">', 1)
    page_path.write_text(page)
    manifest.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")
    originals = sum(record["bytes"] for record in records)
    previews = sum(record["thumbnail_bytes"] for record in records)
    print(json.dumps({"images": len(records), "original_bytes": originals,
                      "thumbnail_bytes": previews,
                      "reduction_percent": round(100 * (1 - previews / originals), 2)}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gallery", type=Path,
                        default=Path(__file__).resolve().parents[1] / "anemoi")
    build(parser.parse_args().gallery)
