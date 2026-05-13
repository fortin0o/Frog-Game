from PIL import Image, ImageDraw

def add_wings(filename, is_jump=False):
    try:
        # Open image and ensure it's RGBA
        img = Image.open(f"assets/{filename}").convert("RGBA")
        width, height = img.size
        
        # Create a blank transparent image for the wing
        wing_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(wing_layer)
        
        # Determine wing position and angle based on state
        # The frog generally faces right. The wing goes on the frog's back/side.
        center_x = width // 2 - 10
        center_y = height // 2
        
        if is_jump:
            # Wing flapped UP
            bbox = [center_x - 30, center_y - 40, center_x + 10, center_y]
            draw.ellipse(bbox, fill=(200, 230, 255, 200), outline=(100, 150, 200, 255), width=2)
            # Add a smaller ellipse for detail
            draw.ellipse([bbox[0]+10, bbox[1]+10, bbox[2]-5, bbox[3]-5], fill=(255, 255, 255, 200))
        else:
            # Wing folded DOWN / IDLE
            bbox = [center_x - 20, center_y - 10, center_x + 20, center_y + 10]
            draw.ellipse(bbox, fill=(200, 230, 255, 200), outline=(100, 150, 200, 255), width=2)
            draw.ellipse([bbox[0]+5, bbox[1]+5, bbox[2]-5, bbox[3]-5], fill=(255, 255, 255, 200))

        # Composite the wing over the original image
        out = Image.alpha_composite(img, wing_layer)
        out.save(f"assets/{filename}", "PNG")
        print(f"Added wings to {filename}")
    except Exception as e:
        print(f"Failed to process {filename}: {e}")

if __name__ == '__main__':
    add_wings("frog.png", False)
    add_wings("frog_idle_1.png", False)
    add_wings("frog_idle_2.png", False)
    add_wings("frog_jump_1.png", True)
    add_wings("frog_jump_2.png", True)
