# Источники контента

Логотип, фотографии коллекций и изделий, названия, размеры и документы относятся к Salini и их правообладателям. Их использование здесь — работа над сайтом Salini по запросу пользователя; этот репозиторий не предоставляет независимую лицензию на перепубликацию брендовых материалов.

Источники: https://salini-srl.com/, страницы каталога и коллекций, официальный CDN `cdn-salini.storage.yandexcloud.net`. Точные URL каждого товара и фотографии содержатся в `catalog.json`; редакционных изображений — в исходной документации проекта. Дата полного снимка: 06.10.2026. Главная, карточка Paola 172, категории и сервисные переходы дополнительно проверены 22.10.2026.

Фотография главной Paola — официальный файл `JPEG_3840 s polyami .jpg`, официального сайта Salini. Для телефона используется адаптивный кроп того же изображения. Фотографии карточек показываются целиком. Два изделия без изображения имеют явное состояние отсутствующей фотографии. Происхождение художественных водных фильмов указано ниже.

Manrope и Cormorant Garamond распространяются по SIL Open Font License 1.1; тексты лицензий находятся в `licenses/MANROPE-OFL.txt` и `licenses/CORMORANT-OFL.txt`. Шрифты загружаются локально. SF Symbols и шрифты Apple в веб-ассеты не копировались. На iOS используются настоящие системные компоненты и системный serif.

Figma — референс структуры и художественного направления, файл `RXkEQMUtsuRqBYjSaXrQsa`, Desktop 14038:18751, Mobile 14247:3744. Устаревшие цены и акции из референса не перенесены. Редакционные тексты нового сайта — проект новой подачи, а не цитаты или новые коммерческие гарантии бренда.


## Полный перенос и материалы · 23.10.2026

Редакционные тексты, коллекции, проекты, Академия и фотографии взяты из официального сайта Salini. Исходные URL, даты снимков и статусы current/archive присутствуют в `editorial.json`; для сервиса и салонов — в `support.json`. Архивный материал не является подтверждением сегодняшних цен, наличия или условий. Технические файлы открываются у первоисточника.

`essence-original-stone-*.webp` и `essence-original-sense-*.webp` — исходные графические слои официального Salini из `/local/templates/main/assets/images/webp/`. `essence-stone-mass`, `essence-stone-fragment`, `essence-sense-core-*`, `essence-sense-cap-*` — художественные иллюстрации, ранее созданные для собственного нативного приложения Salini и повторно используемые здесь. Это условные изображения структуры материала, не фотографии точного инженерного разреза.

Изображения других интерьерных брендов из дизайн-исследования в сайт не включены.

## Детали главной · 23.10.2026

`essence-stone-cutaway-v4.webp` и `essence-sense-cutaway-v4.webp` — новые художественные иллюстрации, созданные встроенным image_gen по референсам исходного одиночного фрагмента стенки Salini. Геометрия предыдущего варианта с лишним изгибом отклонена и в релиз не входит. Иллюстрации не являются фотографиями изделий или инженерными чертежами. Приложение использует те же изображения в PNG; общая маска отображения исключает остаточные пиксели по внешнему контуру. Набор промптов сохранён в исходном проекте.

`showroom-film-poster.webp` — оптимизированная версия официального `https://salini-srl.com/local/templates/main/assets/images/about-bg-2.jpg`. Видео `https://salini-srl.com/local/templates/main/assets/videos/salini_about_2.mp4` загружается с Salini только после нажатия; это 10-секундная видеозарисовка шоурума. Отдельная ссылка ведёт на подтверждённый фильм о производстве на Rutube. Фирменный зелёный `#02343B` подтверждён оригинальными CSS и SVG-логотипом Salini.


## Collection cinema — 23.10.2026

`assets/cinema-{ninfea,aria,opera,greca}.mp4` and matching WebP posters reuse the owner-approved generated films in the Salini iOS app, at the owner's explicit request. Ninfea v4; Aria, Opera, Greca v2. Web copies are H.264 640px derivatives without audio; source files remain unchanged. These are artistic collection stories, never product documentation or real showroom footage. Source hashes and conversion settings are retained in the private source manifest.


