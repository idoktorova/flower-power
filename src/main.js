const CARE_FIELDS = [
  ['lighting', 'careLighting', '☀️'],
  ['wateringSummer', 'careWateringSummer', '💧'],
  ['wateringWinter', 'careWateringWinter', '❄️'],
  ['humidity', 'careHumidity', '🌫️'],
  ['fertilizer', 'careFertilizer', '🧪'],
  ['dosage', 'careDosage', '🥄'],
  ['temperature', 'careTemperature', '🌡️'],
  ['soil', 'careSoil', '🪴'],
  ['notes', 'careNotes', '🩺'],
];

const I18N = {
  ru: {brand:'Цветочная сила',subtitle:'Уход, который легко помнить',types:'Типы растений',plants:'Мои растения',newType:'Новый тип',newPlant:'Добавить растение',typeName:'Название типа',care:'Инструкция по уходу',save:'Сохранить',plantName:'Имя растения',chooseType:'Выберите тип',bought:'Дата покупки',photo:'Фотографии',qr:'QR-код для горшка',download:'Скачать QR',view:'Посмотреть инфо',water:'Полито',fertilize:'Внесено удобрение',lastCare:'История ухода',never:'Пока нет записей',back:'Назад в кабинет',emptyTypes:'Добавьте первый тип растения',emptyPlants:'Здесь появятся ваши растения',watered:'Полив отмечен',fed:'Удобрение отмечено',edit:'Изменить',delete:'Удалить',cancel:'Отмена',takePhoto:'Добавить фото',uploading:'Отправляем фотографии…',photoSaved:'Фотографии сохранены',photoError:'Часть фото сохранена только на этом устройстве',gallery:'Галерея',galleryHint:'Можно выбрать сразу несколько фото',emptyGallery:'Добавляйте фото, чтобы наблюдать за ростом',removePhoto:'Удалить фото',careLighting:'Освещение',careWateringSummer:'Полив летом',careWateringWinter:'Полив зимой',careHumidity:'Влажность',careFertilizer:'Удобрения',careDosage:'Дозировка',careTemperature:'Температура',careSoil:'Грунт и пересадка',careNotes:'Важно знать',careHint:'Заполните нужные категории; пустые не будут показаны.'},
  en: {brand:'Flower Power',subtitle:'Plant care, easy to remember',types:'Plant types',plants:'My plants',newType:'New type',newPlant:'Add plant',typeName:'Type name',care:'Care instructions',save:'Save',plantName:'Plant name',chooseType:'Choose a type',bought:'Purchase date',photo:'Photos',qr:'Pot QR code',download:'Download QR',view:'View info',water:'Watered',fertilize:'Fertilized',lastCare:'Care history',never:'No records yet',back:'Back to dashboard',emptyTypes:'Add your first plant type',emptyPlants:'Your plants will appear here',watered:'Watering recorded',fed:'Fertilizing recorded',edit:'Edit',delete:'Delete',cancel:'Cancel',takePhoto:'Add photos',uploading:'Uploading photos…',photoSaved:'Photos saved',photoError:'Some photos were saved on this device only',gallery:'Gallery',galleryHint:'You can select several photos at once',emptyGallery:'Add photos to follow the plant’s growth',removePhoto:'Remove photo',careLighting:'Lighting',careWateringSummer:'Watering in summer',careWateringWinter:'Watering in winter',careHumidity:'Humidity',careFertilizer:'Fertilizer',careDosage:'Dosage',careTemperature:'Temperature',careSoil:'Soil & repotting',careNotes:'Good to know',careHint:'Fill in the relevant categories; empty ones will be hidden.'},
  sr: {brand:'Snaga cveća',subtitle:'Nega biljaka koja se lako pamti',types:'Vrste biljaka',plants:'Moje biljke',newType:'Nova vrsta',newPlant:'Dodaj biljku',typeName:'Naziv vrste',care:'Uputstvo za negu',save:'Sačuvaj',plantName:'Ime biljke',chooseType:'Izaberite vrstu',bought:'Datum kupovine',photo:'Fotografije',qr:'QR kod za saksiju',download:'Preuzmi QR',view:'Pogledaj informacije',water:'Zaliveno',fertilize:'Đubreno',lastCare:'Istorija nege',never:'Još nema zapisa',back:'Nazad na kontrolnu tablu',emptyTypes:'Dodajte prvu vrstu biljke',emptyPlants:'Vaše biljke će se pojaviti ovde',watered:'Zalivanje zabeleženo',fed:'Đubrenje zabeleženo',edit:'Izmeni',delete:'Obriši',cancel:'Otkaži',takePhoto:'Dodaj fotografije',uploading:'Šaljemo fotografije…',photoSaved:'Fotografije su sačuvane',photoError:'Neke fotografije su sačuvane samo na ovom uređaju',gallery:'Galerija',galleryHint:'Možete izabrati više fotografija odjednom',emptyGallery:'Dodajte fotografije da pratite rast biljke',removePhoto:'Ukloni fotografiju',careLighting:'Osvetljenje',careWateringSummer:'Zalivanje leti',careWateringWinter:'Zalivanje zimi',careHumidity:'Vlažnost',careFertilizer:'Đubrivo',careDosage:'Doziranje',careTemperature:'Temperatura',careSoil:'Zemlja i presađivanje',careNotes:'Važno je znati',careHint:'Popunite potrebne kategorije; prazne neće biti prikazane.'},
};

