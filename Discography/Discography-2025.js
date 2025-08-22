// ====== 鼠标跟随圆点 ======
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
    dot.style.background = 'rgba(178, 120, 203, 0.5)';
  }, 100);
});

document.addEventListener('mousedown', () => dot.classList.add('active'));
document.addEventListener('mouseup', () => dot.classList.remove('active'));

document.querySelectorAll('video, iframe').forEach(v => v.style.pointerEvents = 'auto');

// ====== 动态添加专辑 ======
function addAlbumCard(imgSrc, title, desc){
  const container = document.getElementById('album-container');
  const div = document.createElement('a');
  div.href = "#"; // 子页面链接可替换
  div.className = 'disc-item';
  div.innerHTML = `
    <img src="${imgSrc}" alt="${title}">
    <div class="disc-hover">${title}</div>
  `;
  container.insertBefore(div, container.firstChild);
}

// 获取容器与控件
const container = document.querySelector('.discography-container');
const items = Array.from(container.querySelectorAll('.disc-item'));

const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');

// ====================== 排序函数 ======================
function sortAlbums() {
  const sortBy = sortSelect.value;
  let sortedItems;

  if (sortBy === 'date') {
    // 按日期升序
    sortedItems = items.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
  } else if (sortBy === 'name') {
    // 按名字字母顺序
    sortedItems = items.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name, 'ja'));
  }

  // 清空容器并重新插入排序后的元素
  container.innerHTML = '';
  sortedItems.forEach(item => container.appendChild(item));
}

// ====================== 搜索函数 ======================
function searchAlbums() {
  const query = searchInput.value.toLowerCase();
  items.forEach(item => {
    const name = item.dataset.name.toLowerCase();
    if (name.includes(query)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// ====================== 事件监听 ======================
sortSelect.addEventListener('change', () => {
  sortAlbums();
  searchAlbums(); // 保证搜索过滤后仍能正确排序
});

searchInput.addEventListener('input', searchAlbums);

// ====================== 初始化 ======================
sortAlbums();
