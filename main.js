require(`dotenv`).config()
const env = process.env ; //環境変数として.envを読み込む
const json = require("./target.json");//target.jsonからユーザーの情報を読み込む
//console.log(json[0]["screen_name"]);

const client = new Client(process.env.Bearer_Token);

//ユーザーの指定
const userName = json[0]["screen_name"]; //nana_anaIysis
