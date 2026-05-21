import time
import os
from PIL import Image
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess

INPUT = "public"
OUTPUT = "public_optimized"

def ensure_dir(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)

def optimize_image(src_path, out_path):
    try:
        img = Image.open(src_path).convert("RGB")
        img.save(out_path, "WEBP", quality=75, optimize=True)
        print(f"✅ Optimized image: {src_path} -> {out_path}")
    except Exception as e:
        print(f"❌ Image error: {src_path} -> {e}")

def optimize_video(src_path, out_path):
    try:
        cmd = [
            "ffmpeg",
            "-y",
            "-i", src_path,
            "-vcodec", "libx264",
            "-crf", "28",
            "-preset", "fast",
            "-movflags", "+faststart",
            out_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"🎬 Optimized video: {src_path}")
    except Exception as e:
        print(f"❌ Video error: {src_path} -> {e}")

def process_file(path):
    if not os.path.exists(path):
        return

    rel = os.path.relpath(path, INPUT)
    out_path = os.path.join(OUTPUT, rel)

    ensure_dir(out_path)

    ext = path.lower()

    if ext.endswith((".png", ".jpg", ".jpeg")):
        out_path = out_path.rsplit(".", 1)[0] + ".webp"
        optimize_image(path, out_path)

    elif ext.endswith(".mp4"):
        optimize_video(path, out_path)


class Handler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return
        time.sleep(1)
        process_file(event.src_path)

    def on_modified(self, event):
        if event.is_directory:
            return
        time.sleep(1)
        process_file(event.src_path)


if __name__ == "__main__":
    print("👀 Watching public/ for new media files...")

    observer = Observer()
    observer.schedule(Handler(), INPUT, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
