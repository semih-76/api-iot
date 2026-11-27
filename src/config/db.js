import { MongoClient } from 'mongodb';

let db = null;

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    await client.connect();

    db = client.db(process.env.MONGODB_DB || 'station_meteo');
    console.log("Connecté à MongoDB");
    return db;
}
export function getDB(){
    if(!db) {
        throw new Error("Echec de la connexion");
    }
    return db;
}