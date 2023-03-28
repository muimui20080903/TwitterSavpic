require(`dotenv`).config()//環境変数をファイルから読み込む
const env = process.env; //環境変数として.envを読み込む
const json = require("./target.json");
const date = new Date();
const save_time = date.toLocaleString();

const { Client } = require('twitter-api-sdk');
const client = new Client(env.Bearer_Token);
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./twitterpic.db")//データベースのファイル名
let sql; // DBの操作は変数使うのがいいらしい、理由は英語でわかんなかった
const dbtable = json.dbtable;//データベースのテーブル名

//画像の保存
const fs = require("fs");//ファイル操作
const axios = require("axios");//インターネット接続


const params = {
  'tweet.fields': 'created_at',
  'expansions': 'attachments.media_keys,author_id',
  'media.fields': 'url',
};

//ループ処理
json.target.forEach((target, num) => {
  //ユーザー名の設定
  const userName = target.screen_name;

  (async () => {
    //ユーザー名からIDを取得
    const { data } = await client.users.findUserByUsername(userName);
    //console.log(data.id)

    //以降openchatくんに書いてもらったからよくわかってない
    client.tweets.usersIdLikedTweets(data.id, params)
      .then((response) => {
        const tweets = response.data;
        const includes = response.includes;

        const results = [];

        for (const tweet of tweets) {
          if (tweet.attachments && tweet.attachments.media_keys) {
            for (const [index, mediaKey] of tweet.attachments.media_keys.entries()) {
              //ユーザー名の取得
              //なんか違う気もするけど実行できてるしOK！
              const user = includes.users.find((u) => u.id === tweet.author_id);
              const media = includes.media.find((m) => m.media_key === mediaKey);

              const result = {
                url: media.url,
                tweetId: tweet.id,
                userID: tweet.author_id,
                screenname: user.name,
                username: user.username,//@から始まるやつ
                position: index,
              };

              results.push(result);

              if (result.url != undefined && media.type == 'photo') {
                //mediaが画像かどうか(gif,animationはurl取得できないから弾く)
                //console.log("mediaを確認");

                //resultがすでにSQliteに載ってるかを確認
                sql = "SELECT COUNT(*) FROM " + dbtable + " WHERE tweet_id = ? LIMIT 1;";
                //sql = "SELECT EXISTS(SELECT * FROM " + dbtable + " WHERE tweet_id = ? );";
                db.get(sql, [result.tweetId], (err, row) => {
                  if (err) return console.log(err.message);
                  //if (!err) return console.log(row['COUNT(*)'] );

                  if (!err && row['COUNT(*)'] == 0) {

                    const fileName = result.username + "-" + result.tweetId + "-" + result.position;

                    //新規のデータであった場合resultをSQliteに格納

                    sql = "INSERT INTO " + dbtable + "(author_screenname,author_name, author_id, tweet_id, media_url, position, file_name,save_time) VALUES(?,?,?,?,?,?,?,?);";
                    db.run(sql, [result.screenname, result.username, result.userID, result.tweetId, result.url, result.position, fileName, save_time], (err) => {
                      if (err) return console.log(err.message);
                    });

                    //画像を保存
                    const main = async () => {
                      let FILE_PATH_ROOT = json.FILE_PATH_ROOT;
                      if (target.FILE_PATH_ROOT == "" || target.FILE_PATH_ROOT == null) {
                        FILE_PATH_ROOT = json.FILE_PATH_ROOT;
                      }else{
                        FILE_PATH_ROOT = target.FILE_PATH_ROOT;
                    };
                      const res = await axios.get(result.url, { responseType: "arraybuffer" });
                      fs.writeFileSync(FILE_PATH_ROOT + fileName + ".jpg", new Buffer.from(res.data), "binary");
                      //console.log("保存完了");
                    };
                    main();
                  };
                });
              };
            }
          }
        }
        console.log(num + 1 + "人目(@" + target.screen_name + ")保存完了〜！");
        //console.log(results);
      })
      .catch((error) => {
        console.error(error);
      });
  })()
});
console.log(json.FILE_PATH_ROOT);