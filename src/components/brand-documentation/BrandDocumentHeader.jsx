import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BrandDocumentValue } from './BrandDocumentValue.jsx';

/**
 * Render report identity, title, summary, and delivery metadata.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.meta - Report metadata from the normalized report model.
 */
export function BrandDocumentHeader({ meta }) {
  const identity = meta.identity ?? {};
  const metadata = [
    ['Stage', meta.stage],
    ['Status', meta.status],
    ['Version', meta.version],
  ].filter(([, value]) => value !== null && value !== undefined && value !== '');

  return (
    <Box component="header" sx={ { border: '1px solid', borderColor: 'divider' } }>
      <Box
        sx={ {
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(12rem, 0.75fr) minmax(0, 2fr)' },
          minHeight: { xs: 'auto', md: '20rem' },
        } }
      >
        <Box
          sx={ {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '12rem', md: '100%' },
            p: { xs: 3, md: 5 },
            backgroundColor: identity.backgroundColor ?? 'primary.main',
            color: identity.foregroundColor ?? 'primary.contrastText',
            borderBottom: { xs: '1px solid', md: 'none' },
            borderRight: { xs: 'none', md: '1px solid' },
            borderColor: 'divider',
          } }
        >
          { identity.logoSrc ? (
            <Box
              component="img"
              src={ identity.logoSrc }
              alt={ identity.logoAlt ?? `${ meta.brandName ?? 'Brand' } logo` }
              sx={ {
                display: 'block',
                width: '100%',
                maxWidth: identity.logoMaxWidth ?? '18rem',
                maxHeight: identity.logoMaxHeight ?? '7rem',
                objectFit: 'contain',
              } }
            />
          ) : (
            <Typography
              variant="h4"
              sx={ { color: 'inherit', fontWeight: 800, lineHeight: 1, textAlign: 'center' } }
            >
              { meta.brandName ?? 'Brand report' }
            </Typography>
          ) }
        </Box>

        <Box sx={ { display: 'grid', alignContent: 'end', gap: 2, p: { xs: 3, md: 5 } } }>
          { meta.brandName && (
            <Typography
              variant="overline"
              color="text.secondary"
              sx={ { fontFamily: 'monospace', letterSpacing: '0.08em' } }
            >
              { meta.brandName }
            </Typography>
          ) }
          <Typography
            component="h1"
            variant="h2"
            sx={ {
              maxWidth: '15ch',
              fontSize: 'clamp(3rem, 7vw, 7rem)',
              fontWeight: 800,
              lineHeight: 0.94,
              letterSpacing: '-0.045em',
              textWrap: 'balance',
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere',
            } }
          >
            { meta.title }
          </Typography>
          { meta.summary && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={ {
                maxWidth: '60rem',
                lineHeight: 1.65,
                whiteSpace: 'pre-line',
                textWrap: 'pretty',
                overflowWrap: 'anywhere',
              } }
            >
              <BrandDocumentValue value={ meta.summary } />
            </Typography>
          ) }
        </Box>
      </Box>

      { metadata.length > 0 && (
        <Box
          sx={ {
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: `repeat(${ metadata.length }, minmax(0, 1fr))` },
            borderTop: '1px solid',
            borderColor: 'divider',
          } }
        >
          { metadata.map(([label, value], metadataIndex) => (
            <Box
              key={ label }
              sx={ {
                display: 'grid',
                gap: 0.5,
                px: 2,
                py: 1.5,
                borderRight: {
                  xs: 'none',
                  sm: metadataIndex === metadata.length - 1 ? 'none' : '1px solid',
                },
                borderBottom: {
                  xs: metadataIndex === metadata.length - 1 ? 'none' : '1px solid',
                  sm: 'none',
                },
                borderColor: 'divider',
              } }
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={ { fontFamily: 'monospace', lineHeight: 1.3 } }
              >
                { label }
              </Typography>
              <Typography variant="body2" sx={ { fontWeight: 700, overflowWrap: 'anywhere' } }>
                <BrandDocumentValue value={ value } />
              </Typography>
            </Box>
          )) }
        </Box>
      ) }
    </Box>
  );
}
