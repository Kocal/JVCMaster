jQuery(function(){
    $('nav a[href^="#"]').click(function(){  
        var t = $(this);
        var the_id = t.attr("href");  

        $('nav a[href^="#"]').removeClass('current');
        t.addClass('current');

        $('html, body').animate({  
            scrollTop : $(the_id).offset().top - 60  
        }, 'slow');  
        return false;  
    });  

    $("a.fancybox").fancybox({
        helpers : {
            title: {
                type: 'inside'
            }
        }
    });
});
