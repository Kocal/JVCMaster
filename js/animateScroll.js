$('header nav a[href^="#"]').click(function(e){  
    var t = $(this);
    var the_id = t.attr("href");  

    console.log(t);

    $('nav a[href^="#"]').removeClass('current');
    t.addClass('current');

    $('html, body').animate({  
        scrollTop : $(the_id).offset().top
    }, 'slow');  
    
    e.preventDefault();
});  