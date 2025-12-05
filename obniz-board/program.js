// obnizボード側プログラム（永続実行）
// このプログラムはobniz Cloudのプログラムエディタに貼り付けて実行します
// 
// 注意: WebSerialを使った直接制御の場合、このプログラムは不要です。
// クライアント側（Webブラウザ）から直接obnizを制御します。
//
// このファイルは、クラウド経由で制御する場合の参考用として残しています。

// LED管理
const leds = [];
const LED_PORTS = [0, 1, 2, 3];

// センサー管理
let brightnessSensor;
const SENSOR_PORT = 0; // A0ポート

// obniz起動時の処理
Obniz.App.onLaunch(async (obniz) => {
    console.log('obnizボード起動');

    // LEDの初期化
    for (let port of LED_PORTS) {
        const led = obniz.wired('LED', { anode: port, cathode: 'gnd' });
        leds[port] = led;
        led.off();
    }

    // 明るさセンサーの初期化（CdSセル + 分圧回路）
    brightnessSensor = obniz.ad0;

    // センサー値の定期送信（500ms間隔）
    setInterval(() => {
        const value = brightnessSensor.value;
        if (value !== null) {
            // 全クライアントに送信
            obniz.send({ type: 'brightness_update', value: value });
        }
    }, 500);
});

// クライアントからのメッセージ受信
Obniz.App.onMessage(async (obniz, message) => {
    console.log('受信:', message);

    // LED制御（ON/OFF）
    if (message.type === 'led_control') {
        const port = message.port;
        const state = message.state;

        if (port >= 0 && port <= 3 && leds[port]) {
            const led = leds[port];

            if (state === 'on') {
                led.on();
                console.log(`LED ${port} ON`);
            } else if (state === 'off') {
                led.off();
                console.log(`LED ${port} OFF`);
            }

            // 全クライアントに状態を通知
            obniz.send({
                type: 'led_state_update',
                port: port,
                state: state
            });
        }
    }

    // LED明るさ制御（PWM）
    if (message.type === 'led_brightness') {
        const port = message.port;
        const ratio = message.ratio; // 0-100

        if (port >= 0 && port <= 3 && leds[port]) {
            const led = leds[port];

            // PWM制御（duty比を設定）
            if (ratio === 0) {
                led.off();
            } else {
                led.pwm({ freq: 1000, duty: ratio });
            }

            console.log(`LED ${port} PWM: ${ratio}%`);

            // 全クライアントに状態を通知
            obniz.send({
                type: 'led_state_update',
                port: port,
                state: `PWM ${ratio}%`
            });
        }
    }
});
