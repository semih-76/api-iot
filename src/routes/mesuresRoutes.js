import express from 'express'
import { lastMesures, recenteMesures, mesureById } from '../controllers/mesuresController.js';


const router = express.Router();

router.get("/api/mesures/derniere", lastMesures);

router.get("/api/mesures", recenteMesures);

router.get("/api/mesures/:id", mesureById);

export default router;