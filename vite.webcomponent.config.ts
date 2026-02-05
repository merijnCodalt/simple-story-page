import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Web Component build configuration
// Run: npx vite build --config vite.webcomponent.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/web-component.tsx"),
      name: "HeroSection",
      fileName: (format) => `hero-section.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // Bundle everything including React
      external: [],
      output: {
        globals: {},
      },
    },
    cssCodeSplit: false,
  },
});