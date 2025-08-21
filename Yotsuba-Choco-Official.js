const dot = document.getElementById('cursor-dot');
let timer;

// 鼠标移动，直接跟随
document.addEventListener('mousemove', e => {
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';

  // 移动放大、偏白
  dot.style.width = '30px';
  dot.style.height = '30px';
  dot.style.background = 'rgba(255,255,255,0.7)';

  clearTimeout(timer);
  // 停止移动后缩小并变紫
  timer = setTimeout(() => {
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.background = 'rgba(178, 120, 203, 0.5)'; // 半透明木槿紫
  }, 100); // 停止100ms
});

// 点击旋转变方形
document.addEventListener('mousedown', () => {
  dot.classList.add('active');
});
document.addEventListener('mouseup', () => {
  dot.classList.remove('active');
});

// 视频/iframe 鼠标悬停时也显示圆点
const videos = document.querySelectorAll('video, iframe');
videos.forEach(v => {
  v.style.pointerEvents = 'auto'; // 确保视频可点击
});

// ==== 全局音量 ====
let globalVolume = 0.7;
const volumeControl = document.getElementById('volume-control');
volumeControl.addEventListener('input', e => {
  globalVolume = parseFloat(e.target.value);
});

// ==== 音效文件列表 ====
const soundFiles = {
  'Sound/Groove': [
    { file: 'Kick.wav', weight: 7 },
    { file: 'Kick_Crash.wav', weight: 2 },
    { file: 'Kick_Sub.wav', weight: 3 },
    { file: 'Snare_1.wav', weight: 5 },
    { file: 'Snare_2.wav', weight: 5 },
    { file: 'Drum_01.wav', weight: 2 },
    { file: 'Drum_02.wav', weight: 2 },
    { file: 'Drum_03.wav', weight: 2 },
    { file: 'Drum_Over.wav', weight: 2 },
    { file: 'Drum_Over_02.wav', weight: 2 },
    { file: 'Crash_1.wav', weight: 2 },
    { file: 'Groove.wav', weight: 0.2 } 
  ],
  'Sound/Bass': [
    { file: 'Bass-D.wav', weight: 5 },
    { file: 'Bass-E.wav', weight: 5 },
    { file: 'Bass-Db.wav', weight: 5 },
    { file: 'Bass-Gb.wav', weight: 5 },
    { file: 'Bass-A.wav', weight: 3 }
  ],
  'Sound/Organ': [
    { file: 'Organ-C5.wav', weight: 3 },
    { file: 'Organ-D5.wav', weight: 3 },
    { file: 'Organ-E5.wav', weight: 3 },
    { file: 'Organ-F5.wav', weight: 3 },
    { file: 'Organ-Gb5.wav', weight: 2 },
    { file: 'Organ-G5.wav', weight: 3 },
    { file: 'Organ-Ab5.wav', weight: 2 },
    { file: 'Organ-A5.wav', weight: 3 },
    { file: 'Organ-Bb5.wav', weight: 2 },
    { file: 'Organ-B5.wav', weight: 3 },
    { file: 'Organ-C6.wav', weight: 3 },
    { file: 'Organ-Music-01.wav', weight: 0.2 }
  ],
  'Sound/Piano': [
    { file: 'Piano-A-Fmaj7.wav', weight: 6 },
    { file: 'Piano-A-G.wav', weight: 6 },
    { file: 'Piano-A-E7.wav', weight: 5 },
    { file: 'Piano-A-Am.wav', weight: 5 },
    { file: 'Piano-A-Cmaj7.wav', weight: 1 }
  ],
  'Sound/Musicbox': [
    { file: 'Musicbox-E6.wav', weight: 2 },
    { file: 'Musicbox-Gb6.wav', weight: 2 },
    { file: 'Musicbox-Ab6.wav', weight: 2 },
    { file: 'Musicbox-A6.wav', weight: 1 },
    { file: 'Musicbox-B6.wav', weight: 2 },
    { file: 'Musicbox-Db7.wav', weight: 2 },
    { file: 'Musicbox-Eb7.wav', weight: 1 },
    { file: 'Musicbox-E7.wav', weight: 1 }
]
};

