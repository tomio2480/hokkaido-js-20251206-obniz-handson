// ========================================
// 課題4: リアルタイム状態モニタ - 解答例
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
        showLedStatus(`ポート ${LED_PORT} のLEDを制御できます`);
        document.getElementById('control-area').classList.remove('hidden');
        document.getElementById('my-port-display').textContent = LED_PORT;

        // LEDオブジェクトを作成
        led = obniz.wired('LED', { anode: LED_PORT });

        // PWMオブジェクトを初期化
        pwm = obniz.getFreePwm();
        pwm.start({ io: LED_PORT });
        pwm.freq(1000);

        // センサー値の継続監視と共有
        obniz.ad5.start(function(voltage) {
            const percent = Math.round((voltage / 5.0) * 100);

            // 自分の画面を更新
            document.getElementById('common-brightness').textContent = percent;
            document.getElementById('common-voltage').textContent = voltage.toFixed(2);

            // 全員にセンサー値を共有
            obniz.send({
                type: 'sensor_update',
                voltage: voltage,
                percent: percent,
                from: LED_PORT
            });
        });
    };

    obniz.onclose = () => {
        isConnected = false;
        showStatus('切断されました', 'error');
        document.getElementById('control-area').classList.add('hidden');
    };

    // ========================================
    // 課題4のポイント: メッセージ受信で状態を更新
    // ========================================
    // ワンポイント解説:
    // obniz.onmessage = (message) => { ... }
    //   → 他の参加者が送信したメッセージを受信します
    //   → message.type で種類を判別して処理を分岐
    obniz.onmessage = (message) => {
        // LED状態の更新
        if (message.type === 'led_update') {
            const port = message.port;
            const statusElement = document.getElementById(`led-${port}-status`);

            if (statusElement) {
                let statusText = '';
                let statusClass = 'font-mono ';

                if (message.state === 'on') {
                    statusText = 'ON';
                    statusClass += 'text-green-600 font-bold';
                } else if (message.state === 'off') {
                    statusText = 'OFF';
                    statusClass += 'text-red-600 font-bold';
                } else if (message.state === 'pwm') {
                    statusText = `PWM ${message.duty}%`;
                    statusClass += 'text-blue-600 font-bold';
                }

                statusElement.textContent = statusText;
                statusElement.className = statusClass;
            }

            console.log(`ポート${port}: ${message.state}${message.duty ? ' (' + message.duty + '%)' : ''}`);
        }

        // センサー値の更新（他の参加者からも受信）
        if (message.type === 'sensor_update') {
            document.getElementById('common-brightness').textContent = message.percent;
            document.getElementById('common-voltage').textContent = message.voltage.toFixed(2);
        }
    };
});

// ========================================
// LED ON/OFFボタンのイベント設定
// ========================================
// ワンポイント解説:
// obniz.send({ ... })
//   → 接続中の全クライアントにメッセージを送信します
//   → 自分自身にも送信されます

document.getElementById('led-on-btn').addEventListener('click', () => {
    if (!isConnected || !led) {
        showStatus('obnizに接続してください', 'error');
        return;
    }
    led.on();
    obniz.send({ type: 'led_update', port: LED_PORT, state: 'on' });
    showLedStatus(`ポート ${LED_PORT}: LED ON`);
});

document.getElementById('led-off-btn').addEventListener('click', () => {
    if (!isConnected || !led) {
        showStatus('obnizに接続してください', 'error');
        return;
    }
    led.off();
    obniz.send({ type: 'led_update', port: LED_PORT, state: 'off' });
    showLedStatus(`ポート ${LED_PORT}: LED OFF`);
});

// スライダーによるPWM制御
document.getElementById('brightness-slider').addEventListener('input', (e) => {
    const ratio = parseInt(e.target.value);
    document.getElementById('brightness-display').textContent = ratio;

    if (pwm) {
        pwm.duty(ratio);
        obniz.send({ type: 'led_update', port: LED_PORT, state: 'pwm', duty: ratio });
        showLedStatus(`ポート ${LED_PORT}: PWM ${ratio}%`);
    }
});