(() => {
  "use strict";

  const REGION_MARKET_MAP = {
    Europe: ["France", "Germany", "Ireland", "Italy", "Netherlands", "Russian Federation", "Spain", "Switzerland", "Turkey", "United Kingdom"],
    ME: ["Bahrain", "Egypt", "Jordan", "Qatar", "Saudi Arabia", "United Arab Emirates"],
    Asia: ["China", "India", "Indonesia", "Japan", "Korea, Republic of (South Korea)", "Malaysia", "Singapore", "Thailand"],
    Africa: ["Kenya", "Nigeria", "South Africa"],
    "North America": ["Canada", "United States of America"],
    Oceania: ["Australia"],
    LATAM: ["Brazil"]
  };
  const MARKET_ALIASES = {
    Russia: "Russian Federation", "South Korea": "Korea, Republic of (South Korea)",
    UAE: "United Arab Emirates", UK: "United Kingdom", USA: "United States of America",
    "United States": "United States of America"
  };
  const REGION_BY_MARKET = Object.fromEntries(Object.entries(REGION_MARKET_MAP).flatMap(([region, markets]) => markets.map(market => [market, region])));
  const AGE_COHORTS = ["18-34", "35-54", "55+"];
  const BUDGET_COHORTS = ["Budget Travelers", "Premium Travelers", "Luxury Travelers"];
  const QUESTIONS = [
    { key: "QS5", label: "Main purpose of trip", fields: ["tripPurpose"] },
    { key: "Q3", label: "Destinations considered", fields: ["Q3"] },
    { key: "Q9", label: "Destination decision considerations", fields: ["decisionFactors", "Q9"] },
    { key: "Q7", label: "Information sources / channels", fields: ["infoChannels", "Q7"] },
    { key: "Q5", label: "Travel companions", fields: ["travelCompanions", "Q5"] },
    { key: "Q8", label: "Booking channel", fields: ["bookingChannels", "Q8"] },
    { key: "Q8b", label: "Package vs. independent booking", fields: ["Q8b"] },
    { key: "Q12", label: "Experiences sought", fields: ["experiences", "Q12"] },
    { key: "Q14", label: "Preferred airline choice", fields: ["airlineCarrier", "Q14"] },
    { key: "Q16", label: "Airline considerations", fields: ["airlineConsiderations", "Q16"] },
    { key: "Q21", label: "Preferred accommodation brand", fields: ["hotelBrand", "Q21"] },
    { key: "Q22", label: "Accommodation considerations", fields: ["hotelConsiderations", "Q22"] }
  ];
  const SECTION_RAIL_LABEL_BY_QUESTION = Object.freeze({
    QS5: "Inspire", Q3: "Inspire", Q12: "Inspire",
    Q7: "Plan", Q9: "Plan", Q5: "Plan", spend: "Plan",
    Q8: "Book", Q8b: "Book",
    Q14: "Airline", Q16: "Airline",
    Q21: "Hotel", Q22: "Hotel"
  });
  const PHOTOS = {
    age: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
    ],
    budget: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
    ]
  };
  const CHART_CATALOG = {
    "Bar & Column Charts": [
      { label: "Horizontal Bar Chart", value: "Bar" }, { label: "Vertical Bar Chart", value: "Vertical Column" },
      { label: "Stacked Bar Chart", value: "Stacked Bar" }, { label: "100% Stacked Bar Chart", value: "100% Stacked Bar" },
      { label: "Gradient Bar Chart", value: "Gradient Bar" }, { label: "Lollipop Bar Chart", value: "Lollipop" }
    ],
    "Line & Area Charts": [
      { label: "Basic Line Chart", value: "Basic Line" }, { label: "Smooth Curved Line Chart", value: "Line" },
      { label: "Gradient Area Chart", value: "Area" }
    ],
    "Circular & Radial Charts": [
      { label: "Pie Chart", value: "Pie" }, { label: "Donut Chart", value: "Donut" },
      { label: "Radial Bar Chart", value: "Radial Bar" }, { label: "Polar Area Chart", value: "Polar Area" },
      { label: "Nightingale Rose Chart", value: "Rose" }, { label: "Radar Chart", value: "Radar" },
      { label: "Sunburst Chart", value: "Sunburst" }
    ],
    "Distribution & Statistical Charts": [
      { label: "Dot Plot", value: "Dot Plot" }, { label: "Waffle Chart", value: "Waffle" }
    ],
    "Relationship & Comparison Charts": [
      { label: "Bubble Chart", value: "Bubble" }, { label: "Packed Bubble Chart", value: "Packed Bubbles" },
      { label: "Heatmap", value: "Heatmap" }, { label: "Ribbon Chart", value: "Seg-Ribbon" },
      { label: "Parliament Seat Chart", value: "Parliament Seat Chart" }, { label: "Plan Share Track", value: "Plan Share Track" }
    ],
    "Hierarchical & Advanced Charts": [
      { label: "Treemap", value: "Treemap" }, { label: "Circle Packing Chart", value: "Circle Packing" }
    ]
  };
  const IMPLEMENTED_TYPES = new Set(Object.values(CHART_CATALOG).flat().map(option => option.value));
  const DEFAULT_TYPES = {
    QS5: "Bar", Q3: "Bar", Q9: "Bar", Q7: "Bar", Q5: "Donut", Q8: "Bar",
    Q8b: "Donut", Q12: "Bar", Q14: "Bar", Q16: "Line", Q21: "Bar", Q22: "Bar",
    spend: "Donut"
  };
  const INCOMPATIBLE_REASONS = [
    [/^(Sankey|Chord|Chord Diagram|Arc Diagram|Network Graph|Force-Directed Graph|Alluvial|Parallel Sets|Dependency Wheel|Flow Map|Network Graph|Force-Directed Graph)$/i, "needs source-to-target relationships"],
    [/^(Histogram|Density Plot|Violin Plot|Box Plot|Boxen Plot|Strip Plot|Swarm Plot|Beeswarm|ECDF|Q-Q Plot)$/i, "needs respondent-level numeric measurements"],
    [/^(Scatter Plot|Hexbin|Contour Plot|Scatter Matrix|Bubble Matrix|Connected Scatter|Regression Plot|3D Scatter Plot|Error Bar|Confidence Interval|Control Chart|Forest Plot|Range Bar)$/i, "needs paired or interval-level measurements"],
    [/^(Candlestick|OHLC|Gantt|Timeline|Horizon Chart|Ridgeline Plot|Sparkline|Event Timeline|Calendar Plot|Calendar Heatmap)$/i, "needs dated time-series values"],
    [/^(Choropleth|Dot Map|Proportional Symbol Map|Cartogram|Tile Grid Map|Density Map|Hex Tile Map|Route Map|Geographic Flow|3D Globe)$/i, "needs geospatial coordinates or boundaries"],
    [/^3D /i, "needs multi-axis 3D measurements"],
    [/^(Grouped Bar|Diverging Bar|Dumbbell Plot|Slope Chart|Bump Chart|Voronoi Treemap|Icicle|Dendrogram|Radial Tree|Tree Diagram|Flame Graph|Partition Chart|Cluster Diagram|Voronoi)$/i, "needs hierarchy or multiple comparable series"],
    [/^(Step Line|Step Area|Streamgraph|Radial Progress|Coxcomb|Circular Bar|Mosaic Plot|Marimekko|Pictogram|Table Chart|Tornado|Bullet Graph|Range Area)$/i, "not supported for this single-series response distribution"]
  ];
  const DEFAULT_COLOR = "#530095";
  const PALETTE = ["#530095", "#00B5AC", "#230B54", "#FF5635", "#9A1B15", "#3F3F3F", "#8E4FC0", "#66D3CD", "#6A5A9C", "#FF9A85"];
  const state = { records: [], view: "age", markets: new Set(), selections: new Map() };
  let journeyRailsScrollStarted = false;
  let journeyRailUpdateFrame = 0;
  const $ = (selector, root = document) => root.querySelector(selector);
  const content = $("#sa-chart-content");
  const tooltip = $("#sa-tooltip");
  const status = $("#sa-status");
  const fmtCount = value => Number(value || 0).toLocaleString();
  const fmtPct = value => `${(Number(value || 0) * 100).toFixed(1)}%`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const chartKey = (view, question, cohort) => `${view}|${question}|${cohort}`;
  const cohortNames = () => state.view === "age" ? AGE_COHORTS : BUDGET_COHORTS;
  const segmentField = () => state.view === "age" ? "Segment_Age" : "Segment_Budget";
  const isMultiAnswer = key => ["Q3", "Q7", "Q9", "Q12", "Q16", "Q22"].includes(key);

  function repairText(value) {
    let result = String(value ?? "");
    for (let attempt = 0; attempt < 2 && /[ÃÂÐÑØÙæçéíîïëìðñòóôõöøùúûüýþÿ„‚…†‡‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/.test(result); attempt++) {
      try {
        const cp1252 = { "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87, "ˆ": 0x88, "‰": 0x89, "Š": 0x8a, "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "˜": 0x98, "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f };
        const bytes = Array.from(result, char => cp1252[char] ?? char.charCodeAt(0));
        const decoded = new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
        if (decoded === result) break;
        result = decoded;
      } catch (_) { break; }
    }
    return result;
  }
  function clean(value) {
    return repairText(value).replace(/â€“/g, "–").replace(/â€”/g, "—").replace(/â€™/g, "’").replace(/\s+/g, " ").trim();
  }
  function canonicalMarket(value) {
    const market = clean(value);
    return MARKET_ALIASES[market] || market;
  }
  function normalizeRecord(record) {
    const market = canonicalMarket(record.Market);
    return { ...record, Market: market, Region: REGION_BY_MARKET[market] || clean(record.Region) };
  }
  function normalizeDestination(value) {
    const label = clean(value);
    const aliases = { USA: "United States", US: "United States", UK: "United Kingdom", UAE: "United Arab Emirates", KSA: "Saudi Arabia", "South Korea": "South Korea" };
    return aliases[label] || label;
  }
  function questionAnswers(record, question) {
    if (question.key === "Q3") {
      const explicit = [record.Q3_1, record.Q3_2, record.Q3_3].map(clean).filter(Boolean);
      const values = explicit.length ? explicit : (Array.isArray(record.Q3) ? record.Q3.slice(0, 3).map(clean) : []);
      return [...new Set(values.map(normalizeDestination).filter(value => value && value.toLowerCase() !== "undecided"))];
    }
    if (question.key === "Q5") {
      const companion = clean(record.travelCompanions || record.Q5 || record.Companion);
      return companion ? [companion] : [];
    }
    for (const field of question.fields) {
      const raw = record[field];
      const values = (Array.isArray(raw) ? raw : [raw]).map(clean).filter(Boolean);
      if (values.length) return [...new Set(values)];
    }
    return [];
  }
  function recordsForFilter() {
    return state.markets.size ? state.records.filter(record => state.markets.has(record.Market)) : state.records;
  }
  function selectedMarketSet() {
    return state.markets.size ? state.markets : new Set(state.records.map(record => record.Market));
  }
  function recordsForCohort(cohort) {
    const field = segmentField();
    return recordsForFilter().filter(record => clean(record[field]) === cohort);
  }
  function questionDistribution(cohortRows, question) {
    const answersByRow = cohortRows.map(record => questionAnswers(record, question)).filter(answers => answers.length);
    const counts = new Map();
    let denominator = answersByRow.length;
    if (question.key === "Q3") denominator = 0;
    answersByRow.forEach(answers => answers.forEach(answer => {
      const label = /^others?(?:\s*\(please\s+specify\))?$/i.test(answer) ? "Others" : answer;
      if (["Q9", "Q7", "Q12", "Q16", "Q22"].includes(question.key) && /^others?$/i.test(label)) return;
      counts.set(label, (counts.get(label) || 0) + 1);
      if (question.key === "Q3") denominator += 1;
    }));
    const measure = question.key === "Q3" ? "destination mentions" : "respondents";
    let rows = [...counts.entries()].map(([label, count]) => ({ label, count, base: denominator, value: denominator ? count / denominator : 0, measure }));
    rows.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    if (!["Q3", "Q5", "Q14", "Q21"].includes(question.key)) rows = rows.slice(0, 7);
    return { rows, answered: answersByRow.length, base: denominator };
  }
  function spendingDistribution(cohortRows) {
    let decrease = 0, same = 0, increase = 0;
    cohortRows.forEach(record => {
      const answer = clean(record.Q10 || record.spendChange).toLowerCase();
      if (answer.includes("decrease")) decrease++;
      else if (answer.includes("increase")) increase++;
      else if (answer.includes("same")) same++;
    });
    const base = decrease + same + increase;
    return {
      base,
      rows: base ? [
        { label: "Will decrease", count: decrease, base, value: decrease / base, measure: "respondents" },
        { label: "Will remain the same", count: same, base, value: same / base, measure: "respondents" },
        { label: "Will increase", count: increase, base, value: increase / base, measure: "respondents" }
      ].filter(row => row.count > 0) : []
    };
  }
  function colorScale(rows) {
    const [min = 0, max = 1] = d3.extent(rows, row => row.value);
    const domain = min === max ? [min - 0.01, max + 0.01] : [min, max];
    return d3.scaleSequential(domain, d3.interpolateRgb("#00B5AC", "#530095"));
  }
  function colorForIndex(index) { return PALETTE[index % PALETTE.length]; }
  function setStatus(message = "", isError = false) {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }
  function showTooltip(event, row) {
    const measure = escapeHtml(row.measure || "respondents");
    const secondary = Number.isFinite(row.respondentShare) ? `<br>Respondent share: ${fmtPct(row.respondentShare)}` : "";
    const seats = Number.isFinite(row.seats) ? `<br>${row.seats} of 100 allocated seats` : "";
    tooltip.innerHTML = `<strong>${escapeHtml(row.label)}</strong>${fmtPct(row.value)} of ${measure}<br>${fmtCount(row.count)} of ${fmtCount(row.base)} ${measure}${secondary}${seats}`;
    tooltip.style.left = `${Math.max(8, Math.min(window.innerWidth - 275, event.clientX + 14))}px`;
    tooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - 80, event.clientY + 12))}px`;
    tooltip.style.opacity = "1";
    tooltip.setAttribute("aria-hidden", "false");
  }
  function hideTooltip() {
    tooltip.style.opacity = "0";
    tooltip.setAttribute("aria-hidden", "true");
  }
  function svgRoot(host, width, height, className = "") {
    return d3.select(host).append("svg").attr("class", `pp-bars sa-chart-svg ${className}`)
      .attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`).attr("role", "img");
  }
  function addChartLegend(host, rows, colors, valueOf = row => row.value, formatValue = fmtPct) {
    const legend = document.createElement("div");
    legend.className = "sa-chart-legend";
    legend.innerHTML = rows.map((row, index) => `<div class="sa-legend-item" title="${escapeHtml(row.label)}"><span class="sa-legend-swatch" style="background:${colors[index]}"></span><span class="sa-legend-name">${escapeHtml(row.label)}</span><span class="sa-legend-value">${escapeHtml(formatValue(valueOf(row), row))}</span></div>`).join("");
    host.append(legend);
  }
  function chartPalette(rows) {
    if (state.renderQuestionKey === "Q9") {
      const scale = colorScale(rows);
      return rows.map(row => scale(row.value));
    }
    return rows.map((row, index) => PALETTE[index % PALETTE.length]);
  }
  function chartAxisText(selection) {
    selection.selectAll("text").attr("font-family", "Yellix, sans-serif").attr("font-size", 10).attr("fill", "#756985");
    selection.selectAll("line").attr("stroke", "#e7e1eb");
  }
  function wrappedLines(label, maxChars, maxLines = 2) {
    let remaining = String(label).trim();
    const lines = [];
    while (remaining && lines.length < maxLines) {
      if (remaining.length <= maxChars) { lines.push(remaining); break; }
      let cut = remaining.lastIndexOf(" ", maxChars);
      if (cut < 1) cut = maxChars;
      const line = remaining.slice(0, cut).trimEnd();
      remaining = remaining.slice(cut).trimStart();
      if (lines.length === maxLines - 1) {
        lines.push(`${line.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`);
        break;
      }
      lines.push(line);
    }
    return lines;
  }
  function addCategoryLabels(group, rows, y, maxChars) {
    const hasFlags = state.renderQuestionKey === "Q3" && typeof window.TravelPulseDisplayLabels?.countryCode === "function";
    const labelX = hasFlags ? -34 : -8;
    const labels = group.selectAll("text.sa-y-label").data(rows).join("text").attr("class", "sa-y-label")
      .attr("x", labelX).attr("y", row => y(row.label) + y.bandwidth() / 2).attr("text-anchor", "end")
      .attr("font-family", "Yellix, sans-serif").attr("font-size", 11).attr("fill", "#453c4a")
      .each(function(row) {
        const text = d3.select(this), lines = wrappedLines(row.label, maxChars);
        text.text(null).attr("dy", lines.length > 1 ? "-.28em" : ".32em");
        lines.forEach((line, index) => text.append("tspan").attr("x", labelX).attr("dy", index === 0 ? "0em" : "1.05em").text(line));
      });
    labels.append("title").text(row => row.label);
    if (hasFlags) {
      const flags = rows.map(row => ({ row, code: window.TravelPulseDisplayLabels.countryCode(row.label) })).filter(item => item.code);
      group.selectAll("image.sa-country-flag").data(flags).join("image").attr("class", "sa-country-flag")
        .attr("href", item => `assets/flags/${item.code}.svg`).attr("x", -26)
        .attr("y", item => y(item.row.label) + (y.bandwidth() - 12) / 2).attr("width", 18).attr("height", 12)
        .attr("preserveAspectRatio", "xMidYMid slice").attr("role", "img").attr("aria-label", item => `${item.row.label} flag`);
    }
  }
  function drawHorizontalBars(host, rows, width, type) {
    const margin = { top: 12, right: 50, bottom: 34, left: Math.min(215, Math.max(132, Math.floor(width * 0.43))) };
    const rowHeight = type === "Lollipop" || type === "Dot Plot" ? 38 : 42;
    const height = Math.max(210, rows.length * rowHeight + margin.top + margin.bottom);
    const innerWidth = Math.max(70, width - margin.left - margin.right), innerHeight = rows.length * rowHeight;
    const maxValue = d3.max(rows, row => row.value) || 1;
    const x = d3.scaleLinear().domain([0, maxValue * 1.18]).nice(4).range([0, innerWidth]);
    const y = d3.scaleBand().domain(rows.map(row => row.label)).range([0, innerHeight]).padding(0.24);
    const colors = chartPalette(rows);
    const svg = svgRoot(host, width, height, "sa-horizontal-chart");
    const defs = svg.append("defs");
    rows.forEach((row, index) => {
      const gradient = defs.append("linearGradient").attr("id", `sa-${safeId(host.id)}-${index}`).attr("x1", "0%").attr("x2", "100%");
      gradient.append("stop").attr("offset", "0%").attr("stop-color", d3.color(colors[index]).brighter(0.35));
      gradient.append("stop").attr("offset", "100%").attr("stop-color", colors[index]);
    });
    const group = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const axis = group.append("g").attr("class", "sa-x-axis").attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(4).tickSize(-innerHeight).tickFormat(d3.format(".0%")));
    axis.select(".domain").remove(); chartAxisText(axis);
    const flagGutter = state.renderQuestionKey === "Q3" ? 42 : 18;
    addCategoryLabels(group, rows, y, Math.max(14, Math.floor((margin.left - flagGutter) / 6.1)));
    group.selectAll("rect.sa-row-bg").data(rows).join("rect").attr("class", "sa-row-bg")
      .attr("x", 0).attr("y", row => y(row.label)).attr("width", innerWidth).attr("height", y.bandwidth())
      .attr("fill", (row, index) => index % 2 ? "#f6f4f8" : "#fff");
    const marks = group.selectAll("g.sa-mark").data(rows).join("g").attr("class", "sa-mark")
      .attr("transform", row => `translate(0,${y(row.label)})`)
      .on("mousemove", (event, row) => showTooltip(event, row)).on("mouseleave", hideTooltip);
    if (type === "Lollipop" || type === "Dot Plot") {
      marks.append("line").attr("x1", 0).attr("x2", row => x(row.value)).attr("y1", y.bandwidth() / 2).attr("y2", y.bandwidth() / 2)
        .attr("stroke", (row, index) => colors[index]).attr("stroke-width", type === "Lollipop" ? 3 : 1.3);
      marks.append("circle").attr("cx", row => x(row.value)).attr("cy", y.bandwidth() / 2).attr("r", type === "Lollipop" ? 6 : 5)
        .attr("fill", (row, index) => colors[index]).attr("stroke", "#fff").attr("stroke-width", 1.5);
    } else {
      marks.append("rect").attr("class", "sa-bar").attr("x", 0).attr("y", 4).attr("height", Math.max(5, y.bandwidth() - 8))
        .attr("rx", 2).attr("fill", (row, index) => `url(#sa-${safeId(host.id)}-${index})`)
        .transition().duration(420).attr("width", row => Math.max(1, x(row.value)));
    }
    marks.append("text").attr("class", "sa-mark-value").attr("x", row => Math.min(innerWidth + 40, x(row.value) + 7))
      .attr("y", y.bandwidth() / 2).attr("dy", ".35em").attr("font-family", "Yellix, sans-serif").attr("font-size", 10)
      .attr("font-weight", 700).attr("fill", "#530095").text(row => fmtPct(row.value));
  }
  function drawColumns(host, rows, width, chartType) {
    const margin = { top: 22, right: 12, bottom: 88, left: 44 }, height = 285;
    const iw = width - margin.left - margin.right, ih = height - margin.top - margin.bottom;
    const x = d3.scaleBand().domain(rows.map(row => row.label)).range([0, iw]).padding(0.24);
    const max = d3.max(rows, row => row.value) || 1;
    const y = d3.scaleLinear().domain([0, max * 1.16]).nice(4).range([ih, 0]);
    const colors = chartPalette(rows), svg = svgRoot(host, width, height, "sa-column-chart");
    const group = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const yAxis = group.append("g").call(d3.axisLeft(y).ticks(4).tickFormat(d3.format(".0%")));
    yAxis.select(".domain").remove(); chartAxisText(yAxis);
    const xAxis = group.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).tickSize(0));
    xAxis.select(".domain").attr("stroke", "#b8afc2");
    xAxis.selectAll("text").attr("transform", "rotate(-38)").attr("text-anchor", "end").attr("dx", "-.7em").attr("dy", ".2em")
      .attr("font-size", 9).attr("fill", "#453c4a").append("title").text(row => row);
    group.selectAll("line.sa-grid").data(y.ticks(4)).join("line").attr("class", "sa-grid")
      .attr("x1", 0).attr("x2", iw).attr("y1", tick => y(tick)).attr("y2", tick => y(tick)).attr("stroke", "#eee9f2");
    const bars = group.selectAll("g.sa-column").data(rows).join("g").attr("class", "sa-column")
      .attr("transform", row => `translate(${x(row.label)},0)`).on("mousemove", (event, row) => showTooltip(event, row)).on("mouseleave", hideTooltip);
    bars.append("rect").attr("x", 0).attr("y", row => y(row.value)).attr("width", x.bandwidth()).attr("height", row => ih - y(row.value))
      .attr("rx", 3).attr("fill", (row, index) => colors[index]).transition().duration(420).attr("y", row => y(row.value)).attr("height", row => ih - y(row.value));
    bars.append("text").attr("x", x.bandwidth() / 2).attr("y", row => Math.max(12, y(row.value) - 6)).attr("text-anchor", "middle")
      .attr("font-family", "Yellix, sans-serif").attr("font-size", 9).attr("font-weight", 700).attr("fill", "#530095").text(row => fmtPct(row.value));
    void chartType;
  }
  function drawLineArea(host, rows, width, isArea, questionKey, chartType) {
    const margin = { top: 24, right: 16, bottom: 85, left: 44 }, height = 285;
    const iw = width - margin.left - margin.right, ih = height - margin.top - margin.bottom;
    const x = d3.scalePoint().domain(rows.map(row => row.label)).range([0, iw]).padding(0.4);
    const max = d3.max(rows, row => row.value) || 1;
    const y = d3.scaleLinear().domain([0, max * 1.18]).nice(4).range([ih, 0]);
    const svg = svgRoot(host, width, height, `sa-line-chart${isArea || questionKey === "Q16" ? " seg-area-line-svg" : ""}`), gradientId = `sa-area-${safeId(host.id)}`;
    if (isArea) {
      const defs = svg.append("defs"), gradient = defs.append("linearGradient").attr("id", gradientId).attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 1);
      gradient.append("stop").attr("offset", "0%").attr("stop-color", "#530095").attr("stop-opacity", .36);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", "#00B5AC").attr("stop-opacity", .04);
    }
    const group = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const yAxis = group.append("g").call(d3.axisLeft(y).ticks(4).tickFormat(d3.format(".0%")));
    yAxis.select(".domain").remove(); chartAxisText(yAxis);
    group.append("g").attr("class", "sa-grid-group").selectAll("line").data(y.ticks(4)).join("line")
      .attr("x1", 0).attr("x2", iw).attr("y1", tick => y(tick)).attr("y2", tick => y(tick)).attr("stroke", "#eee9f2");
    const curve = chartType === "Basic Line" ? d3.curveLinear : d3.curveMonotoneX;
    const line = d3.line().x(row => x(row.label)).y(row => y(row.value)).curve(curve);
    if (isArea) group.append("path").datum(rows).attr("d", d3.area().x(row => x(row.label)).y0(ih).y1(row => y(row.value)).curve(curve))
      .attr("fill", `url(#${gradientId})`);
    group.append("path").datum(rows).attr("d", line).attr("fill", "none").attr("stroke", "#530095").attr("stroke-width", 2.5);
    const marks = group.selectAll("g.sa-line-point").data(rows).join("g").attr("transform", row => `translate(${x(row.label)},${y(row.value)})`)
      .on("mousemove", (event, row) => showTooltip(event, row)).on("mouseleave", hideTooltip);
    marks.append("circle").attr("r", 4.5).attr("fill", "#530095").attr("stroke", "#fff").attr("stroke-width", 2);
    marks.append("text").attr("y", -9).attr("text-anchor", "middle").attr("font-size", 9).attr("font-weight", 700).attr("fill", "#530095").text(row => fmtPct(row.value));
    const xAxis = group.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).tickSize(0));
    xAxis.select(".domain").remove(); xAxis.selectAll("text").attr("transform", "rotate(-38)").attr("text-anchor", "end").attr("dx", "-.6em").attr("dy", ".2em").attr("font-size", 9);
  }
  function drawPie(host, rows, width, donut) {
    const colors = chartPalette(rows), height = 260, radius = Math.min(width * 0.34, 105), cx = width / 2, cy = radius + 12;
    const svg = svgRoot(host, width, height, "sa-pie-chart");
    const arc = d3.arc().innerRadius(donut ? radius * 0.58 : 0).outerRadius(radius).padAngle(0.012).cornerRadius(2);
    const total = d3.sum(rows, row => row.count) || 1;
    const compositionRows = rows.map(row => ({ ...row, value: row.count / total, base: total, measure: "category mentions", respondentShare: row.value }));
    const pie = d3.pie().sort(null).value(row => row.count)(rows);
    const slices = svg.append("g").attr("transform", `translate(${cx},${cy})`).selectAll("path").data(pie).join("path")
      .attr("d", arc).attr("fill", (slice, index) => colors[index]).attr("stroke", "#fff").attr("stroke-width", 1)
      .on("mousemove", (event, slice) => showTooltip(event, compositionRows[slice.index])).on("mouseleave", hideTooltip);
    slices.transition().duration(420).attrTween("d", function(slice) {
      const interpolate = d3.interpolate({ startAngle: slice.startAngle, endAngle: slice.startAngle }, slice);
      return t => arc(interpolate(t));
    });
    if (donut) svg.append("text").attr("x", cx).attr("y", cy - 3).attr("text-anchor", "middle").attr("font-size", 16).attr("font-weight", 800).attr("fill", "#230B54")
      .text(fmtCount(d3.sum(rows, row => row.count)));
    addChartLegend(host, compositionRows, colors);
  }
  function drawStacked(host, rows, width, normalized) {
    const margin = { top: 35, right: 14, bottom: 44, left: 14 }, height = 170, iw = width - margin.left - margin.right;
    const svg = svgRoot(host, width, height, "sa-stacked-chart"), colors = chartPalette(rows);
    const group = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const total = d3.sum(rows, row => row.count) || 1;
    let offset = 0;
    const segments = rows.map((row, index) => {
      const start = offset, share = row.count / total;
      offset += normalized ? share : row.count;
      return { ...row, value: share, start, end: offset, share, color: colors[index], base: total, measure: "category mentions", respondentShare: row.value };
    });
    const x = d3.scaleLinear().domain([0, normalized ? 1 : total]).range([0, iw]);
    const bar = group.selectAll("g.sa-stack-segment").data(segments).join("g").attr("class", "sa-stack-segment")
      .on("mousemove", (event, row) => showTooltip(event, row)).on("mouseleave", hideTooltip);
    bar.append("rect").attr("x", row => x(row.start)).attr("y", 0).attr("width", row => Math.max(1, x(row.end) - x(row.start))).attr("height", 42)
      .attr("fill", row => row.color).attr("stroke", "#fff").attr("stroke-width", 1);
    bar.append("text").attr("x", row => (x(row.start) + x(row.end)) / 2).attr("y", 27).attr("text-anchor", "middle")
      .attr("font-size", 10).attr("font-weight", 700).attr("fill", "#fff").text(row => row.share > .08 ? fmtPct(row.share) : "");
    const axis = group.append("g").attr("transform", "translate(0,48)").call(d3.axisBottom(x).ticks(4).tickFormat(normalized ? d3.format(".0%") : d3.format(",d")));
    axis.select(".domain").remove(); chartAxisText(axis);
    const compositionRows = rows.map((row, index) => ({ ...row, value: segments[index].share, base: total, measure: "category mentions", respondentShare: row.value }));
    addChartLegend(host, compositionRows, colors);
  }
  function drawPlanShareTrack(host, rows, width) {
    const total = d3.sum(rows, row => row.count) || 1, colors = chartPalette(rows);
    const track = document.createElement("div");
    track.className = "sa-plan-share-track";
    track.setAttribute("role", "img");
    track.setAttribute("aria-label", "Plan share track showing each category's share of all mentions");
    const parts = rows.map((row, index) => ({ ...row, composition: row.count / total, color: colors[index] }));
    parts.forEach(row => {
      const segment = document.createElement("button");
      segment.type = "button";
      segment.className = "sa-plan-share-segment";
      segment.style.width = `${row.composition * 100}%`;
      segment.style.background = row.color;
      segment.setAttribute("aria-label", `${row.label}: ${fmtPct(row.composition)} of mentions`);
      segment.title = `${row.label} · ${fmtPct(row.composition)} of mentions`;
      if (row.composition >= .12) segment.textContent = fmtPct(row.composition);
      segment.addEventListener("mousemove", event => showTooltip(event, {
        ...row, value: row.composition, base: total, measure: "category mentions", respondentShare: row.value
      }));
      segment.addEventListener("mouseleave", hideTooltip);
      track.append(segment);
    });
    host.append(track);
    addChartLegend(host, parts, colors, row => row.composition);
    void width;
  }
  function drawSegmentRibbon(host, rows, width) {
    const rowHeight = 30, headerHeight = 24, height = rows.length * rowHeight + headerHeight + 8;
    const labelWidth = Math.min(width * .54, Math.max(145, width * .4)), x0 = labelWidth + 8, x1 = width - 18;
    const total = d3.sum(rows, row => row.count) || 1, colors = chartPalette(rows);
    let cursor = 0;
    const bands = rows.map((row, index) => {
      const y0 = cursor, y1 = cursor + rows.length * rowHeight * row.count / total;
      cursor = y1;
      return { ...row, index, left0: headerHeight + index * rowHeight, left1: headerHeight + (index + 1) * rowHeight, y0: headerHeight + y0, y1: headerHeight + y1, color: colors[index] };
    });
    const svg = svgRoot(host, width, height, "sa-segment-ribbon");
    svg.append("text").attr("x", 0).attr("y", 13).attr("font-size", 9).attr("font-weight", 800).attr("fill", "#756985").text("RESPONSE");
    svg.append("text").attr("x", labelWidth - 8).attr("y", 13).attr("text-anchor", "end").attr("font-size", 9).attr("font-weight", 800).attr("fill", "#756985").text("SHARE");
    const pathFor = band => {
      const span = x1 - x0, c1 = x0 + span * .38, c2 = x0 + span * .68;
      return `M${x0},${band.left0} C${c1},${band.left0} ${c2},${band.y0} ${x1},${band.y0} L${x1},${band.y1} C${c2},${band.y1} ${c1},${band.left1} ${x0},${band.left1} Z`;
    };
    const groups = svg.selectAll("g.sa-ribbon-band").data(bands).join("g").attr("class", "sa-ribbon-band");
    groups.append("path").attr("d", pathFor).attr("fill", band => band.color).attr("opacity", .58);
    groups.append("rect").attr("x", x1 - 7).attr("y", band => band.y0).attr("width", 7).attr("height", band => Math.max(0, band.y1 - band.y0)).attr("fill", band => band.color);
    groups.append("path").attr("d", pathFor).attr("fill", "transparent").attr("pointer-events", "fill")
      .on("mousemove", (event, band) => showTooltip(event, band)).on("mouseleave", hideTooltip);
    svg.selectAll("text.sa-ribbon-label").data(rows).join("text").attr("class", "sa-ribbon-label")
      .attr("x", 0).attr("y", (row, index) => headerHeight + index * rowHeight + rowHeight / 2)
      .attr("dy", ".32em").attr("font-size", 10).attr("fill", "#453c4a")
      .text(row => row.label.length > 27 ? `${row.label.slice(0, 26)}…` : row.label)
      .append("title").text(row => row.label);
    svg.selectAll("text.sa-ribbon-share").data(rows).join("text").attr("class", "sa-ribbon-share")
      .attr("x", labelWidth - 8).attr("y", (row, index) => headerHeight + index * rowHeight + rowHeight / 2)
      .attr("dy", ".32em").attr("text-anchor", "end").attr("font-size", 10).attr("font-weight", 700)
      .attr("fill", "#530095").text(row => fmtPct(row.value));
  }
  function allocateParliamentSeats(rows, seatCount = 100) {
    const total = d3.sum(rows, row => Math.max(0, row.count)) || 1;
    const seats = rows.map((row, index) => {
      const exact = seatCount * Math.max(0, row.count) / total, whole = Math.floor(exact);
      return { ...row, index, seats: whole, remainder: exact - whole };
    });
    let remaining = seatCount - d3.sum(seats, row => row.seats);
    [...seats].sort((a, b) => b.remainder - a.remainder || a.index - b.index).slice(0, remaining).forEach(row => row.seats++);
    return seats;
  }
  function drawParliamentSeats(host, rows, width) {
    const seatCount = 100, height = 190, radius = Math.min(115, width * .31), baseline = 154;
    const colors = chartPalette(rows), allocation = allocateParliamentSeats(rows, seatCount), positions = [];
    for (let ring = 0; ring < 10; ring++) {
      const count = ring * 2 + 1, ringRadius = 9 + ring * ((radius - 9) / 9);
      for (let seat = 0; seat < count; seat++) {
        const progress = count === 1 ? .5 : seat / (count - 1), angle = -Math.PI / 2 + Math.PI * progress;
        positions.push({ progress, ring, seat, x: width / 2 + ringRadius * Math.sin(angle), y: baseline - ringRadius * Math.cos(angle) });
      }
    }
    positions.sort((a, b) => a.progress - b.progress || a.ring - b.ring || a.seat - b.seat);
    let positionIndex = 0;
    allocation.forEach(category => { for (let seat = 0; seat < category.seats; seat++) positions[positionIndex++].category = category.index; });
    const svg = svgRoot(host, width, height, "sa-parliament-seats");
    svg.append("line").attr("x1", width * .14).attr("x2", width * .86).attr("y1", baseline).attr("y2", baseline).attr("stroke", "#b8afc2").attr("stroke-width", 1.5);
    svg.selectAll("circle.sa-seat").data(positions).join("circle").attr("class", "sa-seat")
      .attr("cx", seat => seat.x).attr("cy", seat => seat.y).attr("r", 4.1)
      .attr("fill", seat => colors[seat.category] || "#e8e2ed").attr("stroke", "#fff").attr("stroke-width", 1)
      .on("mousemove", (event, seat) => { if (allocation[seat.category]) showTooltip(event, { ...allocation[seat.category], measure: "respondents", seats: allocation[seat.category].seats }); })
      .on("mouseleave", hideTooltip);
    const seatRows = allocation.map(row => ({ ...row, value: row.seats / seatCount, measure: "respondents" }));
    addChartLegend(host, seatRows, colors, row => row.value, (value, row) => `${row.seats} seats · ${fmtPct(value)}`);
  }
  function drawHeatmap(host, rows, width) {
    const columns = Math.min(5, Math.max(2, Math.ceil(Math.sqrt(rows.length)))), cellW = Math.max(60, Math.floor((width - 24) / columns)), cellH = 64;
    const height = Math.ceil(rows.length / columns) * cellH + 10, svg = svgRoot(host, width, height, "sa-heatmap");
    const colors = chartPalette(rows), group = svg.append("g").attr("transform", "translate(6,6)");
    const cells = group.selectAll("g.sa-heat-cell").data(rows).join("g").attr("transform", (row, index) => `translate(${(index % columns) * cellW},${Math.floor(index / columns) * cellH})`)
      .on("mousemove", (event, row) => showTooltip(event, row)).on("mouseleave", hideTooltip);
    cells.append("rect").attr("width", cellW - 5).attr("height", cellH - 5).attr("rx", 3).attr("fill", (row, index) => colors[index]).attr("opacity", .82);
    cells.append("text").attr("x", 6).attr("y", 18).attr("fill", "#fff").attr("font-size", 10).attr("font-weight", 700)
      .text(row => `${Math.round(row.value * 100)}%`);
    cells.append("text").attr("x", 6).attr("y", 35).attr("fill", "#fff").attr("font-size", 9).text(row => row.label.length > 18 ? `${row.label.slice(0, 17)}...` : row.label);
  }
  function drawTreemap(host, rows, width, packed) {
    const height = 255, svg = svgRoot(host, width, height, packed ? "sa-packed-bubbles" : "sa-treemap");
    const root = d3.hierarchy({ children: rows }).sum(row => row.count);
    const layout = packed ? d3.pack().size([width, height]).padding(5)(root).leaves() : d3.treemap().size([width, height]).paddingInner(3)(root).leaves();
    const colors = chartPalette(rows);
    if (packed) {
      const bubbles = svg.selectAll("g.sa-bubble").data(layout).join("g").attr("transform", node => `translate(${node.x},${node.y})`)
        .on("mousemove", (event, node) => showTooltip(event, rows.find(row => row.label === node.data.label))).on("mouseleave", hideTooltip);
      bubbles.append("circle").attr("r", node => node.r).attr("fill", node => colors[rows.indexOf(node.data)]).attr("fill-opacity", .84).attr("stroke", "#fff");
      bubbles.filter(node => node.r > 22).append("text").attr("text-anchor", "middle").attr("dy", ".35em").attr("fill", "#fff").attr("font-size", node => Math.min(11, Math.max(8, node.r / 4)) )
        .text(node => node.data.label.length > 15 ? `${node.data.label.slice(0, 14)}...` : node.data.label);
    } else {
      const tiles = svg.selectAll("g.sa-tile").data(layout).join("g").attr("transform", node => `translate(${node.x0},${node.y0})`)
        .on("mousemove", (event, node) => showTooltip(event, rows.find(row => row.label === node.data.label))).on("mouseleave", hideTooltip);
      tiles.append("rect").attr("width", node => Math.max(0, node.x1 - node.x0)).attr("height", node => Math.max(0, node.y1 - node.y0))
        .attr("fill", node => colors[rows.indexOf(node.data)]).attr("rx", 3);
      tiles.filter(node => node.x1 - node.x0 > 62 && node.y1 - node.y0 > 30).append("text").attr("x", 6).attr("y", 15).attr("fill", "#fff").attr("font-size", 10)
        .text(node => node.data.label.length > 18 ? `${node.data.label.slice(0, 17)}...` : node.data.label);
    }
  }
  function drawRadar(host, rows, width) {
    const height = 280, radius = Math.min(width * 0.36, height * 0.37), center = [width / 2, height / 2], svg = svgRoot(host, width, height, "sa-radar");
    const angle = d3.scalePoint().domain(rows.map(row => row.label)).range([0, Math.PI * 2]);
    const max = d3.max(rows, row => row.value) || 1, radial = d3.scaleLinear().domain([0, max * 1.15]).range([0, radius]);
    const group = svg.append("g").attr("transform", `translate(${center[0]},${center[1]})`);
    [0.25, 0.5, 0.75, 1].forEach(factor => group.append("circle").attr("r", radius * factor).attr("fill", "none").attr("stroke", "#e8e2ed"));
    rows.forEach(row => {
      const theta = angle(row.label) - Math.PI / 2, end = [Math.cos(theta) * radius, Math.sin(theta) * radius];
      group.append("line").attr("x1", 0).attr("y1", 0).attr("x2", end[0]).attr("y2", end[1]).attr("stroke", "#e8e2ed");
      group.append("text").attr("x", end[0] * 1.09).attr("y", end[1] * 1.09).attr("text-anchor", end[0] > 8 ? "start" : end[0] < -8 ? "end" : "middle").attr("font-size", 8).attr("fill", "#453c4a")
        .text(row.label.length > 15 ? `${row.label.slice(0, 14)}...` : row.label);
    });
    const line = d3.lineRadial().angle(row => angle(row.label)).radius(row => radial(row.value)).curve(d3.curveLinearClosed);
    group.append("path").datum(rows).attr("d", line).attr("fill", "#530095").attr("fill-opacity", .24).attr("stroke", "#530095").attr("stroke-width", 2);
    group.selectAll("circle.sa-radar-point").data(rows).join("circle").attr("class", "sa-radar-point")
      .attr("cx", row => Math.cos(angle(row.label) - Math.PI / 2) * radial(row.value)).attr("cy", row => Math.sin(angle(row.label) - Math.PI / 2) * radial(row.value))
      .attr("r", 4).attr("fill", "#530095").on("mousemove", (event, row) => showTooltip(event, row)).on("mouseleave", hideTooltip);
  }
  function drawPolar(host, rows, width, type) {
    const height = 270, radius = Math.min(width * .36, 110), centerX = width / 2, centerY = radius + 12, svg = svgRoot(host, width, height, "sa-polar");
    const maximum = d3.max(rows, row => row.value) || 1, angleStep = Math.PI * 2 / rows.length;
    const total = d3.sum(rows, row => row.value) || 1;
    let angle = 0;
    const arcs = rows.map((row, index) => {
      const startAngle = type === "Radial Bar" ? angle : index * angleStep;
      const endAngle = type === "Radial Bar" ? (angle += Math.PI * 2 * row.value / total) : (index + 1) * angleStep;
      const outerRadius = type === "Radial Bar" ? radius : radius * Math.sqrt(row.value / maximum);
      return { ...row, index, startAngle, endAngle, outerRadius };
    });
    const arc = d3.arc().innerRadius(type === "Rose" ? 8 : radius * .3).outerRadius(row => row.outerRadius).cornerRadius(2).padAngle(.015);
    const group = svg.append("g").attr("transform", `translate(${centerX},${centerY})`), colors = chartPalette(rows);
    group.selectAll("path").data(arcs).join("path").attr("d", row => arc(row))
      .attr("fill", row => colors[row.index]).attr("stroke", "#fff").attr("stroke-width", 1)
      .on("mousemove", (event, row) => showTooltip(event, row)).on("mouseleave", hideTooltip);
    addChartLegend(host, rows, colors);
  }
  function drawSunburst(host, rows, width) {
    const height = 260, radius = Math.min(width * .34, 102), svg = svgRoot(host, width, height, "sa-sunburst");
    const root = d3.hierarchy({ children: rows }).sum(row => row.count);
    const leaves = d3.partition().size([Math.PI * 2, radius])(root).leaves();
    const arc = d3.arc().startAngle(node => node.x0).endAngle(node => node.x1).innerRadius(node => node.y0).outerRadius(node => node.y1).padAngle(.006);
    const colors = chartPalette(rows), group = svg.append("g").attr("transform", `translate(${width / 2},${radius + 14})`);
    group.selectAll("path").data(leaves).join("path").attr("d", arc).attr("fill", node => colors[rows.indexOf(node.data)])
      .attr("stroke", "#fff").attr("stroke-width", 1)
      .on("mousemove", (event, node) => showTooltip(event, node.data)).on("mouseleave", hideTooltip);
    addChartLegend(host, rows, colors);
  }
  function drawBubble(host, rows, width) {
    const margin = { top: 12, right: 42, bottom: 34, left: Math.min(205, Math.max(126, Math.floor(width * .41))) };
    const rowHeight = 42, height = Math.max(210, rows.length * rowHeight + margin.top + margin.bottom), innerWidth = width - margin.left - margin.right;
    const maxValue = d3.max(rows, row => row.value) || 1, y = d3.scaleBand().domain(rows.map(row => row.label)).range([0, rows.length * rowHeight]).padding(.18);
    const x = d3.scaleLinear().domain([0, maxValue * 1.18]).nice(4).range([0, innerWidth]),
      radius = d3.scaleSqrt().domain([0, d3.max(rows, row => row.count) || 1]).range([4, Math.min(16, rowHeight * .42)]), colors = chartPalette(rows);
    const svg = svgRoot(host, width, height, "sa-bubble-chart"), group = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const axis = group.append("g").attr("transform", `translate(0,${rows.length * rowHeight})`).call(d3.axisBottom(x).ticks(4).tickFormat(d3.format(".0%")));
    axis.select(".domain").remove(); chartAxisText(axis);
    const marks = group.selectAll("g.sa-bubble-row").data(rows).join("g").attr("class", "sa-bubble-row")
      .attr("transform", row => `translate(0,${y(row.label) + y.bandwidth() / 2})`)
      .on("mousemove", (event, row) => showTooltip(event, row)).on("mouseleave", hideTooltip);
    marks.append("line").attr("x1", 0).attr("x2", row => x(row.value)).attr("stroke", "#e8e2ed").attr("stroke-width", 1);
    marks.append("circle").attr("cx", row => x(row.value)).attr("r", row => radius(row.count)).attr("fill", (row, index) => colors[index])
      .attr("fill-opacity", .84).attr("stroke", "#fff").attr("stroke-width", 1.5);
    marks.append("text").attr("x", row => x(row.value) + radius(row.count) + 4).attr("dy", ".32em").attr("font-size", 9).attr("font-weight", 700)
      .attr("fill", "#530095").text(row => fmtPct(row.value));
    addCategoryLabels(group, rows, y, Math.max(14, Math.floor((margin.left - 18) / 6.1)));
  }
  function drawWaffle(host, rows, width) {
    const size = 10, gap = 3, cell = Math.min(20, Math.floor((width - 36 - gap * (size - 1)) / size)), startX = (width - size * (cell + gap) + gap) / 2;
    const height = size * (cell + gap) + 18, svg = svgRoot(host, width, height, "sa-waffle"), total = d3.sum(rows, row => row.count) || 1;
    const colors = chartPalette(rows), cells = [], compositionRows = rows.map(row => ({
      ...row, value: row.count / total, base: total, measure: "category mentions", respondentShare: row.value
    }));
    for (let index = 0; index < 100; index++) {
      const target = (index + .5) / 100, value = target * total;
      let running = 0, category = rows[rows.length - 1];
      for (const row of rows) { running += row.count; if (value <= running) { category = row; break; } }
      cells.push({ category: compositionRows[rows.indexOf(category)], color: colors[rows.indexOf(category)] });
    }
    svg.selectAll("rect").data(cells).join("rect").attr("x", (cellData, index) => startX + (index % size) * (cell + gap))
      .attr("y", (cellData, index) => 8 + Math.floor(index / size) * (cell + gap)).attr("width", cell).attr("height", cell).attr("rx", 2).attr("fill", cellData => cellData.color)
      .on("mousemove", (event, cellData) => showTooltip(event, cellData.category)).on("mouseleave", hideTooltip);
    addChartLegend(host, compositionRows, colors);
  }
  function drawChart(host, rows, type, questionKey = "") {
    state.renderQuestionKey = questionKey;
    host.innerHTML = "";
    if (!rows.length) { host.innerHTML = '<div class="sa-chart-empty">No answers for this selection.</div>'; return; }
    const width = Math.max(260, Math.floor(host.getBoundingClientRect().width || 420));
    if (type === "Bar" || type === "Gradient Bar" || type === "Horizontal Bar") drawHorizontalBars(host, rows, width, "Bar");
    else if (type === "Stacked Bar" || type === "100% Stacked Bar") drawStacked(host, rows, width, type === "100% Stacked Bar");
    else if (type === "Plan Share Track") drawPlanShareTrack(host, rows, width);
    else if (type === "Seg-Ribbon") drawSegmentRibbon(host, rows, width);
    else if (type === "Parliament Seat Chart") drawParliamentSeats(host, rows, width);
    else if (type === "Vertical Column") drawColumns(host, rows, width, type);
    else if (type === "Basic Line" || type === "Line" || type === "Area") drawLineArea(host, rows, width, type === "Area", questionKey, type);
    else if (type === "Pie" || type === "Donut") drawPie(host, rows, width, type === "Donut");
    else if (type === "Lollipop" || type === "Dot Plot") drawHorizontalBars(host, rows, width, type);
    else if (type === "Radar") drawRadar(host, rows, width);
    else if (["Radial Bar", "Polar Area", "Rose"].includes(type)) drawPolar(host, rows, width, type);
    else if (type === "Treemap") drawTreemap(host, rows, width, false);
    else if (type === "Circle Packing" || type === "Packed Bubbles") drawTreemap(host, rows, width, true);
    else if (type === "Sunburst") drawSunburst(host, rows, width);
    else if (type === "Heatmap") drawHeatmap(host, rows, width);
    else if (type === "Waffle") drawWaffle(host, rows, width);
    else if (type === "Bubble") drawBubble(host, rows, width);
    else drawHorizontalBars(host, rows, width, "Bar");
  }
  function safeId(value) { return String(value).replace(/[^a-zA-Z0-9_-]/g, "-"); }
  function compatibilityReason(type, rows) {
    if (!rows.length) return "No answer data for the current filters";
    if (!IMPLEMENTED_TYPES.has(type)) {
      const match = INCOMPATIBLE_REASONS.find(([pattern]) => pattern.test(type));
      return match ? match[1] : "not compatible with a single categorical response distribution";
    }
    if (type === "Radar" && rows.length < 3) return "requires at least three response categories";
    if (type === "Radar" && rows.length > 10) return "supports up to ten categories for legible axes";
    return "";
  }
  function sectionCompatibilityReason(type, cohortRows) {
    const availableRows = cohortRows.filter(rows => rows.length);
    if (!availableRows.length) return "No answer data for the current filters";
    return availableRows.map(rows => compatibilityReason(type, rows)).find(Boolean) || "";
  }
  function selectedSectionType(key, questionKey, cohortRows) {
    const saved = state.selections.get(key);
    if (saved && !sectionCompatibilityReason(saved, cohortRows)) return saved;
    const preferred = DEFAULT_TYPES[questionKey] || "Bar";
    if (!sectionCompatibilityReason(preferred, cohortRows)) return preferred;
    return [...IMPLEMENTED_TYPES].find(type => !sectionCompatibilityReason(type, cohortRows)) || "Bar";
  }
  function chartTypeOptions(cohortRows, selected) {
    return Object.entries(CHART_CATALOG).map(([group, options]) => {
      const available = options.filter(option => !sectionCompatibilityReason(option.value, cohortRows));
      if (!available.length) return "";
      const optionMarkup = available.map(option => `<option value="${escapeHtml(option.value)}"${option.value === selected ? " selected" : ""}>${escapeHtml(option.label)}</option>`).join("");
      return `<optgroup label="${escapeHtml(group)}">${optionMarkup}</optgroup>`;
    }).join("");
  }
  function sectionChartControlMarkup({ key, questionKey, title, cohortRows }) {
    const selected = selectedSectionType(key, questionKey, cohortRows);
    const id = `sa-section-${safeId(key)}-type`;
    return `<div class="sa-section-chart-control"><label for="${id}">CHART TYPE</label><select class="sa-section-chart-select" id="${id}" data-section-key="${escapeHtml(key)}" aria-label="Chart type for ${escapeHtml(title)} section"${cohortRows.some(rows => rows.length) ? "" : " disabled"}>${chartTypeOptions(cohortRows, selected)}</select></div>`;
  }
  function cardMarkup({ key, questionKey, title, answered, cohort, cohortSize, sectionKey }) {
    return `<article class="sa-cohort-card" data-card-key="${escapeHtml(key)}" data-section-key="${escapeHtml(sectionKey)}" data-question-key="${escapeHtml(questionKey)}" data-title="${escapeHtml(title)}">
      <div class="sa-card-toolbar">
        <div class="sa-chart-label">${escapeHtml(cohort)}</div>
        <details class="sa-export"><summary title="Export chart" aria-label="Export chart"></summary><div class="sa-export-menu"><button type="button" data-export="svg">Download SVG</button><button type="button" data-export="png">Download PNG</button><button type="button" data-export="csv">Download CSV</button></div></details>
      </div>
      <div class="sa-chart-host seg-viz pp-host" id="sa-${safeId(key)}-host" data-chart-host="${escapeHtml(key)}"></div>
      <div class="sa-card-meta">${fmtCount(answered)} answered · ${fmtCount(cohortSize)} in segment</div>
    </article>`;
  }
  function profileMarkup(cohort, count, photo) {
    return `<article class="sa-card-profile" style="background-image:linear-gradient(0deg,rgba(23,12,35,.48),rgba(23,12,35,0) 58%),url('${photo}')"><div class="sa-card-profile-copy"><span>SEGMENT</span><h3>${escapeHtml(cohort)}</h3><strong>${fmtCount(count)} respondents</strong></div></article>`;
  }
  function sizeJourneyRails(root = content) {
    root.querySelectorAll(".sa-journey-rail").forEach(rail => {
      const label = rail.querySelector("span");
      if (label) rail.style.setProperty("--sa-rail-label-height", `${Math.ceil(label.scrollWidth)}px`);
    });
  }
  function updateJourneyRailVisibility() {
    const sections = [...content.querySelectorAll(".sa-question-section[data-section-rail]")];
    const visibleSections = sections.map(section => ({ section, rail: $(".sa-journey-rail", section), rect: section.getBoundingClientRect() }))
      .filter(item => item.rail && item.rect.bottom > 0 && item.rect.top < window.innerHeight);
    const viewportFocus = window.innerHeight * 0.48;
    const activeSection = journeyRailsScrollStarted
      ? visibleSections.find(item => item.rect.top <= viewportFocus && item.rect.bottom >= viewportFocus)?.section
        || visibleSections.sort((a, b) => Math.abs((a.rect.top + a.rect.bottom) / 2 - viewportFocus) - Math.abs((b.rect.top + b.rect.bottom) / 2 - viewportFocus))[0]?.section
      : null;
    sections.forEach(section => $(".sa-journey-rail", section)?.classList.toggle("is-scroll-active", section === activeSection));
  }
  function scheduleJourneyRailUpdate() {
    if (journeyRailUpdateFrame) return;
    journeyRailUpdateFrame = window.requestAnimationFrame(() => {
      journeyRailUpdateFrame = 0;
      journeyRailsScrollStarted = window.scrollY > 24;
      updateJourneyRailVisibility();
    });
  }
  function bindJourneyRailScroll() {
    if (content.dataset.journeyRailScrollBound) return;
    content.dataset.journeyRailScrollBound = "true";
    window.addEventListener("scroll", scheduleJourneyRailUpdate, { passive: true });
    window.addEventListener("resize", scheduleJourneyRailUpdate);
  }
  function render() {
    const filteredRows = recordsForFilter(), cohorts = cohortNames(), field = segmentField();
    const segmentCounts = new Map(cohorts.map(cohort => [cohort, filteredRows.filter(record => clean(record[field]) === cohort).length]));
    $("#sa-base-count").textContent = `${fmtCount(filteredRows.length)} respondents`;
    $("#sa-footer-count").textContent = `n=${fmtCount(filteredRows.length)}`;
    const allMarketCount = new Set(state.records.map(record => record.Market)).size;
    $("#sa-filter-count").textContent = !state.markets.size || state.markets.size === allMarketCount ? "All source markets" : `${fmtCount(state.markets.size)} countries selected`;
    $("#sa-chart-content").setAttribute("aria-labelledby", state.view === "age" ? "sa-age-tab" : "sa-budget-tab");
    document.querySelectorAll(".sa-view-button").forEach(button => {
      const active = button.dataset.view === state.view;
      button.classList.toggle("is-active", active); button.setAttribute("aria-selected", String(active));
    });
    const profiles = `<div class="sa-cohort-grid sa-profile-grid">${cohorts.map((cohort, index) => profileMarkup(cohort, segmentCounts.get(cohort) || 0, PHOTOS[state.view][index % 3])).join("")}</div>`;
    const chartRowsByCard = new Map(), chartTypesBySection = new Map();
    const questionSections = QUESTIONS.map(question => {
      const cohortData = cohorts.map(cohort => {
        const cohortRows = filteredRows.filter(record => clean(record[field]) === cohort);
        const distribution = questionDistribution(cohortRows, question);
        return { cohort, cohortRows, distribution };
      });
      const rowsByCohort = cohortData.map(item => item.distribution.rows);
      const sectionKey = chartKey(state.view, question.key, "section");
      const selectedType = selectedSectionType(sectionKey, question.key, rowsByCohort);
      chartTypesBySection.set(sectionKey, selectedType);
      const sectionRailLabel = SECTION_RAIL_LABEL_BY_QUESTION[question.key] || "";
      const cards = cohortData.map(({ cohort, cohortRows, distribution }) => {
        const key = chartKey(state.view, question.key, cohort);
        chartRowsByCard.set(key, distribution.rows);
        return cardMarkup({ key, questionKey: question.key, title: question.label, answered: distribution.answered, cohort, cohortSize: cohortRows.length, sectionKey });
      }).join("");
      const control = sectionChartControlMarkup({ key: sectionKey, questionKey: question.key, title: question.label, cohortRows: rowsByCohort });
      const rail = sectionRailLabel ? `<aside class="sa-journey-rail" aria-label="${sectionRailLabel} section"><span>${sectionRailLabel}</span></aside>` : "";
      const railAttribute = sectionRailLabel ? ` data-section-rail="${sectionRailLabel}"` : "";
      return `<section class="sa-question-section"${railAttribute} aria-labelledby="sa-head-${question.key}">${rail}<header class="sa-section-heading"><h2 id="sa-head-${question.key}">${escapeHtml(question.label)}</h2>${control}</header><div class="sa-cohort-grid">${cards}</div></section>`;
    }).join("");
    const spendData = cohorts.map(cohort => {
      const cohortRows = filteredRows.filter(record => clean(record[field]) === cohort);
      return { cohort, cohortRows, result: spendingDistribution(cohortRows) };
    });
    const spendRowsByCohort = spendData.map(item => item.result.rows);
    const spendSectionKey = chartKey(state.view, "spend", "section");
    const spendType = selectedSectionType(spendSectionKey, "spend", spendRowsByCohort);
    chartTypesBySection.set(spendSectionKey, spendType);
    const spendRailLabel = SECTION_RAIL_LABEL_BY_QUESTION.spend;
    const spendCards = spendData.map(({ cohort, cohortRows, result }) => {
      const key = chartKey(state.view, "spend", cohort);
      chartRowsByCard.set(key, result.rows);
      return cardMarkup({ key, questionKey: "spend", title: "Expected spending change", answered: result.base, cohort, cohortSize: cohortRows.length, sectionKey: spendSectionKey });
    }).join("");
    const spendControl = sectionChartControlMarkup({ key: spendSectionKey, questionKey: "spend", title: "Expected spending change", cohortRows: spendRowsByCohort });
    const spendRail = `<aside class="sa-journey-rail" aria-label="${spendRailLabel} section"><span>${spendRailLabel}</span></aside>`;
    content.innerHTML = `${profiles}${questionSections}<section class="sa-question-section" data-section-rail="${spendRailLabel}" aria-labelledby="sa-head-spend">${spendRail}<header class="sa-section-heading"><h2 id="sa-head-spend">Expected spending change</h2>${spendControl}</header><div class="sa-spend-grid">${spendCards}</div></section>`;
    sizeJourneyRails();
    bindJourneyRailScroll();
    scheduleJourneyRailUpdate();
    if (document.fonts?.ready) document.fonts.ready.then(() => { sizeJourneyRails(); scheduleJourneyRailUpdate(); });
    content.querySelectorAll(".sa-cohort-card").forEach(card => {
      const key = card.dataset.cardKey, sectionKey = card.dataset.sectionKey, questionKey = card.dataset.questionKey;
      const rows = chartRowsByCard.get(key) || [];
      const host = $(".sa-chart-host", card), selected = chartTypesBySection.get(sectionKey) || "Horizontal Bar";
      card._chartRows = rows;
      card._chartTitle = card.dataset.title;
      drawChart(host, rows, selected, questionKey);
    });
  }
  function updateMarketSummary() {
    const allMarkets = new Set(state.records.map(record => record.Market));
    const selected = selectedMarketSet();
    const label = state.markets.size === 0 || state.markets.size === allMarkets.size
      ? "All regions & countries" : `${state.markets.size} countries selected`;
    $("#sa-market-summary").firstChild ? $("#sa-market-summary").firstChild.textContent = label : $("#sa-market-summary").prepend(document.createTextNode(label));
    $("#sa-market-options").querySelectorAll("input[data-market]").forEach(input => { input.checked = selected.has(input.dataset.market); });
    $("#sa-market-options").querySelectorAll("input[data-region]").forEach(input => {
      const markets = REGION_MARKET_MAP[input.dataset.region].filter(market => state.records.some(record => record.Market === market));
      input.checked = markets.length > 0 && markets.every(market => selected.has(market));
      input.indeterminate = markets.some(market => selected.has(market)) && !input.checked;
    });
  }
  function buildMarketMenu() {
    const host = $("#sa-market-options"), markets = new Set(state.records.map(record => record.Market));
    const groups = Object.entries(REGION_MARKET_MAP).map(([region, regionMarkets]) => [region, regionMarkets.filter(market => markets.has(market))]).filter(([, values]) => values.length);
    host.innerHTML = `<div class="sa-market-actions"><button type="button" data-market-action="all">Select all</button><button type="button" data-market-action="clear">Clear selection</button></div>${groups.map(([region, regionMarkets]) => `<section class="sa-region-group"><h3><label class="sa-market-option"><input type="checkbox" data-region="${escapeHtml(region)}"><span>${escapeHtml(region)}</span></label></h3>${regionMarkets.map(market => `<label class="sa-market-option"><input type="checkbox" data-market="${escapeHtml(market)}"><span>${escapeHtml(market)}</span></label>`).join("")}</section>`).join("")}`;
    updateMarketSummary();
  }
  function setMarkets(markets) {
    state.markets = new Set(markets);
    updateMarketSummary();
    render();
  }
  function renderCurrentSection(select, type) {
    const section = select.closest(".sa-question-section"), sectionKey = select.dataset.sectionKey;
    const cards = [...section.querySelectorAll(".sa-cohort-card")], cohortRows = cards.map(card => card._chartRows || []);
    if (sectionCompatibilityReason(type, cohortRows)) return;
    state.selections.set(sectionKey, type);
    cards.forEach(card => drawChart($(".sa-chart-host", card), card._chartRows || [], type, card.dataset.questionKey));
  }
  function download(name, blob) {
    const url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url; link.download = name; link.click();
    URL.revokeObjectURL(url);
  }
  function exportCard(card, type) {
    const rows = card._chartRows || [], baseName = safeId(card.dataset.title || "segment-chart");
    if (type === "csv") {
      const csvRows = [["Category", "Count", "Share base", "Measure", "Share"] , ...rows.map(row => [row.label, row.count, row.base, row.measure || "respondents", fmtPct(row.value)])];
      const csv = csvRows.map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
      download(`${baseName}.csv`, new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
      return;
    }
    let source = $("svg", card);
    if (!source && $(".sa-plan-share-track", card)) {
      const track = $(".sa-plan-share-track", card), width = Math.max(300, Math.round(track.getBoundingClientRect().width)), height = 72;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", width); svg.setAttribute("height", height); svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const total = d3.sum(rows, row => row.count) || 1;
      let x = 0;
      rows.forEach((row, index) => {
        const segmentWidth = width * row.count / total, color = chartPalette(rows)[index];
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x); rect.setAttribute("y", 8); rect.setAttribute("width", segmentWidth); rect.setAttribute("height", 42); rect.setAttribute("fill", color);
        svg.append(rect);
        if (segmentWidth >= 48) {
          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", x + segmentWidth / 2); label.setAttribute("y", 37); label.setAttribute("text-anchor", "middle");
          label.setAttribute("fill", "#fff"); label.setAttribute("font-family", "Yellix, Arial, sans-serif"); label.setAttribute("font-size", "11"); label.textContent = fmtPct(row.count / total);
          svg.append(label);
        }
        x += segmentWidth;
      });
      source = svg;
    }
    if (!source) return;
    const clone = source.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.insertAdjacentHTML("afterbegin", "<style>text{font-family:Yellix,Arial,sans-serif}.sa-y-labels text{font-size:11px;fill:#453c4a}.sa-x-axis text{font-size:10px;fill:#756985}</style>");
    const svgText = new XMLSerializer().serializeToString(clone);
    if (type === "svg") { download(`${baseName}.svg`, new Blob([svgText], { type: "image/svg+xml;charset=utf-8" })); return; }
    const image = new Image(), url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
    image.onload = () => {
      const canvas = document.createElement("canvas"), scale = 2;
      canvas.width = (source.viewBox.baseVal.width || source.clientWidth) * scale;
      canvas.height = (source.viewBox.baseVal.height || source.clientHeight) * scale;
      canvas.getContext("2d").scale(scale, scale);
      canvas.getContext("2d").drawImage(image, 0, 0);
      canvas.toBlob(blob => { if (blob) download(`${baseName}.png`, blob); URL.revokeObjectURL(url); });
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }
  function attachEvents() {
    document.querySelectorAll(".sa-view-button").forEach(button => button.addEventListener("click", () => {
      if (state.view === button.dataset.view) return;
      state.view = button.dataset.view;
      render();
    }));
    $("#sa-reset").addEventListener("click", () => setMarkets([]));
    $("#sa-market-options").addEventListener("change", event => {
      const input = event.target;
      if (input.matches("input[data-market]")) {
        const next = new Set(selectedMarketSet());
        if (input.checked) next.add(input.dataset.market); else next.delete(input.dataset.market);
        setMarkets(next);
      } else if (input.matches("input[data-region]")) {
        const regionMarkets = REGION_MARKET_MAP[input.dataset.region].filter(market => state.records.some(record => record.Market === market));
        const next = new Set(selectedMarketSet());
        regionMarkets.forEach(market => input.checked ? next.add(market) : next.delete(market));
        setMarkets(next);
      }
    });
    $("#sa-market-options").addEventListener("click", event => {
      const action = event.target.closest("[data-market-action]")?.dataset.marketAction;
      if (!action) return;
      const all = new Set(state.records.map(record => record.Market));
      setMarkets(action === "all" ? all : []);
    });
    content.addEventListener("change", event => {
      const select = event.target.closest(".sa-section-chart-select");
      if (!select) return;
      renderCurrentSection(select, select.value);
    });
    content.addEventListener("click", event => {
      const button = event.target.closest("[data-export]");
      if (!button) return;
      const card = button.closest(".sa-cohort-card");
      exportCard(card, button.dataset.export);
      button.closest("details")?.removeAttribute("open");
    });
    document.addEventListener("pointerdown", event => {
      if (!event.target.closest(".sa-market-menu")) $("#sa-market-menu").removeAttribute("open");
      if (!event.target.closest(".sa-export")) document.querySelectorAll(".sa-export[open]").forEach(menu => menu.removeAttribute("open"));
    });
    document.addEventListener("mousemove", event => { if (tooltip.style.opacity === "1") {
      tooltip.style.left = `${Math.max(8, Math.min(window.innerWidth - 275, event.clientX + 14))}px`;
      tooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - 80, event.clientY + 12))}px`;
    }});
    $("#saLogout").addEventListener("click", () => {
      sessionStorage.removeItem("travelPulseAuth");
      window.location.href = "login.html";
    });
  }
  async function load() {
    try {
      const response = await fetch("data/manifest.json");
      if (!response.ok) throw new Error(`Could not load data/manifest.json (${response.status})`);
      const manifest = await response.json();
      const urls = Object.values(manifest.chunks.records || {});
      const chunks = await Promise.all(urls.map(async url => {
        const chunkResponse = await fetch(url);
        if (!chunkResponse.ok) throw new Error(`Could not load ${url} (${chunkResponse.status})`);
        return chunkResponse.json();
      }));
      state.records = chunks.flatMap(chunk => chunk.records || []).map(normalizeRecord);
      if (!state.records.length) throw new Error("No respondent records were found.");
      buildMarketMenu();
      render();
      setStatus("");
    } catch (error) {
      setStatus(`${error.message}. Open this page through a local web server so the data files can load.`, true);
    }
  }
  function start() {
    const catalogSize = Object.values(CHART_CATALOG).reduce((count, group) => count + group.length, 0);
    if (!catalogSize) {
      setStatus("Chart catalog configuration is incomplete.", true);
      return;
    }
    attachEvents();
    load();
  }
  document.addEventListener("DOMContentLoaded", start, { once: true });
})();
