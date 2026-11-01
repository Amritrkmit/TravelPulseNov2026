# Travel Pulse AI Agent — Setup

This agent reads the bundled `survey_data.xlsx` (1417 respondents). It does not connect to your private ChatGPT Workspace Agent and does not require PostgreSQL. The instructions are in `agent_instructions.py`, with supporting markdown under `knowledge/`. `ai_server.py` exposes `/api/chat` and tool-backed analysis.

1. In Windows PowerShell, open the project directory.
2. Run `python -m pip install -r requirements-ai.txt`.
3. Copy `.env.example` to `.env`, and set `OPENAI_API_KEY` (keep private).
4. Run `python -m uvicorn ai_server:app --host 127.0.0.1 --port 8000`. Or use `RUN_AI_CHATBOT.bat`.
5. Open http://127.0.0.1:8000/ and ask a question.
6. Health check: http://127.0.0.1:8000/api/health.

Example: 'Most preferred airline in India?' Agent must discover QS0 and Q14 and calculate from India-only records. Whole-sample Emirates 172/1417 must NOT be returned as India-specific.

`precompute_dashboard.py` is separate and only needed when underlying dashboard JSON changes.

Limits: no live OpenAI API test was performed in this environment. The system prompt and tools do not guarantee every complex survey question is interpreted correctly. New file uploads and survey weighting are not implemented in this local chat interface. Validate sensitive analyses against workbook.
