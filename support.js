/* Official support content and a dated showroom archive. No account, forms or location access. */
(() => {
  "use strict";
  const scriptURL = typeof document !== "undefined" && document.currentScript?.src;
  const baseURL = scriptURL ? new URL(".", scriptURL) : new URL("https://mind3scape.github.io/salini/");
  const dataURL = new URL("support.json", baseURL);
  const paths = ["/dealers", "/help", "/service", "/delivery", "/contacts"];
  const titles = { "/dealers": "Салоны и шоурумы", "/help": "Помощь с выбором", "/service": "Гарантия и сервис", "/delivery": "Доставка и оплата", "/contacts": "Контакты Salini" };
  const descriptions = { "/dealers": "Найдите салон и познакомьтесь с изделиями Salini вживую.", "/help": "Ответы о материалах, заказе, установке и уходе за изделиями." };
  let data, pending;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const fold = (s) => String(s ?? "").toLocaleLowerCase("ru").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/ё/g,"е").replace(/\s+/g," ").trim();
  const matches = (s, query) => fold(query).split(" ").filter(Boolean).every(word => fold(s).includes(word));
  const date = (s) => String(s).split("-").reverse().join(".");
  const paramsOf = (p) => p instanceof URLSearchParams ? p : new URLSearchParams(p || "");
  const href = (path, values = {}) => { const q = new URLSearchParams(values); return "#" + path + (q.size ? "?" + q : ""); };
  const sourceNote = (source, text = "Проверено по официальному сайту") => `<p class="support-source">${esc(text)} · ${date(source.sourceDate)}. <a href="${esc(source.sourceUrl)}" target="_blank" rel="noopener">Первоисточник <span aria-hidden="true">↗︎</span></a></p>`;
  function heading(path, description, source) {
    return `<header class="page-heading wrap support-heading"><div class="breadcrumb"><a href="#/">Главная</a><span aria-hidden="true">/</span><span>${titles[path]}</span></div><span class="eyebrow">Salini · Рядом на каждом этапе</span><h1>${titles[path]}</h1><p>${esc(description)}</p>${source ? sourceNote(source, source.sourceStatus === "archive" ? "Справочник салонов из архива Salini" : undefined) : ""}</header>`;
  }
  function supportNav(current) {
    return `<nav class="support-nav" aria-label="Салоны и поддержка">${paths.filter(p => p !== current).map(p => `<a href="#${p}">${titles[p]} <span aria-hidden="true">↗︎</span></a>`).join("")}</nav>`;
  }
  async function load() {
    if (data) return data;
    if (!pending) pending = fetch(dataURL.href, {cache:"no-cache"}).then(r => { if (!r.ok) throw Error("Support HTTP " + r.status); return r.json(); }).then(value => {
      if (value.version !== 1 || !Array.isArray(value.pages) || !Array.isArray(value.dealers?.items) || !Array.isArray(value.faq?.sections)) throw Error("Invalid support data");
      data = value; return data;
    }).catch(error => { pending = null; throw error; });
    return pending;
  }
  function pageContent(path, params) {
    const page = data.pages.find(p => p.path === path);
    const contacts = path === "/contacts";
    return heading(path, page.description, page) + `<div class="wrap support-page">${supportNav(path)}
      ${path === "/delivery" ? '<div class="support-callout"><strong>Условия работы Salini</strong><p>Ниже — условия с официального сайта. Оформление заказа и платёжная ссылка доступны через команду Salini или официальный конфигуратор.</p><a class="line-link" href="https://salini-srl.com/" target="_blank" rel="noopener">Перейти на официальный сайт <span aria-hidden="true">↗︎</span></a></div>' : ""}
      ${contacts ? '<div class="support-callout"><strong>Сначала — ваш вопрос</strong><p>По выбору изделий: <a href="mailto:info@salini-srl.com">info@salini-srl.com</a>. Дизайнерам: <a href="mailto:design@salini-srl.com">design@salini-srl.com</a>. По сервису: <a href="mailto:complaint@salini-srl.com">complaint@salini-srl.com</a>.</p></div>' : ""}
      <div class="support-layout ${contacts ? "support-layout-contacts" : ""}"><nav class="support-toc" aria-label="Разделы страницы">${page.sections.map(s => `<a href="${href(path, {section:s.id})}">${esc(s.title)} <span aria-hidden="true">↓</span></a>`).join("")}</nav>
      <div class="${contacts ? "support-contact-grid" : "support-sections"}">${page.sections.map(s => `<section class="support-section ${contacts ? "support-contact-card" : ""}" id="support-${esc(s.id)}" tabindex="-1">${s.country ? `<span class="eyebrow">${esc(s.country)}</span>` : ""}<h2>${esc(s.title)}</h2><div class="support-prose">${s.html}</div></section>`).join("")}</div></div>
      ${path === "/service" ? '<div class="support-callout"><strong>Нужна помощь с изделием?</strong><p>Сохраните документы о покупке и обратитесь в Salini. Команда подскажет порядок обращения и подходящий сервисный центр.</p><a class="button button-dark" href="mailto:complaint@salini-srl.com">Написать в сервис <span aria-hidden="true">↗︎</span></a><a class="line-link" href="#/contacts">Все контакты отдела <span aria-hidden="true">→</span></a></div>' : ""}
      </div>`;
  }
  function faqGroups(source, q, archived, item) {
    return source.sections.map(section => {
      const found = section.items.filter(x => matches(section.title + " " + x.q + " " + x.text, q));
      if (!found.length) return "";
      return `<section class="support-faq-group"><h3>${esc(section.title)}</h3>${found.map(x => `<details class="support-answer" id="support-${esc(x.id)}" ${item === x.id ? "open" : ""}><summary>${esc(x.q)}<span aria-hidden="true">+</span></summary><div class="support-prose">${archived ? `<p class="support-archive-inline">Архивный ответ от ${date(source.sourceDate)}. Текущие условия уточняйте в Salini.</p>` : ""}${x.html}</div></details>`).join("")}</section>`;
    }).join("");
  }
  function faqResults(params) {
    const q = params.get("q") || "", item = params.get("item") || "";
    const current = faqGroups(data.faq,q,false,item), archive = faqGroups(data.faq.archive,q,true,item);
    return `${current ? `<section aria-labelledby="support-current-title"><div class="support-section-heading"><span class="eyebrow">Сейчас на сайте Salini</span><h2 id="support-current-title">Актуальные ответы</h2>${sourceNote(data.faq)}</div>${current}</section>` : ""}
      ${archive ? `<section class="support-faq-archive" aria-labelledby="support-archive-title"><div class="support-section-heading"><span class="eyebrow">Справочный архив · ${date(data.faq.archive.sourceDate)}</span><h2 id="support-archive-title">Больше о ваших изделиях</h2><p>54 ответа из прежней версии FAQ. Они сохранены для справки; сроки, цены и условия могли измениться. Для заказа ориентируйтесь на текущие разделы и подтверждение команды Salini.</p>${sourceNote(data.faq.archive,"Архив официального FAQ")}</div>${archive}</section>` : ""}
      ${!current && !archive ? '<div class="support-empty"><h2>Ответ не найден</h2><p>Попробуйте другое слово или напишите команде Salini.</p><a href="mailto:info@salini-srl.com" class="button">Задать вопрос <span aria-hidden="true">↗︎</span></a></div>' : ""}`;
  }
  function faqCount(q) {
    return [data.faq, data.faq.archive].reduce((total, source) => total + source.sections.reduce((n,s) => n + s.items.filter(x => matches(s.title+" "+x.q+" "+x.text,q)).length,0),0);
  }
  function renderHelp(params) {
    return heading("/help", descriptions["/help"]) + `<div class="wrap support-page">${supportNav("/help")}<div class="support-tools"><label class="field">Поиск по вопросам<input id="support-help-search" type="search" value="${esc(params.get("q") || "")}" placeholder="Например, уход, монтаж или гарантия" aria-controls="support-help-results"></label><p class="support-results-count" id="support-help-count" role="status" aria-live="polite">Найдено ответов: ${faqCount(params.get("q") || "")}</p></div><div id="support-help-results" class="support-help-results">${faqResults(params)}</div></div>`;
  }
  function dealerFilter(params) {
    const q=params.get("q") || "", city=params.get("city") || "", country=params.get("country") || "", product=params.get("product") || "", exposition=params.get("exposition") === "1";
    return data.dealers.items.filter(d => (!city || d.city === city) && (!country || d.country === country) && (!exposition || d.hasExposition) && (!product || d.exposition.some(x => x.productId === product)) && matches(d.name+" "+d.city+" "+d.address+" "+d.country,q));
  }
  function dealerCard(d, products) {
    const known = new Set(products.map(p => p.id));
    const map = d.latitude != null && d.longitude != null ? `https://yandex.ru/maps/?pt=${d.longitude},${d.latitude}&z=16&l=map` : null;
    return `<article class="support-dealer-card"><div class="support-dealer-top"><span class="eyebrow">${esc(d.country)} · ${esc(d.city)}</span>${d.hasExposition ? '<span class="support-badge">Есть экспозиция</span>' : ""}</div><h2 tabindex="-1">${esc(d.name)}</h2><p class="support-dealer-address">${esc(d.address)}</p>${d.hours ? `<p class="support-dealer-hours">${esc(d.hours)}</p>` : ""}${d.isDistributor ? '<p class="support-dealer-hours">Официальный дистрибьютор · по данным архива</p>' : ""}<div class="support-dealer-actions">${d.phones.map(p => `<a href="${esc(p.tel)}">${esc(p.display)}${p.extension ? `<small>доб. ${esc(p.extension)}</small>` : ""}</a>`).join("")}${d.website ? `<a href="${esc(d.website)}" target="_blank" rel="noopener">Сайт салона <span aria-hidden="true">↗︎</span></a>` : ""}${map ? `<a href="${esc(map)}" target="_blank" rel="noopener">На карте <span aria-hidden="true">↗︎</span></a>` : '<span class="support-map-missing">Точка на карте не указана</span>'}</div>${d.exposition.length ? `<details class="support-dealer-expo"><summary>Изделия в экспозиции <span>${d.exposition.length}</span></summary><p class="support-archive-inline">По опубликованной экспозиции от ${date(data.dealers.sourceDate)}. Перед поездкой уточните изделие, цвет и режим работы салона.</p><ul>${d.exposition.map(x => `<li>${x.productId && (!products.length || known.has(x.productId)) ? `<a href="#/product/${encodeURIComponent(x.productId)}">${esc(x.name)}</a>` : esc(x.name)}</li>`).join("")}</ul></details>` : ""}</article>`;
  }
  function renderDealers(params, {products = [], all = false} = {}) {
    const product=params.get("product"), selected=products.find(p=>p.id===product), found=dealerFilter(params);
    const countries=[...new Set(data.dealers.items.map(d=>d.country))].sort((a,b)=>a.localeCompare(b,"ru"));
    const cities=[...new Set(data.dealers.items.map(d=>d.city))].sort((a,b)=>a.localeCompare(b,"ru"));
    return heading("/dealers",descriptions["/dealers"],data.dealers) + `<div class="wrap support-page">${supportNav("/dealers")}<div class="support-callout"><strong>Увидеть материал. Почувствовать форму.</strong><p>Здесь показана опубликованная экспозиция салонов, а не складское наличие. Адреса и часы работы — справочник от ${date(data.dealers.sourceDate)}; перед поездкой позвоните в салон. <a href="https://salini-srl.com/where-buy/" target="_blank" rel="noopener">Проверить актуальный список Salini ↗︎</a></p></div>${product ? `<div class="support-product-context"><p>Где посмотреть: <strong>${esc(selected?.name || "выбранное изделие")}</strong></p><a href="#/dealers" class="line-link">Все салоны <span aria-hidden="true">→</span></a></div>` : ""}<div class="support-tools support-dealer-tools"><label class="field support-dealer-query">Найти салон<input id="support-dealer-query" type="search" placeholder="Город, название или адрес" value="${esc(params.get("q") || "")}" aria-controls="support-dealer-results"></label><label class="field">Страна<select id="support-dealer-country"><option value="">Все страны</option>${countries.map(c=>`<option value="${esc(c)}" ${params.get("country")===c?'selected':''}>${esc(c)}</option>`).join("")}</select></label><label class="field">Город<select id="support-dealer-city"><option value="">Все города</option>${cities.map(c=>`<option value="${esc(c)}" ${params.get("city")===c?'selected':''}>${esc(c)}</option>`).join("")}</select></label><label class="support-checkbox"><input id="support-exposition-only" type="checkbox" ${params.get("exposition")==="1"?'checked':''}> Только с экспозицией</label><button class="line-link" id="support-reset-dealers">Сбросить фильтры <span aria-hidden="true">↺</span></button></div><p class="support-results-count" id="support-dealer-count" role="status" aria-live="polite">Найдено салонов: ${found.length}</p><div class="support-dealer-grid" id="support-dealer-results">${found.length ? found.slice(0,all?found.length:24).map(d=>dealerCard(d,products)).join("") : '<div class="support-empty"><h2>Подходящих салонов не найдено</h2><p>Попробуйте другой город или снимите фильтр экспозиции.</p></div>'}</div><button class="button support-more" id="support-more-dealers" ${all || found.length <=24?'hidden':''}>Показать ещё салоны <span aria-hidden="true">↓</span></button></div>`;
  }
  function render(path, params, context = {}) {
    if (!data) throw Error("Call SaliniSupport.load() before render()");
    params=paramsOf(params);
    if(path==="/dealers") return renderDealers(params,context);
    if(path==="/help") return renderHelp(params);
    if(paths.includes(path)) return pageContent(path,params);
    return "";
  }
  function replaceParams(path, params) {
    const url=new URL(href(path,Object.fromEntries(params)),baseURL);
    history.replaceState(null,"",url.pathname+url.search+url.hash);
  }
  function mount(main,path,params,context={}) {
    params=new URLSearchParams(paramsOf(params));
    if(path==="/help") {
      const input=main.querySelector("#support-help-search");
      input?.addEventListener("input",()=>{
        input.value ? params.set("q",input.value) : params.delete("q");params.delete("item");
        main.querySelector("#support-help-results").innerHTML=faqResults(params);
        main.querySelector("#support-help-count").textContent="Найдено ответов: "+faqCount(input.value);
        replaceParams(path,params);
      });
    }
    if(path==="/dealers") {
      let shown=24;
      const result=main.querySelector("#support-dealer-results"), more=main.querySelector("#support-more-dealers");
      const controls={q:main.querySelector("#support-dealer-query"),city:main.querySelector("#support-dealer-city"),country:main.querySelector("#support-dealer-country"),exposition:main.querySelector("#support-exposition-only")};
      const paint=()=>{
        const found=dealerFilter(params);
        result.innerHTML=found.length?found.slice(0,shown).map(d=>dealerCard(d,context.products||[])).join(""):'<div class="support-empty"><h2>Подходящих салонов не найдено</h2><p>Попробуйте другой город или снимите фильтр экспозиции.</p></div>';
        main.querySelector("#support-dealer-count").textContent="Найдено салонов: "+found.length;
        more.hidden=found.length<=shown;
      };
      const filter=()=>{
        Object.entries(controls).forEach(([key,input])=>{const value=key==="exposition"?(input.checked?"1":""):input.value;value?params.set(key,value):params.delete(key);});
        shown=24;paint();replaceParams(path,params);
      };
      Object.values(controls).forEach(input=>input.addEventListener(input.type==="search"?"input":"change",filter));
      main.querySelector("#support-reset-dealers").addEventListener("click",()=>{Object.entries(controls).forEach(([key,input])=>{if(key==="exposition")input.checked=false;else input.value="";});filter();});
      more.addEventListener("click",()=>{const previous=shown;shown+=24;paint();result.querySelectorAll(".support-dealer-card h2")[previous]?.focus({preventScroll:true});});
    }
    const anchor=params.get("section") || params.get("item");
    if(anchor) {
      const section=[...main.querySelectorAll("[id]")].find(n=>n.id==="support-"+anchor);
      if(section) { if(section.tagName==="DETAILS")section.open=true;section.scrollIntoView({block:"start"}); }
    }
  }
  function search(q) {
    if(!data || !fold(q)) return [];
    const results=[];
    data.pages.forEach(page=>page.sections.forEach(s=>{if(matches(page.title+" "+s.title+" "+s.text,q))results.push({title:page.title+" · "+s.title,href:href(page.path,{section:s.id}),excerpt:s.text.slice(0,160)});}));
    [data.faq,data.faq.archive].forEach(source=>source.sections.forEach(s=>s.items.forEach(x=>{if(matches(s.title+" "+x.q+" "+x.text,q))results.push({title:x.q+(source.sourceStatus==="archive"?" · архив":""),href:href("/help",{item:x.id}),excerpt:x.text.slice(0,160)});}))); 
    data.dealers.items.forEach(d=>{if(matches(d.name+" "+d.city+" "+d.address,q))results.push({title:d.name+" · "+d.city,href:href("/dealers",{q:d.name,city:d.city}),excerpt:d.address+" · справочник от "+date(data.dealers.sourceDate)});});
    return results;
  }
  function getPages() {
    if(!data) throw Error("Call SaliniSupport.load() before getPages()");
    return paths.map(path=>({path,title:titles[path],description:descriptions[path]||data.pages.find(p=>p.path===path).description,html:render(path,new URLSearchParams(),{all:true})}));
  }
  window.SaliniSupport={load,handles:path=>paths.includes(path),render,mount,getPages,search};
})();
