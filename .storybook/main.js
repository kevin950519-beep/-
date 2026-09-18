import process from 'node:process';

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  /** 배포 빌드(`pnpm build`, SB_STATIC=0)에서는 public/ 을 스토리북 출력에 복사하지 않는다. 사이트 루트가 같은 경로를 제공한다 */
  "viteFinal": (config) => (process.env.SB_STATIC === '0' ? { ...config, publicDir: false } : config)
};
export default config;