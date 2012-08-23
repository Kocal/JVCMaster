$('div[id^=message]').each(function(){
    var t    = $(this);
    var html = t.html();

    if(/(?:(?:<br> ){9,}){5,}/.test(html)){ // Si le post est un spam (flood)
        var tPost = t.find('li.post:first');
        t.find('li.post:last');
        
        
        tPost.after($('<li>', {
            'class' : 'JVCMaster_AntiBot_informPost post',
            html    : '<b>JVCMaster</b> : <i>Spam, ce message a été caché, cliquer pour faire apparaitre le post</i>',
            css : {cursor : 'pointer', display : 'none'},
            click : function(e){
                $(this).slideUp(300);
                tPost.slideDown(300);
            }
        }));
        
        tPost.slideUp(300);
        t.find('li.post:last').slideDown(300);
    }
});