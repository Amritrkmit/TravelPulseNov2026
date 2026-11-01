/* ================================================================
   Travel Pulse — Read Me tab  (readme.js)
   Builds the "Read Me" page from the user guide.

   ► EDIT THE TEXT BELOW (the README object). Nothing else needs to change.
   ► Numbers that come from the data are filled in automatically:
       {n}        = survey respondents
       {markets}  = number of source markets in the survey data
   ► Use **double asterisks** for bold.
   ================================================================ */
(function () {
  "use strict";

  var README = {
    kicker: "ESCALENT TRAVEL PULSE 2026",
    title: "Travel Intelligence Dashboard \u2014 User Guide",

    intro: "Travelers are balancing changing priorities, budgets and expectations, while new tools and channels reshape how trips are planned and booked. This dashboard gives a traveler-centric view of international travel behavior across {markets} source markets. It combines **social listening** with a **primary survey (n = {n})** to show how travelers perceive travel today, and how they plan, decide, book and spend, including their choice of destinations, airlines and hotels.",
    coverage: "Leisure, business and bleisure travelers (business trips extended with leisure), and different travel classes (cabin class, accommodation type), so premium and value-driven behavior can be compared. The dashboard supports exploratory analysis, strategy discussions, client presentations and monitoring across waves.",

    insights: [
      "Sentiment shifts by market, destination, airline and hotel",
      "Trip and planning patterns: purpose, duration, companions, lead time",
      "Channel effectiveness: where travelers research versus where they book",
      "Decision drivers and what is booked on arrival",
      "Budget outlook and the trade-offs travelers make",
      "Experience and destination demand",
      "Brand preference and advocacy (NPS) for airlines and hotels",
      "AI adoption: likelihood of use and tasks travelers would delegate",
      "Differences by age and budget segment"
    ],

    questions: [
      "How do travelers perceive travel, and how is sentiment shifting across waves?",
      "How do they plan and book international trips (purpose, duration, companions, lead time, channels)?",
      "Which destinations and experiences are they seeking?",
      "What drives their decisions, what do they book only on arrival, and how likely are they to use AI tools during a trip?",
      "Which airlines and hotels do they prefer, why, and how likely are they to recommend them?",
      "How do they manage their travel budget, and what changes when spending falls or rises?"
    ],

    social: {
      title: "Social listening (sentiment)",
      lead: "Analyzes travel-related conversations on digital and social platforms, with keyword themes behind each shift.",
      points: [
        "**Sentiment score:** (positive \u2212 negative) \u00f7 total sentiments \u00d7 100, from \u2212100 (negative) through 0 (neutral) to +100 (positive).",
        "Reported in **four waves**. Each wave shows the score, the positive/neutral/negative split and the volume of mentions.",
        "The Airline and Hotels tabs show the current period (Jun\u2013Jul 2026)."
      ],
      waves: [["W1", "Jan\u2013Feb 2026"], ["W2", "Mar 2026"], ["W3", "Apr\u2013May 2026"], ["W4", "Jun\u2013Jul 2026"]]
    },
    survey: {
      title: "Primary survey (behavior and preferences)",
      points: [
        "**Sample:** {n} respondents across {markets} source markets.",
        "**Respondent profile:** aged 18+; took an international flight for leisure or business in the past 12 months; involved in decisions about their international travel."
        /* TODO (to confirm): the original Read Me also says "Survey wave: Wave 1 is the baseline for the next
           international trip; future waves will allow wave-on-wave comparison". The data file labels this
           survey "Wave 2", so that line is left out until the wording is confirmed. */
      ]
    },

    notes: [
      "Social sentiment reflects online conversations and is directional.",
      "Survey data reflects stated intent for the next international trip and may change across waves.",
      "Market and segment samples vary. Small bases are directional.",
      "Some questions are asked of subsets only, so base sizes differ across charts.",
      "\"No data\" on a map, or missing values, mean limited mentions for that market or brand."
    ],

    filters: {
      title: "Filters (top panel)",
      text: "Region / Country, Age, Income, Segments and Traveler Type. Use **Reset** to return to all regions and countries with no other filters. The dashboard shows an \"Updating dashboard...\" message while it recalculates. **Segments Analysis has its own Region / Country filter only.**"
    },
    interact: {
      title: "Interacting",
      points: [
        "Use the dropdowns rather than clicking chart elements, so every visual stays in sync.",
        "Hover over a bar or segment for the exact value.",
        "On map views, click a country to drill into that market. Click it again, or use **Clear selection**, to go back.",
        "Use the journey buttons (Inspire, Plan, Book, During trip) to move through Travel Behaviour."
      ]
    },

    views: [
      { tab: "behaviour", name: "Travel Behaviour",
        lead: "Starts with a traveler profile: Marital Status, Children in Household and Trip Companion. Below it, four journey stages organize the analysis.",
        stages: [
          ["Inspire", "Primary purpose of the trip; key destinations considered; key experiences sought"],
          ["Plan", "Key information channels; key trip considerations; booking lead time; planned travel period; segment by budget (Budget, Premium, Luxury); trip duration (nights); budget change over the next 12 months; budget change reasons (toggle between Reasons for Decrease and Reasons for Increase)"],
          ["Book", "Finalized destinations; booking sequence (average rank of flights, accommodation, visa, local transport, insurance and activities); booking channels; package type"],
          ["During trip", "On-site bookings and activities; AI tool usage likelihood during a trip (top-2-box); AI tasks travelers would be comfortable with"]
        ],
        look: "Gaps between research and booking channels; short versus long booking windows; segments with a falling spend outlook and what they cut; the tasks travelers would delegate to AI." },
      { tab: "travel-sentiment", name: "Travel Sentiment",
        points: [
          "**Source Market Overview:** a gradient map shows the sentiment score for each source market. Click a country to see its market detail.",
          "**Destination Market Overview:** the same view by destination, showing how sentiment toward each destination is shifting.",
          "**Wave gauges (W1 to W4):** the score for each wave, with the positive/neutral/negative split.",
          "**Score summary table:** positive, neutral and negative shares for a destination from various source markets.",
          "**Key Travel Associations:** the themes associated with travel in each source market."
        ],
        look: "Markets or destinations with a falling score across waves; themes behind a shift." },
      { tab: "airline", name: "Airline Overview",
        points: [
          "**Sentiment map:** airline experience score by source market. Click a country to update the airline gauges below it.",
          "**Airline sentiment gauges:** current-period score for each ranked airline.",
          "**NPS by airline:** likelihood to recommend on a 0\u201310 scale (promoters 9\u201310, passives 7\u20138, detractors 0\u20136), with the number of responses behind each score.",
          "**Preferred airline** and **preferred cabin class**.",
          "**Key airline selection factors** and strategies that would drive airline booking."
        ],
        look: "Airlines with weak sentiment or NPS; the trade-off between price and safety, service and reliability." },
      { tab: "hotel", name: "Hotels Overview",
        points: [
          "**Insight banner:** a one-line headline (preferred stay type, hotel NPS, top selection factor).",
          "**Sentiment map:** hotel experience score by source market. Click a country to update the hotel gauges.",
          "**Hotel NPS, preferred brands, and key accommodation selection factors.**",
          "**Strategies** that would drive booking.",
          "**Importance of accommodation loyalty programmes** and the most valued programme features."
        ],
        look: "Brands with strong advocacy; the loyalty features that matter most; price versus experience trade-offs." },
      { tab: "segments", name: "Segments Analysis",
        lead: "Choose **Segment by Age** or **Segment by Budget**. Each segment is shown side by side across:",
        points: [
          "Main purpose of trip",
          "Destinations considered",
          "Destination decision considerations",
          "Information sources and travel companions",
          "Booking channel and package versus independent booking",
          "Accommodation considerations",
          "Expected spending change"
        ],
        look: "How drivers, channels and spending intent differ across age and budget." }
    ]
  };

  var REGION_NAMES = { ME: "Middle East" };   /* display names for short region codes used in the data */

  /* ── tiny helpers ─────────────────────────────────────────── */
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function rich(parent, str) {            /* **bold** → <b>, everything else is plain text (safe) */
    String(str).split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
      if (!part) return;
      if (part.slice(0, 2) === "**") { var b = document.createElement("b"); b.textContent = part.slice(2, -2); parent.appendChild(b); }
      else parent.appendChild(document.createTextNode(part));
    });
    return parent;
  }
  function fill(str, vars) { return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function ul(items, vars, cls) { var u = el("ul", cls || "rm-list"); items.forEach(function (t) { rich(u.appendChild(el("li")), fill(t, vars)); }); return u; }
  function section(id, kicker, title) {
    var s = el("section", "rm-sec"); s.id = id;
    s.appendChild(el("div", "rm-kicker", kicker)); s.appendChild(el("h3", "rm-h", title)); return s;
  }

  /* ── live values ─────────────────────────────────────────── */
  function liveVars() {
    var n = (typeof DATA !== "undefined" && DATA && DATA.meta && DATA.meta.totalRespondents) || (DATA && DATA.records && DATA.records.length) || null;
    var markets = null; try { markets = marketOptions().length; } catch (e) { /* not ready */ }
    return { n: n ? Number(n).toLocaleString("en-US") : "\u2014", markets: markets || "\u2014" };
  }
  function regionGroups() {
    try { if (typeof regionMarketGroups === "function") return regionMarketGroups(); } catch (e) { /* fall through */ }
    return [];
  }

  /* ── build ───────────────────────────────────────────────── */
  function render() {
    var root = document.getElementById("readmeRoot"); if (!root) return;
    var vars = liveVars();
    root.innerHTML = "";
    var page = el("div", "rm-page"); root.appendChild(page);

    /* hero + quick links */
    var hero = el("header", "rm-hero");
    hero.appendChild(el("div", "rm-hero-k", README.kicker));
    hero.appendChild(el("h2", "rm-hero-t", README.title));
    var nav = el("nav", "rm-nav"); nav.setAttribute("aria-label", "On this page");
    [["rm-purpose", "Purpose"], ["rm-questions", "Six questions"], ["rm-method", "Methodology"], ["rm-notes", "Good to know"], ["rm-start", "How to use it"], ["rm-views", "View by view"]].forEach(function (x) {
      var a = el("a", "rm-chip", x[1]); a.href = "#" + x[0];
      a.addEventListener("click", function (e) { e.preventDefault(); var t = document.getElementById(x[0]); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); });
      nav.appendChild(a);
    });
    hero.appendChild(nav); page.appendChild(hero);

    /* purpose */
    var s1 = section("rm-purpose", "INTRODUCTION AND OBJECTIVE", "What this dashboard is for");
    rich(s1.appendChild(el("p", "rm-p")), fill(README.intro, vars));
    s1.appendChild(el("h4", "rm-h4", "Coverage"));
    rich(s1.appendChild(el("p", "rm-p")), README.coverage);
    s1.appendChild(el("h4", "rm-h4", "Key insights you can derive"));
    var g = el("div", "rm-grid3"); README.insights.forEach(function (t) { g.appendChild(el("div", "rm-card rm-card-sm", t)); }); s1.appendChild(g);
    page.appendChild(s1);

    /* six questions */
    var s2 = section("rm-questions", "IT ANSWERS SIX QUESTIONS", "The questions behind the dashboard");
    var q = el("div", "rm-grid3");
    README.questions.forEach(function (t, i) {
      var c = el("div", "rm-card rm-q"); c.appendChild(el("span", "rm-num", "0" + (i + 1))); c.appendChild(el("span", "rm-q-t", t)); q.appendChild(c);
    });
    s2.appendChild(q); page.appendChild(s2);

    /* methodology */
    var s3 = section("rm-method", "METHODOLOGY", "Where the data comes from");
    var two = el("div", "rm-grid2");
    var c1 = el("div", "rm-card"); c1.appendChild(el("h4", "rm-h4 rm-h4-in", README.social.title));
    rich(c1.appendChild(el("p", "rm-p")), README.social.lead); c1.appendChild(ul(README.social.points, vars));
    var w = el("div", "rm-waves"); README.social.waves.forEach(function (x) { var s = el("span", "rm-wave"); s.appendChild(el("b", null, x[0])); s.appendChild(document.createTextNode(" " + x[1])); w.appendChild(s); });
    c1.appendChild(w); two.appendChild(c1);
    var c2 = el("div", "rm-card"); c2.appendChild(el("h4", "rm-h4 rm-h4-in", README.survey.title)); c2.appendChild(ul(README.survey.points, vars)); two.appendChild(c2);
    s3.appendChild(two);
    var groups = regionGroups();
    if (groups.length) {
      s3.appendChild(el("h4", "rm-h4", "Source markets in the survey (" + vars.markets + ")"));
      var rg = el("div", "rm-regions");
      groups.forEach(function (gr) {
        var row = el("div", "rm-region"); row.appendChild(el("div", "rm-region-n", REGION_NAMES[gr.region] || gr.region));
        var ms = el("div", "rm-region-m"); gr.markets.forEach(function (m) { ms.appendChild(el("span", "rm-mk", m)); }); row.appendChild(ms); rg.appendChild(row);
      });
      s3.appendChild(rg);
    }
    page.appendChild(s3);

    /* notes */
    var s4 = section("rm-notes", "IMPORTANT NOTES", "Good to know before you read the numbers");
    var n = el("div", "rm-notes"); README.notes.forEach(function (t) { n.appendChild(el("div", "rm-note", t)); }); s4.appendChild(n); page.appendChild(s4);

    /* getting started */
    var s5 = section("rm-start", "GETTING STARTED", "Using the dashboard");
    var two2 = el("div", "rm-grid2");
    var f = el("div", "rm-card"); f.appendChild(el("h4", "rm-h4 rm-h4-in", README.filters.title)); rich(f.appendChild(el("p", "rm-p")), README.filters.text); two2.appendChild(f);
    var it = el("div", "rm-card"); it.appendChild(el("h4", "rm-h4 rm-h4-in", README.interact.title)); it.appendChild(ul(README.interact.points, vars)); two2.appendChild(it);
    s5.appendChild(two2);
    s5.appendChild(el("p", "rm-p rm-muted", "Switch between views using the tab bar at the top."));
    page.appendChild(s5);

    /* view by view */
    var s6 = section("rm-views", "VIEW-BY-VIEW GUIDE", "What you will find on each tab");
    README.views.forEach(function (v) {
      var c = el("article", "rm-view");
      var head = el("div", "rm-view-h"); head.appendChild(el("h4", "rm-view-t", v.name));
      var open = el("button", "rm-open", "Open " + v.name + " \u2192"); open.type = "button";
      open.addEventListener("click", function () { if (typeof switchTab === "function") switchTab(v.tab); window.scrollTo({ top: 0 }); });
      head.appendChild(open); c.appendChild(head);
      if (v.lead) rich(c.appendChild(el("p", "rm-p")), v.lead);
      if (v.stages) {
        var st = el("div", "rm-stages");
        v.stages.forEach(function (x) { var d = el("div", "rm-stage"); d.appendChild(el("b", null, x[0])); d.appendChild(el("span", null, x[1])); st.appendChild(d); });
        c.appendChild(st);
      }
      if (v.points) c.appendChild(ul(v.points, vars));
      var look = el("div", "rm-look"); look.appendChild(el("b", null, "LOOK FOR  ")); look.appendChild(document.createTextNode(v.look)); c.appendChild(look);
      s6.appendChild(c);
    });
    page.appendChild(s6);
  }

  window.TPReadMe = { render: render };
})();
