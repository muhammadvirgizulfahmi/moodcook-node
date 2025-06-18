// src/utils/spotifyToken.js
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET)
  throw new Error('Isi SPOTIFY_CLIENT_ID & SPOTIFY_CLIENT_SECRET di .env');

let cache = { token: null, exp: 0 };

export async function getToken() {
  // gunakan token cache sampai 30 dtk sebelum kedaluwarsa
  const now = Date.now() / 1000;
  if (cache.token && now < cache.exp) return cache.token;

  const id  = process.env.SPOTIFY_CLIENT_ID?.trim();
  const sec = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  if (!id || !sec) throw new Error('Env SPOTIFY_CLIENT_ID / SECRET kosong');

  const auth = Buffer.from(`${id}:${sec}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method : 'POST',
    headers: {
      Authorization : `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body   : new URLSearchParams({ grant_type: 'client_credentials' })
  });

  if (!res.ok) {
    console.error('Spotify auth', res.status, await res.text());
    throw new Error('spotify_auth_fail');
  }

  const { access_token, expires_in } = await res.json();
  cache = { token: access_token, exp: now + expires_in - 30 };
  return access_token;
}




// console.log('CID', process.env.SPOTIFY_CLIENT_ID?.slice(0,6));
// console.log('CSEC', process.env.SPOTIFY_CLIENT_SECRET?.slice(0,6));

