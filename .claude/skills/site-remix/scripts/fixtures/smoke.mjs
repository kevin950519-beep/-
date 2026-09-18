#!/usr/bin/env node
/**
 * extractor 오프라인 스모크 (브라우저를 띄우지 않는다)
 *
 * happy-dom Window 에 fixtures/landing.html 을 올리고 extractor 함수를 그 window 컨텍스트로 실행한다.
 * happy-dom 은 레이아웃 계산이 없어 getBoundingClientRect 가 전부 0이다.
 * 이 스모크의 목적은 "rect 가 0인 환경에서도 추출기가 죽지 않고 태그·랜드마크 기준으로
 * 5개 최상위 키를 가진 JSON 을 돌려주는가"를 확인하는 것이다.
 *
 * 실행:
 *   node .claude/skills/site-remix/scripts/fixtures/smoke.mjs [--write <디렉터리>]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';
import { extractSiteStructure } from '../extractor.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROLE_VOCABULARY = [
  'global-nav', 'hero', 'value-prop', 'feature-grid', 'feature-detail', 'showcase', 'gallery',
  'story', 'stat-band', 'social-proof', 'logo-cloud', 'testimonial', 'pricing', 'comparison',
  'faq', 'form', 'cta', 'content-feed', 'article-body', 'footer', 'other'
];

const failures = [];
const checks = [];

/** 조건을 검사하고 결과를 모은다. 실패해도 계속 진행해 전체 그림을 본다. */
function check(label, condition, detail) {
  checks.push({ label, ok: Boolean(condition), detail: detail === undefined ? '' : String(detail) });
  if (!condition) failures.push(label + (detail ? ' (' + detail + ')' : ''));
}

function parseWriteTarget(argv) {
  const index = argv.indexOf('--write');
  if (index < 0) return null;
  const value = argv[index + 1];
  if (!value || value.slice(0, 2) === '--') {
    process.stderr.write('[smoke] --write 에 디렉터리가 필요합니다\n');
    process.exit(1);
  }
  return isAbsolute(value) ? value : resolve(process.cwd(), value);
}

/**
 * extractor 를 happy-dom Window 컨텍스트에서 실행한다.
 * 추출기는 페이지 전역 중 window 만 직접 읽도록 쓰여 있어서, window 를 인자로 주입하면
 * page.evaluate 안에서 도는 것과 같은 코드 경로를 Node 에서 그대로 돌릴 수 있다.
 */
function runExtractorIn(window, config) {
  const factory = new Function('window', 'return (' + extractSiteStructure.toString() + ');');
  return factory(window)(config);
}

const writeTarget = parseWriteTarget(process.argv.slice(2));
const html = readFileSync(join(HERE, 'landing.html'), 'utf8');

const window = new Window({ url: 'https://fixture.local/', width: 1440, height: 900 });
window.document.write(html);
await window.happyDOM.waitUntilComplete();

let data = null;
let thrown = null;
try {
  data = runExtractorIn(window, { maxSections: 40, minSectionHeight: 64, textSampleLength: 240 });
} catch (error) {
  thrown = error;
}

check('추출기가 예외 없이 끝난다', !thrown, thrown ? thrown.stack : '');

