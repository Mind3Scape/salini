/* Shared catalogue presentation. Product facts remain in the canonical catalogue. */
window.SaliniAtelier = (() => {
  const launched = ['30897','32698','30919'];
  const colours = [["9016", "Транспортный белый", "#F1F0EA"], ["9010", "Чистый белый", "#F1ECE1"], ["9003", "Сигнальный белый", "#ECECE7"], ["9001", "Кремово-белый", "#E9E0D2"], ["1013", "Жемчужно-белый", "#E3D9C6"], ["1015", "Светлая слоновая кость", "#E6D2B5"], ["1001", "Бежевый", "#D0B084"], ["1019", "Серо-бежевый", "#A48F7A"], ["9002", "Серо-белый", "#D7D5CB"], ["7035", "Светло-серый", "#CBD0CC"], ["7044", "Шёлковисто-серый", "#B7B3A8"], ["7004", "Сигнальный серый", "#9C9C9C"], ["7037", "Пыльно-серый", "#7A7B7A"], ["7016", "Антрацитово-серый", "#383E42"], ["7021", "Чёрно-серый", "#2F3234"], ["9011", "Графитовый чёрный", "#1C1E20"], ["9005", "Глубокий чёрный", "#0E0E10"], ["8017", "Шоколадно-коричневый", "#45302B"], ["3005", "Винно-красный", "#59191F"], ["3012", "Бежево-красный", "#C6846D"], ["3015", "Светло-розовый", "#D8A0A6"], ["6019", "Бело-зелёный", "#B9CEAC"], ["6021", "Бледно-зелёный", "#89AC76"], ["6011", "Резедово-зелёный", "#68825B"], ["6005", "Зелёный мох", "#114232"], ["6034", "Пастельно-бирюзовый", "#7AADAC"], ["5024", "Пастельно-синий", "#6093AC"], ["5014", "Голубино-синий", "#637D96"], ["5003", "Сапфирово-синий", "#1F3855"], ["5011", "Стальной синий", "#1A2B3C"]];
  const stories = [
    ['ninfea','Ninfea','Природа обретает форму.','Вдохновлена водяной лилией.'],
    ['aria','Aria','Архитектура спокойствия.','Чистота линии. Сила формы.'],
    ['opera','Opera','Классика. Вне времени.','Искусство повседневного ритуала.'],
    ['greca','Greca','Свой характер. Свой ритм.','Пластика камня в интерьере.']
  ];
  const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cleanups=[];
  const isNew = p => launched.includes(String(p.id));
  const allowsRAL = v => Boolean(v && (v.customColourSku || ['sStone','sSense'].includes(v.material)));
  const colourable = p => p.variants.some(allowsRAL);
  function cardStyle(p) {
    const tones=p.presentation?.studio?.backdrop;
    return tones?`--studio-top:${esc(tones[0])};--studio-bottom:${esc(tones[1])}`:'';
  }
  function cardImage(p) {
    const photo=p.presentation?.studio||p.image;
    if(!photo)return '<div class="no-photo"><span>salini</span><small>Фотография уточняется</small></div>';
    return `<img src="${esc(photo.src)}" alt="${esc(p.name)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">`;
  }
  function catalogIntro() {
    return `<header class="catalog-intro wrap"><div class="catalog-intro-copy"><div class="breadcrumb"><a href="#/">Главная</a><span>/</span><span>Каталог</span></div><span class="eyebrow">COLLEZIONI SALINI</span><h1>Форма вашего<br><em>пространства.</em></h1><p>Выразительные силуэты. Тактильные материалы.<br>Предметы, с которых начинается ваш интерьер.</p><button class="catalog-browse" data-catalog-browse>Найти свою форму <span aria-hidden="true">↓</span></button></div><a class="catalog-intro-image" href="#/collection/paola"><img src="assets/hero-paola.webp" width="2400" height="1350" alt="Paola — цвет и форма в интерьере Salini"><span><i>Коллекция</i>Paola <b aria-hidden="true">↗</b></span></a></header>`;
  }
  function catalogStory() {
    return `<aside class="catalog-story"><img src="assets/ninfea.webp" alt="Ninfea в интерьере" width="1600" height="900" loading="lazy"><div><span class="eyebrow">СВОЙ ХАРАКТЕР. СВОЙ РИТМ.</span><h2>Предмет, который<br><em>меняет ощущение.</em></h2><a class="line-link" href="#/collection/ninfea">Открыть Ninfea <span>↗</span></a></div></aside>`;
  }
  function cardDetails(p) {
    return `<div class="card-finishes"><span>${esc(p.materials.join(' / '))}</span>${colourable(p)?`<a class="card-colour-link" href="#/product/${encodeURIComponent(p.id)}?choose=colour" aria-label="Выбрать цвет ${esc(p.name)}"><i style="--swatch:#F1F0EA"></i><i style="--swatch:#C6846D"></i><i style="--swatch:#7AADAC"></i><span>Цвет ↗</span></a>`:''}</div>`;
  }
  function newSection(products,card) {
    return `<section class="atelier-new wrap" aria-labelledby="atelier-new-title"><div class="section-heading"><div><span class="eyebrow">Новая глава Salini</span><h2 id="atelier-new-title">Знакомые чувства.<br> <em>Новые формы.</em></h2></div><a class="line-link" href="#/catalog?new=1">Новинки в каталоге <span>↗</span></a></div><div class="atelier-new-grid">${launched.map(id=>products.find(p=>p.id===id)).filter(Boolean).map(card).join('')}</div><div class="atelier-new-footer"><p>Opera, Operetta и Opera Top — выпущенные изделия из раздела новинок Salini.</p><a class="line-link" href="#/new">Все новинки и будущие коллекции ↗</a></div></section>`;
  }
  function cinema(initial='ninfea') {
    const story=stories.find(s=>s[0]===initial)||stories[0];
    return `<section class="atelier-cinema wrap" data-cinema aria-label="Живые истории коллекций"><div class="water-copy"><span class="eyebrow">L’anima dell’acqua · Живые коллекции</span><h2>Вода.<br> <em>Форма. Чувство.</em></h2><p>Четыре водные истории. Движение света, мягкость линий и характер каждой коллекции.</p><div class="water-choices" role="group" aria-label="Выбрать историю коллекции">${stories.map(s=>`<button type="button" data-cinema-story="${s[0]}" aria-pressed="${s[0]===story[0]}">${s[1]}</button>`).join('')}</div><div class="water-caption"><h3 data-cinema-headline>${story[2]}</h3><p data-water-caption>${story[3]}</p></div><a class="line-link" data-cinema-link href="#/collection/${story[0]}">Исследовать ${story[1]} ↗</a><small>Художественная история коллекции. Фотографии и характеристики изделий — в каталоге.</small></div><div class="water-stage"><video data-cinema-video muted loop playsinline preload="none" poster="assets/cinema-${story[0]}.webp" aria-label="Водная история ${story[1]}"></video><button type="button" class="water-toggle" data-water-toggle aria-pressed="false">Включить движение ▷</button><span class="water-name" aria-hidden="true">${story[1]}</span></div></section>`;
  }
  function mountCinema(root) {
    root.querySelectorAll('[data-cinema]').forEach(section=>{
      const video=section.querySelector('video'),button=section.querySelector('[data-water-toggle]');
      const reduce=matchMedia('(prefers-reduced-motion: reduce)');
      let chosen=section.querySelector('[data-cinema-story][aria-pressed="true"]').dataset.cinemaStory;
      let visible=false,wantsMotion=!reduce.matches&&!navigator.connection?.saveData,dead=false;
      function pause(){video.pause();button.hidden=false;button.textContent='Включить движение ▷';button.setAttribute('aria-pressed','false');}
      function sync(){
        if(dead)return;
        if(!visible||document.hidden||!wantsMotion){pause();return;}
        if(!video.getAttribute('src')) video.src=`assets/cinema-${chosen}.mp4`;
        video.muted=true;
        video.play().then(()=>{if(dead||!visible||!wantsMotion||document.hidden){pause();return;}button.hidden=true;button.setAttribute('aria-pressed','true');}).catch(error=>{if(error.name!=='AbortError')pause();});
      }
      const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.35});io.observe(section.querySelector('.water-stage'));
      button.addEventListener('click',()=>{wantsMotion=!wantsMotion;sync();});
      section.querySelectorAll('[data-cinema-story]').forEach(b=>b.addEventListener('click',()=>{
        if(chosen===b.dataset.cinemaStory)return;
        pause();video.removeAttribute('src');video.load();chosen=b.dataset.cinemaStory;
        const s=stories.find(s=>s[0]===chosen);video.poster=`assets/cinema-${chosen}.webp`;video.setAttribute('aria-label','Водная история '+s[1]);
        section.querySelectorAll('[data-cinema-story]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
        section.querySelector('[data-cinema-headline]').textContent=s[2];section.querySelector('[data-water-caption]').textContent=s[3];section.querySelector('.water-name').textContent=s[1];
        const link=section.querySelector('[data-cinema-link]');link.href=s[0]==='aria'?'#/catalog?collection=Aria':'#/collection/'+s[0];link.textContent='Исследовать '+s[1]+' ↗';sync();
      }));
      const change=()=>{if(reduce.matches)wantsMotion=false;sync();};
      document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',change);
      cleanups.push(()=>{dead=true;io.disconnect();document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',change);pause();video.removeAttribute('src');video.load();});
    });
  }
  function dispose(){cleanups.forEach(f=>f());cleanups=[];}
  return {isNew,launched,colours,cardStyle,cardImage,catalogIntro,catalogStory,allowsRAL,colourable,cardDetails,newSection,cinema,mountCinema,dispose};
})();
