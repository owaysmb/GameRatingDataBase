
import { IGDBService } from "../server.js"

export const TopRatedGamesPage = async (req,res)=>{
    try{
        const TopRatedRes = new IGDBService()
        const data = await TopRatedRes.FetchRes(`
                        fields name, cover.url, genres.name, rating, rating_count,first_release_date;
                        where rating != null & rating_count >= 1200;
                        sort rating desc;
                        limit 100;
                    `)
        res.json(data)
    }catch (err){
        res.status(500).json({error:"IGDB Fetch Failed"});
    }
}

export const NewReleased = async (req,res) =>{
    try{
            const now = Math.floor(Date.now() / 1000);
            const last30Days = now - 60 * 60 * 24 * 30;
            const igdb = new IGDBService()
    
            const data = await igdb.FetchRes(`
                      fields name, cover.url, genres.name, first_release_date,rating;
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
}


export const TrendingPage = async (req,res) =>{
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
}

export const Upcoming = async (req,res)=>{
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
}