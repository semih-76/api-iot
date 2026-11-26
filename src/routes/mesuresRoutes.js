import express from 'express'
import { lastMesures, recenteMesures } from '../controllers/mesuresController.js';


const router = express.Router();

router.get("/api/mesures/derniere", lastMesures);

router.get("/api/mesures", recenteMesures);

export default router;