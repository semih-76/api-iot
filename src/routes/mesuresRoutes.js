import express from 'express'
import { lastMesures, recenteMesures, mesureById, statsMesures } from '../controllers/mesuresController.js';


const router = express.Router();

router.get("/api/mesures/derniere", lastMesures);
router.get("/api/mesures", recenteMesures);
router.get("/api/mesures/stats", statsMesures);
router.get("/api/mesures/:id", mesureById);


export default router;