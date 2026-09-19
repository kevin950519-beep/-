import { BrandReportDocument } from '../../components/brand-documentation';
import { REPORT_STRUCTURES } from '../../utils/brand-reports';

const STAGE_META = {
  source_brand_analysis: {
    title: 'Source Brand Analysis Template',
    brandName: 'Reference brand',
    stage: 'source_brand_analysis',
  },
  extended_brand_anatomy: {
    title: 'Extended Brand Anatomy Template',
    brandName: 'Working brand',
    stage: 'extended_brand_anatomy',
  },
  landing_materials: {
    title: 'Landing Materials Template',
    brandName: 'Working brand',
    stage: 'landing_materials',
  },
};

const templateFontSources = [
  {
    id: 'ibm-plex-sans',
    family: 'IBM Plex Sans',
    sourceType: 'stylesheet',
    url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap',
    licenseNote: 'SIL Open Font License · documentation preview only',
  },
];

const templateTypography = [
  ['display', 'Display', 'clamp(4rem, 9vw, 8rem)', 700, 0.92, '-0.05em'],
  ['h1', 'Heading 1', 'clamp(3rem, 6vw, 5.5rem)', 700, 0.98, '-0.04em'],
  ['h2', 'Heading 2', 'clamp(2.25rem, 4.5vw, 4rem)', 600, 1.05, '-0.03em'],
  ['h3', 'Heading 3', 'clamp(1.75rem, 3vw, 2.75rem)', 600, 1.12, '-0.02em'],
  ['body', 'Body', '1.0625rem', 400, 1.6, '0'],
  ['label', 'Label', '0.875rem', 600, 1.4, '0.02em'],
  ['caption', 'Caption', '0.75rem', 400, 1.5, '0.02em'],
].map(([role, label, fontSize, fontWeight, lineHeight, letterSpacing]) => ({
  id: `template-${ role }`,
  role,
  label,
  fontFamily: 'IBM Plex Sans',
  fontSourceId: 'ibm-plex-sans',
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  sample: role === 'body'
    ? 'Readable body copy keeps a useful measure while the evidence remains easy to scan.'
    : 'Design systems make decisions visible. 디자인 시스템은 결정을 보이게 합니다. 0123',
  valueStatus: 'documentation-preview',
}));

function templateTokenBlocks(artifactType) {
  const isSource = artifactType === 'source_brand_analysis';
  return [
    {
      type: 'color-token-guide',
      title: isSource ? 'Observed color token guide' : 'Directional color token guide',
      description: 'Color layer, value, role, and lineage remain visible without updating the active theme.',
      documentOnly: true,
      items: [
        { id: 'canvas', name: 'Canvas', value: '#F2EFE8', layer: 'identity', role: 'primary surface', status: isSource ? 'observed' : 'tune' },
        { id: 'ink', name: 'Ink', value: '#17212B', layer: 'identity', role: 'primary text', status: isSource ? 'observed' : 'keep' },
        { id: 'state', name: 'State', value: '#2F7D57', layer: 'interaction / status', role: 'confirmation only', status: isSource ? 'observed' : 'new' },
      ],
    },
    {
      type: 'typography-specimens',
      title: isSource ? 'Observed typography hierarchy' : 'Directional typography hierarchy',
      description: 'The linked research font applies only to these specimens. The project typography theme is unchanged.',
      documentOnly: true,
      fontSources: templateFontSources,
      items: templateTypography,
    },
  ];
}

