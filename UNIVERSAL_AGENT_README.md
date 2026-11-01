# Travel Pulse Universal Survey Agent — Local Setup

This version uses the master Excel workbook and OpenAI tool calling. It does not call a private ChatGPT Workspace Agent and does not need PostgreSQL.

## Run on Windows
1. Open this directory in VS Code.
2. Run `python -m pip install -r requirements-ai.txt`.
3. Copy `.env.example` to `.env` (or edit existing `.env`) and set `OPENAI_API_KEY=...`. Keep the key secret and never add it to JavaScript or Git.
4. Run `python -m uvicorn ai_server:app --host 127.0.0.1 --port 8000`.
5. Open `http://127.0.0.1:8000/` and use the chatbot.
6. To run local deterministic checks: `python -m unittest discover -s tests -v`.

## Supported operations
- Field discovery across 1,516 columns; unweighted single-response rankings and distributions.
- Country aliases and multiple AND/OR filters; country, region, age, budget, and traveler-type grouping.
- Checkbox multi-select distributions for numbered question families (e.g. Q9, Q11, Q16).
- Follow-up context via recent conversation messages.
- JSON filename discovery for identifying relevant dashboard assets. Dashboard JSON content is NOT automatically reconciled against Excel.

## Limitations
- Survey-weight validation, NPS/sentiment-specific metrics, routing rules, custom computed segments, arbitrary complex boolean logic, and cross-dataset JSON reconciliations need additional metric-specific definitions and tests. The agent should state these limitations rather than inventing results.
- The AI chat cannot be end-to-end verified without a working OpenAI key/network. The local unit tests check deterministic calculations only.
- If source workbook changes, restart the backend to clear its in-memory cache.
- Dashboard precomputed JSON files still depend on the existing `scripts/precompute_dashboard.py` pipeline; the AI Excel calculations do not update those files.
