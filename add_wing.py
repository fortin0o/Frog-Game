# pyrefly: ignore [missing-import]
from PIL import Image, ImageDraw

def add_wings():
    try:
        frog = Image.open('assets/frog_idle_1.png').convert('RGBA')
    except Exception as e:
        print("Could not open frog image:", e)
        return
        
    bbox = frog.getbbox()
    if not bbox:
        print("Empty image")
        return
        
    left, upper, right, lower = bbox
    width = right - left
    height = lower - upper
    
    wing = Image.new('RGBA', frog.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(wing)
    
    # Wing origin
    wx = left + width * 0.15
    wy = upper + height * 0.35
    w_w = width * 0.3
    w_h = height * 0.2
    
    # Draw two simple overlapping circles for a cute wing
    draw.ellipse((wx - w_w, wy - w_h*1.5, wx + w_w*0.5, wy + w_h*0.5), fill=(255, 255, 255, 255), outline=(20, 20, 20, 255), width=3)
    draw.ellipse((wx - w_w*1.5, wy - w_h*0.5, wx - w_w*0.2, wy + w_h*1.2), fill=(255, 255, 255, 255), outline=(20, 20, 20, 255), width=3)
    
    # Composite: Wing layer in background, frog on top
    final = Image.alpha_composite(wing, frog)
    
    final.save('assets/frog_flying.png')
    print("Saved frog_flying.png with programmatically generated wings!")

add_wings()
