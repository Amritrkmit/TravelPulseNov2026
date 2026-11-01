/* ================================================================
   Travel Pulse — shared map legend  (map-legend.js)
   One legend design, position and wording for EVERY map:
     • Source Market Overview  → respondents per market (5 equal-sized groups, live ranges)
     • Destination / Airline / Hotels → sentiment score (−100 … +100)
   The old per-map legends are hidden (see map-legend.css); the colours on the maps are untouched.
   ================================================================ */
(function () {
  "use strict";

  var HEAT5 = ["#FFF3B0", "#FFE066", "#FFC21A", "#FF9A1F", "#F2600C"];   /* same palette as the Source map */
  var DEFAULT_GRAD = "linear-gradient(to right,#e4003a,#ff7900,#ffd400,#17b800,#008a00,#006f00)";
  var DEFAULT_NODATA = "#c8c8c8";
  var SOURCE_NODATA = "#ddd8ee";

  var SENT_MAPS = [
    { sel: "#airlineSentimentMap", bar: ".sentiment-scale-legend .sentiment-scale-bar", nod: ".sentiment-scale-legend .sentiment-scale-no-data i" },
    { sel: "#hotelSentimentMap",   bar: ".sentiment-scale-legend .sentiment-scale-bar", nod: ".sentiment-scale-legend .sentiment-scale-no-data i" },
    { sel: "#destSentimentMap",    bar: "#destSentimentLegend span[style*='gradient']", nod: null }
  ];

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function bg(node, prop) { try { var v = getComputedStyle(node)[prop]; return v && v !== "none" && v !== "rgba(0, 0, 0, 0)" ? v : null; } catch (e) { return null; } }
  function sw(color) { var s = el("i", "tp-lg-sw"); s.style.background = color; return s; }

  function put(host, key, sig, build) {
    if (!host) return;
    var cur = null;
    for (var i = 0; i < host.children.length; i++) { var c = host.children[i]; if (c.classList && c.classList.contains("tp-maplegend") && c.getAttribute("data-key") === key) cur = c; }
    if (!sig) { if (cur) cur.remove(); return; }
    if (cur && cur.getAttribute("data-sig") === sig) return;          /* nothing changed → no DOM work */
    var fresh = build(); fresh.setAttribute("data-key", key); fresh.setAttribute("data-sig", sig);
    if (cur) cur.replaceWith(fresh); else host.appendChild(fresh);
  }

  function sentimentLegend(grad, noData) {
    var d = el("div", "tp-maplegend");
    d.setAttribute("role", "img");
    d.setAttribute("aria-label", "Map legend. Sentiment score from negative 100 to positive 100. Grey means no data.");
    d.appendChild(el("strong", "tp-lg-t", "Sentiment score"));
    var bar = el("span", "tp-lg-bar"); bar.style.background = grad; d.appendChild(bar);
    d.appendChild(el("span", "tp-lg-neg", "Negative (\u2212100)"));
    d.appendChild(el("span", "tp-lg-neu", "Neutral (0)"));
    d.appendChild(el("span", "tp-lg-pos", "Positive (+100)"));
    var nd = el("span", "tp-lg-nd"); nd.appendChild(sw(noData)); nd.appendChild(document.createTextNode("No data")); d.appendChild(nd);
    return d;
  }

  function sourceLegend(info) {
    var d = el("div", "tp-maplegend");
    d.setAttribute("role", "img");
    d.setAttribute("aria-label", "Map legend. Colour shows the number of survey respondents per source market, in five equal-sized groups from low to high. Grey means no respondents.");
    d.title = "Markets are split into five equal-sized groups by number of survey respondents.";
    d.appendChild(el("strong", "tp-lg-t", "Respondents per market"));
    info.steps.forEach(function (st) {
      var it = el("span", "tp-lg-it"); it.appendChild(sw(st.color)); it.appendChild(document.createTextNode(st.range)); d.appendChild(it);
    });
    var nd = el("span", "tp-lg-nd"); nd.appendChild(sw(SOURCE_NODATA)); nd.appendChild(document.createTextNode("No respondents")); d.appendChild(nd);
    return d;
  }

  /* Buckets exactly as the map draws them (d3.scaleQuantile): a market with n respondents goes to bucket i when
     cut[i-1] <= n < cut[i]. Respondent counts are whole numbers. Steps nobody falls into (possible when many
     markets share the same n) are left out, so the legend only lists colours that really appear on the map. */
  function sourceInfo() {
    var s = window.__tpSourceLegend; if (!s || !s.cuts || !isFinite(s.min)) return null;
    var cuts = s.cuts, steps = [];
    for (var i = 0; i < 5; i++) {
      var lo = i === 0 ? s.min : Math.max(s.min, Math.ceil(cuts[i - 1]));
      var hi = i === 4 ? s.max : Math.min(s.max, Math.ceil(cuts[i]) - 1);
      if (hi < lo) continue;
      steps.push({ color: HEAT5[i], range: lo === hi ? String(lo) : lo + "\u2013" + hi });
    }
    if (!steps.length) return null;
    return { steps: steps, sig: "src|" + steps.map(function (x) { return x.color + x.range; }).join("|") };
  }

  var observed = new WeakSet(), timer = null;
  function sync() {
    var so = document.querySelector("#overviewMap");
    if (so && so.parentElement) {
      var info = sourceInfo();
      put(so.parentElement, "src", info ? info.sig : "", function () { return sourceLegend(info); });
      watch(so.parentElement);
    }
    SENT_MAPS.forEach(function (m) {
      var map = document.querySelector(m.sel); if (!map || !map.parentElement) return;
      var scope = map.parentElement.parentElement || map.parentElement;
      var barEl = scope.querySelector(m.bar) || document.querySelector(m.bar);
      var grad = (barEl && bg(barEl, "backgroundImage")) || DEFAULT_GRAD;
      var nodEl = m.nod ? (scope.querySelector(m.nod) || document.querySelector(m.nod)) : null;
      var nod = (nodEl && bg(nodEl, "backgroundColor")) || DEFAULT_NODATA;
      put(map.parentElement, "sent", "sent|" + grad + "|" + nod, function () { return sentimentLegend(grad, nod); });
      watch(map.parentElement);
    });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(sync, 150); }
  function watch(host) {                       /* maps redraw on their own: keep the legend in step */
    if (observed.has(host)) return; observed.add(host);
    new MutationObserver(schedule).observe(host, { childList: true, subtree: true });
  }

  window.TPMapLegend = { sync: sync };
})();
