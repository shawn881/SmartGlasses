let allowSpeak = true; // 新增标志控制是否允许朗读
let autoSpeak = false; // 新增标志控制自动朗读

async function fetchMessage(allowAutoSpeak = false) {
    let response = await fetch('/message');
    let data = await response.json();
    let recognizeTextElement = document.getElementById('recognize-text');
    recognizeTextElement.innerHTML = data.message;
    if (allowAutoSpeak && allowSpeak) {  // 仅在允许朗读时执行
        speak(data.message);
    }
}

async function sendMessage(message) {
    await fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
    });
    fetchMessage(autoSpeak);  // 每次发送消息后刷新显示内容，依据 autoSpeak 决定是否自动朗读
}

document.getElementById('myButton').addEventListener('click', () => {
    const message = 'Hello 你好, 歡迎您使用本系統 !';
    sendMessage(message);
});

document.getElementById('btn-read').addEventListener('click', () => fetchMessage(true));

document.getElementById('btn-auto').addEventListener('click', () => {
    autoSpeak = !autoSpeak;
    document.getElementById('voice-toggle').innerHTML = autoSpeak ? '自動<br>朗讀' : '手動<br>朗讀';
});

setInterval(() => fetchMessage(autoSpeak), 1000);  // 每秒刷新一次消息内容，依据 autoSpeak 决定是否自动朗读

function speak(text) {
    const synth = window.speechSynthesis;
    if (!synth.speaking) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.onend = () => {
            allowSpeak = true; // 朗读结束后允许再次朗读
        };
        allowSpeak = false; // 开始朗读时不允许其他朗读
        synth.speak(utter);
    }
}
