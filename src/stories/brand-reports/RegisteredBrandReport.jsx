import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { BrandReportDocument } from '../../components/brand-documentation';
import { normalizeBrandReport } from '../../utils/brand-reports';
import { storybookPublicUrl } from './storybookPublicPath';

async function readJson(url, { isOptional = false } = {}) {
  const response = await fetch(url);

  if (isOptional && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${ response.status } ${ response.statusText } · ${ url }`);
  }

  return response.json();
}

/**
 * RegisteredBrandReport 컴포넌트
 *
 * Storybook의 정적 public 패키지를 불러와 공통 브랜드 문서 모델로 렌더링한다.
 *
 * Props:
 * @param {string} reportId - public/brand-reports 아래 등록된 리포트 ID [Required]
 *
 * Example usage:
 * <RegisteredBrandReport reportId="example-source-brand-analysis" />
 */
export function RegisteredBrandReport({ reportId }) {
  const [state, setState] = useState({
    report: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    const publicBaseUrl = storybookPublicUrl(`brand-reports/${ reportId }`);
    const publicBasePath = new URL(publicBaseUrl).pathname.replace(/\/$/, '');

    async function loadReport() {
      try {
        const [model, review, assetRegistry] = await Promise.all([
          readJson(`${ publicBaseUrl }/report.json`),
          readJson(`${ publicBaseUrl }/review.json`, { isOptional: true }),
          readJson(`${ publicBaseUrl }/asset-registry.json`, { isOptional: true }),
        ]);

        if (controller.signal.aborted) {
          return;
        }

        setState({
          report: normalizeBrandReport(model, {
            review,
            assetRegistry,
            publicBasePath,
          }),
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            report: null,
            error,
            isLoading: false,
          });
        }
      }
    }

    loadReport();

    return () => controller.abort();
  }, [reportId]);

  if (state.isLoading) {
    return (
      <Box
        sx={ {
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        } }
      >
        <CircularProgress size={ 22 } />
        <Typography variant="body2" color="text.secondary">
          브랜드 리포트를 불러오는 중입니다.
        </Typography>
      </Box>
    );
  }

  if (state.error) {
    return (
      <Box sx={ { p: { xs: 2, md: 4 } } }>
        <Alert severity="error">
          등록된 리포트를 읽지 못했습니다: { state.error.message }
        </Alert>
      </Box>
    );
  }

  return <BrandReportDocument report={ state.report } />;
}
