import os
import win32com.client

def export_presentation(ppt_path, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    ppt_path = os.path.abspath(ppt_path)
    output_folder = os.path.abspath(output_folder)
    
    print(f"Exporting: {ppt_path}")
    print(f"Output to: {output_folder}")
    
    # Initialize PowerPoint COM object
    powerpoint = win32com.client.Dispatch("PowerPoint.Application")
    
    try:
        # Open the presentation
        presentation = powerpoint.Presentations.Open(ppt_path, WithWindow=False)
        
        # Save as PNG
        # 18 is the enum for ppSaveAsPNG
        presentation.SaveAs(output_folder, 18)
        
        presentation.Close()
        print("Export complete. Slides generated.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        powerpoint.Quit()

import sys

if __name__ == "__main__":
    if len(sys.argv) > 1:
        export_presentation(sys.argv[1], "slides")
    else:
        export_presentation(r"c:\Users\badam\OneDrive\AI-Based Social Media Sentiment and Trend Analysis Platform\CAPSTONE PROJECT PPT-220-2 UPDATED.pptx", "slides")
