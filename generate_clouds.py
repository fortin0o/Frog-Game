# pyrefly: ignore [missing-import]
from PIL import Image, ImageDraw

width = 500
height = 660
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

clouds = [
    # Left cloud
    [(100, 150, 30), (140, 130, 45), (180, 150, 30), (140, 165, 25)],
    # Right lower cloud
    [(350, 220, 25), (390, 200, 35), (430, 220, 25), (390, 235, 20)],
    # Center high cloud
    [(240, 80, 20), (270, 70, 30), (300, 80, 20), (270, 95, 15)]
]

outline_color = (69, 26, 3, 255) # Match cartoon style
fill_color = (255, 255, 255, 230) # Slightly transparent white

# Draw outlines
for cloud in clouds:
    for cx, cy, cr in cloud:
        draw.ellipse((cx-cr-6, cy-cr-6, cx+cr+6, cy+cr+6), fill=outline_color)

# Draw interiors
for cloud in clouds:
    for cx, cy, cr in cloud:
        draw.ellipse((cx-cr, cy-cr, cx+cr, cy+cr), fill=fill_color)

img.save('assets/clouds.png')
print("Clouds generated successfully!")
