#!/usr/bin/env node
/**
 * site-remix 캡처 래퍼
 *
 * 일반 Node(ESM)로 실행한다. CLI 인자를 파싱해 설정을 주입한 "ego 스크립트" 문자열을 만들고
 * ego-browser nodejs 를 spawn 해 stdin 으로 넘긴다. --dry-run 이면 만든 스크립트를 stdout 에 출력만 한다.
 *
 * 이 파일 자체는 브라우저 API 를 쓰지 않는다. 브라우저 안에서 도는 코드는 extractor.mjs 하나뿐이고
 * fn.toString() 으로 ego 스크립트에 끼워 넣는다(오프라인 테스트에서 같은 함수를 import 해 검증한다).
 *
 * 실행:
 *   node .claude/skills/site-remix/scripts/capture-site.mjs --url https://example.com \
 *     --out docs/{project}/reference [--pages /,/about] [--viewports 1440x900,390x844] \
 *     [--space <taskSpaceId>] [--keep-open] [--max-sections 40] [--dry-run]
 */
import { spawn } from 'node:child_process';
import { accessSync, constants } from 'node:fs';
import { delimiter, isAbsolute, join, resolve } from 'node:path';
import { extractSiteStructure } from './extractor.mjs';

const MAX_PAGES = 8;
const MAX_VIEWPORTS = 4;
const DEFAULT_VIEWPORTS = '1440x900,390x844';

const USAGE = [
  '사용법:',
  '  node capture-site.mjs --url <URL> --out <디렉터리>',
  '    [--pages /,/about,/pricing] [--viewports 1440x900,390x844]',
  '    [--space <taskSpaceId>] [--keep-open] [--max-sections 40] [--dry-run]',
  '',
  '  --url          레퍼런스 사이트 URL (http/https, 필수)',
  '  --out          캡처 산출물 디렉터리 (필수). capture-*.json 과 shots/ 가 여기 쌓인다',
  '  --pages        캡처할 경로 목록, 쉼표 구분, 최대 ' + MAX_PAGES + '개 (기본값: --url 의 경로)',
  '  --viewports    WxH 목록, 쉼표 구분, 최대 ' + MAX_VIEWPORTS + '개 (기본값: ' + DEFAULT_VIEWPORTS + ')',
  '  --space        재개할 taskSpace id 또는 이름',
  '  --keep-open    캡처 후 task.finish 를 호출하지 않는다',
  '  --max-sections 섹션 수 상한 (기본값: 40, 범위 5~120)',
  '  --dry-run      브라우저를 띄우지 않고 생성한 ego 스크립트만 출력한다',
  '',
  '환경 변수:',
  '  SITE_REMIX_EGO_BIN    ego-browser 실행 파일 경로를 직접 지정',
  '  SITE_REMIX_EGO_INPUT  arg 로 두면 stdin 대신 ego-browser nodejs -e 로 넘긴다'
].join('\n');

/** 오류를 stderr 로 내고 0이 아닌 코드로 끝낸다. */
function fail(message, hint) {
  process.stderr.write('[site-remix] 오류: ' + message + '\n');
  if (hint) process.stderr.write('[site-remix] ' + hint + '\n');
  process.stderr.write('\n' + USAGE + '\n');
  process.exit(1);
}

/**
 * --key value, --key=value, 불리언 플래그를 파싱한다.
 *
 * @param {string[]} argv - process.argv.slice(2)
 */
function parseArgs(argv) {
  const booleans = new Set(['dry-run', 'keep-open', 'help']);
  const known = new Set(['url', 'out', 'pages', 'viewports', 'space', 'max-sections', ...booleans]);
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '-h') {
      out.help = true;
      continue;
    }
    if (token.slice(0, 2) !== '--') {
      fail('인자를 이해할 수 없습니다: ' + token);
    }
    const body = token.slice(2);
    const eq = body.indexOf('=');
    const key = eq >= 0 ? body.slice(0, eq) : body;
    if (!known.has(key)) fail('모르는 옵션입니다: --' + key);
    if (booleans.has(key)) {
      out[key] = eq >= 0 ? body.slice(eq + 1) !== 'false' : true;
      continue;
    }
    let value = eq >= 0 ? body.slice(eq + 1) : argv[i + 1];
    if (eq < 0) i += 1;
    if (value === undefined || String(value).slice(0, 2) === '--') {
      fail('--' + key + ' 에 값이 필요합니다');
    }
    out[key] = String(value);
  }
  return out;
}

