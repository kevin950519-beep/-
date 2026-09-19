import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BrandDocumentValue } from './BrandDocumentValue.jsx';

/**
 * Render the optional stage review checkpoint at the end of a brand report.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.review - Review record with status, prompt, feedback, and timestamp.
 */
export function BrandDocumentReview({ review }) {
  const metadata = [review.status, review.updatedAt].filter(Boolean).join(' / ');

  return (
    <Box
      component="aside"
      aria-label="Report review checkpoint"
      sx={ {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(10rem, 0.65fr) minmax(0, 2.35fr)' },
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      } }
    >
      <Box sx={ { p: { xs: '2rem 0 1rem', md: '3rem 2.5rem 3rem 0' } } }>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={ { fontFamily: 'monospace', letterSpacing: '0.06em' } }
        >
          Review checkpoint
        </Typography>
      </Box>
      <Box
        sx={ {
          display: 'grid',
          gap: 1.5,
          py: { xs: '0 2rem', md: 3 },
          pl: { xs: 0, md: 4 },
          borderLeft: { xs: 'none', md: '1px solid' },
          borderColor: 'divider',
        } }
      >
        { metadata && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={ { fontFamily: 'monospace', overflowWrap: 'anywhere' } }
          >
            <BrandDocumentValue value={ metadata } />
          </Typography>
        ) }
        { review.prompt && (
          <Typography
            variant="h6"
            sx={ {
              fontWeight: 700,
              lineHeight: 1.4,
              textWrap: 'balance',
              overflowWrap: 'anywhere',
            } }
          >
            <BrandDocumentValue value={ review.prompt } />
          </Typography>
        ) }
        { review.feedback && (
          <Typography
            variant="body2"
            sx={ { lineHeight: 1.65, whiteSpace: 'pre-line', overflowWrap: 'anywhere' } }
          >
            <BrandDocumentValue value={ review.feedback } />
          </Typography>
        ) }
      </Box>
    </Box>
  );
}
