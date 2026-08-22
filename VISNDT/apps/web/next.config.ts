import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@visndt/design-tokens", "@visndt/design-system", "@visndt/identity-contract"],
};

export default nextConfig;