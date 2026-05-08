import os
import re

def combine_css():
    base_dir = r"c:\Users\Hp\OneDrive\GitHubProjects\Axularies\Website"
    style_path = os.path.join(base_dir, "style.css")
    
    with open(style_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find imports: @import 'css/base.css'; or @import "css/base.css";
    # We will replace the import line with the content of the file.
    
    def replace_import(match):
        import_path = match.group(1)
        full_path = os.path.join(base_dir, import_path)
        
        if os.path.exists(full_path):
            print(f"Merging {import_path}...")
            with open(full_path, "r", encoding="utf-8") as css_file:
                return f"/* Merged from {import_path} */\n" + css_file.read() + "\n"
        else:
            print(f"Warning: {import_path} not found.")
            return match.group(0)

    # Pattern matches @import 'path'; or @import "path";
    pattern = re.compile(r"@import ['\"](.*?)['\"];")
    
    new_content = pattern.sub(replace_import, content)
    
    # Save to a new file first to verify
    new_style_path = os.path.join(base_dir, "style_merged.css")
    with open(new_style_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print("CSS Merged successfully into style_merged.css")

if __name__ == "__main__":
    combine_css()
