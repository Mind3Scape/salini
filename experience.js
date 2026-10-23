/* Water and form: editorial experience + exact Salini catalogue geometry. */
window.SaliniExperience = (() => {
  const modelIDs = new Set(['1078','1120','1139','1151','1167','1170','1361','1364','1382','1452','1456','1773','1775']);
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cleanup = [], library;
  const waterVersion = '484f3b420dc2';
  const hasModel = p => modelIDs.has(String(p.id));
  function picture(name,alt,cls='') {
    return `<picture class="${cls}"><source media="(max-width:700px)" srcset="assets/${name}-mobile.webp"><img src="assets/${name}.webp" alt="${esc(alt)}" width="1672" height="941" decoding="async"></picture>`;
  }
  function portal() {
    return `<section class="experience-portal wrap" aria-labelledby="experience-invite"><a class="experience-portal-scene" href="#/experience">${picture('story-water','Вода и камень в воображаемом пространстве Salini')}<span class="portal-ring" aria-hidden="true">↗</span><span class="portal-caption">SALINI · ИСТОРИЯ В ЧЕТЫРЁХ ГЛАВАХ</span></a><div class="experience-portal-copy"><span class="eyebrow">Приглашение почувствовать</span><h2 id="experience-invite">Вода обретает<br><em>форму.</em></h2><p>От первой капли к предмету, который становится частью вашей жизни. Войдите в мир Salini.</p><a class="line-link" href="#/experience">Начать путешествие <span>↗</span></a></div></section>`;
  }
  function viewer(p, {large=false}={}) {
    if(!hasModel(p))return '';
    return `<section class="form-viewer ${large?'form-viewer-large':''}" data-form-viewer="${esc(p.id)}" aria-label="3D ${esc(p.name)}"><div class="form-viewer-stage"><div class="form-viewer-poster">${p.image?`<img src="${esc(p.image.src)}" alt="${esc(p.name)} — официальная фотография" width="${p.image.width}" height="${p.image.height}" loading="lazy">`:''}<button class="button button-dark" data-load-model>Рассмотреть в 3D <span aria-hidden="true">↗</span></button></div><div class="form-viewer-mount"></div><span class="form-viewer-status" role="status"></span></div><div class="form-viewer-tools" hidden><div class="form-views" role="group" aria-label="Ракурс модели"><button data-model-view="form" aria-pressed="true">Объём</button><button data-model-view="top" aria-pressed="false">Сверху</button><button data-model-view="detail" aria-pressed="false">Ближе</button><button data-model-rotate aria-pressed="false">Вращение</button></div><button data-model-photo>К фото</button></div><p class="form-viewer-note">Точная форма из 3D-модели Salini. Потяните для поворота. Цвет и блеск на экране — приближение.</p></section>`;
  }
  function waterChapter(form) {
    return `<section class="water-fill water-journey" id="water-fill" aria-labelledby="water-title"><div class="water-fill-stage">
      <div class="water-fill-visual" data-water-canvas aria-hidden="true"></div>
      <div class="journey-atmosphere">${picture('story-water','Художественная сцена: вода и камень','experience-scene')}</div>
      <div class="journey-shade" aria-hidden="true"></div>
      <div class="water-fill-poster"><button class="button" data-water-load>Войти в водную сцену <span>↗</span></button></div>
      <div class="journey-captions">
        <div data-water-caption class="journey-copy is-current"><span class="eyebrow">SALINI · L’ANIMA DELL’ACQUA</span><h1 id="water-title">Вода<br><em>обретает</em><br>форму.</h1><p>Следуйте за течением.<br>Одно движение — целый мир.</p><button class="journey-start" data-journey-to="0.17">Начать путешествие <span>↓</span></button></div>
        <div data-water-caption class="journey-copy" aria-hidden="true" inert><span class="eyebrow">01 / ТЕЧЕНИЕ</span><h2>У воды<br>нет границ.</h2><p>Тонкая завеса.<br>Свет, который проходит насквозь.</p></div>
        <div data-water-caption class="journey-copy" aria-hidden="true" inert><span class="eyebrow">02 / МАТЕРИЯ</span><h2>У камня<br>есть <em>душа.</em></h2><p>Минеральное литьё.<br>Мягкая линия. Тактильная поверхность.</p><a href="#/materials">S-Stone и S-Sense ↗</a></div>
        <div data-water-caption class="journey-copy" aria-hidden="true" inert><span class="eyebrow">03 / ФОРМА — LUCE</span><h2>Течение<br>становится<br><em>тишиной.</em></h2><p>Вода поднимается.<br>Форма раскрывается.</p></div>
        <div data-water-caption class="journey-copy journey-last" aria-hidden="true" inert><span class="eyebrow">04 / ВАШЕ ПРОСТРАНСТВО</span><h2>Остаётся<br>только <em>быть.</em></h2><p>Личное пространство Salini.<br>Ваша форма спокойствия.</p><button class="journey-touch" data-water-touch>Коснитесь воды <span>◌</span></button><button class="journey-start" data-chapter="form">Найти свою форму <span>↗</span></button></div>
      </div>
      <div class="journey-bottom"><div class="journey-route" role="group" aria-label="Главы путешествия"><button data-journey-to="0" aria-label="Начало путешествия" aria-pressed="true">00</button><i></i><button data-journey-to="0.20" aria-pressed="false">Вода</button><i></i><button data-journey-to="0.40" aria-pressed="false">Материя</button><i></i><button data-journey-to="0.64" aria-pressed="false">Форма</button><i></i><button data-journey-to="0.97" aria-pressed="false">Вы</button></div><div class="journey-navigation"><span class="journey-scroll-hint">СКРОЛЛ — ВАШЕ ДВИЖЕНИЕ ВНУТРИ ИСТОРИИ</span><button data-water-pause aria-pressed="false">Пауза</button><a href="experience/#form" data-chapter="form">К коллекции ↗</a></div><label class="journey-scrubber">Положение в истории<input data-water-level type="range" min="0" max="100" value="0" aria-label="Положение в истории"></label></div>
      <p class="water-fill-status" data-water-status role="status"></p>
    </div></section>`;
  }
  function render(products) {
    const form = products.find(p=>p.id==='1364');
    return `<article class="water-experience">${waterChapter(form)}<section class="experience-form" id="form"><div class="wrap"><div class="experience-form-title"><div><span class="eyebrow">03 / ФОРМА</span><h2>Природа линий.<br><em>Ваше прикосновение.</em></h2></div><p>Поверните форму. Измените светлый тон на глубокий. Посмотрите, как один предмет меняет ощущение пространства.</p></div><div class="experience-form-layout"><div data-story-viewer>${viewer(form,{large:true})}</div><div class="experience-form-controls"><span class="eyebrow">СКУЛЬПТУРЫ ДЛЯ ЖИЗНИ</span><div class="story-form-choices" role="group" aria-label="Выбрать 3D-форму">${[['1361','Ninfea'],['1120','Greca'],['1364','Luce'],['1139','Noemi']].map(([id,name])=>`<button data-story-form="${id}" aria-pressed="${id===form.id}">${name}<span>↗</span></button>`).join('')}</div><div class="story-colours" role="group" aria-label="Оттенок 3D-формы">${[['','Молочный белый','#F1F0EA'],['3012','Тёплая глина','#C6846D'],['6034','Вода','#7AADAC'],['6005','Глубокий зелёный','#114232']].map(([code,title,hex])=>`<button class="colour-orb" data-story-ral="${code}" aria-label="${title}${code?' · RAL '+code:''}" aria-pressed="${!code}"><i style="--swatch:${hex}"></i></button>`).join('')}</div><p data-story-colour-label>Базовый белый</p><a class="button button-dark" data-story-product href="#/product/${form.id}">Выбрать Luce <span>↗</span></a><p class="small-note">Официальная геометрия изделия. Выбранный оттенок переносится в карточку; точный цвет подтверждают по физическому образцу.</p></div></div></div></section><section class="journey-afterword wrap" aria-label="Атмосфера воды и камня"><a href="#/materials">${picture('story-mineral','Крупный план воды на минеральной поверхности')}<span>Текучая. Тактильная.<br><em>Вечная в ощущении.</em><small>S-Stone и S-Sense ↗</small></span></a><a href="#/projects">${picture('story-water','Вода и камень в воображаемом пространстве Salini')}<span>Предмет обретает<br><em>свой мир.</em><small>Галерея интерьеров ↗</small></span></a></section><section class="experience-ritual wrap" id="ritual"><span class="eyebrow">04 / ВАШЕ ПРОСТРАНСТВО</span><h2>Форма становится<br><em>чувством.</em></h2><p class="experience-ritual-lead">Salini соединяет итальянскую эстетику, авторский дизайн и собственное производство в России. За каждой формой — материал, технология минерального литья и мастерство людей.</p><div class="experience-ritual-links"><a href="#/about"><span>От замысла к предмету</span><strong>История Salini</strong><span aria-hidden="true">↗</span></a><a href="#/projects"><span>Предмет обретает дом</span><strong>Интерьеры</strong><span aria-hidden="true">↗</span></a><a href="#/catalog"><span>Продолжите свою историю</span><strong>Найти форму</strong><span aria-hidden="true">↗</span></a></div><p class="experience-credit">Пространства воды и камня — художественные образы, созданные для этой истории. 3D-формы — модели Salini. История бренда и сведения о материалах — по официальным источникам.</p></section></article>`;
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
  // A single small shader refracts the still water; the architecture stays still.
  // No external renderer, simulation, audio or continuous work outside the viewport.
  function waterLight(scene,isMoving) {
    const img=scene.querySelector('img'),canvas=document.createElement('canvas');
    canvas.className='water-light';canvas.setAttribute('aria-hidden','true');
    const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
    if(!gl)return ()=>{};
    let dead=false,ready=false,visible=false,frame=0,last=0,texture,program,buffer;
    function shader(type,source){const value=gl.createShader(type);gl.shaderSource(value,source);gl.compileShader(value);if(!gl.getShaderParameter(value,gl.COMPILE_STATUS)){gl.deleteShader(value);throw Error('Water shader unavailable');}return value;}
    try {
      const vertex=shader(gl.VERTEX_SHADER,'attribute vec2 a;varying vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}');
      const fragment=shader(gl.FRAGMENT_SHADER,`precision mediump float;varying vec2 uv;uniform sampler2D photo;uniform float time;uniform vec2 crop;uniform vec2 offset;
        void main(){vec2 p=uv*crop+offset;float pool=smoothstep(.31,.08,p.y);float fall=smoothstep(.07,.0,abs(p.x-.68))*smoothstep(.28,.4,p.y);
        float wave=sin(p.x*72.+p.y*90.-time*1.5)*sin(p.x*29.-p.y*48.+time*.8);
        vec2 flow=vec2(wave*.0017*pool+sin(p.y*160.-time*3.)*.0007*fall,cos(p.x*65.+time)*.00065*pool);
        vec3 color=texture2D(photo,clamp(p+flow,vec2(.001),vec2(.999))).rgb;
        color+=vec3(.014,.018,.015)*wave*pool;gl_FragColor=vec4(color,1.);}`);
      program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Water link unavailable');
      gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
      texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    }catch{if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer);if(texture)gl.deleteTexture(texture);return ()=>{};}
    const time=gl.getUniformLocation(program,'time'),crop=gl.getUniformLocation(program,'crop'),offset=gl.getUniformLocation(program,'offset');
    function resize(){const box=scene.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,1.75),scale=Math.min(1,2200/(box.width*ratio));canvas.width=Math.round(box.width*ratio*scale);canvas.height=Math.round(box.height*ratio*scale);gl.viewport(0,0,canvas.width,canvas.height);const cover=Math.max(box.width/img.naturalWidth,box.height/img.naturalHeight),x=box.width/(img.naturalWidth*cover),y=box.height/(img.naturalHeight*cover);gl.uniform2f(crop,x,y);gl.uniform2f(offset,(1-x)*(innerWidth<=700?.64:.65),(1-y)*.5);}
    function draw(now){frame=0;if(dead||!ready||!visible||document.hidden||!isMoving())return;if(now-last>40){last=now;gl.uniform1f(time,now*.001);gl.drawArrays(gl.TRIANGLES,0,6);}frame=requestAnimationFrame(draw);}
    function sync(){cancelAnimationFrame(frame);frame=0;canvas.hidden=!isMoving();if(ready&&visible&&!document.hidden&&isMoving())frame=requestAnimationFrame(draw);}
    function loaded(){if(dead||!img.naturalWidth)return;try{gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);resize();gl.uniform1f(time,0);gl.drawArrays(gl.TRIANGLES,0,6);ready=true;scene.append(canvas);sync();}catch{canvas.remove();}}
    img.addEventListener('load',loaded);if(img.complete)loaded();
    const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});io.observe(scene);
    const ro=new ResizeObserver(()=>{if(ready){resize();sync();}});ro.observe(scene);
    document.addEventListener('visibilitychange',sync);scene.addEventListener('salini:motion',sync);
    const restart=()=>{if(!frame&&ready&&visible&&isMoving())sync();};addEventListener('scroll',restart,{passive:true});
    canvas.addEventListener('webglcontextlost',()=>{ready=false;cancelAnimationFrame(frame);canvas.remove();});
    return ()=>{dead=true;cancelAnimationFrame(frame);io.disconnect();ro.disconnect();img.removeEventListener('load',loaded);document.removeEventListener('visibilitychange',sync);scene.removeEventListener('salini:motion',sync);removeEventListener('scroll',restart);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);canvas.remove();};
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
    const story=root.querySelector('.water-experience'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let moving=!reduce.matches&&!navigator.connection?.saveData;
    function syncMotion(){story.classList.toggle('is-still',!moving);root.querySelector('.water-fill')?.dispatchEvent(new Event('salini:motion'));}
    const reduced=()=>{moving=!reduce.matches&&!navigator.connection?.saveData;syncMotion();};reduce.addEventListener('change',reduced);cleanup.push(()=>reduce.removeEventListener('change',reduced));
    const fill=root.querySelector('.water-fill');
    const opening=fill.querySelector('.experience-scene');
    if(!navigator.connection?.saveData&&!reduce.matches)cleanup.push(waterLight(opening,()=>moving&&!reduce.matches&&Number(fill.querySelector('.water-fill-stage').style.getPropertyValue('--water-progress'))<.15&&fill.querySelector('[data-water-pause]').getAttribute('aria-pressed')!=='true'));
    const openingMotion=()=>queueMicrotask(()=>opening.dispatchEvent(new Event('salini:motion')));fill.querySelector('[data-water-pause]').addEventListener('click',openingMotion);cleanup.push(()=>fill.querySelector('[data-water-pause]').removeEventListener('click',openingMotion));
    if(!reduce.matches&&!navigator.connection?.saveData)fill.classList.add('is-water-enabled');
    let fillStarted=false,fillDead=false,fillDispose;
    const receiveDisposer=e=>{fillDispose=e.detail;};fill.addEventListener('salini:water-dispose',receiveDisposer);
    async function startFill(){
      if(fillStarted||fillDead)return;fillStarted=true;fill.classList.add('is-water-loading');
      const button=fill.querySelector('[data-water-load]');button.disabled=true;button.textContent='Свет. Вода. Форма…';
      try{const module=await import(new URL(`water-fill.js?v=${waterVersion}`,document.baseURI));if(fillDead)return;
        await module.mountWaterFill(fill,{isMoving:()=>moving});
      }catch{fill.classList.remove('is-water-loading');fill.classList.add('is-water-fallback');fill.querySelector('[data-water-status]').textContent='Водная сцена недоступна. Фотографии и выбор коллекции — ниже.';}
    }
    fill.querySelector('[data-water-load]').addEventListener('click',startFill);
    const fillObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!reduce.matches&&!navigator.connection?.saveData){startFill();fillObserver.disconnect();}},{rootMargin:'550px'});fillObserver.observe(fill);
    cleanup.push(()=>{fillDead=true;fillObserver.disconnect();fillDispose?.();fill.removeEventListener('salini:water-dispose',receiveDisposer);});
    root.querySelectorAll('[data-chapter]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();root.querySelector('#'+link.dataset.chapter)?.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});}));
    function formLink(){const p=products.find(p=>p.id===chosen),v=p.variants.find(v=>v.material==='sStone')||p.variants[0],params=new URLSearchParams({variant:v.id});if(ral)params.set('ral',ral);const a=root.querySelector('[data-story-product]');a.href=`#/product/${chosen}?${params}`;a.innerHTML=`Выбрать ${esc(p.collection||p.name)} <span>↗</span>`;}
    function mountForm(){const p=products.find(p=>p.id===chosen);current?.dispose();const holder=root.querySelector('[data-story-viewer]');holder.innerHTML=viewer(p,{large:true});current=mountViewer(holder.querySelector('[data-form-viewer]'),()=>({ral,finish:'matte'}));formLink();}
    mountForm();
    root.querySelectorAll('[data-story-form]').forEach(button=>button.addEventListener('click',()=>{if(chosen===button.dataset.storyForm)return;chosen=button.dataset.storyForm;root.querySelectorAll('[data-story-form]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));mountForm();}));
    root.querySelectorAll('[data-story-ral]').forEach(button=>button.addEventListener('click',()=>{ral=button.dataset.storyRal;root.querySelectorAll('[data-story-ral]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));root.querySelector('[data-story-colour-label]').textContent=ral?'RAL '+ral:'Базовый белый';current?.appearance();formLink();}));
    // Chapter buttons follow the same native page position as touch and wheel.
    root.querySelectorAll('[data-journey-to]').forEach(button=>button.addEventListener('click',()=>{
      if(fill.classList.contains('is-water-fallback')||!fill.classList.contains('is-water-enabled')){root.querySelector('#form').scrollIntoView({behavior:reduce.matches?'instant':'smooth'});return;}
      const stage=fill.querySelector('.water-fill-stage');
      const top=fill.getBoundingClientRect().top+scrollY;
      scrollTo({top:top+Number(button.dataset.journeyTo)*(fill.offsetHeight-stage.offsetHeight),behavior:reduce.matches?'instant':'smooth'});
    }));

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
