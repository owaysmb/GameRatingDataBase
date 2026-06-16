import redisClient from "./server.js";


export async function cache(key, fetchFunction, ttl = 3600) {
    try {
        const cachedData = await redisClient.get(key);  
        if (cachedData) {
            console.log(`HIT  → ${key}`); 
            return JSON.parse(cachedData);             
        }
        
        console.log(`MISS → ${key}`);
        const data = await fetchFunction();            
        await redisClient.setEx(key, ttl, JSON.stringify(data));
        return data;
    } catch (err) {
        console.error("Cache error:", err);
        return await fetchFunction();                  
    }
}


export async function clearCache(...keys) {
    try {
        await Promise.all(keys.map(key => redisClient.del(key))); 
    } catch (err) {
        console.error("Cache clear error:", err);
    }
}