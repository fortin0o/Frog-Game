from PIL import Image, ImageDraw

def make_frames():
    base_img = Image.open('assets/frog.png').convert("RGBA")
    width, height = base_img.size
    
    # We will expand the canvas slightly so wings don't get cropped
    new_width = width + 60
    new_height = height + 60
    
    center_x = new_width // 2 - 10
    center_y = new_height // 2
    
    def create_frame(name, is_jump, frame_index):
        # Create blank transparent image
        canvas = Image.new("RGBA", (new_width, new_height), (0,0,0,0))
        
        # Paste the base frog in the center
        canvas.paste(base_img, (30, 30))
        
        # Draw wings
        wing_layer = Image.new("RGBA", (new_width, new_height), (0,0,0,0))
        draw = ImageDraw.Draw(wing_layer)
        
        if is_jump:
            # Wing flapped UP
            offset = frame_index * 10
            bbox = [center_x - 40, center_y - 60 - offset, center_x + 20, center_y - offset]
            draw.ellipse(bbox, fill=(200, 230, 255, 220), outline=(100, 150, 200, 255), width=3)
            draw.ellipse([bbox[0]+10, bbox[1]+10, bbox[2]-5, bbox[3]-5], fill=(255, 255, 255, 200))
        else:
            # Wing folded DOWN / IDLE
            offset = frame_index * 5
            bbox = [center_x - 30, center_y - 10 + offset, center_x + 30, center_y + 30 + offset]
            draw.ellipse(bbox, fill=(200, 230, 255, 220), outline=(100, 150, 200, 255), width=3)
            draw.ellipse([bbox[0]+5, bbox[1]+5, bbox[2]-5, bbox[3]-5], fill=(255, 255, 255, 200))
            
        final_img = Image.alpha_composite(canvas, wing_layer)
        final_img.save(f"assets/{name}", "PNG")
        print(f"Created {name}")

    create_frame("frog_idle_1.png", False, 0)
    create_frame("frog_idle_2.png", False, 1)
    create_frame("frog_jump_1.png", True, 0)
    create_frame("frog_jump_2.png", True, 1)

if __name__ == "__main__":
    make_frames()
