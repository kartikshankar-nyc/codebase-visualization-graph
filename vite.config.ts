
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      plugins: [
        {
          filter: /\.[tj]sx?$/,
          transform(code, id) {
            return code;
          },
        },
      ],
    }),
    {
      name: 'add-lovable-script',
      transformIndexHtml(html) {
        // Add the required Lovable script tag for the "Select" feature
        return html.replace(
          '<head>',
          `<head>
  <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>`
        );
      }
    },
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
