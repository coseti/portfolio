// Inline script injected in <head> before paint to set data-theme.
// Default is always 'dark'. Only respect user's manual choice from localStorage.
// (We deliberately ignore prefers-color-scheme so first-time visitors always
// see the brand's dark identity.)
export function ThemeScript() {
  const code = `(function(){try{var s=localStorage.getItem('theme');var t=s==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return <script dangerouslySetInnerHTML={{__html: code}} />;
}
