// ====== 黑屏开场动画 ======
window.addEventListener('load', function() {
  const intro = document.getElementById('intro-screen');
  const albumImg = document.querySelector('.album-cover-img');
  const albumRight = document.querySelector('.album-right');
  const soundcloud = document.querySelector('.soundcloud');
  const backBtn = document.querySelector('.back-btn');

  // 黑屏停留 1.5 秒后开始淡出
  setTimeout(() => {
    intro.style.opacity = 0;

    setTimeout(() => {
      intro.style.display = 'none';

      // 显示：封面 + 右侧文字
      albumImg.classList.add('show');
      albumRight.classList.add('show');

      // 回退按钮延迟 1 秒后显示
      setTimeout(() => {
        backBtn.classList.add('show');
      }, 1000);

    }, 500); // intro消失后立即触发
  }, 1500); // 黑屏停留时间
});


document.addEventListener("DOMContentLoaded", () => {
  const albumLeft = document.querySelector(".album-left");
  const soundcloud = document.querySelector(".soundcloud");
  let hoverTimer = null;
  let isShown = false;

  // 鼠标进入 album-left
  albumLeft.addEventListener("mouseenter", () => {
    hoverTimer = setTimeout(() => {
      soundcloud.classList.remove("hide");
      soundcloud.classList.add("show");
      soundcloud.style.pointerEvents = "auto"; // 允许点击播放器
      isShown = true;
    }, 5000); // 延迟 5 秒
  });

  // 鼠标离开 album-left
  albumLeft.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    if (isShown) {
      soundcloud.classList.remove("show");
      soundcloud.classList.add("hide");
      soundcloud.style.pointerEvents = "none";
      isShown = false;
    }
  });
});
