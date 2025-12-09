// ========================================
// 課題5: Airtableログ記録 - 解答例
// ========================================

// ========================================
// 設定値（ハードコード）
// ========================================
const OBNIZ_ID = '1234-5678';      // あなたのobniz IDに変更
const LED_PORT = 0;                 // LEDを接続するポート番号
const ACCESS_TOKEN = '';            // アクセストークン（不要なら空文字）

// ========================================
// Airtable設定（ここを変更してください）
// ========================================
const AIRTABLE_TOKEN = 'あなたのPersonal Access Token';
const BASE_ID = 'あなたのBase ID';
const TABLE_NAME = '操作ログ';  // Airtableで作成したテーブル名をそのまま入力

// グローバル変数
let obniz;
let led;
let isConnected = false;
let currentVoltage = 0;
let currentPercent = 0;

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

        // センサー値の継続監視
        obniz.ad0.start(function(voltage) {
            currentVoltage = voltage;
            currentPercent = Math.round((voltage / 5.0) * 100);

            document.getElementById('voltage').textContent = currentVoltage.toFixed(2);
            document.getElementById('brightness-percent').textContent = currentPercent;
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
    saveLog('LED ON');
    showLedStatus(`ポート ${LED_PORT}: LED ON`);
});

document.getElementById('led-off-btn').addEventListener('click', () => {
    if (!isConnected || !led) {
        showStatus('obnizに接続してください', 'error');
        return;
    }
    led.off();
    saveLog('LED OFF');
    showLedStatus(`ポート ${LED_PORT}: LED OFF`);
});

// 手動ログ保存ボタン
document.getElementById('save-log-btn').addEventListener('click', () => {
    saveLog('手動保存');
});

// ログ読み込みボタン
document.getElementById('load-logs-btn').addEventListener('click', () => {
    loadLogs();
});

// ========================================
// 課題5のポイント: Airtable API連携
// ========================================

// ワンポイント解説:
// fetch(url, options)
//   → HTTP リクエストを送信します
//   → method: 'POST' でデータを送信、'GET' でデータを取得
//
// headers の Authorization
//   → Bearer トークンで認証します
//   → 'Bearer ' + トークン文字列の形式
//
// JSON.stringify()
//   → JavaScriptオブジェクトをJSON文字列に変換します

async function saveLog(action) {
    // 設定チェック
    if (AIRTABLE_TOKEN === 'あなたのPersonal Access Token' || BASE_ID === 'あなたのBase ID') {
        alert('challenge5.js のAirtable設定（AIRTABLE_TOKEN, BASE_ID）を入力してください');
        return;
    }

    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    records: [{
                        fields: {
                            'ポート': LED_PORT,
                            '操作': action,
                            '電圧': currentVoltage,
                            'タイムスタンプ': new Date().toISOString()
                        }
                    }]
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log('ログ保存成功:', data);
            alert('ログを保存しました');
        } else {
            console.error('エラー:', data);
            alert('ログ保存に失敗しました: ' + (data.error?.message || '不明なエラー'));
        }
    } catch (error) {
        console.error('通信エラー:', error);
        alert('通信エラーが発生しました');
    }
}

// ワンポイント解説:
// encodeURIComponent()
//   → 日本語などの特殊文字をURLセーフな形式に変換します
//
// sort[0][field] / sort[0][direction]
//   → Airtable APIのソートパラメータ
//   → 最新のログを先頭に取得します

async function loadLogs() {
    // 設定チェック
    if (AIRTABLE_TOKEN === 'あなたのPersonal Access Token' || BASE_ID === 'あなたのBase ID') {
        alert('challenge5.js のAirtable設定（AIRTABLE_TOKEN, BASE_ID）を入力してください');
        return;
    }

    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?maxRecords=10&sort[0][field]=タイムスタンプ&sort[0][direction]=desc`,
            {
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_TOKEN}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            displayLogs(data.records);
        } else {
            console.error('エラー:', data);
            alert('ログ読み込みに失敗しました: ' + (data.error?.message || '不明なエラー'));
        }
    } catch (error) {
        console.error('通信エラー:', error);
        alert('通信エラーが発生しました');
    }
}

// ログを画面に表示
function displayLogs(records) {
    const logsList = document.getElementById('logs-list');
    logsList.innerHTML = '';

    if (records.length === 0) {
        const li = document.createElement('li');
        li.className = 'text-gray-500 text-center py-4 text-sm';
        li.textContent = 'ログがありません';
        logsList.appendChild(li);
        return;
    }

    records.forEach(record => {
        const fields = record.fields;
        const li = document.createElement('li');
        li.className = 'p-3 bg-gray-50 rounded border';

        const timestamp = new Date(fields['タイムスタンプ']).toLocaleString('ja-JP');
        const port = fields['ポート'];
        const action = fields['操作'];
        const voltage = fields['電圧'] || 0;

        li.innerHTML = `
            <div class="flex items-center justify-between text-sm">
                <span class="font-mono text-gray-600">${timestamp}</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold">ポート${port}</span>
            </div>
            <div class="mt-2">
                <span class="font-semibold">${action}</span>
                <span class="ml-4 text-gray-600">${voltage.toFixed(2)} V</span>
            </div>
        `;

        logsList.appendChild(li);
    });
}