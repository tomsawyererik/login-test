

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/ranking-games/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.CjZDz3lB.js","_app/immutable/chunks/DXwTCEs2.js","_app/immutable/chunks/e8XAVhbW.js","_app/immutable/chunks/B3t_4XfY.js"];
export const stylesheets = ["_app/immutable/assets/8.D6euuFkY.css"];
export const fonts = [];
