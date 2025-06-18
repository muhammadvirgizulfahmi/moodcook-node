import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

const router = Router();
const SALT_ROUNDS = 10;                // → mudah diubah nanti

/* ============  REGISTER  ============ */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).send('Semua field wajib diisi');

    if (await User.findOne({ where: { email } }))
      return res.status(400).send('Email sudah terdaftar');

    const hash    = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ name, email, password: hash });

    // cookie untuk step preferensi
    res.cookie('userId', newUser.id, { httpOnly: false, sameSite: 'lax' });
    res.cookie('user', JSON.stringify({ name }), { httpOnly: false, sameSite: 'lax' });

    return res.redirect('/pref-food.html');      // → form rasa
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal registrasi');
  }
});

/* ============  LOGIN  ============ */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).send('Email tidak ditemukan');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)  return res.status(401).send('Password salah');

    res.cookie('userId', user.id, { httpOnly: false, sameSite: 'lax' });
    res.cookie('user',   JSON.stringify({ name: user.name }), { httpOnly: false, sameSite: 'lax' });

    return res.redirect(req.query.next || '/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal login');
  }
});

/* ───────── helper & middleware ───────── */
function getUserFromCookie(req) {
  try {
    return JSON.parse(req.cookies.user ?? null);
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const usr = getUserFromCookie(req);
  if (!usr) return res.status(401).send('Unauthenticated');
  req.user = usr;
  next();
}

/* ============  PROFIL SINGKAT  ============ */
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);                // {name:"…"}
});

/* ============  LOGOUT  ============ */
router.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.clearCookie('userId');         // ← tambahan
  res.redirect('/');
});

export default router;
