// ========================================
// obniz LED制御 - ハンズオンサンプル
// ========================================
// このファイルにコードを書き足していきます

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

// ステータス表示関数（これは最初から用意されています）
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
// ステップ1: 接続ボタンのイベント設定
// ========================================
// TODO: ここに接続処理を書きます
//
// ワンポイント解説:
// new Obniz(OBNIZ_ID, { access_token: ACCESS_TOKEN })
//   → obnizデバイスへの接続を開始します
//   → 第1引数: obniz ID（デバイス固有の識別子）
//   → 第2引数: オプション（アクセストークンなど）
//
// obniz.onconnect = async function() { ... }
//   → 接続成功時に呼ばれるコールバック関数です
//
// obniz.wired('LED', { anode: LED_PORT_ANODE, cathode: LED_PORT_CATHODE })
//   → 指定ポートにLEDを接続設定します
//   → anode: LEDの+側（アノード）を接続するポート番号
//   → cathode: LEDの-側（カソード）を接続するポート番号 = 今回は GND に接続のため省略可


// ========================================
// ステップ2: LED ON/OFFボタンのイベント設定
// ========================================
// TODO: ここにLED制御処理を書きます
//
// ワンポイント解説:
// led.on()
//   → LEDを点灯させます（ポートに電圧を出力）
//
// led.off()
//   → LEDを消灯させます（ポートの電圧を0に）

