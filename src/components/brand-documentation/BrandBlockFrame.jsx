import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BrandDocumentValue } from './BrandDocumentValue.jsx';

/**
 * Shared frame for one report block. It provides technical-document spacing
 * and optional heading copy without adding elevation or decorative surfaces.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.title] - Optional block title.
 * @param {string} [props.description] - Optional block description.
 * @param {React.ReactNode} props.children - Block content.
 */
export function BrandBlockFrame({ title, description, children }) {
  return (
    <Box sx={ { display: 'grid', gap: 2, minWidth: 0 } }>
      { (title || description) && (
        <Box sx={ { display: 'grid', gap: 0.75, maxWidth: '68rem' } }>
          { title && (
            <Typography
              component="h3"
              variant="h6"
              sx={ {
                fontSize: 'clamp(1.35rem, 2vw, 2rem)',
                fontWeight: 750,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                textWrap: 'balance',
                overflowWrap: 'anywhere',
              } }
            >
              { title }
            </Typography>
          ) }
          { description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={ {
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                textWrap: 'pretty',
                overflowWrap: 'anywhere',
              } }
            >
              <BrandDocumentValue value={ description } />
            </Typography>
          ) }
        </Box>
      ) }
      { children }
    </Box>
  );
}
