/* ================================================================
   Travel Pulse — Read Me tab  (readme.js)
   Builds the "Read Me" page. Layout and wording follow the user-guide PDF
   (banner photo, Introduction, Six questions, Coverage, Methodology, Getting started, Interacting,
    Key insights, View-by-view guide, Important notes).

   ► ALL TEXT IS IN THE README OBJECT BELOW. Edit it there; nothing else needs to change.
   ► ALL IMAGES ARE IN THE readme-images/ FOLDER. Replace a file (same name) to swap a picture.
   ► Use **double asterisks** for bold.
   ► LIVE_NUMBERS = false → the page shows the numbers exactly as written in the PDF (34 markets, n = 1,417).
     LIVE_NUMBERS = true  → respondents and the market list are read from the dashboard data instead.
   ================================================================ */
(function () {
  "use strict";

  var LIVE_NUMBERS = false;
  var IMG = "readme-images/";

  var README = {
    kicker: "ESCALENT TRAVEL PULSE 2026",
    title: "Travel Intelligence Dashboard",
    subtitle: "User Guide",
    heroAlt: "A traveler walking with a suitcase through a station",

    introLabel: "INTRODUCTION AND OBJECTIVE",
    intro: "Travelers are balancing changing priorities, budgets and expectations, while new tools and channels reshape how trips are planned and booked. This dashboard gives a traveler-centric view of international travel behavior across {markets} source markets. It combines social listening with a primary survey (n = {n}) to show how travelers perceive travel today, and how they plan, decide, book and spend, including their choice of destinations, airlines and hotels.",

    questionsLabel: "IT ANSWERS SIX QUESTIONS",
    questions: [
      "How do travelers perceive travel, and how is sentiment shifting across waves?",
      "How do they plan and book international trips (purpose, duration, companions, lead time, channels)?",
      "What drives their decisions, what do they book only on arrival, and how likely are they to use AI tools during a trip?",
      "How do they manage their travel budget, and what changes when spending falls or rises?",
      "Which destinations and experiences are they seeking?",
      "Which airlines and hotels do they prefer, why, and how likely are they to recommend them?"
    ],

    coverageLabel: "COVERAGE",
    coverage: "Leisure, business and bleisure travelers (business trips extended with leisure), and different travel classes (cabin class, accommodation type), so premium and value-driven behavior can be compared. The dashboard supports exploratory analysis, strategy discussions, client presentations and monitoring across waves.",
    coverageImg: "tab-coverage.jpg", coverageAlt: "Primary purpose of the trip and key destinations considered",

    methodLabel: "METHODOLOGY",
    social: {
      title: "SOCIAL LISTENING (SENTIMENT)",
      paras: [
        "Analyzes travel-related conversations on digital and social platforms, with keyword themes behind each shift",
        "**Sentiment score**: (positive \u2212 negative) \u00f7 total sentiments \u00d7 100, from -100 (negative) through 0 (neutral) to +100 (positive)",
        "**Reported in four waves**: W1 Jan\u2013Feb 2026, W2 Mar 2026, W3 Apr\u2013May 2026, W4 Jun\u2013Jul 2026. Each wave shows the score, the positive/neutral/negative split and the volume of mentions.",
        "The Airline and Hotels tabs show the current period (Jun\u2013Jul 2026)"
      ]
    },
    survey: {
      title: "PRIMARY SURVEY (BEHAVIOR AND PREFERENCES)",
      sample: "**Sample**: {n} respondents across {markets} source markets",
      regions: [   /* as written in the PDF; used when LIVE_NUMBERS = false */
        "Asia: Bangladesh, China, India, Indonesia, Japan, Malaysia, Pakistan, Philippines, Singapore, South Korea, Thailand",
        "Europe: France, Germany, Ireland, Italy, Netherlands, Russia, Spain, Switzerland, Turkey, the UK",
        "LATAM: Brazil",
        "Middle East: Bahrain, Egypt, Jordan, Qatar, Saudi Arabia, the UAE",
        "Africa: Kenya, Nigeria, South Africa",
        "North America: Canada, the US",
        "Oceania: Australia"
      ],
      paras: [
        "**Respondent profile:** aged 18+; took an international flight for leisure or business in the past 12 months; involved in decisions about their international travel",
        "**Survey wave:** Wave 1 is the baseline for the next international trip; future waves will allow wave-on-wave comparison"
      ]
    },

    startLabel: "GETTING STARTED",
    home: {
      title: "Home page",
      text: "The landing page has five tiles: 01 Travel Behaviour, 02 Travel Sentiment, 03 Airline Overview, 04 Hotels Overview, 05 Segments Analysis. Select a tile to open it. Once inside, you can also switch using the tab bar at the top.",
      img: "home-page.jpg", alt: "The landing page with one tile for each view"
    },
    filters: {
      title: "Filters (top panel)",
      paras: [
        "Region / Country, Age, Income, Segments and Traveler Type.",
        "Use **Reset** to return to all regions and countries with no other filters. The dashboard shows an \"Updating dashboard...\" message while it recalculates.",
        "Segments Analysis has its own Region / Country filter only",
        "**Use the dropdowns** rather than clicking chart elements, so every visual stays in sync"
      ],
      img: "filters.jpg", alt: "The filter bar, with the Reset button and an open Income dropdown highlighted"
    },

    interactLabel: "INTERACTING",
    interact: [
      { img: "tip-hover.jpg",   alt: "A tooltip showing the exact value of a bar", text: "Hover over a bar or segment for the exact value" },
      { img: null, icon: "i",   alt: "", text: "Click the I icon on a chart for its definition" },
      { img: "tip-map.jpg",     alt: "Canada highlighted on the map",             text: "On map views, click a country to drill into that market" },
      { img: "tip-journey.jpg", alt: "The Inspire, Plan, Book and During trip buttons", text: "Use the journey buttons (Inspire, Plan, Book, During trip) to move through Travel Behaviour" }
    ],

    insightsLabel: "KEY INSIGHTS YOU CAN DERIVE",
    insights: [
      ["Sentiment shifts by market, destination, airline and hotel",
       "Trip and planning patterns: purpose, duration, companions, lead time",
       "Channel effectiveness: where travelers research versus where they book",
       "Decision drivers and what is booked on arrival"],
      ["Budget outlook and the trade-offs travelers make",
       "Experience and destination demand",
       "Brand preference and advocacy (NPS) for airlines and hotels",
       "AI adoption: likelihood of use and tasks travelers would delegate",
       "Differences by age and budget segment"]
    ],
    insightsImg: "tab-insights.jpg", insightsAlt: "Key information channels, trip considerations and booking lead time",

    viewsLabel: "VIEW-BY-VIEW GUIDE",
    behaviour: {
      name: "Travel Behaviour",
      lead: "Starts with a traveler profile: Marital Status, Children in Household and Trip Companion. Below it, four journey stages organize the analysis.",
      stages: [
        ["INSPIRE", "Primary purpose of the trip; key destinations considered; key experiences sought"],
        ["PLAN", "Key information channels; key trip considerations; booking lead time; planned travel period; segment by budget (Budget, Premium, Luxury); trip duration (nights); budget change over the next 12 months; budget change reasons (toggle between Reasons for Decrease and Reasons for Increase)"],
        ["BOOK", "Finalized destinations; booking sequence (average rank of flights, accommodation, visa, local transport, insurance and activities); booking channels; package type"],
        ["DURING TRIP", "On-site bookings and activities; AI tool usage likelihood during a trip (top-2-box); AI tasks travelers would be comfortable with"]
      ],
      look: "Gaps between research and booking channels; short versus long booking windows; segments with a falling spend outlook and what they cut; the tasks travelers would delegate to AI."
    },
    views: [   /* alternate white / grey, image on the right */
      { name: "Travel Sentiment", img: "tab-sentiment.jpg", alt: "The Travel Sentiment page: source market map and wave gauges", paras: [
          "**Source Market Overview:** a gradient map shows the sentiment score for each source market. Click a country to see its market detail.",
          "**Destination Market Overview:** the same view by destination, showing how sentiment toward each destination is shifting.",
          "**Wave gauges (W1 to W4):** the score for each wave, with the positive/neutral/negative split.",
          "**Score summary table:** positive, neutral and negative shares for a destination from various source markets.",
          "**Key Travel Associations:** the themes associated with travel in each source market."],
        look: "Markets or destinations with a falling score across waves; themes behind a shift." },
      { name: "Airline Overview", img: "tab-airline.jpg", alt: "The Airline Overview page: insight banner, sentiment map and airline gauges", paras: [
          "**Sentiment map:** airline experience score by source market. Click a country to update the airline gauges below it.",
          "**Airline sentiment gauges**: current-period score for each ranked airline",
          "**NPS by airline:** likelihood to recommend on a 0\u201310 scale (promoters 9\u201310, passives 7\u20138, detractors 0\u20136), with the number of responses behind each score",
          "**Preferred airline and preferred cabin class**",
          "**Key airline selection factors and strategies that would drive airline booking**"],
        look: "Airlines with weak sentiment or NPS; the trade-off between price and safety, service and reliability." },
      { name: "Hotels Overview", img: "tab-hotels.jpg", alt: "The Hotels Overview page: insight banner, sentiment map and hotel gauges", paras: [
          "**Insight banner:** a one-line headline (preferred stay type, hotel NPS, top selection factor)",
          "**Sentiment map**: hotel experience score by source market. Click a country to update the hotel gauges.",
          "**Hotel NPS**, preferred brands, and key accommodation selection factors",
          "**Strategies that would drive booking**",
          "**Importance of accommodation loyalty programmes and the most valued programme features**"],
        look: "Brands with strong advocacy; the loyalty features that matter most; price versus experience trade-offs." },
      { name: "Segments Analysis", img: "tab-segments.jpg", alt: "The Segments Analysis page: age segments side by side", lead:
          "Choose **Segment by Age** or **Segment by Budget**. Each segment is shown side by side across:",
        paras: ["- Main purpose of trip", "- Destinations considered", "- Destination decision considerations", "- Information sources and travel companions", "- Booking channel and package versus independent booking", "- Accommodation considerations", "- Expected spending change"],
        look: "How drivers, channels and spending intent differ across age and budget." }
    ],

    notesLabel: "IMPORTANT NOTES",
    notes: [
      ["Social sentiment reflects online conversations and is directional.",
       "Survey data reflects stated intent for the next international trip and may change across waves.",
       "Market and segment samples vary. Small bases are directional."],
      ["Some questions are asked of subsets only, so base sizes differ across charts.",
       "\"No data\" on a map, or missing values, mean limited mentions for that market or brand."]
    ]
  };

  /* ── helpers ──────────────────────────────────────────────── */
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function rich(parent, str) {            /* **bold** → <b>; everything else is plain text (safe) */
    String(str).split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
      if (!part) return;
      if (part.slice(0, 2) === "**") { var b = document.createElement("b"); b.textContent = part.slice(2, -2); parent.appendChild(b); }
      else parent.appendChild(document.createTextNode(part));
    });
    return parent;
  }
  function p(str, vars, cls) { return rich(el("p", cls || "rm2-p"), fill(str, vars)); }
  function fill(str, vars) { return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function label(text, cls) { return el("h3", "rm2-label" + (cls ? " " + cls : ""), text); }
  function img(file, alt, eager) {
    var i = el("img", "rm2-img"); i.src = IMG + file; i.alt = alt || ""; i.decoding = "async"; if (!eager) i.loading = "lazy"; return i;
  }
  function band(tone, id) { var s = el("section", "rm2-band rm2-" + tone); if (id) s.id = id; var inner = el("div", "rm2-inner"); s.appendChild(inner); s._inner = inner; return s; }
  function lookBox(text) {
    var b = el("div", "rm2-look"); b.appendChild(el("div", "rm2-look-t", "LOOK FOR")); b.appendChild(el("p", "rm2-look-p", text)); return b;
  }

  /* ── numbers: as in the PDF, or live from the data ────────── */
  function vars() {
    if (!LIVE_NUMBERS) return { n: "1,417", markets: "34" };
    var n = null, m = null;
    try { n = (DATA && DATA.meta && DATA.meta.totalRespondents) || (DATA && DATA.records && DATA.records.length); } catch (e) { /* not ready */ }
    try { m = marketOptions().length; } catch (e) { /* not ready */ }
    return { n: n ? Number(n).toLocaleString("en-US") : "1,417", markets: m || "34" };
  }
  var REGION_NAMES = { ME: "Middle East" };
  function regionLines() {
    if (!LIVE_NUMBERS) return README.survey.regions;
    try { return regionMarketGroups().map(function (g) { return (REGION_NAMES[g.region] || g.region) + ": " + g.markets.join(", "); }); }
    catch (e) { return README.survey.regions; }
  }

  /* ── page ─────────────────────────────────────────────────── */
  function render() {
    var root = document.getElementById("readmeRoot"); if (!root) return;
    var v = vars(); root.innerHTML = "";
    var page = el("div", "rm2"); root.appendChild(page);

    /* banner photo */
    var hero = el("header", "rm2-hero");
    hero.appendChild(img("hero.jpg", README.heroAlt, true)); hero.lastChild.className = "rm2-hero-img";
    var shade = el("div", "rm2-hero-shade"); hero.appendChild(shade);
    var ht = el("div", "rm2-hero-text");
    ht.appendChild(el("h2", "rm2-hero-t", README.title)); ht.appendChild(el("div", "rm2-hero-s", README.subtitle)); ht.appendChild(el("div", "rm2-hero-k", README.kicker));
    hero.appendChild(ht);
    var hw = el("div", "rm2-herowrap"); hw.appendChild(hero); page.appendChild(hw);

    /* introduction */
    var b1 = band("white", "rm2-intro"); b1._inner.className += " rm2-center";
    b1._inner.appendChild(label(README.introLabel)); b1._inner.appendChild(p(README.intro, v, "rm2-lead")); page.appendChild(b1);

    /* six questions */
    var b2 = band("lav", "rm2-questions"); b2._inner.className += " rm2-center";
    b2._inner.appendChild(label(README.questionsLabel));
    var qg = el("div", "rm2-qgrid");
    README.questions.forEach(function (t, i) { var q = el("div", "rm2-q"); q.appendChild(el("span", "rm2-num", "0" + (i + 1))); q.appendChild(el("p", "rm2-q-t", t)); qg.appendChild(q); });
    b2._inner.appendChild(qg); page.appendChild(b2);

    /* coverage (text + picture) */
    var b3 = band("white", "rm2-coverage"); var s3 = el("div", "rm2-split"); var l3 = el("div", "rm2-col");
    l3.appendChild(label(README.coverageLabel, "rm2-left")); l3.appendChild(p(README.coverage, v)); s3.appendChild(l3);
    s3.appendChild(img(README.coverageImg, README.coverageAlt)); b3._inner.appendChild(s3); page.appendChild(b3);

    /* methodology */
    var b4 = band("grey", "rm2-method"); b4._inner.appendChild(label(README.methodLabel, "rm2-centerlabel"));
    var m2 = el("div", "rm2-cols2");
    var c1 = el("div", "rm2-col"); c1.appendChild(label(README.social.title, "rm2-left")); README.social.paras.forEach(function (t) { c1.appendChild(p(t, v)); }); m2.appendChild(c1);
    var c2 = el("div", "rm2-col"); c2.appendChild(label(README.survey.title, "rm2-left")); c2.appendChild(p(README.survey.sample, v, "rm2-p rm2-tight"));
    regionLines().forEach(function (t) { c2.appendChild(p(t, v, "rm2-p rm2-region")); });
    README.survey.paras.forEach(function (t) { c2.appendChild(p(t, v)); }); m2.appendChild(c2);
    b4._inner.appendChild(m2); page.appendChild(b4);

    /* getting started */
    var b5 = band("white", "rm2-start"); b5._inner.appendChild(label(README.startLabel, "rm2-left"));
    var r1 = el("div", "rm2-split rm2-split-text"); var t1 = el("div", "rm2-col");
    t1.appendChild(el("p", "rm2-p rm2-strong", README.home.title)); t1.appendChild(p(README.home.text, v)); r1.appendChild(t1); r1.appendChild(img(README.home.img, README.home.alt)); b5._inner.appendChild(r1);
    var r2 = el("div", "rm2-split rm2-split-text"); var t2 = el("div", "rm2-col");
    t2.appendChild(el("p", "rm2-p rm2-strong", README.filters.title)); README.filters.paras.forEach(function (t) { t2.appendChild(p(t, v)); }); r2.appendChild(t2); r2.appendChild(img(README.filters.img, README.filters.alt)); b5._inner.appendChild(r2);
    page.appendChild(b5);

    /* interacting */
    var b6 = band("grey", "rm2-interact"); b6._inner.className += " rm2-center"; b6._inner.appendChild(label(README.interactLabel));
    var ig = el("div", "rm2-igrid");
    README.interact.forEach(function (it) {
      var cell = el("figure", "rm2-icell"); var card = el("div", "rm2-icard");
      if (it.img) card.appendChild(img(it.img, it.alt)); else { var ic = el("span", "rm2-icon", it.icon); ic.setAttribute("aria-hidden", "true"); card.appendChild(ic); }
      cell.appendChild(card); cell.appendChild(el("figcaption", "rm2-icap", it.text)); ig.appendChild(cell);
    });
    b6._inner.appendChild(ig); page.appendChild(b6);

    /* key insights (text + picture) */
    var b7 = band("white", "rm2-insights"); b7._inner.appendChild(label(README.insightsLabel, "rm2-left"));
    var s7 = el("div", "rm2-split rm2-split-insights"); var tc = el("div", "rm2-icols");
    README.insights.forEach(function (col) { var c = el("div", "rm2-icol"); col.forEach(function (t) { c.appendChild(el("p", "rm2-p", t)); }); tc.appendChild(c); });
    s7.appendChild(tc); s7.appendChild(img(README.insightsImg, README.insightsAlt)); b7._inner.appendChild(s7); page.appendChild(b7);

    /* view-by-view: Travel Behaviour (centred, with the four journey stages) */
    var b8 = band("grey", "rm2-views"); b8._inner.className += " rm2-center"; b8._inner.appendChild(label(README.viewsLabel));
    b8._inner.appendChild(el("h4", "rm2-vname", README.behaviour.name)); b8._inner.appendChild(p(README.behaviour.lead, v, "rm2-lead rm2-lead-sm"));
    var sg = el("div", "rm2-stages");
    README.behaviour.stages.forEach(function (s) { var d = el("div", "rm2-stage"); d.appendChild(el("h5", "rm2-stage-t", s[0])); d.appendChild(el("p", "rm2-p", s[1])); sg.appendChild(d); });
    b8._inner.appendChild(sg); b8._inner.appendChild(lookBox(README.behaviour.look)); page.appendChild(b8);

    /* the other four views: heading + text on the left, picture on the right, LOOK FOR box underneath */
    README.views.forEach(function (w, i) {
      var b = band(i % 2 === 0 ? "white" : "grey", "rm2-v-" + i);
      var s = el("div", "rm2-split"); var t = el("div", "rm2-col");
      t.appendChild(el("h4", "rm2-vname rm2-vname-l", w.name));
      if (w.lead) t.appendChild(p(w.lead, v));
      w.paras.forEach(function (x) { t.appendChild(p(x, v, "rm2-p" + (x.charAt(0) === "-" ? " rm2-dash" : ""))); });
      s.appendChild(t); s.appendChild(img(w.img, w.alt)); b._inner.appendChild(s); b._inner.appendChild(lookBox(w.look)); page.appendChild(b);
    });

    /* important notes */
    var b9 = band("white", "rm2-notes"); b9._inner.appendChild(label(README.notesLabel, "rm2-left"));
    var ng = el("div", "rm2-ncols");
    README.notes.forEach(function (col) { var c = el("div", "rm2-ncol"); col.forEach(function (t) { c.appendChild(el("p", "rm2-p", t)); }); ng.appendChild(c); });
    b9._inner.appendChild(ng); page.appendChild(b9);
  }

  window.TPReadMe = { render: render };
})();
