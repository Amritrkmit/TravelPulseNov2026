# Travel Pulse Excel-grounded AI chatbot

This package retains the original dashboard and chatbot styling. It **does not connect to the private ChatGPT Agent**. Instead, it reads the supplied survey workbook locally and uses an OpenAI API-powered tool-calling assistant to compute counts and comparisons from actual rows. No PostgreSQL or Workspace Agent token required.

## Windows setup
1. Install Python 3.11+.
2. Open the `TravelPulse2026V5OCT-main` folder in VS Code.
3. Copy `.env.example` to `.env` and put your OpenAI API key in `.env` (never in chatbot.js or browser storage).
4. Run `RUN_AI_CHATBOT.bat` or run `python -m pip install -r requirements-ai.txt` then `python -m uvicorn ai_server:app --host 127.0.0.1 --port 8000`.
5. Open **http://127.0.0.1:8000/** (NOT Live Server / port 5500).
6. Check **http://127.0.0.1:8000/api/health** to verify row count, columns and key configuration.
7. Click the original chatbot icon and ask: `How many respondents are in the survey?` or `What is the age segment distribution?`.

## Important limitations
- The Excel file is included locally and may contain confidential survey data. Restrict access; do not publish this ZIP or serve the backend on a public host without authentication.
- The agent summarizes aggregated data. It does not access the private ChatGPT agent's instructions, and answers may differ from that agent.
- Some dashboard charts may use precomputed JSON with different definitions than raw survey questions. Validate important figures against the dashboard and questionnaire before business use.
- This version supports per-column distributions, filtering and grouped comparisons. Complex multi-select questions and NPS require additional dedicated functions to guarantee matching calculations.
- The OpenAI key remains on the server. Only aggregated counts are sent to OpenAI; raw survey rows are not submitted by this implementation.
