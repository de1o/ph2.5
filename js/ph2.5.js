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

    function renderRandomImage() {
        var pixivEmbedJsTmplA = '<script src="js/embed.js" data-id="';
        var pixivEmbedJsTmplZ = '" data-size="large" data-border="on" charset="utf-8"></script>';
        var imageIdList = ls[today].split(',');
        var index = getRandomInt(0, imageIdList.length);
        var imageId = imageIdList[index];
        var embedJSLink = pixivEmbedJsTmplA + imageId + pixivEmbedJsTmplZ;
        $("body").html(embedJSLink);
    }

    if (ls[today] === undefined) {
        ls.clear();
        $.get(pixivHotPicUrl, function(data){
            var $pixivHotPageContent = $(data);
            var rankingImageItems = [];
            $pixivHotPageContent.find("section.ranking-item").each(function(){
                rankingImageItems.push($(this).attr('data-id'));
            });

            if (ls[today].length) {
                ls[today] = rankingImageItems;
                renderRandomImage();
            }
        });
    }
    else {
        renderRandomImage();
    }
}

addEventListener('DOMContentLoaded', init);