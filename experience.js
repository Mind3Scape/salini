/* Water and form: editorial experience + exact Salini catalogue geometry. */
window.SaliniExperience = (() => {
  const modelIDs = new Set(['1078','1120','1139','1151','1167','1170','1361','1364','1382','1452','1456','1773','1775']);
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cleanup = [], library;
  const filmVersion = '1ca4b0c3ee8f';
  const hasModel = p => modelIDs.has(String(p.id));
  function picture(name,alt,cls='') {
    return `<picture class="${cls}"><source media="(max-width:700px)" srcset="assets/${name}-mobile.webp"><img src="assets/${name}.webp" alt="${esc(alt)}" width="1672" height="941" decoding="async"></picture>`;
  }
  function portal() {
    return `<section class="experience-portal wrap" aria-labelledby="experience-invite"><a class="experience-portal-scene" href="#/experience">${picture('story-water','Вода и камень в воображаемом пространстве Salini')}<span class="portal-ring" aria-hidden="true">↗</span><span class="portal-caption">SALINI · ВНУТРИ ВОДНОГО ПАВИЛЬОНА</span></a><div class="experience-portal-copy"><span class="eyebrow">Приглашение почувствовать</span><h2 id="experience-invite">Вода обретает<br><em>форму.</em></h2><p>От движения воды — к личному пространству тишины. Войдите в мир Salini.</p><a class="line-link" href="#/experience">Начать путешествие <span>↗</span></a></div></section>`;
  }
  function waterPortal() {
    return `<section class="water-portal wrap" aria-labelledby="water-portal-title"><a class="water-portal-scene" href="#/experience" data-portal-enter><picture><source media="(max-aspect-ratio:4/5)" srcset="assets/journey-threshold-portrait.webp"><img src="assets/journey-threshold.webp" alt="Водный павильон Salini" width="1920" height="1080" loading="lazy"></picture><video data-portal-film muted loop playsinline preload="none" aria-hidden="true"></video><span class="water-portal-shade"></span><div class="water-portal-copy"><span class="eyebrow">L’ANIMA DELL’ACQUA · ИНТЕРАКТИВНАЯ ИСТОРИЯ</span><h2 id="water-portal-title">У воды<br>есть <em>свой мир.</em></h2><p>Войдите в пространство Salini.<br>От стихии — к вашей форме.</p><span class="water-portal-cta">Исследовать мир Salini <i aria-hidden="true">↗</i></span></div><span class="water-portal-edition">ACQUA / MATERIA / FORMA</span></a></section>`;
  }
  function mountPortal(root) {
    const video=root.querySelector('[data-portal-film]');if(!video)return;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,dead=false;
    const sync=()=>{
      if(dead||!visible||document.hidden||reduce.matches||navigator.connection?.saveData){video.pause();return;}
      if(!video.getAttribute('src'))video.src=new URL(`assets/journey-threshold-ambient${matchMedia('(max-aspect-ratio:4/5)').matches?'-portrait':''}.mp4`,document.baseURI).href;
      video.play().then(()=>{if(dead||!visible||document.hidden)video.pause();else video.classList.add('is-ready');}).catch(()=>video.classList.remove('is-ready'));
    };
    const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;sync();},{threshold:.2});io.observe(video);
    const retry=()=>{if(video.paused)sync();};
    document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);
    document.addEventListener('touchend',retry,{passive:true});document.addEventListener('click',retry);
    cleanup.push(()=>{dead=true;io.disconnect();document.removeEventListener('touchend',retry);document.removeEventListener('click',retry);document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',sync);video.pause();video.removeAttribute('src');video.load();});
  }
  function roomGallery(p) {
    const photos=p.presentation?.interiors?.length?p.presentation.interiors:p.gallery;
    return `<div class="story-gallery-heading"><div><span class="eyebrow">${esc(p.collection||p.name)} · В ИНТЕРЬЕРЕ</span><h3>Форма. Свет.<br><em>Ваше пространство.</em></h3></div><p>Фотографии Salini.<br>Разные оттенки и характеры одного предмета.</p></div><div class="story-gallery-grid">${photos.map((photo,i)=>`<a href="${esc(photo.src)}" target="_blank" rel="noopener" aria-label="Открыть фотографию ${esc(p.name)}, ${i+1}"><img src="${esc(photo.src)}" width="${photo.width}" height="${photo.height}" alt="${esc(p.name)} — интерьерная фотография Salini ${i+1}" loading="lazy" decoding="async"><span>${String(i+1).padStart(2,'0')} / ${esc(p.collection||p.name)} <i aria-hidden="true">↗</i></span></a>`).join('')}</div>`;
  }
  function viewer(p, {large=false}={}) {
    if(!hasModel(p))return '';
    const poster=p.presentation?.studio||p.image;
    return `<section class="form-viewer ${large?'form-viewer-large':''}" data-form-viewer="${esc(p.id)}" data-auto-model="true" aria-label="3D ${esc(p.name)}"><div class="form-viewer-stage"><div class="form-viewer-poster">${poster?`<img src="${esc(poster.src)}" alt="${esc(p.name)} — форма изделия" width="${poster.width}" height="${poster.height}" loading="lazy">`:''}<button class="button button-dark" data-load-model>Рассмотреть в 3D <span aria-hidden="true">↗</span></button></div><div class="form-viewer-mount"></div><span class="form-viewer-status" role="status"></span></div><div class="form-viewer-tools" hidden><div class="form-views" role="group" aria-label="Ракурс модели"><button data-model-view="form" aria-pressed="true">Объём</button><button data-model-view="top" aria-pressed="false">Сверху</button><button data-model-view="detail" aria-pressed="false">Ближе</button></div><button data-model-photo>Фотографии <span aria-hidden="true">↓</span></button></div><p class="form-viewer-note"><span data-surface-label>Минеральное литьё</span> · Студийный свет. Потяните для поворота.</p></section>`;
  }
  function collectionViewer(record, products) {
    if(record.kind!=='collections')return '';
    const slug=record.path.split('/').pop();
    const product=products.find(p=>hasModel(p)&&(p.collection||'').toLowerCase()===slug);
    if(!product)return '';
    return `<section class="collection-sculpture" data-collection-model><div class="collection-sculpture-copy"><span class="eyebrow">Сначала — форма</span><h2>${esc(product.name)}</h2><p>Рассмотрите точную модель со всех сторон.<br>Затем — коллекцию в интерьере.</p><a class="line-link" href="#/product/${product.id}">Материал, цвет и размеры <span>↗</span></a></div>${viewer(product,{large:true})}</section>`;
  }
  function waterChapter() {
    return `<section class="water-fill water-journey cinema-journey" id="water-fill" aria-labelledby="water-title"><div class="water-fill-stage">
      <div class="journey-screen" aria-hidden="true"><picture data-journey-poster><source media="(max-aspect-ratio:4/5)" srcset="assets/journey-threshold-portrait.webp"><img src="assets/journey-threshold.webp" alt="" width="1920" height="1080" fetchpriority="high"></picture></div>
      <div class="journey-shade" aria-hidden="true"></div>
      <div class="journey-edition" aria-hidden="true"><span>UN MONDO SALINI</span><span>ACQUA / MATERIA / FORMA</span></div>
      <div class="journey-captions">
        <div data-film-copy="threshold" class="journey-copy is-current"><span class="eyebrow">L’ANIMA DELL’ACQUA</span><h1 id="water-title">Вода<br><em>обретает</em><br>форму.</h1><p>Войти в пространство.<br>Остаться в ощущении.</p><button class="journey-start" data-film-start>Начать путешествие <span aria-hidden="true">↗</span></button></div>
        <div data-film-copy="flow" class="journey-copy journey-flow" aria-hidden="true" inert><span class="eyebrow">01 / ТЕЧЕНИЕ</span><h2>У воды<br>нет <em>границ.</em></h2></div>
        <div data-film-copy="passage" class="journey-copy journey-passage" aria-hidden="true" inert><span class="eyebrow">02 / ВНУТРИ ПРОСТРАНСТВА</span><h2>Внутри<br><em>тишины.</em></h2></div>
        <div data-film-copy="sanctuary" class="journey-copy journey-last" aria-hidden="true" inert><span class="eyebrow">03 / LUCE</span><h2>Течение<br>становится<br><em>тишиной.</em></h2><p>Форма вашего<br>личного пространства.</p><button class="journey-start" data-chapter="form">Рассмотреть точную форму <span aria-hidden="true">↗</span></button></div>
      </div>
      <div class="journey-bottom"><div class="journey-route" role="group" aria-label="Сцены путешествия"><button data-film-chapter="threshold" aria-pressed="true"><span>01</span> Порог</button><i></i><button data-film-chapter="travel" aria-pressed="false"><span>02</span> Проход</button><i></i><button data-film-chapter="sanctuary" aria-pressed="false"><span>03</span> Luce</button></div><div class="journey-track" aria-hidden="true"><i></i></div><div class="journey-navigation"><span class="journey-scroll-hint">ЛИСТАЙТЕ ВПЕРЁД. ВОЗВРАЩАЙТЕСЬ НАЗАД.</span><button data-film-replay>К началу</button><a href="experience/#form" data-chapter="form">К коллекции ↗</a></div></div>
      <div class="journey-loading" role="status"><i aria-hidden="true"></i><span>Открываем пространство</span></div>
      <div class="journey-error"><p data-water-status role="status"></p><button data-film-retry>Смотреть ↗</button></div>
      <noscript><style>.water-journey{height:100svh}.water-fill-stage{position:relative}.journey-start,.journey-route,.journey-navigation button{display:none}</style><p class="journey-no-script">Статичные сцены и коллекция доступны ниже.</p></noscript>
    </div></section>`;
  }
  function render(products) {
    const form = products.find(p=>p.id==='1364');
    return `<article class="water-experience">${waterChapter(form)}<section class="experience-form" id="form"><div class="wrap"><div class="experience-form-title"><div><span class="eyebrow">04 / ВАШЕ ПРИКОСНОВЕНИЕ</span><h2>От образа —<br><em>к вашей форме.</em></h2></div><p>Теперь предмет в ваших руках. Поверните точную модель Salini, выберите оттенок и сохраните своё исполнение.</p></div><div class="experience-form-layout"><div data-story-viewer>${viewer(form,{large:true})}</div><div class="experience-form-controls"><span class="eyebrow">СКУЛЬПТУРЫ ДЛЯ ЖИЗНИ</span><div class="story-form-choices" role="group" aria-label="Выбрать 3D-форму">${[['1361','Ninfea'],['1120','Greca'],['1364','Luce'],['1139','Noemi']].map(([id,name])=>`<button data-story-form="${id}" aria-pressed="${id===form.id}">${name}<span>↗</span></button>`).join('')}</div><div class="story-colours" role="group" aria-label="Оттенок 3D-формы">${[['','Молочный белый'],['3012','Тёплая глина'],['6034','Вода'],['6005','Глубокий зелёный']].map(([code,title])=>`<button class="colour-orb" data-story-ral="${code}" aria-label="${title}${code?' · RAL '+code:''}" aria-pressed="${!code}"><i style="--swatch:${window.SaliniAtelier.colours.find(c=>c[0]===code)?.[2]||'#F1F0EA'}"></i></button>`).join('')}</div><p data-story-colour-label>Базовый белый</p><a class="button button-dark" data-story-product href="#/product/${form.id}">Выбрать Luce <span>↗</span></a><p class="small-note">Официальная геометрия изделия. Выбранный оттенок переносится в карточку; точный цвет подтверждают по физическому образцу.</p></div></div><section class="story-gallery" data-story-gallery aria-label="Фотографии выбранной модели">${roomGallery(form)}</section></div></section><section class="journey-afterword wrap" aria-label="Атмосфера воды и камня"><a href="#/materials">${picture('story-mineral','Крупный план воды на минеральной поверхности')}<span>Текучая. Тактильная.<br><em>Вечная в ощущении.</em><small>S-Stone и S-Sense ↗</small></span></a><a href="#/projects">${picture('story-water','Вода и камень в воображаемом пространстве Salini')}<span>Предмет обретает<br><em>свой мир.</em><small>Галерея интерьеров ↗</small></span></a></section><section class="experience-ritual wrap" id="ritual"><span class="eyebrow">04 / ВАШЕ ПРОСТРАНСТВО</span><h2>Форма становится<br><em>чувством.</em></h2><p class="experience-ritual-lead">Salini соединяет итальянскую эстетику, авторский дизайн и собственное производство в России. За каждой формой — материал, технология минерального литья и мастерство людей.</p><div class="experience-ritual-links"><a href="#/about"><span>От замысла к предмету</span><strong>История Salini</strong><span aria-hidden="true">↗</span></a><a href="#/projects"><span>Предмет обретает дом</span><strong>Интерьеры</strong><span aria-hidden="true">↗</span></a><a href="#/catalog"><span>Продолжите свою историю</span><strong>Найти форму</strong><span aria-hidden="true">↗</span></a></div><p class="experience-credit">Пространства воды и камня — художественные образы, созданные для этой истории. 3D-формы — модели Salini. История бренда и сведения о материалах — по официальным источникам.</p></section></article>`;
  }
  function ensureLibrary() {
    if(customElements.get('model-viewer'))return Promise.resolve();
    if(!library)library=new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.type='module';script.src=new URL('assets/model-viewer-4.4.0.min.js',document.baseURI).href;
      const timer=setTimeout(()=>reject(Error('3D load timed out')),20000);
      script.onload=()=>customElements.whenDefined('model-viewer').then(()=>{clearTimeout(timer);resolve();});
      script.onerror=()=>{clearTimeout(timer);script.remove();library=null;reject(Error('3D unavailable'));};document.head.append(script);
    }).catch(error=>{library=null;throw error;});
    return library;
  }
  // Studio settings are shared by full viewers and the lightweight catalogue previews.
  // These optical values are visual approximations, not measured manufacturer data.
  function surface(value={}) {
    const gloss=value.finish==='gloss', sense=value.material==='sSense';
    return {
      colour:window.SaliniAtelier.colours.find(c=>c[0]===value.ral)?.[2]||'#F1F0EA',
      roughness:gloss?.2:sense?.36:.43,
      coat:gloss?.85:sense?.18:0,
      coatRoughness:gloss?.085:.32,
      ior:sense?1.5:1.47,
      label:(sense?'S-Sense':'S-Stone')+(gloss?' · глянцевая поверхность':' · матовая поверхность'),
    };
  }
  function applySurface(model, value={}) {
    if(!model?.model)return;
    const finish=surface(value);
    model.model.materials.filter(m=>m.name.startsWith('body_')).forEach(m=>{
      // CSS strings are interpreted as sRGB by model-viewer; arrays would be linear.
      m.pbrMetallicRoughness.setBaseColorFactor(finish.colour);
      m.pbrMetallicRoughness.setRoughnessFactor(finish.roughness);
      m.pbrMetallicRoughness.setMetallicFactor(0);
      m.setIor(finish.ior);
      m.setSpecularFactor(1);
      m.setClearcoatFactor(finish.coat);
      m.setClearcoatRoughnessFactor(finish.coatRoughness);
    });
  }
  function lightModel(model) {
    model.setAttribute('shadow-intensity','.7');model.setAttribute('shadow-softness','1');
    model.setAttribute('exposure','1');model.setAttribute('tone-mapping','neutral');
    model.setAttribute('environment-image',new URL('assets/studio-neutral-1024.hdr',document.baseURI).href);
    model.setAttribute('interaction-prompt','none');model.setAttribute('rotation-per-second','2deg');
    model.setAttribute('auto-rotate-delay','4000');
  }
  function mountViewer(section, getConfiguration) {
    const poster=section.querySelector('.form-viewer-poster'), mount=section.querySelector('.form-viewer-mount'),
      start=section.querySelector('[data-load-model]'),status=section.querySelector('[role=status]'),tools=section.querySelector('.form-viewer-tools');
    let model,dead=false,visible=false,loadTimer,loading=false,entryDone=false;
    const automatic=section.hasAttribute('data-auto-model');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    function appearance() {
      if(!model?.model)return;
      const value=getConfiguration?.()||{};
      applySurface(model,value);
      section.querySelector('[data-surface-label]').textContent=surface(value).label;
    }
    function motion(){
      if(!model)return;
      model.autoRotate=visible&&!mount.hidden&&!document.hidden&&!reduce.matches;
      if(automatic&&visible&&model.loaded&&!entryDone){entryDone=true;if(!reduce.matches)model.cameraOrbit='30deg 65deg auto';}
    }
    async function load() {
      if(loading)return;
      if(model){poster.hidden=true;mount.hidden=false;tools.hidden=false;motion();return;}
      loading=true;start.disabled=true;mount.hidden=false;section.classList.add('is-loading');status.textContent='Открываем форму…';
      try {
        await ensureLibrary();if(dead)return;
        model=document.createElement('model-viewer');
        model.setAttribute('src',new URL(`assets/model-${section.dataset.formViewer}-pbr.glb?v=studio-1`,document.baseURI));
        model.setAttribute('alt',section.getAttribute('aria-label'));
        model.setAttribute('camera-controls','');model.setAttribute('disable-zoom','');model.setAttribute('touch-action','pan-y');
        model.setAttribute('camera-orbit',automatic&&!reduce.matches?'40deg 68deg auto':'30deg 65deg auto');model.setAttribute('interpolation-decay','160');model.setAttribute('field-of-view','30deg');
        model.setAttribute('min-camera-orbit','auto 10deg 70%');model.setAttribute('max-camera-orbit','auto 89deg 180%');
        lightModel(model);
        model.addEventListener('load',()=>{clearTimeout(loadTimer);if(dead)return;loading=false;appearance();poster.hidden=true;tools.hidden=false;section.classList.remove('is-loading');section.classList.add('is-ready');status.textContent='';start.disabled=false;motion();});
        const failed=()=>{clearTimeout(loadTimer);if(dead)return;section.classList.remove('is-loading','is-ready');status.textContent='3D сейчас недоступно. Фотографии — ниже. Можно попробовать ещё раз.';model?.remove();model=null;loading=false;poster.hidden=false;tools.hidden=true;start.disabled=false;};
        model.addEventListener('error',failed);loadTimer=setTimeout(failed,25000);
        mount.append(model);
      } catch {loading=false;if(!dead){section.classList.remove('is-loading');status.textContent='Не удалось загрузить 3D. Фотографии доступны ниже.';start.disabled=false;}}
    }
    start.addEventListener('click',load);
    section.querySelector('[data-model-photo]').addEventListener('click',()=>{
      const target=section.closest('.detail-photo')?.querySelector('.product-photos')||section.closest('.collection-sculpture')?.nextElementSibling||document.querySelector('[data-story-gallery]');
      target?.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});
    });
    section.querySelectorAll('[data-model-view]').forEach(button=>button.addEventListener('click',()=>{
      if(model)model.cameraOrbit=button.dataset.modelView==='top'?'0deg 12deg auto':button.dataset.modelView==='detail'?'30deg 65deg 75%':'30deg 65deg auto';
      section.querySelectorAll('[data-model-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    }));
    const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible&&automatic)load();motion();},{threshold:.1});io.observe(section);
    const prefetch=automatic?new IntersectionObserver(e=>{if(e[0].isIntersecting&&!navigator.connection?.saveData)load();},{rootMargin:'650px 0px'}):null;prefetch?.observe(section);
    section.addEventListener('pointerdown',()=>{entryDone=true;},{once:true});
    document.addEventListener('visibilitychange',motion);reduce.addEventListener('change',motion);
    const onConfig=()=>appearance();document.addEventListener('salini:configuration',onConfig);
    const dispose=()=>{dead=true;clearTimeout(loadTimer);io.disconnect();prefetch?.disconnect();document.removeEventListener('visibilitychange',motion);reduce.removeEventListener('change',motion);document.removeEventListener('salini:configuration',onConfig);if(model){model.autoRotate=false;model.removeAttribute('src');model.remove();}};
    cleanup.push(dispose);return {appearance,dispose,load};
  }
  function mountPreviews(root,products) {
    const entries=new Map(),reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:700px)');
    let dead=false,timer;
    function release(entry) {
      entry.generation++;entry.pending=false;
      if(entry.model){entry.model.autoRotate=false;entry.model.removeAttribute('src');entry.model.remove();entry.model=null;}
      entry.node.closest('.image-wrap')?.classList.remove('has-live-model');
    }
    async function activate(entry) {
      if(entry.model||entry.pending||entry.failed)return;
      entry.pending=true;const token=++entry.generation;
      try {
        await ensureLibrary();
        if(dead||token!==entry.generation||!entry.node.isConnected)return;
        const model=document.createElement('model-viewer');entry.model=model;entry.pending=false;
        model.setAttribute('src',new URL(`assets/model-${entry.product.id}-pbr.glb?v=studio-1`,document.baseURI));
        model.setAttribute('aria-hidden','true');model.setAttribute('tabindex','-1');
        model.setAttribute('camera-orbit','30deg 65deg auto');model.setAttribute('field-of-view','30deg');
        lightModel(model);model.setAttribute('rotation-per-second','3deg');
        model.addEventListener('load',()=>{
          if(dead||token!==entry.generation)return;
          const variant=entry.product.variants.find(v=>v.id===entry.node.dataset.previewVariant)||entry.product.variants[0];
          applySurface(model,{...variant,ral:entry.node.dataset.previewRal});
          entry.node.closest('.image-wrap')?.classList.add('has-live-model');
          model.autoRotate=!reduce.matches&&!document.hidden;
        },{once:true});
        model.addEventListener('error',()=>{if(token===entry.generation){entry.failed=true;release(entry);}},{once:true});
        entry.node.append(model);
      }catch{if(token===entry.generation){entry.failed=true;entry.pending=false;}}
    }
    function refresh() {
      if(dead)return;
      const candidates=[...entries.values()].filter(e=>e.ratio>.2&&e.node.isConnected&&!e.failed);
      // Prioritize the most visible cards, keeping the renderer budget small on phones.
      candidates.sort((a,b)=>b.ratio-a.ratio||Math.abs(a.node.getBoundingClientRect().top-innerHeight*.4)-Math.abs(b.node.getBoundingClientRect().top-innerHeight*.4));
      const active=new Set(document.hidden||navigator.connection?.saveData?[]:candidates.slice(0,mobile.matches?1:2));
      for(const entry of entries.values()) {
        if(!active.has(entry)){if(entry.model||entry.pending)release(entry);}
        else {activate(entry);if(entry.model)entry.model.autoRotate=!reduce.matches;}
      }
    }
    const schedule=()=>{clearTimeout(timer);timer=setTimeout(refresh,90);};
    const io=new IntersectionObserver(changes=>{for(const change of changes){const entry=entries.get(change.target);if(entry)entry.ratio=change.intersectionRatio;}schedule();},{threshold:[0,.2,.5,.8,1]});
    function scan() {
      for(const [node,entry] of entries)if(!node.isConnected){release(entry);io.unobserve(node);entries.delete(node);}
      root.querySelectorAll('[data-card-model]').forEach(node=>{
        if(entries.has(node))return;
        const product=products.find(p=>p.id===node.dataset.cardModel);if(!product||!hasModel(product))return;
        entries.set(node,{node,product,ratio:0,generation:0,model:null,pending:false,failed:false});io.observe(node);
      });
    }
    scan();
    const observer=new MutationObserver(records=>{
      if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(n.matches?.('[data-card-model],.product-card')||n.querySelector?.('[data-card-model]'))))) {scan();schedule();}
    });observer.observe(root,{childList:true,subtree:true});
    document.addEventListener('visibilitychange',refresh);reduce.addEventListener('change',refresh);mobile.addEventListener('change',refresh);
    cleanup.push(()=>{dead=true;clearTimeout(timer);io.disconnect();observer.disconnect();entries.forEach(release);entries.clear();document.removeEventListener('visibilitychange',refresh);reduce.removeEventListener('change',refresh);mobile.removeEventListener('change',refresh);});
  }
  function mount(root,path,products) {
    mountPreviews(root,products);
    if(path==='/')mountPortal(root);
    if(path.startsWith('/product/')) {
      root.querySelectorAll('[data-form-viewer]').forEach(section=>{const controller=mountViewer(section,()=>{
        const p=products.find(p=>p.id===section.dataset.formViewer),params=new URLSearchParams(location.search);
        const variant=p?.variants.find(v=>v.id===root.querySelector('#product-variant')?.value);
        return {ral:params.get('ral'),finish:variant?.finish,material:variant?.material};
      });const details=section.closest('details');if(details)details.addEventListener('toggle',()=>{if(details.open)controller.load();});});
    }
    if(path.startsWith('/collection/'))root.querySelectorAll('[data-form-viewer]').forEach(section=>mountViewer(section,()=>products.find(p=>p.id===section.dataset.formViewer)?.variants[0]||{}));
    if(path!=='/experience')return;
    let chosen='1364',ral='',current;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let filmDead=false,filmDispose;
    import(new URL(`journey-film.js?v=${filmVersion}`,document.baseURI)).then(module=>{
      if(!filmDead)filmDispose=module.mountJourney(root.querySelector('.water-journey'));
    }).catch(()=>{root.querySelector('[data-water-status]').textContent='История доступна в статичных кадрах. Коллекция — ниже.';});
    cleanup.push(()=>{filmDead=true;filmDispose?.();});
    root.querySelectorAll('[data-chapter]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();root.querySelector('#'+link.dataset.chapter)?.scrollIntoView({behavior:'instant',block:'start'});if(link.dataset.chapter==='form')current?.load();}));
    function formLink(){const p=products.find(p=>p.id===chosen),v=p.variants.find(v=>v.material==='sStone')||p.variants[0],params=new URLSearchParams({variant:v.id});if(ral)params.set('ral',ral);const a=root.querySelector('[data-story-product]');a.href=`product/${chosen}/?${params}`;a.innerHTML=`Выбрать ${esc(p.collection||p.name)} <span>↗</span>`;}
    function mountForm(){const p=products.find(p=>p.id===chosen);current?.dispose();const holder=root.querySelector('[data-story-viewer]');holder.innerHTML=viewer(p,{large:true});current=mountViewer(holder.querySelector('[data-form-viewer]'),()=>({ral,finish:'matte'}));root.querySelector('[data-story-gallery]').innerHTML=roomGallery(p);formLink();}
    mountForm();
    root.querySelectorAll('[data-story-form]').forEach(button=>button.addEventListener('click',()=>{if(chosen===button.dataset.storyForm)return;chosen=button.dataset.storyForm;root.querySelectorAll('[data-story-form]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));mountForm();}));
    root.querySelectorAll('[data-story-ral]').forEach(button=>button.addEventListener('click',()=>{ral=button.dataset.storyRal;root.querySelectorAll('[data-story-ral]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));root.querySelector('[data-story-colour-label]').textContent=ral?'RAL '+ral:'Базовый белый';current?.appearance();formLink();}));

  }
  function intro() {
    if(document.querySelector('.salini-arrival'))return;
    const veil=document.createElement('div');veil.className='salini-arrival';veil.innerHTML='<div class="arrival-water" aria-hidden="true"></div><div class="arrival-word" aria-hidden="true"><img src="assets/salini-logo.svg" alt="" width="300" height="122"><span>L’ANIMA DELL’ACQUA</span></div><button aria-label="Пропустить вступление">Войти сразу ↗</button>';
    document.body.append(veil);
    let ended=false;const finish=()=>{if(ended)return;ended=true;veil.classList.add('is-open');setTimeout(()=>veil.remove(),650);};
    veil.querySelector('button').addEventListener('click',finish);veil.addEventListener('keydown',e=>{if(e.key==='Escape')finish();});
    setTimeout(finish,1100);setTimeout(()=>veil.remove(),2400);
  }
  const dispose=()=>{cleanup.forEach(f=>f());cleanup=[];};
  return {modelIDs,hasModel,viewer,collectionViewer,surface,applySurface,portal,waterPortal,render,mount,dispose,intro};
})();
if(typeof document!=='undefined')window.SaliniExperience.intro();