if (data) {
  const topKeys = Object.keys(data).sort();
  check('최상위 키 5개 고정', topKeys.join(',') === 'media,meta,nav,sections,tokens', topKeys.join(','));
  check('rect 0 환경을 meta.rectless 로 알린다', data.meta.rectless === true, 'rectless=' + data.meta.rectless);
  check('섹션을 6개 이상 찾는다', data.sections.length >= 6, '섹션 ' + data.sections.length + '개');
  check('섹션 수 상한을 넘지 않는다', data.sections.length <= 40, '섹션 ' + data.sections.length + '개');

  const roles = data.sections.map((section) => section.roleGuess);
  const unknown = roles.filter((role) => ROLE_VOCABULARY.indexOf(role) < 0);
  check('roleGuess 가 고정 어휘 안에 있다', unknown.length === 0, unknown.join(','));
  check('첫 섹션이 global-nav', roles[0] === 'global-nav', roles[0]);
  check('마지막 섹션이 footer', roles[roles.length - 1] === 'footer', roles[roles.length - 1]);
  check('hero 를 찾는다', roles.indexOf('hero') >= 0, roles.join(' > '));
  check('pricing 을 찾는다', roles.indexOf('pricing') >= 0, roles.join(' > '));
  check('faq 를 찾는다', roles.indexOf('faq') >= 0, roles.join(' > '));
  check('feature-grid 를 찾는다', roles.indexOf('feature-grid') >= 0, roles.join(' > '));
  check('logo-cloud 를 찾는다', roles.indexOf('logo-cloud') >= 0, roles.join(' > '));
  check('cta 를 찾는다', roles.indexOf('cta') >= 0, roles.join(' > '));
  check('미분류(other)가 없다', roles.indexOf('other') < 0, roles.join(' > '));

  const grid = data.sections[roles.indexOf('feature-grid')];
  check('반복 카드 수를 센다', grid && grid.repeat && grid.repeat.count === 3, grid ? JSON.stringify(grid.repeat) : '');
  check('열 수를 센다', grid && grid.layout.columns === 3, grid ? String(grid.layout.columns) : '');
  check('gap 축약형도 읽는다', grid && grid.layout.gap[1] === 24, grid ? grid.layout.gap.join('/') : '');

  const hero = data.sections[roles.indexOf('hero')];
  check('hero 제목 전문을 담는다', hero && hero.headings.length > 0 && hero.headings[0].level === 1, hero ? JSON.stringify(hero.headings[0] || null) : '');
  check('textSample 이 240자 이내', data.sections.every((section) => section.textSample.length <= 240));
  check('모든 섹션에 layout 이 있다', data.sections.every((section) => section.layout && 'columns' in section.layout));

  check('헤더 링크를 모은다', data.nav.header.links.length >= 4, '링크 ' + data.nav.header.links.length + '개');
  check('외부 링크는 경로 대신 호스트만 남긴다',
    data.nav.header.links.some((link) => link.isExternal && link.path === null && link.externalHost));
  check('푸터 링크 그룹을 모은다', data.nav.footerGroups.length >= 2, '그룹 ' + data.nav.footerGroups.length + '개');
  check('CTA 를 모은다', data.nav.ctas.length >= 2, 'CTA ' + data.nav.ctas.length + '개');

  check('미디어 인벤토리를 만든다', data.media.length >= 5, '미디어 ' + data.media.length + '개');
  check('미디어 역할이 비어 있지 않다', data.media.every((item) => typeof item.role === 'string' && item.role));
  check('미디어 형식만 남기고 URL 은 없다', data.media.every((item) => !('src' in item) && !('url' in item)));
  check('로고 줄 이미지를 logo 로 분류', data.media.filter((item) => item.role === 'logo').length >= 5,
    data.media.map((item) => item.role).join(','));
  check('작은 아이콘을 icon 으로 분류', data.media.some((item) => item.role === 'icon'));

  check(':root CSS 변수를 읽는다', data.tokens.cssVariables.length >= 3, '변수 ' + data.tokens.cssVariables.length + '개');
  check('CSS 변수 상한 80개', data.tokens.cssVariables.length <= 80);
  check('토큰 5묶음이 모두 있다',
    ['colors', 'fonts', 'typeScale', 'spacing', 'radius'].every((key) => key in data.tokens));

  const serialized = JSON.stringify(data);
  check('JSON 직렬화가 된다', serialized.length > 0);
  check('캡처 JSON 에 src 필드가 없다', serialized.indexOf('"src"') < 0);
  check('캡처 JSON 에 http URL 이 없다', !/https?:\/\//.test(serialized), (/https?:\/\/[^"]*/.exec(serialized) || [''])[0]);

  if (writeTarget) {
    mkdirSync(writeTarget, { recursive: true });
    const target = join(writeTarget, 'capture-fixture-1440x900.json');
    writeFileSync(target, JSON.stringify(data, null, 2) + '\n', 'utf8');
    process.stdout.write('[smoke] 캡처 JSON 기록: ' + target + '\n');
  }

  process.stdout.write('\n[smoke] 섹션 역할 순서: ' + roles.join(' > ') + '\n');
  process.stdout.write('[smoke] meta.notes: ' + JSON.stringify(data.meta.notes) + '\n');
}

/**
 * 두 번째 경우: 랜드마크도 시맨틱 태그도 없는 div 수프.
 * 실제 사이트에서 흔한 형태라 이 경우에도 죽지 않고 섹션을 돌려주는지 본다.
 */
const SOUP = [
  '<!doctype html><html><head><title>Soup</title></head><body>',
  '<div id="__next"><div class="page">',
  '<div class="topbar"><a href="/">Brand</a><a href="/a">A</a><a href="/b">B</a><a href="/c">C</a></div>',
  '<div class="block-intro"><div class="inner"><span>큰 문구가 들어가는 자리</span><a href="/start">시작</a></div></div>',
  '<div class="block-cards"><div class="card">하나</div><div class="card">둘</div><div class="card">셋</div></div>',
  '<div class="block-end"><span>마지막 줄</span></div>',
  '</div></div></body></html>'
].join('');

const soupWindow = new Window({ url: 'https://soup.local/', width: 1440, height: 900 });
soupWindow.document.write(SOUP);
await soupWindow.happyDOM.waitUntilComplete();

let soupData = null;
let soupError = null;
try {
  soupData = runExtractorIn(soupWindow, { maxSections: 40 });
} catch (error) {
  soupError = error;
}
check('랜드마크 없는 div 수프에서도 예외가 없다', !soupError, soupError ? soupError.message : '');
if (soupData) {
  check('div 수프에서 섹션을 3개 이상 찾는다', soupData.sections.length >= 3,
    soupData.sections.map((section) => section.tag + ':' + section.roleGuess).join(' > '));
  check('랜드마크가 없어도 첫 링크 묶음을 global-nav 로 본다',
    soupData.sections[0].roleGuess === 'global-nav', soupData.sections[0].roleGuess);
  check('div 수프에서 반복 묶음을 한 섹션으로 유지한다',
    soupData.sections.some((section) => section.repeat && section.repeat.count === 3),
    JSON.stringify(soupData.sections.map((section) => (section.repeat ? section.repeat.count : 0))));
  check('div 수프에서도 최상위 키 5개', Object.keys(soupData).sort().join(',') === 'media,meta,nav,sections,tokens');
  process.stdout.write('[smoke] div 수프 섹션: '
    + soupData.sections.map((section) => section.tag + ':' + section.roleGuess).join(' > ') + '\n');
}
await soupWindow.happyDOM.close();

process.stdout.write('\n');
for (const item of checks) {
  process.stdout.write((item.ok ? '  ok   ' : '  FAIL ') + item.label + (item.detail ? ': ' + item.detail : '') + '\n');
}
process.stdout.write('\n[smoke] ' + (checks.length - failures.length) + '/' + checks.length + ' 통과\n');

await window.happyDOM.close();

if (failures.length) {
  process.stderr.write('[smoke] 실패 ' + failures.length + '건\n');
  process.exit(1);
}
