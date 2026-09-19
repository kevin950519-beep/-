import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { BrandDocumentValue } from './BrandDocumentValue.jsx';
import { formatDocumentValue } from './formatDocumentValue.js';

/**
 * Render long-form prose from a report block.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - Prose block with `text`, `paragraphs`, `title`, and `description`.
 */
export function BrandProseBlock({ block }) {
  const rawParagraphs = block.paragraphs ?? block.text ?? block.content ?? [];
  const paragraphs = Array.isArray(rawParagraphs) ? rawParagraphs : [rawParagraphs];

  return (
    <BrandBlockFrame title={ block.title } description={ block.description }>
      <Box sx={ { display: 'grid', gap: 1.5, maxWidth: '68rem' } }>
        { paragraphs.map((paragraph, paragraphIndex) => {
          const text = typeof paragraph === 'object' && paragraph !== null
            ? paragraph.text ?? paragraph.body ?? paragraph.value ?? paragraph
            : paragraph;
          const isLead = typeof paragraph === 'object' && paragraph !== null && paragraph.lead;

          return (
            <Typography
              key={ paragraph?.id ?? `${ paragraphIndex }-${ formatDocumentValue(text).slice(0, 24) }` }
              variant={ isLead ? 'body1' : 'body2' }
              sx={ {
                fontWeight: isLead ? 600 : 400,
                lineHeight: isLead ? 1.65 : 1.75,
                whiteSpace: 'pre-line',
                textWrap: 'pretty',
                wordBreak: 'keep-all',
                overflowWrap: 'anywhere',
              } }
            >
              <BrandDocumentValue value={ text } />
            </Typography>
          );
        }) }
      </Box>
    </BrandBlockFrame>
  );
}
