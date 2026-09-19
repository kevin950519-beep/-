import { BrandCardGrid } from './BrandCardGrid.jsx';
import { BrandCodeBlock } from './BrandCodeBlock.jsx';
import { BrandColorTokenGuide } from './BrandColorTokenGuide.jsx';
import { BrandEvidenceGrid } from './BrandEvidenceGrid.jsx';
import { BrandListBlock } from './BrandListBlock.jsx';
import { BrandProseBlock } from './BrandProseBlock.jsx';
import { BrandTableBlock } from './BrandTableBlock.jsx';
import { BrandTypographySpecimens } from './BrandTypographySpecimens.jsx';
import { BrandVerbalHierarchy } from './BrandVerbalHierarchy.jsx';

/**
 * Select the pure-presentational component for a normalized report block.
 * Unknown types intentionally fall back to a JSON representation.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - Normalized report block.
 */
export function BrandBlockRenderer({ block }) {
  switch (block.type) {
    case 'paragraph':
    case 'paragraphs':
    case 'prose':
      return <BrandProseBlock block={ block } />;
    case 'list':
      return <BrandListBlock block={ block } />;
    case 'table':
      return <BrandTableBlock block={ block } />;
    case 'evidence':
    case 'evidence-grid':
      return <BrandEvidenceGrid block={ block } />;
    case 'card-grid':
    case 'key-value':
    case 'key-value-group':
      return <BrandCardGrid block={ block } />;
    case 'color-tokens':
    case 'color-token-guide':
      return <BrandColorTokenGuide block={ block } />;
    case 'typography':
    case 'typography-specimens':
      return <BrandTypographySpecimens block={ block } />;
    case 'verbal-brand-hierarchy':
    case 'verbal-hierarchy':
      return <BrandVerbalHierarchy block={ block } />;
    case 'code':
    case 'json':
      return <BrandCodeBlock block={ block } />;
    default:
      return <BrandCodeBlock block={ block } isFallback />;
  }
}
