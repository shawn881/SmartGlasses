import cv2
from flask import Flask, Response, jsonify, request, send_from_directory

app = Flask(__name__, static_folder='static')

# 保存最新的消息
latest_message = ""

@app.route('/')
def index():
    return send_from_directory('', 'index.html')

@app.route('/message', methods=['GET'])
def get_message():
    return jsonify({"message": latest_message})

@app.route('/send', methods=['POST'])
def send_message():
    global latest_message
    content = request.json
    latest_message = content['message']
    return '', 204

def generate_frames():
    camera = cv2.VideoCapture(0)  # 使用第一個攝像頭
    while camera.isOpened():
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
