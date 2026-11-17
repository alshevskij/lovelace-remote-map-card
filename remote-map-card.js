const RMC_VERSION = "2026.11.1";

const fire = (node, type, detail) =>
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
const SHAPES = {
  circle: "Круг",
  oval: "Овал",
  square: "Квадрат",
  rect: "Прямоугольник",
  rounded: "Скруглённый прямоугольник",
  pill: "Таблетка",
};
const SQUARE = ["circle", "square"];
const ICONS = {
  up: { l: "Стрелка вверх", d: "M12 19V5M5 12l7-7 7 7" },
  down: { l: "Стрелка вниз", d: "M12 5v14M19 12l-7 7-7-7" },
  left: { l: "Стрелка влево", d: "M19 12H5M12 5l-7 7 7 7" },
  right: { l: "Стрелка вправо", d: "M5 12h14M12 5l7 7-7 7" },
  plus: { l: "Плюс", d: "M12 5v14M5 12h14" },
  minus: { l: "Минус", d: "M5 12h14" },
  power: { l: "Питание", d: "M12 3v9M6.3 6.3a8 8 0 1 0 11.4 0" },
  play: { l: "Play", d: "M8 5v14l11-7z", f: true },
  pause: { l: "Пауза", d: "M8 5v14M16 5v14" },
  stop: { l: "Стоп", d: "M6 6h12v12H6z", f: true },
  ffwd: { l: "Вперёд", d: "M4 5v14l8-7zM12 5v14l8-7z", f: true },
  rew: { l: "Назад", d: "M20 5v14l-8-7zM12 5v14l-8-7z", f: true },
  heart: { l: "Сердце", d: "M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z", f: true },
  home: { l: "Домой", d: "M4 11l8-7 8 7M6 10v10h12V10" },
  back: { l: "Назад (возврат)", d: "M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" },
  menu: { l: "Меню", d: "M4 6h16M4 12h16M4 18h16" },
  mute: { l: "Без звука", d: "M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6" },
};

const DEF_DESIGN = { width: 436, height: 781, background: "#232323", radius: 0 };
const GLASS_BG = "#0a0c12";
const GLASS_RADIUS = 28;
const DEF_BTN = {
  x: 50, y: 50, size: 8,
  shape: "circle", w: 100, h: 100, color: "#777777",
  content: "text", text: "", text_color: "#ffffff", font_size: 0,
  icon: "up", icon_scale: 60, hit_scale: 100,
};

const LABELS = {
  mode: "Фон пульта",
  show_hotspots: "Показывать зоны нажатия на карточке (для отладки)",
  width: "Ширина фона, px",
  height: "Высота фона, px",
  radius: "Скругление углов фона, px",
  glass: "Стеклянный эффект и размытие",
  glow: "Свечение при нажатии",
  glass_opacity: "Прозрачность стекла (меньше — прозрачнее), %",
  name: "Название (подсказка при наведении)",
  shape: "Форма",
  w: "Ширина, px",
  h: "Высота, px",
  no_fill: "Без заливки (только текст или значок)",
  content: "Что внутри",
  text: "Текст (Enter — новая строка)",
  font_size: "Размер текста, px (0 — подобрать автоматически)",
  icon: "Иконка",
  icon_scale: "Размер иконки, % от кнопки",
  hit_scale: "Зона нажатия, % от размера кнопки",
  size: "Зона нажатия, % от ширины картинки",
  tap_action: "Действие при нажатии",
  entity: "Сущность (только для toggle / more-info)",
  grid_show: "Показывать сетку",
  grid_snap: "Привязка к сетке",
  grid_guides: "Направляющие: центр холста, края и центры других кнопок",
  grid_size: "Шаг сетки, px",
};
const labelOf = (name, shape) =>
  name === "w" && shape === "circle" ? "Диаметр, px"
  : name === "w" && shape === "square" ? "Сторона, px"
  : LABELS[name] || name;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const round1 = (v) => Math.round(v * 10) / 10;
const round2 = (v) => Math.round(v * 100) / 100;
const hexA = (hex, a) => {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || "");
  return m ? `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})` : hex;
};
const gridOf = (cfg) => {
  const g = { show: false, snap: false, guides: true, size: 10, ...(cfg.grid || {}) };
  g.size = Math.max(2, +g.size || 10);
  return g;
};

const modeOf = (cfg) => cfg.mode || (cfg.image ? "image" : "designed");
const designOf = (cfg) => {
  const d = { ...DEF_DESIGN, ...(cfg.design || {}) };
  d.width = +d.width || DEF_DESIGN.width;
  d.height = +d.height || DEF_DESIGN.height;
  d.radius = +d.radius || 0;
  return d;
};
const glassOf = (cfg) => ({
  on: modeOf(cfg) === "designed" && cfg.glass === true,
  glow: cfg.glow !== false,
  color: /^#[0-9a-f]{6}$/i.test(cfg.glow_color || "") ? cfg.glow_color : "#60a5fa",
  opacity: clamp(+cfg.glass_opacity || 62, 10, 100),
});
const norm = (b) => {
  const n = { ...DEF_BTN, ...b };
  if (SQUARE.includes(n.shape)) n.h = n.w;
  return n;
};
const radiusOf = (shape, w, h) => {
  const m = Math.min(w, h);
  if (shape === "pill" || shape === "circle" || shape === "oval") return m / 2;
  return shape === "rounded" ? m * 0.25 : m * 0.08;
};
const isRound = (shape) => shape === "circle" || shape === "oval";
function autoFont(n, lines) {
  const { w, h } = n;
  const lh = 1.15;
  const longest = Math.max(1, ...lines.map((l) => l.length));
  return +n.font_size || Math.min(h * 0.28, (w * 0.7) / (longest * 0.6), (h * 0.62) / (lines.length * lh));
}

