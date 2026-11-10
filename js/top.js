/* ==========================================================================
   1. メインビジュアル（MV）用の設定
   ========================================================================== */
const initMainVisualSwiper = () => {
  if (typeof Swiper === 'undefined') return;
  
  new Swiper('.my-swiper', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    speed: 1500,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
};


/* ==========================================================================
   2. モーダルスライダー用の設定
   ========================================================================== */
let group1Swiper;
let group2Swiper;

const initModalSwipers = () => {
  if (typeof Swiper === 'undefined') return;

  group1Swiper = new Swiper(".group1-swiper", {
    loop: true,
    navigation: {
      nextEl: ".g1-next",
      prevEl: ".g1-prev",
    },
  });

  group2Swiper = new Swiper(".group2-swiper", {
    loop: true,
    navigation: {
      nextEl: ".g2-next",
      prevEl: ".g2-prev",
    },
  });
};

function goToGroup1Slide(index) {
  if (!group1Swiper) return;
  setTimeout(() => {
    group1Swiper.slideToLoop(index, 0); 
  }, 50);
}

function goToGroup2Slide(index) {
  if (!group2Swiper) return;
  setTimeout(() => {
    group2Swiper.slideToLoop(index, 0); 
  }, 50);
}


/* ==========================================================================
   3. 全スライダーの一括起動処理
   ========================================================================== */
const initAllSwipers = () => {
  initMainVisualSwiper(); // メインビジュアルを起動
  initModalSwipers();     // モーダルスライダーを起動
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllSwipers);
} else {
  initAllSwipers();
}