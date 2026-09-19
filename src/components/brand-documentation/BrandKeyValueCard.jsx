import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BrandDocumentValue } from './BrandDocumentValue.jsx';

/**
 * Display one compact label/value record from a card-grid report block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.item - Record with label, value, and optional explanatory copy.
 */
export function BrandKeyValueCard({ item }) {
  const label = item.label ?? item.title ?? item.key;
  const value = item.value ?? item.body ?? item.text;

  return (
    <Box
      sx={ {
        display: 'grid',
        alignContent: 'start',
        gap: 1,
        minWidth: 0,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      } }
    >
      { item.eyebrow && (
        <Typography
          variant="overline"
          color="text.secondary"
          sx={ { fontFamily: 'monospace', lineHeight: 1.4, overflowWrap: 'anywhere' } }
        >
          { item.eyebrow }
        </Typography>
      ) }
      { label && (
        <Typography
          variant="subtitle2"
          sx={ { fontWeight: 700, lineHeight: 1.4, overflowWrap: 'anywhere' } }
        >
          { label }
        </Typography>
      ) }
      <Typography
        variant={ item.emphasis ? 'h6' : 'body2' }
        sx={ {
          fontWeight: item.emphasis ? 700 : 400,
          lineHeight: item.emphasis ? 1.35 : 1.65,
          whiteSpace: 'pre-line',
          overflowWrap: 'anywhere',
        } }
      >
        <BrandDocumentValue value={ value ?? item } />
      </Typography>
      { item.description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={ {
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            lineHeight: 1.55,
            overflowWrap: 'anywhere',
          } }
        >
          <BrandDocumentValue value={ item.description } />
        </Typography>
      ) }
    </Box>
  );
}
