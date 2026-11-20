import express from 'express'
import { connectDB } from './src/config/db.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/sante', (req, res) => {
     res.json({ status: "API Météo en ligne" });
})

await connectDB();

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
})