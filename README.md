# obniz リアルタイムIoT制御ハンズオン

obnizを使った4人同時リアルタイム制御と、Google認証を使ったセキュアなWebサービス連携を学習するハンズオン資料です。

## 📁 ファイル構成

```
obniz-hokkaido-js-946/
├── ハンズオン資料.md          # メインのハンズオン資料
├── README.md                  # このファイル
├── sample/                    # サンプルコード
│   ├── index.html            # クライアント側HTML
│   └── script.js             # クライアント側JavaScript
├── obniz-board/              # obnizボード側プログラム
│   └── program.js            # ボード側永続実行プログラム
└── challenges/               # 課題用テンプレート
    ├── challenge1.html       # 課題1: スライダーLED制御
    ├── challenge2.html       # 課題2: 自動調光ライト
    ├── challenge3.html       # 課題3: リアルタイム状態モニタ
    └── challenge4.html       # 課題4: 認証とログ記録
```

## 🚀 使い方

### 1. サンプルコードの動作確認

1. `sample/index.html`をWebブラウザで開く
2. obniz IDと認証IDを入力
3. 接続ボタンをクリック
4. LED制御とセンサー値を確認

### 2. obnizボード側プログラムの設定

1. obniz Cloudにログイン
2. デバイスを選択
3. プログラムエディタを開く
4. `obniz-board/program.js`の内容を貼り付け
5. 保存して実行

### 3. 課題に挑戦

`challenges/`フォルダ内のテンプレートを使って、各課題に取り組みます。
詳細は`ハンズオン資料.md`を参照してください。

## 📝 ポート番号割り当て

ハンズオン当日に各参加者にLEDポート番号（0-3）を割り当てます。

**ポート番号の例**:
- 参加者1 → ポート0
- 参加者2 → ポート1
- 参加者3 → ポート2
- 参加者4 → ポート3

## 🔧 必要な環境

- Webブラウザ（Chrome、Edge、Firefoxなど最新版）
- テキストエディタ（VSCode推奨）
- Googleアカウント（課題4で使用）

## 📚 参考資料

- [obniz公式サイト](https://obniz.com/ja/)
- [obniz.js リファレンス](https://obniz.com/ja/doc/reference/obnizjs)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)

## ⚠️ 注意事項

- obniz IDは参加者全員で共有します
- LEDポート番号は各参加者に1つずつ割り当てられます
- 信頼できる参加者で扱う練習として、認証機能は使用しません

## 📄 ライセンス

このハンズオン資料は教育目的で自由に使用できます。
