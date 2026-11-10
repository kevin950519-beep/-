import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { defaultTheme } from '../src/styles/themes';
import '../src/fonts.css';

// Google Fonts 로드 (Material Symbols + 기본 폰트)
const googleFonts = [
  // Material Symbols
  'Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  // Default Theme Font
  'Outfit:wght@300;400;500;600;700;800;900',
  // 우연한 마중: 한글 명조 (03 3.2)
  'Noto+Serif+KR:wght@400;500',
];

googleFonts.forEach((font) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
  document.head.appendChild(link);
});

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Overview',
          'Style',
          ['Overview', 'Colors', 'Typography', 'Icons', 'Spacing', 'Component Tokens'],
          'Component',
          [
            '1. Typography',
            '2. Container',
            '3. Card',
            '4. Media',
            '5. Data Display',
            '6. In-page Navigation',
            '7. Input & Control',
            '8. Layout',
            '9. Overlay & Feedback',
            '10. Navigation',
          ],
          'Interactive',
          ['12. Scroll'],
          'Common',
          // 프로젝트 카테고리 (storybook-writing.md 카테고리 표와 같은 이름 집합)
          'Custom Component',
          'Section',
          'Template',
          'Page',
          'Test Data',
        ],
        method: 'alphabetical',
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <div style={{ width: '100%', paddingTop: context.parameters.layout === 'fullscreen' ? 0 : '40px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
