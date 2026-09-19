import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { formatDocumentValue } from './formatDocumentValue.js';

/**
 * Render code, JSON, or an unsupported report block as readable source text.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - Code-like block with `code`, `data`, or `value`.
 * @param {boolean} [props.isFallback=false] - Whether the block represents an unknown type.
 */
export function BrandCodeBlock({ block, isFallback = false }) {
  const value = block.code ?? block.data ?? block.value ?? (isFallback ? block : '');
  const text = typeof value === 'string' ? value : formatDocumentValue(value);
  const fallbackTitle = isFallback ? `Unsupported block: ${ block.type ?? 'unknown' }` : undefined;

  return (
    <BrandBlockFrame title={ block.title ?? fallbackTitle } description={ block.description }>
      <Box
        component="pre"
        sx={ {
          m: 0,
          p: 2,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'grey.50',
          color: 'text.primary',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          lineHeight: 1.65,
          tabSize: 2,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        } }
      >
        { block.language && (
          <Typography
            component="span"
            variant="overline"
            color="text.secondary"
            sx={ { display: 'block', mb: 1, fontFamily: 'monospace', lineHeight: 1.4 } }
          >
            { block.language }
          </Typography>
        ) }
        { text }
      </Box>
    </BrandBlockFrame>
  );
}
