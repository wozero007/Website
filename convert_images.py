import os
from PIL import Image
from pathlib import Path

def convert_images(directory):
    path = Path(directory)
    print(f"Scanning {path.resolve()}...")
    
    count = 0
    errors = 0
    
    for file_path in path.glob('*'):
        if file_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
            try:
                # Target file
                target = file_path.with_suffix('.webp')
                
                # Check if exists
                if target.exists():
                    print(f"Skipping {file_path.name} (WebP exists)")
                    continue
                
                # Convert
                print(f"Converting {file_path.name}...")
                with Image.open(file_path) as img:
                    img.save(target, 'WEBP', quality=80)
                count += 1
            except Exception as e:
                print(f"Error converting {file_path.name}: {e}")
                errors += 1

    print(f"Finished. Converted: {count}. Errors: {errors}.")

if __name__ == "__main__":
    convert_images("images/photography")
