// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app may break with duplicate plugins:
//   - TanStack devtools, tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// The Nitro preset is selected per hosting provider so the same project can
// continue using its existing Lovable/Vercel setup while deploying to Netlify.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const baseConfig = {
  tanstackStart: {
    // Keep the existing SSR error wrapper entry.
    server: { entry: "server" },
  },
};

export default defineConfig(
  process.env["NETLIFY"]
    ? { ...baseConfig, nitro: { preset: "netlify" } }
    : baseConfig,
);
