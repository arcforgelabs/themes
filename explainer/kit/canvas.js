/* ExCanvas: a full-window canvas for any explainer figure.
   Every figure that holds a vector graphic gets an Expand button. The button opens the same
   figure on a canvas that fills the window, with a hand tool (drag to move), a select tool
   (click parts, shift-click or drag a box to select many), zoom buttons, the mouse wheel and
   pinch. Parts keep their pop-ups. Esc closes. Tokens only; no literal colours.
   Load it after charts.js and draw.js and before explainer.js. It needs nothing else. */
(function () {
  'use strict';
  var CSS = [
    '.ex-canvas-host { position: relative; }',
    '.ex-expand { position: absolute; top: 8px; right: 8px; z-index: 3; display: inline-flex; align-items: center; gap: 6px; padding: 5px 9px; border: 1px solid var(--border-strong); border-radius: var(--radius-full); background: var(--card); color: var(--muted); font: 500 11px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; cursor: pointer; opacity: .85; }',
    '.ex-expand:hover, .ex-expand:focus-visible { color: var(--text-strong); border-color: var(--text-strong); opacity: 1; }',
    '.ex-expand:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }',
    // The Expand button sits inside .ex-figure, so the figure rule `.ex-figure svg { width: 100%; min-width: 760px }`
    // in explainer.css reaches its icon too. This selector is more specific, and min-width resets that rule.
    '.ex-figure .ex-expand svg, .ex-expand svg { flex: none; width: 14px; height: 14px; min-width: 0; }',
    '.ex-canvas { position: fixed; inset: 0; z-index: 18; display: grid; grid-template-rows: auto 1fr; background: var(--bg-accent); color: var(--text); font-family: var(--font-body); }',
    '.ex-canvas-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; padding: 10px max(16px, env(safe-area-inset-right, 0px)) 10px max(16px, env(safe-area-inset-left, 0px)); border-bottom: 1px solid var(--border); background: var(--card); }',
    '.ex-canvas-bar h3 { margin: 0 auto 0 0; font: 600 14px var(--font-body); color: var(--text-strong); }',
    '.ex-canvas-bar .ex-seg button { padding: 4px 10px; gap: 6px; }',
    '.ex-canvas-bar .ex-seg button svg { width: 14px; height: 14px; }',
    '.ex-canvas-pct { min-width: 52px; text-align: center; }',
    '.ex-canvas-x { all: unset; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid var(--border-strong); border-radius: var(--radius-full); color: var(--text-strong); font: 500 16px var(--font-mono); }',
    '.ex-canvas-x:hover { border-color: var(--text-strong); }',
    '.ex-canvas-x:focus-visible, .ex-canvas-side button:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }',
    '.ex-canvas-stage { position: relative; overflow: hidden; touch-action: none; cursor: grab; }',
    '.ex-canvas-stage.ex-canvas-drag { cursor: grabbing; }',
    '.ex-canvas-stage.ex-canvas-selmode { cursor: crosshair; }',
    '.ex-canvas-view { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform; }',
    '.ex-canvas-view.ex-figure { border: 0; border-radius: 0; background: none; overflow: visible; }',
    '.ex-canvas-view svg { min-width: 0; width: auto; height: auto; }',
    '.ex-canvas-marks { position: absolute; inset: 0; pointer-events: none; }',
    '.ex-canvas-mark { position: absolute; border: 2px solid var(--accent); border-radius: var(--radius-sm); box-shadow: 0 0 0 3px var(--card); }',
    '.ex-canvas-box { position: absolute; border: 1px dashed var(--accent); background: var(--accent-subtle); opacity: .5; pointer-events: none; }',
    '.ex-canvas-side { position: absolute; right: 12px; bottom: 12px; z-index: 2; width: min(300px, calc(100vw - 24px)); max-height: 45%; overflow: auto; display: grid; gap: 6px; padding: 10px 12px; border: 1px solid var(--border-strong); border-radius: var(--radius-lg); background: var(--card); box-shadow: var(--shadow-lg); }',
    '.ex-canvas-side[hidden] { display: none; }',
    '.ex-canvas-side header { display: flex; align-items: center; gap: 8px; font: 500 11px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }',
    '.ex-canvas-side header button { all: unset; cursor: pointer; margin-left: auto; color: var(--text-strong); font: 500 11px var(--font-mono); text-decoration: underline; }',
    '.ex-canvas-side .ex-cellbtn { display: block; width: 100%; text-align: left; font: 500 13px var(--font-body); color: var(--text-strong); padding: 3px 0; }',
    '.ex-canvas-hint { position: absolute; left: 12px; bottom: 12px; z-index: 2; padding: 6px 10px; border-radius: var(--radius-sm); background: var(--card); border: 1px solid var(--border); color: var(--muted); font: 400 11px var(--font-mono); }',
    'body.ex-canvas-open { overflow: hidden; }',
    'body.ex-canvas-open .ex-theme, body.ex-canvas-open .ex-rail { visibility: hidden; }',
    '@media (max-width: 640px) { .ex-canvas-hint { display: none; } .ex-canvas-bar h3 { flex-basis: 100%; } }'
  ].join('\n');

  var ICON = {
    expand: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9"/></svg>',
    hand: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8V3.2a1 1 0 0 1 2 0V7m0-4.5a1 1 0 0 1 2 0V7m0-3.5a1 1 0 0 1 2 0V8m0-2a1 1 0 0 1 2 0v4.2c0 2.4-1.8 4.3-4.2 4.3H8.3c-1.2 0-2.3-.5-3.1-1.4L2.8 10.6a1 1 0 0 1 1.5-1.3L5 10"/></svg>',
    select: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2.5 13 7.2l-4.3 1.3L7.2 13z"/></svg>'
  };

  var style = document.createElement('style');
  style.setAttribute('data-ex-canvas', '');
  style.textContent = CSS;
  document.head.appendChild(style);

  function hostOf(svg) {
    var el = svg.parentNode;
    while (el && el !== document.body) {
      if (el.classList && (el.classList.contains('ex-figure') || el.hasAttribute('data-canvas'))) return el;
      el = el.parentNode;
    }
    return null;
  }

  function attach(root) {
    (root || document).querySelectorAll('svg[viewBox]').forEach(function (svg) {
      if (svg.closest('.ex-canvas, .ex-expand, .ex-seg, .ex-pop, button')) return;
      var host = hostOf(svg);
      if (!host || host.getAttribute('data-canvas') === 'off' || host.querySelector(':scope > .ex-expand')) return;
      var vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
      if (vb.length < 4 || vb[2] < 320 || vb[3] < 120) return;
      host.classList.add('ex-canvas-host');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ex-expand';
      b.setAttribute('aria-label', 'Open this figure on a full-window canvas');
      b.innerHTML = ICON.expand + '<span>Expand</span>';
      b.addEventListener('click', function (e) { e.stopPropagation(); open(host); });
      host.appendChild(b);
    });
  }

  var cur = null;

  function titleFor(host) {
    var sec = host.closest('section'), h = sec && sec.querySelector('h2, h3');
    return h ? h.textContent.replace(/^\s*\d+\s*/, '').trim() : (document.title || 'Figure');
  }

  function open(host) {
    if (cur) close();
    var svg = host.querySelector('svg[viewBox]'), vb = svg.getAttribute('viewBox').split(/[\s,]+/).map(Number);
    var W = vb[2], H = vb[3], tool = 'hand', k = 1, x = 0, y = 0, sel = [];
    var c = document.createElement('div');
    c.className = 'ex-canvas'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-modal', 'true'); c.setAttribute('aria-label', titleFor(host) + ' on a full-window canvas');
    c.innerHTML = '<div class="ex-canvas-bar"><h3></h3>' +
      '<div class="ex-seg" role="group" aria-label="Tool"><button type="button" data-tool="hand" aria-pressed="true">' + ICON.hand + 'Hand</button><button type="button" data-tool="select" aria-pressed="false">' + ICON.select + 'Select</button></div>' +
      '<div class="ex-seg" role="group" aria-label="Zoom"><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" class="ex-canvas-pct" data-zoom="fit" aria-label="Fit the figure">100%</button><button type="button" data-zoom="in" aria-label="Zoom in">+</button></div>' +
      '<button type="button" class="ex-canvas-x" aria-label="Close the canvas">×</button></div>' +
      '<div class="ex-canvas-stage"><div class="ex-canvas-view ex-figure"></div><div class="ex-canvas-marks"></div>' +
      '<aside class="ex-canvas-side" hidden><header><span class="ex-canvas-n"></span><button type="button" data-act="clear">Clear</button></header><div class="ex-canvas-list"></div></aside>' +
      '<div class="ex-canvas-hint">Wheel or pinch zooms · drag moves · Esc closes</div></div>';
    c.querySelector('h3').textContent = titleFor(host);
    var stage = c.querySelector('.ex-canvas-stage'), view = c.querySelector('.ex-canvas-view'), marks = c.querySelector('.ex-canvas-marks');
    var side = c.querySelector('.ex-canvas-side'), list = c.querySelector('.ex-canvas-list'), pct = c.querySelector('.ex-canvas-pct');
    // Clone the figure without its Expand button. The clone keeps every data-ex part, so pop-ups work.
    var clone = svg.cloneNode(true);
    clone.removeAttribute('width'); clone.removeAttribute('height');
    clone.style.width = W + 'px'; clone.style.height = H + 'px';
    clone.querySelectorAll('[id]').forEach(function (el) { el.id = 'exc-' + el.id; });
    // Keep url(#id) references (markers, gradients, motion paths) pointing at the renamed ids.
    clone.querySelectorAll('*').forEach(function (el) {
      ['marker-end', 'marker-start', 'fill', 'stroke', 'mask', 'clip-path', 'filter', 'href'].forEach(function (a) {
        var v = el.getAttribute(a); if (v && v.indexOf('#') >= 0) el.setAttribute(a, v.replace(/#([A-Za-z0-9_:.-]+)/g, '#exc-$1'));
      });
      var mp = el.tagName === 'mpath' && el.getAttribute('href'); if (mp) el.setAttribute('href', mp);
    });
    view.appendChild(clone);
    document.body.appendChild(c); document.body.classList.add('ex-canvas-open');
    cur = { el: c, host: host, back: document.activeElement };

    function apply() { view.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + k + ')'; pct.textContent = Math.round(k * 100) + '%'; drawMarks(); }
    function fit() { var r = stage.getBoundingClientRect(); k = Math.min(r.width / W, r.height / H) * 0.94; x = (r.width - W * k) / 2; y = (r.height - H * k) / 2; apply(); }
    function zoomAt(f, cx, cy) { var r = stage.getBoundingClientRect(); if (cx == null) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; } var px = cx - r.left, py = cy - r.top, nk = Math.min(12, Math.max(0.1, k * f)); f = nk / k; x = px - (px - x) * f; y = py - (py - y) * f; k = nk; apply(); }
    function drawMarks() {
      var r = stage.getBoundingClientRect();
      marks.innerHTML = sel.map(function (el) { var b = el.getBoundingClientRect(); return '<div class="ex-canvas-mark" style="left:' + (b.left - r.left - 3) + 'px;top:' + (b.top - r.top - 3) + 'px;width:' + (b.width + 2) + 'px;height:' + (b.height + 2) + 'px"></div>'; }).join('');
      side.hidden = !sel.length; stage.classList.toggle('ex-canvas-selmode', tool === 'select');
      c.querySelector('.ex-canvas-n').textContent = sel.length + ' selected';
      var EX = window.EX || {};
      list.textContent = '';
      sel.forEach(function (el) { var key = el.getAttribute('data-ex'), d = EX[key], b = document.createElement('button'); b.type = 'button'; b.className = 'ex-cellbtn'; b.setAttribute('data-ex', key); b.textContent = d ? d.t : key; list.appendChild(b); });
    }
    function toggle(el, add) { var i = sel.indexOf(el); if (!add) sel = i >= 0 && sel.length === 1 ? [] : [el]; else if (i >= 0) sel.splice(i, 1); else sel.push(el); drawMarks(); }
    function setTool(t) { tool = t; c.querySelectorAll('[data-tool]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.tool === t)); }); drawMarks(); }

    c.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tool], [data-zoom], .ex-canvas-x, [data-act]'); if (!b) return;
      e.stopPropagation();
      if (b.dataset.tool) setTool(b.dataset.tool);
      else if (b.dataset.zoom === 'fit') fit(); else if (b.dataset.zoom) zoomAt(b.dataset.zoom === 'in' ? 1.4 : 1 / 1.4);
      else if (b.dataset.act === 'clear') { sel = []; drawMarks(); }
      else close();
    });
    stage.addEventListener('wheel', function (e) { e.preventDefault(); zoomAt(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015)), e.clientX, e.clientY); }, { passive: false });

    var pts = {}, pinch = null, last = null, start = null, moved = false, box = null, dragSel = false;
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ex-canvas-side') || (e.pointerType === 'mouse' && e.button !== 0)) return;
      pts[e.pointerId] = [e.clientX, e.clientY]; start = last = [e.clientX, e.clientY]; moved = false;
      var ids = Object.keys(pts); if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); }
      dragSel = tool === 'select' && !e.target.closest('[data-ex]');
    });
    stage.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return; pts[e.pointerId] = [e.clientX, e.clientY];
      var ids = Object.keys(pts);
      if (ids.length >= 2 && pinch) { var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]); zoomAt(d / pinch, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); pinch = d; moved = true; return; }
      if (!moved && Math.hypot(e.clientX - start[0], e.clientY - start[1]) < 5) return;
      // Capture only once a drag starts: capture on pointerdown would retarget the click to the stage, and a part would never select or open.
      if (!moved) { moved = true; try { stage.setPointerCapture(e.pointerId); } catch (x) {} }
      if (dragSel) {
        var r = stage.getBoundingClientRect();
        if (!box) { box = document.createElement('div'); box.className = 'ex-canvas-box'; marks.appendChild(box); }
        var l = Math.min(start[0], e.clientX) - r.left, t = Math.min(start[1], e.clientY) - r.top;
        box.style.left = l + 'px'; box.style.top = t + 'px'; box.style.width = Math.abs(e.clientX - start[0]) + 'px'; box.style.height = Math.abs(e.clientY - start[1]) + 'px';
        return;
      }
      stage.classList.add('ex-canvas-drag');
      x += e.clientX - last[0]; y += e.clientY - last[1]; last = [e.clientX, e.clientY]; apply();
    });
    function up(e) {
      delete pts[e.pointerId]; if (Object.keys(pts).length < 2) pinch = null; stage.classList.remove('ex-canvas-drag');
      if (box) {
        var b = box.getBoundingClientRect(); box.remove(); box = null;
        var hits = [].filter.call(view.querySelectorAll('[data-ex]'), function (el) { var q = el.getBoundingClientRect(); return q.width && q.left < b.right && q.right > b.left && q.top < b.bottom && q.bottom > b.top; });
        if (!e.shiftKey) sel = []; hits.forEach(function (el) { if (sel.indexOf(el) < 0) sel.push(el); }); drawMarks();
      }
      var r = Object.keys(pts)[0]; if (r) last = pts[r];
    }
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    cur.stage = stage; cur.tool = function () { return tool; }; cur.moved = function () { var m = moved; moved = false; return m; };
    cur.toggle = toggle; cur.clear = function () { sel = []; drawMarks(); };
    c.addEventListener('keydown', function (e) {
      var pop = document.querySelector('.ex-pop');
      if (e.key === 'Escape') { if (pop && !pop.hidden) return; e.stopPropagation(); close(); return; }
      if (e.target.closest('input, textarea')) return;
      var st = 60;
      if (e.key === '+' || e.key === '=') zoomAt(1.25); else if (e.key === '-' || e.key === '_') zoomAt(0.8); else if (e.key === '0') fit();
      else if (e.key === 'h' || e.key === 'H') setTool('hand'); else if (e.key === 'v' || e.key === 'V' || e.key === 's' || e.key === 'S') setTool('select');
      else if (e.key === 'ArrowLeft') { x += st; apply(); } else if (e.key === 'ArrowRight') { x -= st; apply(); }
      else if (e.key === 'ArrowUp') { y += st; apply(); } else if (e.key === 'ArrowDown') { y -= st; apply(); } else return;
      e.preventDefault();
    });
    addEventListener('resize', onResize);
    function onResize() { drawMarks(); }
    cur.off = function () { removeEventListener('resize', onResize); };
    stage.tabIndex = 0; stage.setAttribute('aria-label', 'Canvas. Plus and minus zoom, zero fits, arrow keys move, H hand tool, V select tool.');
    document.dispatchEvent(new CustomEvent('ex:drawn'));
    fit();
    c.querySelector('.ex-canvas-x').focus();
  }

  function close() {
    if (!cur) return;
    var pop = document.querySelector('.ex-pop'); if (pop && !pop.hidden && pop.contains(document.activeElement)) pop.hidden = true;
    cur.off(); cur.el.remove(); document.body.classList.remove('ex-canvas-open');
    var back = cur.back; cur = null;
    if (back && back.isConnected) back.focus();
  }

  // In select mode a click on a part selects it instead of opening its pop-up, and a click that ends a drag does
  // nothing. This listener is registered at load, before the runtime's, so it runs first in the capture phase.
  document.addEventListener('click', function (e) {
    if (!cur || !cur.stage || !cur.stage.contains(e.target) || e.target.closest('.ex-canvas-side')) return;
    if (cur.moved()) { e.stopImmediatePropagation(); e.preventDefault(); return; }
    if (cur.tool() !== 'select') return;
    e.stopImmediatePropagation(); e.preventDefault();
    var p = e.target.closest('[data-ex]');
    if (p) cur.toggle(p, e.shiftKey || e.ctrlKey || e.metaKey); else if (!e.shiftKey) cur.clear();
  }, true);

  window.ExCanvas = { attach: attach, open: open, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { attach(); }); else attach();
  document.addEventListener('ex:drawn', function () { attach(); });
})();
