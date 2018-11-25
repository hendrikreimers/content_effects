
$(function() {
    // $('.animated').scrollfy()
    //     .one('scrollfy:inView', function(e) {
    //         var el = this;
    //         $(el).attr('class', $(el).attr('class').replace(/cfx-([a-z]{1,})/gmi, function(a, b) {
    //             $(el).data('cfx', b);
    //             return b;
    //         }));
    //     })
    //     .one('animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd', function(e) {
    //         $(this).removeClass('animated fade ' + $(this).data('cfx')).removeData('cfx');
    //     });
    $('.animated').one('scrollfy:inView', function(e) {
        $(this).removeClass('cfx');
    }).scrollfy();
});