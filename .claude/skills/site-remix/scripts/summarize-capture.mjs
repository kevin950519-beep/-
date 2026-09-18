#!/usr/bin/env node
/**
 * site-remix 캡처 요약기
 *
 * capture-{slug}-{W}x{H}.json 들을 읽어 에이전트가 컨텍스트에 올릴 수 있는 짧은 마크다운을 만든다.
 * 원본 JSON 은 한 페이지에 수천 줄이라 그대로 읽히면 안 된다. 이 요약이 청사진(P2)의 입력이다.
 *
 * 실행:
 *   node .claude/skills/site-remix/scripts/summarize-capture.mjs --in docs/{project}/reference [--page <slug>] [--write]
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';

const USAGE = [
  '사용법:',
  '  node summarize-capture.mjs --in <캡처 디렉터리> [--page <slug>] [--write]',
  '',
  '  --in     capture-*.json 이 있는 디렉터리 (필수)',
  '  --page   특정 페이지 슬러그만 요약',
  '  --write  요약을 <캡처 디렉터리>/summary.md 에도 쓴다'
].join('\n');

function fail(message) {
  process.stderr.write('[site-remix] 오류: ' + message + '\n\n' + USAGE + '\n');
  process.exit(1);
}

function parseArgs(argv) {
  const booleans = new Set(['write', 'help']);
  const known = new Set(['in', 'page', ...booleans]);
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '-h') {
      out.help = true;
      continue;
    }
    if (token.slice(0, 2) !== '--') fail('인자를 이해할 수 없습니다: ' + token);
    const body = token.slice(2);
    const eq = body.indexOf('=');
    const key = eq >= 0 ? body.slice(0, eq) : body;
    if (!known.has(key)) fail('모르는 옵션입니다: --' + key);
    if (booleans.has(key)) {
      out[key] = true;
      continue;
    }
    const value = eq >= 0 ? body.slice(eq + 1) : argv[i + 1];
    if (eq < 0) i += 1;
    if (value === undefined || String(value).slice(0, 2) === '--') fail('--' + key + ' 에 값이 필요합니다');
    out[key] = String(value);
  }
  return out;
}

/* ------------------------------------------------------------------ 표 헬퍼 */

