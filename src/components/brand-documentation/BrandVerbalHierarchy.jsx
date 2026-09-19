import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { BrandDocumentValue } from './BrandDocumentValue.jsx';

function HierarchyItem({ item }) {
  const isBrandMessage = item.emphasis === 'brand-message';
  const entries = Array.isArray(item.entries) ? item.entries : [];

  return (
    <Box
      sx={ {
        display: 'grid',
        gap: 1.25,
        minWidth: 0,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      } }
    >
      <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' } }>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={ { fontFamily: 'monospace', letterSpacing: '0.06em', lineHeight: 1.4 } }
        >
          { item.label }
        </Typography>
        { item.status && (
          <Chip
            size="small"
            variant="outlined"
            label={ item.status }
            sx={ { height: 24, borderRadius: 0, fontFamily: 'monospace', fontSize: 11 } }
          />
        ) }
      </Box>

      { item.value && (
        <Typography
          component="p"
          variant={ isBrandMessage ? 'h3' : 'h6' }
          sx={ {
            m: 0,
            maxWidth: isBrandMessage ? '20ch' : '62ch',
            fontSize: isBrandMessage ? 'clamp(2.25rem, 5vw, 4.75rem)' : undefined,
            fontWeight: isBrandMessage ? 750 : 650,
            lineHeight: isBrandMessage ? 0.98 : 1.35,
            letterSpacing: isBrandMessage ? '-0.045em' : '-0.015em',
            textWrap: 'balance',
            wordBreak: 'keep-all',
            overflowWrap: 'anywhere',
          } }
        >
          <BrandDocumentValue value={ item.value } />
        </Typography>
      ) }

      { entries.length > 0 && (
        <Box
          sx={ {
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
            columnGap: 3,
            rowGap: 2,
          } }
        >
          { entries.map((entry, index) => (
            <Box key={ entry.id ?? entry.title ?? index } sx={ { display: 'grid', alignContent: 'start', gap: 0.5 } }>
              <Typography variant="subtitle1" sx={ { fontWeight: 750, lineHeight: 1.3 } }>
                <BrandDocumentValue value={ entry.title ?? `Value ${ index + 1 }` } />
              </Typography>
              { entry.description && (
                <Typography variant="body2" sx={ { maxWidth: '48ch', lineHeight: 1.6, textWrap: 'pretty' } }>
                  <BrandDocumentValue value={ entry.description } />
                </Typography>
              ) }
              { entry.status && (
                <Typography variant="caption" color="text.secondary" sx={ { fontFamily: 'monospace' } }>
                  { entry.status }
                </Typography>
              ) }
            </Box>
          )) }
        </Box>
      ) }

      { item.description && (
        <Typography variant="body2" color="text.secondary" sx={ { maxWidth: '68ch', lineHeight: 1.6, textWrap: 'pretty' } }>
          <BrandDocumentValue value={ item.description } />
        </Typography>
      ) }
      { item.evidence && (
        <Typography variant="caption" color="text.secondary" sx={ { fontFamily: 'monospace', lineHeight: 1.5 } }>
          <BrandDocumentValue value={ item.evidence } />
        </Typography>
      ) }
    </Box>
  );
}

/** Render the strategic-to-activation hierarchy of a verbal brand system. */
export function BrandVerbalHierarchy({ block }) {
  const tiers = Array.isArray(block.tiers) ? block.tiers : [];

  return (
    <BrandBlockFrame title={ block.title } description={ block.description }>
      <Box sx={ { borderTop: '1px solid', borderColor: 'text.primary' } }>
        { tiers.map((tier, tierIndex) => (
          <Box
            component="section"
            key={ tier.id ?? tier.title ?? tierIndex }
            sx={ {
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '11rem minmax(0, 1fr)' },
              gap: { xs: 1, md: 4 },
              py: { xs: 2.5, md: 3.5 },
              borderBottom: '1px solid',
              borderColor: 'divider',
            } }
          >
            <Box sx={ { display: 'grid', alignContent: 'start', gap: 0.5 } }>
              <Typography variant="overline" color="text.secondary" sx={ { fontFamily: 'monospace' } }>
                Tier { String(tierIndex + 1).padStart(2, '0') }
              </Typography>
              <Typography component="h4" variant="subtitle1" sx={ { fontWeight: 750, lineHeight: 1.3 } }>
                { tier.title }
              </Typography>
              { tier.description && (
                <Typography variant="caption" color="text.secondary" sx={ { lineHeight: 1.5 } }>
                  { tier.description }
                </Typography>
              ) }
            </Box>
            <Box sx={ { display: 'grid', minWidth: 0 } }>
              { (tier.items ?? []).map((item, itemIndex) => (
                <HierarchyItem key={ item.id ?? item.label ?? itemIndex } item={ item } />
              )) }
            </Box>
          </Box>
        )) }
      </Box>
    </BrandBlockFrame>
  );
}
