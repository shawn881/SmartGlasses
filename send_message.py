import requests

def send_manual_input(message):
    url = 'http://127.0.0.1:8081/manual_input'  # 根据需要替换为服务器的实际IP地址
    data = {'message': message}
    response = requests.post(url, json=data)
    if response.status_code == 204:
        print('Message sent successfully!')
    else:
        print('Failed to send message.')

if __name__ == '__main__':
    while True:
        message = input("Enter the message to send: ")
        send_manual_input(message)
