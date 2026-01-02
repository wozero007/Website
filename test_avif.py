from PIL import Image
import pillow_avif  # Force load plugin

try:
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save('test.avif', 'AVIF')
    print("AVIF save SUCCESS")
except Exception as e:
    print(f"AVIF save FAILED: {e}")
