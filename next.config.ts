import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Niente AGENTS.md generato da `next dev` quando rileva un assistente AI.
  agentRules: false,
};

export default nextConfig;
