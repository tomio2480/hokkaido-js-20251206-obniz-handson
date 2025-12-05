// Google Apps Script (GAS) サンプルコード
// 課題4で使用するログ記録用スクリプト

/**
 * POSTリクエストを受け取り、スプレッドシートにログを記録する
 * @param {Object} e - POSTリクエストのイベントオブジェクト
 * @return {Object} - JSON形式のレスポンス
 */
function doPost(e) {
  try {
    // スプレッドシートとシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ログ');
    
    if (!sheet) {
      return createErrorResponse('シート「ログ」が見つかりません');
    }
    
    // POSTデータをパース
    const data = JSON.parse(e.postData.contents);
    
    // 必須フィールドのチェック
    if (!data.idToken || !data.userName || !data.userEmail || !data.action) {
      return createErrorResponse('必須フィールドが不足しています');
    }
    
    // IDトークンの検証（簡易版）
    // 実際の運用では、Google APIを使用してトークンを検証することを推奨
    const idToken = data.idToken;
    
    // ログデータを追加
    sheet.appendRow([
      new Date(),           // タイムスタンプ
      data.userName,        // ユーザー名
      data.userEmail,       // メールアドレス
      data.action,          // 操作（例: LED ON）
      data.value || ''      // 値（例: ポート番号）
    ]);
    
    // 成功レスポンスを返す
    return createSuccessResponse({
      message: 'ログを記録しました',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // エラーレスポンスを返す
    return createErrorResponse(error.toString());
  }
}

/**
 * 成功レスポンスを作成
 * @param {Object} data - レスポンスデータ
 * @return {Object} - JSON形式のレスポンス
 */
function createSuccessResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      data: data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * エラーレスポンスを作成
 * @param {string} message - エラーメッセージ
 * @return {Object} - JSON形式のレスポンス
 */
function createErrorResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: message
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GETリクエストのテスト用（オプション）
 * @return {Object} - HTML形式のレスポンス
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h1>obniz ログ記録API</h1>' +
    '<p>このAPIはPOSTリクエストのみ受け付けます。</p>' +
    '<p>デプロイ設定: アクセスできるユーザー = 自分のみ</p>'
  );
}

// ===== セットアップ手順 =====
// 
// 1. Google Sheetsで新しいスプレッドシートを作成
// 2. シート名を「ログ」に変更
// 3. 1行目に以下のヘッダーを入力:
//    A1: タイムスタンプ
//    B1: ユーザー名
//    C1: メールアドレス
//    D1: 操作
//    E1: 値
// 
// 4. 「拡張機能」→「Apps Script」を開く
// 5. このコードを貼り付け
// 6. 「デプロイ」→「新しいデプロイ」
// 7. 種類: Webアプリ
// 8. 次のユーザーとして実行: 自分
// 9. アクセスできるユーザー: 自分のみ ← 重要！
// 10. デプロイURLをコピーし、課題4のHTMLファイルに貼り付け
