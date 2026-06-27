# Handoff — pablopinxit-sito (actualizado 27 jun 2025)

Documento de continuidad para **Cursor Agent** y **Claude Code** (extensión en Cursor).
Leer también: `CLAUDE.md`, `docs/DOKPLOY.md`.

---

## Estado actual — COMPLETADO

| Item | Estado |
|------|--------|
| Galería orden narrativo + filtro LOCATION | ✅ En producción |
| Mural 8 donne (6 fotos) títulos CRM | ✅ Con ` · 1 · ` … ` · 6 · ` |
| Git push GitHub | ✅ `8466dbf` en `main` |
| Deploy Dokploy | ✅ Done |
| DNS pablopinxit.com → 89.167.120.116 | ✅ DNS Valid |
| Producción | https://pablopinxit.com/walls |

---

## Commits relevantes

| Hash | Descripción |
|------|-------------|
| `5c62e94` | Orden narrativo galería, filtro LOCATION, grid filas |
| `8466dbf` | Migración Dokploy: Node adapter + Dockerfile |

---

## Galería — lógica implementada

**Archivos:** `src/lib/galleryGroups.ts`, `src/components/GalleryGrid.jsx`

1. **Agrupación LOCATION:** prefijo antes del 1er ` · ` (ej. `8 donne straordinarie Milano`)
2. **Orden:** índice oculto en CRM ` · 1 · `, ` · 2 · `… → `parseWalkOrderFromTitle()`
3. **Display:** `formatDisplayTitle()` oculta el número en hover/lightbox
4. **Fallback:** `GROUP_WALK_ORDER['8 donne straordinarie Milano']` si faltan índices en CRM
5. **Vista All:** `sortAllGalleryImages()` — fotos del mismo mural juntas y ordenadas
6. **Vista filtrada:** grid 2 cols en filas (`shouldUseSequentialGrid`)
7. **Filtro:** visible si 2–50 grupos (`shouldShowGalleryFilters`)

### Convención CRM (títulos)

```
[Nombre mural] · [número] · [detalle visible]
```

**8 donne straordinarie Milano** (orden verificado foto a foto):

| # | Título |
|---|--------|
| 1 | `… · 1 · Via Tranquillo Cremona` |
| 2 | `… · 2 · Rosa Genoni, Sibilla Aleramo` |
| 3 | `… · 3 · Anna Kuliscioff, Ada Negri` |
| 4 | `… · 4 · floral detail, Casa Majno` |
| 5 | `… · 5 · Alessandrina Ravizza, Maria Montessori` |
| 6 | `… · 6 · Ersilia Bronzini Majno, Laura Solera Mantegazza` |

Descripciones SEO en **inglés** en campo description del CRM.

---

## Deploy — Dokploy (NO Vercel)

- **Panel:** https://deploy.dgzconsulting.com
- **Proyecto:** pablopinxit → production → website
- **Adapter:** `@astrojs/node` mode `standalone`
- **Puerto contenedor:** 4321
- **Dominio:** pablopinxit.com → Port 4321, HTTPS LetsEncrypt

### Variables de entorno (Dokploy)

```
CRM_URL=https://crm.dgzconsulting.com
CRM_SITE_SLUG=pablopinxit
HOST=0.0.0.0
PORT=4321
```

### Local

```powershell
cd pablopinxit-sito
npm run dev          # http://localhost:4321
npm run build && npm run start
docker build -t pablopinxit-sito . && docker run -p 4321:4321 -e CRM_URL=... -e HOST=0.0.0.0 -e PORT=4321 pablopinxit-sito
```

---

## Pendiente fase 2 (no urgente)

- [ ] Reorder drag & drop en CRM PHP (`dgz-crm-portal`)
- [ ] Índices ` · N · ` en otros murales desde Filament
- [ ] Quitar `GROUP_WALK_ORDER` hardcodeado cuando 8 donne tenga índices en CRM
- [ ] Dominio `www.pablopinxit.com` en Dokploy (si falta)
- [ ] Desactivar proyecto Vercel
- [ ] Revisar HTTPS si navegador aún muestra "No es seguro" (propagación cert)
- [ ] Grid en filas en vista All (opcional; hoy masonry en All, orden lógico OK)

---

## Contexto mural 8 donne

Murale Pablo Pinxit, Via Tranquillo Cremona 27, Casa Majno, Milano. 8 pioneras feminismo italiano. Sep 2025.
