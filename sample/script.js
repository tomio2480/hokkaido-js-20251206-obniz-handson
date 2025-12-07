// グローバル変数
let obniz;
let myPort;
let led;
let isConnected = false;

// 接続ボタンのクリックイベント
document.getElementById('connect-btn').addEventListener('click', async () => {
    const obnizId = document.getElementById('obniz-id').value.trim();
    myPort = parseInt(document.getElementById('led-port').value);

    // 入力チェック
    if (!obnizId) {
        showStatus('obniz IDを入力してください', 'error');
        return;
    }

    if (isNaN(myPort) || myPort < 0 || myPort > 3) {
        showStatus('LEDポート番号は0-3の範囲で入力してください', 'error');
        return;
    }

    try {
        showStatus('接続中...', 'info');

        // obnizに接続（複数クライアント同時接続のための設定）
        obniz = new Obniz(obnizId, {
            local_connect: false  // 重要: 複数人で同時接続するために必須
        });

        obniz.onconnect = async () => {
            console.log('obnizに接続しました');
            isConnected = true;
            showStatus(`接続成功！あなたのLEDポート: ${myPort}`, 'success');
            document.getElementById('port-info').textContent =
                `あなたのLEDポート: ${myPort}`;

            // LEDオブジェクトを作成
            led = obniz.wired('LED', { anode: myPort, cathode: 'gnd' });

            // センサー値の継続監視（推奨方法）
            obniz.ad0.start(function(voltage) {
                // 自分の画面に表示
                document.getElementById('brightness-value').textContent =
                    voltage.toFixed(2) + ' V';

                // 全員に共有
                obniz.send({
                    type: 'sensor_update',
                    voltage: voltage,
                    from: myPort
                });
            });

            document.getElementById('control-area').style.display = 'block';
        };

        // メッセージ受信
        obniz.onmessage = (message) => {
            // センサー値の受信（他の参加者からも受信）
            if (message.type === 'sensor_update') {
                console.log(`ポート${message.from}からセンサー値: ${message.voltage}V`);
            }

            // LED状態の受信
            if (message.type === 'led_update') {
                console.log(`ポート${message.port}: ${message.state}`);
            }
        };

        // 切断時の処理
        obniz.onclose = () => {
            console.log('obnizから切断されました');
            isConnected = false;
            led = null;
            showStatus('obnizから切断されました', 'error');
            document.getElementById('control-area').style.display = 'none';
        };

    } catch (error) {
        console.error('接続エラー:', error);
        showStatus(`接続エラー: ${error.message}`, 'error');
    }
});

// LED ONボタン
document.getElementById('led-on-btn').addEventListener('click', () => {
    if (!isConnected || !led) {
        showStatus('obnizに接続してください', 'error');
        return;
    }

    console.log('LED ON');
    led.on();

    // 状態を全員に共有
    obniz.send({ type: 'led_update', port: myPort, state: 'on' });
});

// LED OFFボタン
document.getElementById('led-off-btn').addEventListener('click', () => {
    if (!isConnected || !led) {
        showStatus('obnizに接続してください', 'error');
        return;
    }

    console.log('LED OFF');
    led.off();

    // 状態を全員に共有
    obniz.send({ type: 'led_update', port: myPort, state: 'off' });
});

// ステータス表示関数
function showStatus(message, type) {
    const statusDiv = document.getElementById('connection-status');
    statusDiv.textContent = message;

    // Tailwind CSSクラスを適用
    const baseClasses = 'p-3 rounded-lg font-semibold border-l-4';
    const typeClasses = {
        'info': 'bg-blue-50 text-blue-800 border-blue-500',
        'success': 'bg-green-50 text-green-800 border-green-500',
        'error': 'bg-red-50 text-red-800 border-red-500'
    };

    statusDiv.className = `${baseClasses} ${typeClasses[type] || ''}`;
}
