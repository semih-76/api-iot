import express from 'express'
import { connectDB } from './src/config/db.js'
import mesuresRoutes  from './src/routes/mesuresRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(mesuresRoutes);

app.get('/api/sante', (req, res) => {
     res.json({ status: "API Météo en ligne" });
})

await connectDB();

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
})