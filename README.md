# obniz リアルタイムIoT制御ハンズオン ( #hokkaido_js )

2025-12-06(土) に開催される、hokkaido.js vol.05@Kushiro で使用するハンズオン資料です。obnizを使った4人同時リアルタイムIoT制御と、外部サービス（Airtable）との連携について触れています。

イベント詳細: [hokkaido.js vol.05@Kushiro](https://hokkaido-js.connpass.com/event/363908/)

## 📁 ファイル構成

```
obniz-hokkaido-js-946/
├── ハンズオン資料.md                # メインのハンズオン資料
├── ローカルHTTPサーバー起動方法.md  # HTTPサーバーの起動方法（課題5で使用）
├── README.md                        # このファイル
├── sample/                          # サンプルコード
│   ├── index.html                  # クライアント側HTML
│   └── script.js                   # クライアント側JavaScript
├── obniz-board/                    # obnizボード側プログラム（参考）
│   └── program.js                  # ※クラウド経由接続では不要
└── challenges/                     # 課題用テンプレート
    ├── challenge1.html             # 課題1: センサー値を%に変換
    ├── challenge2.html             # 課題2: スライダーを使ったLED制御
    ├── challenge3.html             # 課題3: 自動調光ライト
    ├── challenge4.html             # 課題4: リアルタイム状態モニタ
    └── challenge5.html             # 課題5: Airtableログ記録
```

## 🚀 使い方

### 1. サンプルコードの動作確認

1. `sample/index.html`をWebブラウザで開く
2. obniz IDとLEDポート番号（0-3）を入力
3. 接続ボタンをクリック
4. LED制御とセンサー値を確認

### 2. 課題に挑戦

`challenges/`フォルダ内のテンプレートを使って、各課題に取り組みます。
詳細は`ハンズオン資料.md`を参照してください。

**課題一覧:**
- 課題1: センサー値を%に変換
- 課題2: スライダーを使ったLED制御（PWM）
- 課題3: 自動調光ライト（センサー連動）
- 課題4: リアルタイム状態モニタ（メッセージ共有）
- 課題5: Airtableを使ったログ記録（外部API連携）

### 3. 課題5の準備

課題5を実施する前に、ローカルHTTPサーバーを起動してください。
詳細は`ローカルHTTPサーバー起動方法.md`を参照してください。

**推奨方法: VSCode Live Server**
1. VSCodeで拡張機能「Live Server」をインストール
2. HTMLファイルを開いて「Go Live」をクリック

## 📝 ポート番号割り当て

ハンズオン当日に各参加者にLEDポート番号（0-3）を割り当てます。

**ポート番号の例**:
- 参加者1 → ポート0（赤色LED）
- 参加者2 → ポート1（黄色LED）
- 参加者3 → ポート2（緑色LED）
- 参加者4 → ポート3（青色LED）

## 🔧 必要な環境

- Webブラウザ（Chrome、Edge、Firefoxなど最新版）
- テキストエディタ（VSCode推奨）
- Node.js（課題5で使用、バージョン14以降推奨）
- Airtableアカウント（課題5で使用、無料）

## 📚 参考資料

- [obniz公式サイト](https://obniz.com/ja/)
- [obniz.js リファレンス](https://obniz.com/ja/doc/reference/obnizjs)
- [Airtable](https://airtable.com/)

## ⚠️ 注意事項

- obniz IDは参加者全員で共有します
- LEDポート番号は各参加者に1つずつ割り当てられます
- 本ハンズオンはobniz Cloud経由の接続を使用します（obnizボード側プログラムは不要）
- 課題5ではローカルHTTPサーバーが必要です
