/* ================================================================
   Travel Pulse — Page guide  (page-guide.js)
   1. Tab descriptions: a short explanation appears when a tab is hovered / focused.
   2. "About this page" banner on Travel Behaviour (collapsible, remembered).

   The respondent count is live: app-final.js calls TPPageGuide.update(n)
   every time the Behaviour page is rendered (so it follows the filters).
   ================================================================ */
(function () {
  "use strict";

  /* ── 1. tab descriptions (wording from the UX brief) ─────────── */
  var TAB_INFO = {
    "behaviour":        "Assess the traveler's purchase journey: purpose of visit, destinations considered, key consideration criteria, sources of information, booking channels and use of AI in decision making.",
    "travel-sentiment": "Using social media analysis, see how travelers feel about travel and how they view various destinations.",
    "airline":          "Understand preferred airlines, consideration factors and NPS.",
    "hotel":            "Understand preferred hotels, consideration factors and NPS.",
    "segments":         "Compare traveler groups by age and travel budget.",
    "readme":           "A plain-language guide to the dashboard: its purpose, data and methodology, good-to-know notes, and where to find what."
  };

  var tip = null, tipFor = null;

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement("div");
    tip.id = "tpTabTip";
    tip.className = "tp-tabtip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    document.body.appendChild(tip);
    return tip;
  }

  function showTip(btn) {
    var key = btn.getAttribute("data-tab");
    if (!TAB_INFO[key]) return;
    var t = ensureTip();
    t.innerHTML = "";
    var h = document.createElement("b");
    h.textContent = btn.textContent.trim();
    t.appendChild(h);
    t.appendChild(document.createTextNode(TAB_INFO[key]));
    t.hidden = false;
    var r = btn.getBoundingClientRect();
    var w = t.offsetWidth;
    var left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
    t.style.left = left + "px";
    t.style.top = (r.bottom + 8) + "px";
    t.style.setProperty("--arrow-x", Math.max(14, Math.min(r.left + r.width / 2 - left - 7, w - 28)) + "px");
    tipFor = btn;
  }

  function hideTip() {
    if (tip) tip.hidden = true;
    tipFor = null;
  }

  function initTabTips() {
    document.querySelectorAll(".tab[data-tab]").forEach(function (btn) {
      if (!TAB_INFO[btn.getAttribute("data-tab")]) return;
      btn.setAttribute("aria-describedby", "tpTabTip");
      btn.addEventListener("mouseenter", function () { showTip(btn); });
      btn.addEventListener("focus",      function () { showTip(btn); });
      btn.addEventListener("mouseleave", hideTip);
      btn.addEventListener("blur",       hideTip);
      btn.addEventListener("click",      hideTip);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hideTip(); });
    window.addEventListener("scroll", hideTip, { passive: true });
  }

  /* ── 2. "About this page" banner (Travel Behaviour) ──────────── */
  var STORE_KEY = "tpPageGuide.behaviour.collapsed";
  function readCollapsed() { try { return window.localStorage.getItem(STORE_KEY) === "1"; } catch (e) { return false; } }
  function writeCollapsed(v) { try { window.localStorage.setItem(STORE_KEY, v ? "1" : "0"); } catch (e) { /* storage blocked — fine */ } }

  var guide = null, nEl = null, lastN = null;

  var QUESTIONS = [
    "Who is travelling, and with whom?",
    "What drives the trip, and where do travelers want to go?",
    "How do travelers research, budget and book?",
    "How likely are travelers to use AI tools on a trip?"
  ];

  function buildBehaviourGuide() {
    var panel = document.querySelector('.tab-panel[data-panel="behaviour"]');
    if (!panel || panel.querySelector(".tp-guide")) return;

    guide = document.createElement("section");
    guide.className = "tp-guide";
    guide.setAttribute("aria-label", "About this page");
    guide.innerHTML =
      '<div class="tp-guide-full">' +
        '<div class="tp-guide-ico" aria-hidden="true">i</div>' +
        '<div class="tp-guide-body">' +
          '<h3>About this page — Travel Behaviour</h3>' +
          '<p>Follow the traveler\u2019s purchase journey: the purpose of the trip, destinations considered, what travelers weigh up, ' +
          'where they find information and book, and how they would use AI. Start with <b>who is travelling</b>, then step through ' +
          '<b>Inspire</b>, <b>Plan</b>, <b>Book</b> and <b>During trip</b>. Use the filters above to compare markets, ages, incomes and segments.</p>' +
          '<p class="tp-guide-src"><b>Data:</b> Travel Pulse survey \u00b7 <b>Base:</b> <span class="tp-guide-n">\u2014</span> respondents (current filters)</p>' +
          '<div class="tp-guide-qt">QUESTIONS THIS PAGE HELPS ANSWER</div>' +
          '<ul class="tp-guide-q"></ul>' +
        '</div>' +
        '<button type="button" class="tp-guide-btn tp-guide-hide" aria-expanded="true">Hide \u2715</button>' +
      '</div>' +
      '<div class="tp-guide-slim">' +
        '<span class="tp-guide-ico tp-guide-ico-sm" aria-hidden="true">i</span>' +
        '<span class="tp-guide-slim-text">About this page \u00b7 Travel Behaviour</span>' +
        '<button type="button" class="tp-guide-btn tp-guide-show" aria-expanded="false">Show</button>' +
      '</div>';

    var ul = guide.querySelector(".tp-guide-q");
    QUESTIONS.forEach(function (q) { var li = document.createElement("li"); li.textContent = q; ul.appendChild(li); });

    nEl = guide.querySelector(".tp-guide-n");
    guide.querySelector(".tp-guide-hide").addEventListener("click", function () { setCollapsed(true); });
    guide.querySelector(".tp-guide-show").addEventListener("click", function () { setCollapsed(false); });

    panel.insertBefore(guide, panel.firstChild);
    guide.classList.toggle("is-collapsed", readCollapsed());
    if (lastN !== null) update(lastN);
  }

  function setCollapsed(v) {
    if (!guide) return;
    guide.classList.toggle("is-collapsed", v);
    writeCollapsed(v);
    var target = guide.querySelector(v ? ".tp-guide-show" : ".tp-guide-hide");
    if (target) target.focus({ preventScroll: true });
  }

  function update(n) {
    lastN = n;
    if (nEl && Number.isFinite(n)) nEl.textContent = Number(n).toLocaleString("en-US");
  }

  function init() { initTabTips(); buildBehaviourGuide(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.TPPageGuide = { update: update };
})();
