"use strict";
window.SaliniHome = (() => {
  let observer, visibilityListener;
  function dispose(){observer?.disconnect();if(visibilityListener)document.removeEventListener('visibilitychange',visibilityListener);}
  function mount(root){
    dispose();
    const section=root.querySelector('.essence-section');if(!section)return;
    const toggle=section.querySelector('[data-motion-toggle]');
    let paused=false,inView=false;
    const update=()=>{section.classList.toggle('is-visible',inView&&!document.hidden);section.classList.toggle('is-paused',paused);};
    if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;update();},{threshold:.08});observer.observe(section);}else{inView=true;update();}
    visibilityListener=update;document.addEventListener('visibilitychange',update);
    toggle.addEventListener('click',()=>{paused=!paused;toggle.setAttribute('aria-pressed',String(paused));toggle.innerHTML=paused?'Включить движение <span aria-hidden="true">▷</span>':'Остановить движение <span aria-hidden="true">Ⅱ</span>';update();});
    section.querySelectorAll('[data-inspect]').forEach(button=>button.addEventListener('click',()=>{
      const card=button.closest('.essence-card'),open=button.getAttribute('aria-pressed')!=='true';
      button.setAttribute('aria-pressed',String(open));
      card.querySelector('.essence-original').hidden=open;card.querySelector('.essence-inside').hidden=!open;
      button.innerHTML=open?'<span aria-hidden="true">−</span> К поверхности':'<span aria-hidden="true">+</span> Камень изнутри';
    }));
  }
  return {mount,dispose};
})();
