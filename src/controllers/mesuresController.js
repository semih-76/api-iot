import { getDB } from '../config/db.js'

export const lastMesures  = async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection("mesures");

        const resultats = await collection.findOne({}, { sort: { _id: -1 } });
        console.log('Found documents =>', resultats);

        res.status(200).json(resultats);
    } catch {
        console.error("Erreur dans lastMesures :", error);
        res.status(500).json({ message: error.message });
    }
}

