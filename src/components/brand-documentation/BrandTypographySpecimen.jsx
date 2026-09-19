import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { BrandDocumentValue } from './BrandDocumentValue.jsx';

/**
 * Display one source-brand typography specimen with its observed metadata.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.item - Specimen record with sample and typography properties.
 */
export function BrandTypographySpecimen({ item, fontLoadStatus }) {
  const fontSize = item.fontSize ?? item.size ?? 'clamp(1.75rem, 4vw, 3.5rem)';
  const meta = item.meta ?? [
    item.fontFamily,
    item.fontWeight ? `Weight ${ item.fontWeight }` : null,
    item.fontStyle,
    item.lineHeight ? `Leading ${ item.lineHeight }` : null,
  ].filter(Boolean).join(' · ');

  return (
    <Box sx={ { display: 'grid', gap: 2.5, p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider' } }>
      <Box sx={ { display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' } }>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' } }>
          <Typography variant="subtitle2" sx={ { fontWeight: 750, overflowWrap: 'anywhere' } }>
            { item.label ?? item.title ?? 'Typography specimen' }
          </Typography>
          { item.valueStatus && (
            <Chip
              size="small"
              variant="outlined"
              label={ item.valueStatus }
              sx={ { height: 24, borderRadius: 0, fontFamily: 'monospace', fontSize: 11 } }
            />
          ) }
          { fontLoadStatus && (
            <Chip
              size="small"
              variant="outlined"
              label={ `font ${ fontLoadStatus }` }
              color={ fontLoadStatus === 'error' ? 'error' : 'default' }
              sx={ { height: 24, borderRadius: 0, fontFamily: 'monospace', fontSize: 11 } }
            />
          ) }
        </Box>
        { meta && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={ {
              fontFamily: 'monospace',
              fontVariantNumeric: 'tabular-nums',
              overflowWrap: 'anywhere',
            } }
          >
            <BrandDocumentValue value={ meta } />
          </Typography>
        ) }
      </Box>
      <Typography
        component="p"
        sx={ {
          m: 0,
          fontFamily: item.fontFamily,
          fontSize,
          fontWeight: item.fontWeight,
          fontStyle: item.fontStyle,
          fontVariationSettings: item.fontVariationSettings,
          lineHeight: item.lineHeight ?? 1.15,
          letterSpacing: item.letterSpacing,
          color: item.color ?? 'text.primary',
          textTransform: item.textTransform,
          textWrap: item.role === 'body' ? 'pretty' : 'balance',
          wordBreak: 'keep-all',
          overflowWrap: 'anywhere',
          maxWidth: item.role === 'body' ? '68ch' : 'none',
        } }
      >
        { item.sample ?? item.text ?? 'Aa 가나 0123' }
      </Typography>
      { item.description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={ { lineHeight: 1.55, overflowWrap: 'anywhere' } }
        >
          <BrandDocumentValue value={ item.description } />
        </Typography>
      ) }
    </Box>
  );
}
