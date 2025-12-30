

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/statistics/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.Bza0CUD-.js","_app/immutable/chunks/DXwTCEs2.js","_app/immutable/chunks/e8XAVhbW.js","_app/immutable/chunks/B3t_4XfY.js"];
export const stylesheets = ["_app/immutable/assets/9.BMNbUlwh.css"];
export const fonts = [];
