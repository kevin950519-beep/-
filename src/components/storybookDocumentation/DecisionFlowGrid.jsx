import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * FlowCell 컴포넌트
 *
 * 의사결정 흐름 격자의 셀 하나. 결정 라벨과 근거를 짧게 보여준다.
 * node 가 없으면 점선 빈 칸을 그린다.
 *
 * Props:
 * @param {object} node - { label, ref } 또는 null [Required]
 * @param {string} stripe - 스레드 색(왼쪽 띠) [Required]
 */
function FlowCell({ node, stripe }) {
  if (!node) {
    return <Box sx={ { minHeight: 56, border: 1, borderStyle: 'dashed', borderColor: 'divider', opacity: 0.5 } } />;
  }
  return (
    <Box sx={ { minHeight: 56, borderLeft: 4, borderColor: stripe, bgcolor: 'background.paper', px: 1, py: 0.75, boxShadow: 1 } }>
      <Typography variant="caption" component="div" sx={ { fontWeight: 600, lineHeight: 1.3 } }>{ node.label }</Typography>
      <Typography variant="caption" component="div" color="text.secondary" sx={ { fontFamily: 'monospace', fontSize: 10 } }>
        { node.ref }
      </Typography>
    </Box>
  );
}

/**
 * DecisionFlowGrid 컴포넌트
 *
 * 기획부터 결과물까지 의사결정이 전파되는 흐름을 CSS grid 로 보여준다.
 * 열은 단계(stages), 행은 결정 스레드(threads)다. 왼쪽 결정이 오른쪽 값이 된다.
 *
 * Props:
 * @param {object[]} stages - 격자 열. { key, label, doc } 목록 [Required]
 * @param {object[]} threads - 격자 행. { key, name, stripe?, nodes: [{ label, ref } | null] } 목록 [Required]
 * @param {string} caption - 격자 아래 설명 문구 [Optional]
 *
 * Example usage:
 * <DecisionFlowGrid
 *   stages={ [{ key: 'plan', label: '기획', doc: '01' }] }
 *   threads={ [{ key: 'color', name: '색', nodes: [{ label: '주조색', ref: '03 3.1절' }] }] }
 *   caption="점선 칸은 그 단계에 결정이 없다는 뜻"
 * />
 */
export function DecisionFlowGrid({ stages, threads, caption }) {
  return (
    <Box>
      <Box sx={ { overflowX: 'auto', mb: 1 } }>
        <Box
          sx={ {
            display: 'grid',
            gridTemplateColumns: `72px repeat(${ stages.length }, minmax(150px, 1fr))`,
            columnGap: 1,
            rowGap: 1,
            minWidth: 150 * stages.length + 72,
          } }
        >
          <Box />
          { stages.map((stage) => (
            <Box key={ stage.key } sx={ { borderBottom: 2, borderColor: 'primary.main', pb: 0.5 } }>
              <Typography variant="subtitle2">{ stage.label }</Typography>
              <Typography variant="caption" color="text.secondary" sx={ { fontFamily: 'monospace' } }>{ stage.doc }</Typography>
            </Box>
          )) }
          { threads.map((thread) => (
            <React.Fragment key={ thread.key }>
              <Box sx={ { display: 'flex', alignItems: 'center' } }>
                <Typography variant="subtitle2" sx={ { color: thread.stripe || 'primary.main' } }>
                  { thread.name }
                </Typography>
              </Box>
              { thread.nodes.map((node, index) => (
                <FlowCell key={ `${ thread.key }-${ stages[index].key }` } node={ node } stripe={ thread.stripe || 'primary.main' } />
              )) }
            </React.Fragment>
          )) }
        </Box>
      </Box>
      { caption && (
        <Typography variant="caption" color="text.secondary" component="div">
          { caption }
        </Typography>
      ) }
    </Box>
  );
}
