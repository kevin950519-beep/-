import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
  DecisionFlowGrid,
  TemplateStack,
  extractBlock,
  toBlocks,
} from '../../components/storybookDocumentation';
import defaultTheme from '../../styles/themes/default.js';
import promptTemplateRaw from '../../../docs/sample/prompt-template.md?raw';

export default {
  title: 'Overview/Concept & Flow Template',
  parameters: {
    layout: 'padded',
  },
};

const PAL = defaultTheme.palette;

/**
 * 의사결정 흐름 격자의 열. 기획부터 결과물까지 자기 프로젝트의 단계 이름으로 바꿔 쓴다.
 */
const STAGES = [
  { key: 'plan', label: '기획', doc: '01' },
  { key: 'ux', label: 'UX', doc: '02' },
  { key: 'visual', label: '비주얼 디렉션', doc: '03' },
  { key: 'token', label: 'theme 토큰', doc: 'default.js' },
  { key: 'prompt', label: '프롬프트', doc: 'prompt-template.md' },
  { key: 'image', label: '결과', doc: 'src/assets' },
];

/**
 * 의사결정 흐름 격자의 행. 예시 축 3개는 키트 자신의 theme 에 실제로 있는 값만 썼다.
 * 근거 절(01 1절 등)은 자기 프로젝트 문서의 절 번호로 바꿔 쓰는 자리 표시자다.
 */
const FLOW_THREADS = [
  {
    key: 'color', name: '색 팔레트', stripe: PAL.primary.main,
    nodes: [
      { label: '주조색은 하나, 나머지는 무채색', ref: '01 1절' },
      { label: '악센트는 CTA에만 사용', ref: '02 3.1절' },
      { label: '브랜드 블루 단일 악센트', ref: '03 3.1절' },
      { label: 'palette.primary.main', ref: PAL.primary.main },
      { label: 'Accent: {primary.main}', ref: '프롬프트 문장' },
      null,
    ],
  },
  {
    key: 'shape', name: '형태 · 모서리', stripe: PAL.secondary.main,
    nodes: [
      { label: '절제된 기하학적 인상', ref: '01 2절' },
      null,
      { label: '날카로운 모서리, 장식 없음', ref: '03 3.2절' },
      { label: 'shape.borderRadius', ref: String(defaultTheme.shape.borderRadius) },
      { label: 'Shape: borderRadius 0', ref: '프롬프트 문장' },
      null,
    ],
  },
  {
    key: 'spacing', name: '간격', stripe: PAL.grey[500],
    nodes: [
      { label: '8의 배수로 여백을 통일', ref: '01 2절' },
      { label: '컴포넌트 사이 최소 간격', ref: '02 4절' },
      { label: '8px 기준 spacing 스케일', ref: '03 3.3절' },
      { label: 'theme.spacing 기본 단위', ref: `${ defaultTheme.spacing(1) }` },
      null,
      null,
    ],
  },
];

/** prompt-template.md 원문에서 코드 블록 줄과 라벨을 맞추는 규칙. 슬롯 2개({subject}, {format})만 채운 블록 */
const SAMPLE_BLOCKS = [
  { test: /^A minimalist \{subject\}/, label: '제품 선언', slot: '{subject}', from: '기획 문서의 대상 정의' },
  { test: /^Background:/, label: '배경 #FFFFFF', from: '03 3.1절 Wall Tint' },
  { test: /^Accent:/, label: '악센트', tokenLabel: `palette.primary.main ${ PAL.primary.main }`, from: '' },
  { test: /^Composition:/, label: '구도', slot: '{format}', from: '02 UX 흐름의 화면 비율' },
  { test: /^Shape:/, label: '모서리', tokenLabel: `shape.borderRadius ${ defaultTheme.shape.borderRadius }`, from: '' },
  { test: /^Style:/, label: '스타일 선언', from: '03 3.2절 무드' },
  { test: /^No environment/, label: '네거티브', from: '03 3.2절 하지 않는 것' },
];

const SAMPLE_LINES = extractBlock(promptTemplateRaw, '## Sample Template');

export const Default = {
  render: () => (
    <>
      <DocumentTitle
        title="Concept & Flow Template"
        status="Available"
        note="예시: 이 스토리의 데이터는 키트 자체 theme 값과 자리 표시자 문서 절이다. 각 프로젝트에서 실제 값으로 바꿔 쓴다"
        brandName="Design System"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          컨셉과 재료 흐름 템플릿(예시)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 4 } }>
          기획, UX, 비주얼 디렉션, theme 토큰, 프롬프트, 결과로 이어지는 의사결정 흐름을 도식으로 그리는 방법을 보여준다.
          아래 표와 격자는 예시 데이터로, 자기 프로젝트의 문서 절과 theme 값으로 바꿔 채운다.
        </Typography>

        <SectionTitle
          title="의사결정 흐름 격자(예시)"
          description="왼쪽 결정이 오른쪽 값이 된다. 근거 절은 자기 프로젝트 문서의 절 번호로 바꿔 쓴다"
        />
        <DecisionFlowGrid
          stages={ STAGES }
          threads={ FLOW_THREADS }
          caption="점선 칸은 그 단계에 결정이 없다는 뜻. 토큰 값은 src/styles/themes/default.js 에서 읽는다."
        />

        <SectionTitle
          title="템플릿 구성(예시)"
          description="docs/sample/prompt-template.md 원문을 블록으로 나눴다. 외곽선 블록은 고정부, 채운 블록은 슬롯"
        />
        <Box sx={ { mb: 2 } }>
          <TemplateStack
            title="Sample 템플릿"
            repeat="예시 1개"
            inputs={ [
              '기획 문서: 대상 정의 → {subject}',
              'UX 문서: 화면 비율 → {format}',
            ] }
            blocks={ toBlocks(SAMPLE_LINES, SAMPLE_BLOCKS) }
            outputLabel="이 예시에는 결과 이미지가 없다"
          />
        </Box>
        <Stack direction="row" spacing={ 2 } sx={ { mb: 2 } }>
          <Chip size="small" variant="outlined" label="고정 블록: 항상 같음" />
          <Chip size="small" color="secondary" label="슬롯: 값마다 바뀜" />
        </Stack>

        <Typography variant="caption" color="text.secondary">
          이 페이지는 예시다. 격자의 토큰 값은 src/styles/themes/default.js 에서 그대로 읽었지만,
          근거 절(01, 02, 03 n절)은 실제 문서가 없는 자리 표시자다.
        </Typography>
      </PageContainer>
    </>
  ),
};
