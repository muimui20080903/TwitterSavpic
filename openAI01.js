require(`dotenv`).config()
const env = process.env; //環境変数として.envを読み込む
const json = require("./target.json");

const { Client } = require('twitter-api-sdk');
const client = new Client(env.Bearer_Token);
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./test.db")//データベースのファイル名はあとで書き換える

//ユーザーの指定
const userName = json[0]["screen_name"];

const params = {
  'tweet.fields': 'created_at',
  'expansions': 'attachments.media_keys,author_id',
  'media.fields': 'url',
  'user.fields': 'username',//←これよくわからん
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

            //resultsをSQliteに格納
            /*
            db.serialize(() => {
              db.run("insert into test_twitter(media_url,position,tweet_ID,author_ID) values(medis.url,index,tweet.id,tweet.author_id)");
            });
            db.close();*/
          }
        }
      }
      //console.log(results);

    })
    .catch((error) => {
      console.error(error);
    });
})()