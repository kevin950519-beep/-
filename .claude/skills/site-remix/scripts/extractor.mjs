/**
 * 레퍼런스 사이트 구조 추출기 (페이지 안에서 실행되는 함수)
 *
 * 이 파일이 export 하는 extractSiteStructure 는 두 경로로 쓰인다.
 * 1) capture-site.mjs 가 fn.toString() 으로 ego 스크립트에 끼워 넣고 page.evaluate(fn, config) 로 실행
 * 2) fixtures/smoke.mjs 가 new Function('window', ...) 으로 happy-dom Window 를 주입해 오프라인 실행
 *
 * 그래서 이 함수는 자기완결이어야 한다(바깥 변수 참조 금지, 내부 헬퍼만 사용).
 * 페이지 전역 중 직접 읽는 것은 window 하나뿐이고 document, getComputedStyle 등은 window 에서 꺼낸다.
 * 이렇게 해야 happy-dom Window 를 인자로 넘기는 오프라인 테스트가 성립한다.
 *
 * 반환 JSON 최상위 키는 meta, nav, sections, tokens, media 로 고정이다(design-spec 7장).
 * 미디어·링크의 원본 URL 은 저장하지 않는다(design-spec 3장 불변 규칙).
 */

/**
 * 페이지 구조·토큰·미디어·내비를 한 번에 추출한다.
 *
 * Props:
 * @param {object} config - 추출 설정 [Optional]
 * @param {number} config.maxSections - 섹션 수 상한 [Optional, 기본값: 40]
 * @param {number} config.minSectionHeight - 섹션으로 인정할 최소 높이 px [Optional, 기본값: 64]
 * @param {number} config.textSampleLength - 섹션 텍스트 표본 길이 [Optional, 기본값: 240]
 * @param {number} config.maxElements - 토큰 집계에 훑을 최대 엘리먼트 수 [Optional, 기본값: 4000]
 * @param {number} config.maxCssVariables - 수집할 :root 변수 상한 [Optional, 기본값: 80]
 *
 * Example usage:
 * const data = await page.evaluate(extractSiteStructure, { maxSections: 40 });
 */
