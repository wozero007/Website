import os
import pillow_avif
from PIL import Image

def optimize_images(root_dir):
    # Targets for conversion
    source_extensions = ('.jpg', '.jpeg')
    # Targets for cleanup
    cleanup_extensions = ('.jpg', '.jpeg', '.webp')
    
    files_converted = 0
    files_cleaned = 0
    errors = 0

    print(f"Scanning {root_dir}...")

    # 1. Conversion Phase
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith(source_extensions):
                file_path = os.path.join(root, file)
                avif_path = os.path.splitext(file_path)[0] + ".avif"

                # Skip if AVIF already exists (partial run resilience)
                if os.path.exists(avif_path):
                     print(f"Skipping (AVIF exists): {file}")
                     continue

                try:
                    with Image.open(file_path) as im:
                        # Save as AVIF
                        im.save(avif_path, "AVIF", quality=80)
                        files_converted += 1
                        print(f"Converted: {file} -> {os.path.basename(avif_path)}")
                except Exception as e:
                    print(f"Error converting {file}: {e}")
                    errors += 1

    # 2. Cleanup Phase (Only if conversion succeeded for a file, actually we requested 'Discard jpge everywhere')
    # Use a separate walk to safely delete all target files
    print("\nStarting Cleanup Phase...")
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith(cleanup_extensions):
                file_path = os.path.join(root, file)
                # Ensure we don't delete if we failed to create an AVIF? 
                # Strict requirement: "Discard jpge everywhere" + "replace jpg to avif"
                # We assume conversion worked or we just delete. 
                # Safer: Check if AVIF exists before deleting source JPG. 
                # But for WebP, we just delete them as they are unwanted now.
                
                base_name = os.path.splitext(file_path)[0]
                avif_check = base_name + ".avif"
                
                # Logic: 
                # If it's a JPG, delete ONLY if AVIF exists.
                # If it's a WebP, delete unconditionally (as we moved away from it).
                
                try:
                    if file.lower().endswith('.webp'):
                        os.remove(file_path)
                        files_cleaned += 1
                        print(f"Deleted (Cleanup): {file}")
                    
                    elif file.lower().endswith(source_extensions):
                        if os.path.exists(avif_check):
                            os.remove(file_path)
                            files_cleaned += 1
                            print(f"Deleted (Source): {file}")
                        else:
                            print(f"Skipped Delete (No AVIF): {file}")

                except Exception as e:
                    print(f"Error deleting {file}: {e}")

    print(f"\nSummary:")
    print(f"Converted: {files_converted}")
    print(f"Cleaned: {files_cleaned}")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    optimize_images(os.getcwd())
