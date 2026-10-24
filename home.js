"use strict";
window.SaliniHome = (() => {
  let observer, visibilityListener, activePlayer, listeners=[];
  function listen(node,event,handler){node.addEventListener(event,handler);listeners.push(()=>node.removeEventListener(event,handler));}
  function closeVideo(restoreFocus=false){
    if(!activePlayer)return;
    const {stage,cover,frame,nativeVideo,feedback}=activePlayer;activePlayer=null;
    if(nativeVideo){frame.pause();frame.removeAttribute('src');frame.load();}
    feedback?.remove();stage.replaceChildren(cover);stage.classList.remove('is-playing');
    if(restoreFocus)cover.focus();
  }
  function dispose(){
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
    const toggle=section.querySelector('[data-motion-toggle]');
    toggle.hidden=true;
    let paused=false,inView=false;
    const update=()=>{section.classList.toggle('is-visible',inView&&!document.hidden);section.classList.toggle('is-paused',paused);};
    if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;update();},{threshold:.08});observer.observe(section);}else{inView=true;update();}
    visibilityListener=update;document.addEventListener('visibilitychange',update);
    listen(toggle,'click',()=>{paused=!paused;toggle.setAttribute('aria-pressed',String(paused));toggle.innerHTML=paused?'Включить движение <span aria-hidden="true">▷</span>':'Остановить движение <span aria-hidden="true">Ⅱ</span>';update();});
    section.querySelectorAll('[data-inspect]').forEach(button=>listen(button,'click',()=>{
      const card=button.closest('.essence-card'),open=button.getAttribute('aria-pressed')!=='true';
      button.setAttribute('aria-pressed',String(open));
      card.querySelector('.essence-original').hidden=open;card.querySelector('.essence-inside').hidden=!open;
      button.innerHTML=open?'<span aria-hidden="true">−</span> К поверхности':'<span aria-hidden="true">+</span> Камень изнутри';
    }));
  }
  return {mount,dispose};
})();
