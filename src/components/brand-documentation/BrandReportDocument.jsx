import Box from '@mui/material/Box';

import { PageContainer } from '../storybookDocumentation/index.js';
import { BrandDocumentHeader } from './BrandDocumentHeader.jsx';
import { BrandDocumentReview } from './BrandDocumentReview.jsx';
import { BrandDocumentSection } from './BrandDocumentSection.jsx';

/**
 * Compose a complete Stage 1, 2, or 3 brand report from a normalized model.
 * This component is presentational only and performs no fetching or state writes.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.report - Normalized report `{ meta, sections, review? }`.
 * @param {string|false} [props.maxWidth=false] - MUI Container max-width setting.
 */
export function BrandReportDocument({ report, maxWidth = false }) {
  const sections = Array.isArray(report.sections) ? report.sections : [];

  return (
    <PageContainer maxWidth={ maxWidth }>
      <Box
        component="article"
        sx={ {
          width: '100%',
          maxWidth: '112rem',
          minWidth: 0,
          mx: 'auto',
          '& h1, & h2, & h3, & h4, & h5, & h6, & p, & li, & td, & th, & figcaption, & a': {
            maxWidth: '100%',
            overflowWrap: 'anywhere',
          },
        } }
      >
        <BrandDocumentHeader meta={ report.meta } />
        { sections.map((section, sectionIndex) => (
          <BrandDocumentSection
            key={ section.id ?? sectionIndex }
            section={ {
              ...section,
              id: section.id ?? `section-${ sectionIndex + 1 }`,
              index: section.index ?? sectionIndex + 1,
            } }
          />
        )) }
        { report.review && <BrandDocumentReview review={ report.review } /> }
      </Box>
    </PageContainer>
  );
}