## Water and form — 23.10.2026

`assets/story-water*.webp` and `assets/story-mineral*.webp` are original artistic images generated with the built-in imagegen tool for this website. They illustrate imagined spaces and materials; they are not photographs of Salini products, facilities or completed interiors. Original PNGs and exact prompts are recorded in the private source project (`research/water-form-2026-10-23/assets.json`). WebP derivatives resize and compress the originals.

The previous procedural filling experiment is retained in source history; the active journey uses the cinematic pavilion described below. Exact interactive product geometry remains the unchanged Salini model. Three.js 0.186.1 is bundled locally under the MIT license (`licenses/THREE-LICENSE.txt`).

`journey-pavilion*.mp4`, `journey-threshold-ambient*.mp4`, `journey-sanctuary-ambient*.mp4` and their WebP posters were created for this project with imagegen and Higgsfield / Kling 3.0. They depict an imagined pavilion and an artistic interpretation of Luce, not a real showroom or product specification. Landscape and portrait films have separate compositions. Ambient water loops play at the entrance and finish. Native scroll steers the passage forward and backward; after the gesture the film continues forward from the current frame. Ambient loops remain at both ends. The interactive 3D viewer uses the official unchanged geometry. Original prompts, references, generation jobs, quality review and conversion settings are retained in the private project. Ambient finishing corrects low-frequency colour/exposure residuals and overlaps 18 moving frames of the same fixed camera at the loop boundary, without geometry warping or reversing frames.

`assets/water-studio-512.hdr` is a 512 × 256 derivative of the studio light already bundled with the iOS app: **Studio Small 09**, Sergej Majboroda / Poly Haven, [source](https://polyhaven.com/a/studio_small_09), [CC0](https://polyhaven.com/license). Only resolution is reduced for mobile delivery. Source and derivative hashes are recorded in the source project's `research/water-form-2026-10-23/water-light.json`.

`assets/model-*.glb` reuse the 13 exact Salini USDZ models bundled with the companion iOS application. Geometry is uniformly scaled to catalogue length, centred, and exported with recomputed normals and browser materials. No product parts are invented. The original attribution and product document rights remain with Salini; this is not an independent licence for reuse. Source and output hashes are retained in the source project. The chrome/body material mapping matches the native viewer. Screen colours and roughness are illustrative approximations.

`assets/model-viewer-4.4.0.min.js` is the locally pinned Google model-viewer 4.4.0 distribution from the npm registry, licensed under Apache-2.0. See `licenses/MODEL-VIEWER-LICENSE.txt`.

Official product studio views and room photographs (`product-*-studio-*.webp`, `product-*-interiors-*.webp`) come from the exact product galleries on salini-srl.com and its CDN. `catalog.json` records the source page, image URL and archive date. Neutral studio backgrounds are preserved; they are not claimed to be transparent cutouts. The 13 `product-*-model-studio.webp` plates are rendered from the matching unchanged Salini GLB geometry with transparent backgrounds, uniform framing and soft studio lights. Model hashes and render provenance are recorded with each plate. Product rights remain with Salini.

## Product studio — 24.10.2026

`assets/studio-neutral-1024.hdr` is an original procedural, achromatic studio light rig generated by `scripts/build-studio-light.py`: large softboxes, a narrow rim source and neutral ambient illumination. It contains no photographic or third-party image content. The 1024 × 512 RGBE file is 89,642 bytes.

The 13 `model-*-pbr.glb` files derive from the existing corresponding Salini GLBs. Only body material extension metadata (`KHR_materials_ior`, `KHR_materials_clearcoat`) is added. All geometry buffer bytes and non-body materials are unchanged. Original GLBs remain available; hashes are recorded in `shared/web-models-pbr.json`. Runtime finish profiles, including roughness, IOR and coating, are visual approximations rather than physical measurements supplied by Salini. The material rights remain with Salini.
