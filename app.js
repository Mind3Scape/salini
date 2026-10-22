"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const main = $("#main"),
  dialog = $("#dialog"),
  dialogBody = $("#dialog-body");
const categories = {
  all: "Все изделия",
  baths: "Ванны",
  basins: "Раковины",
  furniture: "Мебель",
  mirrors: "Зеркала",
  toilets: "Унитазы и биде",
  trays: "Душевые поддоны",
  countertops: "Столешницы",
  accessories: "Аксессуары",
  components: "Комплектующие",
  care: "Уход",
};
let data = { products: [], collections: [] },
  favoriteIds = new Set(),
  slideIndex = 0,
  toastTimer,
  lastFocus;
try {
  const saved = JSON.parse(localStorage.getItem("salini-selection") || "[]");
  if (Array.isArray(saved))
    favoriteIds = new Set(saved.filter((x) => typeof x === "string"));
} catch {}
const PUBLIC_SITE_URL = "https://mind3scape.github.io/salini/";
const TESTFLIGHT_URL = "https://testflight.apple.com/join/mUb5H7bZ";
const isAppleMobile = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const productUrl = (p) => `#/product/${encodeURIComponent(p.id)}`;
const publicUrl = (hash) => new URL(hash, PUBLIC_SITE_URL).href;
const selectionHash = (ids) =>
  "#/selection?ids=" + encodeURIComponent(ids.join(","));
const breadcrumb = (t) =>
  `<div class="breadcrumb"><a href="#/">Главная</a><span>/</span><span>${esc(t)}</span></div>`;
const pageHeading = (title, desc, extra = "") =>
  `<div class="page-heading wrap">${breadcrumb(title)}<h1>${esc(title)}</h1>${desc ? `<p>${desc}</p>` : ""}${extra}</div>`;
