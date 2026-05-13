// Inline script injected in <head> before paint to avoid theme flash (FOUC).
// Reads localStorage 'theme', falls back to prefers-color-scheme, sets data-theme.
export function ThemeScript() {
  const code = `(function(){try{var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: light)').matches;var t=s||(p?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{__html: code}} />;
}
