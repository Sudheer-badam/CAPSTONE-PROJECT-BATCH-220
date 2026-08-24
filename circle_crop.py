import sys
from PIL import Image, ImageDraw

def make_circle_favicon(input_path, output_png, output_ico):
    # Open the image
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    
    # Calculate the bounding box for a perfect circle in the center
    size = min(w, h)
    left = (w - size) // 2
    top = (h - size) // 2
    right = (w + size) // 2
    bottom = (h + size) // 2
    
    # Crop to a square first
    img = img.crop((left, top, right, bottom))
    
    # Create a mask for the circle
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    # Create an output image with transparency
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    
    # Save as PNG
    output.save(output_png, "PNG")
    
    # Create smaller version for ICO if needed, or just save
    # ICO usually wants specific sizes, we can provide a list
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    output.save(output_ico, format="ICO", sizes=sizes)
    
    print("Successfully created circular favicon!")

if __name__ == "__main__":
    make_circle_favicon(
        "CAPSTONE PROJECT LOGO.jpeg",
        "report/favicon.png",
        "report/favicon.ico"
    )
