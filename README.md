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

The public API is available at `http://127.0.0.1:8000/api/`.

Manage portfolio content at `http://127.0.0.1:8000/admin/` after creating an administrator account.

To email contact form submissions, configure `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, and `DEFAULT_FROM_EMAIL` in the environment. Without email configuration, submissions are stored in the database and visitors can also contact you through the visible email link.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses a centralized API client and loads profile, projects, articles, and skills independently, so a failed endpoint does not hide data from working endpoints.

Vite proxies `/api`, `/admin`, and `/media` to the Django server at `http://127.0.0.1:8000`.

For a hosted frontend, configure:

```env
VITE_API_URL=https://ziaullah-portfolio-api.onrender.com
```

Do not add a trailing slash.

## Production Deployment

The portfolio uses the following deployment architecture:

| Component | Platform | Production URL |
|---|---|---|
| Frontend | Vercel | https://ziasaafir.vercel.app |
| Backend | Render | https://ziaullah-portfolio-api.onrender.com |
| Database | Neon PostgreSQL | Configured through Render |

### 1. GitHub

Push the project to your GitHub repository.

Never commit `.env` files, database URLs, passwords, or secret keys.

### 2. Neon PostgreSQL

- Create a PostgreSQL project in Neon.
- Copy its pooled connection URL.
- Include SSL configuration, usually `sslmode=require`.
- Keep the database URL private.

### 3. Render Backend Configuration

Create your Render service using the repository's root `render.yaml` Blueprint.

Configure these environment variables:

| Environment variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon PostgreSQL connection URL |
| `DJANGO_ALLOWED_HOSTS` | `ziaullah-portfolio-api.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://ziasaafir.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://ziasaafir.vercel.app` |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_SECRET_KEY` | Your secure Django secret key |

**Important:**
- Keep the Django secret key private.
- Do not include `https://` in `DJANGO_ALLOWED_HOSTS`.
- Use the exact frontend origin in the CORS and CSRF settings.
- Ensure the environment-variable names match those referenced in your Django `settings.py` and `render.yaml`.
- The Blueprint generates a Django secret key and runs migrations and `collectstatic` during deployment, if configured accordingly.

### 4. Vercel Frontend Configuration

Import the same GitHub repository into Vercel.

Configure the project:

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

Add this environment variable in Vercel:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://ziaullah-portfolio-api.onrender.com` |

Select the Production environment (and Preview if required).

Deploy the frontend.

### 5. Final CORS and CSRF Configuration

After deploying the frontend, make sure the following values are configured in Render:

```env
CORS_ALLOWED_ORIGINS=https://ziasaafir.vercel.app
CSRF_TRUSTED_ORIGINS=https://ziasaafir.vercel.app
DJANGO_ALLOWED_HOSTS=ziaullah-portfolio-api.onrender.com
```

Save the environment variables and redeploy the backend if you make changes.

### 6. Django Admin

The production admin panel is available at:

`https://ziaullah-portfolio-api.onrender.com/admin/`

Create an administrator account using:

```bash
cd backend
python manage.py createsuperuser
```

Use your configured production database when creating the production administrator. Do not create the account only in a local SQLite database if you want to access the production admin.

## Content Management

Django Admin provides authenticated create, edit, and delete management for:

- Projects
- Articles
- Profile and About content
- Skills
- Contact messages

Projects and articles remain unpublished until marked as published.

An article can be an original Markdown post or an external link. For LinkedIn and Medium posts, enter the original URL and leave the platform blank to detect it automatically. The public card displays the platform and links directly to the original post.

Uploads are stored under `MEDIA_ROOT`. Configure durable external object storage before production if uploaded media must survive redeployments.

The four project names initially mentioned by Ziaullah are seeded by the first migration. Public details are prefilled for the AI Assistant, Agriculture Shop Management/POS, and Clinic Management repositories. Other project details are intentionally left editable rather than fabricated.

Additional projects and articles can be added through Django Admin without changing frontend source code.

## Testing

Run backend tests:

```bash
cd backend
python manage.py test portfolio
```

Build the frontend:

```bash
cd frontend
npm install
npm run build
```

## Security Notes

- Create the first admin user with `createsuperuser`; there is no default admin account.
- Admin writes use Django's authenticated admin and API admin permissions.
- Contact submissions are validated and rate-limited.
- Email credentials and Django secrets are environment-only.
- Public API responses expose published content only.
- Never expose admin credentials or private environment variables in frontend code.

## Deployment Notes

- The Vercel project uses the free `vercel.app` domain.
- Free Render services can sleep when idle and may take time to wake up.
- Free Render services have ephemeral local filesystems, so uploaded media needs external object storage for reliable persistence.
- Replace `your-domain.example` in `frontend/public/robots.txt` and `frontend/public/sitemap.xml` if you later use a custom domain.

---

**Portfolio:** https://ziasaafir.vercel.app  
**Backend API:** https://ziaullah-portfolio-api.onrender.com/api/  
**Django Admin:** https://ziaullah-portfolio-api.onrender.com/admin/