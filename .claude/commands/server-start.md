サーバーを起動してください。以下のルールを必ず守ること。

## サーバー起動ルール

- アプリケーションが定義しているデフォルトポートで起動すること
  - フロントエンド（Vite）: 5173
  - バックエンド（Spring Boot）: 8080
- **ポート競合が発生した場合は、別のポートで起動してはいけない**
  - 競合しているプロセスを特定して停止する
  - 停止後、デフォルトポートで起動する

## 手順

1. Docker Desktop が起動しているか確認する（`docker info` で確認）
2. 起動していない場合は以下のコマンドで起動し、準備完了まで待機する
   ```bash
   powershell -Command "Start-Process 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'"
   # Docker が起動するまで待機（ready になるまでポーリング）
   for i in $(seq 1 12); do docker info > /dev/null 2>&1 && echo "Docker ready" && break; echo "Waiting... ($i)"; sleep 5; done
   ```
3. 起動対象のデフォルトポートが使用中か確認する
4. 使用中であれば、そのプロセスをユーザーに確認の上停止する
5. `docker compose up -d` で DB・バックエンドを起動する
6. `pnpm dev` でフロントエンドを起動する（バックグラウンド実行）
