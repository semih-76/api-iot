import express from 'express'
import { lastMesures } from '../controllers/mesuresController.js';

const router = express.Router();

router.get("/api/mesures/derniere", lastMesures);

export default router;