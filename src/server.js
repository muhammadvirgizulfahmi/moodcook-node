// src/server.js (Versi Final dengan Debugger)

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './config/database.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Impor semua rute Anda
import prefRoutes from './routes/pref.routes.js';
// import recRoutes from './routes/recs.routes.js';
import moodRoutes from './routes/mood.routes.js';
import recipeRoutes from './routes/recipe.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// --- PERUBAHAN 1: PAKSA PORT KE 3000 UNTUK DEBUGGING ---
const PORT = 3000;
// const PORT = process.env.PORT || 8000; // Kita nonaktifkan ini sementara

/* ─ Middleware dasar ─ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Ini sudah benar

// --- PERUBAHAN 2: TAMBAHKAN MIDDLEWARE DEBUGGER REQUEST ---
// Ini akan mencatat SEMUA request yang masuk ke server
app.use((req, res, next) => {
  console.log(`[REQUEST LOGGER] Menerima request: ${req.method} ${req.originalUrl}`);
  next();
});

/* ─ Static files ─ */
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../public')));

/* ─ API routes ─ */
app.use('/api', authRoutes);
app.use('/api', prefRoutes);
// app.use('/api', recRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/recipes', recipeRoutes);

/* ─ Health check ─ */
app.get('/health', (_, res) => res.send('OK'));

/* ─ Start server ─ */
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil.');
    // Pastikan ini dinonaktifkan
    // await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  } catch (error) {
    console.error('Tidak dapat terhubung ke database:', error);
  }
}

start();