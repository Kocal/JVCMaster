var hiddenPosts = localStorage.getItem('JVCMaster_HiddenPosts') || "[]";
    hiddenPosts = JSON.parse(hiddenPosts);

var hiddenPostsViaPseudos = localStorage.getItem('JVCMaster_HiddenPostsViaPseudos') || "[]";
    hiddenPostsViaPseudos = JSON.parse(hiddenPostsViaPseudos);

$('div[id^=message] li.post').after($('<li/>', {
    'class' : 'JVCMaster_HiddenPosts_informPost post',
    html : '<b>JVCMaster</b> : <i>Ce message a été caché</i>',
    css : {
        display : 'none'
    }
}));

$('div[id^=message]').each(function(){
    var t = $(this);
    if(hiddenPosts.indexOf(t.attr('id').replace('message_', '')) !== -1
        || hiddenPostsViaPseudos.indexOf($.trim(t.find('li.pseudo strong').text().toLowerCase())) !== -1){
            
        t.find('li.post:first').slideUp(300);
        t.find('li.post:last').slideDown(300);
    }
});



// Bouton pour cacher un post
$('<img />', {
    css : { marginRight : '3px'},
    src : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIBAoODxWRH6sAAADcSURBVCjPlZExbsJgDIU/+ycVGxMjZe7UMwTOwlU4R3uQROICrTIhMRDRIjYGRFUFEvx3+EVCEKjiTc/2e7ZlS5Li+QfjEQLQAYjj17pg5jmdAncOVIUkzfx4hGhIH4EjZgecZjxFGXn+w35fYHYgjl9IUrxejquqhs9mv2w2VSvXuRR736yf5yXr7yWDAUQRPA9B2+KGf35sW3Hd+f1tDkBZwmRy/yrKA7grdg5EbqxxhghMp8JiAf0+dLttgwAkKf5rBWZQFLDbhWKvFwyq4Rq17/x2M64+2HT+A8hKUErfzQyDAAAAAElFTkSuQmCC'
}).appendTo($('<a/>', {
    href : '#',
    click : function(e){
        var t = $(this);
        var postContainer = t.parent().parent().parent();
        var postContainerId = postContainer.attr('id').replace('message_', '');

        if(hiddenPosts.indexOf(postContainerId) === -1){ // Si le post n'est pas déjà caché
            hiddenPosts.push(postContainerId);         
            postContainer.find('li.post:first').slideUp(300);
            postContainer.find('li.post:last').slideDown(300);
        }
        else{
            hiddenPosts.splice(hiddenPosts.indexOf(postContainerId), 1);
            postContainer.find('li.post:last').slideUp(300);
            postContainer.find('li.post:first').slideDown(300);
        }
        
        localStorage.setItem('JVCMaster_HiddenPosts', JSON.stringify(hiddenPosts));
        e.preventDefault();
    }
}).appendTo("div[id^=message] li.pseudo"));

$('<img />', {
    css : { marginRight : '3px'},
    src : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIBAoHF9c/PLQAAADmSURBVCjPhdGxTgJBFIXhb2BiYkUpPYliYWjUzkLexVcylj7JPoOhWWIkRkoLEqxWYHcsnF23IHGqk9z/zpxzJhQk/5w5ASLcz2bdoElJjZSSEIIhisUizQkR7HbgkJJYlgZ5sZxMnMXobjpVLJdp0L8xliV4HI/B5WplUVW2da1pbcABJ1m/7fedraf12hVu6F6U0l/Ol82m01/49ttChOeytMdDBoreYo0m68Gxqm5D6HS/16PwaU/HHhQK0kcO+InXrEfYZvgc1/LPFKR3VBlIuZldBka4aOF2ocmB5EHrd5it/AD/OVM2g9hH0wAAAABJRU5ErkJggg=='
}).appendTo($('<a/>', {
    href : '#',
    click : function(e){
        var postContainer = $(this).parent().parent().parent();
        var pseudoToHide = $.trim(postContainer.find('li.pseudo').text().toLowerCase());
        var toHide = (hiddenPostsViaPseudos.indexOf(pseudoToHide) === -1) ? true : false;

        $('div[id^=message]').each(function(){
            var t = $(this);
            var pseudo = $.trim(t.find('li.pseudo').text().toLowerCase());

            if(pseudo == pseudoToHide){
                if(toHide){
                    t.find('li.post:first').slideUp(300);
                    t.find('li.post:last').slideDown(300);
                    hiddenPostsViaPseudos.push(pseudoToHide);
                }
                else{
                    t.find('li.post:last').slideUp(300);    
                    t.find('li.post:first').slideDown(300);
                    hiddenPostsViaPseudos.splice(hiddenPostsViaPseudos.indexOf(pseudoToHide), 1);                  
                }
                
                
            }
        });

        localStorage.setItem('JVCMaster_HiddenPostsViaPseudos', JSON.stringify($.unique(hiddenPostsViaPseudos)));

        e.preventDefault();
    }
}).appendTo('div[id^=message] li.pseudo'));