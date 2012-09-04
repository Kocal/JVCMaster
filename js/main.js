jQuery(function($){
    // Détection du browser
    var installButton = $('#download_JVCMaster');
    var userAgent = navigator.userAgent;

    if(userAgent.indexOf('Chromium') !== -1) installButton.attr('name', 'install_GoogleChromeAndChromium');
    else if(userAgent.indexOf('Chrome') !== -1) installButton.attr('name', 'install_GoogleChromeAndChromium');
    else if(userAgent.indexOf('Firefox') !== -1) installButton.attr('name', 'install_Firefox');
    else if(userAgent.indexOf('Opera') !== -1) installButton.attr('name', 'install_Opera');
    else if(userAgent.indexOf('Safari') !== -1) installButton.attr('name', 'install_Safari');

    $('#download_JVCMaster').click(function(e){
        var to = $(this).attr('name')
        $('html, body').animate({
            scrollTop : $('#' + to).offset().top - 100
        })
        e.preventDefault();
    });


    // Navigation animée 
    $('nav a[href^="#"]').click(function(e){  
        var t = $(this);
        var the_id = t.attr("href");  

        $('nav a[href^="#"]').removeClass('current');
        t.addClass('current');

        $('html, body').animate({  
            scrollTop : $(the_id).offset().top - 60  
        }, 'slow');
        
        e.preventDefault();
    }); 

    // FancyBox
    $("a.fancybox").fancybox({
        helpers : {
            title: {
                type: 'inside'
            }
        }
    });
});
