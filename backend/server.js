import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import dotenv from "dotenv"
import routers from "../backend/routes/routes.js"
import connectDB from "./config/db.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routers);
connectDB(app.listen(3000));

let accessToken = null;

async function getAcessToken() {
    const res = await fetch("https://id.twitch.tv/oauth2/token",
        {
            method:"POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id:process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                grant_type: "client_credentials",
            }),
        }
    )

    const data = await res.json();
    accessToken = data.access_token;

}

await getAcessToken();

app.get("/",(req,res)=>{
    console.log("TEST");
    res.send("Backend is working ");
})


app.get("/api/top-rated",async (req ,res)=>{
    try{
        const igdbRes = await fetch("https://api.igdb.com/v4/games",{
            method:"POST",
            headers:{
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "text/plain",
            },
            body:`
                    fields name, cover.url, genres.name, rating, rating_count;
                    where rating != null & rating_count >= 1200;
                    sort rating desc;
                    limit 10;
                `,
        });
        const data = await igdbRes.json();
        res.json(data)
    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
});
const threeMonthsAgo = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 90;
app.get("/api/Trending",async (req ,res)=>{
    try{
        const igdbRes = await fetch("https://api.igdb.com/v4/games",{
            method:"POST",
            headers:{
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "text/plain",
            },
            body:`
                  fields 
                    name,
                    cover.url,
                    genres.name,
                    rating,
                    rating_count,
                    first_release_date;
                  where first_release_date > ${threeMonthsAgo} & cover != null;
                  sort rating_count desc;
                  limit 20;

                `,
        });
        const data = await igdbRes.json();
        res.json(data)
    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
});
app.get("/api/Upcoming",async (req ,res)=>{
    try{
        const igdbRes = await fetch("https://api.igdb.com/v4/games",{
            method:"POST",
            headers:{
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "text/plain",
            },
            body:`
                  fields 
                  name,
                  cover.url,
                  genres.name,
                  hypes,
                  first_release_date;
                where hypes != null & first_release_date > ${Math.floor(Date.now() / 1000)};
                sort hypes desc;
                limit 20;


                `,
        });
        const data = await igdbRes.json();
        res.json(data)
    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
});
const now = Math.floor(Date.now() / 1000);
const last30Days = now - 60 * 60 * 24 * 30;

app.get("/api/Recently_released",async (req ,res)=>{
    try{
        const igdbRes = await fetch("https://api.igdb.com/v4/games",{
            method:"POST",
            headers:{
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "text/plain",
            },
            body:`
                  fields name, cover.url, genres.name, first_release_date;
                  where first_release_date < ${now}
                    & first_release_date > ${last30Days}
                    & cover != null;
                  sort first_release_date desc;
                  limit 20;

                `,
        });
        const data = await igdbRes.json();
        res.json(data)
    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
});




app.get("/game/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const igdbRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "text/plain",
      },
      body: `
        where id = ${id};
        fields      name,
                    rating,
                    rating_count,
                    cover.url,
                    screenshots.url,
                    genres.name,
                    platforms.name,
                    videos.video_id,
                    videos.name,
                    first_release_date,
                    summary,
                    themes.name,
                    game_modes.name,
                    collection.name,
                    game_engines.name,
                    involved_companies.company.name,
                    involved_companies.developer,
                    involved_companies.publisher,
                    similar_games
;
      `,
    });

    const [game] = await igdbRes.json();
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
let trailer = null;

if (game.videos?.length) {
  const trailerVideo = game.videos[0];
  trailer = `https://www.youtube.com/embed/${trailerVideo.video_id}`;
}

const cover = game.cover?.url
  ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
  : null;

const release_date = game.first_release_date
  ? new Date(game.first_release_date * 1000).toDateString()
  : null;

const screenshots = []
if(game.screenshots?.length){
    game.screenshots.map(sc =>(
      screenshots.push(sc)
    ))
}

  const ttbRes = await fetch("https://api.igdb.com/v4/time_to_beats",{
  method:"POST",
  headers: {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "text/plain",
  },
  body: `
    where game = ${id};
    fields hastily, normally, completely;
  `,
  });

  const ttb = ttbRes.length ? ttbRes[0] : null;
  const timeToBeat = ttb
  ? {
      hastily: ttb.hastily ? Math.round(ttb.hastily / 3600) : null,
      normally: ttb.normally ? Math.round(ttb.normally / 3600) : null,
      completely: ttb.completely ? Math.round(ttb.completely / 3600) : null,
    }
  : null;

  let similarGames = [];
    if(game.similar_games?.length){
      const similarRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "text/plain",
      },
      body: `
        where id = (${game.similar_games.slice(0, 6).join(",")});
        fields name, cover.url, rating;
      `,});
      similarGames = await similarRes.json();
    }

    res.json({
      ...game,
      cover,
      trailer,
      release_date,
      timeToBeat,
      screenshots,
      similarGames
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch game" });
  }
});


app.get("/search/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "text/plain",
      },
      body: `
        search "${name}";
        fields   id,name,cover.url;   
        limit 1;
      `,
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch game" });
  }
});


