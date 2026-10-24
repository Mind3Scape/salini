"use strict";
window.SaliniHome = (() => {
  let observer, visibilityListener, activePlayer, cleanupEssence, listeners=[];
  function listen(node,event,handler,options){node.addEventListener(event,handler,options);listeners.push(()=>node.removeEventListener(event,handler,options));}
  function closeVideo(restoreFocus=false){
    if(!activePlayer)return;
    const {stage,cover,frame,nativeVideo,feedback}=activePlayer;activePlayer=null;
    if(nativeVideo){frame.pause();frame.removeAttribute('src');frame.load();}
    feedback?.remove();stage.replaceChildren(cover);stage.classList.remove('is-playing');
    if(restoreFocus)cover.focus();
  }
  function dispose(){
    cleanupEssence?.();cleanupEssence=null;
    closeVideo();observer?.disconnect();observer=null;
    if(visibilityListener)document.removeEventListener('visibilitychange',visibilityListener);
    visibilityListener=null;listeners.forEach(remove=>remove());listeners=[];
  }
  function mount(root){
    dispose();
    root.querySelectorAll('[data-home-video]').forEach(cover=>listen(cover,'click',event=>{
      if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const src=cover.dataset.homeVideo,stage=cover.closest('[data-home-player]');
      const nativeVideo=src==='https://salini-srl.com/local/templates/main/assets/videos/salini_about_2.mp4';
      if(!stage||(!nativeVideo&&!/^https:\/\/rutube\.ru\/play\/embed\/[a-f0-9]{32}\/?$/.test(src)))return;
      event.preventDefault();closeVideo();
      const frame=document.createElement(nativeVideo?'video':'iframe');
      frame.title=cover.dataset.videoTitle||'Видео Salini';
      const feedback=message=>{
        if(activePlayer?.frame!==frame)return;
        activePlayer.feedback?.remove();
        const note=document.createElement('p'),link=document.createElement('a');
        note.className='home-video-error';note.setAttribute('role','status');note.append(document.createTextNode(message+' '));
        link.href=src;link.target='_blank';link.rel='noopener';link.className='line-link';link.textContent='Открыть исходное видео ↗︎';note.append(link);
        stage.insertAdjacentElement('afterend',note);activePlayer.feedback=note;
      };
      if(nativeVideo){
        frame.controls=true;frame.playsInline=true;frame.preload='metadata';frame.poster=cover.querySelector('img')?.getAttribute('src')||'assets/showroom-film-poster.webp';
        frame.setAttribute('playsinline','');frame.setAttribute('aria-label',frame.title);
        frame.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#111;border-radius:inherit';
        frame.addEventListener('error',()=>feedback('Не удалось загрузить видеозарисовку.'));
      }else{
        frame.allow='fullscreen; picture-in-picture; encrypted-media';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
      }
      frame.src=src;
      const close=document.createElement('button');close.type='button';close.className='home-video-close';close.textContent='Закрыть видео';
      close.addEventListener('click',()=>closeVideo(true),{once:true});
      stage.replaceChildren(frame,close);stage.classList.add('is-playing');activePlayer={stage,cover,frame,nativeVideo};frame.focus();
      if(nativeVideo)frame.play()?.catch(error=>{
        if(error.name==='NotAllowedError')feedback('Нажмите кнопку воспроизведения в плеере.');
        else if(error.name!=='AbortError')feedback('Не удалось запустить видеозарисовку.');
      });
    }));
    const section=root.querySelector('.essence-section');if(!section)return;
    mountEssence(section);
  }

  function mountEssence(section){
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards=[...section.querySelectorAll('[data-essence]')];
    let inView=false,disposed=false,raf=0;
    const states=cards.map(card=>({card,stage:card.querySelector('.essence-stage'),button:card.querySelector('[data-inspect]'),inside:card.querySelector('.essence-inside'),video:card.querySelector('.essence-film'),open:false,resolved:false,started:false,timer:0,closeTimer:0,token:0,depth:0,target:0}));
    const settle=s=>{
      if(!s.open||disposed)return;
      clearTimeout(s.timer);s.resolved=true;s.video.pause();
      s.card.classList.remove('is-loading','is-film-playing');s.card.classList.add('is-resolved');
      s.inside.removeAttribute('aria-busy');
    };
    const play=s=>{
      if(disposed||!s.open||s.resolved||!inView||document.hidden||reduced.matches)return;
      const token=s.token;
      s.video.play()?.catch(()=>{if(s.token===token)settle(s);});
    };
    const close=s=>{
      s.open=false;s.token++;clearTimeout(s.timer);clearTimeout(s.closeTimer);s.video.pause();
      s.card.classList.remove('is-inspecting','is-loading');
      s.button.setAttribute('aria-expanded','false');s.button.setAttribute('aria-pressed','false');
      s.button.innerHTML='<span aria-hidden="true">+</span> Камень изнутри';
      s.inside.setAttribute('aria-hidden','true');s.inside.removeAttribute('aria-busy');
      s.closeTimer=setTimeout(()=>{s.inside.hidden=true;s.card.classList.remove('is-resolved','is-film-playing');},reduced.matches?0:650);
    };
    const open=s=>{
      // A click may precede the observer's first delivery after restoring scroll.
      const box=s.stage.getBoundingClientRect();
      inView=box.bottom>0&&box.top<window.innerHeight;
      section.classList.toggle('is-visible',inView&&!document.hidden);
      states.filter(other=>other!==s&&other.open).forEach(close);
      clearTimeout(s.closeTimer);s.token++;s.open=true;s.resolved=false;s.started=false;
      s.inside.hidden=false;s.inside.setAttribute('aria-hidden','false');s.inside.setAttribute('aria-busy','true');
      s.card.classList.remove('is-resolved','is-film-playing');
      void s.inside.offsetWidth; // Start the reveal from its closed opacity after unhiding.
      s.card.classList.add('is-inspecting','is-loading');
      s.button.setAttribute('aria-expanded','true');s.button.setAttribute('aria-pressed','true');
      s.button.innerHTML='<span aria-hidden="true">−</span> К поверхности';
      // A high-resolution final still also works offline or when mobile playback is blocked.
      if(reduced.matches||navigator.connection?.saveData){settle(s);return;}
      if(!s.video.getAttribute('src'))s.video.src=window.innerWidth<=700&&s.video.dataset.mobileSrc?s.video.dataset.mobileSrc:s.video.dataset.src;
      else s.video.currentTime=0;
      s.timer=setTimeout(()=>settle(s),12000);
      play(s);
    };
    states.forEach(s=>{
      listen(s.button,'click',()=>s.open?close(s):open(s));
      listen(s.stage,'keydown',event=>{if(event.key==='Escape'&&s.open){close(s);s.button.focus();}});
      listen(s.video,'playing',()=>{
        if(!s.open||s.resolved||disposed){s.video.pause();return;}
        s.started=true;clearTimeout(s.timer);s.card.classList.remove('is-loading');
        s.card.classList.add('is-film-playing');s.inside.removeAttribute('aria-busy');
      });
      listen(s.video,'ended',()=>settle(s));
      listen(s.video,'error',()=>settle(s));
      listen(s.video,'waiting',()=>{if(s.open&&!s.resolved){clearTimeout(s.timer);s.timer=setTimeout(()=>settle(s),8000);}});
    });
    // Scroll moves the original fragments at different depths; CSS keeps their quiet idle drift.
    const tick=()=>{
      raf=0;if(disposed||!inView||document.hidden||reduced.matches)return;
      let moving=false;
      states.forEach(s=>{
        const delta=s.target-s.depth;s.depth+=delta*.14;
        if(Math.abs(delta)>.001)moving=true;else s.depth=s.target;
        s.stage.style.setProperty('--essence-depth',s.depth.toFixed(4));
      });
      if(moving)raf=requestAnimationFrame(tick);
    };
    const measure=()=>{
      if(!inView||document.hidden||reduced.matches)return;
      const height=window.innerHeight;
      states.forEach(s=>{const box=s.stage.getBoundingClientRect();s.target=Math.max(-1,Math.min(1,(height/2-box.top-box.height/2)/((height+box.height)/2)));});
      if(!raf)raf=requestAnimationFrame(tick);
    };
    const update=()=>{
      section.classList.toggle('is-visible',inView&&!document.hidden);
      if(!inView||document.hidden){cancelAnimationFrame(raf);raf=0;states.forEach(s=>{s.video.pause();clearTimeout(s.timer);});}
      else {measure();states.forEach(s=>{if(s.open&&!s.resolved){clearTimeout(s.timer);s.timer=setTimeout(()=>settle(s),12000);play(s);}});}
    };
    if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;update();},{threshold:.01});observer.observe(section);}else{inView=true;update();}
    const syncViewport=()=>{
      const box=section.getBoundingClientRect(),visible=box.bottom>0&&box.top<window.innerHeight;
      if(inView!==visible){inView=visible;update();}else measure();
    };
    visibilityListener=()=>{syncViewport();update();};document.addEventListener('visibilitychange',visibilityListener);
    listen(window,'scroll',syncViewport,{passive:true});listen(window,'resize',syncViewport,{passive:true});
    syncViewport();
    listen(reduced,'change',()=>{
      cancelAnimationFrame(raf);raf=0;
      if(reduced.matches)states.forEach(s=>{s.stage.style.setProperty('--essence-depth','0');if(s.open)settle(s);});
      else measure();
    });
    cleanupEssence=()=>{
      disposed=true;cancelAnimationFrame(raf);
      states.forEach(s=>{s.token++;clearTimeout(s.timer);clearTimeout(s.closeTimer);s.video.pause();if(s.video.getAttribute('src')){s.video.removeAttribute('src');s.video.load();}});
    };
  }
  return {mount,dispose};
})();
