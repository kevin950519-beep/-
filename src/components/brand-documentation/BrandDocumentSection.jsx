import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BrandBlockRenderer } from './BrandBlockRenderer.jsx';
import { BrandDocumentValue } from './BrandDocumentValue.jsx';

/**
 * Render one numbered section and its normalized report blocks.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.section - Section with id, index, label, title, description, and blocks.
 */
export function BrandDocumentSection({ section }) {
  const headingId = `${ section.id }-title`;
  const blocks = Array.isArray(section.blocks) ? section.blocks : [];
  const insight = section.insight
    ?? section.keyInsight
    ?? section.key_insight
    ?? section.summary
    ?? section.description
    ?? 'Section insight pending.';
  const description = section.description === insight ? null : section.description;
  const sectionIndex = section.index !== null && section.index !== undefined
    ? String(section.index).padStart(2, '0')
    : null;

  return (
    <Box
      component="section"
      id={ section.id }
      aria-labelledby={ headingId }
      sx={ {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(10rem, 0.65fr) minmax(0, 2.35fr)' },
        borderTop: '1px solid',
        borderColor: 'divider',
        scrollMarginTop: 24,
      } }
    >
      <Box
        sx={ {
          display: 'grid',
          alignContent: 'start',
          gap: 1.5,
          p: { xs: '2.5rem 0 1.5rem', md: '4rem 2.5rem 4rem 0' },
          borderRight: { xs: 'none', md: '1px solid' },
          borderColor: 'divider',
        } }
      >
        { (sectionIndex || section.label) && (
          <Typography
            variant="overline"
            color="text.secondary"
            sx={ { fontFamily: 'monospace', lineHeight: 1.4, letterSpacing: '0.06em' } }
          >
            { [sectionIndex, section.label].filter(Boolean).join(' / ') }
          </Typography>
        ) }
        <Typography
          component="h2"
          id={ headingId }
          variant="h4"
          sx={ {
            fontSize: 'clamp(2rem, 3.6vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.035em',
            textWrap: 'balance',
            wordBreak: 'keep-all',
            overflowWrap: 'anywhere',
          } }
        >
          { section.title }
        </Typography>
        { description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={ {
              lineHeight: 1.65,
              whiteSpace: 'pre-line',
              textWrap: 'pretty',
              overflowWrap: 'anywhere',
            } }
          >
            <BrandDocumentValue value={ description } />
          </Typography>
        ) }
      </Box>

      <Box
        sx={ {
          display: 'grid',
          alignContent: 'start',
          gap: { xs: 4, md: 6 },
          minWidth: 0,
          py: { xs: 2.5, md: 4 },
          pl: { xs: 0, md: 4 },
        } }
      >
        <Box
          sx={ {
            display: 'grid',
            gap: 1,
            maxWidth: '72rem',
            pb: { xs: 2.5, md: 3 },
            borderBottom: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={ { fontFamily: 'monospace', lineHeight: 1.4, letterSpacing: '0.06em' } }
          >
            Key insight
          </Typography>
          <Typography
            variant="h5"
            sx={ {
              fontSize: 'clamp(1.35rem, 2.3vw, 2.25rem)',
              fontWeight: 650,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              textWrap: 'pretty',
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere',
            } }
          >
            <BrandDocumentValue value={ insight } />
          </Typography>
        </Box>
        { blocks.map((block, blockIndex) => (
          <BrandBlockRenderer key={ block.id ?? `${ block.type ?? 'block' }-${ blockIndex }` } block={ block } />
        )) }
        { blocks.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No content blocks registered.
          </Typography>
        ) }
      </Box>
    </Box>
  );
}
