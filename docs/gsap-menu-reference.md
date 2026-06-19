# GSAP Interruptible Single Timeline Enter/Exit — Menu Reference

> **Source:** [CodePen by GreenSock](https://codepen.io/GreenSock/pen/qEaKJZr) | [Demo](https://demos.gsap.com/demo/interruptible-single-timeline-enterexit/)
> **Title:** Menu example, different enter and exit animations
> **Categorias:** Navigation, UI
> **Requiere:** GSAP 3.15+ (por `easeReverse`)

---

## Concepto

Un **solo timeline de GSAP** controla tanto la animacion de entrada como la de salida del menu. Se usa `.addPause()` en el medio para separar ambas fases:

1. **ENTER** — los paneles entran deslizandose desde la derecha con `back.out`, los items del nav aparecen con stagger, y el hamburger se transforma en X.
2. **PAUSE** — el timeline se detiene aqui. El menu esta completamente abierto.
3. **EXIT** — los paneles caen hacia abajo con rotacion aleatoria (`power3.in`), la X vuelve a hamburger, y el fondo se desvanece.

### Comportamiento interruptible

- Si el usuario abre y cierra **rapido** (antes de que termine ENTER), el timeline se **reversa** desde donde esta, usando `easeReverse` para que la reversa se sienta responsive.
- Si el menu ya esta **completamente abierto** (llego al `addPause`), cerrar dispara la animacion EXIT (play forward).
- `easeReverse` cambia de `back.out` (entrada) a `power3.in` (reversa), asi el menu se quita rapido del camino.

---

## HTML

```html
<div class="topbar">
  <span class="logo"><img src="https://assets.codepen.io/16327/gsap-logo-light.svg" alt="" /></span>
  <button class="menu-toggle" id="menuToggle" aria-expanded="false" aria-label="Open menu">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line class="bar bar-top" x1="3" y1="7" x2="17" y2="7" stroke="var(--white)" stroke-width="1.5" stroke-linecap="round"/>
      <line class="bar bar-mid" x1="3" y1="10" x2="17" y2="10" stroke="var(--white)" stroke-width="1.5" stroke-linecap="round"/>
      <line class="bar bar-bot" x1="3" y1="13" x2="17" y2="13" stroke="var(--white)" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</div>

<div class="header">
  <h1>Interruptible Single Timeline Enter/Exit</h1>
  <p>This demo uses a single GSAP timeline with an <code>.addPause()</code> in the middle to separate the enter
    and exit animations. If the enter animation is playing and the user doubletaps quickly to close it,
    the entrance animation reverses.
    Once the menu is fully open, tapping again plays forward into a completely different exit animation
    where the panels fall with random rotation.
    <code>easeReverse</code> makes the reversal feel responsive by switching from <code>back.out</code>
    on enter to <code>power3.in</code> on reverse, so the menu gets out of the way quickly when someone
    changes their mind.
  <br/></br/>
  Toggle ease reverse and speed up the exit to feel the difference in how the entrance reverse behaves.
  </p>
  <div class="controls">
    <label><input type="checkbox" id="erToggle" checked /><code>easeReverse</code></label>
    <label>exit speed
      <input type="range" id="exitSlider" min="1" max="4" step="0.5" value="1.5" />
      <span class="speed-val" id="exitVal">1.5x</span>
    </label>
  </div>
</div>

<div class="nav" id="nav">
  <div class="nav-bg"></div>

  <!-- Top panel — white -->
  <div class="nav-top nav-border nav-panel" id="navTop">
    <ul class="nav-list">
      <li class="nav-item"><a class="nav-link" href="#">Tools</a></li>
      <li class="nav-item"><a class="nav-link" href="#">About</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Showcase</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Community</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Learn GSAP</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Docs</a></li>
    </ul>
    <div class="nav-login">Login / Create Account</div>
  </div>

  <!-- Middle panel — matcha green gradient -->
  <div class="nav-middle nav-border nav-panel" id="navMiddle">
    <div class="nav-middle-header">What's New</div>
    <div class="nav-middle-card">
      <div class="nav-middle-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>
      <div class="nav-middle-info">
        <div class="nav-middle-title">GSAP 3.15 is here</div>
        <div class="nav-middle-desc">New easeReverse &amp; more.</div>
      </div>
    </div>
    <div class="nav-middle-actions">
      <a href="#">Release Notes</a>
    </div>
  </div>

  <!-- Bottom panel — black -->
  <div class="nav-bottom nav-border nav-panel" id="navBottom">
    <ul class="nav-socials">
      <li><a href="#">CodePen</a></li>
      <li><a href="#">GitHub</a></li>
      <li><a href="#">LinkedIn</a></li>
      <li><a href="#">X</a></li>
    </ul>
    <div class="nav-asset">
      <img src="https://gsap.com/img/header-shapes.png" alt="" />
    </div>
  </div>
</div>
```

---

## CSS

```css
@font-face {
  font-display: block;
  font-family: Mori;
  font-weight: 400;
  src: url(https://assets.codepen.io/16327/PPMori-Regular.woff) format("woff");
}
@font-face {
  font-display: block;
  font-family: Mori;
  font-weight: 600;
  src: url(https://assets.codepen.io/16327/PPMori-SemiBold.woff) format("woff");
}
@font-face {
  font-display: block;
  font-family: Fraktion Mono;
  font-weight: 400;
  src: url(https://assets.codepen.io/16327/PPFraktionMono-Bold.woff) format("woff");
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  transition: none !important;
  animation: none !important;
}

:root {
  --green: #0ae448;
  --lt: #abff84;
  --black: #0e100f;
  --white: #fffce1;
  --s75: #bbbaa6;
  --s50: #7c7c6f;
  --s25: #42433d;
  --color-shockingly-green: #0ae448;
  --color-just-black: #0e100f;
  --color-surface-white: #fffce1;
  --color-lt-green: #abff84;
  --color-grey: #191919;
  --color-grey-dark: #191919;
  --color-surface75: #bbbaa6;
  --color-surface50: #7c7c6f;
  --color-surface25: #42433d;
  --gradient-macha: linear-gradient(114.41deg, var(--color-shockingly-green) 20.74%, var(--color-lt-green) 65.5%);
  --dark: var(--color-just-black);
  --light: var(--color-surface-white);
  --green: var(--color-shockingly-green);
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Mori, sans-serif;
  background: var(--black);
  color: var(--white);
}

/* ── Topbar ── */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}
.logo {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--white);
  z-index: 310;
}
.logo img {
  width: 60px;
}

h1 code {
  font-size: inherit;
}
.menu-toggle {
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 310;
  position: relative;
  padding: 0;
}

/* ── Header ── */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  padding: 80px 24px 24px;
}
.header h1 {
  color: var(--light);
  font-weight: 400;
  font-size: clamp(1.4rem, 3vw, 2rem);
}
.header p {
  color: var(--s50);
  font-size: 0.88rem;
  margin-top: 8px;
  max-width: 70ch;
  margin-left: auto;
  margin-right: auto;
}
code {
  font-family: Fraktion Mono, monospace;
  font-size: 0.72rem;
  background: rgba(10, 228, 72, 0.08);
  color: var(--green);
  padding: 2px 6px;
  border-radius: 3px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 0.72rem;
  color: var(--s50);
}
.controls label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
.controls input[type="checkbox"] {
  accent-color: var(--green);
}
.controls input[type="range"] {
  width: 64px;
  accent-color: var(--green);
}
.controls code {
  font-family: Fraktion Mono, monospace;
  font-size: 0.66rem;
  background: rgba(10, 228, 72, 0.08);
  color: var(--green);
  padding: 2px 6px;
  border-radius: 3px;
}
.speed-val {
  font-family: Fraktion Mono, monospace;
  font-size: 0.66rem;
  min-width: 2em;
}

/* ── Nav overlay ── */
.nav {
  position: fixed;
  inset: 0;
  z-index: 200;
  padding: 1rem;
  pointer-events: none;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.nav-bg {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
}

.nav-border {
  border: solid 2px;
  border-radius: 10px;
}

.nav-top {
  flex: 1;
  width: 100%;
  background: var(--white);
  color: var(--black);
  transform: translateX(-101%);
  display: flex;
  flex-direction: column;
  padding: 50px 28px 28px;
  overflow-y: auto;
  position: relative;
  z-index: 3;
  border-color: var(--black);
}

.nav-middle {
  position: relative;
  width: 100%;
  background: linear-gradient(
    135deg,
    #0ae448 0%,
    #abff84 40%,
    #6fdd8b 70%,
    #0ae448 100%
  );
  color: var(--black);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 28px;
  z-index: 2;
  border-color: #065a1e;
  min-height: 180px;
}

.nav-middle-header {
  font-family: Fraktion Mono, monospace;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
  margin-bottom: 12px;
}

.nav-panel {
  max-width: 700px;
}

.nav-middle-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-middle-badge {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-middle-badge svg {
  width: 24px;
  height: 24px;
}

.nav-middle-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-middle-title {
  font-weight: 600;
  font-size: clamp(1rem, 3vw, 1.25rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.nav-middle-desc {
  font-size: 0.78rem;
  opacity: 0.7;
  line-height: 1.4;
}

.nav-middle-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.nav-middle-actions a {
  font-family: Fraktion Mono, monospace;
  font-size: 0.7rem;
  text-decoration: none;
  color: var(--black);
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.nav-middle-actions a:first-child {
  background: var(--black);
  color: var(--lt);
  border-color: var(--black);
}

.nav-bottom {
  position: relative;
  height: 120px;
  width: 100%;
  background: var(--black);
  color: var(--s50);
  transform: translateX(101%);
  display: flex;
  align-items: center;
  padding: 24px 28px;
  z-index: 1;
  border-color: var(--s25);
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  justify-content: center;
}
.nav-item {
  overflow: hidden;
}
.nav-link {
  display: block;
  text-decoration: none;
  color: var(--black);
  padding: 10px 0;
  font-size: clamp(1.5rem, 4vw, 1.8rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.03em;
}
.nav-login {
  margin-top: auto;
  padding-top: 20px;
  font-size: 0.82rem;
  color: var(--s50);
  font-family: Fraktion Mono, monospace;
}

.nav-socials {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.nav-socials a {
  font-family: Fraktion Mono, monospace;
  font-size: 0.8rem;
  color: var(--s50);
  text-decoration: none;
}
.nav-asset {
  margin-left: auto;
}
.nav-asset img {
  position: absolute;
  bottom: 0;
  right: 2rem;
  width: 100px;
  height: auto;
}
```

---

## JavaScript

```javascript
let isOpen = false;
let exitSpeed = 1.5;
const erToggle = document.querySelector("#erToggle");
const exitSlider = document.querySelector("#exitSlider");
const exitValEl = document.querySelector("#exitVal");
let tl;
let enterEndTime = 0;

exitSlider.addEventListener("input", () => {
  exitSpeed = parseFloat(exitSlider.value);
  exitValEl.textContent = exitSpeed + "x";
});

function er(val) {
  return erToggle.checked ? val || true : false;
}

function init() {
  tl && tl.revert();

  gsap.set("#nav", { visibility: "hidden" });
  gsap.set(".nav-bg", { opacity: 0 });
  gsap.set(".nav-login", { opacity: 0, y: 8 });

  tl = gsap
    .timeline({ paused: true })

    .set("#nav", { visibility: "visible", pointerEvents: "auto" })

    // ═══ ENTER ═══

    .to(
      ".nav-bg",
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        easeReverse: er("power4.out"),
      },
      0
    )

    .fromTo(
      ".nav-panel",
      { x: "110%", y: 0, rotation: 0 },
      {
        x: "0%",
        y: 0,
        duration: 0.6,
        ease: "back.out",
        easeReverse: er("power3.in"),
        stagger: 0.1,
      },
      0
    )

    .fromTo(
      ".nav-item",
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "expo.out",
        easeReverse: er("power3.in"),
        stagger: 0.03,
      },
      0.1
    )

    .fromTo(
      ".bar-top",
      {
        stroke: "var(--white)",
        attr: { x1: 3, y1: 7, x2: 17, y2: 7 },
      },
      {
        stroke: "#0e100f",
        attr: { x1: 5, y1: 5, x2: 15, y2: 15 },
        duration: 0.35,
        ease: "back.out(1.4)",
        easeReverse: er("power3.out"),
      },
      0.06
    )
    .fromTo(
      ".bar-bot",
      {
        stroke: "var(--white)",
        attr: { x1: 3, y1: 13, x2: 17, y2: 13 },
      },
      {
        stroke: "#0e100f",
        attr: { x1: 15, y1: 5, x2: 5, y2: 15 },
        duration: 0.35,
        ease: "back.out(1.4)",
        easeReverse: er("power3.out"),
      },
      0.06
    )
    .to(
      ".nav-login",
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power3.out",
        easeReverse: er("power4.out"),
      },
      0.4
    )

    // ═══ PAUSE ═══
    .addPause();

  enterEndTime = tl.duration();

  // ═══ EXIT — panels fall down with stagger, bottom first ═══

  tl
    // X → hamburger
    .to(".bar", {
      stroke: "var(--white)",
      duration: 0.2,
    })
    .to(
      ".bar-top",
      {
        attr: { x1: 3, y1: 7, x2: 17, y2: 7 },
        duration: 0.2,
        ease: "power3.in",
      },
      "<"
    )
    .to(
      ".bar-bot",
      {
        attr: { x1: 3, y1: 13, x2: 17, y2: 13 },
        duration: 0.2,
        ease: "power3.in",
      },
      "<"
    )

    // panels fall
    .to(
      ".nav-panel",
      {
        y: "110vh",
        rotation: "random(-25, 25)",
        duration: 1,
        ease: "power3.in",
        stagger: {
          from: "end",
          each: 0.02,
        },
      },
      "<"
    )

    // bg fades
    .to(
      ".nav-bg",
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "<0.1"
    )

    .set("#nav", { visibility: "hidden", pointerEvents: "none" });
}
init();

erToggle.addEventListener("change", () => {
  if (isOpen) {
    isOpen = false;
    document.getElementById("menuToggle").setAttribute("aria-expanded", false);
  }
  init();
});

function toggle() {
  isOpen = !isOpen;
  const btn = document.getElementById("menuToggle");
  btn.setAttribute("aria-expanded", isOpen);
  btn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

  if (isOpen) {
    // ABRIR: si ya paso el EXIT completo, reinicia; si no, play forward
    if (tl.time() >= enterEndTime) {
      tl.timeScale(1).restart();
    } else {
      tl.timeScale(1).play();
    }
  } else {
    // CERRAR: si aun esta en ENTER, reversa (interruptible); si ya paso PAUSE, play EXIT
    if (tl.time() < enterEndTime) {
      tl.timeScale(exitSpeed).reverse();
    } else {
      tl.timeScale(1).play();
    }
  }
}

document.getElementById("menuToggle").addEventListener("click", toggle);
document.querySelector(".nav-bg").addEventListener("click", () => {
  if (isOpen) toggle();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isOpen) {
    toggle();
    document.getElementById("menuToggle").focus();
  }
});
```

---

## Tecnicas clave de GSAP usadas

### 1. `addPause()` — separar ENTER y EXIT

```javascript
tl = gsap.timeline({ paused: true })
  // ... animaciones de ENTER ...
  .addPause()      // <— el timeline se pausa aqui automaticamente
  // ... animaciones de EXIT ...
```

El timeline tiene **dos fases** separadas por un pause. Cuando llega al `addPause()`, se detiene. La logica de `toggle()` decide si reversar (si aun esta en ENTER) o continuar (play forward hacia EXIT).

### 2. `easeReverse` (GSAP 3.15+) — easing diferente al reversar

```javascript
.fromTo(".nav-panel",
  { x: "110%", y: 0, rotation: 0 },
  {
    x: "0%",
    duration: 0.6,
    ease: "back.out",             // <— ease al ABRIR (bouncy, elastico)
    easeReverse: "power3.in",     // <— ease al CERRAR rapido (directo, sin bounce)
  },
  0
)
```

Sin `easeReverse`, reversar un `back.out` se sentiria lento y raro. Con `easeReverse: "power3.in"`, el cierre rapido es snappy y responsivo.

### 3. `timeScale()` — velocidad variable del EXIT

```javascript
if (tl.time() < enterEndTime) {
  tl.timeScale(exitSpeed).reverse();  // reversa rapida (1.5x por defecto)
} else {
  tl.timeScale(1).play();             // EXIT normal
}
```

### 4. Hamburger animado con SVG `attr`

```javascript
// Hamburger → X
.fromTo(".bar-top",
  { attr: { x1: 3, y1: 7, x2: 17, y2: 7 } },     // linea horizontal
  { attr: { x1: 5, y1: 5, x2: 15, y2: 15 } },     // diagonal \
  ...
)
.fromTo(".bar-bot",
  { attr: { x1: 3, y1: 13, x2: 17, y2: 13 } },    // linea horizontal
  { attr: { x1: 15, y1: 5, x2: 5, y2: 15 } },     // diagonal /
  ...
)
```

La linea del medio (`.bar-mid`) no se anima — simplemente desaparece por las diagonales.

### 5. Exit con caida y rotacion aleatoria

```javascript
.to(".nav-panel", {
  y: "110vh",
  rotation: "random(-25, 25)",     // cada panel gira random
  duration: 1,
  ease: "power3.in",
  stagger: { from: "end", each: 0.02 }  // el de abajo cae primero
}, "<")
```

---

## Logica de toggle() — diagrama de decision

```
toggle() llamado
  |
  ├── isOpen = true (ABRIR)
  |   ├── tl.time() >= enterEndTime?  →  tl.restart()     (ya hizo EXIT, empezar de nuevo)
  |   └── no                          →  tl.play()        (continuar ENTER)
  |
  └── isOpen = false (CERRAR)
      ├── tl.time() < enterEndTime?   →  tl.reverse()     (aun en ENTER, reversar)
      └── no                          →  tl.play()        (en PAUSE, ejecutar EXIT)
```

---

## Accesibilidad

- `aria-expanded` se actualiza en cada toggle
- `aria-label` cambia entre "Open menu" / "Close menu"
- `Escape` cierra el menu y devuelve focus al boton
- Click en el backdrop (`.nav-bg`) cierra el menu

---

## Para adaptar a Pablo Pinxit

El menu del demo usa **el mismo layout en mobile y desktop** — es un overlay fullscreen siempre. No hay breakpoints que muestren/oculten cosas. El boton hamburger esta siempre visible.

Para implementar en Pablo Pinxit:
1. Reemplazar framer-motion por GSAP
2. Usar el mismo patron de `addPause()` para ENTER/EXIT
3. Adaptar la estetica (blanco/minimal en vez de dark)
4. Mantener un solo menu para PC y mobile (sin nav de desktop separado)
5. Adaptar los links: Home, categorias dinamicas, Videos, Arts Books, About, Contact
