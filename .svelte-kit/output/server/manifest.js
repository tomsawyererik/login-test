export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BBPL8HHK.js",app:"_app/immutable/entry/app.CSoRSNzj.js",imports:["_app/immutable/entry/start.BBPL8HHK.js","_app/immutable/chunks/CyARlm8f.js","_app/immutable/chunks/DXRCqbTo.js","_app/immutable/chunks/DkZyUXcW.js","_app/immutable/entry/app.CSoRSNzj.js","_app/immutable/chunks/DXRCqbTo.js","_app/immutable/chunks/BHW0Qtbi.js","_app/immutable/chunks/OFRCU7Vd.js","_app/immutable/chunks/CWuD6kz4.js","_app/immutable/chunks/DkZyUXcW.js","_app/immutable/chunks/BGUX66UH.js","_app/immutable/chunks/J88NasHr.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/auth/auth-code-error",
				pattern: /^\/auth\/auth-code-error\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/auth/callback",
				pattern: /^\/auth\/callback\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/auth/callback/_server.ts.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