const runtimeConfig = await fetch('./api/config').then(response => response.ok ? response.json() : {}).catch(() => ({}));
const seed = {types:[{id:'t1',name:'Монстера',care:{lighting:'Яркий рассеянный свет, без прямого полуденного солнца.',wateringSummer:'Поливать после просыхания верхних 3–5 см почвы.',wateringWinter:'Сократить полив, давая почве просохнуть глубже.',humidity:'50–70%, протирать листья.',fertilizer:'Комплексное удобрение для декоративно-лиственных с марта по сентябрь.',dosage:'½ дозы от указанной на упаковке, раз в 2–4 недели.',temperature:'18–28 °C, беречь от сквозняков.',soil:'Рыхлый грунт с дренажем; пересадка весной по мере заполнения горшка.'}}],plants:[{id:'p1',name:'Моника',typeId:'t1',bought:'2026-05-18',photos:[],events:[{kind:'water',date:new Date(Date.now()-864e5).toISOString()}]}]};
let data = JSON.parse(localStorage.getItem('flower-power-data') || 'null') || seed;
let lang = localStorage.getItem('flower-power-lang') || 'ru';
let modal = null;
let toast = '';
const t = key => I18N[lang][key] || key;
const save = () => localStorage.setItem('flower-power-data', JSON.stringify(data));
const esc = value => String(value || '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const icon = `<svg viewBox="0 0 48 48"><path d="M24 42V22M24 29c-10 0-16-6-16-16 10 0 16 6 16 16Zm0-7c0-10 6-16 16-16 0 10-6 16-16 16Z"/></svg>`;

function normalizeData() {
  data.types.forEach(type => {
    if (typeof type.care === 'string') type.care = {notes: type.care};
    type.care ||= {};
  });
  data.plants.forEach(plant => {
    plant.photos ||= plant.photo ? [plant.photo] : [];
    delete plant.photo;
  });
  save();
}
normalizeData();

function shell(content, client = false) {
  return `<header><a class="logo" href="#">${icon}<span>${t('brand')}<small>${t('subtitle')}</small></span></a><div class="langs">${['ru','en','sr'].map(code => `<button class="${code === lang ? 'active' : ''}" data-lang="${code}">${code.toUpperCase()}</button>`).join('')}</div></header><main class="${client ? 'client' : ''}">${content}</main>${toast ? `<div class="toast">✓ ${toast}</div>` : ''}`;
}

function careSummary(type) {
  return CARE_FIELDS.map(([key]) => type.care?.[key]).filter(Boolean).slice(0, 2).join(' · ') || '—';
}

function careCards(type) {
  const cards = CARE_FIELDS.filter(([key]) => type?.care?.[key]).map(([key,label,emoji]) => `<article class="care-card"><span class="care-icon">${emoji}</span><div><h3>${t(label)}</h3><p>${esc(type.care[key])}</p></div></article>`).join('');
  return cards || `<div class="empty">${t('never')}</div>`;
}

function dashboard() {
  const types = data.types.map(type => `<article class="type-card"><div class="plant-icon">${icon}</div><div><h3>${esc(type.name)}</h3><p>${esc(careSummary(type))}</p></div><div class="actions"><button data-edit-type="${type.id}">${t('edit')}</button><button aria-label="${t('delete')}" data-del-type="${type.id}">×</button></div></article>`).join('') || `<div class="empty">${t('emptyTypes')}</div>`;
  const plants = data.plants.map(plant => {const type = data.types.find(item => item.id === plant.typeId); const cover = plant.photos?.at(-1); return `<article class="plant-card">${cover ? `<img src="${esc(cover)}" alt="${esc(plant.name)}">` : `<div class="placeholder">${icon}</div>`}<div class="plant-body"><span class="tag">${esc(type?.name || '—')}</span><h3>${esc(plant.name)}</h3><p>${t('bought')}: ${plant.bought || '—'} · ${plant.photos?.length || 0} 📷</p><div class="card-buttons"><a href="#plant/${plant.id}">${t('view')}</a><button data-qr="${plant.id}">▦ ${t('qr')}</button></div></div></article>`}).join('') || `<div class="empty">${t('emptyPlants')}</div>`;
  return shell(`<section class="hero"><div><span class="eyebrow">PLANT CARE STUDIO</span><h1>${t('brand')}</h1><p>${t('subtitle')}</p></div><div class="hero-leaves">${icon}</div></section><section><div class="section-head"><div><span>01</span><h2>${t('types')}</h2></div><button class="primary" data-open="type">＋ ${t('newType')}</button></div><div class="types-grid">${types}</div></section><section><div class="section-head"><div><span>02</span><h2>${t('plants')}</h2></div><button class="primary" data-open="plant">＋ ${t('newPlant')}</button></div><div class="plants-grid">${plants}</div></section>${modalHTML()}`);
}

function clientPage(id) {
  const plant = data.plants.find(item => item.id === id);
  if (!plant) return shell(`<div class="empty">Plant not found</div>`, true);
  const type = data.types.find(item => item.id === plant.typeId);
  const events = [...(plant.events || [])].reverse().map(event => `<li><i class="${event.kind}"></i><span>${event.kind === 'water' ? t('water') : t('fertilize')}</span><time>${new Date(event.date).toLocaleString(lang)}</time></li>`).join('') || `<p>${t('never')}</p>`;
  const cover = plant.photos?.at(-1);
  const gallery = plant.photos?.map((photo,index) => `<figure class="gallery-item"><img src="${esc(photo)}" alt="${esc(plant.name)} ${index + 1}" loading="lazy"><button data-remove-photo="${index}" aria-label="${t('removePhoto')}" title="${t('removePhoto')}">×</button></figure>`).join('') || `<div class="empty">${t('emptyGallery')}</div>`;
  return shell(`<a class="back" href="#">← ${t('back')}</a><article class="profile"><div class="profile-photo">${cover ? `<img src="${esc(cover)}" alt="${esc(plant.name)}">` : icon}</div><div class="profile-title"><span class="tag">${esc(type?.name || '—')}</span><h1>${esc(plant.name)}</h1><p>${t('bought')}: ${plant.bought || '—'}</p><label class="camera-button">📷 ${t('takePhoto')}<input data-camera type="file" accept="image/*" multiple></label></div></article><div class="client-actions"><button data-info>ⓘ<span>${t('view')}</span></button><button class="water" data-event="water">💧<span>${t('water')}</span></button><button class="feed" data-event="feed">✦<span>${t('fertilize')}</span></button></div><section class="care-info"><h2>${t('care')}</h2><div class="care-grid">${careCards(type)}</div></section><section class="gallery"><div class="gallery-head"><h2>${t('gallery')}</h2><span>${plant.photos?.length || 0} 📷</span></div><div class="gallery-grid">${gallery}</div></section><section class="history"><h2>${t('lastCare')}</h2><ul>${events}</ul></section>`, true);
}

function modalHTML() {
  if (!modal) return '';
  if (modal.kind === 'qr') {const plant = data.plants.find(item => item.id === modal.id); return `<div class="overlay"><div class="dialog qr-dialog"><button class="close">×</button><span class="tag">${t('qr')}</span><h2>${esc(plant.name)}</h2><img id="qr" src="${qrUrl(plant.id)}" alt="QR"><a class="primary download" href="${qrUrl(plant.id)}" download="plant-qr.png">↓ ${t('download')}</a></div></div>`;}
  const isType = modal.kind === 'type';
  const item = isType ? data.types.find(type => type.id === modal.id) : null;
  const careInputs = CARE_FIELDS.map(([key,label]) => `<label>${t(label)}<textarea name="${key}" rows="2">${esc(item?.care?.[key])}</textarea></label>`).join('');
  return `<div class="overlay"><form class="dialog ${isType ? 'care-dialog' : ''}" id="editor"><button type="button" class="close">×</button><h2>${isType ? t('newType') : t('newPlant')}</h2>${isType ? `<label>${t('typeName')}<input name="name" required value="${esc(item?.name)}"></label><p class="form-hint">${t('careHint')}</p><div class="care-form">${careInputs}</div>` : `<label>${t('plantName')}<input name="name" required></label><label>${t('chooseType')}<select name="typeId" required><option value="">—</option>${data.types.map(type => `<option value="${type.id}">${esc(type.name)}</option>`)}</select></label><label>${t('bought')}<input type="date" name="bought"></label><label>${t('photo')}<input type="file" name="photos" accept="image/*" multiple><small>${t('galleryHint')}</small></label>`}<div class="form-actions"><button type="button" class="secondary close">${t('cancel')}</button><button class="primary">${t('save')}</button></div></form></div>`;
}

function qrUrl(id) {
  const plant = data.plants.find(item => item.id === id);
  const type = data.types.find(item => item.id === plant?.typeId);
  const payload = encodePayload({plant:{...plant,photos:[],events:[]},type});
  const base = runtimeConfig.publicUrl || location.href.split('#')[0];
  const target = `${base.replace(/#.*$/,'')}#plant/${id}?data=${payload}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=173d2a&bgcolor=fffdf7&data=${encodeURIComponent(target)}`;
}

function encodePayload(value) {let bytes = new TextEncoder().encode(JSON.stringify(value)), binary = ''; bytes.forEach(byte => binary += String.fromCharCode(byte)); return btoa(binary).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');}
function route() {const match = location.hash.match(/^#plant\/([^?]+)(?:\?data=(.+))?$/); if (!match) return null; if (match[2] && !data.plants.some(item => item.id === match[1])) try {const binary = atob(match[2].replaceAll('-','+').replaceAll('_','/')); const bytes = Uint8Array.from(binary,char => char.charCodeAt(0)); const payload = JSON.parse(new TextDecoder().decode(bytes)); if (payload.type && !data.types.some(item => item.id === payload.type.id)) data.types.push(payload.type); if (payload.plant) data.plants.push(payload.plant); normalizeData();} catch {} return match[1];}
function render() {const id = route(); document.documentElement.lang = lang; document.querySelector('#app').innerHTML = id ? clientPage(id) : dashboard(); bind();}

function bind() {
  document.querySelectorAll('[data-lang]').forEach(button => button.onclick = () => {lang = button.dataset.lang; localStorage.setItem('flower-power-lang',lang); render();});
  document.querySelectorAll('[data-open]').forEach(button => button.onclick = () => {modal = {kind:button.dataset.open}; render();});
  document.querySelectorAll('.close').forEach(button => button.onclick = () => {modal = null; render();});
  document.querySelectorAll('[data-edit-type]').forEach(button => button.onclick = () => {modal = {kind:'type',id:button.dataset.editType}; render();});
  document.querySelectorAll('[data-del-type]').forEach(button => button.onclick = () => {data.types = data.types.filter(type => type.id !== button.dataset.delType); save(); render();});
  document.querySelectorAll('[data-qr]').forEach(button => button.onclick = () => {modal = {kind:'qr',id:button.dataset.qr}; render();});
  document.querySelectorAll('[data-remove-photo]').forEach(button => button.onclick = () => {const plant = data.plants.find(item => item.id === route()); plant.photos.splice(Number(button.dataset.removePhoto),1); save(); render();});
  const form = document.querySelector('#editor');
  if (form) form.onsubmit = async event => {
    event.preventDefault();
    const fields = new FormData(form);
    if (modal.kind === 'type') {
      const care = Object.fromEntries(CARE_FIELDS.map(([key]) => [key,String(fields.get(key) || '').trim()]));
      const old = data.types.find(type => type.id === modal.id);
      if (old) {old.name = fields.get('name'); old.care = care;} else data.types.push({id:crypto.randomUUID(),name:fields.get('name'),care});
    } else {
      const photos = await Promise.all([...form.elements.photos.files].map(readImage));
      data.plants.push({id:crypto.randomUUID(),name:fields.get('name'),typeId:fields.get('typeId'),bought:fields.get('bought'),photos,events:[]});
    }
    save(); modal = null; render();
  };
  document.querySelectorAll('[data-event]').forEach(button => button.onclick = () => {const plant = data.plants.find(item => item.id === route()); const kind = button.dataset.event; plant.events ||= []; plant.events.push({kind,date:new Date().toISOString()}); save(); toast = kind === 'water' ? t('watered') : t('fed'); render(); setTimeout(() => {toast = ''; render();},1800);});
  const camera = document.querySelector('[data-camera]');
  if (camera) camera.onchange = () => uploadPhotos(camera);
}

async function uploadPhotos(input) {
  const files = [...(input.files || [])];
  if (!files.length) return;
  const id = route();
  const plant = data.plants.find(item => item.id === id);
  toast = t('uploading'); render();
  let fallback = false;
  for (const file of files) {
    const image = await readImage(file);
    try {
      const response = await fetch(`./api/plants/${encodeURIComponent(id)}/photo`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image})});
      if (!response.ok) throw new Error('Upload failed');
      plant.photos.push((await response.json()).url);
    } catch {plant.photos.push(image); fallback = true;}
  }
  toast = fallback ? t('photoError') : t('photoSaved'); save(); render();
  setTimeout(() => {toast = ''; render();},2200);
}

function readImage(file) {return new Promise((resolve,reject) => {const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);});}
addEventListener('hashchange',() => {modal = null; render();});
render();
