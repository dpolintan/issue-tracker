# Issue Tracker

Quick setup instructions for running the project locally.

## Database

- Start a PostgreSQL database (create a database named `joby` or update the URL in `backend/database.py`).

Example using Docker:

```bash
docker run --name issue-tracker-db -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=joby -p 5432:5432 -d postgres:15
```

## Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
# then run the app
fastapi dev main.py
```

Make sure `backend/database.py` contains the correct Postgres connection URL.

## Frontend

```bash
cd frontend/frontend
npm install
npm start
```

The frontend expects the backend API at `http://127.0.0.1:8000` by default. Adjust `frontend/src/api/IssuesApi.js` if needed.

## Notes
- Recreating the database tables from models will drop data. Use migrations (Alembic) for safe schema changes in production.
- Environment variables and credentials should not be committed; secure them when deploying.