function btnSvg(b, W, H) {
  const n = norm(b);
  const { w, h } = n;
  const cx = (n.x / 100) * W, cy = (n.y / 100) * H;
  const fill = esc(n.color);
  let out = "";
  if (isRound(n.shape)) {
    out += `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="${fill}"/>`;
  } else {
    out += `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${radiusOf(n.shape, w, h)}" fill="${fill}"/>`;
  }
  const tc = esc(n.text_color);
  if (n.content === "icon" && ICONS[n.icon]) {
    const ic = ICONS[n.icon];
    const s = (Math.min(w, h) * n.icon_scale) / 100;
    out += `<g transform="translate(${cx - s / 2} ${cy - s / 2}) scale(${s / 24})" fill="${ic.f ? tc : "none"}" stroke="${ic.f ? "none" : tc}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="${ic.d}"/></g>`;
  } else if (n.content === "text" && n.text) {
    const lines = String(n.text).split("\n");
    const lh = 1.15;
    const fs = autoFont(n, lines);
    lines.forEach((l, i) => {
      const y = cy + (i - (lines.length - 1) / 2) * fs * lh;
      out += `<text x="${cx}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="700" fill="${tc}">${esc(l)}</text>`;
    });
  }
  return out;
}
function glassBtn(b, W) {
  const n = norm(b);
  const { w, h } = n;
  const cw = (v) => `${round2((v / W) * 100)}cqw`;
  const el = document.createElement("div");
  el.className = "gb" + (n.color === "transparent" ? " nofill" : "");
  el.style.left = n.x + "%";
  el.style.top = n.y + "%";
  el.style.width = cw(w);
  el.style.height = cw(h);
  el.style.borderRadius = isRound(n.shape) ? "50%" : cw(radiusOf(n.shape, w, h));
  el.style.setProperty("--c", n.color);
  el.style.setProperty("--tc", n.text_color);
  el.style.setProperty("--mx", n.content === "none" ? "72%" : "34%");
  if (n.content === "icon" && ICONS[n.icon]) {
    const ic = ICONS[n.icon];
    const s = (Math.min(w, h) * n.icon_scale) / 100;
    el.innerHTML = `<svg viewBox="0 0 24 24" style="width:${cw(s)};height:${cw(s)}" fill="${ic.f ? "currentColor" : "none"}" stroke="${ic.f ? "none" : "currentColor"}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="${ic.d}"/></svg>`;
  } else if (n.content === "text" && n.text) {
    const t = document.createElement("span");
    t.className = "gt";
    t.style.fontSize = cw(autoFont(n, String(n.text).split("\n")));
    t.textContent = String(n.text);
    el.appendChild(t);
  }
  return el;
}
function hitBox(n, cfg, asp) {
  let wp, hp;
  if (modeOf(cfg) === "designed") {
    const d = designOf(cfg);
    const s = n.hit_scale / 100;
    wp = ((n.w * s) / d.width) * 100;
    hp = ((n.h * s) / d.height) * 100;
  } else {
    wp = n.size;
    hp = n.size * (asp || 1);
  }
  return { l: n.x - wp / 2, r: n.x + wp / 2, t: n.y - hp / 2, b: n.y + hp / 2, wp, hp };
}

