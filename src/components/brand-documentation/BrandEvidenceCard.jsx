import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { BrandDocumentValue } from './BrandDocumentValue.jsx';
import { compactUrlLabel } from './formatSourceLink.js';

/**
 * Display one locally registered or public evidence image and its provenance.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.item - Evidence item with `src`, `alt`, and provenance fields.
 */
export function BrandEvidenceCard({ item }) {
  const provenance = item.provenance;
  const provenanceText = typeof provenance === 'object' && provenance !== null
    ? [provenance.sourceId, provenance.credit, provenance.filePath, provenance.capturedAt]
      .filter(Boolean)
      .join(' · ')
    : provenance;
  const sourceUrl = item.sourceUrl
    ?? (typeof provenance === 'object' && provenance !== null ? provenance.url : null);
  const hasDedicatedSourceLink = sourceUrl && provenanceText !== sourceUrl;

  return (
    <Box
      component="figure"
      sx={ {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        minWidth: 0,
        m: 0,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      } }
    >
      { item.src ? (
        <Box
          component="img"
          src={ item.src }
          alt={ item.alt ?? item.title ?? item.id ?? '' }
          loading="lazy"
          sx={ {
            display: 'block',
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            backgroundColor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
          } }
        />
      ) : (
        <Box
          sx={ {
            display: 'grid',
            placeItems: 'center',
            aspectRatio: item.aspectRatio ?? '4 / 3',
            px: 2,
            backgroundColor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
          } }
        >
          <Typography variant="caption" color="text.secondary">
            Image unavailable
          </Typography>
        </Box>
      ) }

      <Box
        component="figcaption"
        sx={ { display: 'grid', alignContent: 'start', gap: 0.75, minWidth: 0, p: 2 } }
      >
        { (item.id || item.role) && (
          <Typography
            variant="overline"
            color="text.secondary"
            sx={ {
              lineHeight: 1.4,
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              overflowWrap: 'anywhere',
            } }
          >
            { [item.id, item.role].filter(Boolean).join(' / ') }
          </Typography>
        ) }
        { item.title && (
          <Typography
            variant="subtitle2"
            sx={ { fontWeight: 700, lineHeight: 1.4, overflowWrap: 'anywhere' } }
          >
            { item.title }
          </Typography>
        ) }
        { (item.caption || item.description) && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={ { lineHeight: 1.55, overflowWrap: 'anywhere' } }
          >
            <BrandDocumentValue value={ item.caption ?? item.description } />
          </Typography>
        ) }
        { (provenanceText || hasDedicatedSourceLink) && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={ {
              pt: 0.75,
              borderTop: '1px solid',
              borderColor: 'divider',
              lineHeight: 1.5,
              overflowWrap: 'anywhere',
            } }
          >
            { provenanceText && <BrandDocumentValue value={ provenanceText } /> }
            { provenanceText && hasDedicatedSourceLink && ' · ' }
            { hasDedicatedSourceLink && (
              <Link href={ sourceUrl } target="_blank" rel="noreferrer" color="inherit" underline="always">
                { item.sourceLabel ?? compactUrlLabel(sourceUrl) }
              </Link>
            ) }
          </Typography>
        ) }
      </Box>
    </Box>
  );
}
