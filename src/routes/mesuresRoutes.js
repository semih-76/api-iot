import express from 'express'
import { lastMesures, recenteMesures } from '../controllers/mesuresController.js';


const router = express.Router();

router.get("/api/mesures/derniere", lastMesures);

router.get("/api/recente/mesures", recenteMesures);

export default router;