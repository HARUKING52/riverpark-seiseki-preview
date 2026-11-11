
        // サイトルート（ローカル環境では ""、GitHub Pages等のサブパス環境では "/repo-name"）を自動判定
        function getSiteBase() {
            const scripts = document.querySelectorAll('script[src*="common/js/common.js"]');
            if (scripts.length > 0) {
                try {
                    const u = new URL(scripts[0].src, window.location.href);
                    return u.pathname.replace(/\/common\/js\/common\.js.*$/, '');
                } catch (e) {}
            }
            return '';
        }

        // 共通ファイルを読み込んで指定の場所に埋め込む関数
        function loadComponent(fileUrl, targetId) {
            const target = document.getElementById(targetId);
            if (!target) return;

            const siteBase = getSiteBase();
            const resolvedUrl = siteBase && fileUrl.startsWith('/') ? siteBase + fileUrl : fileUrl;

            fetch(resolvedUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`ファイルが見つかりません: ${resolvedUrl}`);
                    }
                    return response.text();
                })
                .then(data => {
                    if (siteBase) {
                        data = data.replace(/(href|src)="\/(?!\/)/g, `$1="${siteBase}/`);
                    }
                    target.innerHTML = data;
                })
                .catch(error => {
                    console.error('読み込みエラー:', error);
                });
        }

        // ページの読み込みが完了したら実行
        document.addEventListener('DOMContentLoaded', () => {
            // パス（/header.htmlなど）は環境に合わせて調整してください
            loadComponent('/include/header.html', 'header-container');
            loadComponent('/include/footer.html', 'footer-container');
        });

        // Instagram埋め込みiframeの高さをpostMessage(MEASURE)から自動同期し下部見切れを防止
        window.addEventListener('message', (event) => {
            if (!event.origin || !event.origin.includes('instagram.com')) return;
            try {
                const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (msg && msg.type === 'MEASURE' && msg.details && msg.details.height) {
                    const h = Math.max(500, Number(msg.details.height) + 4);
                    document.querySelectorAll('iframe.rp-insta-iframe, .insta_embed_col iframe').forEach((iframe) => {
                        if (iframe.contentWindow === event.source) {
                            iframe.style.height = h + 'px';
                            iframe.style.minHeight = h + 'px';
                            iframe.style.maxHeight = 'none';
                        }
                    });
                }
            } catch (e) {}
        });


(function($) {
    $(function () {
        // ▼ ここをイベント委譲に変更します
        $(document).on('click', '#nav-toggle', function() {
            $('body').toggleClass('open');
        });
        
        $(document).on('click', '#gloval-nav a', function(){
            $('body').removeClass('open');
        });
    });
})(jQuery);
	  
$(function() {
    var topBtn = $('.totop');
    topBtn.hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            topBtn.fadeIn();
        } else {
            topBtn.fadeOut();
        }
    });
    $(window).scroll(function () {
        var height = $(document).height(); 
        var position = $(window).height() + $(window).scrollTop(); 
        var footer = $("footer").height(); 
        if ( height - position  < footer ) { 
            topBtn.css({
              position : "absolute",
              top : -100
            });
        } else { 
            topBtn.css({
              position : "fixed",
              top: "auto"
            });
        }
    });
    // ★ここにあったスクロールのanimate処理だけを削除しました
});

