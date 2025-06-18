import { Router } from 'express';
import { MusicPref } from '../models/index.js';
import { getToken }  from '../utils/spotifyToken.js';

const router = Router();

/* form-taste → genre seed resmi */
const GENRE_MAP = {
  mellow:'sad', calm:'chill', dance:'dance', none:'acoustic',
  pop:'pop', nostalgic:'rainy-day', random:'indie',
  rock:'rock',
  alternative:'alternative', viral:'party', podcast:'talk'
};

/* ─ helper: jika seed_genres 404, cari 1 track & pakai seed_tracks ─ */
async function getTrackIdForGenre(token, genre) {
  const qs = new URLSearchParams({
    q: `genre:"${genre}"`, type:'track', market:'US', limit:1
  });
  const r  = await fetch('https://api.spotify.com/v1/search?' + qs,
               { headers:{ Authorization:`Bearer ${token}` } });
  const j  = await r.json();
  return j.tracks?.items?.[0]?.id ?? null;
}

router.get('/recs', async (req, res) => {
  try {
    /* 1. genre utama ----------------------------------------- */
    const mood   = req.query.mood || 'sad';
    const userId = req.cookies.userId;
    const pref   = userId
      ? await MusicPref.findOne({ where:{ userId, mood }})
      : null;

    const base   = GENRE_MAP[pref?.genre] || 'pop';   // fallback pop
    const token  = await getToken();

    /* 2. coba rekomendasi dgn seed_genres --------------------- */
    const qsA = new URLSearchParams({
      seed_genres : `${base},rock`,
      limit       : 10,
      market      : 'US'
    });
    let rsp = await fetch('https://api.spotify.com/v1/recommendations?' + qsA,
                          { headers:{ Authorization:`Bearer ${token}` } });

    /* 3. jika 404 -> cari track contoh lalu call seed_tracks -- */
    if (rsp.status === 404) {
      console.log(`seed_genres 404 – cari track contoh untuk "${base}"`);
      const trackId = await getTrackIdForGenre(token, base);
      if (!trackId) return res.status(404).send('no_track');

      const qsB = new URLSearchParams({
        seed_tracks : trackId,
        limit       : 10,
        market      : 'US'
      });
      rsp = await fetch('https://api.spotify.com/v1/recommendations?' + qsB,
                        { headers:{ Authorization:`Bearer ${token}` } });
    }

    if (!rsp.ok) {
      console.error('Spotify', rsp.status, await rsp.text());
      return res.status(502).send('spotify_error');
    }

    const { tracks } = await rsp.json();
    if (!tracks?.length) return res.status(404).send('no_track');

    const t = tracks[0];
    res.json({
      embed  : `https://open.spotify.com/embed/track/${t.id}?theme=0`,
      uri    : t.external_urls.spotify,
      name   : t.name,
      artist : t.artists[0].name,
      caption: `Musik ${base} menemani rasa ${mood} kamu.`
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('server_error');
  }
});

export default router;