/** 경로를 파일 이름에 쓸 슬러그로 바꾼다. '/' 는 home. */
function slugOf(pagePath) {
  const trimmed = String(pagePath).split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '');
  if (!trimmed) return 'home';
  const slug = trimmed.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
  return slug.slice(0, 48) || 'page';
}

function parsePages(raw, fallbackPath) {
  const source = raw === undefined ? fallbackPath : raw;
  const list = String(source)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  if (!list.length) fail('--pages 에 유효한 경로가 없습니다');
  const seen = new Set();
  const pages = [];
  for (const item of list) {
    if (item.slice(0, 1) !== '/') {
      fail('--pages 항목은 / 로 시작하는 경로여야 합니다: ' + item, '외부 도메인은 캡처하지 않습니다(범위 밖 링크 금지).');
    }
    if (seen.has(item)) continue;
    seen.add(item);
    pages.push(item);
  }
  if (pages.length > MAX_PAGES) {
    fail('페이지는 최대 ' + MAX_PAGES + '개입니다. 받은 개수: ' + pages.length, '분석 범위를 좁혀 다시 실행하세요.');
  }
  const slugs = new Set();
  for (const page of pages) {
    const slug = slugOf(page);
    if (slugs.has(slug)) fail('페이지 슬러그가 겹칩니다: ' + slug + ' (' + page + ')');
    slugs.add(slug);
  }
  return pages;
}

function parseViewports(raw) {
  const list = String(raw === undefined ? DEFAULT_VIEWPORTS : raw)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  if (!list.length) fail('--viewports 에 유효한 값이 없습니다');
  if (list.length > MAX_VIEWPORTS) {
    fail('뷰포트는 최대 ' + MAX_VIEWPORTS + '개입니다. 받은 개수: ' + list.length);
  }
  const viewports = [];
  for (const item of list) {
    const match = /^(\d{2,5})x(\d{2,5})$/.exec(item);
    if (!match) fail('--viewports 형식은 WxH 입니다: ' + item);
    const width = Number(match[1]);
    const height = Number(match[2]);
    if (width < 240 || width > 3840 || height < 320 || height > 4320) {
      fail('뷰포트 범위를 벗어났습니다(폭 240~3840, 높이 320~4320): ' + item);
    }
    viewports.push({ width, height, label: width + 'x' + height, isMobile: width <= 600, isPrimary: false });
  }
  let widest = 0;
  for (let i = 1; i < viewports.length; i += 1) {
    if (viewports[i].width > viewports[widest].width) widest = i;
  }
  viewports[widest].isPrimary = true;
  return viewports;
}

/** PATH 와 환경 변수만 본다. 다른 경로를 추측해서 브라우저를 띄우지 않는다. */
function resolveEgoBinary() {
  const override = process.env.SITE_REMIX_EGO_BIN;
  if (override) {
    return isExecutable(override) ? override : null;
  }
  const dirs = String(process.env.PATH || '').split(delimiter).filter(Boolean);
  for (const dir of dirs) {
    const candidate = join(dir, 'ego-browser');
    if (isExecutable(candidate)) return candidate;
  }
  return null;
}

