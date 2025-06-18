// src/routes/pref.routes.js
import { Router } from 'express';
import { FoodPref, MusicPref, User } from '../models/index.js';

const router = Router();

/* middleware simple auth via cookie 'userId' */
router.use((req,res,next)=>{
  if (!req.cookies.userId) return res.status(401).send('Unauthorized');
  next();
});

/* ---------- FOOD ---------- */
router.post('/prefs/food', async (req,res)=>{
  // req.body = { angry:'pedas', sad:'manis', happy:'asin', bored:'gurih' }
  const id = req.cookies.userId;
  await Promise.all(
    Object.entries(req.body).map(([mood,taste])=>
      FoodPref.create({ userId:id, mood, taste })
    )
  );
  res.redirect('/pref-music.html');
});

/* ---------- MUSIC ---------- */
router.post('/prefs/music', async (req,res)=>{
  const id = req.cookies.userId;
  await Promise.all(
    Object.entries(req.body).map(([mood,genre])=>
      MusicPref.create({ userId:id, mood, genre })
    )
  );
  res.redirect('/login.html');           // selesai → login form
});

export default router;
