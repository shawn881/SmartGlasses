let allowSpeak = true; // 新增標誌控制是否允許朗讀
let autoSpeak = false; // 新增標誌控制自動朗讀

async function fetchMessage(allowAutoSpeak = false) {
    let response = await fetch('/message');
    let data = await response.json();
    let recognizeTextElement = document.getElementById('recognize-text');
    recognizeTextElement.innerHTML = data.message;
    if (allowAutoSpeak && allowSpeak) {  // 僅在允許朗讀時執行
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
    fetchMessage(autoSpeak);  // 每次發送消息後刷新顯示內容，依據 autoSpeak 決定是否自動朗讀
}

document.getElementById('myButton').addEventListener('click', () => {
    const message = 'Hello 你好, 歡迎您使用本系統 !';
    sendMessage(message);
});

document.getElementById('btn-read').addEventListener('click', () => fetchMessage(true));

document.getElementById('btn-auto').addEventListener('click', () => {
    autoSpeak = !autoSpeak;
    document.getElementById('voice-toggle').innerHTML = autoSpeak ? '自動朗讀' : '手動朗讀';
});

setInterval(() => fetchMessage(autoSpeak), 1000);  // 每秒刷新一次消息內容，依據 autoSpeak 決定是否自動朗讀

function speak(text) {
    const synth = window.speechSynthesis;
    if (!synth.speaking) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.onend = () => {
            allowSpeak = true; // 朗讀結束後允許再次朗讀
        };
        allowSpeak = false; // 開始朗讀時不允許其他朗讀
        synth.speak(utter);
    }
}
