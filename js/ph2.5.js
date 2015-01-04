function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var init = function(){
    var ls = localStorage;
    var pixivHotPicUrl = "http://www.pixiv.net/ranking.php?mode=daily&content=illust"
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm<10) {
        mm = '0' + mm;
    }
    today = mm + '/' + dd;

    function getRandomImageId() {
        var imageIdList = ls[today].split(',');
        var index = getRandomInt(0, imageIdList.length);
        return imageIdList[index];
    }

    function lazyReloadRandomImage() {
        var pixivEmbedIFrameSrcA = 'http://embed.pixiv.net/embed_mk2.php?id=';
        var pixivEmbedIFrameSrcZ = '&size=large&border=on&done=null';
        var pixivEmbedIFrameSrc = pixivEmbedIFrameSrcA + getRandomImageId() + pixivEmbedIFrameSrcZ;
        $("div.pixiv-embed").find("> iframe").attr('src', pixivEmbedIFrameSrc);
        setTimeout(lazyReloadRandomImage, 60000);
    }

    function renderRandomImage() {
        var pixivEmbedJsTmplA = '<script src="js/embed.js" data-id="';
        var pixivEmbedJsTmplZ = '" data-size="large" data-border="on" charset="utf-8"></script>';
        var imageId = getRandomImageId();
        var embedJSLink = pixivEmbedJsTmplA + imageId + pixivEmbedJsTmplZ;
        $("#gallery").html(embedJSLink);
    }

    if (ls[today] === undefined) {
        ls.clear();
        $.get(pixivHotPicUrl, function(data){
            var $pixivHotPageContent = $(data);
            var rankingImageItems = [];
            $pixivHotPageContent.find("section.ranking-item").each(function(){
                rankingImageItems.push($(this).attr('data-id'));
            });

            ls[today] = rankingImageItems;
            if (ls[today].length) {
                renderRandomImage();
                setTimeout(lazyReloadRandomImage, 60000);
            }
        });
    }
    else {
        renderRandomImage();
        setTimeout(lazyReloadRandomImage, 60000);
    }
}

addEventListener('DOMContentLoaded', init);


$(document).ready(function(){
    $("#download-original").on("click", function(){
        var imageId = $(".pixiv-embed").attr('data-id');
        if (!imageId) {
            return;
        }

        var imagePageUrl = 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + imageId;
        $.get(imagePageUrl, function(data){
            var originalElem = $(data).find('img.original-image');
            if (!originalElem) {
                alert("原始图片未发现");
                return;
            }
            var originalImageUrl = originalElem.attr("data-src");
            window.location = originalImageUrl;
        })

        return false;
    });
});