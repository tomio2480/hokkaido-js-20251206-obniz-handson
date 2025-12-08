# obniz リアルタイムIoT制御ハンズオン ( #hokkaido_js )

2025-12-06(土) に開催される、hokkaido.js vol.05@Kushiro で使用するハンズオン資料です。obnizを使った4人同時リアルタイムIoT制御と、外部サービス（Airtable）との連携について触れています。

イベント詳細: [hokkaido.js vol.05@Kushiro](https://hokkaido-js.connpass.com/event/363908/)

## 📁 ファイル構成

```
obniz-hokkaido-js-946/
├── ハンズオン資料.md                # メインのハンズオン資料
├── ローカルHTTPサーバー起動方法.md  # HTTPサーバーの起動方法（参考）
├── README.md                        # このファイル
├── sample/                          # サンプルコード
│   ├── index.html                  # クライアント側HTML（Tailwind CSS v4使用）
│   └── script.js                   # クライアント側JavaScript
└── challenges/                     # 課題1-5の実装済みファイル
    ├── challenge1.html             # 課題1: センサー値を%に変換
    ├── challenge2.html             # 課題2: スライダーを使ったLED制御（PWM）
    ├── challenge3.html             # 課題3: 自動調光ライト
    ├── challenge4.html             # 課題4: リアルタイム状態モニタ
    └── challenge5.html             # 課題5: Airtableログ記録
```

**注**: 全てのHTMLファイルはTailwind CSS v4を使用してスタイリングされています。

## 🚀 使い方

### 1. サンプルコードの動作確認

1. `sample/index.html`をWebブラウザで開く
2. obniz IDとLEDポート番号（1-4）を入力
3. 接続ボタンをクリック
4. LED制御とセンサー値を確認

### 2. 課題に挑戦

`challenges/`フォルダ内のファイルには、各課題の実装が既に完成した状態で含まれています。
詳細は`ハンズオン資料.md`を参照してください。

**課題一覧:**
- 課題1: センサー値を%に変換
- 課題2: スライダーを使ったLED制御（PWM）
- 課題3: 自動調光ライト（センサー連動）
- 課題4: リアルタイム状態モニタ（メッセージ共有）
- 課題5: Airtableを使ったログ記録（外部API連携）

### 3. 課題5の準備

課題5を実施する場合、Airtableの設定が必要です。
`challenge5.html`のスクリプト内で以下を設定してください：

```javascript
const AIRTABLE_TOKEN = 'あなたのPersonal Access Token';
const BASE_ID = 'あなたのBase ID';
```

詳細は`ハンズオン資料.md`の課題5セクションを参照してください。

**HTTPサーバーについて:**
課題5はファイルシステムから直接開いても動作します。
ローカルHTTPサーバーの起動は任意です（詳細は`ローカルHTTPサーバー起動方法.md`参照）。

## 📝 ポート番号割り当て

ハンズオン当日に各参加者にLEDポート番号（1-4）を割り当てます。

**ポート番号の例**:
- 参加者1 → ポート1（赤色LED）
- 参加者2 → ポート2（黄色LED）
- 参加者3 → ポート3（緑色LED）
- 参加者4 → ポート4（青色LED）

## 🔧 必要な環境

- Webブラウザ（Chrome、Edge、Firefoxなど最新版）
- テキストエディタ（VSCode推奨）
- Airtableアカウント（課題5で使用、無料）

## 💡 重要な変更点（公式ドキュメント準拠）

このハンズオン資料は、obniz公式ドキュメントに基づいて以下の点を修正しています：

1. **複数クライアント同時接続**: `local_connect: false`の設定を追加
2. **PWM制御**: `led.pwm()`ではなく`obniz.getFreePwm()`を使用
3. **センサー値取得**: `obniz.ad0.start()`で継続監視を実装
4. **電圧基準**: 5V基準で計算

## 📚 参考資料

- [obniz公式サイト](https://obniz.com/ja/)
- [obniz.js リファレンス](https://obniz.com/ja/doc/reference/obnizjs)
- [obniz GitHub](https://github.com/obniz/obniz)
- [Airtable](https://airtable.com/)

## ⚠️ 注意事項

- obniz IDは参加者全員で共有します
- LEDポート番号は各参加者に1つずつ割り当てられます
- 本ハンズオンはobniz Cloud経由の接続を使用します（**obnizボード側へのプログラム書き込みは不要**）
- 複数人で同時接続するため、必ず`local_connect: false`の設定が必要です
