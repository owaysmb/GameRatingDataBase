import 'dotenv/config' 
import dotenv from "dotenv"
dotenv.config({ path: './backend/.env' }) 
dotenv.config({ path: './.env' })

import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import routers from "../backend/routes/routes.js"
import connectDB from "./config/db.js";
import igdbRouter from "./routes/IGDBRouter.js"

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routers);
app.use("/", igdbRouter);
connectDB(app.listen(3000));

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {

    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const res = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: "client_credentials",
        }),
    });

    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; 

    return accessToken;
}

export class IGDBService {
    constructor(){
        this.link = "https://api.igdb.com/v4/games";
    }

    async FetchRes(body){
        const token = await getAccessToken();

        const res = await fetch(this.link,{
            method:"POST",
            headers:{
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "text/plain",
            },
            body:body
        })
        
        return res.json();
    }

}


app.get("/",(req,res)=>{
    console.log("TEST");
    res.send("Backend is working ");
})


app.get("/api/top-rated",async (req ,res)=>{
    try{
        const TopRatedRes = new IGDBService()
        const data = await TopRatedRes.FetchRes(`
                        fields name, cover.url, genres.name, rating, rating_count;
                        where rating != null & rating_count >= 1200;
                        sort rating desc;
                        limit 10;
                    `)
        res.json(data)
    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
});


app.get("/api/Trending",async (req ,res)=>{
    try{

        const threeMonthsAgo = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 90;

        const igdb = new IGDBService();
        const data = await igdb.FetchRes(`
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

                `);
        res.json(data)

    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
});
app.get("/api/Upcoming",async (req ,res)=>{
    try{
        const igdb = new IGDBService()
        const data = await igdb.FetchRes(`
                  fields 
                  name,
                  cover.url,
                  genres.name,
                  hypes,
                  first_release_date;
                where hypes != null & first_release_date > ${Math.floor(Date.now() / 1000)};
                sort hypes desc;
                limit 20;
                `);
        res.json(data)
    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
});
const now = Math.floor(Date.now() / 1000);
const last30Days = now - 60 * 60 * 24 * 30;

app.get("/api/Recently_released",async (req ,res)=>{
    try{
        
        const igdb = new IGDBService()

        const data = await igdb.FetchRes(`
                  fields name, cover.url, genres.name, first_release_date;
                  where first_release_date < ${now}
                    & first_release_date > ${last30Days}
                    & cover != null;
                  sort first_release_date desc;
                  limit 20;
                `);
        res.json(data)
    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
});


app.post("/games/batch", async (req, res) => {
    try {
        const { ids, fields  } = req.body;
        if (!ids?.length) return res.json([]);

        const igdb = new IGDBService()

        const games = await igdb.FetchRes(`
                where id = (${ids.join(",")});
                fields ${fields ?? "name, cover.url, rating"};
                limit 50;
            `);

        const ttbRes = await fetch("https://api.igdb.com/v4/game_time_to_beats", {
            method: "POST",
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${await getAccessToken()}`,
                "Content-Type": "text/plain",
            },
            body: `where game_id = (${ids.join(",")}); fields game_id, hastily, normally, completely; limit 50;`,
        });

        const ttbData = await ttbRes.json();


        const ttbMap = {};
        for (let i = 0; i < ttbData.length; i++) {
            const ttb = ttbData[i];
            ttbMap[String(ttb.game_id)] = { 
                hastily:    ttb.hastily    ? Math.round(ttb.hastily / 3600)    : null,
                normally:   ttb.normally   ? Math.round(ttb.normally / 3600)   : null,
                completely: ttb.completely ? Math.round(ttb.completely / 3600) : null,
            };
        }

        const processed = games.map(g => ({
            ...g,
            cover: g.cover?.url
                ? `https:${g.cover.url.replace("t_thumb", "t_cover_big")}`
                : null,
            timeToBeat: ttbMap[String(g.id)] ?? null
        }));

        res.json(processed);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed" });
    }
});




app.get("/game/:id", async (req, res) => {
  try {
    
    const { id } = req.params;

    const igdb = new IGDBService();

    const [game] = await igdb.FetchRes(`
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
                    similar_games,
                    artworks.image_id
;
      `);
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

const ttbRes = await fetch("https://api.igdb.com/v4/game_time_to_beats", {
    method: "POST",
    headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${await getAccessToken()}`,
        "Content-Type": "text/plain",
    },
    body: `where game_id = ${id}; fields hastily, normally, completely;`,
});

const ttbData = await ttbRes.json();
const ttb = ttbData[0];

const timeToBeat = ttb ? {
    hastily:    ttb.hastily    ? Math.round(ttb.hastily / 3600)    : null,
    normally:   ttb.normally   ? Math.round(ttb.normally / 3600)   : null,
    completely: ttb.completely ? Math.round(ttb.completely / 3600) : null,
} : null;

  let similarGames = [];
    if(game.similar_games?.length){
      const similarRes = new IGDBService()
      similarGames = await similarRes.FetchRes(`
        where id = (${game.similar_games.slice(0, 6).join(",")});
        fields name, cover.url, rating;
      `);
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
    const response = new IGDBService();

    const data = await response.FetchRes(`
        search "${name}";
        fields   id,name,cover.url;   
        limit 1;
      `);
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch game" });
  }
});


