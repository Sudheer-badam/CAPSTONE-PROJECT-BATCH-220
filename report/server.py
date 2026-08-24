import http.server
import socketserver
import json
import os
import base64
import subprocess
import glob
import uuid

PORT = 8080

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/login.html'
        elif self.path == '/api/ppt-state':
            state_file = 'ppt_state.json'
            if os.path.exists(state_file):
                with open(state_file, 'r') as f:
                    state = f.read()
            else:
                # Default fallback for existing project files
                state = json.dumps({"exists": True, "count": 9})
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(state.encode('utf-8'))
            return
        elif self.path == '/api/papers':
            state_file = 'papers_state.json'
            if os.path.exists(state_file):
                with open(state_file, 'r') as f:
                    state = f.read()
            else:
                state = "[]"
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(state.encode('utf-8'))
            return
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                filename = data.get('file')
                content = data.get('content')
                
                # Basic security check
                if not filename or not content or not filename.endswith('.md'):
                    raise ValueError("Invalid request")
                    
                safe_filename = os.path.basename(filename)
                
                with open(safe_filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                    
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status": "success"}')
                
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        elif self.path == '/api/upload-ppt':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                b64_data = data.get('data_b64')
                
                if not b64_data:
                    raise ValueError("No file data provided")
                
                # Decode and save the PPTX
                ppt_bytes = base64.b64decode(b64_data)
                ppt_path = "uploaded_presentation.pptx"
                with open(ppt_path, "wb") as f:
                    f.write(ppt_bytes)
                
                # Clear old slides
                slides_dir = "slides"
                if os.path.exists(slides_dir):
                    for file in glob.glob(os.path.join(slides_dir, "*.PNG")):
                        try:
                            os.remove(file)
                        except:
                            pass
                            
                # Run the export script
                print("Running export_slides.py...")
                result = subprocess.run(["python", "export_slides.py", ppt_path], capture_output=True, text=True)
                
                if result.returncode != 0:
                    raise Exception(f"Export failed: {result.stderr}")
                
                # Count new slides
                new_slides = glob.glob(os.path.join(slides_dir, "*.PNG"))
                count = len(new_slides)
                
                # Update state
                with open('ppt_state.json', 'w') as f:
                    json.dump({"exists": True, "count": count}, f)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "slides": count}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        elif self.path == '/api/remove-ppt':
            try:
                # Clear old slides
                slides_dir = "slides"
                if os.path.exists(slides_dir):
                    for file in glob.glob(os.path.join(slides_dir, "*.PNG")):
                        try:
                            os.remove(file)
                        except:
                            pass
                
                # Update state
                with open('ppt_state.json', 'w') as f:
                    json.dump({"exists": False, "count": 0}, f)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        elif self.path == '/api/upload-paper':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                b64_data = data.get('data_b64')
                filename = data.get('filename')
                uploader_name = data.get('uploader_name')
                
                if not b64_data or not filename:
                    raise ValueError("No file data provided")
                
                pdf_bytes = base64.b64decode(b64_data)
                
                # Make safe filename
                safe_filename = os.path.basename(filename)
                
                # Write file directly into parent directory? No, report directory.
                with open(os.path.join('..', safe_filename), "wb") as f:
                    f.write(pdf_bytes)
                    
                size_mb = len(pdf_bytes) / (1024 * 1024)
                
                new_paper = {
                    "id": str(uuid.uuid4()),
                    "filename": safe_filename,
                    "display_name": safe_filename.replace('.pdf', ''),
                    "size_str": f"{size_mb:.1f} MB",
                    "uploader_name": uploader_name,
                    "uploader_email": ""
                }
                
                papers = []
                if os.path.exists('papers_state.json'):
                    with open('papers_state.json', 'r') as f:
                        papers = json.load(f)
                        
                papers.append(new_paper)
                
                with open('papers_state.json', 'w') as f:
                    json.dump(papers, f, indent=2)
                    
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "paper": new_paper}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        elif self.path == '/api/remove-paper':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                paper_id = data.get('id')
                
                papers = []
                if os.path.exists('papers_state.json'):
                    with open('papers_state.json', 'r') as f:
                        papers = json.load(f)
                
                paper_to_remove = next((p for p in papers if p['id'] == paper_id), None)
                if paper_to_remove:
                    papers = [p for p in papers if p['id'] != paper_id]
                    with open('papers_state.json', 'w') as f:
                        json.dump(papers, f, indent=2)
                        
                    # Also delete file
                    file_path = os.path.join('..', paper_to_remove['filename'])
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Running custom server on port {PORT} with saving enabled...")
        httpd.serve_forever()
