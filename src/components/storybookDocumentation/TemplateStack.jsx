import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * TemplateBlock 컴포넌트
 *
 * 템플릿 블록 하나. 슬롯이 있으면 채운 색(secondary.main), 없으면 외곽선(고정 블록).
 *
 * Props:
 * @param {object} block - { label, slot?, from, line, tokenLabel? } [Required]
 */
function TemplateBlock({ block }) {
  const isSlot = Boolean(block.slot);
  return (
    <Box
      title={ block.line }
      sx={ {
        px: 1, py: 0.5, mb: 0.5,
        border: 1, borderColor: isSlot ? 'secondary.main' : 'divider',
        bgcolor: isSlot ? 'secondary.main' : 'transparent',
        color: isSlot ? 'secondary.contrastText' : 'text.primary',
      } }
    >
      <Stack direction="row" spacing={ 1 } alignItems="baseline" justifyContent="space-between">
        <Typography variant="caption" sx={ { fontWeight: isSlot ? 700 : 500 } }>
          { block.label }{ isSlot ? ' ' : '' }
          { isSlot && <Box component="span" sx={ { fontFamily: 'monospace' } }>{ block.slot }</Box> }
        </Typography>
        <Typography variant="caption" sx={ { fontSize: 10, opacity: 0.8, whiteSpace: 'nowrap' } }>
          { block.tokenLabel || block.from }
        </Typography>
      </Stack>
    </Box>
  );
}

/**
 * TemplateStack 컴포넌트
 *
 * 템플릿 한 벌: 입력 → 블록 스택 → 출력. 프롬프트 템플릿처럼 고정부와 슬롯이
 * 섞인 문서를 입력/블록/출력 3열로 보여준다.
 *
 * Props:
 * @param {string} title - 템플릿 이름 [Required]
 * @param {string} repeat - 반복 횟수 설명 [Required]
 * @param {string[]} inputs - 왼쪽 입력 목록 [Required]
 * @param {object[]} blocks - { label, slot?, from, line, tokenLabel? } 목록 [Required]
 * @param {string} outputSrc - 오른쪽 결과 이미지 [Optional]
 * @param {string} outputLabel - 결과 설명 [Required]
 * @param {string} outputBg - 결과 이미지 배경 토큰 [Optional, 기본값: 'background.default']
 *
 * Example usage:
 * <TemplateStack
 *   title="Sample 템플릿"
 *   repeat="× 1"
 *   inputs={ ['{subject}', '{format}'] }
 *   blocks={ toBlocks(lines, rules) }
 *   outputLabel="예시 출력"
 * />
 */
export function TemplateStack({ title, repeat, inputs, blocks, outputSrc, outputLabel, outputBg = 'background.default' }) {
  return (
    <Grid container spacing={ 2 } alignItems="stretch">
      <Grid size={ { xs: 12, md: 3 } }>
        <Typography variant="overline" color="text.secondary">입력</Typography>
        { inputs.map((text) => (
          <Typography key={ text } variant="caption" component="div" sx={ { fontFamily: 'monospace', py: 0.25 } }>
            { text }
          </Typography>
        )) }
      </Grid>
      <Grid size={ { xs: 12, md: outputSrc ? 6 : 9 } }>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
          <Typography variant="overline" color="text.secondary">{ title }</Typography>
          <Typography variant="caption" color="text.secondary">{ repeat }</Typography>
        </Stack>
        { blocks.map((block) => <TemplateBlock key={ block.line } block={ block } />) }
      </Grid>
      { outputSrc && (
        <Grid size={ { xs: 12, md: 3 } }>
          <Typography variant="overline" color="text.secondary">출력</Typography>
          <Box component="img" src={ outputSrc } alt={ outputLabel } sx={ { width: '100%', maxWidth: 160, aspectRatio: '3 / 4', objectFit: 'cover', bgcolor: outputBg, display: 'block' } } />
          <Typography variant="caption" color="text.secondary">{ outputLabel }</Typography>
        </Grid>
      ) }
    </Grid>
  );
}
