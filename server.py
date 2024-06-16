from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# 保存最新的消息
latest_message = ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/message', methods=['GET'])
def get_message():
    return jsonify({"message": latest_message})

@app.route('/send', methods=['POST'])
def send_message():
    global latest_message
    content = request.json
    latest_message = content['message']
    return '', 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