// ==== 随机权重选择单音效 ====
function getRandomWeightedSound(folder) {
  const list = soundFiles[folder];
  const totalWeight = list.reduce((sum, s) => sum + s.weight, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < list.length; i++) {
    if (r < list[i].weight) return `${folder}/${list[i].file}`;
    r -= list[i].weight;
  }
  return `${folder}/${list[0].file}`; // 万一出错返回第一个
}

// ==== 鼠标点击触发音效（支持快速连击完整播放 + いいえ静音） ====
const audioPool = Array.from({length: 8}, () => new Audio()); // 增加池子数量支持更高连击
let poolIndex = 0;

document.addEventListener('mousedown', () => {
  dot.classList.add('active');
  
  const instrument = instruments[currentIndex];
  if (instrument.folder) { // 有 folder 才播放音效
    const audio = audioPool[poolIndex];
    audio.src = getRandomWeightedSound(instrument.folder); // 每次更新音源
    audio.volume = globalVolume;
    audio.currentTime = 0; // 重置播放起点
    audio.play();
    
    poolIndex = (poolIndex + 1) % audioPool.length; // 循环复用池
  }
});

document.addEventListener('mouseup', () => {
  dot.classList.remove('active');
});

document.addEventListener('mousedown', () => {
  dot.classList.add('active');
  
  const folder = instruments[currentIndex].folder;
  playSound(folder); // 调用新函数
});

document.addEventListener('mouseup', () => {
  dot.classList.remove('active');
});

// 只选中 footer 内的 logo，避免影响专辑封面
const logos = document.querySelectorAll('footer div a img');
logos.forEach(logo => {
  logo.addEventListener('mouseenter', () => {
    logo.style.transform = 'scale(1.15)'; // 悬停放大15%
  });
  logo.addEventListener('mouseleave', () => {
    logo.style.transform = 'scale(1)';
  });
});

