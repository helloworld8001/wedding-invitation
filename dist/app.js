const weddingTime = new Date('2027-01-02T15:30:00+09:00');
const address = '서울특별시 영등포구 국회대로 558';
const parkingAddress = '서울시 영등포구 당산로 141 현대해상 강서사옥';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let effectsEnabled = !reducedMotion.matches;
function updateMotion() {
  document.body.classList.toggle('effects-off', !effectsEnabled);
  motionButton.setAttribute('aria-pressed', String(effectsEnabled));
  motionButton.setAttribute('aria-label', effectsEnabled ? '반짝임 효과 끄기' : '반짝임 효과 켜기');
}
updateMotion();
motionButton.addEventListener('click', () => { effectsEnabled = !effectsEnabled; updateMotion(); });
reducedMotion.addEventListener('change', () => { effectsEnabled = !reducedMotion.matches; updateMotion(); });
const sparkles = document.querySelector('.sparkles');
for (let i = 0; i < 15; i++) {
  const particle = document.createElement('i');
  particle.style.cssText = `left:${7 + (i * 19) % 89}%;top:${12 + (i * 23) % 77}%;animation-delay:${i * -.73}s;animation-duration:${7 + i % 5}s;`;
  sparkles.append(particle);
}
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const calendarBody = document.querySelector('#calendar-days');
for (let row = 0; row < 6; row++) {
  const tr = document.createElement('tr');
  for (let col = 0; col < 7; col++) {
    const day = row * 7 + col - 4;
    const td = document.createElement('td');
    if (day >= 1 && day <= 31) {
      if (day === 2) { td.className = 'wedding-date'; td.innerHTML = '<span aria-label="2일, 결혼식">2</span>'; }
      else td.textContent = String(day);
    }
    tr.append(td);
  }
  calendarBody.append(tr);
}
function updateCountdown() {
  const remaining = Math.max(0, weddingTime.getTime() - Date.now());
  const seconds = Math.floor(remaining / 1000);
  const values = { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
  Object.entries(values).forEach(([id, value]) => { document.getElementById(id).textContent = String(value).padStart(2, '0'); });
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  document.querySelector('#countdown-caption').textContent = today === '2027-01-02' ? '오늘, 저희 두 사람 결혼합니다.' : remaining === 0 ? '함께해 주신 모든 분께 감사드립니다.' : `지훈과 지형의 결혼식까지 ${Math.ceil(remaining / 86400000)}일 남았습니다.`;
}
updateCountdown();
setInterval(updateCountdown, 1000);
let toastTimer;
function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
}
async function copyText(value, successMessage) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    toast(successMessage);
  } catch {
    const dialog = document.querySelector('#copy-dialog');
    dialog.querySelector('h2').textContent = value === address ? '예식장 주소' : value === parkingAddress ? '주차장 주소' : '청첩장 링크';
    const input = dialog.querySelector('input');
    input.value = value;
    input.setAttribute('aria-label', value === address ? '예식장 주소' : value === parkingAddress ? '주차장 주소' : '청첩장 링크');
    dialog.showModal(); input.focus(); input.select();
  }
}
function shareUrl() { return new URL('./', window.location.href).href; }
document.querySelector('#copy-address').addEventListener('click', () => copyText(address, '예식장 주소를 복사했습니다.'));
document.querySelector('#copy-link').addEventListener('click', () => copyText(shareUrl(), '청첩장 링크를 복사했습니다.'));
document.querySelector('#close-dialog').addEventListener('click', () => document.querySelector('#copy-dialog').close());
document.querySelector('#share').addEventListener('click', async () => {
  if (navigator.share) {
    try { await navigator.share({ title: '지훈 그리고 지형, 결혼합니다', text: '2027년 1월 2일 토요일 오후 3시 30분\n웨스턴베니비스 영등포', url: shareUrl() }); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  await copyText(shareUrl(), '청첩장 링크를 복사했습니다.');
});

// Native dialog provides focus trapping, Escape support, and focus restoration.
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const photoDialog = document.querySelector('#photo-dialog');
const photoImage = photoDialog.querySelector('.photo-full');
const photoError = photoDialog.querySelector('.photo-error');
const photoStage = photoDialog.querySelector('.photo-stage');
let photoIndex = 0;
let galleryTrigger;
let touchStart;
let savedScrollY = 0;
function showPhoto(index) {
  photoIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[photoIndex];
  photoError.hidden = true;
  photoImage.hidden = false;
  photoImage.alt = item.querySelector('img').alt;
  photoImage.src = item.href;
  photoDialog.querySelector('.photo-original').href = item.href;
  photoDialog.querySelector('.photo-counter').textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
  const nextPhoto = new Image();
  nextPhoto.src = galleryItems[(photoIndex + 1) % galleryItems.length].href;
}
photoImage.addEventListener('error', () => { photoImage.hidden = true; photoError.hidden = false; });
galleryItems.forEach((item, index) => item.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  galleryTrigger = item;
  savedScrollY = window.scrollY;
  showPhoto(index);
  photoDialog.showModal();
  document.body.style.top = `-${savedScrollY}px`;
  document.body.classList.add('photo-open');
}));
photoDialog.querySelector('.photo-close').addEventListener('click', () => photoDialog.close());
photoDialog.querySelector('.photo-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
photoDialog.querySelector('.photo-next').addEventListener('click', () => showPhoto(photoIndex + 1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
photoDialog.addEventListener('close', () => {
  document.body.classList.remove('photo-open');
  document.body.style.top = '';
  window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  galleryTrigger?.focus({ preventScroll: true });
  touchStart = null;
});
photoStage.addEventListener('touchstart', event => {
  touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
photoStage.addEventListener('touchend', event => {
  if (!touchStart || event.touches.length > 0) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
photoStage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

document.querySelector('#copy-parking').addEventListener('click', () => copyText(parkingAddress, '주차장 주소를 복사했습니다.'));

// All driving buttons use the dedicated parking building, not the wedding hall.
// Coordinate source: https://mapcarta.com/W1222389479 (building centre).
const navigationDestination = { name: '현대해상 강서사옥', lat: 37.52749, lng: 126.89662 };
const isAndroid = /Android/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const destinationName = encodeURIComponent(navigationDestination.name);
const navigationApps = {
  tmap: {
    scheme: 'tmap', package: 'com.skt.tmap.ku',
    path: `route?rGoName=${destinationName}&rGoX=${navigationDestination.lng}&rGoY=${navigationDestination.lat}`,
    iosStore: 'https://apps.apple.com/kr/app/id431589174'
  },
  naver: {
    scheme: 'nmap', package: 'com.nhn.android.nmap',
    path: `navigation?dlat=${navigationDestination.lat}&dlng=${navigationDestination.lng}&dname=${destinationName}&appname=${encodeURIComponent(shareUrl())}`,
    iosStore: 'https://apps.apple.com/kr/app/id311867728'
  }
};
Object.entries(navigationApps).forEach(([id, app]) => {
  const link = document.querySelector(`[data-navigation="${id}"]`);
  const storeUrl = isIOS ? app.iosStore : `https://play.google.com/store/apps/details?id=${app.package}`;
  document.querySelector(`[data-install="${id}"]`).href = storeUrl;
  if (isAndroid) {
    link.href = `intent://${app.path}#Intent;scheme=${app.scheme};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=${app.package};S.browser_fallback_url=${encodeURIComponent(storeUrl)};end`;
  } else if (isIOS) {
    link.href = `${app.scheme}://${app.path}`;
  } else {
    link.addEventListener('click', event => {
      event.preventDefault();
      toast('휴대폰에서 열면 내비게이션 앱으로 연결됩니다.');
    });
  }
});
