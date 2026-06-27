# Deploy en Dokploy — pablopinxit-sito

Sitio Astro SSR con adapter **Node standalone** + **Docker**.

## Requisitos

- Repositorio: `https://github.com/DGZ-Consulting/pablopinxit-sito`
- Rama: `main`
- Dockerfile en la raíz del repo

## Variables de entorno (obligatorias)

| Variable | Ejemplo | Descripción |
|----------|---------|-------------|
| `CRM_URL` | `https://crm.dgzconsulting.com` | API del portfolio |
| `CRM_SITE_SLUG` | `pablopinxit` | Slug del sitio en el CRM |
| `HOST` | `0.0.0.0` | **Requerido en Docker** |
| `PORT` | `4321` | Puerto interno del contenedor |

## Pasos en Dokploy (deploy.dgzconsulting.com)

1. **Projects** → crear o abrir proyecto (ej. `DGZ-Previews` o uno nuevo `Pablo-Pinxit`).
2. **Create Service** → tipo **Application** → **GitHub**.
3. Conectar repo `DGZ-Consulting/pablopinxit-sito`, rama `main`.
4. **Build type:** Dockerfile (ruta `./Dockerfile`, contexto raíz).
5. **Environment:** añadir `CRM_URL`, `CRM_SITE_SLUG`, `HOST=0.0.0.0`, `PORT=4321`.
6. **Ports:** contenedor `4321` → Traefik/domino público (443).
7. **Domain:** `www.pablopinxit.com` / `pablopinxit.com` (cuando migren desde Vercel).
8. Deploy.

## Health check (opcional)

- Path: `/`
- Port: `4321`

## Migración desde Vercel

1. Desplegar en Dokploy y probar con dominio preview.
2. Verificar `/walls`, CRM, sitemaps.
3. Cambiar DNS de `pablopinxit.com` al servidor Dokploy / Traefik.
4. Desactivar proyecto Vercel cuando producción esté estable.

## Build local (prueba)

```bash
docker build -t pablopinxit-sito .
docker run --rm -p 4321:4321 \
  -e CRM_URL=https://crm.dgzconsulting.com \
  -e CRM_SITE_SLUG=pablopinxit \
  -e HOST=0.0.0.0 \
  -e PORT=4321 \
  pablopinxit-sito
```

Abrir http://localhost:4321

## Notas

- Las fotos y textos del portfolio **no** van en el contenedor; vienen del CRM en runtime.
- `@vercel/analytics` fue retirado (solo funcionaba en Vercel).
