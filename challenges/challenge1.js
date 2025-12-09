// ========================================
// 課題1: センサー値を%に変換 - 解答例
// ========================================

// ========================================
// 設定値（ハードコード）
// ========================================
const OBNIZ_ID = '1234-5678';      // あなたのobniz IDに変更
const LED_PORT = 0;                 // LEDを接続するポート番号
const ACCESS_TOKEN = '';            // アクセストークン（不要なら空文字）

// グローバル変数
let obniz;
let led;
let isConnected = false;

// ステータス表示関数
function showStatus(message, type) {
    const statusDiv = document.getElementById('connection-status');
    statusDiv.textContent = message;

    const baseClasses = 'p-2 rounded text-sm';
    const typeClasses = {
        'info': 'bg-blue-100 text-blue-800',
        'success': 'bg-green-100 text-green-800',
        'error': 'bg-red-100 text-red-800'
    };

    statusDiv.className = `${baseClasses} ${typeClasses[type] || ''}`;
}

// LED制御結果を表示する関数
function showLedStatus(message) {
    const ledStatusDiv = document.getElementById('led-status');
    ledStatusDiv.textContent = message;
}

// ========================================
// 接続ボタンのイベント設定
// ========================================
// ワンポイント解説:
// new Obniz(OBNIZ_ID, options)
//   → obnizデバイスへの接続を開始します
//   → local_connect: false は複数人接続に必須

document.getElementById('connect-btn').addEventListener('click', async () => {
    showStatus('接続中...', 'info');

    // obniz接続オプション
    const options = { local_connect: false };
    if (ACCESS_TOKEN) {
        options.access_token = ACCESS_TOKEN;
    }

    // obnizに接続
    obniz = new Obniz(OBNIZ_ID, options);

    // 接続成功時の処理
    obniz.onconnect = async () => {
        isConnected = true;
        showStatus('接続成功！', 'success');
        showLedStatus(`ポート ${LED_PORT} のLEDを制御できます`);
        document.getElementById('control-area').classList.remove('hidden');

        // ワンポイント解説:
        // obniz.wired('LED', { anode: LED_PORT })
        //   → 指定ポートにLEDを接続設定します
        led = obniz.wired('LED', { anode: LED_PORT });

        // ========================================
        // 課題1のポイント: センサー値を%に変換
        // ========================================
        // ワンポイント解説:
        // obniz.ad0.start(callback)
        //   → アナログ入力の継続監視を開始します
        //   → コールバック関数で電圧値（0-5V）を受け取ります
        //
        // Math.round((voltage / 5.0) * 100)
        //   → 電圧値を0-100%に変換します
        obniz.ad0.start(function(voltage) {
            // 電圧値を表示
            document.getElementById('brightness-value').textContent = voltage.toFixed(2);

            // 電圧値を%に変換（5V基準）
            const percent = Math.round((voltage / 5.0) * 100);
            document.getElementById('brightness-percent').textContent = percent;
        });
    };

    // 切断時の処理
    obniz.onclose = () => {
        isConnected = false;
        showStatus('切断されました', 'error');
        document.getElementById('control-area').classList.add('hidden');
    };
});

// ========================================
// LED ON/OFFボタンのイベント設定
// ========================================
// ワンポイント解説:
// led.on()  → LEDを点灯させます
// led.off() → LEDを消灯させます

document.getElementById('led-on-btn').addEventListener('click', () => {
    if (!isConnected || !led) {
        showStatus('obnizに接続してください', 'error');
        return;
    }
    led.on();
    showLedStatus(`ポート ${LED_PORT}: LED ON`);
});

document.getElementById('led-off-btn').addEventListener('click', () => {
    if (!isConnected || !led) {
        showStatus('obnizに接続してください', 'error');
        return;
    }
    led.off();
    showLedStatus(`ポート ${LED_PORT}: LED OFF`);
});