function buildStage(cfg, opts = {}) {
  const mode = modeOf(cfg);
  const gl = glassOf(cfg);
  const stage = document.createElement("div");
  stage.className = "stage";
  const gbs = [];
  let W = 100, H = 100;

  if (mode === "designed") {
    const d = designOf(cfg);
    W = d.width; H = d.height;
    if (gl.on) {
      stage.classList.add("glass");
      if (!gl.glow) stage.classList.add("noglow");
      stage.style.aspectRatio = `${W} / ${H}`;
      stage.style.borderRadius = d.radius + "px";
      stage.style.setProperty("--rmc-bg", hexA(d.background, gl.opacity / 100));
      stage.style.setProperty("--rmc-glow", gl.color);
      cfg.buttons.forEach((b) => {
        const el = glassBtn(b, W);
        gbs.push(el);
        stage.appendChild(el);
      });
    } else {
      let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="aspect-ratio:${W}/${H};font-family:var(--paper-font-body1_-_font-family,Roboto,Arial,sans-serif)">`;
      svg += `<rect width="${W}" height="${H}" rx="${d.radius}" fill="${esc(d.background)}"/>`;
      cfg.buttons.forEach((b) => (svg += btnSvg(b, W, H)));
      svg += "</svg>";
      stage.innerHTML = svg;
    }
  } else {
    const img = document.createElement("img");
    img.src = cfg.image;
    img.draggable = false;
    if (opts.onImgLoad) img.addEventListener("load", () => opts.onImgLoad(img));
    stage.appendChild(img);
  }

  const hits = cfg.buttons.map((b, i) => {
    const n = norm(b);
    const hit = document.createElement("div");
    hit.className = "hit";
    hit.dataset.i = i;
    hit.style.left = n.x + "%";
    hit.style.top = n.y + "%";
    if (mode === "designed") {
      const s = n.hit_scale / 100;
      const hw = n.w * s, hh = n.h * s;
      hit.style.width = (hw / W) * 100 + "%";
      hit.style.height = (hh / H) * 100 + "%";
      hit.style.borderRadius = isRound(n.shape) ? "50%" : `${(radiusOf(n.shape, hw, hh) / W) * 100}cqw`;
    } else {
      hit.style.width = n.size + "%";
      hit.style.aspectRatio = "1";
      hit.style.borderRadius = "50%";
    }
    stage.appendChild(hit);
    return hit;
  });
  return { stage, hits, gbs, W, H };
}

const STAGE_CSS = `
  .stage { position: relative; line-height: 0; container-type: inline-size; user-select: none; -webkit-user-select: none; }
  .stage svg, .stage img { display: block; width: 100%; height: auto; -webkit-user-drag: none; }
  .hit { position: absolute; transform: translate(-50%, -50%); box-sizing: border-box; }
  .stage.glass { box-sizing: border-box;
    border: 1px solid var(--rmc-border, rgba(120,150,200,.42));
    background: radial-gradient(circle at 18% 0%, rgba(96,165,250,.10), transparent 58%), var(--rmc-bg, rgba(10,12,18,.62));
    box-shadow: 0 8px 32px rgba(0,0,0,.32), 0 0 24px -14px color-mix(in srgb, var(--rmc-glow, #60a5fa) 55%, transparent);
    backdrop-filter: blur(16px) saturate(150%); -webkit-backdrop-filter: blur(16px) saturate(150%);
    transition: box-shadow .5s, border-color .5s; }
  .stage.glass.noglow { box-shadow: 0 8px 32px rgba(0,0,0,.32); }
  .stage.glass.active { border-color: var(--rmc-glow, #60a5fa);
    box-shadow: 0 0 30px -12px var(--rmc-glow, #60a5fa), 0 8px 32px rgba(0,0,0,.35); }
  .gb { position: absolute; transform: translate(-50%, -50%); box-sizing: border-box; display: grid; place-items: center;
    pointer-events: none; color: var(--tc, #fff); line-height: 1;
    font-family: var(--paper-font-body1_-_font-family, Roboto, Arial, sans-serif);
    background: linear-gradient(145deg,
      color-mix(in srgb, var(--c, #777) var(--mx, 34%), rgba(255,255,255,.10)),
      color-mix(in srgb, var(--c, #777) calc(var(--mx, 34%) * .55), rgba(255,255,255,.03)));
    border: 1px solid color-mix(in srgb, var(--c, #777) 55%, rgba(255,255,255,.13));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.16), 0 4px 14px rgba(0,0,0,.25);
    backdrop-filter: blur(6px) saturate(140%); -webkit-backdrop-filter: blur(6px) saturate(140%);
    transition: transform .12s ease, background .22s, border-color .22s, box-shadow .22s; }
  .gb .gt { white-space: pre; line-height: 1.15; font-weight: 700; text-align: center; text-shadow: 0 1px 6px rgba(0,0,0,.35); }
  .gb svg { display: block; filter: drop-shadow(0 1px 4px rgba(0,0,0,.3)); }
  .gb.nofill { background: none; border-color: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
  .gb.nofill svg { filter: drop-shadow(0 0 6px currentColor); }
  .gb.pressed { transform: translate(-50%, -50%) scale(.95);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.22),
      0 0 0 3px color-mix(in srgb, var(--rmc-glow, #60a5fa) 25%, transparent),
      0 0 22px color-mix(in srgb, var(--rmc-glow, #60a5fa) 55%, transparent); }
  .gb.nofill.pressed { box-shadow: none; }
  .stage.glass.noglow .gb.pressed { box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 4px 14px rgba(0,0,0,.25); }
`;
function makeTemplate() {
  const W = 436, H = 781;
  const c = (name, x, y, o) => ({
    name, x: round1((x / W) * 100), y: round1((y / H) * 100),
    shape: "circle", w: 107, h: 107, color: "#777777",
    content: "text", text_color: "#ffffff", hit_scale: 100,
    tap_action: { action: "none" }, ...o,
  });
  const X = [87, 218, 349];
  const arrow = (name, x, y, icon) => c(name, x, y, { color: "#d0d0d0", content: "icon", icon, icon_scale: 80 });
  const btns = [
    c("ON/OFF", X[0], 75, { color: "#f06a6a", text: "ON/OFF" }),
    c("MUTE", X[1], 75, { text: "MUTE" }),
    c("SOURCE", X[2], 75, { text: "SOURCE" }),
    c("INFO", X[0], 189, { text: "INFO" }),
    c("MENU", X[1], 189, { text: "MENU" }),
    c("EXIT", X[2], 189, { text: "EXIT" }),
    arrow("Вверх", X[1], 303, "up"),
    arrow("Влево", X[0], 417, "left"),
    c("OK", X[1], 417, { color: "#c8c8c8", text: "OK" }),
    arrow("Вправо", X[2], 417, "right"),
    c("VOL+", X[0], 531, { text: "VOL\n+" }),
    arrow("Вниз", X[1], 531, "down"),
    c("CH+", X[2], 531, { text: "CH\n+" }),
    c("VOL-", X[0], 645, { text: "VOL\n−" }),
    c("Сердце", X[1], 645, { color: "transparent", content: "icon", icon: "heart", icon_scale: 130, text_color: "#9b6bf0" }),
    c("CH-", X[2], 645, { text: "CH\n−" }),
  ];
  [["Красная", "#dd8484", 87.5], ["Зелёная", "#85dd85", 174.5], ["Жёлтая", "#dddd85", 260.5], ["Синяя", "#6a93ee", 348.5]]
    .forEach(([name, col, x]) => btns.push(c(name, x, 739, { shape: "rect", w: 77, h: 30, color: col, content: "none" })));
  return btns;
}

class RemoteMapCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("remote-map-card-editor");
  }

  static getStubConfig() {
    return {
      mode: "designed", glass: true, glow: true,
      design: { ...DEF_DESIGN, background: GLASS_BG, radius: GLASS_RADIUS },
      show_hotspots: false, buttons: [],
    };
  }

  setConfig(config) {
    if (!config) throw new Error("Пустой конфиг");
    this._config = {
      show_hotspots: false,
      ...config,
      buttons: (config.buttons || []).map((b) => ({ ...b })),
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    const c = this._config;
    if (c && modeOf(c) === "designed") {
      const d = designOf(c);
      return Math.max(3, Math.round((d.height / d.width) * 8));
    }
    return 6;
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const c = this._config;
    const root = this.shadowRoot;
    root.innerHTML = `
      <style>
        ${STAGE_CSS}
        ha-card { overflow: hidden; }
        ha-card.gl { overflow: visible; background: none; border: none; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
        .empty { padding: 24px; line-height: 1.4; color: var(--secondary-text-color); }
        .hit { cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background .12s, box-shadow .12s; }
        .hit:active { background: rgba(255,255,255,.3); box-shadow: 0 0 0 3px rgba(255,255,255,.35); }
        .stage.glass .hit:active { background: none; box-shadow: none; }
        .hit:focus-visible { outline: 2px solid var(--primary-color); }
        .hit.dbg { outline: 2px dashed rgba(255,60,60,.85); background: rgba(255,60,60,.12); }
      </style>
      <ha-card></ha-card>`;
    const card = root.querySelector("ha-card");

    if (modeOf(c) === "image" && !c.image) {
      card.innerHTML = `<div class="empty">Открой редактор карточки: загрузи картинку пульта или переключись на «Нарисовать пульт».</div>`;
      return;
    }
    const { stage, hits, gbs } = buildStage(c);
    const isGlass = stage.classList.contains("glass");
    card.classList.toggle("gl", isGlass);

    hits.forEach((el, i) => {
      const b = c.buttons[i];
      if (c.show_hotspots) el.classList.add("dbg");
      el.title = b.name || "";
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", b.name || "button");

      let release = () => {};
      if (isGlass && gbs[i]) {
        const press = () => {
          gbs[i].classList.add("pressed");
          if (!stage.classList.contains("noglow")) stage.classList.add("active");
        };
        release = () => setTimeout(() => {
          gbs[i].classList.remove("pressed");
          stage.classList.remove("active");
        }, 140);
        el.addEventListener("pointerdown", press);
        ["pointerup", "pointerleave", "pointercancel"].forEach((t) => el.addEventListener(t, release));
        el._press = press;
      }

      el.addEventListener("click", () => this._run(b));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (el._press) { el._press(); release(); }
          this._run(b);
        }
      });
    });
    card.appendChild(stage);
  }

  _run(btn) {
    const a = btn.tap_action;
    if (!a || a.action === "none" || !this._hass) return;
    fire(this, "haptic", "light");
    const h = this._hass;

    switch (a.action) {
      case "perform-action":
      case "call-service": {
        const svc = a.perform_action || a.service;
        if (!svc || !svc.includes(".")) return;
        const [domain, service] = svc.split(".");
        h.callService(domain, service, a.data || a.service_data || {}, a.target);
        break;
      }
      case "toggle":
        if (btn.entity) h.callService("homeassistant", "toggle", { entity_id: btn.entity });
        break;
      case "more-info":
        if (btn.entity) fire(this, "hass-more-info", { entityId: btn.entity });
        break;
      case "navigate":
        if (a.navigation_path) {
          history.pushState(null, "", a.navigation_path);
          fire(window, "location-changed", {});
        }
        break;
      case "url":
        if (a.url_path) window.open(a.url_path, "_blank");
        break;
    }
  }
}

const EDITOR_CSS = `
  :host { display: block; }
  .hint { color: var(--secondary-text-color); font-size: 12px; margin: 8px 0; line-height: 1.4; }
  .host { border: 1px dashed var(--divider-color); border-radius: 10px; padding: 14px; margin: 8px 0;
    touch-action: none; background: var(--secondary-background-color); }
  .host .stage { max-width: 420px; margin: 0 auto; cursor: default; }
  .host .stage svg, .host .stage img { pointer-events: none; }
  .noimg { padding: 16px; line-height: 1.4; color: var(--secondary-text-color); }
  .stage svg.gov { position: absolute; left: 0; top: 0; height: 100%; pointer-events: none; }
  .host:focus { outline: none; }
  .hit.ed { cursor: move; outline: 1px dashed rgba(255,70,70,.5); }
  .hit.ed.ovl { outline: 2px dashed #ff9800; background: rgba(255,152,0,.2); }
  .hit.ed.sel { outline: 2px dashed #ff3c3c; background: rgba(255,60,60,.18); z-index: 2; }
  .badge { position: absolute; left: 0; top: 0; transform: translate(-30%,-30%); min-width: 16px; height: 16px;
    padding: 0 3px; box-sizing: border-box; border-radius: 8px; background: #03a9f4; color: #fff;
    font: 600 10px/16px sans-serif; text-align: center; pointer-events: none; }
  .selvis { position: absolute; transform: translate(-50%,-50%); box-sizing: border-box;
    outline: 2px solid #03a9f4; outline-offset: 2px; pointer-events: none; z-index: 1; }
  .handle { position: absolute; transform: translate(-50%,-50%); width: 18px; height: 18px; border-radius: 50%;
    background: #03a9f4; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.6); cursor: nwse-resize; z-index: 3; }
  .info { font-size: 13px; line-height: 1.5; margin: 6px 0 4px; min-height: 20px; color: var(--primary-text-color); }
  .info .warn { color: #ff9800; }
  .title { font-weight: 500; margin: 14px 0 4px; }
  .sec { color: var(--secondary-text-color); font-size: 12px; margin: 14px 0 2px; }
  .tb { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 4px; }
  .tb button, button.del { padding: 8px 14px; border-radius: 8px; cursor: pointer; font: inherit;
    border: 1px solid var(--primary-color); color: var(--primary-color); background: transparent; }
  .tb button.danger, button.del { border-color: var(--error-color, #db4437); color: var(--error-color, #db4437); }
  .tb button:disabled { opacity: .4; cursor: default; }
  .crow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 2px; }
  .crow input { width: 56px; height: 32px; padding: 0; border: 1px solid var(--divider-color); border-radius: 6px; background: none; cursor: pointer; }
  .drop { border: 2px dashed var(--primary-color); border-radius: 12px; padding: 18px 12px; text-align: center; cursor: pointer;
    margin: 4px 0 8px; color: var(--primary-text-color); transition: background .15s; outline: none; line-height: 1.4; }
  .drop:hover, .drop:focus, .drop.over { background: rgba(3,169,244,.12); }
  .drop small { display: block; color: var(--secondary-text-color); margin-top: 4px; }
`;

class RemoteMapCardEditor extends HTMLElement {
  setConfig(config) {
    const next = {
      ...config,
      buttons: (config.buttons || []).map((b) => ({ ...b })),
    };
    if (this._config && JSON.stringify(next) === JSON.stringify(this._config)) return;
    this._config = next;
    if (this._sel === undefined || this._sel >= next.buttons.length) this._sel = next.buttons.length ? 0 : -1;
    this._asp = this._asp || 1;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this.shadowRoot?.querySelectorAll("ha-form").forEach((f) => (f.hass = hass));
  }

  _emit() {
    const c = this._config;
    fire(this, "config-changed", {
      config: { ...c, ...(c.design ? { design: { ...c.design } } : {}), buttons: c.buttons.map((b) => ({ ...b })) },
    });
  }

  _stageEl() {
    return this.shadowRoot.querySelector(".stage");
  }

  _pos(e) {
    const r = this._stageEl().getBoundingClientRect();
    return {
      x: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100),
      y: clamp(((e.clientY - r.top) / r.height) * 100, 0, 100),
    };
  }
  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const root = this.shadowRoot;
    const designed = modeOf(this._config) === "designed";
    root.innerHTML = `
      <style>${STAGE_CSS}${EDITOR_CSS}</style>
      <ha-form id="top"></ha-form>
      <div id="panel"></div>
      <div class="tb" id="tb"></div>
      <div class="hint">Тяни кнопку, чтобы подвинуть её вместе с зоной. Синий кружок в углу меняет размер
        ${designed ? "кнопки (зона растёт пропорционально)" : "зоны нажатия"}. Двойной клик по пустому месту добавляет кнопку.
        Красный пунктир — зона нажатия, оранжевый — пересечение с другой зоной.
        ${designed ? "Стрелки на клавиатуре двигают кнопку на 1 px (с Shift — на шаг сетки), Alt при перетаскивании отключает привязку." : ""}</div>
      <div class="host" id="host"></div>
      <div class="info" id="info"></div>
      <div id="sel"></div>`;

    const top = root.getElementById("top");
    top.hass = this._hass;
    top.data = { mode: modeOf(this._config), show_hotspots: !!this._config.show_hotspots };
    top.schema = [
      {
        name: "mode",
        selector: { select: { mode: "dropdown", options: [
          { value: "designed", label: "Нарисовать пульт здесь" },
          { value: "image", label: "Своя картинка" },
        ] } },
      },
      { name: "show_hotspots", selector: { boolean: {} } },
    ];
    top.computeLabel = (s) => labelOf(s.name);
    top.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const v = e.detail.value;
      const modeChanged = v.mode !== modeOf(this._config);
      this._config.mode = v.mode;
      this._config.show_hotspots = !!v.show_hotspots;
      this._emit();
      if (modeChanged) this._render();
      else top.data = { mode: modeOf(this._config), show_hotspots: !!this._config.show_hotspots };
    });

    this._drawPanel();
    this._drawToolbar();
    this._setupHost();
    this._drawStage();
    this._drawInfo();
    this._drawSelected();
  }
  _drawPanel() {
    const p = this.shadowRoot.getElementById("panel");
    p.innerHTML = "";
    if (modeOf(this._config) === "image") {
      p.innerHTML = `<div class="drop" id="drop" tabindex="0"></div><input type="file" id="file" accept="image/*" hidden>`;
      this._setupDrop();
      return;
    }
    const d = designOf(this._config);
    const f = document.createElement("ha-form");
    f.hass = this._hass;
    f.data = { width: d.width, height: d.height, radius: d.radius };
    const num = (name, min, max) => ({ name, selector: { number: { min, max, step: 1, mode: "box" } } });
    f.schema = [num("width", 100, 4000), num("height", 100, 4000), num("radius", 0, 400)];
    f.computeLabel = (s) => labelOf(s.name);
    f.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const v = e.detail.value;
      this._config.design = {
        ...designOf(this._config),
        width: +v.width || DEF_DESIGN.width,
        height: +v.height || DEF_DESIGN.height,
        radius: +v.radius || 0,
      };
      const dd = this._config.design;
      f.data = { width: dd.width, height: dd.height, radius: dd.radius };
      this._emit();
      this._drawStage();
      this._drawInfo();
    });
    p.appendChild(f);
    p.appendChild(this._color("Цвет фона", d.background, (v) => {
      this._config.design = { ...designOf(this._config), background: v };
      this._emit();
      this._drawStage();
    }));
    const gl = glassOf(this._config);
    const glassForm = document.createElement("ha-form");
    const glData = () => {
      const x = glassOf(this._config);
      return { glass: this._config.glass === true, glow: x.glow, glass_opacity: x.opacity };
    };
    glassForm.hass = this._hass;
    glassForm.data = glData();
    glassForm.schema = [
      { name: "glass", selector: { boolean: {} } },
      { name: "glow", selector: { boolean: {} } },
      { name: "glass_opacity", selector: { number: { min: 10, max: 100, step: 1, mode: "slider" } } },
    ];
    glassForm.computeLabel = (sc) => labelOf(sc.name);
    glassForm.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const v = e.detail.value;
      const cfg = this._config;
      const wasOn = cfg.glass === true;
      cfg.glass = !!v.glass;
      cfg.glow = !!v.glow;
      cfg.glass_opacity = clamp(+v.glass_opacity || 62, 10, 100);
      if (cfg.glass && !wasOn) {
        const dd = designOf(cfg);
        const nd = { ...dd };
        if (!dd.radius) nd.radius = GLASS_RADIUS;
        if (String(dd.background).toLowerCase() === DEF_DESIGN.background) nd.background = GLASS_BG;
        cfg.design = nd;
      }
      this._emit();
      if (cfg.glass !== wasOn) this._drawPanel();
      else glassForm.data = glData();
      this._drawStage();
      this._drawInfo();
    });
    p.appendChild(glassForm);
    if (gl.on) {
      p.appendChild(this._color("Цвет свечения", gl.color, (v) => {
        this._config.glow_color = v;
        this._emit();
        this._drawStage();
      }));
    }
    const g = gridOf(this._config);
    const gf = document.createElement("ha-form");
    const gdata = (x) => ({ grid_show: x.show, grid_snap: x.snap, grid_guides: x.guides, grid_size: x.size });
    gf.hass = this._hass;
    gf.data = gdata(g);
    gf.schema = [
      { name: "grid_show", selector: { boolean: {} } },
      { name: "grid_snap", selector: { boolean: {} } },
      { name: "grid_guides", selector: { boolean: {} } },
      { name: "grid_size", selector: { number: { min: 2, max: 200, step: 1, mode: "box" } } },
    ];
    gf.computeLabel = (sc) => labelOf(sc.name);
    gf.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const v = e.detail.value;
      const ng = { show: !!v.grid_show, snap: !!v.grid_snap, guides: !!v.grid_guides, size: Math.max(2, +v.grid_size || 10) };
      this._config.grid = ng;
      gf.data = gdata(ng);
      this._emit();
      this._drawStage();
    });
    p.appendChild(gf);
  }

  _color(label, value, cb) {
    const row = document.createElement("label");
    row.className = "crow";
    row.innerHTML = `<span>${label}</span>`;
    const inp = document.createElement("input");
    inp.type = "color";
    inp.value = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
    inp.addEventListener("input", () => cb(inp.value));
    row.appendChild(inp);
    return row;
  }
  _setupDrop() {
    const root = this.shadowRoot;
    const drop = root.getElementById("drop");
    const input = root.getElementById("file");
    const img = this._config.image || "";
    if (!img) {
      drop.innerHTML = `Перетащи сюда картинку пульта или нажми для выбора<small>можно вставить из буфера: клик сюда, затем Ctrl+V</small>`;
    } else if (img.startsWith("data:")) {
      drop.innerHTML = `Картинка загружена (${Math.round((img.length * 0.75) / 1024)} КБ)<small>перетащи другую, чтобы заменить</small>`;
    } else {
      drop.innerHTML = `Картинка по пути ${esc(img)}<small>перетащи файл сюда, чтобы встроить в карточку</small>`;
    }
    drop.addEventListener("click", () => input.click());
    drop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
    });
    input.addEventListener("change", () => { this._loadFile(input.files[0]); input.value = ""; });
    drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("over"));
    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      drop.classList.remove("over");
      this._loadFile(e.dataTransfer.files[0]);
    });
    drop.addEventListener("paste", (e) => {
      const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith("image/"));
      if (f) { e.preventDefault(); this._loadFile(f); }
    });
  }

  _loadFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1000;
        const k = Math.min(1, MAX / (img.width || MAX));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * k));
        c.height = Math.max(1, Math.round(img.height * k));
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        let uri = c.toDataURL("image/webp", 0.92);
        if (!uri.startsWith("data:image/webp")) uri = c.toDataURL("image/png");
        this._config.image = uri;
        this._emit();
        this._render();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  _drawToolbar() {
    const tb = this.shadowRoot.getElementById("tb");
    const designed = modeOf(this._config) === "designed";
    tb.innerHTML = `
      <button id="add">+ Кнопка</button>
      <button id="dup" ${this._sel < 0 ? "disabled" : ""}>Дублировать</button>
      ${designed ? `<button id="cx" ${this._sel < 0 ? "disabled" : ""}>По центру X</button><button id="cy" ${this._sel < 0 ? "disabled" : ""}>По центру Y</button><button id="tpl">Пример пульта</button>` : ""}
      <button id="del" class="danger" ${this._sel < 0 ? "disabled" : ""}>Удалить</button>`;
    tb.querySelector("#add").addEventListener("click", () => this._add({ x: 50, y: 50 }));
    tb.querySelector("#dup").addEventListener("click", () => this._dup());
    tb.querySelector("#del").addEventListener("click", () => this._del());
    tb.querySelector("#tpl")?.addEventListener("click", () => this._template());
    tb.querySelector("#cx")?.addEventListener("click", () => this._centerSel("x"));
    tb.querySelector("#cy")?.addEventListener("click", () => this._centerSel("y"));
  }

  _newBtn(pos) {
    const n = this._config.buttons.length + 1;
    const base = { name: `Кнопка ${n}`, x: round2(pos.x), y: round2(pos.y), tap_action: { action: "none" } };
    if (modeOf(this._config) === "designed") {
      return { ...base, shape: "circle", w: 100, h: 100, color: "#777777", content: "text", text: "", text_color: "#ffffff", hit_scale: 100 };
    }
    return { ...base, size: 8 };
  }

  _add(pos) {
    this._config.buttons.push(this._newBtn(pos));
    this._sel = this._config.buttons.length - 1;
    this._emit();
    this._refreshAll();
  }

  _dup() {
    const b = this._config.buttons[this._sel];
    if (!b) return;
    const copy = JSON.parse(JSON.stringify(b));
    copy.name = (b.name || "Кнопка") + " (копия)";
    copy.x = round1(clamp((b.x ?? 50) + 4, 0, 100));
    copy.y = round1(clamp((b.y ?? 50) + 4, 0, 100));
    this._config.buttons.push(copy);
    this._sel = this._config.buttons.length - 1;
    this._emit();
    this._refreshAll();
  }

  _del() {
    const i = this._sel;
    if (i < 0) return;
    this._config.buttons.splice(i, 1);
    this._sel = this._config.buttons.length ? Math.min(i, this._config.buttons.length - 1) : -1;
    this._emit();
    this._refreshAll();
  }

  _template() {
    if (this._config.buttons.length && !window.confirm("Заменить текущие кнопки примером пульта?")) return;
    this._config.mode = "designed";
    this._config.design = glassOf(this._config).on
      ? { ...DEF_DESIGN, background: GLASS_BG, radius: GLASS_RADIUS }
      : { ...DEF_DESIGN };
    this._config.buttons = makeTemplate();
    this._sel = 0;
    this._emit();
    this._render();
  }

  _centerSel(axis) {
    const b = this._config.buttons[this._sel];
    if (!b) return;
    b[axis] = 50;
    this._emit();
    this._drawStage();
    this._drawInfo();
    this._drawSelected();
  }

  _refreshAll() {
    this._drawToolbar();
    this._drawStage();
    this._drawInfo();
    this._drawSelected();
  }

  _select(i) {
    if (this._sel === i) return;
    this._sel = i;
    this._drawToolbar();
    this._drawStage();
    this._drawInfo();
    this._drawSelected();
  }
  _overlaps(i) {
    const cfg = this._config;
    const a = hitBox(norm(cfg.buttons[i]), cfg, this._asp);
    const tol = 0.05;
    const out = [];
    cfg.buttons.forEach((b, j) => {
      if (j === i) return;
      const o = hitBox(norm(b), cfg, this._asp);
      if (a.l < o.r - tol && a.r > o.l + tol && a.t < o.b - tol && a.b > o.t + tol) out.push(j);
    });
    return out;
  }

  _drawStage() {
    const host = this.shadowRoot.getElementById("host");
    const cfg = this._config;
    host.innerHTML = "";
    if (modeOf(cfg) === "image" && !cfg.image) {
      host.innerHTML = `<div class="noimg">Сначала загрузи картинку пульта в зону выше.</div>`;
      return;
    }
    const designed = modeOf(cfg) === "designed";
    const { stage, hits, W, H } = buildStage(cfg, {
      onImgLoad: (img) => {
        const a = img.naturalWidth / img.naturalHeight;
        if (a && Math.abs(a - this._asp) > 0.001) {
          this._asp = a;
          this._drawStage();
          this._drawInfo();
        }
      },
    });
    const ov = this._sel >= 0 ? this._overlaps(this._sel) : [];
    hits.forEach((h, i) => {
      h.classList.add("ed");
      if (i === this._sel) h.classList.add("sel");
      else if (ov.includes(i)) h.classList.add("ovl");
      const bd = document.createElement("span");
      bd.className = "badge";
      bd.textContent = i + 1;
      h.appendChild(bd);
    });

    const b = cfg.buttons[this._sel];
    if (b) {
      const n = norm(b);
      const handle = document.createElement("div");
      handle.className = "handle";
      handle.dataset.handle = "1";
      if (designed) {
        const sv = document.createElement("div");
        sv.className = "selvis";
        sv.style.left = n.x + "%";
        sv.style.top = n.y + "%";
        sv.style.width = (n.w / W) * 100 + "%";
        sv.style.height = (n.h / H) * 100 + "%";
        sv.style.borderRadius = isRound(n.shape) ? "50%" : `${(radiusOf(n.shape, n.w, n.h) / W) * 100}cqw`;
        stage.appendChild(sv);
        handle.style.left = n.x + (n.w / W) * 50 + "%";
        handle.style.top = n.y + (n.h / H) * 50 + "%";
      } else {
        const bx = hitBox(n, cfg, this._asp);
        handle.style.left = n.x + bx.wp / 2 + "%";
        handle.style.top = n.y + bx.hp / 2 + "%";
      }
      stage.appendChild(handle);
    }
    if (designed) {
      const g = gridOf(cfg);
      let o = "";
      if (g.show) {
        o += `<defs><pattern id="rmcg" width="${g.size}" height="${g.size}" patternUnits="userSpaceOnUse"><path d="M${g.size} 0H0V${g.size}" fill="none" stroke="rgba(128,128,128,.5)" stroke-width="1" vector-effect="non-scaling-stroke"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#rmcg)"/>`;
        o += `<path d="M${W / 2} 0V${H}M0 ${H / 2}H${W}" stroke="rgba(0,229,255,.75)" stroke-width="1" stroke-dasharray="6 4" fill="none" vector-effect="non-scaling-stroke"/>`;
      }
      const gd = this._guides;
      if (gd) {
        gd.x.forEach((x) => (o += `<path d="M${x} 0V${H}" stroke="#ff2d95" stroke-width="1" fill="none" vector-effect="non-scaling-stroke"/>`));
        gd.y.forEach((y) => (o += `<path d="M0 ${y}H${W}" stroke="#ff2d95" stroke-width="1" fill="none" vector-effect="non-scaling-stroke"/>`));
      }
      if (o) {
        const w = document.createElement("div");
        w.innerHTML = `<svg class="gov" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${o}</svg>`;
        stage.appendChild(w.firstChild);
      }
    }
    host.appendChild(stage);
  }

  _drawInfo() {
    const el = this.shadowRoot.getElementById("info");
    const cfg = this._config;
    const b = cfg.buttons[this._sel];
    if (!b) {
      el.textContent = cfg.buttons.length ? "Выбери кнопку на схеме." : "Кнопок пока нет — добавь первую.";
      return;
    }
    const n = norm(b);
    let t;
    if (modeOf(cfg) === "designed") {
      const s = n.hit_scale / 100;
      const hw = Math.round(n.w * s), hh = Math.round(n.h * s);
      const m = Math.round((hw - n.w) / 2);
      const margin = m === 0 ? "ровно по кнопке" : `${m > 0 ? "+" : ""}${m} px с каждой стороны`;
      t = `Кнопка ${Math.round(n.w)}×${Math.round(n.h)} px · зона ${hw}×${hh} px (${Math.round(n.hit_scale)}%, ${margin})`;
    } else {
      t = `Зона нажатия: ${n.size}% ширины картинки`;
    }
    const ov = this._overlaps(this._sel);
    if (ov.length) t += `<br><span class="warn">Зона пересекается с кнопкой ${ov.map((j) => "№" + (j + 1)).join(", ")}: при нажатии в общей области сработает верхняя.</span>`;
    el.innerHTML = t;
  }
  _snapTargets(axis) {
    const cfg = this._config;
    const d = designOf(cfg);
    const L = axis === "x" ? d.width : d.height;
    const t = [];
    if (gridOf(cfg).guides) {
      t.push(0, L / 2, L);
      cfg.buttons.forEach((b, j) => {
        if (j === this._sel) return;
        const n = norm(b);
        const c = axis === "x" ? (n.x / 100) * d.width : (n.y / 100) * d.height;
        const half = (axis === "x" ? n.w : n.h) / 2;
        t.push(c - half, c, c + half);
      });
    }
    return t;
  }
  _snap(axis, cands) {
    const cfg = this._config;
    const g = gridOf(cfg);
    const d = designOf(cfg);
    const r = this._stageEl().getBoundingClientRect();
    const k = axis === "x" ? d.width / r.width : d.height / r.height;
    const thr = 6 * k;
    const targets = this._snapTargets(axis);
    let best = null;
    for (const c of cands) {
      for (const t of targets) {
        const dl = t - c;
        if (Math.abs(dl) <= thr && (!best || Math.abs(dl) < Math.abs(best))) best = dl;
      }
    }
    if (best === null && g.snap) {
      for (const c of cands) {
        const dl = Math.round(c / g.size) * g.size - c;
        if (best === null || Math.abs(dl) < Math.abs(best)) best = dl;
      }
      return { delta: best, lines: [] };
    }
    if (best === null) return { delta: 0, lines: [] };
    const lines = [...new Set(targets.filter((t) => cands.some((c) => Math.abs(c + best - t) < 0.5)).map((t) => round2(t)))];
    return { delta: best, lines };
  }
  _setupHost() {
    const host = this.shadowRoot.getElementById("host");

    host.tabIndex = 0;
    host.addEventListener("pointerdown", (e) => {
      if (!this._stageEl()) return;
      host.focus({ preventScroll: true });
      const handle = e.target.closest("[data-handle]");
      const hit = e.target.closest("[data-i]");
      if (handle) {
        this._drag = { t: "size" };
      } else if (hit) {
        const i = +hit.dataset.i;
        this._select(i);
        const b = this._config.buttons[i];
        const p = this._pos(e);
        this._drag = { t: "move", dx: (b.x ?? 50) - p.x, dy: (b.y ?? 50) - p.y };
      } else {
        this._select(-1);
        return;
      }
      this._moved = false;
      host.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    host.addEventListener("pointermove", (e) => {
      if (!this._drag) return;
      const b = this._config.buttons[this._sel];
      if (!b) return;
      const p = this._pos(e);
      const cfg = this._config;
      const designed = modeOf(cfg) === "designed";
      const free = e.altKey;
      this._guides = null;
      if (this._drag.t === "move") {
        if (designed) {
          const d = designOf(cfg);
          const n = norm(b);
          let cx = (clamp(p.x + this._drag.dx, 0, 100) / 100) * d.width;
          let cy = (clamp(p.y + this._drag.dy, 0, 100) / 100) * d.height;
          let gx = [], gy = [];
          if (!free) {
            const sx = this._snap("x", [cx - n.w / 2, cx, cx + n.w / 2]);
            const sy = this._snap("y", [cy - n.h / 2, cy, cy + n.h / 2]);
            cx += sx.delta; cy += sy.delta;
            gx = sx.lines; gy = sy.lines;
          }
          b.x = round2(clamp((cx / d.width) * 100, 0, 100));
          b.y = round2(clamp((cy / d.height) * 100, 0, 100));
          this._guides = { x: gx, y: gy };
        } else {
          b.x = round1(clamp(p.x + this._drag.dx, 0, 100));
          b.y = round1(clamp(p.y + this._drag.dy, 0, 100));
        }
      } else {
        const n = norm(b);
        if (designed) {
          const d = designOf(cfg);
          const cx = (n.x / 100) * d.width, cy = (n.y / 100) * d.height;
          let ex = (p.x / 100) * d.width, ey = (p.y / 100) * d.height;
          let gx = [], gy = [];
          if (!free) {
            const sx = this._snap("x", [ex]);
            const sy = this._snap("y", [ey]);
            ex += sx.delta; ey += sy.delta;
            gx = sx.lines; gy = sy.lines;
          }
          let w = Math.max(10, Math.round(2 * (ex - cx)));
          let h = Math.max(10, Math.round(2 * (ey - cy)));
          if (SQUARE.includes(n.shape)) w = h = Math.max(w, h);
          b.w = w;
          b.h = h;
          this._guides = { x: gx, y: gy };
        } else {
          b.size = clamp(round1(2 * (p.x - n.x)), 2, 60);
        }
      }
      this._moved = true;
      this._drawStage();
      this._drawInfo();
    });

    const end = () => {
      if (!this._drag) return;
      const moved = this._moved;
      this._drag = null;
      this._guides = null;
      if (moved) {
        this._emit();
        this._drawStage();
        this._drawSelected();
      }
    };
    host.addEventListener("pointerup", end);
    host.addEventListener("pointercancel", end);

    host.addEventListener("keydown", (e) => {
      const k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      const b = this._config.buttons[this._sel];
      if (!k || !b || !this._stageEl()) return;
      e.preventDefault();
      const cfg = this._config;
      const n = norm(b);
      if (modeOf(cfg) === "designed") {
        const d = designOf(cfg);
        const step = e.shiftKey ? gridOf(cfg).size : 1;
        b.x = round2(clamp(n.x + ((k[0] * step) / d.width) * 100, 0, 100));
        b.y = round2(clamp(n.y + ((k[1] * step) / d.height) * 100, 0, 100));
      } else {
        const step = e.shiftKey ? 1 : 0.1;
        b.x = round1(clamp(n.x + k[0] * step, 0, 100));
        b.y = round1(clamp(n.y + k[1] * step, 0, 100));
      }
      this._emit();
      this._drawStage();
      this._drawInfo();
      this._drawSelected();
    });

    host.addEventListener("dblclick", (e) => {
      if (!this._stageEl() || e.target.closest("[data-i],[data-handle]")) return;
      this._add(this._pos(e));
    });
  }
  _form(i, schemaFn) {
    const f = document.createElement("ha-form");
    const data = () => {
      const b = this._config.buttons[i];
      return { ...norm(b), no_fill: b.color === "transparent" };
    };
    f.hass = this._hass;
    f.data = data();
    f.schema = schemaFn(data());
    f.computeLabel = (sc) => labelOf(sc.name, data().shape);
    f.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const old = data();
      const val = e.detail.value;
      const b = { ...this._config.buttons[i] };
      let redraw = false;
      for (const k of Object.keys(val)) {
        if (JSON.stringify(val[k]) === JSON.stringify(old[k])) continue;
        if (k === "no_fill") {
          b.color = val[k] ? "transparent" : "#777777";
          redraw = true;
        } else if (val[k] === undefined || val[k] === null) {
          delete b[k];
        } else {
          b[k] = val[k];
        }
        if (k === "shape" || k === "content") redraw = true;
      }
      if (SQUARE.includes(norm(b).shape)) b.h = norm(b).w;
      this._config.buttons[i] = b;
      this._emit();
      this._drawStage();
      this._drawInfo();
      if (redraw) this._drawSelected();
      else f.data = data();
    });
    return f;
  }

  _drawSelected() {
    const s = this.shadowRoot.getElementById("sel");
    s.innerHTML = "";
    const i = this._sel;
    const b = this._config.buttons[i];
    if (!b) return;
    const designed = modeOf(this._config) === "designed";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = `Кнопка №${i + 1}`;
    s.appendChild(title);

    const num = (name, min, max) => ({ name, selector: { number: { min, max, step: 1, mode: "box" } } });
    const slider = (name, min, max) => ({ name, selector: { number: { min, max, step: 1, mode: "slider" } } });
    const opts = (o) => ({ select: { mode: "dropdown", options: o } });

    if (designed) {
      const sec = document.createElement("div");
      sec.className = "sec";
      sec.textContent = "Внешний вид";
      s.appendChild(sec);

      s.appendChild(this._form(i, (n) => {
        const sch = [
          { name: "name", selector: { text: {} } },
          { name: "shape", selector: opts(Object.entries(SHAPES).map(([value, label]) => ({ value, label }))) },
          num("w", 10, 2000),
        ];
        if (!SQUARE.includes(n.shape)) sch.push(num("h", 10, 2000));
        sch.push({ name: "no_fill", selector: { boolean: {} } });
        sch.push({ name: "content", selector: opts([
          { value: "text", label: "Текст" },
          { value: "icon", label: "Иконка" },
          { value: "none", label: "Пусто (просто цветная кнопка)" },
        ]) });
        if (n.content === "text") {
          sch.push({ name: "text", selector: { text: { multiline: true } } });
          sch.push(num("font_size", 0, 400));
        } else if (n.content === "icon") {
          sch.push({ name: "icon", selector: opts(Object.entries(ICONS).map(([value, v]) => ({ value, label: v.l }))) });
          sch.push(slider("icon_scale", 20, 150));
        }
        return sch;
      }));

      const nb = norm(b);
      if (b.color !== "transparent") {
        s.appendChild(this._color("Цвет кнопки", nb.color, (v) => {
          this._config.buttons[i].color = v;
          this._emit();
          this._drawStage();
        }));
      }
      if (nb.content !== "none") {
        s.appendChild(this._color(nb.content === "icon" ? "Цвет иконки" : "Цвет текста", nb.text_color, (v) => {
          this._config.buttons[i].text_color = v;
          this._emit();
          this._drawStage();
        }));
      }
    }

    const sec2 = document.createElement("div");
    sec2.className = "sec";
    sec2.textContent = "Нажатие";
    s.appendChild(sec2);
    s.appendChild(this._form(i, () => {
      const sch = [];
      if (designed) sch.push(slider("hit_scale", 30, 250));
      else sch.push({ name: "name", selector: { text: {} } }, slider("size", 2, 60));
      sch.push({ name: "tap_action", selector: { ui_action: {} } });
      sch.push({ name: "entity", selector: { entity: {} } });
      return sch;
    }));
  }
}

customElements.define("remote-map-card", RemoteMapCard);
customElements.define("remote-map-card-editor", RemoteMapCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "remote-map-card",
  name: "Remote Map Card",
  description: "Пульт с кликабельными кнопками: своя картинка или пульт, нарисованный прямо в карточке (есть стеклянный режим)",
});

console.info(`%c REMOTE-MAP-CARD %c v${RMC_VERSION} `, "background:#03a9f4;color:#fff;font-weight:700", "background:#333;color:#fff");