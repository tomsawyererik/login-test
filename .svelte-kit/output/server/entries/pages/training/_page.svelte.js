import { y as attr_class } from "../../../chunks/index2.js";
import "@supabase/ssr";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let selectedMode = "shooting";
    $$renderer2.push(`<div class="page-container svelte-d816z7"><h1 class="svelte-d816z7">Training session</h1> <div class="mode-toggle svelte-d816z7"><button${attr_class("mode-button svelte-d816z7", void 0, {
      "active": (
        // Reset selection and fetch exercises when mode changes
        selectedMode === "shooting"
      )
    })}>Shooting</button> <button${attr_class("mode-button svelte-d816z7", void 0, { "active": selectedMode === "pointing" })}>Pointing</button></div> <div class="exercises-section svelte-d816z7"><h2 class="section-header svelte-d816z7">1. Choose Exercise</h2> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p>Loading exercises...</p>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