function isExecutable(candidate) {
  try {
    accessSync(candidate, constants.X_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 주입할 설정과 추출기 소스로 ego 스크립트(Node ESM, top-level await)를 만든다.
 *
 * @param {object} config - ego 스크립트에 JSON 으로 박아 넣을 설정
 * @param {string} extractorSource - page.evaluate 에 넘길 함수의 소스
 */
function buildEgoScript(config, extractorSource) {
  const json = (value) => JSON.stringify(value, null, 2);
  const lines = [
    '/**',
    ' * site-remix 캡처 스크립트 (capture-site.mjs 가 생성한 코드)',
    ' *',
    ' * ego-browser nodejs 안에서 도는 Node ESM 이다. 손으로 고치지 말고 래퍼를 고쳐서 다시 만든다.',
    ' * 사용하는 API 는 ego-browser SKILL.md / references/api.md 에 있는 것만이다(Playwright 아님).',
    ' */',
    'const CONFIG = ' + json(config) + ';',
    '',
    'const fs = await import(\'node:fs/promises\');',
    '',
    '/** 페이지 안에서 실행되는 추출기. 바깥 변수를 참조하지 않는 자기완결 함수다. */',
    'const extractSiteStructure = ' + extractorSource + ';',
    '',
    '/** 페이지 안에서 세로 위치를 옮긴다(지연 로딩 유도용). */',
    'const scrollToRatio = function (ratio) {',
    '  const doc = window.document;',
    '  const height = Math.max(doc.documentElement.scrollHeight || 0, doc.body ? doc.body.scrollHeight || 0 : 0);',
    '  window.scrollTo(0, Math.round(height * ratio));',
    '  return height;',
    '};',
    '',
    '/** 페이지 안에서 절대 y 로 이동한다(섹션 클립 촬영용). */',
    'const scrollToY = function (y) {',
    '  window.scrollTo(0, y);',
    '  return window.scrollY;',
    '};',
    '',
    'const summary = { spaceId: null, outDir: CONFIG.outDir, captures: [], notes: [] };',
    '',
    'await fs.mkdir(CONFIG.outDir, { recursive: true });',
    'await fs.mkdir(CONFIG.shotsDir, { recursive: true });',
    '',
    'const task = await taskSpace(CONFIG.space === null ? CONFIG.spaceName : CONFIG.space);',
    'summary.spaceId = task.spaceId;',
    'console.log(\'[site-remix] spaceId=\' + task.spaceId);',
    'const page = task.page(\'p1\');',
    '',
    'let stopReason = null;',
    '',
    'for (const viewport of CONFIG.viewports) {',
    '  if (stopReason) break;',
    '  await page.cdp(\'Emulation.setDeviceMetricsOverride\', {',
    '    width: viewport.width,',
    '    height: viewport.height,',
    '    deviceScaleFactor: CONFIG.deviceScaleFactor,',
    '    mobile: viewport.isMobile',
    '  });',
    '  await page.waitForTimeout(CONFIG.settleMs);',
    '',
    '  for (const pagePath of CONFIG.pages) {',
    '    if (stopReason) break;',
    '    const slug = CONFIG.slugs[pagePath];',
    '    const label = slug + \' \' + viewport.label;',
    '    const targetUrl = CONFIG.origin + pagePath;',
    '',
    '    try {',
    '      await page.goto(targetUrl, { waitUntil: \'load\', timeout: CONFIG.navTimeoutMs });',
    '    } catch (error) {',
    '      summary.notes.push(\'goto 실패로 이 조합을 건너뜀: \' + label + \': \' + String(error && error.message ? error.message : error));',
    '      console.log(\'[site-remix] goto 실패: \' + label);',
    '      continue;',
    '    }',
    '',
    '    try {',
    '      await page.waitForLoadState(\'networkidle\', { timeout: CONFIG.idleTimeoutMs });',
    '    } catch (error) {',
    '      summary.notes.push(\'networkidle 대기 시간 초과(load 까지만 보장): \' + label);',
    '    }',
    '',
    '    for (let step = 1; step <= CONFIG.scrollSteps; step += 1) {',
    '      await page.evaluate(scrollToRatio, step / CONFIG.scrollSteps);',
    '      await page.waitForTimeout(CONFIG.scrollDelayMs);',
    '    }',
    '    await page.evaluate(scrollToY, 0);',
    '    await page.waitForTimeout(CONFIG.settleMs);',
    '',
    '    const data = await page.evaluate(extractSiteStructure, CONFIG.extract);',
    '    data.meta.capturedAt = new Date().toISOString();',
    '    data.meta.slug = slug;',
    '    data.meta.requestedPath = pagePath;',
    '    data.meta.viewport.label = viewport.label;',
    '    data.meta.viewport.mobile = viewport.isMobile;',
    '    data.meta.viewport.requested = { width: viewport.width, height: viewport.height };',
    '    data.meta.finalPath = String(await page.url()).replace(CONFIG.origin, \'\');',
    '',
    '    const jsonPath = CONFIG.outDir + \'/capture-\' + slug + \'-\' + viewport.label + \'.json\';',
    '    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2) + \'\\n\', \'utf8\');',
    '',
    '    const shotPath = CONFIG.shotsDir + \'/\' + slug + \'-\' + viewport.label + \'.png\';',
    '    await page.screenshot({ path: shotPath, fullPage: true });',
    '',
    '    let clipCount = 0;',
    '    if (viewport.isPrimary) {',
    '      /** 섹션 클립은 해당 섹션을 화면 맨 위로 올린 뒤 뷰포트 기준 사각형으로 찍는다. */',
    '      for (const section of data.sections) {',
    '        if (clipCount >= CONFIG.maxSectionShots) break;',
    '        if (!section.rect || section.rect.height <= 0) continue;',
    '        await page.evaluate(scrollToY, Math.max(0, section.rect.y - 8));',
    '        await page.waitForTimeout(CONFIG.clipDelayMs);',
    '        const clipWidth = Math.min(section.rect.width || viewport.width, viewport.width);',
    '        const clipHeight = Math.min(section.rect.height + 16, viewport.height);',
    '        const index = String(section.index).length < 2 ? \'0\' + section.index : String(section.index);',
    '        await page.screenshot({',
    '          path: CONFIG.shotsDir + \'/\' + slug + \'-\' + viewport.label + \'-s\' + index + \'-\' + section.roleGuess + \'.png\',',
    '          clip: { x: Math.max(0, section.rect.x), y: 0, width: clipWidth, height: clipHeight }',
    '        });',
    '        clipCount += 1;',
    '      }',
    '      await page.evaluate(scrollToY, 0);',
    '    }',
    '',
    '    summary.captures.push({',
    '      slug: slug,',
    '      viewport: viewport.label,',
    '      json: jsonPath,',
    '      shot: shotPath,',
    '      sectionShots: clipCount,',
    '      sections: data.meta.sectionCount,',
    '      truncated: data.meta.truncated,',
    '      libraries: data.meta.libraries',
    '    });',
    '    console.log(\'[site-remix] 캡처 완료: \' + label + \' 섹션 \' + data.meta.sectionCount + \'개\');',
    '',
    '    if (data.meta.authWall) {',
    '      stopReason = \'로그인 벽 또는 사람 확인 화면을 만났습니다(\' + label + \')\';',
    '    }',
    '  }',
    '}',
    '',
    'if (stopReason) {',
    '  console.log(\'[site-remix] 중단: \' + stopReason);',
    '  console.log(\'[site-remix] 자격 증명을 입력하지 않았습니다. 사용자가 직접 처리한 뒤 --space \' + task.spaceId + \' 로 다시 실행하세요.\');',
    '  summary.notes.push(stopReason);',
    '  await task.handOff();',
    '} else if (CONFIG.keepOpen) {',
    '  console.log(\'[site-remix] --keep-open: task 를 닫지 않습니다. spaceId=\' + task.spaceId);',
    '} else {',
    '  await page.cdp(\'Emulation.clearDeviceMetricsOverride\', {});',
    '  await task.finish({ keep: [] });',
    '}',
    '',
    'console.log(JSON.stringify(summary, null, 2));',
    ''
  ];
  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(USAGE + '\n');
    return;
  }
  if (!args.url) fail('--url 이 필요합니다', '예: --url https://example.com');

  let url;
  try {
    url = new URL(args.url);
  } catch (error) {
    fail('--url 을 URL 로 읽을 수 없습니다: ' + args.url);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    fail('--url 은 http 또는 https 여야 합니다: ' + url.protocol);
  }
  if (!args.out) fail('--out 이 필요합니다', '예: --out docs/{project}/reference');

  const pages = parsePages(args.pages, url.pathname || '/');
  const viewports = parseViewports(args.viewports);

  let maxSections = 40;
  if (args['max-sections'] !== undefined) {
    maxSections = Number(args['max-sections']);
    if (!Number.isInteger(maxSections) || maxSections < 5 || maxSections > 120) {
      fail('--max-sections 는 5~120 사이의 정수입니다: ' + args['max-sections']);
    }
  }

  const outDir = isAbsolute(args.out) ? args.out : resolve(process.cwd(), args.out);
  const slugs = {};
  for (const page of pages) slugs[page] = slugOf(page);

  const spaceRaw = args.space;
  const space = spaceRaw === undefined ? null : (/^\d+$/.test(spaceRaw) ? Number(spaceRaw) : spaceRaw);

  const config = {
    origin: url.origin,
    host: url.host,
    pages,
    slugs,
    viewports,
    outDir,
    shotsDir: join(outDir, 'shots'),
    space,
    spaceName: 'site-remix capture ' + url.host,
    keepOpen: Boolean(args['keep-open']),
    deviceScaleFactor: 1,
    navTimeoutMs: 45000,
    idleTimeoutMs: 8000,
    scrollSteps: 6,
    scrollDelayMs: 350,
    settleMs: 400,
    clipDelayMs: 150,
    maxSectionShots: 12,
    extract: {
      maxSections,
      minSectionHeight: 64,
      textSampleLength: 240,
      maxElements: 4000,
      maxCssVariables: 80
    }
  };

  const script = buildEgoScript(config, extractSiteStructure.toString());

  if (args['dry-run']) {
    process.stdout.write(script);
    return;
  }

  const binary = resolveEgoBinary();
  if (!binary) {
    const hint = process.env.SITE_REMIX_EGO_BIN
      ? 'SITE_REMIX_EGO_BIN 이 가리키는 파일을 실행할 수 없습니다: ' + process.env.SITE_REMIX_EGO_BIN
      : 'PATH 에서 ego-browser 를 찾지 못했습니다. ego-browser 스킬의 references/install.md 를 보고 설치하거나 SITE_REMIX_EGO_BIN 으로 경로를 지정하세요.';
    fail('ego-browser 를 찾을 수 없습니다', hint + ' 설치 없이 구조만 보려면 축소 모드(정적 HTML 분석)로 진행하세요.');
  }

  const useArgInput = String(process.env.SITE_REMIX_EGO_INPUT || '').toLowerCase() === 'arg';
  const spawnArgs = useArgInput ? ['nodejs', '-e', script] : ['nodejs'];
  const child = spawn(binary, spawnArgs, { stdio: [useArgInput ? 'ignore' : 'pipe', 'inherit', 'inherit'] });

  child.on('error', (error) => {
    process.stderr.write('[site-remix] 오류: ego-browser 실행 실패: ' + error.message + '\n');
    process.exit(1);
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      process.stderr.write('[site-remix] ego-browser 가 신호로 종료되었습니다: ' + signal + '\n');
      process.exit(1);
    }
    process.exit(code === null ? 1 : code);
  });

  if (!useArgInput) {
    child.stdin.on('error', (error) => {
      process.stderr.write('[site-remix] 오류: ego 스크립트를 stdin 으로 넘기지 못했습니다: ' + error.message + '\n');
      process.stderr.write('[site-remix] SITE_REMIX_EGO_INPUT=arg 로 다시 시도해 보세요.\n');
      process.exit(1);
    });
    child.stdin.end(script, 'utf8');
  }
}

main();