function cell(value, limit) {
  const text = String(value === undefined || value === null ? '' : value)
    .replace(/\s+/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
  const max = limit || 45;
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

/**
 * 마크다운 표를 만든다.
 *
 * @param {string[]} headers - 헤더 칸
 * @param {Array[]} rows - 행 배열
 * @param {number[]} limits - 열별 글자 수 상한 [Optional, 기본값: 45]
 */
function table(headers, rows, limits) {
  if (!rows.length) return ['(없음)', ''];
  const lines = ['| ' + headers.join(' | ') + ' |', '|' + headers.map(() => '---').join('|') + '|'];
  for (const row of rows) {
    lines.push('| ' + row.map((item, index) => cell(item, limits ? limits[index] : undefined)).join(' | ') + ' |');
  }
  lines.push('');
  return lines;
}

function bulletList(items) {
  return items.length ? items.map((item) => '- ' + item).concat(['']) : ['(없음)', ''];
}

function pxList(list, unit) {
  if (!list || !list.length) return '(없음)';
  return list.map((item) => (typeof item === 'number' ? item : item.px) + (unit || 'px')
    + (item && item.count ? '(' + item.count + ')' : '')).join(', ');
}

/* -------------------------------------------------------------- 캡처 읽기 */

function loadCaptures(dir) {
  let names;
  try {
    names = readdirSync(dir);
  } catch (error) {
    fail('디렉터리를 읽을 수 없습니다: ' + dir);
  }
  const captures = [];
  for (const name of names.sort()) {
    const match = /^capture-(.+)-(\d+)x(\d+)\.json$/.exec(name);
    if (!match) continue;
    let data;
    try {
      data = JSON.parse(readFileSync(join(dir, name), 'utf8'));
    } catch (error) {
      fail('캡처 JSON 을 파싱하지 못했습니다: ' + name + ': ' + error.message);
    }
    for (const key of ['meta', 'nav', 'sections', 'tokens', 'media']) {
      if (!(key in data)) fail('캡처 JSON 에 최상위 키 ' + key + ' 가 없습니다: ' + name);
    }
    captures.push({
      file: name,
      slug: match[1],
      width: Number(match[2]),
      height: Number(match[3]),
      label: match[2] + 'x' + match[3],
      data
    });
  }
  if (!captures.length) fail('capture-*.json 을 찾지 못했습니다: ' + dir);
  return captures;
}

function groupByPage(captures) {
  const pages = new Map();
  for (const capture of captures) {
    if (!pages.has(capture.slug)) pages.set(capture.slug, []);
    pages.get(capture.slug).push(capture);
  }
  for (const list of pages.values()) list.sort((a, b) => b.width - a.width);
  return pages;
}

/* ------------------------------------------------------------------ 조각 렌더 */

function renderSectionTable(capture) {
  const rows = capture.data.sections.map((section) => {
    const layout = section.layout || {};
    const heading = section.headings && section.headings.length ? section.headings[0].text : '';
    const layoutText = (layout.display || '?') + ' ' + (layout.columns === null || layout.columns === undefined ? '?' : layout.columns) + '열';
    return [
      section.index,
      section.tag,
      section.roleGuess,
      cell(heading, 28),
      section.rect.height + 'px',
      layoutText,
      section.mediaCount,
      section.repeat ? section.repeat.count : 0,
      section.colors.background + (section.colors.isDark ? ' 어두움' : '')
    ];
  });
  return table(['#', 'tag', 'roleGuess', '제목', '높이', 'layout', 'media', 'repeat', '배경'], rows);
}

function renderColorTokens(tokens) {
  const rows = [];
  const roles = [['text', '글자'], ['background', '배경'], ['border', '테두리'], ['accent', '액센트']];
  for (const [key, label] of roles) {
    const list = (tokens.colors && tokens.colors[key]) || [];
    const top = list.slice(0, 4).map((item) => item.hex + '(' + item.count + ')');
    rows.push([label, list.length, top.join(', ') || '(없음)']);
  }
  return table(['역할', '가짓수', '상위 값(빈도)'], rows, [8, 8, 72]);
}

function renderTypeTokens(tokens) {
  const lines = [];
  const fonts = tokens.fonts || [];
  lines.push(...table(['서체', '쓰임', '웨이트', '빈도'], fonts.map((font) => [
    font.family, (font.usage || []).join('/'), (font.weights || []).join('/'), font.count
  ])));

  const scale = (tokens.typeScale || []).slice().sort((a, b) => b.px - a.px);
  const ratios = [];
  const rows = scale.map((step, index) => {
    const next = scale[index + 1];
    const ratio = next ? Math.round((step.px / next.px) * 100) / 100 : null;
    if (ratio) ratios.push(ratio);
    return [
      step.px + 'px',
      step.count,
      (step.tags || []).join('/'),
      step.lineHeight === null ? '?' : step.lineHeight,
      step.letterSpacing === null ? '?' : step.letterSpacing,
      ratio === null ? '' : '×' + ratio
    ];
  });
  lines.push(...table(['크기', '빈도', '태그', '행간', '자간', '다음 단계 비'], rows));
  if (ratios.length) {
    const sorted = ratios.slice().sort((a, b) => a - b);
    const mid = sorted[Math.floor(sorted.length / 2)];
    lines.push('추정 타입 스케일 비: 중앙값 ×' + mid + ' (범위 ×' + sorted[0] + ' ~ ×' + sorted[sorted.length - 1] + ')');
    lines.push('');
  }
  return lines;
}

function renderSpacingTokens(tokens) {
  const spacing = tokens.spacing || {};
  const rows = [
    ['섹션 paddingY', pxList(spacing.sectionPaddingY)],
    ['gap', pxList(spacing.gaps)],
    ['컨테이너 maxWidth', pxList(spacing.containerMaxWidth)],
    ['간격 기준 단위', spacing.rhythmBase ? spacing.rhythmBase.base + 'px (적중률 ' + spacing.rhythmBase.score + ')' : '(없음)'],
    ['radius', pxList(tokens.radius)],
    ['shadow', (tokens.shadow || []).length ? (tokens.shadow || []).map((item) => item.count + '회').join(', ') + ' / 대표: ' + cell((tokens.shadow[0] || {}).value, 40) : '(없음)'],
    [':root 변수', (tokens.cssVariables || []).length + '개']
  ];
  return table(['항목', '관측값'], rows, [20, 72]);
}

function renderNav(capture) {
  const nav = capture.data.nav;
  const lines = [];
  const header = nav.header || { links: [] };
  lines.push('헤더: ' + (header.exists ? '있음' : '없음')
    + ' / 링크 ' + (header.linkCount || 0) + '개'
    + (header.isSticky ? ' / 상단 고정' : ''));
  lines.push('');
  lines.push(...table(['헤더 링크', '경로', '외부', 'CTA'], (header.links || []).slice(0, 10).map((link) => [
    link.text, link.path || '(외부)', link.isExternal ? link.externalHost || '예' : '', link.isCta ? '예' : ''
  ])));

  lines.push(...table(['푸터 그룹', '링크 수', '항목'], (nav.footerGroups || []).map((group) => [
    group.title || '(제목 없음)', group.linkCount, (group.links || []).join(', ')
  ])));

  const sections = capture.data.sections;
  lines.push(...table(['CTA', '유형', '위치 섹션', '우선순위'], (nav.ctas || []).map((cta) => [
    cta.text,
    cta.kind,
    cta.sectionIndex === null || !sections[cta.sectionIndex] ? '(밖)' : '#' + cta.sectionIndex + ' ' + sections[cta.sectionIndex].roleGuess,
    cta.isPrimary ? 'primary' : 'secondary'
  ])));
  return lines;
}

function renderMotion(capture) {
  const tokens = capture.data.tokens;
  const motion = tokens.motion || { durations: [], easings: [] };
  const hintCounts = new Map();
  for (const section of capture.data.sections) {
    for (const hint of (section.motion && section.motion.hints) || []) {
      hintCounts.set(hint, (hintCounts.get(hint) || 0) + 1);
    }
  }
  const transitionSections = capture.data.sections.filter((section) => section.motion && section.motion.hasTransition).length;
  const lines = [];
  lines.push(...table(['항목', '관측값'], [
    ['duration', (motion.durations || []).map((item) => item.ms + 'ms(' + item.count + ')').join(', ') || '(없음)'],
    ['easing', (motion.easings || []).map((item) => cell(item.value, 30)).join(', ') || '(없음)'],
    ['transition 있는 섹션', transitionSections + ' / ' + capture.data.sections.length],
    ['섹션 힌트', Array.from(hintCounts.entries()).map(([name, count]) => name + '×' + count).join(', ') || '(없음)']
  ]));
  return lines;
}

function renderMedia(capture) {
  const media = capture.data.media || [];
  const byRole = new Map();
  for (const item of media) {
    if (!byRole.has(item.role)) byRole.set(item.role, []);
    byRole.get(item.role).push(item);
  }
  const rows = Array.from(byRole.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([role, items]) => {
      const ratios = items.map((item) => item.ratio).filter((value) => typeof value === 'number' && value > 0).sort((a, b) => a - b);
      const widths = items.map((item) => item.rendered.width).sort((a, b) => a - b);
      const heights = items.map((item) => item.rendered.height).sort((a, b) => a - b);
      const share = Math.round((items.length / media.length) * 100);
      const formats = Array.from(new Set(items.map((item) => item.format).filter(Boolean)));
      return [
        role,
        items.length + '개 (' + share + '%)',
        ratios.length ? ratios[Math.floor(ratios.length / 2)] : '?',
        widths[Math.floor(widths.length / 2)] + 'x' + heights[Math.floor(heights.length / 2)],
        formats.join('/') || '(미상)'
      ];
    });
  const lines = table(['역할', '개수(비율)', '대표 종횡비', '대표 크기', '형식'], rows);
  const noAlt = media.filter((item) => !item.hasAlt).length;
  lines.push('총 ' + media.length + '개, alt 없음 ' + noAlt + '개, 지연 로딩 ' + media.filter((item) => item.isLazy).length + '개');
  lines.push('');
  return lines;
}

/**
 * 데스크탑과 모바일 섹션을 역할 순서로 맞춰 한 표로 낸다.
 * 순번을 그대로 맞대면 한쪽에만 있는 섹션 하나 때문에 이후 행이 전부 어긋나므로,
 * 역할 이름으로 앞을 내다보며 짝을 짓는다(간단한 순차 정렬).
 */
function alignSections(desktopSections, mobileSections) {
  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < desktopSections.length || j < mobileSections.length) {
    const a = desktopSections[i];
    const b = mobileSections[j];
    if (a && b && a.roleGuess === b.roleGuess) {
      pairs.push({ desktop: a, mobile: b });
      i += 1;
      j += 1;
      continue;
    }
    if (a && b) {
      const aLaterInMobile = mobileSections.slice(j + 1).findIndex((item) => item.roleGuess === a.roleGuess);
      const bLaterInDesktop = desktopSections.slice(i + 1).findIndex((item) => item.roleGuess === b.roleGuess);
      if (aLaterInMobile >= 0 && (bLaterInDesktop < 0 || aLaterInMobile <= bLaterInDesktop)) {
        pairs.push({ desktop: null, mobile: b });
        j += 1;
      } else {
        pairs.push({ desktop: a, mobile: null });
        i += 1;
      }
      continue;
    }
    if (a) {
      pairs.push({ desktop: a, mobile: null });
      i += 1;
    } else {
      pairs.push({ desktop: null, mobile: b });
      j += 1;
    }
  }
  return pairs;
}

function renderViewportDiff(captures) {
  if (captures.length < 2) return [];
  const desktop = captures[0];
  const mobile = captures[captures.length - 1];
  const lines = [];
  lines.push('데스크탑 ' + desktop.label + ' 대 모바일 ' + mobile.label + '. 역할 순서로 짝지은 표다.');
  lines.push('');
  const pairs = alignSections(desktop.data.sections, mobile.data.sections);
  const rows = pairs.map((pair) => {
    const source = pair.desktop || pair.mobile;
    let note = '';
    if (!pair.mobile) note = '모바일에 없음';
    else if (!pair.desktop) note = '모바일에만 있음';
    else if (pair.desktop.layout.columns !== pair.mobile.layout.columns) note = '열 수 변함';
    return [
      pair.desktop ? '#' + pair.desktop.index : '-',
      source.roleGuess,
      pair.desktop ? String(pair.desktop.layout.columns) : '-',
      pair.mobile ? String(pair.mobile.layout.columns) : '-',
      note
    ];
  });
  lines.push(...table(['#', '역할', '열(데스크탑)', '열(모바일)', '비고'], rows));
  const onlyDesktop = pairs.filter((pair) => !pair.mobile).length;
  const onlyMobile = pairs.filter((pair) => !pair.desktop).length;
  lines.push('섹션 수 ' + desktop.data.sections.length + ' 대 ' + mobile.data.sections.length
    + ' / 데스크탑에만 ' + onlyDesktop + '개, 모바일에만 ' + onlyMobile + '개'
    + ' / 최대 열 수 ' + maxColumns(desktop) + ' 대 ' + maxColumns(mobile));
  lines.push('');
  return lines;
}

function maxColumns(capture) {
  let max = 0;
  for (const section of capture.data.sections) {
    const columns = section.layout.columns;
    if (typeof columns === 'number' && columns > max) max = columns;
  }
  return max;
}

/* ------------------------------------------------------------------- 본문 */

function buildSummary(captures, pageFilter) {
  const pages = groupByPage(captures);
  if (pageFilter && !pages.has(pageFilter)) {
    fail('--page ' + pageFilter + ' 에 해당하는 캡처가 없습니다. 있는 슬러그: ' + Array.from(pages.keys()).join(', '));
  }
  const selected = pageFilter ? [[pageFilter, pages.get(pageFilter)]] : Array.from(pages.entries());
  const first = captures[0].data.meta;
  const libraries = new Set();
  for (const capture of captures) {
    for (const library of capture.data.meta.libraries || []) libraries.add(library);
  }

  const lines = [];
  lines.push('# 레퍼런스 캡처 요약: ' + (first.host || '(호스트 미상)'));
  lines.push('');
  lines.push('- 캡처 시각: ' + (first.capturedAt || '(미상)'));
  lines.push('- 캡처 파일: ' + captures.length + '개 / 페이지 ' + pages.size + '개 / 뷰포트 '
    + Array.from(new Set(captures.map((capture) => capture.label))).join(', '));
  lines.push('- 감지된 라이브러리: ' + (libraries.size ? Array.from(libraries).join(', ') : '(없음)'));
  lines.push('- 이 요약은 측정값과 패턴만 담는다. 원본 카피 전문, 에셋 URL, 소스 코드는 담지 않는다.');
  lines.push('');

  lines.push('## 1. 페이지 목록');
  lines.push('');
  const pageRows = [];
  for (const [slug, list] of pages.entries()) {
    const primary = list[0];
    pageRows.push([
      slug,
      primary.data.meta.requestedPath || primary.data.meta.path,
      cell(primary.data.meta.title, 30),
      primary.data.sections.length + (primary.data.meta.truncated ? '(잘림)' : ''),
      primary.data.meta.documentHeight + 'px'
    ]);
  }
  lines.push(...table(['slug', '경로', '제목', '섹션 수', '문서 높이'], pageRows));

  let order = 2;
  for (const [slug, list] of selected) {
    const primary = list[0];
    lines.push('## ' + order + '. 페이지: ' + slug + ' (' + primary.label + ')');
    lines.push('');
    if (primary.data.meta.rectless) {
      lines.push('주의: 이 캡처는 레이아웃 수치가 없는 환경에서 만들어져 높이·열 수가 0일 수 있다.');
      lines.push('');
    }
    lines.push('### ' + order + '.1 섹션 구조');
    lines.push('');
    lines.push(...renderSectionTable(primary));
    lines.push('### ' + order + '.2 토큰 (색, 서체와 타입 스케일, 간격·모서리·그림자)');
    lines.push('');
    lines.push(...renderColorTokens(primary.data.tokens));
    lines.push(...renderTypeTokens(primary.data.tokens));
    lines.push(...renderSpacingTokens(primary.data.tokens));
    lines.push('### ' + order + '.3 내비와 CTA');
    lines.push('');
    lines.push(...renderNav(primary));
    lines.push('### ' + order + '.4 모션 힌트');
    lines.push('');
    lines.push(...renderMotion(primary));
    lines.push('### ' + order + '.5 미디어 인벤토리');
    lines.push('');
    lines.push(...renderMedia(primary));
    const diff = renderViewportDiff(list);
    if (diff.length) {
      lines.push('### ' + order + '.6 뷰포트 비교');
      lines.push('');
      lines.push(...diff);
    }
    order += 1;
  }

  const notes = [];
  for (const capture of captures) {
    for (const note of capture.data.meta.notes || []) notes.push(capture.file + ': ' + note);
    if (capture.data.meta.authWall) notes.push(capture.file + ': 로그인 벽 또는 사람 확인 화면이 감지됨');
    if (capture.data.meta.truncated) notes.push(capture.file + ': --max-sections 상한에 걸려 섹션이 잘림');
  }
  lines.push('## ' + order + '. 캡처 주의 사항');
  lines.push('');
  lines.push(...bulletList(notes));

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(USAGE + '\n');
    return;
  }
  if (!args.in) fail('--in 이 필요합니다');
  const dir = isAbsolute(args.in) ? args.in : resolve(process.cwd(), args.in);
  const captures = loadCaptures(dir);
  const summary = buildSummary(captures, args.page);
  process.stdout.write(summary + '\n');
  if (args.write) {
    const target = join(dir, 'summary.md');
    writeFileSync(target, summary + '\n', 'utf8');
    process.stderr.write('[site-remix] 요약 기록: ' + target + '\n');
  }
}

main();
