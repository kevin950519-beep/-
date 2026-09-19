import Box from '@mui/material/Box';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { BrandKeyValueCard } from './BrandKeyValueCard.jsx';

/**
 * Render key-value groups and compact findings as a responsive card grid.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - Card-grid block with `items` and optional `columns`.
 */
export function BrandCardGrid({ block }) {
  const entries = block.items ?? block.entries ?? block.values ?? [];
  const items = Array.isArray(entries)
    ? entries
    : Object.entries(entries).map(([label, value]) => ({ label, value }));
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
            : { value: item };

          return (
            <BrandKeyValueCard
              key={ normalizedItem.id ?? normalizedItem.label ?? normalizedItem.key ?? itemIndex }
              item={ normalizedItem }
            />
          );
        }) }
      </Box>
    </BrandBlockFrame>
  );
}
