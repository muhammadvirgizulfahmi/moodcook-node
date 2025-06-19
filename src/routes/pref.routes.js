// src/routes/pref.routes.js (Versi Debugging Final)

import { Router } from 'express';
import { FoodPref } from '../models/index.js';

const router = Router();

/* middleware simple auth via cookie 'userId' */
router.use((req, res, next) => {
  // ================================================================
  // PINDAHKAN BLOK DEBUGGING KE SINI
  console.log('--- DEBUGGING MIDDLEWARE pref.routes.js ---');
  console.log('Isi dari req.cookies:', req.cookies);
  console.log('Nilai dari userId yang diambil:', req.cookies.userId);
  console.log('---------------------------------------------');
  // ================================================================

  if (!req.cookies.userId) {
    // Tambahkan log ini agar kita tahu jika request dihentikan di sini
    console.error('MIDDLEWARE MENGHENTIKAN REQUEST: Cookie userId tidak ditemukan!');
    return res.status(401).send('Unauthorized: Cookie userId tidak ditemukan.');
  }
  // Jika cookie ada, lanjutkan
  next();
});

/* ---------- FOOD PREFERENCES ---------- */
router.post('/prefs/food', async (req, res) => {
  const id = req.cookies.userId;
  try {
    await Promise.all(
      Object.entries(req.body).map(([mood, taste]) =>
        FoodPref.create({ userId: id, mood, taste })
      )
    );
    res.redirect('/login.html');
  } catch (err) {
    console.error("Gagal menyimpan preferensi makanan:", err);
    res.status(500).send('server_error_food_pref');
  }
});


/* ---------- GET USER'S FOOD PREFERENCES ---------- */
router.get('/prefs/food', async (req, res) => {
  const id = req.cookies.userId;
  try {
    const prefs = await FoodPref.findAll({ where: { userId: id } });
    const prefObject = prefs.reduce((acc, current) => {
      acc[current.mood] = current.taste;
      return acc;
    }, {});
    res.json(prefObject);
  } catch (err) {
    console.error("Gagal mengambil preferensi makanan:", err);
    res.status(500).send('server_error_get_food_pref');
  }
});

/* ---------- MUSIC PREFERENCES ---------- */
// router.post('/prefs/music', async (req, res) => {
//   const id = req.cookies.userId;
//   try {
//     await Promise.all(
//       Object.entries(req.body).map(([mood, genre]) =>
//         MusicPref.create({ userId: id, mood, genre })
//       )
//     );
//     res.redirect('/?signup=success'); // Redirect ke halaman utama setelah selesai
//   } catch (err) {
//     console.error("Gagal menyimpan preferensi musik:", err);
//     res.status(500).send('server_error_music_pref');
//   }
// });

export default router;