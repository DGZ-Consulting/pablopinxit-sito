# Tarea: SEO descriptions con IA en el CRM

**Proyecto:** `dgz-crm-portal` + `pablopinxit-sito`  
**Prioridad:** Alta  
**Estimado:** 1–2 horas (con revisión)  
**Estado:** Pendiente — semana próxima

---

## Objetivo

Generar **descriptions SEO en inglés** para el portfolio de Pablo Pinxit en el CRM, sin tocar nombres de categoría ni títulos de obras.

| Qué | Cantidad actual | Acción |
|-----|-----------------|--------|
| Descriptions de categorías | 6 vacías | Generar con IA |
| Descriptions de obras | ~268 vacías | Generar con IA (bulk) |
| Títulos de obras | ✅ Completos | **No tocar** |
| Nombres de categoría | ✅ Completos | **No tocar** |

---

## Pre-requisitos

1. Añadir en `.env` del CRM:

```env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

2. CRM corriendo (`php artisan serve` o producción)

---

## Paso 1 — Prueba en seco (Walls)

```bash
cd dgz-crm-portal
php artisan portfolio:generate-seo pablopinxit --category=walls --dry-run
```

Revisar output en consola. Comprobar que:
- Descriptions en **inglés**
- ~150 chars categoría, ~80–150 chars obras
- No inventa lugares que no estén en el título

---

## Paso 2 — Generar Walls (real)

```bash
php artisan portfolio:generate-seo pablopinxit --category=walls
```

Revisar en Filament → **Mi Portfolio** → Walls → editar categoría e imágenes.

---

## Paso 3 — Resto del portfolio

```bash
# Solo categorías (6 descriptions)
php artisan portfolio:generate-seo pablopinxit --categories-only

# Todas las obras sin description
php artisan portfolio:generate-seo pablopinxit --items-only

# O todo de una vez
php artisan portfolio:generate-seo pablopinxit
```

**Ikons tiene 88 obras** — revisar con calma después.

---

## Alternativa: botones en Filament (ya implementados)

En panel Cliente → **Mi Portfolio**:

1. **Editar categoría** → botón **"Generar SEO con IA"** (description de categoría)
2. Tab **Imágenes** → **"Generar SEO imágenes (IA)"** (solo obras sin description)

---

## Paso 4 — Limpiar títulos genéricos (manual)

Renombrar en CRM obras tipo:
- ❌ `Foto 1 - 18 junio 2026`
- ✅ `Tunnel Via Padova Milano — detail`

Mejora alt tags e image sitemap.

---

## Paso 5 — Después de generar

1. **No hace falta redeploy** del sitio (SSR lee CRM en tiempo real)
2. Google Search Console → **Richiedi nuova scansione** en:
   - `https://pablopinxit.com/walls`
   - `https://pablopinxit.com/ikons`
   - etc.
3. Re-enviar sitemap de imágenes (opcional):
   - `https://pablopinxit.com/sitemap-images.xml`

---

## Qué mejora en pablopinxit.com

| Campo CRM | Efecto en el sitio |
|-----------|-------------------|
| `category.description` | meta description, OG, JSON-LD |
| `item.description` | image sitemap caption, JSON-LD, `<figcaption>` SSR |

---

## Flags útiles del comando

| Flag | Uso |
|------|-----|
| `--dry-run` | Preview sin guardar |
| `--category=walls` | Una sola galería |
| `--categories-only` | Solo 6 categorías |
| `--items-only` | Solo obras |
| `--force` | Sobrescribir descriptions existentes |
| `--batch=20` | Obras por request IA (default 20) |

---

## Checklist final

- [ ] `ANTHROPIC_API_KEY` configurada
- [ ] Dry-run Walls OK
- [ ] 6 categorías con description
- [ ] ~268 obras con description
- [ ] Revisión manual Ikons + fotos "Foto N..."
- [ ] Re-indexación en Google Search Console

---

*Implementado en dgz-crm-portal: `PortfolioSeoGenerator`, `portfolio:generate-seo`, botones Filament.*
