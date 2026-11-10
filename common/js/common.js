
        // 共通ファイルを読み込んで指定の場所に埋め込む関数
        function loadComponent(fileUrl, targetId) {
            const target = document.getElementById(targetId);
            if (!target) return;

            fetch(fileUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`ファイルが見つかりません: ${fileUrl}`);
                    }
                    return response.text();
                })
                .then(data => {
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

