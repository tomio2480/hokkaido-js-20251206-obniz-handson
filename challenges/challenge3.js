// ========================================
// 課題3: 自動調光ライト - 解答例
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
let pwm;
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
        showLedStatus('自動調光モード稼働中');
        document.getElementById('control-area').classList.remove('hidden');

        // LEDオブジェクトを作成
        led = obniz.wired('LED', { anode: LED_PORT });

        // PWMオブジェクトを初期化
        pwm = obniz.getFreePwm();
        pwm.start({ io: LED_PORT });
        pwm.freq(1000);

        // ========================================
        // 課題3のポイント: センサー連動の自動調光
        // ========================================
        // ワンポイント解説:
        // 100 - sensorPercent
        //   → センサー値と反比例させることで自動調光を実現
        //   → センサー値が高い（明るい）→ LED暗く
        //   → センサー値が低い（暗い）→ LED明るく
        //
        // Math.max(0, Math.min(100, ledRatio))
        //   → 値を0-100の範囲に制限します（クリッピング）
        obniz.ad0.start(function(voltage) {
            // 電圧値を表示
            document.getElementById('brightness-value').textContent = voltage.toFixed(2);

            // センサー値を%に変換
            const sensorPercent = Math.round((voltage / 5.0) * 100);
            document.getElementById('sensor-percent').textContent = sensorPercent;

            // 反比例計算: センサーが暗い → LEDを明るく
            const ledRatio = 100 - sensorPercent;
            document.getElementById('led-brightness').textContent = ledRatio;

            // 自動でLED明るさを調整
            if (pwm) {
                pwm.duty(Math.max(0, Math.min(100, ledRatio)));
            }
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
    showLedStatus(`ポート ${LED_PORT}: LED ON（手動）`);
});

document.getElementById('led-off-btn').addEventListener('click', () => {
    if (!isConnected || !led) {
        showStatus('obnizに接続してください', 'error');
        return;
    }
    led.off();
    showLedStatus(`ポート ${LED_PORT}: LED OFF（手動）`);
});

// スライダーによる手動PWM制御
document.getElementById('brightness-slider').addEventListener('input', (e) => {
    const ratio = parseInt(e.target.value);
    document.getElementById('brightness-display').textContent = ratio;

    if (pwm) {
        pwm.duty(ratio);
        showLedStatus(`ポート ${LED_PORT}: PWM ${ratio}%（手動）`);
    }
});