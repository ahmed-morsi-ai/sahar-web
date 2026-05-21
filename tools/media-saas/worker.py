import os
import time
import subprocess
from PIL import Image

ORIGINAL = "public/media/original"
OPTIMIZED = "public/media/optimized"
THUMB = "public/media/thumbnails"

def ensure(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)

def process_image(file):
    name = os.path.splitext(file)[0]

    src = f"{ORIGINAL}/{file}"
    out = f"{OPTIMIZED}/{name}.webp"
    thumb = f"{THUMB}/{name}.webp"

    ensure(out)
    ensure(thumb)

    img = Image.open(src).convert("RGB")
    img.save(out, "WEBP", quality=75)

    img.thumbnail((400, 400))
    img.save(thumb, "WEBP", quality=60)

    print("🖼️ processed:", file)

def process_video(file):
    name = os.path.splitext(file)[0]

    src = f"{ORIGINAL}/{file}"
    out = f"{OPTIMIZED}/{name}.mp4"
    thumb = f"{THUMB}/{name}.webp"

    ensure(out)
    ensure(thumb)

    subprocess.run([
        "ffmpeg", "-y", "-i", src,
        "-vcodec", "libx264",
        "-crf", "28",
        "-preset", "fast",
        out
    ])

    subprocess.run([
        "ffmpeg", "-y", "-i", src,
        "-ss", "00:00:01",
        "-vframes", "1",
        thumb
    ])

    print("🎬 processed:", file)

if __name__ == "__main__":
    seen = set()

    while True:
        files = os.listdir(ORIGINAL)

        for file in files:
            if file in seen:
                continue

            if file.lower().endswith((".png", ".jpg", ".jpeg")):
                process_image(file)

            elif file.lower().endswith(".mp4"):
                process_video(file)

            seen.add(file)

        time.sleep(2)