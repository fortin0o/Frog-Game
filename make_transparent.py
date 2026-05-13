from PIL import Image
import sys

def make_transparent(file_path):
    try:
        img = Image.open(file_path)
        img = img.convert("RGBA")
        data = img.getdata()
        
        # We assume the top-left pixel is the background color
        bg_color = data[0]
        
        new_data = []
        # Increase tolerance to catch JPEG/AI artifacts
        tolerance = 50
        
        for item in data:
            if (abs(item[0] - bg_color[0]) < tolerance and 
                abs(item[1] - bg_color[1]) < tolerance and 
                abs(item[2] - bg_color[2]) < tolerance):
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(file_path, "PNG")
        print(f"Made {file_path} transparent.")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

make_transparent("assets/frog.png")
make_transparent("assets/pipe.png")
make_transparent("assets/pipe_top.png")
make_transparent("assets/pipe_bottom.png")
