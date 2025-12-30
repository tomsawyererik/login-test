

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BNOTS6Iy.js","_app/immutable/chunks/DXwTCEs2.js","_app/immutable/chunks/e8XAVhbW.js","_app/immutable/chunks/B3t_4XfY.js"];
export const stylesheets = ["_app/immutable/assets/5.B0HnssPN.css"];
export const fonts = [];
