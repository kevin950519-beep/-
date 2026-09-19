import { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { BrandTypographySpecimen } from './BrandTypographySpecimen.jsx';

const FONT_FILE_PATTERN = /\.(?:woff2?|ttf|otf)(?:[?#].*)?$/iu;

function asFontSource(source, index) {
  if (!source || typeof source !== 'object') return null;
  const url = String(source.url ?? source.sourceUrl ?? source.source_url ?? '').trim();
  if (!/^https?:\/\//iu.test(url)) return null;
  const family = String(source.family ?? source.fontFamily ?? source.font_family ?? '').trim();
  const sourceType = String(source.sourceType ?? source.source_type ?? '').trim();
  return {
    ...source,
    id: String(source.id ?? source.sourceId ?? source.source_id ?? `font-source-${ index + 1 }`),
    family,
    url,
    sourceType: sourceType || (FONT_FILE_PATTERN.test(url) ? 'font-file' : 'stylesheet'),
    format: String(source.format ?? '').trim(),
    weight: source.weight ?? source.weights ?? '100 900',
    style: String(source.style ?? 'normal').trim(),
  };
}

function fontFaceRule(source) {
  const format = source.format || source.url.match(/\.(woff2?|ttf|otf)(?:[?#].*)?$/iu)?.[1] || '';
  const formatClause = format ? ` format(${ JSON.stringify(format) })` : '';
  return [
    '@font-face {',
    `font-family: ${ JSON.stringify(source.family) };`,
    `src: url(${ JSON.stringify(source.url) })${ formatClause };`,
    `font-weight: ${ String(source.weight) };`,
    `font-style: ${ source.style };`,
    'font-display: swap;',
    '}',
  ].join(' ');
}

/**
 * Render a stack of observed source-brand typography specimens.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - Typography block with specimen `items`.
 */
export function BrandTypographySpecimens({ block }) {
  const items = Array.isArray(block.items)
    ? block.items
    : Array.isArray(block.specimens) ? block.specimens : [];
  const fontSources = useMemo(() => (
    (Array.isArray(block.fontSources) ? block.fontSources : [])
      .map(asFontSource)
      .filter(Boolean)
  ), [block.fontSources]);
  const [fontStatuses, setFontStatuses] = useState({});

  useEffect(() => {
    if (typeof document === 'undefined' || !fontSources.length) return undefined;

    const mountedNodes = [];
    let active = true;
    const updateStatus = (sourceId, status) => {
      if (!active) return;
      setFontStatuses((current) => ({ ...current, [sourceId]: status }));
    };

    fontSources.forEach((source) => {
      if (source.sourceType === 'font-file' && source.family) {
        const style = document.createElement('style');
        style.dataset.brandReportFontSrc = source.url;
        style.textContent = fontFaceRule(source);
        document.head.appendChild(style);
        mountedNodes.push(style);

        if (document.fonts?.load) {
          document.fonts.load(`1rem ${ JSON.stringify(source.family) }`)
            .then(() => updateStatus(source.id, 'loaded'))
            .catch(() => updateStatus(source.id, 'error'));
        } else {
          Promise.resolve().then(() => updateStatus(source.id, 'loaded'));
        }
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = source.url;
      link.dataset.brandReportFontSrc = source.url;
      link.addEventListener('load', () => {
        updateStatus(source.id, 'loaded');
      });
      link.addEventListener('error', () => {
        updateStatus(source.id, 'error');
      });
      document.head.appendChild(link);
      mountedNodes.push(link);
    });

    return () => {
      active = false;
      mountedNodes.forEach((node) => node.remove());
    };
  }, [fontSources]);

  return (
    <BrandBlockFrame title={ block.title } description={ block.description }>
      <Box
        sx={ {
          display: 'grid',
          gap: 1.5,
          p: { xs: 2, md: 2.5 },
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
        } }
      >
        <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' } }>
          <Typography variant="overline" sx={ { fontFamily: 'monospace', letterSpacing: '0.06em' } }>
            Documentation preview only
          </Typography>
          <Typography variant="caption" color="text.secondary">
            웹폰트는 아래 표본에만 사용되며 현재 프로젝트 typography/theme에는 적용되지 않습니다.
          </Typography>
        </Box>

        { fontSources.length ? (
          <Box sx={ { display: 'grid', gap: 1 } }>
            { fontSources.map((source) => (
              <Box
                key={ source.id }
                sx={ { display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minWidth: 0 } }
              >
                <Typography variant="caption" sx={ { fontWeight: 700 } }>
                  { source.family || source.id }
                </Typography>
                <Chip
                  size="small"
                  variant="outlined"
                  label={ fontStatuses[source.id] ?? 'pending' }
                  color={ fontStatuses[source.id] === 'error' ? 'error' : 'default' }
                  sx={ { height: 22, borderRadius: 0, fontFamily: 'monospace', fontSize: 10 } }
                />
                <Link
                  href={ source.url }
                  target="_blank"
                  rel="noreferrer"
                  variant="caption"
                  color="text.secondary"
                  sx={ { overflowWrap: 'anywhere' } }
                >
                  { source.label ?? source.sourceLabel ?? source.source_label ?? source.url }
                </Link>
                { (source.licenseNote || source.license_note) && (
                  <Typography variant="caption" color="text.secondary">
                    { source.licenseNote ?? source.license_note }
                  </Typography>
                ) }
              </Box>
            )) }
          </Box>
        ) : (
          <Typography variant="caption" color="text.secondary">
            { block.webfontGap || block.webfont_gap || 'Verified webfont source was not recorded.' }
          </Typography>
        ) }
      </Box>

      <Box sx={ { display: 'grid', gap: 2 } }>
        { items.map((item, itemIndex) => {
          const normalizedItem = typeof item === 'object' && item !== null
            ? item
            : { sample: String(item ?? '') };

          return (
            <BrandTypographySpecimen
              key={ normalizedItem.id ?? normalizedItem.label ?? normalizedItem.title ?? itemIndex }
              item={ normalizedItem }
              fontLoadStatus={ normalizedItem.fontSourceId
                ? fontStatuses[normalizedItem.fontSourceId]
                : undefined }
            />
          );
        }) }
      </Box>
    </BrandBlockFrame>
  );
}
