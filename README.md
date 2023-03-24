# TwitterSavpic
Twitterのいいね欄から画像を保存する

# セッティング
`target.json`に
```
[
    {
        "screen_name":"mui",
        "id":"9999999999"
    },
    {
        "screen_name":"aiueo",
        "id":""
    },
    {
        "screen_name":"",
        "id":"11111111"
    }
]
```
`.env`に
```
Bearer_Token="AAAAAAAAAAAAAAAAAA"
```
# 制作
## 流れ
1. TwitterのAPIを利用する
2. ツイート情報を取得する
3. 取得したデータをSQLに格納する
4. 画像を保存する
5. 画像の保存前にSQL内のデータと被りがないか確認する
6. 完成！

## データベースの中身
|id| author_name | author_ID | tweet_ID | media_url | position | file_name |
|-|-|-|-|-|-|-|
|primary key|||||||
|id(自動で入力される)|ユーザー名|ユーザーid|ツイートID|画像のurl|何枚目か|ファイル名||

sqlの操作は変数を使って行うのがいいらしい
