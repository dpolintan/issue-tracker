# Issue Tracker

Quick setup instructions for running the project locally.

**List Issues**
<img width="1254" height="640" alt="Screenshot 2025-12-15 at 6 27 52 PM" src="https://github.com/user-attachments/assets/00a1d3fe-117e-4ae0-a89e-104b9f6ada48" />

**Create Issue**
<img width="1256" height="749" alt="Screenshot 2025-12-15 at 6 39 08 PM" src="https://github.com/user-attachments/assets/3435e25e-798b-40e0-958a-7f24a20c5fd9" />

**Edit Issue**
<img width="1253" height="754" alt="Screenshot 2025-12-15 at 6 39 18 PM" src="https://github.com/user-attachments/assets/29b75a1f-a5e9-49da-969e-6724b7cfa5da" />

**Delete Issue**
<img width="1253" height="750" alt="Screenshot 2025-12-15 at 6 39 28 PM" src="https://github.com/user-attachments/assets/d0ac049b-b832-4626-b69a-c3f858724c9b" />

## Database

- Start a PostgreSQL database (create a database named `joby` or update the URL in `backend/database.py`).

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

## Decisions Taken

- **Backend ORM:** Using SQLAlchemy for the data model and schema management to avoid hand-writing error-prone SQL statements and to leverage SQLAlchemy's conveniences (declarative models, session management, optional Alembic migrations).
- **DB Driver:** The app requires a PostgreSQL driver compatible with SQLAlchemy (e.g., `psycopg2-binary`). Ensure the driver is installed in the backend virtualenv.
- **React Query:** Used for data fetching and cache management to handle loading and error states cleanly.
- **Modals over routes:** The UI uses modal dialogs for create/edit flows instead of separate routes/pages to make navigation simpler; this can be migrated to dedicated pages if the UX specification changes.

## Limitations

- **Auth & Security (backend):** No built-in authentication or authorization (no JWT/session handling, no RBAC). Input validation is basic and the app lacks hardened security configuration (rate limiting, WAF, encryption key management). Secrets are expected to come from env variables; there is no secret management or rotation strategy.
- **Auth & Access Control (frontend):** The UI assumes an open API and has no login flows, protected routes, or token handling. Integrating authentication will require frontend changes (login UI, token storage) and backend endpoints for auth.
- **Data Scaling:** The API and UI return lists without server-side pagination or cursoring; for very large datasets this will lead to heavy payloads and memory pressure. While basic indexes exist, large-scale usage will need pagination, filtered queries, and potentially partitioning or more advanced indexing strategies.

## Assumptions

- `created_on` will always be set automatically to the timestamp when the issue is first submitted and cannot be set/edited by the user via the API or UI.
- New issues default to `status = "open"` when created.
- The backend will run against a PostgreSQL instance; the provided defaults assume a local DB at `postgresql://postgres:password@localhost:5432/joby` unless overridden by `DATABASE_URL` or other env vars.
