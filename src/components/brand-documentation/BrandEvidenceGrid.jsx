import Box from '@mui/material/Box';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { BrandEvidenceCard } from './BrandEvidenceCard.jsx';

/**
 * Render evidence images in a provenance-aware responsive grid.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - Evidence block with `items` and optional `columns`.
 */
export function BrandEvidenceGrid({ block }) {
  const items = Array.isArray(block.items) ? block.items : [];
  const columns = Math.min(Math.max(Number(block.columns) || 3, 1), 4);

  return (
    <BrandBlockFrame title={ block.title } description={ block.description }>
      <Box
        sx={ {
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: `repeat(${ columns }, minmax(0, 1fr))`,
          },
          gap: 2,
        } }
      >
        { items.map((item, itemIndex) => {
          const normalizedItem = typeof item === 'object' && item !== null
            ? item
            : { caption: String(item ?? '') };

          return (
            <BrandEvidenceCard
              key={ normalizedItem.id ?? normalizedItem.src ?? itemIndex }
              item={ normalizedItem }
            />
          );
        }) }
      </Box>
    </BrandBlockFrame>
  );
}
