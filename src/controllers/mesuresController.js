import { getDB } from '../config/db.js'
import {ObjectId} from 'mongodb'

export const lastMesures  = async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection("mesures");

        const resultats = await collection.findOne({}, { sort: { _id: -1 } });
        console.log('Found documents =>', resultats);

        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur dans lastMesures :", error);
        res.status(500).json({ message: error.message });
    }
}

export const recenteMesures = async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection("mesures");

        const  { debut, fin, limite } = req.query;
        const filtre = {};

        if (debut || fin) {
            filtre.instant_mesure = {};
            if (debut){
                filtre.instant_mesure.$gte = new Date(debut)
            }
            if (fin){
                filtre.instant_mesure.$lte = new Date(fin)
            }
        }
        const maxResultats = parseInt(limite) || 50;
        const mesures = await collection.find(filtre).sort({instant_mesure: -1}).limit(maxResultats).toArray();
        res.status(200).json(mesures);
    } catch (error) {
        console.error("Erreur dans recenteMesures :", error);
        res.status(500).json({ message: error.message });
    }
}

export const mesureById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Identifiant invalide"
            });
        }

        const db = getDB();
        const collection = db.collection("mesures");
        const mesure = await collection.findOne({_id: new ObjectId(id)})

        if (!mesure) {
            return res.status(404).json({
                message: "Mesures non trouvé"
            });
        }

        res.json({
            message: "Mesures récupéré avec succès",
            mesure: mesure,
        });
    } catch(error) {
        console.error("Erreur de récupération de la mesure", error.message);
        res.status(500).json({
            message: "Erreur de récupération de la mesure",
        });
    }
};