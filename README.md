# n8n setup

These workflows connect the staff dashboard to MongoDB through the Next.js server API. Import the JSON files in n8n, then set the same `N8N_SHARED_SECRET` in the Next.js `.env.local` and in the HTTP Request node header.

1. Import `approve-message.json` and activate it. The dashboard calls `GET /webhook/approve-message?message_id=...`.
2. Import `reminder-agent.json` and activate it. It runs daily and creates one pending follow-up for the quiet Hamza test student.
3. Set the `APP_URL` variable or replace the placeholder URL in both HTTP Request nodes with the deployed Next.js URL.
4. The approval workflow is idempotent: a second approval returns a conflict and cannot send the same message twice.

The browser never receives MongoDB credentials. n8n calls the protected server endpoints, and the server owns all database writes.
