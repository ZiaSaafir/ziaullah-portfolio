# Ziaullah Saafir — Developer Portfolio

A responsive React portfolio backed by Django REST Framework. Public content is editable through Django Admin; no admin credentials are shipped with the project.

## Requirements

- Python 3.12 or newer
- Node.js 20 or newer and npm
- A modern browser

SQLite is used by default for local development. Set `DATABASE_URL` to use a hosted PostgreSQL database such as Neon. MySQL remains an optional alternative through `requirements-mysql.txt`.

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The public API is available at `http://127.0.0.1:8000/api/`. Manage portfolio content at `http://127.0.0.1:8000/admin/` after creating an administrator account.

To email contact form submissions, set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, and `DEFAULT_FROM_EMAIL` in the environment. Without email configuration, submissions are stored in the database and visitors can also contact you through the visible email link.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api`, `/admin`, and `/media` to the Django server at `http://127.0.0.1:8000`. For a hosted frontend, set `VITE_API_URL` to the backend URL without a trailing slash and add the frontend origin to Django's `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.

Build the static frontend with `npm run build`. For the Vercel + Render + Neon free-tier deployment:

1. Push this project to a GitHub repository. Do not commit `.env` files, database URLs, or passwords.
2. In Neon, create a PostgreSQL project and copy its pooled connection URL (include SSL, usually `sslmode=require`).
3. In Render, create a Blueprint from the repository using the root `render.yaml`. Provide the Neon URL as `DATABASE_URL`; after the frontend is deployed, set `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` to its exact origin (for example, `https://your-site.vercel.app`, without a trailing slash). The blueprint generates a Django secret key and runs migrations and `collectstatic` during deployment.
4. In Vercel, import the same repository and set the project Root Directory to `frontend`. Add `VITE_API_URL` with the Render backend origin (for example, `https://ziaullah-portfolio-api.onrender.com`), without a trailing slash, then deploy.
5. Add the final Vercel origin to both Render origin settings and redeploy the backend. For local admin setup, Neon CLI's root `.env.local` is read by Django; from `backend`, run `python manage.py createsuperuser` with your local virtual environment active. Admin is then available at `https://your-backend.onrender.com/admin/`.

The Vercel project uses its free `*.vercel.app` domain. Free Render services can sleep when idle and may take time to wake up. Their local filesystem is not persistent, so uploaded media (cover images, profile images, and CV files) needs external object storage if it must survive redeployments. Replace `your-domain.example` in `frontend/public/robots.txt` and `frontend/public/sitemap.xml` if you later use a custom domain.

## Content management

Django Admin provides authenticated create/edit/delete management for projects, articles, profile/about content, skills, and contact messages. Projects and articles remain unpublished until marked published. An article can be an original Markdown post or an external link. For LinkedIn and Medium posts, enter the original URL and leave the platform blank to detect it automatically; the public card displays the platform and links directly to the original post. Uploads are stored under `MEDIA_ROOT`; configure durable private/protected storage as appropriate before production.

The four project names initially mentioned by Ziaullah are seeded by the first migration. Public details are prefilled for the AI Assistant, Agriculture Shop Management/POS, and Clinic Management repositories. The other project details are intentionally left editable rather than fabricated. Additional projects can be added in Django Admin without source changes.

Run backend tests with `python manage.py test portfolio` from the `backend` directory.

## Security notes

- Create the first admin user with `createsuperuser`; there is no default admin account.
- Admin writes use Django's authenticated admin and API admin permissions.
- Contact submissions are validated and rate-limited.
- Email credentials and Django secrets are environment-only.
- Public API responses expose published content only.
# ziaullah-portfolio
