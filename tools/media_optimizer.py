import os
from PIL import Image
import subprocess

INPUT = "public"
OUTPUT = "public_optimized"

def optimize_image(path, out_path):
    img = Image.open(path).convert("RGB")
    img.save(out_path, "WEBP", quality=75, optimize=True)

def optimize_video(path, out_path):
    cmd = [
        "ffmpeg",
        "-i", path,
        "-vcodec", "libx264",
        "-crf", "28",
        "-preset", "fast",
        "-movflags", "+faststart",
        out_path
    ]
    subprocess.run(cmd)

def process():
    for root, _, files in os.walk(INPUT):
        for f in files:
            in_path = os.path.join(root, f)
            rel = os.path.relpath(in_path, INPUT)
            out_path = os.path.join(OUTPUT, rel)

            os.makedirs(os.path.dirname(out_path), exist_ok=True)

            if f.lower().endswith((".png", ".jpg", ".jpeg")):
                out_path = out_path.rsplit(".", 1)[0] + ".webp"
                optimize_image(in_path, out_path)

            elif f.lower().endswith(".mp4"):
                optimize_video(in_path, out_path)

if __name__ == "__main__":
    process()
