// 鼠标圆点保持原样
const dot = document.getElementById('cursor-dot');
let timer;
document.addEventListener('mousemove', e => {
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
  dot.style.width = '30px';
  dot.style.height = '30px';
  dot.style.background = 'rgba(255,255,255,0.7)';
  clearTimeout(timer);
  timer = setTimeout(() => {
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.background = 'rgba(178, 120, 203,0.5)';
  }, 100);
});
document.addEventListener('mousedown', () => dot.classList.add('active'));
document.addEventListener('mouseup', () => dot.classList.remove('active'));
document.querySelectorAll('video, iframe').forEach(v => v.style.pointerEvents = 'auto');

// 搜索功能
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();
  document.querySelectorAll('.art-card').forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const creator = card.dataset.creator.toLowerCase();
    const date = card.dataset.date.toLowerCase();
    card.style.display = (title.includes(filter) || creator.includes(filter) || date.includes(filter)) ? '' : 'none';
  });
});

// 时间排序功能
const sortBtn = document.getElementById('sort-btn');
let asc = false;
sortBtn.addEventListener('click', () => {
  asc = !asc;
  const gallery = document.getElementById('gallery');
  const cards = Array.from(gallery.children);
  cards.sort((a, b) => {
    const dateA = new Date(a.dataset.date);
    const dateB = new Date(b.dataset.date);
    return asc ? dateA - dateB : dateB - dateA;
  });
  cards.forEach(card => gallery.appendChild(card));
});
