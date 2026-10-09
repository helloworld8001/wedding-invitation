const weddingTime = new Date('2027-01-02T15:00:00+09:00');
const address = '서울특별시 영등포구 국회대로 558';
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
    dialog.querySelector('h2').textContent = value === address ? '예식장 주소' : '청첩장 링크';
    const input = dialog.querySelector('input');
    input.value = value;
    input.setAttribute('aria-label', value === address ? '예식장 주소' : '청첩장 링크');
    dialog.showModal(); input.focus(); input.select();
  }
}
function shareUrl() { return new URL('/', window.location.href).href; }
document.querySelector('#copy-address').addEventListener('click', () => copyText(address, '예식장 주소를 복사했습니다.'));
document.querySelector('#copy-link').addEventListener('click', () => copyText(shareUrl(), '청첩장 링크를 복사했습니다.'));
document.querySelector('#close-dialog').addEventListener('click', () => document.querySelector('#copy-dialog').close());
document.querySelector('#share').addEventListener('click', async () => {
  if (navigator.share) {
    try { await navigator.share({ title: '지훈 그리고 지형, 결혼합니다', text: '2027년 1월 2일 토요일 오후 3시\n웨스턴베니비스 영등포', url: shareUrl() }); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  await copyText(shareUrl(), '청첩장 링크를 복사했습니다.');
});
