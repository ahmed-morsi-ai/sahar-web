import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from processor import process_file
from config import INPUT_DIR

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
    print("👀 Media System Running...")

    observer = Observer()
    observer.schedule(Handler(), INPUT_DIR, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
