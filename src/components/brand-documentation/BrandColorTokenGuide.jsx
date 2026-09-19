import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { BrandDocumentValue } from './BrandDocumentValue.jsx';

const RENDERABLE_COLOR = /^(?:#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|(?:ok)?lch\([^)]*\)|lab\([^)]*\)|color\([^)]*\)|[a-z]+)$/iu;

function isRenderableColor(value) {
  return typeof value === 'string' && RENDERABLE_COLOR.test(value.trim());
}

function readableTextColor(value, theme) {
  const hex = typeof value === 'string' ? value.trim().match(/^#([0-9a-f]{6})$/iu)?.[1] : null;
  if (!hex) return theme.palette.text.primary;
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  const luminance = channels.reduce((total, channel, index) => (
    total + channel * [0.299, 0.587, 0.114][index]
  ), 0);
  return luminance > 150 ? theme.palette.common.black : theme.palette.common.white;
}

/**
 * Render observed or directional brand colors as documentation-only swatches.
 * Values are never written into the active MUI theme.
 */
export function BrandColorTokenGuide({ block }) {
  const theme = useTheme();
  const items = Array.isArray(block.items) ? block.items : [];

  return (
    <BrandBlockFrame title={ block.title } description={ block.description }>
      { block.documentOnly !== false && (
        <Box
          sx={ {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            py: 1.5,
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Typography variant="overline" sx={ { fontFamily: 'monospace', letterSpacing: '0.06em' } }>
            Documentation preview only
          </Typography>
          <Typography variant="caption" color="text.secondary">
            현재 프로젝트의 palette 또는 디자인 토큰에는 적용되지 않습니다.
          </Typography>
        </Box>
      ) }

      <Box
        sx={ {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 15rem), 1fr))',
          gap: 2,
        } }
      >
        { items.map((item, itemIndex) => {
          const value = String(item.value ?? '').trim();
          const canRender = isRenderableColor(value);
          const foreground = canRender
            ? readableTextColor(value, theme)
            : theme.palette.text.secondary;

          return (
            <Box
              key={ item.id ?? item.name ?? item.role ?? itemIndex }
              sx={ {
                display: 'grid',
                gridTemplateRows: '10rem 1fr',
                minWidth: 0,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              } }
            >
              <Box
                aria-label={ `${ item.name ?? item.role ?? 'Color' } ${ value || 'value unavailable' }` }
                sx={ {
                  display: 'grid',
                  alignContent: 'space-between',
                  gap: 2,
                  p: 2,
                  color: foreground,
                  backgroundColor: canRender ? value : 'grey.100',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                } }
              >
                <Typography
                  variant="overline"
                  sx={ { color: 'inherit', fontFamily: 'monospace', letterSpacing: '0.06em' } }
                >
                  { item.layer ?? item.colorLayer ?? 'Unclassified layer' }
                </Typography>
                <Typography
                  sx={ {
                    color: 'inherit',
                    fontFamily: 'monospace',
                    fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    overflowWrap: 'anywhere',
                  } }
                >
                  { value || 'Value not recorded' }
                </Typography>
              </Box>

              <Box sx={ { display: 'grid', alignContent: 'start', gap: 1.25, p: 2 } }>
                <Box sx={ { display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' } }>
                  <Typography variant="subtitle2" sx={ { fontWeight: 750, overflowWrap: 'anywhere' } }>
                    { item.name ?? item.role ?? `Color ${ itemIndex + 1 }` }
                  </Typography>
                  { (item.relationship || item.status) && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={ item.relationship ?? item.status }
                      sx={ { height: 24, borderRadius: 0, fontFamily: 'monospace', fontSize: 11 } }
                    />
                  ) }
                </Box>
                { item.role && item.role !== item.name && (
                  <Typography variant="body2" sx={ { lineHeight: 1.55 } }>
                    <BrandDocumentValue value={ item.role } />
                  </Typography>
                ) }
                { item.description && (
                  <Typography variant="caption" color="text.secondary" sx={ { lineHeight: 1.55 } }>
                    <BrandDocumentValue value={ item.description } />
                  </Typography>
                ) }
                { (item.evidence || item.scope || item.sourceBasis) && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={ { pt: 1, borderTop: '1px solid', borderColor: 'divider', lineHeight: 1.5 } }
                  >
                    <BrandDocumentValue value={ item.evidence ?? item.scope ?? item.sourceBasis } />
                  </Typography>
                ) }
              </Box>
            </Box>
          );
        }) }
      </Box>
    </BrandBlockFrame>
  );
}