// 残影音乐条播放逻辑 
document.addEventListener('DOMContentLoaded', () => {
  const musicItems = document.querySelectorAll('.music-item');
  let currentAudio = null;
  let currentPlayBtn = null;
  let currentProgress = null;

  musicItems.forEach(item => {
    const playBtn = item.querySelector('.play-btn');
    const progressBar = item.querySelector('.progress-bar');
    const src = item.dataset.src;
    const audio = new Audio(src);

    // 🔹 初始化时应用全局音量
    audio.volume = globalVolume;

    playBtn.addEventListener('click', () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentPlayBtn) currentPlayBtn.textContent = '▶';
        if (currentProgress) currentProgress.style.width = '0%';
      }

      if (audio.paused) {
        // 每次播放前应用最新的全局音量
        audio.volume = globalVolume;
        audio.play();
        playBtn.textContent = '⏸';
        currentAudio = audio;
        currentPlayBtn = playBtn;
        currentProgress = progressBar;
      } else {
        audio.pause();
        playBtn.textContent = '▶';
      }
    });

    audio.addEventListener('timeupdate', () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = percent + '%';
    });

    audio.addEventListener('ended', () => {
      playBtn.textContent = '▶';
      progressBar.style.width = '0%';
      if (currentAudio === audio) {
        currentAudio = null;
        currentPlayBtn = null;
        currentProgress = null;
      }
    });

    // 点击进度条调整播放位置
    const progressContainer = item.querySelector('.progress-container');
    progressContainer.addEventListener('click', e => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * audio.duration;
      audio.currentTime = newTime;
    });
  });

  // 🔹 监听音量条，实时修改当前播放的 audio 音量
  volumeControl.addEventListener('input', e => {
    globalVolume = parseFloat(e.target.value);
    if (currentAudio) currentAudio.volume = globalVolume;
  });
});

    // 新专辑自动添加在最前面
    function addAlbumCard(imgSrc, title, desc){
      const container = document.getElementById('album-container');
      const div = document.createElement('div');
      div.className = 'album-card';
      div.innerHTML = `
        <div class="album-cover" title="${desc}">
          <img src="${imgSrc}" alt="${title}">
        </div>
        <div class="album-title">${title}</div>
      `;
      container.insertBefore(div, container.firstChild);
    }

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('album-transition-overlay');
  const transImg = document.getElementById('album-transition-img');
  const albumLinks = document.querySelectorAll('.album-link');

  albumLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetURL = link.href;
      const img = link.querySelector('img');

      const rect = img.getBoundingClientRect();
      const startX = rect.left;
      const startY = rect.top;
      const startWidth = rect.width;
      const startHeight = rect.height;

      transImg.src = img.src;
      transImg.style.display = 'block';
      transImg.style.width = startWidth + 'px';
      transImg.style.height = startHeight + 'px';
      transImg.style.left = startX + 'px';
      transImg.style.top = startY + 'px';
      transImg.style.opacity = 1;
      transImg.style.transform = 'translate(0,0) scale(1)';

      // ===== 根据专辑类型播放不同音效 =====
      const type = link.getAttribute('data-type');
      let soundFile = 'Sound/KotouSound_01.wav'; //主打歌
      if (type === '短い歌') soundFile = 'Sound/KotouSound_02.wav'; //短い歌
      else if (type === '核心曲目') soundFile = 'Sound/KotouSound_05.wav'; //核心曲目

      const audio = new Audio(soundFile);
      audio.play();

      // 背景渐变暗 + 封面中心放大
      requestAnimationFrame(() => {
        overlay.style.background = 'rgba(0,0,0,1)';

        const scaleX = Math.min(window.innerWidth*0.8 / startWidth, 1.5);
        const scaleY = Math.min(window.innerHeight*0.8 / startHeight, 1.5);
        const scale = Math.min(scaleX, scaleY);

        const centerX = window.innerWidth/2 - (startX + startWidth/2);
        const centerY = window.innerHeight/2 - (startY + startHeight/2);

        transImg.style.transform = `translate(${centerX}px, ${centerY}px) scale(${scale})`;
      });

      let hasSkipped = false;
      transImg.addEventListener('click', () => {
        if(!hasSkipped){
          hasSkipped = true;
          transImg.style.transition = 'none';
          transImg.style.opacity = 0;
          overlay.style.transition = 'none';
          overlay.style.background = 'rgba(0,0,0,1)';
          if(!audio.paused){
            audio.addEventListener('ended', () => window.location.href = targetURL);
          } else {
            window.location.href = targetURL;
          }
        }
      });

      // 封面和音效最后3秒渐隐
      audio.addEventListener('loadedmetadata', () => {
        const fadeOutDuration = 3000;
        const totalDuration = audio.duration * 1000;
        const fadeStart = Math.max(0, totalDuration - fadeOutDuration);

        setTimeout(() => {
          transImg.style.transition = `opacity ${fadeOutDuration/1000}s ease-in-out`;
          transImg.style.opacity = 0;
        }, fadeStart);
      });

      audio.addEventListener('ended', () => {
        window.location.href = targetURL;
      });
    });
  });
});

// 点击切换显示/隐藏语言列表
const toggleBtn = document.querySelector('.lang-switch .toggle');
const langItems = document.querySelectorAll('.lang-switch .lang-list a');
const langList = document.querySelector('.lang-switch .lang-list');

let isOpen = false;
let timers = [];

toggleBtn.addEventListener('click', () => {
  // 清空上一次的定时器
  timers.forEach(id => clearTimeout(id));
  timers = [];

  if (!isOpen) {
    langList.style.pointerEvents = 'auto'; // 打开可点击

    langItems.forEach((item, index) => {
      // 重置状态
      item.style.opacity = '0';
      item.style.transform = 'translateX(-8px)';

      const timer = setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 50);
      timers.push(timer);
    });

  } else {
    // 关闭：逆序
    langItems.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    });

    Array.from(langItems).reverse().forEach((item, index) => {
      const timer = setTimeout(() => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-8px)';
      }, index * 50);
      timers.push(timer);
    });

    langList.style.pointerEvents = 'none'; // 收起不可点击
  }

  isOpen = !isOpen;
});