function templateVerbalBlock(artifactType) {
  const status = artifactType === 'source_brand_analysis' ? 'observed' : 'directional';
  return {
    type: 'verbal-brand-hierarchy',
    title: 'Verbal brand hierarchy',
    description: 'Foundation and strategy lead into the core verbal platform, expression rules, and activation copy.',
    tiers: [
      {
        id: 'foundation',
        title: 'Brand foundation',
        description: 'Why the brand exists and the shortest internal idea it protects.',
        items: [
          { id: 'brand-purpose', label: 'Brand purpose', value: 'Make complex decisions easier to understand.', status },
          { id: 'brand-essence', label: 'Brand essence', value: 'Visible clarity.', status },
        ],
      },
      {
        id: 'strategy',
        title: 'Strategic definition',
        description: 'The chosen position and audience promise.',
        items: [
          { id: 'positioning', label: 'Positioning', value: 'A calm system for visible decisions.', status },
          { id: 'brand-promise', label: 'Brand promise', value: 'Clarity without unnecessary noise.', status },
        ],
      },
      {
        id: 'core-verbal-platform',
        title: 'Core verbal platform',
        description: 'The principles and message repeated most consistently.',
        items: [
          {
            id: 'core-values',
            label: 'Core brand values',
            entries: [
              { title: 'Clarity', description: 'Show the decision before decoration.', status },
              { title: 'Calm', description: 'Support attention without demanding it.', status },
            ],
          },
          { id: 'brand-message', label: 'Brand message', value: 'Make the decision visible.', status, emphasis: 'brand-message' },
        ],
      },
      {
        id: 'expression',
        title: 'Expression system',
        description: 'How the platform sounds in language.',
        items: [
          { id: 'voice-principles', label: 'Voice principles', value: ['Calm', 'Direct', 'Concrete'], status },
        ],
      },
      {
        id: 'activation',
        title: 'Activation and proof',
        description: 'How the platform descends into copy and action.',
        items: [
          { id: 'activation-principles', label: 'Activation principles', value: 'State one promise, show one proof, then offer one clear action.', status },
        ],
      },
    ],
  };
}

function createTemplateReport(artifactType) {
  const meta = STAGE_META[artifactType];
  return {
    meta: {
      ...meta,
      status: 'Template',
      version: '2.0.0',
      summary: '모든 브랜드 리포트는 이 고정 섹션 구조와 공용 React 문서 컴포넌트를 사용합니다.',
    },
    sections: REPORT_STRUCTURES[artifactType].map(([id, title], index) => {
      const isTokenSection = id === 'global-brand-system-framework' || id === 'design-token-direction';
      const isVerbalSection = id === 'verbal' || id === 'verbal-branding-and-copy-hierarchy';
      let blocks;
      if (isTokenSection) {
        blocks = templateTokenBlocks(artifactType);
      } else if (isVerbalSection) {
        blocks = [templateVerbalBlock(artifactType)];
      } else {
        blocks = [
          {
            type: 'prose',
            title: 'Fixed report slot',
            paragraphs: [
              `Section ID: ${id}`,
              '실제 리포트에서는 Stage 어댑터가 이 위치에 근거, 결정, 이미지 또는 구조화된 표를 배치합니다.',
            ],
          },
        ];
      }
      return {
        id,
        index: index + 1,
        label: `Stage ${String(Object.keys(STAGE_META).indexOf(artifactType) + 1).padStart(2, '0')}`,
        title,
        insight: `${title} 섹션은 정본 JSON의 승인된 내용만 표시합니다.`,
        blocks,
      };
    }),
    review: {
      status: 'template',
      prompt: '실제 리포트에서는 stage-review.json의 조정 질문이 여기에 표시됩니다.',
    },
  };
}

const sourceReport = createTemplateReport('source_brand_analysis');
const extendedReport = createTemplateReport('extended_brand_anatomy');
const landingReport = createTemplateReport('landing_materials');

export default {
  title: 'Brand Reports/Templates',
  component: BrandReportDocument,
  parameters: {
    layout: 'fullscreen',
  },
};

export const SourceBrandAnalysis = {
  render: () => <BrandReportDocument report={ sourceReport } />,
};

export const ExtendedBrandAnatomy = {
  render: () => <BrandReportDocument report={ extendedReport } />,
};

export const LandingMaterials = {
  render: () => <BrandReportDocument report={ landingReport } />,
};
