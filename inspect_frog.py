# pyrefly: ignore [missing-import]
from PIL import Image

def draw_grid():
    img = Image.open('assets/frog_idle_1.png').convert('RGBA')
    width, height = img.size
    
    # Bounding box is (185, 202, 839, 822)
    # Let's inspect x=480 to 540 (center is around 512) and y=780 to 822
    for y in range(780, 823):
        row = []
        for x in range(480, 540):
            r, g, b, a = img.getpixel((x, y))
            if a == 0:
                row.append(".")
            elif r < 40 and g < 40 and b < 40:
                row.append("B") # Black outline
            elif 100 <= r <= 135 and 125 <= g <= 155 and 45 <= b <= 80:
                row.append("S") # Shadow (olive green)
            elif 100 <= r <= 110 and 180 <= g <= 190 and 95 <= b <= 105:
                row.append("F") # Frog (bright green)
            else:
                row.append("?") # Other
        print(f"{y:3d}: " + "".join(row))

draw_grid()
