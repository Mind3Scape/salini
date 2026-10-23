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
  if (currentRoute().path === "/favorites") {
    const index = $$('[data-save]', main).findIndex(b => b.dataset.save === id);
    renderFavorites();
    const buttons = $$('[data-save]', main);
    (buttons[Math.min(index, buttons.length - 1)] || $('h1', main))?.focus();
  }
}
function closeMenu(restoreFocus = false) {
  const wasOpen = !$("#mobile-menu").hidden;
  document.body.classList.remove("menu-open");
  $("#mobile-menu").hidden = true;
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  $(".menu-toggle").setAttribute("aria-label", "Открыть меню");
  [main, $('footer'), $('.topline')].filter(Boolean).forEach(el => el.inert = false);
  if (restoreFocus && wasOpen) $('.menu-toggle').focus();
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
    `<span class="eyebrow">Рады познакомиться</span><h2 id="dialog-title">Поможем<br><em>с выбором.</em></h2><p>Коллекции, материалы и ближайший салон — свяжитесь с командой Salini.</p><div class="contact-options"><a href="tel:+74952493349"><span>+7 (495) 249-33-49<small>Позвонить в Salini</small></span><span>↗︎</span></a><a href="mailto:info@salini-srl.com"><span>info@salini-srl.com<small>Написать о вашем проекте</small></span><span>↗︎</span></a><a href="#/dealers"><span>Найти салон<small>Салоны и экспозиции Salini</small></span><span>↗︎</span></a><a href="mailto:design@salini-srl.com"><span>Для дизайнеров и архитекторов<small>design@salini-srl.com</small></span><span>↗︎</span></a></div>`,
  );
}
async function showSearch() {
  openDialog(
    `<span class="eyebrow">Найдите свою форму</span><h2 id="dialog-title">Поиск</h2><label class="sr-only" for="global-search">Изделие, коллекция, статья или помощь</label><input id="global-search" class="dialog-search" placeholder="Например, Paola, уход или Москва" autocomplete="off"><div class="dialog-results" aria-live="polite"></div>`,
  );
  const field = $("#global-search");
  let ready = false;
  field.addEventListener("input", () => { if (ready) searchResults(field.value); });
  $('.dialog-results').textContent = 'Загружаем поиск по сайту…';
  field.focus();
  const loaded = await Promise.allSettled([ensureCatalog(), window.SaliniEditorial.load(), window.SaliniSupport.load()]);
  ready = true;
  if (!field.isConnected) return;
  searchResults(field.value);
  if (loaded.some(r => r.status === 'rejected')) $('.dialog-results').insertAdjacentHTML('afterbegin', '<p class="small-note">Часть разделов временно недоступна для поиска. Попробуйте обновить страницу.</p>');
}
function matches(p, q, mode = "match") {
  const fold = value => String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("ru").replace(/ё/g, "е").replace(/\s+/g, " ").trim();
  const skuKey = value => fold(value).replace(/[\s_‐‑–—-]/g, "").toUpperCase().replace(/[АВЕКМНОРСТУХ]/g, c => ({А:"A",В:"B",Е:"E",К:"K",М:"M",Н:"H",О:"O",Р:"P",С:"C",Т:"T",У:"Y",Х:"X"})[c]);
  const keyboard = {й:"q",ц:"w",у:"e",к:"r",е:"t",н:"y",г:"u",ш:"i",щ:"o",з:"p",ф:"a",ы:"s",в:"d",а:"f",п:"g",р:"h",о:"j",л:"k",д:"l",я:"z",ч:"x",с:"c",м:"v",и:"b",т:"n",ь:"m"};
  const query = fold(q), keys = [skuKey(query)];
  if (/\d/.test(query) && /^[\p{L}\d\s_-]+$/u.test(query)) keys.push(skuKey(query.replace(/[а-я]/g, c => keyboard[c] || c)));
  const exact = query ? (p.variants || []).flatMap(variant => [variant.sku, variant.customColourSku, ...(variant.colours || []).map(c => c.sku)].filter(Boolean).map(sku => ({variant,sku}))).concat((p.liveReferences || []).flatMap(reference => reference.variants.flatMap(variant => [variant.sku,variant.customColourSku].filter(Boolean).map(sku=>({variant,sku,reference}))))).find(x => keys.includes(skuKey(x.sku))) : null;
  if (mode === "variant") return exact || null;
  const name = fold(p.name + " " + (p.sourceName || "") + " " + (p.collection || ""));
  const text = fold([name,p.category,p.subcategory,p.subtitle,p.type,p.description,p.sourceUrl,...(p.collections || []),...(p.materials || []),...(p.variants || []).flatMap(v => [v.sku,v.customColourSku,...(v.colours || []).map(c=>c.sku)])].join(" "));
  if (mode === "rank") return exact ? 0 : [p.name,p.sourceName,p.collection].some(n => fold(n) === query) ? 1 : name.startsWith(query) ? 2 : 3;
  return Boolean(exact) || query.split(" ").filter(Boolean).every(word => text.includes(word));
}
function searchResults(q) {
  const results = data.products.filter(p => matches(p,q)).sort((a,b) => matches(a,q,"rank") - matches(b,q,"rank"));
  const items = results.slice(0,8);
  const link = p => {const matched=matches(p,q,"variant"); return matched?.reference?matched.reference.sourceUrl:productUrl(p)+(matched?"?"+new URLSearchParams({variant:matched.variant.id,sku:matched.sku}):"");};
  const rank = item => item.title.toLocaleLowerCase('ru').includes(q.trim().toLocaleLowerCase('ru')) ? 0 : 1;
  const stories = (window.SaliniEditorial?.search(q) || []).sort((a,b)=>rank(a)-rank(b));
  const help = (window.SaliniSupport?.search(q) || []).sort((a,b)=>rank(a)-rank(b));
  const extra = [...stories.slice(0,help.length?4:8),...help.slice(0,stories.length?4:8)].filter((item,index,all)=>all.findIndex(x=>x.href===item.href)===index);
  $(".dialog-results").innerHTML = (items.length
    ? items.map(p => {const matched=matches(p,q,"variant"); return `<a class="search-result" href="${esc(link(p))}" ${matched?.reference?'target="_blank" rel="noopener"':""}>${p.image?`<img src="${p.image.src}" alt="" width="65" height="50">`:""}<span><strong>${esc(p.name)}</strong><small>${matched?"Артикул "+esc(matched.sku)+" · ":""}${esc([p.subtitle,p.collection].filter(Boolean).join(" · "))}${matched?.reference?" · исполнение на официальном сайте ↗︎":p.nativeAvailable===false?" · новинка сайта":""}</small></span></a>`;}).join("") + `<a class="line-link" href="#/catalog${q?"?q="+encodeURIComponent(q):""}">Все результаты: ${results.length} <span aria-hidden="true">→</span></a>`
    : (extra.length ? '' : '<p>Ничего не найдено. Попробуйте название коллекции, тип изделия или артикул.</p>')) + (extra.length?`<div class="site-search-extra"><h3>Истории, помощь и салоны</h3>${extra.map(item=>`<a class="search-result" href="${esc(item.href)}"><span><strong>${esc(item.title)}</strong><small>${esc(item.excerpt)}</small></span></a>`).join("")}</div>`:'');
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
  window.SaliniHome?.mount(main);
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
  $(".hero-copy .button", hero).href = `#/collection/${slide.href.toLowerCase()}`;
  hero.setAttribute("aria-label", "Коллекция " + slide.name);
}
function renderCatalog(params = new URLSearchParams()) {
  const requestedCategory = params.get("category") || "all";
  let sourceScope = params.get("source") || "";
  sourceScope = /^\/(?!\/)[^?#\\]*$/.test(sourceScope) ? sourceScope.replace(/\/?$/, "/") : "";
  const category = Object.hasOwn(categories,requestedCategory)?requestedCategory:"all", collection = params.get("collection") || "", query = params.get("q") || "";
  const options = (values, selected = "") => [...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ru")).map(value=>`<option value="${esc(value)}" ${value===selected?"selected":""}>${esc(value)}</option>`).join("");
  main.innerHTML = pageHeading(collection || (sourceScope?"Подборка по разделу Salini":"Каталог"), "Выберите форму, материал и размер. Сохраняйте идеи для вашего пространства и продолжайте выбор на iPhone.") +
    `<section class="catalog-tools" aria-label="Фильтры каталога">${sourceScope?`<p class="small-note" id="catalog-source-note">Раздел официального каталога: ${esc(sourceScope)}</p>`:""}<div class="catalog-categories">${Object.entries(categories).map(([id,label])=>`<button class="filter-chip" data-category="${id}" aria-pressed="${id===category}">${label}</button>`).join("")}</div><div class="filter-row"><label class="field filter-search">Поиск<input id="catalog-search" type="search" placeholder="Название, коллекция, артикул" value="${esc(query)}"></label><label class="field">Коллекция<select id="collection-filter"><option value="">Все коллекции</option>${options(data.products.flatMap(p=>[p.collection,...(p.collections || [])]),collection)}</select></label><label class="field">Материал<select id="material-filter"><option value="">Все материалы</option>${options(data.products.flatMap(p=>p.materials),params.get("material"))}</select></label><label class="field">Порядок<select id="sort-filter"><option value="curated">Выбор Salini</option><option value="name" ${params.get("sort")==="name"?"selected":""}>По названию</option></select></label></div><div class="filter-row"><label class="field">Тип и установка<select id="subcategory-filter"><option value="">Все типы</option></select></label><label class="field">Длина от, мм<input id="length-from" type="number" inputmode="numeric" min="0" step="1" placeholder="Любая" value="${esc(params.get("lengthFrom") || "")}" aria-describedby="length-filter-note"></label><label class="field">Длина до, мм<input id="length-to" type="number" inputmode="numeric" min="0" step="1" placeholder="Любая" value="${esc(params.get("lengthTo") || "")}" aria-describedby="length-filter-note"></label><button class="line-link" id="catalog-reset">Сбросить фильтры <span aria-hidden="true">↺</span></button></div><p class="small-note" id="length-filter-note">Для регулируемых размеров учитывается пересечение диапазонов. Изделия без указанной длины не участвуют в фильтре по длине.</p><label class="options-check"><input type="checkbox" id="include-options" ${params.get("options")==="1"?"checked":""}> Показывать опции и доработки изделий</label><div class="results-count" role="status" aria-live="polite"></div></section><section class="catalog-grid wrap" aria-label="Изделия"></section><div class="catalog-end"><p>${data.canonicalProductCount || 305} изделий из каталога приложения от ${String(data.snapshotDate).split("-").reverse().join(".")}${data.liveReferenceCount?`; ${data.liveReferenceCount} актуальные страницы отдельных исполнений связаны с существующими моделями`:""}. Дата источника указана в каждой карточке. Цены и наличие уточняются в Salini.</p><a class="line-link" href="#/documents">Документы и 3D-модели <span aria-hidden="true">↗︎</span></a></div>`;
  let selectedCategory = Object.hasOwn(categories,category)?category:"all";
  let shown = Math.min(data.products.length,Math.max(36,Number.parseInt(params.get("shown") || "36",10)||36));
  const subcategory = $("#subcategory-filter"), grid=$(".catalog-grid");
  function updateTypes(selected = subcategory.value) {
    const values=data.products.filter(p=>selectedCategory==="all"||p.categoryId===selectedCategory).map(p=>p.subcategory || p.type).filter(Boolean);
    subcategory.innerHTML='<option value="">Все типы</option>'+options(values,selected);
  }
  updateTypes(params.get("subcategory") || "");
  function lengthRange(p) {
    const value=p.dimensions?.length;
    if(typeof value==="number" && Number.isFinite(value))return [value,value];
    if(value && typeof value==="object" && Number.isFinite(value.min) && Number.isFinite(value.max))return [value.min,value.max];
    return null;
  }
  function numeric(field) {return field.value.trim()===""?null:Number(field.value);}
  function filter(reset = true) {
    if(reset)shown=36;
    const q=$("#catalog-search").value, c=$("#collection-filter").value, sort=$("#sort-filter").value, material=$("#material-filter").value, type=subcategory.value, includeOptions=$("#include-options").checked;
    const from=numeric($("#length-from")), to=numeric($("#length-to"));
    const invalid=(from!==null&&(!Number.isFinite(from)||from<0))||(to!==null&&(!Number.isFinite(to)||to<0))||(from!==null&&to!==null&&from>to);
    $("#length-from").setAttribute("aria-invalid",Boolean(invalid));$("#length-to").setAttribute("aria-invalid",Boolean(invalid));
    let products=invalid?[]:data.products.filter(p=>{
      const dimensions=lengthRange(p);
      return (!sourceScope||new URL(p.sourceUrl).pathname.startsWith(sourceScope))&&(includeOptions||!p.isOption)&&(!material||p.materials.includes(material))&&(selectedCategory==="all"||p.categoryId===selectedCategory)&&(!c||p.collection===c||p.collections?.includes(c))&&(!type||(p.subcategory||p.type)===type)&&matches(p,q)&&((from===null&&to===null)||(dimensions&&dimensions[1]>=(from??-Infinity)&&dimensions[0]<=(to??Infinity)));
    });
    if(sort==="name")products.sort((a,b)=>a.name.localeCompare(b.name,"ru"));
    else if(q.trim())products.sort((a,b)=>matches(a,q,"rank")-matches(b,q,"rank"));
    const next=new URLSearchParams();
    if(sourceScope)next.set("source",sourceScope);
    if(selectedCategory!=="all")next.set("category",selectedCategory);if(c)next.set("collection",c);if(q)next.set("q",q);if(material)next.set("material",material);if(type)next.set("subcategory",type);if(sort!=="curated")next.set("sort",sort);if(includeOptions)next.set("options","1");if(from!==null)next.set("lengthFrom",String(from));if(to!==null)next.set("lengthTo",String(to));
    const rememberURL=()=>{if(shown>36)next.set("shown",String(shown));else next.delete("shown");history.replaceState(null,"",routeURL(`/catalog${next.size?"?"+next:""}`));};
    const paint=()=>{
      grid.innerHTML=products.length?products.slice(0,shown).map(p=>{
        const matched=matches(p,q,"variant");
        return matched?.reference?card(p).replace(`href="${productUrl(p)}"`,`href="${esc(matched.reference.sourceUrl)}" target="_blank" rel="noopener"`).replace("</h2>","</h2><p>Исполнение на официальном сайте ↗︎</p>"):matched?card(p).replace(`href="${productUrl(p)}"`,`href="${esc(productUrl(p)+"?"+new URLSearchParams({variant:matched.variant.id,sku:matched.sku}))}"`):card(p);
      }).join("")+(products.length>shown?'<button class="button load-more">Показать ещё <span aria-hidden="true">↓</span></button>':""):`<div class="empty-state"><h2>${invalid?"Проверьте диапазон длины":"Пока ничего не найдено"}</h2><p>${invalid?'Значение «от» должно быть не больше значения «до». Используйте неотрицательные размеры в миллиметрах.':"Попробуйте другую коллекцию или сбросьте фильтры."}</p><a class="button" href="#/catalog">Все изделия <span aria-hidden="true">↗︎</span></a></div>`;
      $(".load-more")?.addEventListener("click",()=>{const previous=shown;shown+=36;paint();rememberURL();grid.querySelectorAll(".product-card-link")[previous]?.focus({preventScroll:true});});
      syncFavorites();
    };
    paint();rememberURL();
    $(".results-count").textContent=invalid?"Неверный диапазон длины":`Найдено ${products.length}${q.trim()&&products.some(p=>matches(p,q,"variant"))?" · точное совпадение артикула первым":""}`;
    $(".page-heading h1").textContent=c||(sourceScope?"Подборка по разделу Salini":selectedCategory==="all"?"Каталог":categories[selectedCategory]);
  }
  $$('[data-category]',main).forEach(b=>b.addEventListener("click",()=>{selectedCategory=b.dataset.category;$$('[data-category]',main).forEach(c=>c.setAttribute("aria-pressed",c===b));updateTypes();filter();}));
  ["catalog-search","length-from","length-to"].forEach(id=>$("#"+id).addEventListener("input",()=>filter()));
  ["collection-filter","sort-filter","material-filter","subcategory-filter","include-options"].forEach(id=>$("#"+id).addEventListener("change",()=>filter()));
  $("#catalog-reset").addEventListener("click",()=>{sourceScope="";$("#catalog-source-note")?.remove();selectedCategory="all";["catalog-search","length-from","length-to","collection-filter","material-filter"].forEach(id=>$("#"+id).value="");$("#sort-filter").value="curated";$("#include-options").checked=false;updateTypes("");$$('[data-category]',main).forEach(b=>b.setAttribute("aria-pressed",b.dataset.category==="all"));filter();});
  grid.addEventListener("click",event=>{if(event.target.closest(".product-card-link"))try{sessionStorage.setItem("salini-catalog-context",JSON.stringify({href:location.href,scrollY:window.scrollY,at:Date.now()}));}catch{}},{capture:true});
  filter(false);
  try {
    const saved=JSON.parse(sessionStorage.getItem("salini-catalog-context") || "null");
    if(saved?.href===location.href && Date.now()-saved.at<30*60*1000)requestAnimationFrame(()=>requestAnimationFrame(()=>{if(location.href===saved.href)window.scrollTo({top:saved.scrollY,behavior:"instant"});}));
  } catch {}
}
function renderProduct(id, params = new URLSearchParams()) {
  const p = data.products.find(p => p.id === (data.legacyIds?.[id] || id));
  if (!p) { renderNotFound(); return; }
  const requestedSku = params.get("sku"), requestedVariant = params.get("variant");
  const skuCandidate = requestedSku ? matches(p, requestedSku, "variant") : null;
  const skuMatch = skuCandidate?.reference ? null : skuCandidate;
  const exactVariant = requestedVariant ? p.variants.find(v => v.id === requestedVariant) : null;
  const selected = skuMatch?.variant || exactVariant || p.variants[0];
  let selectedSku = skuMatch?.sku || selected?.sku || p.article;
  let image = p.image;
  let back = "#/catalog";
  try { const saved = JSON.parse(sessionStorage.getItem("salini-catalog-context") || "null"); if (saved?.href && new URL(saved.href, siteBase).origin === siteBase.origin && new URL(saved.href, siteBase).pathname === routeURL("/catalog").pathname && Date.now()-saved.at<30*60*1000) back=saved.href; } catch {}
  const sourceDate = String(p.sourceDate || data.snapshotDate || "").slice(0,10).split("-").reverse().join(".");
  const specs = [["Размеры",p.dimensionsLabel],["Материалы",p.materials.join(" / ") || "См. спецификацию"],["Тип и установка",p.subcategory || p.type],["Глубина до перелива",Number.isFinite(p.depthToOverflow)?p.depthToOverflow+" мм":null]].filter(([,value])=>value);
  const gallery = p.gallery || (p.image?[p.image]:[]);
  const liveReferences = (p.liveReferences || []).map(ref=>{
    const note = ref.identity.relation === "same-base-product-new-source-id" ? "Актуальная страница этого изделия; артикул и размеры совпадают с каталогом приложения." : ref.identity.relation === "size-specific-page-of-existing-family" ? "Отдельное исполнение длиной 680 мм. В приложении открывается общая модель с диапазоном размеров." : "Связанное исполнение: артикулы на актуальной странице и в каталоге приложения различаются. Точное соответствие цвета уточняйте у Salini.";
    return `<section class="live-reference" aria-label="Актуальное исполнение"><h3>${esc(ref.name)}</h3><p class="small-note">Проверено ${esc(ref.sourceDate.split("-").reverse().join("."))}. ${esc(note)}</p><p>${esc(ref.dimensionsLabel)} · ${esc(ref.variants.map(v=>v.sku).filter(Boolean).join(" / "))}</p><details><summary class="line-link">Описание актуального исполнения</summary><p>${esc(ref.description)}</p>${ref.gallery.map(im=>`<img src="${esc(im.src)}" alt="${esc(ref.name)}" width="${im.width}" height="${im.height}" loading="lazy" style="width:100%;height:auto;border-radius:var(--radius-card)">`).join("")}</details><a class="button" href="${esc(ref.sourceUrl)}" target="_blank" rel="noopener">Открыть это исполнение <span aria-hidden="true">↗︎</span></a></section>`;
  }).join("");
  document.title = `${p.name} — Salini`;
  main.innerHTML = `<div class="page-heading wrap">${breadcrumb(p.name)}<a class="line-link" href="${esc(back)}">← К каталогу</a></div><section class="detail wrap"><div class="detail-photo">${productImage(p)}${image?'<button class="line-link" id="product-image-open">Рассмотреть фото <span aria-hidden="true">↗︎</span></button>':""}${gallery.length>1?`<div class="detail-actions" aria-label="Фотографии изделия">${gallery.map((item,i)=>`<button class="button" data-product-image="${i}" aria-pressed="${i===0}" aria-label="Фото ${i+1} из ${gallery.length}">Фото ${i+1}</button>`).join("")}</div>`:""}</div><div class="detail-info"><span class="eyebrow">${p.collection?"Коллекция "+esc(p.collection):esc(p.category)}${p.nativeAvailable===false?" · новинка сайта":""}</span><h1>${esc(p.name)}</h1><p>${esc(p.subtitle)}</p>${p.description?`<details class="product-description"><summary class="line-link">Об изделии</summary><p>${esc(p.bodyDescription?.text || p.description)}</p></details>`:""}<dl class="spec-list"><div><dt>Артикул выбранной версии</dt><dd id="product-sku">${esc(selectedSku || "См. спецификацию")}</dd></div>${specs.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl><div class="detail-actions"><button class="button button-dark" data-save="${esc(p.id)}" aria-pressed="false">В мою подборку <span aria-hidden="true">♡</span></button><a class="button" href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">Варианты и стоимость <span aria-hidden="true">↗︎</span></a></div>${p.nativeAvailable===false?'<p class="small-note">Это изделие пока доступно только в каталоге сайта. Его можно сохранить в веб-подборку и открыть по ссылке.</p><a class="line-link app-product-link" href="#/app">Приложение Salini для iPhone <span aria-hidden="true">↗︎</span></a>':`<button class="line-link app-product-link" data-app-product="${esc(p.id)}">Продолжить на iPhone <span aria-hidden="true">↗︎</span></button>`}<div class="variant-options"><label class="field">Исполнение<select id="product-variant">${p.variants.map((v,i)=>`<option value="${esc(v.id)}" ${v.id===selected?.id?"selected":""}>${esc(v.title || v.sku || "Вариант "+(i+1))}</option>`).join("")}</select></label><p id="variant-info" class="small-note" aria-live="polite"></p>${(requestedSku&&!skuMatch)||(requestedVariant&&!exactVariant)?'<p class="small-note">Исполнение из ссылки не найдено. Проверьте артикул или выберите доступный вариант ниже.</p>':""}</div><p class="detail-disclaimer">Размеры указаны для базового варианта. Отделка и материал могут менять характеристики. Точные параметры для заказа — в документах изделия и у команды Salini.</p><a class="line-link" href="#/dealers?product=${encodeURIComponent(p.id)}">Посмотреть в салоне <span aria-hidden="true">↗︎</span></a><p class="small-note">Участие изделия в экспозиции и наличие для покупки уточняйте у салона.</p>${liveReferences?`<div class="downloads"><h2>Актуальные исполнения</h2>${liveReferences}</div>`:""}<div class="downloads"><h2>Для вашего проекта</h2>${p.downloads.map(d=>`<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.label)} <span aria-hidden="true">↗︎</span></a>`).join("")}<a href="#/documents?product=${encodeURIComponent(p.id)}">Библиотека документов изделия <span aria-hidden="true">↗︎</span></a></div><p class="small-note">${p.sourceStatus==="current"?"Источник проверен":"Каталог по данным"} ${esc(sourceDate)}. <a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">Страница на официальном сайте</a></p><button class="line-link contact-toggle">Помочь с выбором <span aria-hidden="true">↗︎</span></button></div></section>`;
  syncFavorites();
  const variant = $("#product-variant");
  const update = (writeURL=false) => {
    const v = p.variants.find(v=>v.id===variant.value);
    if (writeURL) selectedSku=v?.sku || "";
    $("#variant-info").textContent=v?["Артикул: "+(selectedSku || "уточняется"),Number.isFinite(v.weightKg)&&v.weightKg>0?"Вес: "+v.weightKg+" кг":null].filter(Boolean).join(" · "):"Исполнение уточняется на официальном сайте";
    $("#product-sku").textContent=selectedSku || "См. спецификацию";
    if(writeURL && v) { const next=new URLSearchParams({variant:v.id});if(selectedSku)next.set("sku",selectedSku);history.replaceState(null,"",routeURL(productUrl(p)+"?"+next)); }
  };
  variant.addEventListener("change",()=>update(true)); update();
  $("#product-image-open")?.addEventListener("click",()=>openDialog(`<span class="eyebrow">Фото изделия</span><h2 id="dialog-title">${esc(p.name)}</h2><img src="${esc(image.src)}" alt="${esc(p.name)}" width="${image.width}" height="${image.height}" style="width:100%;height:auto;max-height:75vh;object-fit:contain;border-radius:var(--radius-card)">`,"product-image-dialog"));
  $$('[data-product-image]',main).forEach(button=>button.addEventListener("click",()=>{image=gallery[Number(button.dataset.productImage)];const img=$(".detail-photo > img");if(img){img.src=image.src;img.width=image.width;img.height=image.height;}$$('[data-product-image]',main).forEach(b=>b.setAttribute("aria-pressed",String(b===button)));}));
}
function renderCollections() {
  main.innerHTML =
    pageHeading(
      "Коллекции",
      "У каждой — свой характер. Найдите ту, которая отзывается именно вам.",
    ) +
    `<section class="collection-grid wrap section" style="padding-top:0">${data.collections.map((c, i) => `<a class="collection-card collection-small" href="#/catalog?collection=${encodeURIComponent(c.name)}"><div class="image-wrap"><img src="${c.image.src}" alt="Коллекция ${esc(c.name)}" loading="lazy" width="1450" height="816"><span class="image-label">0${i + 1} / Salini</span><span class="round-arrow">↗︎</span></div><div class="collection-description"><h3>${esc(c.name)}</h3><span>${collectionDescriptions[c.name] || ""}</span></div></a>`).join("")}</section>`;
}
function renderFavorites() {
  const selected = data.products.filter((p) => favoriteIds.has(p.id));
  main.innerHTML =
    pageHeading(
      "Моя подборка",
      "Ваше личное пространство начинается с деталей. Сохранённые изделия доступны в этом браузере.",
      selected.length
        ? '<div class="favorites-actions"><button class="button button-dark" id="export-selection">Скачать подборку <span>↓</span></button><button class="button" id="share-selection">Поделиться ссылкой <span>↗︎</span></button><button class="button" id="open-app-selection">На iPhone <span aria-hidden="true">↗︎</span></button></div>'
        : "",
    ) +
    `<section class="catalog-grid wrap">${selected.length ? selected.map(card).join("") : '<div class="empty-state"><h2>Здесь будет ваша история</h2><p>Нажимайте на сердечко у понравившихся изделий.<br>Они появятся в этой подборке.</p><a class="button button-dark" href="#/catalog">Исследовать каталог <span>↗︎</span></a></div>'}</section>`;
  syncFavorites();
}
function exportSelection() {
  const selected = data.products.filter((p) => favoriteIds.has(p.id));
  const html = `<!doctype html><html lang="ru"><meta charset="utf-8"><title>Моя подборка Salini</title><style>body{font:15px/1.7 Arial,sans-serif;max-width:850px;margin:60px auto;padding:20px;color:#2b3229}h1{font:42px Georgia}article{border-top:1px solid #ddd;padding:25px 0}h2{font:30px Georgia;margin:0}a{color:#53614d}small{color:#666}@media print{article{break-inside:avoid}}</style><h1>Salini · Моя подборка</h1><p>Коллекция идей для вашего пространства.</p>${selected.map((p) => `<article><h2>${esc(p.name)}</h2><p>${esc(p.subtitle)} · ${esc(p.dimensionsLabel)}<br>${esc(p.materials.join(", "))}<br>Артикул: ${esc(p.article)}</p><a href="${esc(p.sourceUrl)}">Открыть изделие и актуальные варианты ↗︎</a></article>`).join("")}<small>Подборка составлена на основе данных каталога от 06.10.2026. Параметры необходимо уточнить перед заказом. Документ можно сохранить в PDF через печать браузера.</small></html>`;
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
        ? `<div class="favorites-actions"><button class="button button-dark" data-app-selection="${esc(products.map((p) => p.id).join(","))}">Продолжить на iPhone <span aria-hidden="true">↗︎</span></button></div>`
        : "",
    ) +
    `<section class="catalog-grid wrap">${products.length ? products.map(card).join("") : '<div class="empty-state"><h2>В этой подборке нет изделий</h2><a href="#/catalog" class="line-link">Открыть каталог ↗︎</a></div>'}</section>`;
  syncFavorites();
}
function renderMaterials() {
  main.innerHTML =
    pageHeading(
      "Ощущение материала",
      "Свет, фактура, цвет. Три способа увидеть привычную форму по-новому.",
    ) +
    `<div class="editorial-page wrap"><img class="editorial-hero" src="assets/paola-detail.webp" alt="Тонкая линия и цвет раковины Paola" width="2000" height="1126"><section class="editorial-row"><div><span class="eyebrow">01 / Матовый характер</span><h2>S-Stone.<br><em>Прикосновение к тишине.</em></h2><p>Однородный композитный материал на основе природных минералов, связующих смол и пигментов. Его бархатистая матовая поверхность мягко рассеивает свет.</p><p>Форма читается спокойно и цельно. Такой материал особенно выразителен там, где важны тактильность и чистота силуэта.</p><a href="#/catalog" class="line-link">Найти свою форму <span>↗︎</span></a></div><img src="assets/greca.webp" alt="Матовая ванна Greca" width="1450" height="816" loading="lazy"></section><section class="editorial-row"><img src="assets/aria.webp" alt="Ванна Aria и отражения света" width="1920" height="1080" loading="lazy"><div><span class="eyebrow">02 / Отражение света</span><h2>S-Sense.<br><em>Выразительность бликов.</em></h2><p>Материал на основе очищенной мраморной муки и связующих смол с защитным гелькоутом. Глянцевая поверхность отражает свет и подчёркивает изгибы.</p><p>Выбор покрытия и цвета зависит от модели. Сравнить варианты и подобрать образец поможет команда Salini.</p><button class="line-link contact-toggle">Обсудить материалы <span>↗︎</span></button></div></section><section class="editorial-row"><div><span class="eyebrow">03 / Свет сквозь форму</span><h2>S-Shine.<br><em>Новая лёгкость.</em></h2><p>Полупрозрачный материал раскрывает особый характер Ninfea: свет проходит сквозь изделие, а широкие края напоминают листья кувшинки.</p><a href="#/catalog?collection=Ninfea" class="line-link">Открыть Ninfea <span>↗︎</span></a></div><img src="assets/ninfea.webp" alt="Коллекция Ninfea" width="2400" height="1351" loading="lazy"></section><p class="small-note">Фотографии иллюстрируют коллекции. Для выбора точного оттенка, материала и покрытия необходим физический образец и спецификация изделия.</p></div>`;
}
function renderAbout() {
  main.innerHTML =
    pageHeading(
      "L’anima dell’acqua.",
      "Душа воды. Итальянская эстетика, воплощённая в предметах для самого личного пространства.",
    ) +
    `<div class="editorial-page wrap"><img class="editorial-hero" src="assets/opera.webp" alt="Коллекция Opera в интерьере с морским пейзажем" width="1450" height="816"><section class="editorial-row"><div><span class="eyebrow">Философия бренда</span><h2>Красота,<br><em>которую чувствуешь.</em></h2><p>Salini — бренд сантехники и мебели для ванных комнат, основанный в Италии. В центре его коллекций — выразительная форма, минеральные материалы и внимание к деталям.</p><p>Мы собрали пространство, в котором удобно знакомиться с коллекциями, изучать материалы и выбирать изделия для своего проекта.</p><a href="#/collections" class="line-link">Познакомиться с коллекциями <span>↗︎</span></a></div><img src="assets/interior.webp" alt="Детали интерьера Salini" loading="lazy" width="1450" height="1813"></section><section class="editorial-row"><img src="assets/production.webp" alt="Производство Salini" loading="lazy" width="1450" height="816"><div><span class="eyebrow">От замысла к предмету</span><h2>Характер в каждой<br><em>детали.</em></h2><p>Собственное производство и работа с литьевыми материалами позволяют Salini исследовать форму: от сдержанной геометрии Aria до пластики Ninfea и архитектурного ритма Greca.</p><a href="https://salini-srl.com/about-company/" class="line-link" target="_blank" rel="noopener">История и производство Salini <span>↗︎</span></a></div></section></div>`;
}
function renderProfessionals() {
  main.innerHTML =
    pageHeading(
      "Создавайте с Salini.",
      "Инструменты, которые помогают пройти путь от идеи до спецификации.",
    ) +
    `<div class="editorial-page wrap"><section class="editorial-row" style="margin-top:0"><img src="assets/greca.webp" alt="Архитектурное пространство с ванной Greca" width="1450" height="816"><div><span class="eyebrow">Дизайнерам и архитекторам</span><h2>Больше пространства<br><em>для вашей идеи.</em></h2><p>Подбирайте коллекции под характер интерьера. Сохраняйте изделия в личную подборку, скачивайте техническую документацию и открывайте 3D-модели из карточек каталога.</p><a href="mailto:design@salini-srl.com" class="line-link">design@salini-srl.com <span>↗︎</span></a></div></section><div class="resource-list"><a href="#/catalog"><span><strong>01 / Каталог и документация</strong><small>Размеры, паспорта изделий и доступные 3D-модели</small></span><span>↗︎</span></a><a href="#/favorites"><span><strong>02 / Подборка вашего проекта</strong><small>Сохраните изделия и скачайте единый документ</small></span><span>↗︎</span></a><a href="https://mind3scape.github.io/solini-render-studio/" target="_blank" rel="noopener"><span><strong>03 / Salini Render Studio</strong><small>Визуализация предметов · для обработки требуется приглашение владельца</small></span><span>↗︎</span></a><a href="https://salini-srl.com/profile/" target="_blank" rel="noopener"><span><strong>04 / Кабинет дизайнера</strong><small>Профессиональные возможности на официальном сайте Salini</small></span><span>↗︎</span></a></div></div>`;
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
    ${mobile ? `<div class="app-handoff-actions">${appUrl ? `<a class="button button-dark" href="${appUrl}" data-launch-app>Открыть Salini <span aria-hidden="true">↗︎</span></a>` : ""}<a class="button ${appUrl ? "" : "button-dark"}" href="${TESTFLIGHT_URL}" target="_blank" rel="noopener">${appUrl ? "Установить или обновить" : "Установить через TestFlight"} <span aria-hidden="true">↗︎</span></a></div><p class="app-handoff-help" id="app-handoff-help" role="status">Если Salini ещё не установлен, откройте TestFlight. После установки вернитесь сюда${appUrl ? " и нажмите «Открыть Salini»" : ""}.</p>`
      : `<div class="app-device-note"><span aria-hidden="true">↗︎</span><p>Откройте эту страницу на iPhone. Ссылка сохранит ${product ? "выбранное изделие" : ids.length ? "вашу подборку" : "доступ к приложению"}.</p></div><div class="app-handoff-actions"><button class="button button-dark" data-copy-link="${esc(webUrl)}">Скопировать ссылку для iPhone <span aria-hidden="true">↗︎</span></button><a class="button" href="${TESTFLIGHT_URL}" target="_blank" rel="noopener">Salini в TestFlight <span aria-hidden="true">↗︎</span></a></div>`}
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
  ) + `<section class="app-intro wrap"><div class="app-intro-image"><img src="assets/greca.webp" alt="Коллекция Greca от Salini" width="1450" height="816"></div><div class="app-intro-copy"><span class="eyebrow">Приложение для iPhone</span><h2>Те же формы.<br><em>Ближе к вам.</em></h2><p>Открывайте изделия с сайта в Salini и переносите свою подборку в избранное. Она останется под рукой, когда вы вернётесь к проекту.</p><a class="button button-dark" href="${TESTFLIGHT_URL}" target="_blank" rel="noopener">Открыть TestFlight <span aria-hidden="true">↗︎</span></a><ol class="app-steps"><li><strong>Установите Salini</strong><span>Откройте приглашение в TestFlight на iPhone. Если приложение уже есть, нажмите «Обновить».</span></li><li><strong>Выберите на сайте</strong><span>Откройте изделие или соберите подборку. Нажмите «Продолжить на iPhone».</span></li><li><strong>Продолжайте в приложении</strong><span>Изделие откроется в каталоге, а подборка добавится в избранное.</span></li></ol><p class="small-note">Избранное сайта хранится в этом браузере. Перенос в приложение выполняется по вашему нажатию; автоматической синхронизации пока нет.</p><a class="line-link" href="#/catalog">Перейти к коллекциям и изделиям <span aria-hidden="true">→</span></a></div></section>`;
}
function renderNotFound() {
  main.innerHTML =
    pageHeading(
      "Эта страница не найдена",
      "Вернёмся туда, где начинается вдохновение.",
    ) +
    '<div class="wrap section"><a class="button button-dark" href="#/">На главную ↗︎</a></div>';
}
const siteBase = new URL(document.baseURI);
$("base")?.setAttribute("href", siteBase.href);
const canonicalPath = path => ({'/showrooms':'/dealers','/where-buy':'/dealers','/faq':'/help','/dostavka-i-oplata':'/delivery','/about-company':'/about','/e_learning':'/academy','/blog':'/journal','/gallery':'/projects'}[path] || path);
function routeURL(value) {
  const [rawPath, query = ""] = value.replace(/^#/, "").split("?");
  const path = canonicalPath(rawPath);
  return new URL(path.replace(/^\//, "").replace(/\/?$/, path === "/" ? "" : "/") + (query ? "?" + query : ""), siteBase);
}
function currentRoute() {
  const value = location.hash.startsWith("#/") ? location.hash.slice(1) : "/" + location.pathname.slice(siteBase.pathname.length).replace(/^\/|\/$/g, "") + location.search;
  const [raw, query = ""] = value.split("?");
  return {path:canonicalPath(raw.replace(/\/$/, "") || "/"), params:new URLSearchParams(query)};
}
let catalogRequest, routeSerial = 0;
async function ensureCatalog() {
  if (!catalogRequest) catalogRequest = fetch(new URL("catalog.json", siteBase), {cache:"no-cache"})
    .then(r => { if (!r.ok) throw Error("Catalog unavailable"); return r.json(); })
    .then(value => {
      data = value;
      favoriteIds = new Set([...favoriteIds].map(id => data.legacyIds?.[id] || id).filter(id => data.products.some(p => p.id === id)));
      syncFavorites();
      return data;
    }).catch(error => {catalogRequest = null; throw error;});
  return catalogRequest;
}
function decorateLinks(root = main) {
  $$('a[href^="#/"]',root).forEach(a => {a.href = routeURL(a.getAttribute('href'));});
}
async function route() {
  const serial = ++routeSerial, {path,params} = currentRoute();
  const initialStatic = main.dataset.renderedPath === undefined && document.documentElement.dataset.route === path;
  closeMenu();
  if (dialog.open) closeDialog();
  window.SaliniHome?.dispose();
  main.setAttribute('aria-busy','true');
  try {
    const needsCatalog = ['/catalog','/favorites','/selection','/documents'].includes(path) || path.startsWith('/product/') || (path === '/dealers' && params.has('product'));
    if (needsCatalog) await ensureCatalog();
    if (window.SaliniSupport.handles(path)) await window.SaliniSupport.load();
    if (window.SaliniEditorial.handles(path)) await window.SaliniEditorial.load();
    if (path === '/catalog') {
      const editorial = await window.SaliniEditorial.load().catch(() => null);
      editorial?.collections.forEach(c => c.productIds.forEach(id => {
        const product = data.products.find(p => p.id === String(id));
        if (product) product.collections = [...new Set([...(product.collections || []), c.id.charAt(0).toUpperCase() + c.id.slice(1)])];
      }));
    }
    if (serial !== routeSerial) return;
    if (path === '/') renderHome();
    else if (path === '/catalog') renderCatalog(params);
    else if (path.startsWith('/product/')) renderProduct(decodeURIComponent(path.slice(9)), params);
    else if (path === '/favorites') renderFavorites();
    else if (path === '/selection') renderShared(params);
    else if (path === '/materials') renderMaterials();
    else if (path === '/app') renderApp();
    else if (window.SaliniEditorial.handles(path)) main.innerHTML = window.SaliniEditorial.render(path,params,{products:data.products});
    else if (window.SaliniSupport.handles(path)) main.innerHTML = window.SaliniSupport.render(path,params,{products:data.products});
    else if (window.SaliniResources.handles(path)) main.innerHTML = window.SaliniResources.render(path,params,{products:data.products});
    else renderNotFound();
    main.dataset.renderedPath = path;
    document.title = path === '/' ? 'Salini — L’anima dell’acqua' : (($('h1',main)?.innerText.replace(/\s+/g,' ') || 'Salini') + ' — Salini');
    const canonical = new URL(path === '/' ? '' : path.slice(1) + '/',PUBLIC_SITE_URL).href;
    $('link[rel="canonical"]')?.setAttribute('href',canonical);
    $('meta[property="og:url"]')?.setAttribute('content',canonical);
    $('meta[property="og:title"]')?.setAttribute('content',document.title);
    $('meta[name="robots"]')?.setAttribute('content', ['/favorites','/selection'].includes(path)?'noindex,follow':'index,follow');
    decorateLinks();
    $$('.desktop-nav a').forEach(a => {
      if (a.pathname.replace(/\/$/,'') === routeURL(path).pathname.replace(/\/$/,'')) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
    syncFavorites();
    window.scrollTo({top:0,behavior:'instant'});
    main.focus({preventScroll:true});
    if (path === '/materials' && ['stone','sense','shine'].includes(params.get('material'))) $$('.editorial-row',main)[['stone','sense','shine'].indexOf(params.get('material'))]?.scrollIntoView({block:'start'});
    if (window.SaliniEditorial.handles(path)) window.SaliniEditorial.mount(main,path,params,{products:data.products});
    if (window.SaliniSupport.handles(path)) window.SaliniSupport.mount(main,path,params,{products:data.products});
    if (window.SaliniResources.handles(path)) window.SaliniResources.mount(main,path,params,{products:data.products});
  } catch (error) {
    if (serial !== routeSerial) return;
    if (initialStatic) notify('Интерактивные функции временно недоступны. Содержание страницы сохранено.');
    else main.innerHTML = pageHeading('Не удалось загрузить раздел','Проверьте соединение и попробуйте ещё раз.') + '<div class="wrap section"><button class="button button-dark" data-retry-route>Повторить загрузку</button><a class="line-link" href="' + routeURL('/') + '">На главную ↗︎</a></div>';
    console.error('Salini route:',error);
  } finally {
    if (serial === routeSerial) main.removeAttribute('aria-busy');
  }
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button,a");
  if (!b) return;
  if (b.matches('.skip')) {e.preventDefault(); main.focus(); main.scrollIntoView({block:'start'}); return;}
  if (b.matches("[data-retry-route]")) route();
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
    [main, $('footer'), $('.topline')].filter(Boolean).forEach(el => el.inert = open);
    if (open) $('#mobile-menu a')?.focus();
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
  if (b.tagName === 'A' && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !b.target && !b.hasAttribute('download')) {
    const raw = b.getAttribute('href') || '';
    const url = raw.startsWith('#/') ? routeURL(raw) : new URL(b.href);
    if ((raw.startsWith('#/') || !url.hash) && url.origin === siteBase.origin && url.pathname.startsWith(siteBase.pathname) && !/\.[a-z0-9]+$/i.test(url.pathname)) {
      e.preventDefault();
      history.pushState(null,'',url);
      route();
    }
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu(true);
  if (e.key === 'Tab' && !$('#mobile-menu').hidden && !dialog.open) {
    const links = [$('.menu-toggle'), ...$$('a,button', $('#mobile-menu'))], index = links.indexOf(document.activeElement);
    if ((e.shiftKey && index <= 0) || (!e.shiftKey && (index === links.length - 1 || index === -1))) {
      e.preventDefault(); links[e.shiftKey ? links.length - 1 : 0].focus();
    }
  }
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
window.addEventListener("hashchange", () => {if (location.hash.startsWith('#/')) route();});
window.addEventListener('popstate', route);
window.addEventListener('resize', () => {
  if (!$('#mobile-menu').hidden) $('#mobile-menu').style.top = $('.header').getBoundingClientRect().bottom + 'px';
});
decorateLinks(document);
syncFavorites();
route();
