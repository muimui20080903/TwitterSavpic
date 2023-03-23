require(`dotenv`).config()
const env = process.env ; //環境変数として.envを読み込む
const json = require("./target.json");
//console.log(json[0]["screen_name"]);

const {Client} = require('twitter-api-sdk');
const client = new Client(process.env.Bearer_Token);

//ユーザーの指定
const userName = json[0]["screen_name"]; //nana_anaIysis

/*
(async () => {
    const { data } = await client.users.findUserByUsername(userName);
    const tweets = client.tweets.usersIdTweets(data.id);
    //const tweets = client.tweets.usersIdTweets(data.text);
    for await (const page of tweets) {
        console.log(page.data);
        //console.log(page.includes);
    }
})();*/
/*
async function main() {
    const tweet = await client.tweets.findTweetById("1638122245515255808");
    //console.log(tweet.data.text);
    console.log(tweet);
  }
  main();*/
  /*
(async() => {

    const { data } = await client.users.findUserByUsername(userName);

    const tweets = client.tweets.usersIdLikedTweets(data.id);
    
    for await (const page of tweets) {
      console.log(page.data);
    }
})()*/