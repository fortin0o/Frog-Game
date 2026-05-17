from PIL import Image
from collections import deque

def remove_shadow_and_clean():
    img = Image.open('assets/frog_idle_1.png').convert('RGBA')
    width, height = img.size
    
    # 1. Erase base shadow and olive green
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

    # 2. Use BFS/Connected Components to keep only the main frog body
    # We will start the BFS from the center of the frog body which is guaranteed to be solid
    start_x, start_y = width // 2, height // 2
    
    # If the center pixel is transparent for some reason, find the first non-transparent pixel near the center
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
                
    # Run BFS to find all pixels connected to the frog
    visited = set()
    queue = deque([(start_x, start_y)])
    visited.add((start_x, start_y))
    
    while queue:
        cx, cy = queue.popleft()
        # Check 8 neighbors
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        r, g, b, a = img.getpixel((nx, ny))
                        if a > 0:
                            visited.add((nx, ny))
                            queue.append((nx, ny))
                            
    # 3. Make all non-visited pixels transparent (this wipes out floating outlines!)
    erased_count = 0
    for y in range(height):
        for x in range(width):
            if img.getpixel((x, y))[3] > 0 and (x, y) not in visited:
                img.putpixel((x, y), (0, 0, 0, 0))
                erased_count += 1
                
    img.save('assets/frog_idle_1.png')
    print(f"Shadow removed! Cleaned up {erased_count} floating outline pixels.")

remove_shadow_and_clean()
