# Handoff — Galería Walls (26 jun 2025)

Documento de continuidad para retomar el trabajo (Cursor / Claude / equipo).

---

## Estado del código

### Commit local (NO subido a GitHub)

- **Hash:** `5c62e94`
- **Mensaje:** `feat: orden narrativo de galería por títulos CRM y filtro LOCATION ampliado`
- **Archivos:** `src/lib/galleryGroups.ts`, `src/components/GalleryGrid.jsx`
- **Remoto GitHub:** sigue en `ba6e1b6` (19 jun 2025)
- **Push pendiente:** requiere token GitHub (`mirkodgzconsulting`) — esperar a jefe

### Qué hace el código nuevo

1. **Agrupación LOCATION:** títulos `Mural · detalle` o `Mural · N · detalle` → grupo = prefijo antes del 1er ` · `
2. **Orden narrativo:** índice oculto ` · 1 · `, ` · 2 · `… en título CRM (no se muestra en web)
3. **Fallback hardcodeado:** `GROUP_WALK_ORDER` para `8 donne straordinarie Milano` (hasta que CRM tenga índices)
4. **Vista All (57):** agrupa fotos por mural y ordena dentro de cada grupo
5. **Vista filtrada:** grid 2 columnas en filas (no masonry zigzag)
6. **Filtro LOCATION:** límite subido de 35 → **50 grupos** (Walls tiene 36)
7. **Display:** `formatDisplayTitle()` oculta ` · N · ` en hover/lightbox

---

## CRM — convención de títulos

Formato:

```
[Nombre mural] · [número] · [detalle visible]
```

Ejemplo **8 donne straordinarie Milano** (orden verificado foto a foto):

| # | Título CRM |
|---|------------|
| 1 | `8 donne straordinarie Milano · 1 · Via Tranquillo Cremona` |
| 2 | `8 donne straordinarie Milano · 2 · Rosa Genoni, Sibilla Aleramo` |
| 3 | `8 donne straordinarie Milano · 3 · Anna Kuliscioff, Ada Negri` |
| 4 | `8 donne straordinarie Milano · 4 · floral detail, Casa Majno` |
| 5 | `8 donne straordinarie Milano · 5 · Alessandrina Ravizza, Maria Montessori` |
| 6 | `8 donne straordinarie Milano · 6 · Ersilia Bronzini Majno, Laura Solera Mantegazza` |

Descripciones SEO en inglés — ver chat del 26 jun o tabla en CRM.

**Importante:** el nombre en el título debe coincidir con lo que se ve en la foto (hubo errores previos por intercambio de nombres).

---

## Murales adicionales

Misma convención ` · 1 · `, ` · 2 · `… sin cambiar código PHP del CRM.

Fase 2 (futuro): drag & drop en Filament (`dgz-crm-portal`) → `sort_order`.

---

## Cómo arrancar local mañana

```powershell
cd "D:\Proyecto Programador\Proyecto-PabloPinxit\pablopinxit-website\pablopinxit-sito"
npm run dev
```

→ http://localhost:4321/walls

**Nota:** `npm run dev` debe ejecutarse desde `pablopinxit-sito`, no desde la raíz del monorepo.

---

## Deploy pendiente (mañana)

1. Obtener token GitHub (permiso `repo`) o push por jefe
2. `git push origin main`
3. Verificar Vercel → deployment con `5c62e94`
4. Probar https://pablopinxit.com/walls

---

## Repos y accesos

| Recurso | URL / dato |
|---------|------------|
| Sitio repo | https://github.com/DGZ-Consulting/pablopinxit-sito |
| Usuario Git | mirkodgzconsulting / mirko@dgzconsulting.com |
| Producción | https://pablopinxit.com |
| CRM API | https://crm.dgzconsulting.com |
| CRM código | `dgz-crm-portal` (PHP/Laravel — fase 2) |

---

## Pendiente opcional (no bloqueante)

- [ ] Grid en filas también en vista **All** para murales con secuencia (hoy solo masonry en All)
- [ ] Añadir más murales con ` · N · ` en CRM (sin hardcode en `GROUP_WALK_ORDER`)
- [ ] Quitar `GROUP_WALK_ORDER` de 8 donne cuando CRM tenga los 6 índices confirmados
- [ ] Commit/push de este handoff doc si se desea en repo

---

## Contexto mural 8 donne

Murale arte público Pablo Pinxit, Via Tranquillo Cremona 27, Casa Majno, Milano. 8 pioneras del feminismo italiano. Inaugurado sep 2025.
