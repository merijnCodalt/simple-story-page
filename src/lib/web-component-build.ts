// Build configuration for exporting as web component
// To build the web component, run:
//   npx vite build --config vite.webcomponent.config.ts
//
// This will create:
//   dist/hero-section.es.js - ES module format
//   dist/hero-section.umd.js - UMD format (for script tags)

export const webComponentConfig = {
  entry: "src/web-component.tsx",
  name: "HeroSection",
  fileName: "hero-section",
};