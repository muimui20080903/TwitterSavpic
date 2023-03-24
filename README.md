# TwitterSavpic
Twitterのいいね欄から画像を保存する

# セッティング
```
$ npm install
```
`target.json`に
```
{
    "dbtable": "<テーブル名>",
    "FILE_PATH_ROOT": "/home/user/Pictures/",
    "target": [
        {
            "screen_name": "<ユーザー名>",
        },
        {
            "screen_name": "unchi",
        }
    ]
}
```
`.env`に
```
Bearer_Token="AAAAAAAAAAAAAAAAAA"
```
sqlite3でdbの作成
```
$ sqlite3 twitterpic.db
sqlite> CREATE TABLE twitterpic(id INTEGER PRIMARY KEY ,author_screenname, author_name , author_ID , tweet_ID , media_url, position , file_name, save_time);
```
開始
```
$ npm run start
```

EAI_AGAINのエラーが出たら、DNSの問題なので、DNSサーバーを変更する
# 制作
## 流れ
1. TwitterのAPIを利用する
2. ツイート情報を取得する
3. 取得したデータをSQLに格納する
4. 画像を保存する
5. 画像の保存前にSQL内のデータと被りがないか確認する
6. 完成！

## データベースの中身
|id|author_screenname| author_name | author_ID | tweet_ID | media_url | position | file_name |save_time|
|-|-|-|-|-|-|-|-|-|
|primary key||||||||
|id(自動で入力される)|ユーザーの表示名|ユーザー名(@)|ユーザーid|ツイートID|画像のurl|何枚目か|ファイル名|時間(2023/3/24 21:40:40)|

sqlの操作は変数を使って行うのがいいらしい
