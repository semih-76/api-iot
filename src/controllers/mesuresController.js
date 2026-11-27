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
    } catch (error) {
        console.error("Erreur de récupération de la mesure", error.message);
        res.status(500).json({
            message: "Erreur de récupération de la mesure",
        });
    }
};

export const statsMesures = async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection("mesures");
        const  { debut, fin } = req.query;
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
        const pipeline = [
            { $match: filtre },
            { $group:
                    { _id: null,
                        tempmin: {$min: "$temperature"},
                        tempmax: {$max: "$temperature"},
                        tempmoy: {$avg: "$temperature"},
                        ventmin: {$min: "$vent_vitesse"},
                        ventmax: {$max: "$vent_vitesse"},
                        ventmoy: {$avg: "$vent_vitesse"},
                        humiditemin: {$min: "$humidite"},
                        humiditemax: {$max: "$humidite"},
                        humiditemoy: {$avg: "$humidite"}
                    }
            }
        ];
        const mesures = await collection.aggregate(pipeline).toArray();
        if (mesures.length === 0){
            return res.status(404).json({
                message: "Aucune mesure pour cette période"
            })
        }
        res.status(200).json(mesures[0]);
    } catch (error) {
        console.error("Erreur dans statsMesures :", error);
        res.status(500).json({ message: error.message });
    }
}

export const createMesure = async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection("mesures");
        const mesure = req.body;
        const erreurs = [];
        if(!mesure.reference_capteur || typeof mesure.reference_capteur !== "string"){
            erreurs.push("reference_capteur est invalide");
        }
        if(!mesure.instant_mesure || isNaN(new Date(mesure.instant_mesure).getTime())){
            erreurs.push("instant_mesure est invalide");
        }
        if(typeof mesure.temperature !== "number"){
            erreurs.push("temperature est invalide")
        }
        if(typeof mesure.vent_vitesse !== "number"){
            erreurs.push("vent_vitesse est invalide")
        }
        if(typeof mesure.humidite !== "number" || mesure.humidite < 0 || mesure.humidite > 100){
            erreurs.push("humidite est invalide")
        }
        if (erreurs.length > 0) {
            await db.collection('journaux').insertOne({
                date: new Date(),
                type: "rejet_validation",
                erreurs: erreurs,
                donnees: mesure
            })
            return res.status(400).json({message: "Données de mesure invalides", erreurs})
        }
        mesure.instant_mesure = new Date(mesure.instant_mesure);
        const resultat = await collection.insertOne(mesure);
        res.status(201).json({
            message: "Mesure enregistrée avec succès",
            id: resultat.insertedId
        });
    } catch (error) {
        if (error.code === 11000)
        console.error("Erreur dans createMesure :", error);
        res.status(500).json({ message: error.message });
    }
}