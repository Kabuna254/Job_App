import path from "path";
import react from "@vitejs/plugin-react-swc";  // Use -swc version if you're using it
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
