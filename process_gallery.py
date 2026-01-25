import os
import json
from PIL import Image
import pillow_avif

# Configuration
BASE_DIR = os.path.join('images', 'photography')
ORIGINALS_DIR = os.path.join(BASE_DIR, 'Originals')
THUMBS_DIR = os.path.join(BASE_DIR, 'Thumbs')

# Archive Paths (Subfolders)
ARCHIVE_SUBDIR = 'Archive'
ORIGINALS_ARCHIVE_DIR = os.path.join(ORIGINALS_DIR, ARCHIVE_SUBDIR)
THUMBS_ARCHIVE_DIR = os.path.join(THUMBS_DIR, ARCHIVE_SUBDIR)

# Recent Paths (Subfolders)
RECENT_SUBDIR = 'Recent'
ORIGINALS_RECENT_DIR = os.path.join(ORIGINALS_DIR, RECENT_SUBDIR)
THUMBS_RECENT_DIR = os.path.join(THUMBS_DIR, RECENT_SUBDIR)

JS_LIST_FILE = os.path.join('js', 'image_list.js')

# Image Settings
FULL_MAX_WIDTH = 2500
THUMB_MAX_WIDTH = 600
QUALITY = 80

EXTENSIONS = ('.jpg', '.jpeg', '.png')

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")

def resize_and_convert(source_path, dest_path, max_width):
    """Resizes and converts image to AVIF."""
    try:
        with Image.open(source_path) as img:
            from PIL import ImageOps
            img = ImageOps.exif_transpose(img)

            width_percent = (max_width / float(img.size[0]))
            if width_percent < 1: 
                hsize = int((float(img.size[1]) * float(width_percent)))
                img = img.resize((max_width, hsize), Image.Resampling.LANCZOS)
            
            img.save(dest_path, 'AVIF', quality=QUALITY)
            print(f"Generated: {dest_path}")
            return True
            
    except Exception as e:
        print(f"Failed to process {source_path}: {e}")
        return False

def process_directory(source_folder, full_dest_folder, thumb_dest_folder):
    """
    Processes images in source_folder.
    - Saves Full AVIF -> full_dest_folder (usually same as source_folder)
    - Saves Thumb AVIF -> thumb_dest_folder
    Returns list of processed filenames (just the basename.avif).
    """
    if not os.path.exists(source_folder):
        print(f"Directory not found: {source_folder}")
        return []

    ensure_dir(full_dest_folder)
    ensure_dir(thumb_dest_folder)

    valid_images = []
    
    files = [f for f in os.listdir(source_folder) if os.path.isfile(os.path.join(source_folder, f))]
    print(f"Scanning {source_folder}: Found {len(files)} files.")

    for filename in files:
        if filename.lower().endswith(EXTENSIONS):
            source_path = os.path.join(source_folder, filename)
            base_name = os.path.splitext(filename)[0]
            avif_filename = f"{base_name}.avif"
            
            full_avif_path = os.path.join(full_dest_folder, avif_filename)
            thumb_avif_path = os.path.join(thumb_dest_folder, avif_filename)

            # 1. Generate Full Size (DISABLED - User wants only JPG in Originals)
            # if not os.path.exists(full_avif_path):
            #     print(f"Processing Full: {filename}")
            #     resize_and_convert(source_path, full_avif_path, FULL_MAX_WIDTH)
            
            # We still need to verify the file is valid for the list, 
            # assuming source exists is enough since we are serving the JPG.
            
            # 2. Generate Thumb (in Thumbs dir)
            if not os.path.exists(thumb_avif_path):
                print(f"Processing Thumb: {filename}")
                resize_and_convert(source_path, thumb_avif_path, THUMB_MAX_WIDTH)

            # Add to list if we have the source file (which we iterate over)
            if os.path.exists(source_path):
                # We export the ORIGINAL filename so the frontend can link to the source file
                # The frontend will be responsible for swapping extension to .avif for thumbnails
                valid_images.append(filename)
                
    valid_images.sort(reverse=True)
    return valid_images

def main():
    print("Starting Gallery Processing...")
    
    # 1. Process Main Gallery
    # Source: Originals/
    # Full Dest: Originals/ (Save AVIFs alongside originals)
    # Thumb Dest: Thumbs/
    print("--- Processing Main Gallery ---")
    main_images = process_directory(ORIGINALS_DIR, ORIGINALS_DIR, THUMBS_DIR)
    
    # 2. Process Archive
    # Source: Originals/Archive/
    # Full Dest: Originals/Archive/
    # Thumb Dest: Thumbs/Archive/
    print("--- Processing Archive ---")
    archive_images = process_directory(ORIGINALS_ARCHIVE_DIR, ORIGINALS_ARCHIVE_DIR, THUMBS_ARCHIVE_DIR)

    # 3. Process Recent (For Carousel)
    print("--- Processing Recent ---")
    recent_images = process_directory(ORIGINALS_RECENT_DIR, ORIGINALS_RECENT_DIR, THUMBS_RECENT_DIR)

    # 4. Update JS List
    update_js_list(main_images, archive_images, recent_images)

def update_js_list(main_images, archive_images, recent_images):
    js_content = "window.photographyImages = [\n"
    for img in main_images:
        js_content += f"    \"{img}\",\n"
    js_content += "];\n\n"
    
    js_content += "window.archiveImages = [\n"
    for img in archive_images:
        js_content += f"    \"{img}\",\n"
    js_content += "];\n\n"

    js_content += "window.recentImages = [\n"
    for img in recent_images:
        js_content += f"    \"{img}\",\n"
    js_content += "];\n"

    with open(JS_LIST_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Updated {JS_LIST_FILE}")

if __name__ == "__main__":
    main()
