from PIL import Image
from collections import deque

def fill_holes():
    img = Image.open('assets/frog_idle_1.png').convert('RGBA')
    width, height = img.size
    
    # Run BFS from the outer edges to find all external background transparent pixels
    visited = set()
    queue = deque()
    
    # Add all edge pixels to the queue
    for x in range(width):
        # Top and bottom edges
        for y in [0, height - 1]:
            r, g, b, a = img.getpixel((x, y))
            if a == 0:
                queue.append((x, y))
                visited.add((x, y))
                
    for y in range(height):
        # Left and right edges
        for x in [0, width - 1]:
            r, g, b, a = img.getpixel((x, y))
            if a == 0 and (x, y) not in visited:
                queue.append((x, y))
                visited.add((x, y))
                
    # BFS to find all connected external transparent pixels
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    r, g, b, a = img.getpixel((nx, ny))
                    if a == 0:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                            
    # Any transparent pixel that was NOT visited is an internal hole!
    filled_count = 0
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if a == 0 and (x, y) not in visited:
                # Fill with solid white
                img.putpixel((x, y), (255, 255, 255, 255))
                filled_count += 1
                
    img.save('assets/frog_idle_1.png')
    print(f"Hole filling complete! Filled {filled_count} transparent eye/hole pixels with solid white.")

fill_holes()
