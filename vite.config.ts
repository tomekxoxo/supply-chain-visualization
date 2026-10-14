import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    base:
      process.env.GITHUB_ACTIONS === "true"
        ? "/supply-chain-visualization/"
        : "/",
    plugins: [react()],
    server: {
      port: 3000,
    },
    resolve: {
      // Path aliases come from tsconfig.app.json.
      tsconfigPaths: true,
    },
  };
});