export function extractSiteStructure(config) {
  var DEFAULTS = {
    maxSections: 40,
    minSectionHeight: 64,
    textSampleLength: 240,
    maxElements: 4000,
    maxCssVariables: 80,
    maxMedia: 120,
    maxDepth: 8
  };
  var cfg = {};
  var key;
  for (key in DEFAULTS) {
    if (Object.prototype.hasOwnProperty.call(DEFAULTS, key)) cfg[key] = DEFAULTS[key];
  }
  if (config) {
    for (key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key) && config[key] !== undefined && config[key] !== null) {
        cfg[key] = config[key];
      }
    }
  }

  var view = window;
  var doc = view.document;
  var notes = [];

  var SKIP_TAGS = {
    SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, LINK: 1, META: 1, HEAD: 1, TITLE: 1, BASE: 1
  };
  var LANDMARK_TAGS = { HEADER: 1, FOOTER: 1, NAV: 1, ASIDE: 1 };
  var SECTIONISH_TAGS = { SECTION: 1, ARTICLE: 1, HEADER: 1, FOOTER: 1, NAV: 1, ASIDE: 1 };
  var CONTAINER_TAGS = { DIV: 1, SECTION: 1, MAIN: 1, ARTICLE: 1 };
  var MEDIA_EXT = {
    jpg: 1, jpeg: 1, png: 1, webp: 1, avif: 1, gif: 1, svg: 1, mp4: 1, webm: 1, mov: 1, ico: 1
  };

  /** 역할 신호로 쓸 수 있는 클래스·id 어휘. 원본 클래스명 자체는 저장하지 않는다. */
  var ROLE_SIGNAL_WORDS = [
    'hero', 'banner', 'masthead', 'feature', 'benefit', 'service', 'pricing', 'plan', 'tier',
    'faq', 'accordion', 'question', 'testimonial', 'review', 'quote', 'logo', 'client', 'partner',
    'brand', 'trusted', 'stat', 'metric', 'number', 'counter', 'cta', 'signup', 'subscribe',
    'newsletter', 'contact', 'form', 'gallery', 'showcase', 'portfolio', 'work', 'project', 'case',
    'story', 'about', 'blog', 'news', 'article', 'post', 'press', 'award', 'compare', 'comparison',
    'footer', 'header', 'nav', 'menu', 'value', 'intro'
  ];

  function safe(fn, fallback) {
    try {
      return fn();
    } catch (error) {
      return fallback;
    }
  }

  function computed(el) {
    return safe(function () {
      return view.getComputedStyle(el);
    }, null);
  }

  function styleValue(cs, prop) {
    if (!cs) return '';
    var value = safe(function () {
      return cs[prop];
    }, '');
    if (value === undefined || value === null) return '';
    return String(value);
  }

  function round(value) {
    var num = Number(value);
    if (!isFinite(num)) return 0;
    return Math.round(num);
  }

  function round2(value) {
    var num = Number(value);
    if (!isFinite(num)) return 0;
    return Math.round(num * 100) / 100;
  }

  function px(value) {
    var match = /(-?\d+(?:\.\d+)?)px/.exec(String(value || ''));
    return match ? Number(match[1]) : null;
  }

  function ms(value) {
    var raw = String(value || '').split(',')[0].trim();
    if (!raw) return 0;
    if (raw.indexOf('ms') >= 0) return Number(parseFloat(raw)) || 0;
    if (raw.indexOf('s') >= 0) return (Number(parseFloat(raw)) || 0) * 1000;
    return 0;
  }

  function collapse(text) {
    return String(text === undefined || text === null ? '' : text).replace(/\s+/g, ' ').trim();
  }

  function clamp(text, limit) {
    var value = collapse(text);
    if (value.length <= limit) return value;
    return value.slice(0, limit - 1) + '…';
  }

  function rectOf(el) {
    return safe(function () {
      var rect = el.getBoundingClientRect();
      return {
        x: round((rect.left || 0) + (view.scrollX || 0)),
        y: round((rect.top || 0) + (view.scrollY || 0)),
        width: round(rect.width || 0),
        height: round(rect.height || 0)
      };
    }, { x: 0, y: 0, width: 0, height: 0 });
  }

  function queryAll(root, selector) {
    return safe(function () {
      var list = root.querySelectorAll(selector);
      return Array.prototype.slice.call(list);
    }, []);
  }

  function isRendered(el) {
    if (!el || el.nodeType !== 1) return false;
    if (SKIP_TAGS[el.tagName]) return false;
    if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') return false;
    var cs = computed(el);
    if (!cs) return true;
    if (styleValue(cs, 'display') === 'none') return false;
    if (styleValue(cs, 'visibility') === 'hidden') return false;
    return true;
  }

  function renderableChildren(el) {
    var out = [];
    var kids = safe(function () {
      return Array.prototype.slice.call(el.children || []);
    }, []);
    for (var i = 0; i < kids.length; i += 1) {
      if (isRendered(kids[i])) out.push(kids[i]);
    }
    return out;
  }

  function directText(el) {
    var total = '';
    var nodes = safe(function () {
      return Array.prototype.slice.call(el.childNodes || []);
    }, []);
    for (var i = 0; i < nodes.length; i += 1) {
      if (nodes[i].nodeType === 3) total += ' ' + (nodes[i].nodeValue || '');
    }
    return collapse(total);
  }

  /** script/style 을 뺀 가시 텍스트를 모은다. limit 자를 넘으면 멈춘다. */
  function collectText(el, limit) {
    var buffer = [];
    var length = 0;
    walk(el, 0);
    return collapse(buffer.join(' '));

    function walk(node, depth) {
      if (length >= limit || depth > 24) return;
      var nodes = safe(function () {
        return Array.prototype.slice.call(node.childNodes || []);
      }, []);
      for (var i = 0; i < nodes.length; i += 1) {
        var child = nodes[i];
        if (length >= limit) return;
        if (child.nodeType === 3) {
          var text = collapse(child.nodeValue);
          if (text) {
            buffer.push(text);
            length += text.length + 1;
          }
        } else if (child.nodeType === 1 && !SKIP_TAGS[child.tagName]) {
          walk(child, depth + 1);
        }
      }
    }
  }

  function classTokens(el) {
    var raw = '';
    raw += ' ' + String((el.getAttribute && el.getAttribute('class')) || '');
    raw += ' ' + String((el.getAttribute && el.getAttribute('id')) || '');
    raw += ' ' + String((el.getAttribute && el.getAttribute('data-section')) || '');
    return raw.toLowerCase();
  }

  /** 클래스·id 문자열에서 고정 어휘에 해당하는 신호만 뽑는다(원문 저장 안 함). */
  function roleSignals(el) {
    var haystack = classTokens(el);
    var out = [];
    for (var i = 0; i < ROLE_SIGNAL_WORDS.length; i += 1) {
      if (haystack.indexOf(ROLE_SIGNAL_WORDS[i]) >= 0 && out.indexOf(ROLE_SIGNAL_WORDS[i]) < 0) {
        out.push(ROLE_SIGNAL_WORDS[i]);
      }
      if (out.length >= 6) break;
    }
    return out;
  }

  function parseColor(value) {
    var raw = collapse(value).toLowerCase();
    if (!raw || raw === 'transparent' || raw === 'none') return null;
    var rgb = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.%]+))?\s*\)/.exec(raw);
    if (rgb) {
      var alphaRaw = rgb[4];
      var alpha = 1;
      if (alphaRaw !== undefined) {
        alpha = alphaRaw.indexOf('%') >= 0 ? parseFloat(alphaRaw) / 100 : parseFloat(alphaRaw);
      }
      if (!isFinite(alpha)) alpha = 1;
      return { r: round(rgb[1]), g: round(rgb[2]), b: round(rgb[3]), a: round2(alpha) };
    }
    var hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(raw);
    if (hex) {
      var body = hex[1];
      if (body.length === 3) body = body[0] + body[0] + body[1] + body[1] + body[2] + body[2];
      return {
        r: parseInt(body.slice(0, 2), 16),
        g: parseInt(body.slice(2, 4), 16),
        b: parseInt(body.slice(4, 6), 16),
        a: 1
      };
    }
    if (raw === 'white') return { r: 255, g: 255, b: 255, a: 1 };
    if (raw === 'black') return { r: 0, g: 0, b: 0, a: 1 };
    return null;
  }

  function toHex(color) {
    function part(n) {
      var value = Math.max(0, Math.min(255, round(n))).toString(16);
      return value.length === 1 ? '0' + value : value;
    }
    return '#' + part(color.r) + part(color.g) + part(color.b);
  }

  function luminance(color) {
    return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
  }

  function saturation(color) {
    var max = Math.max(color.r, color.g, color.b);
    var min = Math.min(color.r, color.g, color.b);
    if (max === 0) return 0;
    return round2((max - min) / max);
  }

  function bump(map, key, weight, extra) {
    if (!key) return;
    var entry = map[key];
    if (!entry) {
      entry = { count: 0, weight: 0, extra: {} };
      map[key] = entry;
    }
    entry.count += 1;
    entry.weight += weight || 0;
    if (extra) {
      for (var name in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, name)) {
          if (!entry.extra[name]) entry.extra[name] = {};
          entry.extra[name][extra[name]] = true;
        }
      }
    }
  }

  function keysOf(bag) {
    var out = [];
    for (var name in bag) {
      if (Object.prototype.hasOwnProperty.call(bag, name)) out.push(name);
    }
    return out;
  }

  function rank(map, limit, mapper) {
    var entries = [];
    for (var name in map) {
      if (Object.prototype.hasOwnProperty.call(map, name)) {
        entries.push({ key: name, value: map[name] });
      }
    }
    entries.sort(function (a, b) {
      var byWeight = (b.value.weight || 0) - (a.value.weight || 0);
      if (byWeight !== 0) return byWeight;
      return (b.value.count || 0) - (a.value.count || 0);
    });
    return entries.slice(0, limit).map(mapper);
  }

  function median(values) {
    if (!values.length) return 0;
    var sorted = values.slice().sort(function (a, b) {
      return a - b;
    });
    return sorted[Math.floor(sorted.length / 2)];
  }

  /* ---------------------------------------------------------------- 섹션 분할 */

  var rectBudget = { measured: 0 };

  function isLandmark(el) {
    return !!LANDMARK_TAGS[el.tagName];
  }

  /** 구조 서명이 같은 자식이 다수면 반복 묶음(카드 격자 등)으로 보고 더 쪼개지 않는다. */
  function childSignature(el) {
    var headings = safe(function () {
      return el.querySelector('h1,h2,h3,h4') ? 'h' : '-';
    }, '-');
    var width = rectBudget.measured > 0 ? String(Math.round(rectOf(el).width / 40)) : '-';
    return el.tagName + '|' + Math.min(9, renderableChildren(el).length) + '|' + headings + '|' + width;
  }

  function looksRepeated(children) {
    if (children.length < 3) return false;
    var counts = {};
    var top = 0;
    for (var i = 0; i < children.length; i += 1) {
      var key = childSignature(children[i]);
      counts[key] = (counts[key] || 0) + 1;
      if (counts[key] > top) top = counts[key];
    }
    return top >= Math.max(3, Math.ceil(children.length * 0.6));
  }

  /** 자식이 비어 있는 장식용 블록이 아니라 내용을 가진 덩어리인지 본다. */
  function hasOwnContent(el) {
    if (collectText(el, 400).length >= 4) return true;
    if (renderableChildren(el).length >= 2) return true;
    return queryAll(el, 'img,video,svg,canvas,iframe').length > 0;
  }

  function shouldUnwrap(node, children, depth) {
    if (node === doc.body) return true;
    if (node.tagName === 'MAIN') return true;
    if (depth > cfg.maxDepth) return false;
    if (isLandmark(node)) return false;
    if (directText(node).length > 80) return false;

    var sectionish = 0;
    var containers = 0;
    var meaty = 0;
    var i;
    for (i = 0; i < children.length; i += 1) {
      if (SECTIONISH_TAGS[children[i].tagName]) sectionish += 1;
      if (CONTAINER_TAGS[children[i].tagName]) containers += 1;
      if (hasOwnContent(children[i])) meaty += 1;
    }
    if (sectionish >= 2) return true;

    /** section/article 자체는 더 쪼개지 않는다. 자기 배경·여백이 섹션의 측정값이다. */
    if (node.tagName === 'SECTION' || node.tagName === 'ARTICLE') return false;
    if (children.length === 1 && CONTAINER_TAGS[children[0].tagName]) return true;

    if (rectBudget.measured === 0) {
      /** 레이아웃 수치가 없으면 구조만 보고 얕은 깊이에서만 푼다. */
      if (depth > 3 || children.length < 2 || children.length > 12) return false;
      if (looksRepeated(children)) return false;
      return containers >= 2 && meaty >= 2;
    }

    var rect = rectOf(node);
    if (rect.height < cfg.minSectionHeight * 3) return false;
    if (children.length < 2 || children.length > 12) return false;
    if (looksRepeated(children)) return false;
    var tall = 0;
    var stacked = 0;
    for (i = 0; i < children.length; i += 1) {
      var childRect = rectOf(children[i]);
      if (childRect.height >= cfg.minSectionHeight) tall += 1;
      if (i > 0 && childRect.y >= rectOf(children[i - 1]).y + cfg.minSectionHeight) stacked += 1;
    }
    return tall >= 2 && stacked >= 1;
  }

  function gatherSectionNodes() {
    var out = [];
    if (!doc.body) return out;
    var limit = cfg.maxSections * 4;
    visit(doc.body, 0);
    return out;

    function visit(node, depth) {
      if (out.length >= limit) return;
      var children = renderableChildren(node);
      if (!children.length) {
        if (node !== doc.body) out.push(node);
        return;
      }
      if (shouldUnwrap(node, children, depth)) {
        for (var i = 0; i < children.length; i += 1) visit(children[i], depth + 1);
        return;
      }
      out.push(node);
    }
  }

  /**
   * 섹션 안에서 배치와 반복을 실제로 담당하는 노드를 찾는다.
   * 1) 한 겹짜리 래퍼를 따라 내려가며 flex/grid 를 찾는다.
   * 2) 못 찾으면 제목 옆에 붙은 콘텐츠 컨테이너(요소 자식이 가장 많은 블록)를 고른다.
   */
  function findLayoutNode(el) {
    var node = el;
    for (var i = 0; i < 3; i += 1) {
      var cs = computed(node);
      var display = styleValue(cs, 'display');
      if (display.indexOf('flex') >= 0 || display.indexOf('grid') >= 0) return node;
      var children = renderableChildren(node);
      if (children.length !== 1 || !CONTAINER_TAGS[children[0].tagName]) break;
      node = children[0];
    }

    var siblings = renderableChildren(node);
    if (siblings.length >= 2 && siblings.length <= 5) {
      var best = null;
      for (var j = 0; j < siblings.length; j += 1) {
        var candidate = siblings[j];
        if (!CONTAINER_TAGS[candidate.tagName] && candidate.tagName !== 'UL' && candidate.tagName !== 'OL') continue;
        var count = renderableChildren(candidate).length;
        if (count >= 2 && (!best || count > best.count)) best = { node: candidate, count: count };
      }
      if (best) return best.node;
    }
    return node;
  }

  function columnsOf(node, cs) {
    var display = styleValue(cs, 'display');
    if (display.indexOf('grid') >= 0) {
      var template = collapse(styleValue(cs, 'gridTemplateColumns'));
      if (template && template !== 'none') {
        var tracks = template.split(/\s+(?![^(]*\))/);
        if (tracks.length) return tracks.length;
      }
    }
    var children = renderableChildren(node);
    if (!children.length) return null;
    if (display.indexOf('flex') >= 0) {
      if (styleValue(cs, 'flexDirection').indexOf('column') === 0) return 1;
      if (rectBudget.measured > 0) {
        var top = rectOf(children[0]).y;
        var inRow = 0;
        for (var i = 0; i < children.length; i += 1) {
          if (Math.abs(rectOf(children[i]).y - top) <= 8) inRow += 1;
        }
        return inRow || children.length;
      }
      return children.length;
    }
    if (display.indexOf('block') >= 0 || display === '') return 1;
    return null;
  }

  /** rowGap/columnGap 이 비어 있는 구현(축약형만 노출)을 위해 gap 축약형도 읽는다. */
  function gapOf(cs) {
    var row = px(styleValue(cs, 'rowGap'));
    var column = px(styleValue(cs, 'columnGap'));
    if (row === null || column === null) {
      var parts = collapse(styleValue(cs, 'gap')).split(/\s+/);
      var first = px(parts[0]);
      var second = parts.length > 1 ? px(parts[1]) : first;
      if (row === null) row = first;
      if (column === null) column = second;
    }
    return { row: row || 0, column: column || 0 };
  }

  /**
   * 섹션 여백을 실제로 들고 있는 노드를 찾는다.
   * 래퍼 한 겹을 풀고 내려온 섹션은 자기 padding 이 0이고 바깥 래퍼가 여백을 쥐고 있다.
   * 자식이 하나뿐인 조상만 거슬러 올라가므로 다른 섹션의 여백을 가져올 수 없다.
   */
  function paddingOwner(el) {
    var node = el;
    for (var i = 0; i < 3; i += 1) {
      var cs = computed(node);
      if ((px(styleValue(cs, 'paddingTop')) || 0) > 0 || (px(styleValue(cs, 'paddingBottom')) || 0) > 0) return node;
      var parent = node.parentElement;
      if (!parent || parent === doc.body || renderableChildren(parent).length !== 1) break;
      node = parent;
    }
    return node;
  }

  function layoutOf(el) {
    var node = findLayoutNode(el);
    var cs = computed(node);
    var paddingSource = computed(paddingOwner(el));
    var maxWidth = px(styleValue(cs, 'maxWidth'));
    if (maxWidth === null) maxWidth = px(styleValue(paddingSource, 'maxWidth'));
    return {
      display: styleValue(cs, 'display') || 'block',
      columns: columnsOf(node, cs),
      gap: [round(gapOf(cs).row), round(gapOf(cs).column)],
      direction: styleValue(cs, 'flexDirection') || null,
      align: styleValue(cs, 'alignItems') || null,
      justify: styleValue(cs, 'justifyContent') || null,
      textAlign: styleValue(cs, 'textAlign') || null,
      maxWidth: maxWidth === null ? null : round(maxWidth),
      paddingY: [round(px(styleValue(paddingSource, 'paddingTop')) || 0), round(px(styleValue(paddingSource, 'paddingBottom')) || 0)],
      paddingX: [round(px(styleValue(paddingSource, 'paddingLeft')) || 0), round(px(styleValue(paddingSource, 'paddingRight')) || 0)]
    };
  }

  function detectRepeat(el) {
    var node = findLayoutNode(el);
    var children = renderableChildren(node);
    if (children.length < 2) return null;
    var groups = {};
    for (var i = 0; i < children.length; i += 1) {
      var child = children[i];
      var rect = rectOf(child);
      var key = child.tagName + '|' + Math.min(9, renderableChildren(child).length) + '|' + Math.round(rect.width / 40);
      if (!groups[key]) groups[key] = { tag: child.tagName, widths: [], heights: [], count: 0 };
      groups[key].count += 1;
      groups[key].widths.push(rect.width);
      groups[key].heights.push(rect.height);
    }
    var best = null;
    var names = keysOf(groups);
    for (var j = 0; j < names.length; j += 1) {
      var group = groups[names[j]];
      if (!best || group.count > best.count) best = group;
    }
    if (!best || best.count < 2) return null;
    return {
      count: best.count,
      childTag: best.tag.toLowerCase(),
      itemWidth: round(median(best.widths)),
      itemHeight: round(median(best.heights))
    };
  }

  function effectiveBackground(el) {
    var node = el;
    for (var i = 0; i < 8 && node; i += 1) {
      var cs = computed(node);
      var color = parseColor(styleValue(cs, 'backgroundColor'));
      if (color && color.a > 0.05) return toHex(color);
      node = node.parentElement;
    }
    return null;
  }

  function motionOf(el, cs) {
    var hints = [];
    var position = styleValue(cs, 'position') || 'static';
    if (position === 'sticky' || position === 'fixed') hints.push(position);
    if (collapse(styleValue(cs, 'scrollSnapType')) && styleValue(cs, 'scrollSnapType') !== 'none') hints.push('scroll-snap');
    var overflowX = styleValue(cs, 'overflowX');
    if (overflowX === 'auto' || overflowX === 'scroll') hints.push('horizontal-scroll');
    if (queryAll(el, '[data-aos],[data-scroll],[data-animate],[data-reveal],[data-framer-appear-id]').length) {
      hints.push('scroll-reveal-attr');
    }
    if (queryAll(el, 'video[autoplay]').length) hints.push('autoplay-video');
    if (queryAll(el, '.swiper,.slick-slider,[data-carousel],[data-swiper]').length) hints.push('carousel');
    if (queryAll(el, '.pin-spacer,[data-pin]').length) hints.push('pinned-scroll');
    var duration = ms(styleValue(cs, 'transitionDuration'));
    var animation = collapse(styleValue(cs, 'animationName'));
    return {
      hasTransition: duration > 0,
      transitionMs: round(duration),
      easing: collapse(styleValue(cs, 'transitionTimingFunction')) || null,
      hasTransform: collapse(styleValue(cs, 'transform')) !== '' && styleValue(cs, 'transform') !== 'none',
      hasAnimation: animation !== '' && animation !== 'none',
      hints: hints
    };
  }

  function describeSection(el, index) {
    var cs = computed(el);
    var rect = rectOf(el);
    var headings = [];
    var headingNodes = queryAll(el, 'h1,h2,h3');
    for (var i = 0; i < headingNodes.length && headings.length < 6; i += 1) {
      var text = clamp(collectText(headingNodes[i], 400), 120);
      if (text) headings.push({ level: Number(headingNodes[i].tagName.slice(1)), text: text });
    }
    var text = collectText(el, 6000);
    var words = text ? text.split(/\s+/).length : 0;
    var mediaNodes = queryAll(el, 'img,picture,video,svg,canvas,iframe');
    var controls = queryAll(el, 'button,input,select,textarea,summary,[role="button"],[contenteditable="true"]');
    var links = queryAll(el, 'a[href]');
    var textColor = parseColor(styleValue(cs, 'color'));
    var background = effectiveBackground(el);
    var backgroundColor = background ? parseColor(background) : null;

    return {
      index: index,
      tag: String(el.tagName || '').toLowerCase(),
      landmark: isLandmark(el) ? el.tagName.toLowerCase() : (el.getAttribute ? el.getAttribute('role') : null) || null,
      roleSignals: roleSignals(el),
      rect: rect,
      headings: headings,
      textStats: {
        chars: text.length,
        words: words,
        blocks: queryAll(el, 'p,li,blockquote,dd,figcaption').length,
        linkCount: links.length,
        ctaCount: countCtaLinks(links),
        formFields: queryAll(el, 'input,textarea,select').length,
        detailsCount: queryAll(el, 'details,summary').length,
        tableCount: queryAll(el, 'table').length
      },
      textSample: clamp(text, cfg.textSampleLength),
      mediaCount: mediaNodes.length,
      controlCount: controls.length,
      layout: layoutOf(el),
      repeat: detectRepeat(el),
      colors: {
        background: background,
        text: textColor ? toHex(textColor) : null,
        isDark: backgroundColor ? luminance(backgroundColor) < 0.45 : false,
        borderTop: px(styleValue(cs, 'borderTopWidth')) ? toHexOrNull(styleValue(cs, 'borderTopColor')) : null
      },
      position: styleValue(cs, 'position') || 'static',
      motion: motionOf(el, cs),
      roleGuess: 'other',
      roleWhy: ''
    };
  }

  /** 버튼처럼 보이는 링크 수. a 태그 CTA 는 controlCount 에 잡히지 않으므로 따로 센다. */
  function countCtaLinks(links) {
    var count = 0;
    for (var i = 0; i < links.length; i += 1) {
      if (looksLikeCta(links[i])) count += 1;
    }
    return count;
  }

  function toHexOrNull(value) {
    var color = parseColor(value);
    return color ? toHex(color) : null;
  }

  /* ------------------------------------------------------------ 섹션 역할 추정 */

  function hasSignal(section, words) {
    for (var i = 0; i < words.length; i += 1) {
      if (section.roleSignals.indexOf(words[i]) >= 0) return true;
    }
    return false;
  }

  function headingText(section) {
    var out = [];
    for (var i = 0; i < section.headings.length; i += 1) out.push(section.headings[i].text);
    return out.join(' ').toLowerCase();
  }

  function guessRole(section, index, sections, viewportHeight) {
    var stats = section.textStats;
    var repeatCount = section.repeat ? section.repeat.count : 0;
    var heading = headingText(section);
    var sample = (section.textSample || '').toLowerCase();
    var isFirstContent = index <= 1;

    if (section.tag === 'header' || section.landmark === 'banner') return done('global-nav', 'header 랜드마크');
    if (section.tag === 'footer' || section.landmark === 'contentinfo') return done('footer', 'footer 랜드마크');
    if (section.tag === 'nav' && stats.linkCount >= 3) return done('global-nav', 'nav 랜드마크와 링크 3개 이상');
    if ((section.position === 'fixed' || section.position === 'sticky') && index === 0 && stats.linkCount >= 3) {
      return done('global-nav', '상단 고정 + 링크 묶음');
    }
    if (index === 0 && stats.linkCount >= 3 && stats.chars < 200 && section.headings.length === 0) {
      return done('global-nav', '첫 블록 + 링크 묶음(랜드마크 없음)');
    }

    if (hasSignal(section, ['faq', 'accordion', 'question']) || stats.detailsCount >= 2) {
      return done('faq', 'FAQ 신호 또는 details 반복');
    }
    if (hasSignal(section, ['pricing', 'plan', 'tier']) || /[$€£₩]\s?\d|\/\s?(mo|month|월)/.test(sample)) {
      if (stats.tableCount >= 1 && repeatCount < 2) return done('comparison', '가격 신호 + 표');
      return done('pricing', '가격 신호');
    }
    if (hasSignal(section, ['compare', 'comparison']) || (stats.tableCount >= 1 && repeatCount >= 2)) {
      return done('comparison', '비교 신호 또는 표 구조');
    }
    if (hasSignal(section, ['testimonial', 'review', 'quote']) || queryCountLike(section, 'quote')) {
      return done('testimonial', '후기 신호');
    }
    if (hasSignal(section, ['logo', 'client', 'partner', 'brand', 'trusted'])) {
      return done('logo-cloud', '로고 줄 신호');
    }
    if (hasSignal(section, ['press', 'award'])) return done('social-proof', '보도·수상 신호');
    if (hasSignal(section, ['stat', 'metric', 'counter'])) return done('stat-band', '지표 신호');
    if (hasSignal(section, ['gallery'])) return done('gallery', '갤러리 신호');
    if (hasSignal(section, ['showcase', 'portfolio', 'work', 'project', 'case'])) {
      return done('showcase', '사례·작업 신호');
    }
    if (hasSignal(section, ['blog', 'news', 'post'])) return done('content-feed', '콘텐츠 피드 신호');
    if (hasSignal(section, ['story', 'about']) && repeatCount < 2) return done('story', '스토리 신호');
    if (hasSignal(section, ['feature', 'benefit', 'service'])) {
      if (repeatCount >= 2) return done('feature-grid', '기능 신호 + 반복 ' + repeatCount + '개');
      return done(section.mediaCount >= 1 ? 'feature-detail' : 'value-prop', '기능 신호');
    }

    if (stats.formFields >= 2) return done('form', '입력 필드 2개 이상');
    if (stats.formFields === 1 && stats.chars < 400) return done('cta', '단일 입력 + 짧은 카피');
    if (hasSignal(section, ['cta', 'signup', 'subscribe']) && stats.chars < 600) {
      return done('cta', 'CTA 신호 + 짧은 카피');
    }

    if (hasSignal(section, ['hero', 'masthead']) && isFirstContent) return done('hero', '히어로 신호');
    if (isFirstContent && hasHeadingLevel(section, 1)) return done('hero', '첫 섹션 + h1');
    if (isFirstContent && section.rect.height >= viewportHeight * 0.6 && section.rect.height > 0) {
      return done('hero', '첫 섹션 + 뷰포트 60% 이상 높이');
    }

    if (repeatCount >= 4 && stats.chars < 240 && section.mediaCount >= repeatCount) {
      return done('logo-cloud', '텍스트 적은 이미지 반복');
    }
    if (repeatCount >= 2 && stats.chars < 320 && /\d{2,}|\d+\s?[%+]/.test(sample)) {
      return done('stat-band', '숫자 중심 반복');
    }
    if (repeatCount >= 3 && section.mediaCount >= repeatCount && stats.chars < 600) {
      return done('gallery', '이미지 위주 반복 3개 이상');
    }
    if (repeatCount >= 2) return done('feature-grid', '반복 카드 ' + repeatCount + '개');

    if (section.tag === 'article' || stats.chars > 1500) return done('article-body', '긴 본문');
    if (section.mediaCount >= 1 && section.layout.columns === 2 && stats.chars < 1200) {
      return done('feature-detail', '2열 미디어 + 설명');
    }
    if (section.controlCount + stats.ctaCount >= 1 && stats.chars < 400) return done('cta', '짧은 카피 + 액션');
    if (heading && stats.chars < 600 && section.mediaCount === 0) return done('value-prop', '짧은 제목 중심 블록');
    return done('other', '휴리스틱 미분류');

    function done(role, why) {
      section.roleGuess = role;
      section.roleWhy = why;
      return role;
    }
  }

  function hasHeadingLevel(section, level) {
    for (var i = 0; i < section.headings.length; i += 1) {
      if (section.headings[i].level === level) return true;
    }
    return false;
  }

  function queryCountLike(section, kind) {
    if (kind === 'quote') return section.quoteCount > 0;
    return false;
  }

  /* ------------------------------------------------------------------ 토큰 집계 */

  function collectTokens(sections) {
    var textColors = {};
    var backgroundColors = {};
    var borderColors = {};
    var accentColors = {};
    var fonts = {};
    var typeScale = {};
    var gaps = {};
    var radii = {};
    var shadows = {};
    var containers = {};
    var durations = {};
    var easings = {};

    var all = queryAll(doc, '*').slice(0, cfg.maxElements);
    for (var i = 0; i < all.length; i += 1) {
      var el = all[i];
      if (SKIP_TAGS[el.tagName]) continue;
      var cs = computed(el);
      if (!cs) continue;
      var rect = rectOf(el);
      var area = Math.max(1, rect.width * rect.height);
      var own = directText(el);
      var tag = String(el.tagName || '').toLowerCase();

      var background = parseColor(styleValue(cs, 'backgroundColor'));
      if (background && background.a > 0.05) {
        bump(backgroundColors, toHex(background), area, { tag: tag });
      }

      if (own.length > 0) {
        var color = parseColor(styleValue(cs, 'color'));
        if (color && color.a > 0.05) bump(textColors, toHex(color), own.length, { tag: tag });

        var size = px(styleValue(cs, 'fontSize'));
        if (size) {
          var lineHeight = px(styleValue(cs, 'lineHeight'));
          var sizeKey = String(round(size));
          bump(typeScale, sizeKey, own.length, {
            tag: tag,
            weight: collapse(styleValue(cs, 'fontWeight')),
            lineHeight: lineHeight ? String(round2(lineHeight / size)) : 'normal',
            letterSpacing: collapse(styleValue(cs, 'letterSpacing')) || 'normal'
          });
        }

        var family = collapse(styleValue(cs, 'fontFamily')).split(',')[0].replace(/["']/g, '');
        if (family) {
          var usage = /^h[1-6]$/.test(tag) ? 'heading' : (tag === 'button' || tag === 'label' ? 'ui' : 'body');
          bump(fonts, family, own.length, { usage: usage, weight: collapse(styleValue(cs, 'fontWeight')) });
        }
      }

      var borderWidth = px(styleValue(cs, 'borderTopWidth')) || px(styleValue(cs, 'borderBottomWidth')) || 0;
      if (borderWidth > 0) {
        var borderColor = parseColor(styleValue(cs, 'borderTopColor')) || parseColor(styleValue(cs, 'borderBottomColor'));
        if (borderColor && borderColor.a > 0.05) bump(borderColors, toHex(borderColor), 1, { width: String(round(borderWidth)) });
      }

      var radius = px(styleValue(cs, 'borderTopLeftRadius'));
      if (radius !== null && radius > 0) bump(radii, String(round(radius)), 1, null);

      var shadow = collapse(styleValue(cs, 'boxShadow'));
      if (shadow && shadow !== 'none') bump(shadows, clamp(shadow, 60), 1, null);

      var display = styleValue(cs, 'display');
      if (display.indexOf('flex') >= 0 || display.indexOf('grid') >= 0) {
        var gapPair = gapOf(cs);
        var gapValue = gapPair.column || gapPair.row;
        if (gapValue) bump(gaps, String(round(gapValue)), 1, null);
      }

      var maxWidth = px(styleValue(cs, 'maxWidth'));
      if (maxWidth && maxWidth >= 480 && maxWidth <= 2400) bump(containers, String(round(maxWidth)), 1, null);

      var duration = ms(styleValue(cs, 'transitionDuration')) || ms(styleValue(cs, 'animationDuration'));
      if (duration > 0) {
        bump(durations, String(round(duration)), 1, null);
        var easing = collapse(styleValue(cs, 'transitionTimingFunction')) || collapse(styleValue(cs, 'animationTimingFunction'));
        if (easing && easing !== 'none') bump(easings, clamp(easing.split(',')[0], 48), 1, null);
      }

      var isActionable = tag === 'button' || tag === 'a' || (el.getAttribute && el.getAttribute('role') === 'button');
      if (isActionable && background && background.a > 0.05) {
        var sat = saturation(background);
        var lum = luminance(background);
        if (sat >= 0.25 || lum <= 0.2) bump(accentColors, toHex(background), area, { tag: tag });
      }
    }

    var sectionPaddings = [];
    for (var s = 0; s < sections.length; s += 1) {
      var padding = sections[s].layout.paddingY;
      if (padding[0] > 0) sectionPaddings.push(padding[0]);
      if (padding[1] > 0) sectionPaddings.push(padding[1]);
    }

    return {
      colors: {
        text: rank(textColors, 6, colorMapper),
        background: rank(backgroundColors, 6, colorMapper),
        border: rank(borderColors, 4, colorMapper),
        accent: rank(accentColors, 4, colorMapper)
      },
      fonts: rank(fonts, 4, function (entry) {
        return {
          family: entry.key,
          usage: keysOf(entry.value.extra.usage || {}),
          weights: keysOf(entry.value.extra.weight || {}).sort(),
          count: entry.value.count
        };
      }),
      typeScale: rankNumeric(typeScale, 10, function (entry) {
        return {
          px: Number(entry.key),
          count: entry.value.count,
          tags: keysOf(entry.value.extra.tag || {}).slice(0, 4),
          weights: keysOf(entry.value.extra.weight || {}).sort(),
          lineHeight: keysOf(entry.value.extra.lineHeight || {})[0] || null,
          letterSpacing: keysOf(entry.value.extra.letterSpacing || {})[0] || null
        };
      }),
      spacing: {
        sectionPaddingY: uniqueSorted(sectionPaddings).slice(0, 8),
        gaps: rankNumeric(gaps, 8, countMapper),
        containerMaxWidth: rankNumeric(containers, 4, countMapper),
        rhythmBase: rhythmBase(sectionPaddings.concat(numericKeys(gaps)))
      },
      radius: rankNumeric(radii, 6, countMapper),
      shadow: rank(shadows, 4, function (entry) {
        return { value: entry.key, count: entry.value.count };
      }),
      cssVariables: collectCssVariables(),
      motion: {
        durations: rankNumeric(durations, 6, function (entry) {
          return { ms: Number(entry.key), count: entry.value.count };
        }),
        easings: rank(easings, 4, function (entry) {
          return { value: entry.key, count: entry.value.count };
        })
      }
    };

    function colorMapper(entry) {
      var color = parseColor(entry.key);
      return {
        hex: entry.key,
        count: entry.value.count,
        weight: round(entry.value.weight),
        saturation: color ? saturation(color) : 0,
        luminance: color ? round2(luminance(color)) : 0
      };
    }

    function countMapper(entry) {
      return { px: Number(entry.key), count: entry.value.count };
    }
  }

  function rankNumeric(map, limit, mapper) {
    var entries = [];
    for (var name in map) {
      if (Object.prototype.hasOwnProperty.call(map, name)) entries.push({ key: name, value: map[name] });
    }
    entries.sort(function (a, b) {
      var byCount = b.value.count - a.value.count;
      if (byCount !== 0) return byCount;
      return Number(a.key) - Number(b.key);
    });
    return entries.slice(0, limit).map(mapper);
  }

  function numericKeys(map) {
    return keysOf(map).map(Number).filter(function (value) {
      return isFinite(value) && value > 0;
    });
  }

  function uniqueSorted(values) {
    var seen = {};
    var out = [];
    for (var i = 0; i < values.length; i += 1) {
      var value = round(values[i]);
      if (!seen[value]) {
        seen[value] = true;
        out.push(value);
      }
    }
    return out.sort(function (a, b) {
      return a - b;
    });
  }

  /** 간격 값들이 가장 잘 맞아떨어지는 기준 단위를 고른다. */
  function rhythmBase(values) {
    var candidates = [8, 6, 4, 10, 12, 5];
    var best = null;
    for (var i = 0; i < candidates.length; i += 1) {
      var base = candidates[i];
      var hit = 0;
      for (var j = 0; j < values.length; j += 1) {
        if (values[j] > 0 && values[j] % base === 0) hit += 1;
      }
      var score = values.length ? hit / values.length : 0;
      if (!best || score > best.score + 0.001) best = { base: base, score: round2(score) };
    }
    return best || { base: 8, score: 0 };
  }

  function collectCssVariables() {
    var out = [];
    var seen = {};
    var sheets = safe(function () {
      return Array.prototype.slice.call(doc.styleSheets || []);
    }, []);
    var blocked = 0;
    for (var i = 0; i < sheets.length && out.length < cfg.maxCssVariables; i += 1) {
      var rules = safe(function () {
        return Array.prototype.slice.call(sheets[i].cssRules || []);
      }, null);
      if (rules === null) {
        blocked += 1;
        continue;
      }
      for (var j = 0; j < rules.length && out.length < cfg.maxCssVariables; j += 1) {
        var rule = rules[j];
        var selector = String(rule.selectorText || '');
        if (selector.indexOf(':root') < 0 && selector.indexOf('html') < 0) continue;
        var style = rule.style;
        if (!style) continue;
        var length = Number(style.length) || 0;
        for (var k = 0; k < length && out.length < cfg.maxCssVariables; k += 1) {
          var name = String(style[k] || '');
          if (name.indexOf('--') !== 0 || seen[name]) continue;
          seen[name] = true;
          out.push({ name: name, value: clamp(style.getPropertyValue(name), 48) });
        }
      }
    }
    if (blocked > 0) notes.push('교차 출처 스타일시트 ' + blocked + '개는 CSS 변수 수집에서 제외됨');
    return out;
  }

  /* ------------------------------------------------------------- 미디어 인벤토리 */

  function formatOf(el) {
    var raw = '';
    raw = safe(function () {
      return String(el.currentSrc || el.src || el.getAttribute('src') || '');
    }, '');
    if (!raw) return null;
    var clean = raw.split('?')[0].split('#')[0];
    var parts = clean.split('.');
    var ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    return MEDIA_EXT[ext] ? ext : null;
  }

  function sectionIndexOf(el, sectionNodes) {
    for (var i = 0; i < sectionNodes.length; i += 1) {
      if (safe(function () {
        return sectionNodes[i].contains(el);
      }, false)) {
        return i;
      }
    }
    return null;
  }

  function mediaRole(el, kind, rect, sectionIndex, sections, viewportWidth) {
    var section = sectionIndex === null ? null : sections[sectionIndex];
    var hint = classTokens(el) + ' ' + String((el.getAttribute && el.getAttribute('alt')) || '').toLowerCase();
    if (hint.indexOf('logo') >= 0) return 'logo';
    if (hint.indexOf('avatar') >= 0 || hint.indexOf('profile') >= 0) return 'avatar';
    if (kind === 'background') return 'background';
    if (section && section.roleGuess === 'logo-cloud') return 'logo';
    if (section && section.roleGuess === 'testimonial' && rect.width > 0 && rect.width <= 96) return 'avatar';
    if (section && (section.roleGuess === 'global-nav' || section.roleGuess === 'footer') && rect.width <= 240) return 'logo';
    if (kind === 'svg' && rect.width <= 64 && rect.height <= 64) return 'icon';
    if (rect.width > 0 && rect.width <= 64 && rect.height <= 64) return 'icon';
    if (section && section.roleGuess === 'hero') return 'hero';
    if (rect.width >= viewportWidth * 0.7 && rect.height >= 240) return 'hero';
    if (section && section.repeat && section.repeat.count >= 2) return 'card';
    if (rect.width === 0 && rect.height === 0) return 'other';
    return 'other';
  }

  function collectMedia(sectionNodes, sections, viewportWidth) {
    var out = [];
    var nodes = queryAll(doc, 'img,video,svg,canvas,iframe,picture');
    for (var i = 0; i < nodes.length && out.length < cfg.maxMedia; i += 1) {
      var el = nodes[i];
      if (el.tagName === 'PICTURE') continue;
      if (!isRendered(el)) continue;
      if (el.parentElement && el.parentElement.tagName === 'PICTURE' && el.tagName !== 'IMG') continue;
      var kind = String(el.tagName).toLowerCase();
      var rect = declaredSize(el, rectOf(el));
      var sectionIndex = sectionIndexOf(el, sectionNodes);
      var natural = naturalSizeOf(el, kind);
      out.push({
        kind: kind,
        role: mediaRole(el, kind, rect, sectionIndex, sections, viewportWidth),
        rendered: { width: rect.width, height: rect.height },
        natural: natural,
        ratio: rect.height > 0 ? round2(rect.width / rect.height) : (natural.height > 0 ? round2(natural.width / natural.height) : null),
        sectionIndex: sectionIndex,
        hasAlt: !!(el.getAttribute && collapse(el.getAttribute('alt'))),
        format: formatOf(el),
        isLazy: !!(el.getAttribute && el.getAttribute('loading') === 'lazy')
      });
    }

    var backgroundNodes = queryAll(doc, '*').slice(0, cfg.maxElements);
    for (var j = 0; j < backgroundNodes.length && out.length < cfg.maxMedia; j += 1) {
      var node = backgroundNodes[j];
      if (SKIP_TAGS[node.tagName]) continue;
      var cs = computed(node);
      var image = collapse(styleValue(cs, 'backgroundImage'));
      if (!image || image === 'none' || image.indexOf('url(') < 0) continue;
      var bgRect = rectOf(node);
      var bgSection = sectionIndexOf(node, sectionNodes);
      out.push({
        kind: 'background',
        role: mediaRole(node, 'background', bgRect, bgSection, sections, viewportWidth),
        rendered: { width: bgRect.width, height: bgRect.height },
        natural: { width: 0, height: 0 },
        ratio: bgRect.height > 0 ? round2(bgRect.width / bgRect.height) : null,
        sectionIndex: bgSection,
        hasAlt: false,
        format: null,
        isLazy: false
      });
    }
    return out;
  }

  /**
   * 레이아웃 수치가 없는 환경에서는 width/height 속성값으로 대신한다.
   * 실제 브라우저에서는 rect 가 0이 아니므로 이 대체 경로를 타지 않는다.
   */
  function declaredSize(el, rect) {
    if (rect.width > 0 || rect.height > 0) return rect;
    var width = safe(function () {
      return Number(el.getAttribute('width')) || 0;
    }, 0);
    var height = safe(function () {
      return Number(el.getAttribute('height')) || 0;
    }, 0);
    if (!width && !height) return rect;
    return { x: rect.x, y: rect.y, width: round(width), height: round(height) };
  }

  function naturalSizeOf(el, kind) {
    if (kind === 'img') {
      return { width: round(el.naturalWidth || 0), height: round(el.naturalHeight || 0) };
    }
    if (kind === 'video') {
      return { width: round(el.videoWidth || 0), height: round(el.videoHeight || 0) };
    }
    if (kind === 'svg') {
      var box = safe(function () {
        return String(el.getAttribute('viewBox') || '');
      }, '');
      var parts = box.split(/[\s,]+/);
      if (parts.length === 4) return { width: round(parts[2]), height: round(parts[3]) };
    }
    return { width: 0, height: 0 };
  }

  /* ------------------------------------------------------------------ 내비 수집 */

  function hrefInfo(el) {
    var raw = safe(function () {
      return String(el.getAttribute('href') || '');
    }, '');
    if (!raw) return { path: null, isExternal: false, host: null };
    if (raw.indexOf('#') === 0) return { path: raw, isExternal: false, host: null };
    if (/^(mailto|tel):/i.test(raw)) return { path: raw.split(':')[0] + ':', isExternal: true, host: null };
    var parsed = safe(function () {
      return new view.URL(raw, view.location.href);
    }, null);
    if (!parsed) return { path: raw.indexOf('/') === 0 ? raw : null, isExternal: false, host: null };
    var isExternal = parsed.host !== view.location.host;
    return {
      path: isExternal ? null : parsed.pathname + (parsed.hash || ''),
      isExternal: isExternal,
      host: isExternal ? parsed.host : null
    };
  }

  function looksLikeCta(el) {
    var cs = computed(el);
    var background = parseColor(styleValue(cs, 'backgroundColor'));
    var tokens = classTokens(el);
    if (tokens.indexOf('btn') >= 0 || tokens.indexOf('button') >= 0 || tokens.indexOf('cta') >= 0) return true;
    if (el.getAttribute && el.getAttribute('role') === 'button') return true;
    if (background && background.a > 0.2) return true;
    var radius = px(styleValue(cs, 'borderTopLeftRadius'));
    return !!(radius && radius >= 4 && el.tagName === 'A' && px(styleValue(cs, 'paddingLeft')) >= 12);
  }

  function collectNav(sectionNodes, sections) {
    var headerNode = doc.querySelector('header') || doc.querySelector('[role="banner"]');
    if (!headerNode) {
      for (var h = 0; h < sections.length; h += 1) {
        if (sections[h].roleGuess === 'global-nav') {
          headerNode = sectionNodes[h];
          break;
        }
      }
    }
    var headerLinks = [];
    if (headerNode) {
      var nodes = queryAll(headerNode, 'a[href]');
      for (var i = 0; i < nodes.length && headerLinks.length < 20; i += 1) {
        var text = clamp(collectText(nodes[i], 200), 40);
        if (!text) continue;
        var info = hrefInfo(nodes[i]);
        headerLinks.push({
          text: text,
          path: info.path,
          isExternal: info.isExternal,
          externalHost: info.host,
          isCta: looksLikeCta(nodes[i])
        });
      }
    }

    var footerNode = doc.querySelector('footer') || doc.querySelector('[role="contentinfo"]');
    var footerGroups = [];
    if (footerNode) {
      var groupNodes = queryAll(footerNode, 'ul,nav');
      for (var g = 0; g < groupNodes.length && footerGroups.length < 6; g += 1) {
        var groupLinks = queryAll(groupNodes[g], 'a[href]');
        if (groupLinks.length < 2) continue;
        var links = [];
        for (var j = 0; j < groupLinks.length && links.length < 8; j += 1) {
          var linkText = clamp(collectText(groupLinks[j], 200), 32);
          if (linkText) links.push(linkText);
        }
        footerGroups.push({ title: groupTitle(groupNodes[g]), linkCount: groupLinks.length, links: links });
      }
    }

    var ctas = [];
    var seenCta = {};
    var candidates = queryAll(doc, 'button,a[href],[role="button"],input[type="submit"]');
    for (var c = 0; c < candidates.length && ctas.length < 12; c += 1) {
      var candidate = candidates[c];
      if (!isRendered(candidate)) continue;
      if (!looksLikeCta(candidate)) continue;
      var label = clamp(collectText(candidate, 200) || String((candidate.getAttribute && candidate.getAttribute('value')) || ''), 40);
      if (!label || seenCta[label.toLowerCase()]) continue;
      seenCta[label.toLowerCase()] = true;
      var cs = computed(candidate);
      var background = parseColor(styleValue(cs, 'backgroundColor'));
      ctas.push({
        text: label,
        kind: candidate.tagName === 'A' ? 'link' : 'button',
        sectionIndex: sectionIndexOf(candidate, sectionNodes),
        isPrimary: !!(background && background.a > 0.2),
        path: candidate.tagName === 'A' ? hrefInfo(candidate).path : null
      });
    }

    return {
      header: {
        exists: !!headerNode,
        isSticky: headerNode ? ['sticky', 'fixed'].indexOf(styleValue(computed(headerNode), 'position')) >= 0 : false,
        linkCount: headerNode ? queryAll(headerNode, 'a[href]').length : 0,
        links: headerLinks
      },
      footerGroups: footerGroups,
      ctas: ctas
    };
  }

  function groupTitle(node) {
    var previous = node.previousElementSibling;
    for (var i = 0; i < 3 && previous; i += 1) {
      var text = clamp(collectText(previous, 200), 32);
      if (text) return text;
      previous = previous.previousElementSibling;
    }
    var parentHeading = node.parentElement ? node.parentElement.querySelector('h2,h3,h4,strong') : null;
    return parentHeading ? clamp(collectText(parentHeading, 200), 32) : null;
  }

  /* -------------------------------------------------------------- 라이브러리 감지 */

  function detectLibraries() {
    var found = {};
    var globals = [
      ['gsap', 'gsap'], ['ScrollTrigger', 'gsap-scrolltrigger'], ['Lenis', 'lenis'],
      ['Swiper', 'swiper'], ['THREE', 'three'], ['barba', 'barba'], ['AOS', 'aos'],
      ['jQuery', 'jquery'], ['Alpine', 'alpine'], ['Vue', 'vue'], ['Shopify', 'shopify'],
      ['__NEXT_DATA__', 'next'], ['__NUXT__', 'nuxt'], ['__remixContext', 'remix'],
      ['LocomotiveScroll', 'locomotive-scroll'], ['Webflow', 'webflow']
    ];
    for (var i = 0; i < globals.length; i += 1) {
      if (safe(function () {
        return view[globals[i][0]] !== undefined;
      }, false)) {
        found[globals[i][1]] = true;
      }
    }

    var markers = [
      ['[data-framer-name],[data-framer-appear-id]', 'framer'],
      ['[data-motion],[data-projection-id]', 'framer-motion'],
      ['.swiper,.swiper-wrapper', 'swiper'],
      ['[data-aos]', 'aos'],
      ['[data-scroll-container],[data-scroll]', 'locomotive-scroll'],
      ['[data-reactroot],#__next,#root[data-reactroot]', 'react'],
      ['#__next', 'next'],
      ['#___gatsby', 'gatsby'],
      ['[data-wf-page],[data-wf-site]', 'webflow'],
      ['[data-astro-cid]', 'astro'],
      ['.wp-block-group,body.wordpress', 'wordpress'],
      ['.elementor', 'elementor'],
      ['[data-barba]', 'barba'],
      ['canvas[data-engine]', 'three']
    ];
    for (var j = 0; j < markers.length; j += 1) {
      if (doc.querySelector(markers[j][0])) found[markers[j][1]] = true;
    }

    var scripts = queryAll(doc, 'script[src]');
    var needles = [
      'gsap', 'lenis', 'swiper', 'three', 'framer-motion', 'locomotive', 'barba', 'aos',
      'jquery', 'alpine', 'next', 'nuxt', 'gatsby', 'webflow', 'wp-content', 'shopify', 'squarespace', 'wix'
    ];
    for (var k = 0; k < scripts.length; k += 1) {
      var src = safe(function () {
        return String(scripts[k].getAttribute('src') || '').toLowerCase();
      }, '');
      for (var n = 0; n < needles.length; n += 1) {
        if (src.indexOf(needles[n]) >= 0) found[needles[n] === 'wp-content' ? 'wordpress' : needles[n]] = true;
      }
    }
    return keysOf(found).sort();
  }

  function detectAuthWall() {
    if (doc.querySelector('input[type="password"]')) return true;
    if (doc.querySelector('#challenge-form,.cf-browser-verification,#cf-challenge-running')) return true;
    var path = safe(function () {
      return String(view.location.pathname || '').toLowerCase();
    }, '');
    return /(^|\/)(login|signin|sign-in|auth)(\/|$)/.test(path);
  }

  /* ---------------------------------------------------------------------- 실행 */

  var viewportWidth = round(view.innerWidth || 0);
  var viewportHeight = round(view.innerHeight || 0);

  /**
   * 레이아웃 수치를 쓸 수 있는 환경인지 먼저 확인한다.
   * happy-dom 처럼 레이아웃 계산이 없는 환경에서는 모든 rect 가 0이므로
   * 높이 기반 분할·필터를 끄고 태그·랜드마크 기준으로만 섹션을 나눈다.
   */
  rectBudget.measured = (rectOf(doc.documentElement).height > 0
    || (doc.body ? rectOf(doc.body).height > 0 : false)) ? 1 : 0;
  if (rectBudget.measured === 0) {
    notes.push('레이아웃 수치가 0이라 태그·랜드마크 기준으로만 섹션을 나눔');
  }
  var sectionNodes = gatherSectionNodes();

  var sections = [];
  for (var s = 0; s < sectionNodes.length; s += 1) {
    sections.push(describeSection(sectionNodes[s], sections.length));
  }

  /** 인용 수는 역할 추정에만 쓰므로 별도 필드로 붙였다가 반환 전에 뗀다. */
  for (var q = 0; q < sections.length; q += 1) {
    sections[q].quoteCount = queryAll(sectionNodes[q], 'blockquote,cite,q').length;
  }

  var kept = [];
  var keptNodes = [];
  for (var f = 0; f < sections.length; f += 1) {
    var section = sections[f];
    var tooSmall = rectBudget.measured > 0
      && section.rect.height < cfg.minSectionHeight
      && section.textStats.chars < 40
      && section.mediaCount === 0
      && !LANDMARK_TAGS[String(section.tag).toUpperCase()];
    if (tooSmall) continue;
    if (kept.length >= cfg.maxSections) break;
    section.index = kept.length;
    kept.push(section);
    keptNodes.push(sectionNodes[f]);
  }
  var truncated = sections.length > kept.length;

  for (var r = 0; r < kept.length; r += 1) {
    guessRole(kept[r], r, kept, viewportHeight || 900);
  }
  for (var d = 0; d < kept.length; d += 1) {
    delete kept[d].quoteCount;
  }

  var media = collectMedia(keptNodes, kept, viewportWidth || 1440);
  var tokens = collectTokens(kept);
  var nav = collectNav(keptNodes, kept);

  var documentHeight = safe(function () {
    return round(Math.max(doc.documentElement.scrollHeight || 0, doc.body ? doc.body.scrollHeight || 0 : 0));
  }, 0);

  return {
    meta: {
      title: clamp(doc.title, 160),
      lang: safe(function () {
        return String(doc.documentElement.getAttribute('lang') || '');
      }, '') || null,
      description: clamp(safe(function () {
        var tag = doc.querySelector('meta[name="description"]');
        return tag ? tag.getAttribute('content') : '';
      }, ''), 240),
      path: safe(function () {
        return String(view.location.pathname || '/');
      }, '/'),
      host: safe(function () {
        return String(view.location.host || '');
      }, ''),
      viewport: {
        width: viewportWidth,
        height: viewportHeight,
        dpr: round2(view.devicePixelRatio || 1)
      },
      documentHeight: documentHeight,
      sectionCount: kept.length,
      truncated: truncated,
      rectless: rectBudget.measured === 0,
      libraries: detectLibraries(),
      authWall: detectAuthWall(),
      extractorVersion: '1.0.0',
      notes: notes
    },
    nav: nav,
    sections: kept,
    tokens: tokens,
    media: media
  };
}
