import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const githubPagesBase = "/Vedantchauhanportfolio/";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base:
    command === "build" && process.env.GITHUB_ACTIONS === "true"
      ? githubPagesBase
      : "/",
}));
