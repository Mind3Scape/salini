/* Water and form: editorial experience + exact Salini catalogue geometry. */
window.SaliniExperience = (() => {
  const modelIDs = new Set(['1078','1120','1139','1151','1167','1170','1361','1364','1382','1452','1456','1773','1775']);
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cleanup = [], library;
  const filmVersion = 'bed71e974e05';
  const hasModel = p => modelIDs.has(String(p.id));
  function picture(name,alt,cls='') {
    return `<picture class="${cls}"><source media="(max-width:700px)" srcset="assets/${name}-mobile.webp"><img src="assets/${name}.webp" alt="${esc(alt)}" width="1672" height="941" decoding="async"></picture>`;
  }
  function portal() {
    return `<section class="experience-portal wrap" aria-labelledby="experience-invite"><a class="experience-portal-scene" href="#/experience">${picture('story-water','Вода и камень в воображаемом пространстве Salini')}<span class="portal-ring" aria-hidden="true">↗</span><span class="portal-caption">SALINI · ВНУТРИ ВОДНОГО ПАВИЛЬОНА</span></a><div class="experience-portal-copy"><span class="eyebrow">Приглашение почувствовать</span><h2 id="experience-invite">Вода обретает<br><em>форму.</em></h2><p>От движения воды — к личному пространству тишины. Войдите в мир Salini.</p><a class="line-link" href="#/experience">Начать путешествие <span>↗</span></a></div></section>`;
  }
  function viewer(p, {large=false}={}) {
    if(!hasModel(p))return '';
    return `<section class="form-viewer ${large?'form-viewer-large':''}" data-form-viewer="${esc(p.id)}" aria-label="3D ${esc(p.name)}"><div class="form-viewer-stage"><div class="form-viewer-poster">${p.image?`<img src="${esc(p.image.src)}" alt="${esc(p.name)} — официальная фотография" width="${p.image.width}" height="${p.image.height}" loading="lazy">`:''}<button class="button button-dark" data-load-model>Рассмотреть в 3D <span aria-hidden="true">↗</span></button></div><div class="form-viewer-mount"></div><span class="form-viewer-status" role="status"></span></div><div class="form-viewer-tools" hidden><div class="form-views" role="group" aria-label="Ракурс модели"><button data-model-view="form" aria-pressed="true">Объём</button><button data-model-view="top" aria-pressed="false">Сверху</button><button data-model-view="detail" aria-pressed="false">Ближе</button><button data-model-rotate aria-pressed="false">Вращение</button></div><button data-model-photo>К фото</button></div><p class="form-viewer-note">Точная форма из 3D-модели Salini. Потяните для поворота. Цвет и блеск на экране — приближение.</p></section>`;
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
      <div class="journey-bottom"><div class="journey-route" role="group" aria-label="Сцены путешествия"><button data-film-chapter="threshold" aria-pressed="true"><span>01</span> Порог</button><i></i><button data-film-chapter="travel" aria-pressed="false"><span>02</span> Проход</button><i></i><button data-film-chapter="sanctuary" aria-pressed="false"><span>03</span> Luce</button></div><div class="journey-track" aria-hidden="true"><i></i></div><div class="journey-navigation"><span class="journey-scroll-hint">ПРОДОЛЖАЙТЕ СКРОЛЛ — ПРОСТРАНСТВО ОТКРОЕТСЯ</span><button data-film-pause aria-pressed="false" hidden>Пауза</button><button data-film-replay>Смотреть сначала</button><a href="experience/#form" data-chapter="form">К коллекции ↗</a></div></div>
      <div class="journey-loading" role="status"><i aria-hidden="true"></i><span>Открываем пространство</span></div>
      <div class="journey-error"><p data-water-status role="status"></p><button data-film-retry>Смотреть ↗</button></div>
      <noscript><style>.water-journey{height:100svh}.water-fill-stage{position:relative}.journey-start,.journey-route,.journey-navigation button{display:none}</style><p class="journey-no-script">Статичные сцены и коллекция доступны ниже.</p></noscript>
    </div></section>`;
  }
  function render(products) {
    const form = products.find(p=>p.id==='1364');
    return `<article class="water-experience">${waterChapter(form)}<section class="experience-form" id="form"><div class="wrap"><div class="experience-form-title"><div><span class="eyebrow">04 / ВАШЕ ПРИКОСНОВЕНИЕ</span><h2>От образа —<br><em>к вашей форме.</em></h2></div><p>Теперь предмет в ваших руках. Поверните точную модель Salini, выберите оттенок и сохраните своё исполнение.</p></div><div class="experience-form-layout"><div data-story-viewer>${viewer(form,{large:true})}</div><div class="experience-form-controls"><span class="eyebrow">СКУЛЬПТУРЫ ДЛЯ ЖИЗНИ</span><div class="story-form-choices" role="group" aria-label="Выбрать 3D-форму">${[['1361','Ninfea'],['1120','Greca'],['1364','Luce'],['1139','Noemi']].map(([id,name])=>`<button data-story-form="${id}" aria-pressed="${id===form.id}">${name}<span>↗</span></button>`).join('')}</div><div class="story-colours" role="group" aria-label="Оттенок 3D-формы">${[['','Молочный белый','#F1F0EA'],['3012','Тёплая глина','#C6846D'],['6034','Вода','#7AADAC'],['6005','Глубокий зелёный','#114232']].map(([code,title,hex])=>`<button class="colour-orb" data-story-ral="${code}" aria-label="${title}${code?' · RAL '+code:''}" aria-pressed="${!code}"><i style="--swatch:${hex}"></i></button>`).join('')}</div><p data-story-colour-label>Базовый белый</p><a class="button button-dark" data-story-product href="#/product/${form.id}">Выбрать Luce <span>↗</span></a><p class="small-note">Официальная геометрия изделия. Выбранный оттенок переносится в карточку; точный цвет подтверждают по физическому образцу.</p></div></div></div></section><section class="journey-afterword wrap" aria-label="Атмосфера воды и камня"><a href="#/materials">${picture('story-mineral','Крупный план воды на минеральной поверхности')}<span>Текучая. Тактильная.<br><em>Вечная в ощущении.</em><small>S-Stone и S-Sense ↗</small></span></a><a href="#/projects">${picture('story-water','Вода и камень в воображаемом пространстве Salini')}<span>Предмет обретает<br><em>свой мир.</em><small>Галерея интерьеров ↗</small></span></a></section><section class="experience-ritual wrap" id="ritual"><span class="eyebrow">04 / ВАШЕ ПРОСТРАНСТВО</span><h2>Форма становится<br><em>чувством.</em></h2><p class="experience-ritual-lead">Salini соединяет итальянскую эстетику, авторский дизайн и собственное производство в России. За каждой формой — материал, технология минерального литья и мастерство людей.</p><div class="experience-ritual-links"><a href="#/about"><span>От замысла к предмету</span><strong>История Salini</strong><span aria-hidden="true">↗</span></a><a href="#/projects"><span>Предмет обретает дом</span><strong>Интерьеры</strong><span aria-hidden="true">↗</span></a><a href="#/catalog"><span>Продолжите свою историю</span><strong>Найти форму</strong><span aria-hidden="true">↗</span></a></div><p class="experience-credit">Пространства воды и камня — художественные образы, созданные для этой истории. 3D-формы — модели Salini. История бренда и сведения о материалах — по официальным источникам.</p></section></article>`;
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
  function mountViewer(section, getConfiguration) {
    const poster=section.querySelector('.form-viewer-poster'), mount=section.querySelector('.form-viewer-mount'),
      start=section.querySelector('[data-load-model]'),status=section.querySelector('[role=status]'),tools=section.querySelector('.form-viewer-tools');
    let model,dead=false,visible=false,rotating=false,loadTimer;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    function appearance() {
      if(!model?.model)return;
      const value=getConfiguration?.()||{};
      const colour=window.SaliniAtelier.colours.find(c=>c[0]===value.ral)?.[2]||'#F1F0EA';
      model.model.materials.filter(m=>m.name.startsWith('body_')).forEach(m=>{
        m.pbrMetallicRoughness.setBaseColorFactor(colour);
        m.pbrMetallicRoughness.setRoughnessFactor(value.finish==='gloss'?.16:.38);
        m.pbrMetallicRoughness.setMetallicFactor(0);
      });
    }
    function motion(){if(!model)return;model.autoRotate=rotating&&visible&&!mount.hidden&&!document.hidden&&!reduce.matches;}
    async function load() {
      if(model){poster.hidden=true;mount.hidden=false;tools.hidden=false;motion();return;}
      start.disabled=true;mount.hidden=false;status.textContent='Открываем форму…';
      try {
        await ensureLibrary();if(dead)return;
        model=document.createElement('model-viewer');
        model.setAttribute('src',new URL(`assets/model-${section.dataset.formViewer}.glb?v=mineral-3`,document.baseURI));
        model.setAttribute('alt',section.getAttribute('aria-label'));
        model.setAttribute('camera-controls','');model.setAttribute('disable-zoom','');model.setAttribute('touch-action','pan-y');
        model.setAttribute('camera-orbit','30deg 65deg auto');model.setAttribute('field-of-view','30deg');
        model.setAttribute('min-camera-orbit','auto 10deg 70%');model.setAttribute('max-camera-orbit','auto 89deg 180%');
        model.setAttribute('shadow-intensity','1');model.setAttribute('shadow-softness','1');
        model.setAttribute('exposure','.72');model.setAttribute('environment-image','neutral');
        model.setAttribute('interaction-prompt','none');model.setAttribute('rotation-per-second','8deg');
        model.addEventListener('load',()=>{clearTimeout(loadTimer);if(dead)return;appearance();poster.hidden=true;tools.hidden=false;status.textContent='';start.disabled=false;motion();});
        const failed=()=>{clearTimeout(loadTimer);if(dead)return;status.textContent='3D сейчас недоступно. Попробуйте ещё раз или посмотрите фотографию.';model?.remove();model=null;poster.hidden=false;tools.hidden=true;start.disabled=false;};
        model.addEventListener('error',failed);loadTimer=setTimeout(failed,25000);
        mount.append(model);
      } catch {if(!dead){status.textContent='Не удалось загрузить 3D. Можно попробовать ещё раз.';start.disabled=false;}}
    }
    start.addEventListener('click',load);
    section.querySelector('[data-model-photo]').addEventListener('click',()=>{poster.hidden=false;mount.hidden=true;tools.hidden=true;if(model)model.autoRotate=false;});
    section.querySelectorAll('[data-model-view]').forEach(button=>button.addEventListener('click',()=>{
      if(model)model.cameraOrbit=button.dataset.modelView==='top'?'0deg 12deg auto':button.dataset.modelView==='detail'?'30deg 65deg 75%':'30deg 65deg auto';
      section.querySelectorAll('[data-model-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    }));
    section.querySelector('[data-model-rotate]').addEventListener('click',e=>{rotating=!rotating;e.currentTarget.setAttribute('aria-pressed',String(rotating));motion();});
    const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;motion();},{threshold:.1});io.observe(section);
    document.addEventListener('visibilitychange',motion);reduce.addEventListener('change',motion);
    const onConfig=()=>appearance();document.addEventListener('salini:configuration',onConfig);
    const dispose=()=>{dead=true;clearTimeout(loadTimer);io.disconnect();document.removeEventListener('visibilitychange',motion);reduce.removeEventListener('change',motion);document.removeEventListener('salini:configuration',onConfig);if(model){model.autoRotate=false;model.removeAttribute('src');model.remove();}};
    cleanup.push(dispose);return {appearance,dispose,load};
  }
  function mount(root,path,products) {
    if(path.startsWith('/product/')) {
      root.querySelectorAll('[data-form-viewer]').forEach(section=>{const controller=mountViewer(section,()=>{
        const p=products.find(p=>p.id===section.dataset.formViewer),params=new URLSearchParams(location.search);
        const variant=p?.variants.find(v=>v.id===root.querySelector('#product-variant')?.value);
        return {ral:params.get('ral'),finish:variant?.finish};
      });const details=section.closest('details');if(details)details.addEventListener('toggle',()=>{if(details.open)controller.load();});});
    }
    if(path!=='/experience')return;
    let chosen='1364',ral='',current;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let filmDead=false,filmDispose;
    import(new URL(`journey-film.js?v=${filmVersion}`,document.baseURI)).then(module=>{
      if(!filmDead)filmDispose=module.mountJourney(root.querySelector('.water-journey'));
    }).catch(()=>{root.querySelector('[data-water-status]').textContent='История доступна в статичных кадрах. Коллекция — ниже.';});
    cleanup.push(()=>{filmDead=true;filmDispose?.();});
    root.querySelectorAll('[data-chapter]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();root.querySelector('#'+link.dataset.chapter)?.scrollIntoView({behavior:'instant',block:'start'});if(link.dataset.chapter==='form')current?.load();}));
    function formLink(){const p=products.find(p=>p.id===chosen),v=p.variants.find(v=>v.material==='sStone')||p.variants[0],params=new URLSearchParams({variant:v.id});if(ral)params.set('ral',ral);const a=root.querySelector('[data-story-product]');a.href=`#/product/${chosen}?${params}`;a.innerHTML=`Выбрать ${esc(p.collection||p.name)} <span>↗</span>`;}
    function mountForm(){const p=products.find(p=>p.id===chosen);current?.dispose();const holder=root.querySelector('[data-story-viewer]');holder.innerHTML=viewer(p,{large:true});current=mountViewer(holder.querySelector('[data-form-viewer]'),()=>({ral,finish:'matte'}));formLink();}
    mountForm();
    root.querySelectorAll('[data-story-form]').forEach(button=>button.addEventListener('click',()=>{if(chosen===button.dataset.storyForm)return;chosen=button.dataset.storyForm;root.querySelectorAll('[data-story-form]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));mountForm();}));
    root.querySelectorAll('[data-story-ral]').forEach(button=>button.addEventListener('click',()=>{ral=button.dataset.storyRal;root.querySelectorAll('[data-story-ral]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));root.querySelector('[data-story-colour-label]').textContent=ral?'RAL '+ral:'Базовый белый';current?.appearance();formLink();}));

  }
  function intro() {
    if(document.documentElement.dataset.route!=='/'||matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData)return;
    try {if(sessionStorage.getItem('salini-entered-v1'))return;sessionStorage.setItem('salini-entered-v1','1');}catch{}
    const veil=document.createElement('div');veil.className='salini-arrival';veil.innerHTML='<div class="arrival-water" aria-hidden="true"></div><div class="arrival-word" aria-hidden="true"><img src="assets/salini-logo.svg" alt="" width="300" height="122"><span>L’ANIMA DELL’ACQUA</span></div><button aria-label="Пропустить вступление">Войти сразу ↗</button>';
    document.body.append(veil);
    let ended=false;const finish=()=>{if(ended)return;ended=true;veil.classList.add('is-open');setTimeout(()=>veil.remove(),650);};
    veil.querySelector('button').addEventListener('click',finish);veil.addEventListener('keydown',e=>{if(e.key==='Escape')finish();});
    setTimeout(finish,1100);setTimeout(()=>veil.remove(),2400);
  }
  const dispose=()=>{cleanup.forEach(f=>f());cleanup=[];};
  return {modelIDs,hasModel,viewer,portal,render,mount,dispose,intro};
})();
if(typeof document!=='undefined')window.SaliniExperience.intro();
