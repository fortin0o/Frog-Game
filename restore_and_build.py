import shutil
from PIL import Image, ImageDraw
from collections import deque

def rebuild_assets():
    # 1. Restore the original clean generated frog image from artifacts
    artifact_path = r"C:\Users\Donald\.gemini\antigravity\brain\4193cf4e-6995-4974-83d3-6b137007e717\new_frog_idle_1_1778990816877.png"
    target_path = "assets/frog_idle_1.png"
    shutil.copy(artifact_path, target_path)
    print("Restored original frog image from artifacts.")

    # 2. Open restored image
    img = Image.open(target_path).convert('RGBA')
    width, height = img.size
    
    # 3. Make background transparent (same color-replace logic as make_transparent.py)
    # We assume the top-left pixel is the background color
    bg_color = img.getpixel((0, 0))
    tolerance = 50
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if (abs(r - bg_color[0]) < tolerance and 
                abs(g - bg_color[1]) < tolerance and 
                abs(b - bg_color[2]) < tolerance):
                img.putpixel((x, y), (255, 255, 255, 0)) # Make background transparent
    print("Removed solid background using transparency threshold.")
    
    # 4. Erase base shadow and olive green
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if a > 0:
                # Erase everything below Y=798 (base of the feet)
                if y >= 798:
                    img.putpixel((x, y), (0, 0, 0, 0))
                    continue
                
                # Erase olive green shadow pixels
                if 95 <= r <= 140 and 120 <= g <= 160 and 40 <= b <= 85:
                    img.putpixel((x, y), (0, 0, 0, 0))
                    continue

    # 5. Use BFS to keep only the main frog body (wipes out floating shadow outlines)
    start_x, start_y = width // 2, height // 2
    if img.getpixel((start_x, start_y))[3] == 0:
        found = False
        for radius in range(1, 100):
            for dx in range(-radius, radius + 1):
                for dy in range(-radius, radius + 1):
                    px, py = start_x + dx, start_y + dy
                    if 0 <= px < width and 0 <= py < height:
                        if img.getpixel((px, py))[3] > 0:
                            start_x, start_y = px, py
                            found = True
                            break
                if found:
                    break
            if found:
                break
                
    visited = set()
    queue = deque([(start_x, start_y)])
    visited.add((start_x, start_y))
    
    while queue:
        cx, cy = queue.popleft()
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        r, g, b, a = img.getpixel((nx, ny))
                        if a > 0:
                            visited.add((nx, ny))
                            queue.append((nx, ny))
                            
    for y in range(height):
        for x in range(width):
            if img.getpixel((x, y))[3] > 0 and (x, y) not in visited:
                img.putpixel((x, y), (0, 0, 0, 0))

    # 6. Run BFS from outer edges to find internal transparent holes (eyeballs)
    visited_bg = set()
    queue_bg = deque()
    
    for x in range(width):
        for y in [0, height - 1]:
            r, g, b, a = img.getpixel((x, y))
            if a == 0:
                queue_bg.append((x, y))
                visited_bg.add((x, y))
                
    for y in range(height):
        for x in [0, width - 1]:
            r, g, b, a = img.getpixel((x, y))
            if a == 0 and (x, y) not in visited_bg:
                queue_bg.append((x, y))
                visited_bg.add((x, y))
                
    while queue_bg:
        cx, cy = queue_bg.popleft()
        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited_bg:
                    r, g, b, a = img.getpixel((nx, ny))
                    if a == 0:
                        visited_bg.add((nx, ny))
                        queue_bg.append((nx, ny))
                            
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if a == 0 and (x, y) not in visited_bg:
                img.putpixel((x, y), (255, 255, 255, 255))

    # 7. Group all white pixels to find the real eyeball(s)
    white_pixels = []
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if r == 255 and g == 255 and b == 255 and a == 255:
                white_pixels.append((x, y))
                
    visited_white = set()
    clusters = []
    
    for px, py in white_pixels:
        if (px, py) not in visited_white:
            cluster = []
            q = [(px, py)]
            visited_white.add((px, py))
            
            idx = 0
            while idx < len(q):
                cx, cy = q[idx]
                idx += 1
                cluster.append((cx, cy))
                
                for dx in [-1, 0, 1]:
                    for dy in [-1, 0, 1]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if (nx, ny) not in visited_white:
                                r, g, b, a = img.getpixel((nx, ny))
                                if r == 255 and g == 255 and b == 255 and a == 255:
                                    visited_white.add((nx, ny))
                                    q.append((nx, ny))
            
            if len(cluster) > 100:
                clusters.append(cluster)
                
    # 8. Draw solid black pupil with a cute reflection dot ONLY on eyeballs in the head (Y < 400)
    draw = ImageDraw.Draw(img)
    for i, cluster in enumerate(clusters):
        xs = [p[0] for p in cluster]
        ys = [p[1] for p in cluster]
        
        cx = sum(xs) // len(cluster)
        cy = sum(ys) // len(cluster)
        
        # Check if the eyeball is in the head (Y < 400)
        if cy < 400:
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            ew = max_x - min_x
            eh = max_y - min_y
            approx_r = (ew + eh) / 4
            
            print(f"Adding pupil to real eyeball: Center ({cx}, {cy}), Approx Radius: {approx_r:.1f}")
            
            # Pupil radius is 38% of eyeball
            pr = int(approx_r * 0.38)
            # Shift pupil slightly right and up (cute focused cartoon look!)
            pcx = cx + int(approx_r * 0.18)
            pcy = cy - int(approx_r * 0.05)
            
            # Solid black pupil
            draw.ellipse((pcx - pr, pcy - pr, pcx + pr, pcy + pr), fill=(0, 0, 0, 255))
            
            # White highlight dot
            rr = max(1, int(pr * 0.35))
            rcx = pcx - int(pr * 0.3)
            rcy = pcy - int(pr * 0.3)
            draw.ellipse((rcx - rr, rcy - rr, rcx + rr, rcy + rr), fill=(255, 255, 255, 255))
        else:
            print(f"Skipping chest/leg highlight cluster at Center ({cx}, {cy})")

    # 9. Save output
    img.save(target_path)
    print("Assets successfully rebuilt with correct transparency and pupils!")

rebuild_assets()
