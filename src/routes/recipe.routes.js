// src/routes/recipe.routes.js

// 1. Impor semua yang dibutuhkan
import { Router } from 'express';
import { Recipe } from '../models/index.js';
import { sequelize } from '../config/database.js'; // <-- TAMBAHKAN impor ini
import * as recipeCtrl from '../controllers/recipe.controller.js';

// 2. Buat instance router
const router = Router();

// Route yang sudah ada
router.get('/', recipeCtrl.findAll);
router.post('/', recipeCtrl.create);

// Route BARU untuk rekomendasi
router.get('/recommend', async (req, res) => {
  try {
    const { taste } = req.query;

    if (!taste) {
      return res.status(400).json({ message: 'Parameter rasa (taste) dibutuhkan.' });
    }

    const recipes = await Recipe.findAll({
      where: {
        taste: taste
      },
      // DIUBAH: Gunakan sequelize.literal untuk memanggil fungsi RAND()
      order: [
        sequelize.literal('RAND()')
      ],
      limit: 3
    });

    res.json(recipes);
  } catch (err) {
    // Log error yang lebih spesifik di sini
    console.error("Gagal mengambil rekomendasi resep:", err);
    res.status(500).send('server_error');
  }
});

// 4. Ekspor router
export default router;