require(`dotenv`).config()
const env = process.env; //環境変数として.envを読み込む
const json = require("./target.json");

const { Client } = require('twitter-api-sdk');
const client = new Client(env.Bearer_Token);
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./test.db")//データベースのファイル名はあとで書き換える
let sql; // DBの操作は変数使うのがいいらしい、理由は英語でわかんなかった
//画像の保存
const fs = require("fs");
const axios = require("axios");

//ユーザーの指定
const userName = json[0]["screen_name"];

const params = {
  'tweet.fields': 'created_at',
  'expansions': 'attachments.media_keys,author_id',
  'media.fields': 'url',
  //'user.fields': 'username',//←これよくわからん
};

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
            const media = includes.media.find((m) => m.media_key === mediaKey);

            const result = {
              url: media.url,
              tweetId: tweet.id,
              userID: tweet.author_id,
              //username: username,
              position: index,
            };
            results.push(result);
            if (result.url != undefined) {
              //mediaが画像かどうか(gif,animationはurl取得できないから弾く)
              //console.log("mediaを確認");

              //resultがすでにSQliteに載ってるかを確認
              

              //新規のデータであった場合resultをSQliteに格納
              /*
              //resulet.usernameが取得でき次第author_nameとfile_nameの変更
              sql = "INSERT INTO twitterpic(author_name, author_id, tweet_id, media_url, position, file_name) VALUES(?,?,?,?,?,?)";
              db.run(sql, [result.author_id, result.author_id, result.tweetId, result.url, result.position, "-"+result.tweetId + "-" + result.position], (err) => {
                if (err) return console.log(err.message);
              });*/

              //画像を保存
              const main = async () => {
                const res = await axios.get(result.url, { responseType: "arraybuffer" });
                fs.writeFileSync(env.FILE_PATH_ROOT + result.tweetId + "-" + result.position + ".png", new Buffer.from(res.data), "binary");
                //console.log("保存完了");
              };
              main();

            };
          }
        }
      }
      //console.log(results);

    })
    .catch((error) => {
      console.error(error);
    });
})()