from PIL import Image, ImageDraw
import math

def add_pupils():
    img = Image.open('assets/frog_idle_1.png').convert('RGBA')
    width, height = img.size
    
    # 1. Find all solid white pixels (255, 255, 255, 255)
    white_pixels = []
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if r == 255 and g == 255 and b == 255 and a == 255:
                white_pixels.append((x, y))
                
    print(f"Total white pixels: {len(white_pixels)}")
    if not white_pixels:
        print("No white pixels found!")
        return
        
    # 2. Group them into connected components (clusters)
    visited = set()
    clusters = []
    
    for px, py in white_pixels:
        if (px, py) not in visited:
            # New cluster!
            cluster = []
            queue = [(px, py)]
            visited.add((px, py))
            
            idx = 0
            while idx < len(queue):
                cx, cy = queue[idx]
                idx += 1
                cluster.append((cx, cy))
                
                for dx in [-1, 0, 1]:
                    for dy in [-1, 0, 1]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if (nx, ny) not in visited:
                                r, g, b, a = img.getpixel((nx, ny))
                                if r == 255 and g == 255 and b == 255 and a == 255:
                                    visited.add((nx, ny))
                                    queue.append((nx, ny))
            
            # Keep only clusters of significant size (e.g. > 100 pixels) to avoid small highlights
            if len(cluster) > 100:
                clusters.append(cluster)
                
    print(f"Found {len(clusters)} eyeball clusters.")
    
    # 3. Draw pupils on the image
    draw = ImageDraw.Draw(img)
    for i, cluster in enumerate(clusters):
        xs = [p[0] for p in cluster]
        ys = [p[1] for p in cluster]
        
        min_x, max_x = min(xs), max(xs)
        min_y, max_y = min(ys), max(ys)
        
        # Center of gravity
        cx = sum(xs) // len(cluster)
        cy = sum(ys) // len(cluster)
        
        # Approximate radius of the eyeball
        ew = max_x - min_x
        eh = max_y - min_y
        approx_r = (ew + eh) / 4
        
        print(f"Eyeball {i+1}: Center ({cx}, {cy}), Bounding Box: ({min_x}, {min_y}, {max_x}, {max_y}), Approx Radius: {approx_r:.1f}")
        
        # Draw a black pupil inside
        # Pupil radius is about 35% of eyeball radius
        pr = int(approx_r * 0.35)
        # Shift pupil slightly to the right (looking forward) and up
        pcx = cx + int(approx_r * 0.15)
        pcy = cy - int(approx_r * 0.05)
        
        # Draw solid black pupil
        draw.ellipse((pcx - pr, pcy - pr, pcx + pr, pcy + pr), fill=(0, 0, 0, 255))
        
        # Optional: Add a tiny cute white reflection dot inside the pupil!
        rr = max(1, int(pr * 0.3))
        rcx = pcx - int(pr * 0.3)
        rcy = pcy - int(pr * 0.3)
        draw.ellipse((rcx - rr, rcy - rr, rcx + rr, rcy + rr), fill=(255, 255, 255, 255))

    img.save('assets/frog_idle_1.png')
    print("Pupils added successfully to assets/frog_idle_1.png!")

add_pupils()
