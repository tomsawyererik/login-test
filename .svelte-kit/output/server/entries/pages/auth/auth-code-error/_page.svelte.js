import "clsx";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="error-container svelte-1rc76hf"><div class="error-card svelte-1rc76hf"><h1 class="svelte-1rc76hf">Authentication Error</h1> <p class="svelte-1rc76hf">There was an error authenticating your request. Please try again.</p> <button class="btn svelte-1rc76hf">Go to Login</button></div></div>`);
  });
}
export {
  _page as default
};
