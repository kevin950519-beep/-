#!/usr/bin/env node
/**
 * site-remix 스크립트 완료 조건 점검기 (브라우저를 절대 띄우지 않는다)
 *
 * 확인하는 것:
 * 1) scripts 의 모든 .mjs 가 node --check 를 통과한다
 * 2) capture-site.mjs --dry-run 이 ego 스크립트를 출력하고, 그 결과가 node --check 를 통과하며
 *    필수 API 가 있고 Playwright 전용 API 가 없다
 * 3) 잘못된 인자와 ego-browser 미설치에서 0이 아닌 종료 코드와 명확한 메시지가 나온다
 * 4) happy-dom 픽스처 스모크가 통과한다
 * 5) summarize-capture.mjs 가 요약을 내고 --write 로 summary.md 를 쓴다
 * 6) scripts 어디에도 em dash 가 없다
 *
 * 실행: node .claude/skills/site-remix/scripts/fixtures/check.mjs
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPTS = resolve(HERE, '..');
const CAPTURE_DIR = join(HERE, 'capture');
const NODE = process.execPath;

const results = [];

function record(label, ok, detail) {
  results.push({ label, ok, detail: detail || '' });
}

function run(args, options) {
  return spawnSync(NODE, args, { encoding: 'utf8', ...(options || {}) });
}

function listMjs(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...listMjs(full));
    } else if (name.endsWith('.mjs')) {
      out.push(full);
    }
  }
  return out.sort();
}

/* 1) node --check */
const scriptFiles = listMjs(SCRIPTS);
for (const file of scriptFiles) {
  const result = run(['--check', file]);
  record('node --check ' + file.replace(SCRIPTS + '/', ''), result.status === 0, result.stderr.trim().split('\n')[0] || '');
}

/* 2) dry-run */
const dry = run([
  join(SCRIPTS, 'capture-site.mjs'),
  '--url', 'https://example.com',
  '--out', join(tmpdir(), 'site-remix-check-out'),
  '--pages', '/,/about',
  '--viewports', '1440x900,390x844',
  '--dry-run'
]);
record('--dry-run 이 0으로 끝난다', dry.status === 0, dry.stderr.trim().split('\n')[0] || '');
const script = dry.stdout || '';
const temp = join(mkdtempSync(join(tmpdir(), 'site-remix-')), 'ego-script.mjs');
writeFileSync(temp, script, 'utf8');
const scriptCheck = run(['--check', temp]);
record('생성된 ego 스크립트가 node --check 를 통과한다', scriptCheck.status === 0, scriptCheck.stderr.trim().split('\n')[0] || '');
for (const needle of ['taskSpace(', 'Emulation.setDeviceMetricsOverride', 'fullPage', 'task.finish(']) {
  record('ego 스크립트에 ' + needle + ' 가 있다', script.indexOf(needle) >= 0);
}
for (const needle of ['locator(', 'getByRole(', 'setViewportSize(']) {
  record('ego 스크립트에 Playwright 전용 ' + needle + ' 가 없다', script.indexOf(needle) < 0);
}
record('--dry-run 이 디렉터리를 만들지 않는다', !existsQuiet(join(tmpdir(), 'site-remix-check-out')));

/* 3) 오류 경로 */
const missingUrl = run([join(SCRIPTS, 'capture-site.mjs'), '--out', '/tmp/site-remix-none']);
record('--url 누락이 0이 아닌 코드로 끝난다',
  missingUrl.status !== 0 && missingUrl.stderr.indexOf('--url') >= 0,
  'status=' + missingUrl.status);

const tooManyPages = run([
  join(SCRIPTS, 'capture-site.mjs'), '--url', 'https://example.com', '--out', '/tmp/site-remix-none',
  '--pages', '/a,/b,/c,/d,/e,/f,/g,/h,/i'
]);
record('페이지 9개가 0이 아닌 코드로 끝난다',
  tooManyPages.status !== 0 && tooManyPages.stderr.indexOf('최대 8개') >= 0,
  'status=' + tooManyPages.status);

const noEgo = run(
  [join(SCRIPTS, 'capture-site.mjs'), '--url', 'https://example.com', '--out', '/tmp/site-remix-none'],
  { env: { PATH: '', HOME: process.env.HOME || '' } }
);
record('ego-browser 미설치가 0이 아닌 코드로 끝난다',
  noEgo.status !== 0 && noEgo.stderr.indexOf('ego-browser') >= 0,
  'status=' + noEgo.status);

/* 4) happy-dom 스모크 */
const smoke = run([join(HERE, 'smoke.mjs')]);
record('happy-dom 픽스처 스모크', smoke.status === 0, (smoke.stdout.trim().split('\n').pop() || '').trim());

/* 5) 요약 */
const summary = run([join(SCRIPTS, 'summarize-capture.mjs'), '--in', CAPTURE_DIR]);
record('summarize-capture 가 마크다운을 낸다',
  summary.status === 0 && summary.stdout.indexOf('| # | tag | roleGuess') >= 0,
  '출력 ' + summary.stdout.split('\n').length + '줄');
const written = run([join(SCRIPTS, 'summarize-capture.mjs'), '--in', CAPTURE_DIR, '--write']);
record('--write 가 summary.md 를 쓴다',
  written.status === 0 && existsQuiet(join(CAPTURE_DIR, 'summary.md')));

let urlFields = 0;
for (const name of readdirSync(CAPTURE_DIR)) {
  if (!name.endsWith('.json')) continue;
  const text = readFileSync(join(CAPTURE_DIR, name), 'utf8');
  if (/"src"|"url"|https?:\/\//.test(text)) urlFields += 1;
}
record('캡처 JSON 스키마에 에셋 URL 필드가 없다', urlFields === 0, 'url 필드가 있는 파일 ' + urlFields + '개');

/* 6) em dash. 이 파일 자체가 em dash 를 담지 않도록 코드포인트로 만든다. */
const EM_DASH = String.fromCharCode(0x2014);
let emDash = 0;
for (const file of listAll(SCRIPTS)) {
  if (readFileSync(file, 'utf8').indexOf(EM_DASH) >= 0) emDash += 1;
}
record('scripts 에 em dash 가 없다', emDash === 0, 'em dash 가 있는 파일 ' + emDash + '개');

function listAll(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listAll(full));
    else out.push(full);
  }
  return out;
}

function existsQuiet(target) {
  try {
    statSync(target);
    return true;
  } catch (error) {
    return false;
  }
}

const failed = results.filter((item) => !item.ok);
for (const item of results) {
  process.stdout.write((item.ok ? '  ok   ' : '  FAIL ') + item.label + (item.detail ? ': ' + item.detail : '') + '\n');
}
process.stdout.write('\n[check] ' + (results.length - failed.length) + '/' + results.length + ' 통과\n');
if (failed.length) process.exit(1);
