import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';   // ← tambah ini
import { sequelize } from './config/database.js';
import moodRoutes   from './routes/mood.routes.js';
import recipeRoutes from './routes/recipe.routes.js';
import authRoutes   from './routes/auth.routes.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import prefRoutes from './routes/pref.routes.js';
import recRoutes from './routes/recs.routes.js';   // pastikan path benar



const app  = express();
const PORT = process.env.PORT || 8000;

/* ─ Middleware dasar ─ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('mySecret'));   // ← tambahkan di sini
//                    ^^^^^^^^^^
//                    (opsional) secret untuk signed cookies

/* ─ Static files ─ */
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../public')));

/* ─ API routes ─ */
app.use('/api/moods',   moodRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api',         authRoutes);
app.use('/api', prefRoutes);
app.use('/api', recRoutes);            

/* ─ Health check ─ */
app.get('/health', (_,res)=>res.send('OK'));

/* ─ Start server ─ */
async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter:true });
  app.listen(PORT, ()=>console.log(`Server  http://localhost:${PORT}`));
}

if (app._router) {
  console.table(
    app._router.stack
      .filter(r => r.route)
      .map(r => ({
        METHOD: Object.keys(r.route.methods)[0].toUpperCase(),
        PATH:   r.route.path
      }))
  );
}

start();

