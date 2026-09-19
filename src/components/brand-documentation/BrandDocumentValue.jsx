import Link from '@mui/material/Link';
import { Fragment } from 'react';

import { formatDocumentValue } from './formatDocumentValue.js';
import { compactUrlLabel } from './formatSourceLink.js';

const URL_PATTERN = /https?:\/\/[^\s]+/giu;
const TRAILING_PUNCTUATION = /[),.;:!?\]}]+$/u;

function splitTrailingPunctuation(value) {
  const punctuation = value.match(TRAILING_PUNCTUATION)?.[0] ?? '';
  return {
    url: punctuation ? value.slice(0, -punctuation.length) : value,
    punctuation,
  };
}

/**
 * Render report values with compact visible labels for URLs while preserving
 * the complete source address in the link destination.
 *
 * @param {Object} props - Component props.
 * @param {*} props.value - Report value to format.
 * @param {string} [props.urlLabel] - Optional visible label for a URL-only value.
 */
export function BrandDocumentValue({ value, urlLabel }) {
  const text = formatDocumentValue(value);
  const matches = [...text.matchAll(URL_PATTERN)];

  if (matches.length === 0) return text;

  const fragments = [];
  let cursor = 0;

  matches.forEach((match) => {
    const start = match.index ?? cursor;
    const rawUrl = match[0];
    const { url, punctuation } = splitTrailingPunctuation(rawUrl);

    if (start > cursor) fragments.push(text.slice(cursor, start));
    fragments.push(
      <Fragment key={ `${url}-${start}` }>
        <Link
          href={ url }
          target="_blank"
          rel="noreferrer"
          color="inherit"
          underline="always"
          sx={ { overflowWrap: 'anywhere', wordBreak: 'break-word' } }
        >
          { urlLabel && matches.length === 1 && text === rawUrl
            ? urlLabel
            : compactUrlLabel(url) }
        </Link>
        { punctuation }
      </Fragment>,
    );
    cursor = start + rawUrl.length;
  });

  if (cursor < text.length) fragments.push(text.slice(cursor));
  return fragments;
}
