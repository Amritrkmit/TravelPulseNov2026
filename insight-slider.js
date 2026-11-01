/* ================================================================
   Travel Pulse — Insight Slider  (insight-slider.js)
   Turns an existing  .insight-banner  into a slider of insights.

   Usage (from app code):
     TPInsightSlider.set("airlineInsight", [ "<b>Emirates</b> leads …", "…" ]);
   - the first argument is the id of the text element INSIDE the banner
   - slides are HTML strings (escape any data you put in them!)
   - the current slide is remembered when the slides are re-built
     (e.g. after a filter change), so the slider doesn't jump back.
   ================================================================ */
(function () {
  "use strict";

  var STATE = {};   /* id -> { idx, slides, ui, timer, paused } */

  /* AUTO-ADVANCE: 8 s by default. Change it from anywhere BEFORE the slider loads with
       window.TP_INSIGHT_AUTOPLAY_MS = 6000;      (use 0 to turn auto-advance off)      */
  function autoplayMs() {
    var v = window.TP_INSIGHT_AUTOPLAY_MS;
    return (typeof v === "number" && v >= 0) ? v : 8000;
  }
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function schedule(id) {
    var st = STATE[id];
    if (!st) return;
    clearTimeout(st.timer);
    var ms = autoplayMs();
    if (!ms || REDUCED || st.paused || !st.slides || st.slides.length < 2) return;
    st.timer = setTimeout(function () {
      /* only move on when this tab is on screen; otherwise just wait another round */
      var shown = st.ui && st.ui.banner.offsetParent !== null && !document.hidden;
      if (shown) go(id, st.idx + 1); else schedule(id);
    }, ms);
  }

  var CHEV_L = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
  var CHEV_R = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

  function make(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  function buildUi(id, textEl, banner) {
    var st = STATE[id];

    textEl.classList.add("insight-slide-text");
    textEl.setAttribute("aria-live", "polite");
    banner.classList.add("insight-slider");

    /* prev / counter / next — inside the banner */
    var nav = make("div", "insight-nav");
    var count = make("span", "insight-count");
    var prev = make("button", "insight-nav-btn insight-prev", { type: "button", "aria-label": "Previous insight" });
    var next = make("button", "insight-nav-btn insight-next", { type: "button", "aria-label": "Next insight" });
    prev.innerHTML = CHEV_L;
    next.innerHTML = CHEV_R;
    nav.appendChild(count); nav.appendChild(prev); nav.appendChild(next);
    banner.appendChild(nav);

    /* progress segments — directly under the banner */
    var bar = make("div", "insight-progress", { "data-for": id });
    banner.parentNode.insertBefore(bar, banner.nextSibling);

    prev.addEventListener("click", function () { go(id, st.idx - 1); });
    next.addEventListener("click", function () { go(id, st.idx + 1); });
    banner.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft")  { go(id, st.idx - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { go(id, st.idx + 1); e.preventDefault(); }
    });

    function pause()  { st.paused = true;  clearTimeout(st.timer); }
    function resume() { st.paused = false; schedule(id); }
    [banner, bar].forEach(function (n) {
      n.addEventListener("mouseenter", pause);
      n.addEventListener("mouseleave", resume);
      n.addEventListener("focusin", pause);
      n.addEventListener("focusout", resume);
    });

    st.ui = { banner: banner, textEl: textEl, nav: nav, count: count, bar: bar };
  }

  function go(id, i) {
    var st = STATE[id];
    if (!st || !st.slides.length) return;
    var n = st.slides.length;
    st.idx = ((i % n) + n) % n;
    paint(id, true);
    schedule(id);
  }

  function paint(id, animate) {
    var st = STATE[id], ui = st.ui, n = st.slides.length;
    ui.textEl.innerHTML = '<span class="insight-slide-inner">' + st.slides[st.idx] + '</span>';

    if (animate) {
      ui.textEl.classList.remove("insight-fade");
      void ui.textEl.offsetWidth;                 /* restart the CSS animation */
      ui.textEl.classList.add("insight-fade");
    }

    var many = n > 1;
    ui.nav.hidden = !many;
    ui.bar.hidden = !many;
    ui.banner.classList.toggle("insight-single", !many);
    ui.count.textContent = (st.idx + 1) + " / " + n;

    /* progress segments (rebuilt only when the slide count changes) */
    if (ui.bar.children.length !== n) {
      ui.bar.innerHTML = "";
      for (var k = 0; k < n; k++) {
        (function (k) {
          var seg = make("button", "insight-seg", { type: "button", "aria-label": "Insight " + (k + 1) + " of " + n });
          seg.addEventListener("click", function () { go(id, k); });
          ui.bar.appendChild(seg);
        })(k);
      }
    }
    for (var j = 0; j < n; j++) {
      var seg = ui.bar.children[j];
      seg.classList.toggle("is-active", j === st.idx);
      seg.classList.toggle("is-seen", j < st.idx);
      if (j === st.idx) seg.setAttribute("aria-current", "true"); else seg.removeAttribute("aria-current");
    }
  }

  function set(id, slides) {
    var textEl = document.getElementById(id);
    if (!textEl) return;
    var banner = textEl.closest(".insight-banner");
    if (!banner) { textEl.innerHTML = (slides && slides[0]) || ""; return; }   /* graceful fallback */

    var st = STATE[id] || (STATE[id] = { idx: 0, slides: [], ui: null });
    st.slides = (slides || []).filter(function (s) { return typeof s === "string" && s.trim(); });

    if (!st.ui || !document.body.contains(st.ui.banner)) buildUi(id, textEl, banner);

    if (!st.slides.length) {
      textEl.textContent = "";
      st.ui.nav.hidden = true; st.ui.bar.hidden = true;
      clearTimeout(st.timer);
      return;
    }
    if (st.idx >= st.slides.length) st.idx = 0;
    paint(id, false);
    schedule(id);
  }

  /* stop while the browser tab is in the background, restart when it comes back */
  document.addEventListener("visibilitychange", function () {
    Object.keys(STATE).forEach(function (id) {
      if (document.hidden) clearTimeout(STATE[id].timer); else schedule(id);
    });
  });

  window.TPInsightSlider = { set: set, go: go };
})();
