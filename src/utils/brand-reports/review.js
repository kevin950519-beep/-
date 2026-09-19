import { asArray, asRecord, firstText, toText, uniqueStrings } from './helpers.js';

export function normalizeReview(review, fallbackStatus = '') {
  const source = asRecord(review);
  const status = firstText(source.status, fallbackStatus, 'pending');
  const prompts = uniqueStrings(source.adjustment_prompts);
  const feedback = asArray(source.user_feedback)
    .map((item) => (typeof item === 'string' ? item : firstText(item?.feedback, item?.message)))
    .filter(Boolean);

  if (!Object.keys(source).length && !toText(fallbackStatus)) return undefined;

  return {
    status,
    prompt: prompts.join(' '),
    targets: uniqueStrings(source.review_targets),
    feedback: feedback.join('\n'),
    updatedAt: toText(source.updated_at),
  };
}
