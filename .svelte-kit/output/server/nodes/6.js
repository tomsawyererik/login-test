

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-clubs/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.6xtcbulX.js","_app/immutable/chunks/DXwTCEs2.js","_app/immutable/chunks/e8XAVhbW.js","_app/immutable/chunks/B3t_4XfY.js"];
export const stylesheets = ["_app/immutable/assets/6.B-YLRflw.css"];
export const fonts = [];
