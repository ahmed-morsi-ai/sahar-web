import os
import subprocess
from PIL import Image
from config import OUTPUT_DIR, THUMB_DIR, IMAGE_QUALITY, VIDEO_CRF

def ensure(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)

def optimize_image(src, out):
    img = Image.open(src).convert("RGB")
    img.save(out, "WEBP", quality=IMAGE_QUALITY, optimize=True)

def make_thumbnail(src, thumb):
    img = Image.open(src)
    img.thumbnail((400, 400))
    img.save(thumb, "WEBP", quality=60)

def optimize_video(src, out, thumb):
    # video compress
    subprocess.run([
        "ffmpeg", "-y", "-i", src,
        "-vcodec", "libx264",
        "-crf", str(VIDEO_CRF),
        "-preset", "fast",
        "-movflags", "+faststart",
        out
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # thumbnail from frame
    subprocess.run([
        "ffmpeg", "-y", "-i", src,
        "-ss", "00:00:01",
        "-vframes", "1",
        thumb
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def process_file(path):
    rel = os.path.basename(path)

    name, ext = os.path.splitext(rel)

    if ext.lower() in [".png", ".jpg", ".jpeg"]:
        out = os.path.join(OUTPUT_DIR, name + ".webp")
        thumb = os.path.join(THUMB_DIR, name + ".webp")

        ensure(out)
        ensure(thumb)

        optimize_image(path, out)
        make_thumbnail(path, thumb)

        print(f"🖼️ image optimized: {rel}")

    elif ext.lower() == ".mp4":
        out = os.path.join(OUTPUT_DIR, name + ".mp4")
        thumb = os.path.join(THUMB_DIR, name + ".webp")

        ensure(out)
        ensure(thumb)

        optimize_video(path, out, thumb)

        print(f"🎬 video optimized: {rel}")
