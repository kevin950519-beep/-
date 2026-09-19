import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
} from '../../components/storybookDocumentation';
import { BrandReportCatalog } from './BrandReportCatalog';

export default {
  title: 'Brand Reports/Overview',
  parameters: {
    layout: 'padded',
  },
};

export const Docs = {
  render: () => (
    <>
      <DocumentTitle
        title="Brand Reports"
        status="Available"
        note="Modular Stage 1–3 brand documents"
        brandName="Design System"
        systemName="Liberation"
        version="1.0"
      />
      <PageContainer>
        <Typography
          variant="h4"
          sx={ { fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 750, lineHeight: 1, mb: 1 } }
        >
          브랜드 리포트 문서 시스템
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={ { mb: 4 } }>
          각 Stage의 정본 JSON을 공통 문서 컴포넌트로 변환해 Storybook에서 탐색합니다.
        </Typography>

        <SectionTitle
          title="등록된 리포트"
          description="레지스트리에 등록된 Stage 1–3 리포트 목록입니다."
        />
        <BrandReportCatalog />

        <SectionTitle
          title="디렉토리 규칙"
          description="정본과 Storybook 표시 계층을 분리합니다."
        />
        <TableContainer sx={ { width: '100%', minWidth: 0, overflowX: 'visible' } }>
          <Table size="small" sx={ { width: '100%', tableLayout: 'fixed' } }>
            <TableHead>
              <TableRow>
                <TableCell sx={ { fontWeight: 600 } }>Path</TableCell>
                <TableCell sx={ { fontWeight: 600 } }>Responsibility</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, overflowWrap: 'anywhere' } }>
                  src/components/brand-documentation/
                </TableCell>
                <TableCell>리포트 공통 순수 프레젠테이션 컴포넌트</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, overflowWrap: 'anywhere' } }>
                  src/utils/brand-reports/
                </TableCell>
                <TableCell>Stage별 JSON을 공통 문서 모델로 변환하는 어댑터</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, overflowWrap: 'anywhere' } }>
                  src/stories/brand-reports/
                </TableCell>
                <TableCell>정적 패키지 로더, 개요, 생성된 CSF 엔트리</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={ { fontFamily: 'monospace', fontSize: 12, overflowWrap: 'anywhere' } }>
                  public/brand-reports/
                </TableCell>
                <TableCell>Storybook이 제공하는 JSON·이미지 복사본과 레지스트리</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="등록 흐름"
          description="Stage 패키지를 수정한 뒤 검증하고 다시 등록합니다. 생성 파일은 직접 편집하지 않습니다."
        />
        <Typography
          component="pre"
          sx={ {
            p: 2,
            width: '100%',
            maxWidth: '100%',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            backgroundColor: 'grey.100',
            fontFamily: 'monospace',
            fontSize: 12,
          } }
        >
          { `pnpm finalize-brand-report -- <stage-package-directory>` }
        </Typography>
      </PageContainer>
    </>
  ),
};
