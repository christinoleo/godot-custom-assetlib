// export const BASE_URL = 'http://localhost:8888';
// export const BASE_URL = 'https://qualityoflife.engagens.aknakos.me';
console.log(process.env.NODE_ENV)
export const BASE_URL = (process.env.NODE_ENV === 'development' ? 'http://localhost:80' : 'https://assetstore.godot.aknakos.me');
export const BACKEND_URL = BASE_URL + '/api/v1';
