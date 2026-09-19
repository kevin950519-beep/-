import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { storybookPublicUrl } from './storybookPublicPath';

/**
 * BrandReportCatalog 컴포넌트
 *
 * Props:
 * 별도 Props 없음. Storybook의 정적 브랜드 리포트 레지스트리를 읽는다.
 *
 * Example usage:
 * <BrandReportCatalog />
 */
export function BrandReportCatalog() {
  const [state, setState] = useState({
    reports: [],
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadRegistry() {
      try {
        const response = await fetch(storybookPublicUrl('brand-reports/registry.json'), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`${ response.status } ${ response.statusText }`);
        }

        const registry = await response.json();
        setState({
          reports: Array.isArray(registry.reports) ? registry.reports : [],
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({ reports: [], error, isLoading: false });
        }
      }
    }

    loadRegistry();

    return () => controller.abort();
  }, []);

  if (state.isLoading) {
    return (
      <Box sx={ { display: 'flex', alignItems: 'center', gap: 2, py: 3 } }>
        <CircularProgress size={ 20 } />
        <Typography variant="body2" color="text.secondary">
          레지스트리를 불러오는 중입니다.
        </Typography>
      </Box>
    );
  }

  if (state.error) {
    return <Alert severity="error">레지스트리를 읽지 못했습니다: { state.error.message }</Alert>;
  }

  if (state.reports.length === 0) {
    return (
      <Alert severity="info">
        아직 등록된 브랜드 리포트가 없습니다. `pnpm finalize-brand-report -- &lt;package&gt;`로 등록할 수 있습니다.
      </Alert>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={ { fontWeight: 600 } }>Brand</TableCell>
            <TableCell sx={ { fontWeight: 600 } }>Stage</TableCell>
            <TableCell sx={ { fontWeight: 600 } }>Report ID</TableCell>
            <TableCell sx={ { fontWeight: 600 } }>Schema</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { state.reports.map((report) => (
            <TableRow key={ report.id }>
              <TableCell>{ report.brand }</TableCell>
              <TableCell>{ report.stage_label }</TableCell>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                { report.id }
              </TableCell>
              <TableCell sx={ { fontFamily: 'monospace', fontSize: 12 } }>
                { report.schema_version }
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
