import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      proxy: {
        "/graphql": {
          target: env.GRAPHQL_TARGET || "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
  };
});
