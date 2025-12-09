// ========================================
// 課題2: スライダーを使ったLED制御 - 解答例
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
let pwm;  // 課題2で追加: PWMオブジェクト
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

document.getElementById('connect-btn').addEventListener('click', async () => {
    showStatus('接続中...', 'info');

    const options = { local_connect: false };
    if (ACCESS_TOKEN) {
        options.access_token = ACCESS_TOKEN;
    }

    obniz = new Obniz(OBNIZ_ID, options);

    obniz.onconnect = async () => {
        isConnected = true;
        showStatus('接続成功！', 'success');
        showLedStatus(`ポート ${LED_PORT} のLEDを制御できます`);
        document.getElementById('control-area').classList.remove('hidden');

        // LEDオブジェクトを作成
        led = obniz.wired('LED', { anode: LED_PORT });

        // ========================================
        // 課題2のポイント: PWMオブジェクトの初期化
        // ========================================
        // ワンポイント解説:
        // obniz.getFreePwm()
        //   → 使用可能なPWMチャンネルを取得します
        //
        // pwm.start({ io: LED_PORT })
        //   → 指定ポートでPWM出力を開始します
        //
        // pwm.freq(1000)
        //   → PWM周波数を1000Hz（1kHz）に設定します
        //   → LEDの場合は1000Hz程度が適切です
        pwm = obniz.getFreePwm();
        pwm.start({ io: LED_PORT });
        pwm.freq(1000);

        // センサー値の継続監視
        obniz.ad5.start(function(voltage) {
            document.getElementById('brightness-value').textContent = voltage.toFixed(2);
            const percent = Math.round((voltage / 5.0) * 100);
            document.getElementById('brightness-percent').textContent = percent;
        });
    };

    obniz.onclose = () => {
        isConnected = false;
        showStatus('切断されました', 'error');
        document.getElementById('control-area').classList.add('hidden');
    };
});

// ========================================
// LED ON/OFFボタンのイベント設定
// ========================================

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

// ========================================
// 課題2のポイント: スライダーによるPWM制御
// ========================================
// ワンポイント解説:
// pwm.duty(ratio)
//   → デューティ比を0-100の範囲で設定します
//   → 0 = 常にOFF、100 = 常にON
//   → 50 = 半分の明るさ

document.getElementById('brightness-slider').addEventListener('input', (e) => {
    const ratio = parseInt(e.target.value);
    document.getElementById('brightness-display').textContent = ratio;

    if (pwm) {
        pwm.duty(ratio);
        showLedStatus(`ポート ${LED_PORT}: PWM ${ratio}%`);
    }
});