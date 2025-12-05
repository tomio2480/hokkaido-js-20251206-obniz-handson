# ローカルHTTPサーバーの起動方法

このドキュメントでは、課題5のAirtable連携で必要となるローカルHTTPサーバーの起動方法を複数紹介します。

## 目次

1. [VSCode Live Server（推奨）](#1-vscode-live-server推奨)
2. [Node.jsのhttp-server](#2-nodejsのhttp-server)
3. [Node.jsの標準モジュール（上級者向け）](#3-nodejsの標準モジュール上級者向け)

---

## 1. VSCode Live Server（推奨）

**VSCode Live Server**は、ファイルを保存すると自動的にブラウザが更新される便利な拡張機能です。

### インストール手順

1. VSCodeを開く
2. 左側の拡張機能アイコン（四角が4つ）をクリック
3. 検索欄に「Live Server」と入力
4. 「Live Server」（作者: Ritwick Dey）をインストール

### 使用方法

1. VSCodeでHTMLファイル（例: `challenge5.html`）を開く
2. 右下の「Go Live」ボタンをクリック
3. ブラウザが自動的に開き、`http://127.0.0.1:5500/challenge5.html`でアクセスされます

> **ポイント**: ファイルを編集して保存すると、ブラウザが自動的にリロードされます。開発効率が大幅に向上します。

---

## 2. Node.jsのhttp-server

**http-server**は、Node.jsで動作するシンプルなHTTPサーバーです。

### 前提条件

Node.jsがインストールされていること（確認方法: `node -v`）

### 使用方法

```bash
# プロジェクトフォルダに移動
cd /path/to/obniz-hokkaido-js-946

# http-serverを起動（初回のみnpxが自動インストール）
npx http-server -p 8000

# 以下のように表示されます
# Starting up http-server, serving ./
# Available on:
#   http://127.0.0.1:8000
```

ブラウザで`http://localhost:8000/challenges/challenge5.html`にアクセスします。

> **補足**: `-p 8000`はポート番号を指定しています。省略すると8080番ポートが使用されます。

---

## 3. Node.jsの標準モジュール（上級者向け）

Node.jsの標準モジュールだけでHTTPサーバーを作成することもできます。

### server.js を作成

プロジェクトのルートディレクトリに`server.js`を作成します。

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const server = http.createServer((req, res) => {
    // リクエストされたファイルのパスを取得
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // ファイルの拡張子からContent-Typeを決定
    const extname = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
    }[extname] || 'text/plain';

    // ファイルを読み込んで返す
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
```

### 起動方法

```bash
node server.js
```

ブラウザで`http://localhost:8000/challenges/challenge5.html`にアクセスします。

### 学習ポイント

- HTTPサーバーの仕組みを理解できる
- Content-Typeの設定方法を学習できる
- Node.jsの標準モジュール（http, fs, path）の使い方を習得できる

---

## HTTPサーバー起動後の確認

どの方法を選んでも、以下を確認してください：

1. ブラウザでアクセス
2. アドレスバーが`http://`で始まっていることを確認
3. これで課題5のAirtable APIが正しく動作します

---

## トラブルシューティング

### ポートが既に使用されている

別のアプリケーションがポートを使用している場合、以下のように別のポート番号を指定してください：

```bash
# http-serverの場合
npx http-server -p 8001

# Node.js標準モジュールの場合
# server.jsのPORT変数を変更
const PORT = 8001;
```

### ファイルが見つからない

- ファイルパスが正しいか確認
- プロジェクトのルートディレクトリでサーバーを起動しているか確認

### ブラウザが自動で開かない（Live Server）

- 手動で`http://127.0.0.1:5500/`にアクセス
- VSCodeの設定で「Live Server: Custom Browser」を確認
