import os
from PIL import Image

def process_image(filename):
    path = f"assets/{filename}"
    if not os.path.exists(path):
        return
        
    try:
        img = Image.open(path).convert("RGBA")
        data = img.getdata()
        
        # 1. Make white background transparent (like make_transparent.py did)
        bg_color = data[0]
        new_data = []
        tolerance = 50
        
        # Check if the top-left pixel is actually white/light
        if bg_color[0] > 200 and bg_color[1] > 200 and bg_color[2] > 200:
            for item in data:
                if (abs(item[0] - bg_color[0]) < tolerance and 
                    abs(item[1] - bg_color[1]) < tolerance and 
                    abs(item[2] - bg_color[2]) < tolerance):
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)
            img.putdata(new_data)
        
        # 2. Crop to bounding box of non-transparent pixels
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(path, "PNG")
        print(f"Processed {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

files = [
    "frog.png",
    "frog_idle_1.png",
    "frog_idle_2.png",
    "frog_jump_1.png",
    "frog_jump_2.png",
    "pipe_top.png",
    "pipe_bottom.png"
]

for f in files:
    process_image(f)
