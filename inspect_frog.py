from PIL import Image

def draw_frog_lowres():
    img = Image.open('assets/frog_idle_1.png').convert('RGBA')
    # Resize to 32x32
    lowres = img.resize((32, 32), Image.Resampling.LANCZOS)
    
    for y in range(32):
        row = []
        for x in range(32):
            r, g, b, a = lowres.getpixel((x, y))
            if a < 50:
                row.append(".")
            elif r < 60 and g < 60 and b < 60:
                row.append("E") # Black outline/eye
            elif 100 <= r <= 150 and 180 <= g <= 255 and 80 <= b <= 150:
                row.append("F") # Green Frog body
            elif r > 200 and g > 200 and b < 150:
                row.append("Y") # Yellow belly (if any)
            else:
                row.append("?") # Other
        print("".join(row))

draw_frog_lowres()
