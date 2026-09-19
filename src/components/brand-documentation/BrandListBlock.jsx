import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { BrandDocumentValue } from './BrandDocumentValue.jsx';
import { formatDocumentValue } from './formatDocumentValue.js';

/**
 * Render ordered or unordered report findings.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - List block with `items` and optional `ordered` flag.
 */
export function BrandListBlock({ block }) {
  const items = Array.isArray(block.items) ? block.items : [];
  const listComponent = block.ordered ? 'ol' : 'ul';

  return (
    <BrandBlockFrame title={ block.title } description={ block.description }>
      <Box
        component={ listComponent }
        sx={ {
          display: 'grid',
          gap: 1.25,
          maxWidth: '68rem',
          m: 0,
          pl: 3,
          '& li::marker': { color: 'text.secondary', fontVariantNumeric: 'tabular-nums' },
        } }
      >
        { items.map((item, itemIndex) => {
          const isStructured = typeof item === 'object' && item !== null;
          const itemTitle = isStructured ? item.title ?? item.label : null;
          const itemBody = isStructured ? item.body ?? item.text ?? item.value : item;

          return (
            <Box
              component="li"
              key={ item?.id ?? `${ itemIndex }-${ formatDocumentValue(itemTitle ?? itemBody).slice(0, 24) }` }
              sx={ { minWidth: 0, overflowWrap: 'anywhere' } }
            >
              { itemTitle && (
                <Typography
                  component="span"
                  variant="body2"
                  sx={ { fontWeight: 700, mr: 0.75, overflowWrap: 'anywhere' } }
                >
                  <BrandDocumentValue value={ itemTitle } />
                </Typography>
              ) }
              <Typography
                component="span"
                variant="body2"
                sx={ {
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  textWrap: 'pretty',
                  overflowWrap: 'anywhere',
                } }
              >
                <BrandDocumentValue value={ itemBody ?? item } />
              </Typography>
            </Box>
          );
        }) }
      </Box>
    </BrandBlockFrame>
  );
}