const materials = {
  stone: {
    title: "Мягкость камня",
    text: "Матовый композит с минеральным наполнителем. Однородная структура и бархатистая поверхность, которую хочется почувствовать.",
  },
  sense: {
    title: "Игра отражений",
    text: "Материал на основе мраморной муки и связующих смол с защитным гелькоутом. Доступен в матовом и глянцевом исполнении.",
  },
  shine: {
    title: "Свет изнутри",
    text: "Полупрозрачный материал S-Shine раскрывает коллекцию Ninfea по-новому. Свет проходит сквозь форму, создавая ощущение лёгкости.",
  },
};
const collectionDescriptions = {
  Paola: "Свобода формы и цвета",
  Sofia: "Мягкая геометрия на каждый день",
  Alda: "Спокойная выразительность",
  Luce: "Впечатление невесомости",
  Greca: "Архитектура мягких линий",
  Ninfea: "Вдохновлённая природой",
  Aria: "Чистота и равновесие",
  Opera: "Классика вне времени",
};
function notify(text) {
  $("#toast").textContent = text;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2800);
}
function syncFavorites() {
  const count = $("#favorites-count");
  count.textContent = favoriteIds.size;
  count.hidden = !favoriteIds.size;
  $$("[data-save]").forEach((b) => {
    const active = favoriteIds.has(b.dataset.save);
    b.setAttribute("aria-pressed", active);
    b.setAttribute(
      "aria-label",
      active ? "Убрать из подборки" : "Добавить в подборку",
    );
    if (b.classList.contains("save-product"))
      b.textContent = active ? "♥" : "♡";
    else
      b.innerHTML = active
        ? "В подборке <span>♥</span>"
        : "В мою подборку <span>♡</span>";
  });
}
function toggleFavorite(id) {
  if (!data.products.some((p) => p.id === id)) return;
  const remove = favoriteIds.has(id);
  remove ? favoriteIds.delete(id) : favoriteIds.add(id);
  try {
    localStorage.setItem("salini-selection", JSON.stringify([...favoriteIds]));
    notify(
      remove
        ? "Изделие убрано из подборки"
        : "Изделие добавлено в вашу подборку",
    );
  } catch {
    notify("Подборка сохранена на время этого посещения");
  }
  syncFavorites();
  if (location.hash.startsWith("#/favorites")) renderFavorites();
}
function closeMenu() {
  document.body.classList.remove("menu-open");
  $("#mobile-menu").hidden = true;
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  $(".menu-toggle").setAttribute("aria-label", "Открыть меню");
}
function openDialog(content, type = "") {
  if (!dialog.open) lastFocus = document.activeElement;
  dialog.className = type;
  dialogBody.innerHTML = content;
  if (!dialog.open) dialog.showModal();
}
function closeDialog() {
  const video = $("video", dialog);
  if (video) video.pause();
  dialog.close();
  if (lastFocus?.isConnected) lastFocus.focus();
}
function contact() {
  openDialog(
    `<span class="eyebrow">Рады познакомиться</span><h2 id="dialog-title">Поможем<br><em>с выбором.</em></h2><p>Коллекции, материалы и ближайший салон — свяжитесь с командой Salini.</p><div class="contact-options"><a href="tel:+74952493349"><span>+7 (495) 249-33-49<small>Позвонить в Salini</small></span><span>↗</span></a><a href="mailto:info@salini-srl.com"><span>info@salini-srl.com<small>Написать о вашем проекте</small></span><span>↗</span></a><a href="https://salini-srl.com/where-buy/" target="_blank" rel="noopener"><span>Найти салон<small>Актуальные адреса на официальном сайте</small></span><span>↗</span></a><a href="mailto:design@salini-srl.com"><span>Для дизайнеров и архитекторов<small>design@salini-srl.com</small></span><span>↗</span></a></div>`,
  );
}
function showSearch() {
  openDialog(
    `<span class="eyebrow">Найдите свою форму</span><h2 id="dialog-title">Поиск</h2><label class="sr-only" for="global-search">Название изделия или коллекции</label><input id="global-search" class="dialog-search" placeholder="Например, Paola или раковина" autocomplete="off"><div class="dialog-results" aria-live="polite"></div>`,
  );
  const field = $("#global-search");
  field.addEventListener("input", () => searchResults(field.value));
  searchResults("");
  field.focus();
}
function matches(p, q) {
  return [
    p.name,
    p.sourceName,
    p.category,
    p.subtitle,
    p.collection,
    p.article,
    ...(p.variants || []).flatMap((v) => [v.sku, v.customColourSku]),
  ]
    .join(" ")
    .toLowerCase()
    .includes(q.toLowerCase().trim());
}
function searchResults(q) {
  const items = data.products.filter((p) => matches(p, q)).slice(0, 8);
  $(".dialog-results").innerHTML = items.length
    ? items
        .map(
          (p) =>
            `<a class="search-result" href="${productUrl(p)}">${p.image ? `<img src="${p.image.src}" alt="" width="65" height="50">` : ""}<span><strong>${esc(p.name)}</strong><small>${esc(p.subtitle)} · ${esc(p.collection)}</small></span></a>`,
        )
        .join("")
    : "<p>Ничего не найдено. Попробуйте название коллекции или тип изделия.</p>";
}
function productImage(p) {
  return p.image
    ? `<img src="${p.image.src}" alt="${esc(p.name)}" width="${p.image.width}" height="${p.image.height}" loading="lazy">`
    : '<div class="no-photo"><span>salini</span><small>Фотография уточняется</small></div>';
}
function card(p) {
  return `<article class="product-card"><button class="save-product" data-save="${esc(p.id)}" aria-label="Добавить в подборку" aria-pressed="false">♡</button><a class="product-card-link" href="${productUrl(p)}"><div class="image-wrap">${productImage(p)}</div><div class="product-category">${esc(p.subtitle)}</div><h2>${esc(p.name)}</h2><p>${esc(p.dimensionsLabel)}</p></a></article>`;
}
function renderHome() {
  main.innerHTML = $("#home-template").innerHTML;
  slideIndex = 0;
}
function setSlide(delta) {
  const slides = [
    {
      name: "Paola",
      src: "hero-paola",
      href: "Paola",
      alt: "Бирюзовая ванна Paola в интерьере с бордовой плиткой",
    },
    {
      name: "Greca",
      src: "greca",
      href: "Greca",
      alt: "Ванна Greca в светлом интерьере",
    },
    {
      name: "Opera",
      src: "opera",
      href: "Opera",
      alt: "Ванна Opera с видом на море",
    },
  ];
  slideIndex = (slideIndex + delta + slides.length) % slides.length;
  const slide = slides[slideIndex];
  const hero = $(".hero");
  $("picture", hero).innerHTML =
    `<img class="hero-image" src="assets/${slide.src}.webp" alt="${slide.alt}" width="2400" height="1350">`;
  $(".hero-name", hero).innerHTML = `${slide.name} <i>by Salini</i>`;
  $(".hero-current", hero).textContent = String(slideIndex + 1).padStart(
    2,
    "0",
  );
  $(".hero-progress", hero).style.setProperty(
    "--progress",
    `${slideIndex * 33.33}%`,
  );
  $(".hero-copy .button", hero).href = `#/catalog?collection=${slide.href}`;
  hero.setAttribute("aria-label", "Коллекция " + slide.name);
}
function renderCatalog(params = new URLSearchParams()) {
  const category = params.get("category") || "all",
    collection = params.get("collection") || "",
    query = params.get("q") || "";
  main.innerHTML =
    pageHeading(
      collection || "Каталог",
      "Найдите форму, которая станет частью вашего пространства. Сохраняйте понравившиеся изделия и продолжайте выбор на iPhone.",
    ) +
    `<section class="catalog-tools" aria-label="Фильтры каталога"><div class="catalog-categories">${Object.entries(
      categories,
    )
      .map(
        ([id, label]) =>
          `<button class="filter-chip" data-category="${id}" aria-pressed="${id === category}">${label}</button>`,
      )
      .join(
        "",
      )}</div><div class="filter-row"><label class="field filter-search">Поиск<input id="catalog-search" type="search" placeholder="Название, коллекция, артикул" value="${esc(query)}"></label><label class="field">Коллекция<select id="collection-filter"><option value="">Все коллекции</option>${[
      ...new Set(data.products.map((p) => p.collection).filter(Boolean)),
    ]
      .sort()
      .map(
        (c) =>
          `<option ${c === collection ? "selected" : ""} value="${esc(c)}">${esc(c)}</option>`,
      )
      .join(
        "",
      )}</select></label><label class="field">Порядок<select id="sort-filter"><option value="curated">Выбор Salini</option><option value="name">По названию</option></select></label><label class="field">Материал<select id="material-filter"><option value="">Все материалы</option><option>S-Stone</option><option>S-Sense</option></select></label></div><label class="options-check"><input type="checkbox" id="include-options"> Показывать опции и доработки изделий</label><div class="results-count" role="status" aria-live="polite"></div></section><section class="catalog-grid wrap" aria-label="Изделия"></section><div class="catalog-end"><p>Каталог и характеристики — снимок от 06.10.2026. Цены, наличие и условия заказа уточняются на официальном сайте.</p><a class="line-link" href="https://salini-srl.com/" target="_blank" rel="noopener">Открыть официальный каталог <span>↗</span></a></div>`;
  let selectedCategory = Object.hasOwn(categories, category) ? category : "all";
  function filter() {
    const q = $("#catalog-search").value,
      c = $("#collection-filter").value,
      sort = $("#sort-filter").value,
      material = $("#material-filter").value,
      includeOptions = $("#include-options").checked;
    let products = data.products.filter(
      (p) =>
        (includeOptions || !p.isOption) &&
        (!material || p.materials.includes(material)) &&
        (selectedCategory === "all" || p.categoryId === selectedCategory) &&
        (!c || p.collection === c) &&
        matches(p, q),
    );
    if (sort === "name") products.sort((a, b) => a.name.localeCompare(b.name));
    let shown = 36;
    const paint = () => {
      $(".catalog-grid").innerHTML =
        products.slice(0, shown).map(card).join("") +
        (products.length > shown
          ? '<button class="button load-more">Показать ещё <span>↓</span></button>'
          : "");
      const more = $(".load-more");
      if (more)
        more.addEventListener("click", () => {
          shown += 36;
          paint();
          syncFavorites();
        });
    };
    $(".catalog-grid").innerHTML = products.length
      ? ""
      : `<div class="empty-state"><h2>Пока ничего не найдено</h2><p>Попробуйте другую коллекцию или сбросьте фильтры.</p><a class="button" href="#/catalog">Все изделия ↗</a></div>`;
    if (products.length) paint();
    $(".results-count").textContent =
      `Найдено ${products.length} · каталог от 06.10.2026`;
    $(".page-heading h1").textContent = c || "Каталог";
    syncFavorites();
    const next = new URLSearchParams();
    if (selectedCategory !== "all") next.set("category", selectedCategory);
    if (c) next.set("collection", c);
    if (q) next.set("q", q);
    if (material) next.set("material", material);
    if (sort !== "curated") next.set("sort", sort);
    if (includeOptions) next.set("options", "1");
    history.replaceState(null, "", `#/catalog${next.size ? "?" + next : ""}`);
  }
  $$("[data-category]").forEach((b) =>
    b.addEventListener("click", () => {
      selectedCategory = b.dataset.category;
      $$("[data-category]").forEach((c) =>
        c.setAttribute("aria-pressed", c === b),
      );
      filter();
    }),
  );
  $("#catalog-search").addEventListener("input", filter);
  $("#collection-filter").addEventListener("change", filter);
  $("#sort-filter").addEventListener("change", filter);
  $("#material-filter").addEventListener("change", filter);
  $("#include-options").addEventListener("change", filter);
  $("#material-filter").value = params.get("material") || "";
  $("#sort-filter").value = params.get("sort") === "name" ? "name" : "curated";
  $("#include-options").checked = params.get("options") === "1";
  filter();
}
function renderProduct(id) {
  const p = data.products.find((p) => p.id === (data.legacyIds?.[id] || id));
  if (!p) {
    renderNotFound();
    return;
  }
  document.title = `${p.name} — Salini`;
  main.innerHTML = `<div class="page-heading wrap">${breadcrumb(p.name)}</div><section class="detail wrap"><div class="detail-photo">${productImage(p)}</div><div class="detail-info"><span class="eyebrow">${p.collection ? "Коллекция " + esc(p.collection) : esc(p.category)}</span><h1>${esc(p.name)}</h1><p>${esc(p.subtitle)}</p><dl class="spec-list"><div><dt>Артикул выбранной версии</dt><dd>${esc(p.article || "См. спецификацию")}</dd></div><div><dt>Размеры</dt><dd>${esc(p.dimensionsLabel)}</dd></div><div><dt>Материалы</dt><dd>${esc(p.materials.join(" / ") || "См. спецификацию")}</dd></div></dl><div class="detail-actions"><button class="button button-dark" data-save="${esc(p.id)}" aria-pressed="false">В мою подборку <span>♡</span></button><a class="button" href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">Варианты и стоимость <span>↗</span></a></div><button class="line-link app-product-link" data-app-product="${esc(p.id)}">Продолжить на iPhone <span aria-hidden="true">↗</span></button><div class="variant-options"><label class="field">Исполнение<select id="product-variant">${(p.variants || []).map((v, i) => `<option value="${i}">${esc(v.title || v.sku || "Вариант " + (i + 1))}</option>`).join("")}</select></label><p id="variant-info" class="small-note"></p></div><p class="detail-disclaimer">Размеры указаны для базового варианта. Отделка и материал могут менять характеристики. Точные параметры для заказа — в документах изделия и у команды Salini.</p>${p.downloads.length ? `<div class="downloads"><h2>Для вашего проекта</h2>${p.downloads.map((d) => `<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.label)} <span>↗</span></a>`).join("")}</div>` : ""}<button class="line-link contact-toggle">Помочь с выбором <span>↗</span></button></div></section>`;
  syncFavorites();
  const variant = $("#product-variant");
  if (variant) {
    const update = () => {
      const v = p.variants[Number(variant.value)];
      $("#variant-info").textContent = v
        ? [
            "Артикул: " + (v.sku || "уточняется"),
            v.weightKg ? "Вес: " + v.weightKg + " кг" : null,
          ]
            .filter(Boolean)
            .join(" · ")
        : "Исполнение уточняется на официальном сайте";
      const sku = $(".spec-list dd");
      if (sku) sku.textContent = v?.sku || "См. спецификацию";
    };
    variant.addEventListener("change", update);
    update();
  }
}
function renderCollections() {
  main.innerHTML =
    pageHeading(
      "Коллекции",
      "У каждой — свой характер. Найдите ту, которая отзывается именно вам.",
    ) +
    `<section class="collection-grid wrap section" style="padding-top:0">${data.collections.map((c, i) => `<a class="collection-card collection-small" href="#/catalog?collection=${encodeURIComponent(c.name)}"><div class="image-wrap"><img src="${c.image.src}" alt="Коллекция ${esc(c.name)}" loading="lazy" width="1450" height="816"><span class="image-label">0${i + 1} / Salini</span><span class="round-arrow">↗</span></div><div class="collection-description"><h3>${esc(c.name)}</h3><span>${collectionDescriptions[c.name] || ""}</span></div></a>`).join("")}</section>`;
}
function renderFavorites() {
  const selected = data.products.filter((p) => favoriteIds.has(p.id));
  main.innerHTML =
    pageHeading(
      "Моя подборка",
      "Ваше личное пространство начинается с деталей. Сохранённые изделия доступны в этом браузере.",
      selected.length
        ? '<div class="favorites-actions"><button class="button button-dark" id="export-selection">Скачать подборку <span>↓</span></button><button class="button" id="share-selection">Поделиться ссылкой <span>↗</span></button><button class="button" id="open-app-selection">На iPhone <span aria-hidden="true">↗</span></button></div>'
        : "",
    ) +
    `<section class="catalog-grid wrap">${selected.length ? selected.map(card).join("") : '<div class="empty-state"><h2>Здесь будет ваша история</h2><p>Нажимайте на сердечко у понравившихся изделий.<br>Они появятся в этой подборке.</p><a class="button button-dark" href="#/catalog">Исследовать каталог <span>↗</span></a></div>'}</section>`;
  syncFavorites();
}
function exportSelection() {
  const selected = data.products.filter((p) => favoriteIds.has(p.id));
  const html = `<!doctype html><html lang="ru"><meta charset="utf-8"><title>Моя подборка Salini</title><style>body{font:15px/1.7 Arial,sans-serif;max-width:850px;margin:60px auto;padding:20px;color:#2b3229}h1{font:42px Georgia}article{border-top:1px solid #ddd;padding:25px 0}h2{font:30px Georgia;margin:0}a{color:#53614d}small{color:#666}@media print{article{break-inside:avoid}}</style><h1>Salini · Моя подборка</h1><p>Коллекция идей для вашего пространства.</p>${selected.map((p) => `<article><h2>${esc(p.name)}</h2><p>${esc(p.subtitle)} · ${esc(p.dimensionsLabel)}<br>${esc(p.materials.join(", "))}<br>Артикул: ${esc(p.article)}</p><a href="${esc(p.sourceUrl)}">Открыть изделие и актуальные варианты ↗</a></article>`).join("")}<small>Подборка составлена на основе данных каталога от 06.10.2026. Параметры необходимо уточнить перед заказом. Документ можно сохранить в PDF через печать браузера.</small></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "Salini — моя подборка.html";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify("Подборка скачана");
}
async function copyLink(url, success = "Ссылка скопирована") {
  try {
    await navigator.clipboard.writeText(url);
    notify(success);
  } catch {
    openDialog(
      `<span class="eyebrow">Откройте на любом устройстве</span><h2 id="dialog-title">Ваша ссылка</h2><p>Нажмите на поле и скопируйте адрес.</p><label class="field">Ссылка Salini<input class="copy-link-field" value="${esc(url)}" readonly></label><button class="line-link" data-close-dialog>Готово <span aria-hidden="true">✓</span></button>`,
    );
    $("input", dialog).select();
  }
}
async function shareSelection() {
  if (favoriteIds.size > 100) {
    notify("Ссылка поддерживает до 100 изделий; скачайте полную подборку");
    return;
  }
  await copyLink(publicUrl(selectionHash([...favoriteIds])), "Ссылка на подборку скопирована");
}
function renderShared(params) {
  const raw = (params.get("ids") || "")
    .split(",")
    .map((id) => data.legacyIds?.[id] || id);
  const valid =
    raw.length <= 100 &&
    raw.every((id) => data.products.some((p) => p.id === id));
  const ids = new Set(valid ? raw : []);
  const products = data.products.filter((p) => ids.has(p.id));
  main.innerHTML =
    pageHeading(
      "Подборка Salini",
      "Идеи для вашего пространства. Добавляйте понравившиеся изделия в свою подборку.",
      products.length
        ? `<div class="favorites-actions"><button class="button button-dark" data-app-selection="${esc(products.map((p) => p.id).join(","))}">Продолжить на iPhone <span aria-hidden="true">↗</span></button></div>`
        : "",
    ) +
    `<section class="catalog-grid wrap">${products.length ? products.map(card).join("") : '<div class="empty-state"><h2>В этой подборке нет изделий</h2><a href="#/catalog" class="line-link">Открыть каталог ↗</a></div>'}</section>`;
  syncFavorites();
}
function renderMaterials() {
  main.innerHTML =
    pageHeading(
      "Ощущение материала",
      "Свет, фактура, цвет. Три способа увидеть привычную форму по-новому.",
    ) +
    `<div class="editorial-page wrap"><img class="editorial-hero" src="assets/paola-detail.webp" alt="Тонкая линия и цвет раковины Paola" width="2000" height="1126"><section class="editorial-row"><div><span class="eyebrow">01 / Матовый характер</span><h2>S-Stone.<br><em>Прикосновение к тишине.</em></h2><p>Однородный композитный материал на основе природных минералов, связующих смол и пигментов. Его бархатистая матовая поверхность мягко рассеивает свет.</p><p>Форма читается спокойно и цельно. Такой материал особенно выразителен там, где важны тактильность и чистота силуэта.</p><a href="#/catalog" class="line-link">Найти свою форму <span>↗</span></a></div><img src="assets/greca.webp" alt="Матовая ванна Greca" width="1450" height="816" loading="lazy"></section><section class="editorial-row"><img src="assets/aria.webp" alt="Ванна Aria и отражения света" width="1920" height="1080" loading="lazy"><div><span class="eyebrow">02 / Отражение света</span><h2>S-Sense.<br><em>Выразительность бликов.</em></h2><p>Материал на основе очищенной мраморной муки и связующих смол с защитным гелькоутом. Глянцевая поверхность отражает свет и подчёркивает изгибы.</p><p>Выбор покрытия и цвета зависит от модели. Сравнить варианты и подобрать образец поможет команда Salini.</p><button class="line-link contact-toggle">Обсудить материалы <span>↗</span></button></div></section><section class="editorial-row"><div><span class="eyebrow">03 / Свет сквозь форму</span><h2>S-Shine.<br><em>Новая лёгкость.</em></h2><p>Полупрозрачный материал раскрывает особый характер Ninfea: свет проходит сквозь изделие, а широкие края напоминают листья кувшинки.</p><a href="#/catalog?collection=Ninfea" class="line-link">Открыть Ninfea <span>↗</span></a></div><img src="assets/ninfea.webp" alt="Коллекция Ninfea" width="2400" height="1351" loading="lazy"></section><p class="small-note">Фотографии иллюстрируют коллекции. Для выбора точного оттенка, материала и покрытия необходим физический образец и спецификация изделия.</p></div>`;
}
function renderAbout() {
  main.innerHTML =
    pageHeading(
      "L’anima dell’acqua.",
      "Душа воды. Итальянская эстетика, воплощённая в предметах для самого личного пространства.",
    ) +
    `<div class="editorial-page wrap"><img class="editorial-hero" src="assets/opera.webp" alt="Коллекция Opera в интерьере с морским пейзажем" width="1450" height="816"><section class="editorial-row"><div><span class="eyebrow">Философия бренда</span><h2>Красота,<br><em>которую чувствуешь.</em></h2><p>Salini — бренд сантехники и мебели для ванных комнат, основанный в Италии. В центре его коллекций — выразительная форма, минеральные материалы и внимание к деталям.</p><p>Мы собрали пространство, в котором удобно знакомиться с коллекциями, изучать материалы и выбирать изделия для своего проекта.</p><a href="#/collections" class="line-link">Познакомиться с коллекциями <span>↗</span></a></div><img src="assets/interior.webp" alt="Детали интерьера Salini" loading="lazy" width="1450" height="1813"></section><section class="editorial-row"><img src="assets/production.webp" alt="Производство Salini" loading="lazy" width="1450" height="816"><div><span class="eyebrow">От замысла к предмету</span><h2>Характер в каждой<br><em>детали.</em></h2><p>Собственное производство и работа с литьевыми материалами позволяют Salini исследовать форму: от сдержанной геометрии Aria до пластики Ninfea и архитектурного ритма Greca.</p><a href="https://salini-srl.com/about-company/" class="line-link" target="_blank" rel="noopener">История и производство Salini <span>↗</span></a></div></section></div>`;
}
function renderProfessionals() {
  main.innerHTML =
    pageHeading(
      "Создавайте с Salini.",
      "Инструменты, которые помогают пройти путь от идеи до спецификации.",
    ) +
    `<div class="editorial-page wrap"><section class="editorial-row" style="margin-top:0"><img src="assets/greca.webp" alt="Архитектурное пространство с ванной Greca" width="1450" height="816"><div><span class="eyebrow">Дизайнерам и архитекторам</span><h2>Больше пространства<br><em>для вашей идеи.</em></h2><p>Подбирайте коллекции под характер интерьера. Сохраняйте изделия в личную подборку, скачивайте техническую документацию и открывайте 3D-модели из карточек каталога.</p><a href="mailto:design@salini-srl.com" class="line-link">design@salini-srl.com <span>↗</span></a></div></section><div class="resource-list"><a href="#/catalog"><span><strong>01 / Каталог и документация</strong><small>Размеры, паспорта изделий и доступные 3D-модели</small></span><span>↗</span></a><a href="#/favorites"><span><strong>02 / Подборка вашего проекта</strong><small>Сохраните изделия и скачайте единый документ</small></span><span>↗</span></a><a href="https://mind3scape.github.io/solini-render-studio/" target="_blank" rel="noopener"><span><strong>03 / Salini Render Studio</strong><small>Визуализация предметов · для обработки требуется приглашение владельца</small></span><span>↗</span></a><a href="https://salini-srl.com/profile/" target="_blank" rel="noopener"><span><strong>04 / Кабинет дизайнера</strong><small>Профессиональные возможности на официальном сайте Salini</small></span><span>↗</span></a></div></div>`;
}
function openApp({ productId, selectionIds } = {}) {
  const product = productId && data.products.find((p) => p.id === productId);
  const ids = selectionIds || [];
  if (productId && !product) return;
  if (selectionIds && (!ids.length || ids.length > 100 || !ids.every((id) => data.products.some((p) => p.id === id)))) {
    notify("За один раз можно передать до 100 изделий");
    return;
  }
  const hash = product ? productUrl(product) : ids.length ? selectionHash(ids) : "#/app";
  const webUrl = publicUrl(hash);
  const appUrl = product
    ? `salini://product/${encodeURIComponent(product.id)}?v=1`
    : ids.length ? `salini://selection?v=1&ids=${encodeURIComponent(ids.join(","))}` : null;
  const mobile = isAppleMobile();
  const subject = product ? esc(product.name) : ids.length ? "Ваша подборка" : "Salini";
  const detail = ids.length
    ? "Эти изделия добавятся в избранное приложения. Материал и исполнение можно выбрать отдельно."
    : product ? "Откройте это же изделие в приложении и продолжите выбор." : "Коллекции, материалы и ваши идеи — рядом на iPhone.";
  openDialog(
    `<span class="eyebrow">Сайт и приложение вместе</span><h2 id="dialog-title">${subject}.<br><em>На iPhone.</em></h2><p>${detail}</p>
    ${mobile ? `<div class="app-handoff-actions">${appUrl ? `<a class="button button-dark" href="${appUrl}" data-launch-app>Открыть Salini <span aria-hidden="true">↗</span></a>` : ""}<a class="button ${appUrl ? "" : "button-dark"}" href="${TESTFLIGHT_URL}" target="_blank" rel="noopener">${appUrl ? "Установить или обновить" : "Установить через TestFlight"} <span aria-hidden="true">↗</span></a></div><p class="app-handoff-help" id="app-handoff-help" role="status">Если Salini ещё не установлен, откройте TestFlight. После установки вернитесь сюда${appUrl ? " и нажмите «Открыть Salini»" : ""}.</p>`
      : `<div class="app-device-note"><span aria-hidden="true">↗</span><p>Откройте эту страницу на iPhone. Ссылка сохранит ${product ? "выбранное изделие" : ids.length ? "вашу подборку" : "доступ к приложению"}.</p></div><div class="app-handoff-actions"><button class="button button-dark" data-copy-link="${esc(webUrl)}">Скопировать ссылку для iPhone <span aria-hidden="true">↗</span></button><a class="button" href="${TESTFLIGHT_URL}" target="_blank" rel="noopener">Salini в TestFlight <span aria-hidden="true">↗</span></a></div>`}
    <button class="line-link app-stay-web" data-close-dialog>Продолжить на сайте <span aria-hidden="true">→</span></button>`,
    "app-handoff-dialog",
  );
}
function openAppSelection() {
  openApp({ selectionIds: [...favoriteIds] });
}
function renderApp() {
  main.innerHTML = pageHeading(
    "Salini. Рядом с вами.",
    "Знакомьтесь с коллекциями здесь и продолжайте выбор на iPhone.",
  ) + `<section class="app-intro wrap"><div class="app-intro-image"><img src="assets/greca.webp" alt="Коллекция Greca от Salini" width="1450" height="816"></div><div class="app-intro-copy"><span class="eyebrow">Приложение для iPhone</span><h2>Те же формы.<br><em>Ближе к вам.</em></h2><p>Открывайте изделия с сайта в Salini и переносите свою подборку в избранное. Она останется под рукой, когда вы вернётесь к проекту.</p><a class="button button-dark" href="${TESTFLIGHT_URL}" target="_blank" rel="noopener">Открыть TestFlight <span aria-hidden="true">↗</span></a><ol class="app-steps"><li><strong>Установите Salini</strong><span>Откройте приглашение в TestFlight на iPhone. Если приложение уже есть, нажмите «Обновить».</span></li><li><strong>Выберите на сайте</strong><span>Откройте изделие или соберите подборку. Нажмите «Продолжить на iPhone».</span></li><li><strong>Продолжайте в приложении</strong><span>Изделие откроется в каталоге, а подборка добавится в избранное.</span></li></ol><p class="small-note">Избранное сайта хранится в этом браузере. Перенос в приложение выполняется по вашему нажатию; автоматической синхронизации пока нет.</p><a class="line-link" href="#/catalog">Перейти к коллекциям и изделиям <span aria-hidden="true">→</span></a></div></section>`;
}
function renderNotFound() {
  main.innerHTML =
    pageHeading(
      "Эта страница не найдена",
      "Вернёмся туда, где начинается вдохновение.",
    ) +
    '<div class="wrap section"><a class="button button-dark" href="#/">На главную ↗</a></div>';
}
function route() {
  const hash = location.hash;
  if (hash && !hash.startsWith("#/")) {
    if (!main.children.length) renderHome();
    return;
  }
  const [path, query = ""] = (hash.slice(1) || "/").split("?"),
    params = new URLSearchParams(query);
  closeMenu();
  if (dialog.open) closeDialog();
  document.title = "Salini — L’anima dell’acqua";
  if (path === "/") renderHome();
  else if (path === "/catalog") renderCatalog(params);
  else if (path.startsWith("/product/")) {
    try {
      renderProduct(decodeURIComponent(path.slice(9)));
    } catch {
      renderNotFound();
    }
  } else if (path === "/collections") renderCollections();
  else if (path === "/favorites") renderFavorites();
  else if (path === "/selection") renderShared(params);
  else if (path === "/materials") renderMaterials();
  else if (path === "/about") renderAbout();
  else if (path === "/professionals") renderProfessionals();
  else if (path === "/app") renderApp();
  else renderNotFound();
  window.scrollTo({ top: 0, behavior: "instant" });
  $$(".desktop-nav a").forEach((a) => {
    if (a.hash === `#${path}`) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  syncFavorites();
  main.focus({ preventScroll: true });
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button,a");
  if (!b) return;
  if (b.matches("[data-save]")) {
    e.preventDefault();
    toggleFavorite(b.dataset.save);
  }
  if (b.matches(".contact-toggle")) contact();
  if (b.matches(".search-toggle")) showSearch();
  if (b.matches(".menu-toggle")) {
    const open = $("#mobile-menu").hidden;
    $("#mobile-menu").hidden = !open;
    $("#mobile-menu").style.top =
      $(".header").getBoundingClientRect().bottom + "px";
    document.body.classList.toggle("menu-open", open);
    b.setAttribute("aria-expanded", open);
    b.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }
  if (b.matches(".dialog-close, [data-close-dialog]")) closeDialog();
  if (b.matches("[data-app-product]")) openApp({ productId: b.dataset.appProduct });
  if (b.matches("[data-app-selection]")) openApp({ selectionIds: b.dataset.appSelection.split(",") });
  if (b.matches("[data-copy-link]")) copyLink(b.dataset.copyLink);
  if (b.matches("[data-launch-app]")) {
    const help = $("#app-handoff-help");
    if (help) help.textContent = "Если приложение не открылось, установите или обновите Salini через TestFlight, затем попробуйте снова. Можно продолжить выбор на сайте.";
  }
  if (b.closest("#mobile-menu") && b.tagName === "A") closeMenu();
  if (b.matches(".hero-next")) setSlide(1);
  if (b.matches(".hero-prev")) setSlide(-1);
  if (b.matches("[data-material]")) {
    const m = materials[b.dataset.material];
    $$("[data-material]").forEach((t) => {
      t.setAttribute("aria-selected", t === b);
      t.tabIndex = t === b ? 0 : -1;
    });
    $("#material-panel").innerHTML = `<h3>${m.title}</h3><p>${m.text}</p>`;
    $("#material-panel").setAttribute("aria-labelledby", b.id);
  }
  if (b.matches("#export-selection")) exportSelection();
  if (b.matches("#share-selection")) shareSelection();
  if (b.matches("#open-app-selection")) openAppSelection();
  if (b.dataset.collection)
    location.hash =
      "/catalog?collection=" + encodeURIComponent(b.dataset.collection);
  if (b.dataset.dialog === "privacy")
    openDialog(
      '<span class="eyebrow">Просто и прозрачно</span><h2 id="dialog-title">Ваши данные</h2><p>Избранные изделия сохраняются только в хранилище этого браузера. Этот сайт не отправляет заявки, не использует рекламные трекеры и не запрашивает ваши персональные данные.</p><p>Кнопки связи открывают телефон, почтовую программу или официальный сайт Salini. При переходе на внешние сайты действуют их условия обработки данных.</p><p>Скопированная ссылка на подборку содержит только идентификаторы выбранных изделий. Экспорт создаёт файл на вашем устройстве.</p>',
    );
  if (b.matches(".back-top")) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (b.closest(".dialog-results") && b.tagName === "A") closeDialog();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
  if (
    e.target.matches("[role=tab]") &&
    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
  ) {
    e.preventDefault();
    const tabs = $$("[data-material]"),
      i = tabs.indexOf(e.target),
      n =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? tabs.length - 1
            : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) %
              tabs.length;
    tabs[n].click();
    tabs[n].focus();
  }
});
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      closeDialog();
  }
});
dialog.addEventListener("close", () => {
  const video = $("video", dialog);
  if (video) video.pause();
});
window.addEventListener("hashchange", route);
window.addEventListener("resize", () => {
  if (innerWidth > 760) closeMenu();
});
async function init() {
  try {
    const response = await fetch("catalog.json");
    if (!response.ok) throw Error("Catalog");
    data = await response.json();
    favoriteIds = new Set(
      [...favoriteIds]
        .map((id) => data.legacyIds?.[id] || id)
        .filter((id) => data.products.some((p) => p.id === id)),
    );
    route();
  } catch (error) {
    renderHome();
    notify("Каталог временно не загрузился. Обновите страницу.");
  }
  syncFavorites();
}
init();
