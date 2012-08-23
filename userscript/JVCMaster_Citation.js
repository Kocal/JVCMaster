var textarea = $('#newmessage');
var alertemail = $('.alertemail');

$('<img />', {
    css : { marginRight : '3px'},
    src : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIAwsCFkFaqukAAAEnSURBVCjPhdA/a1NxFMbxz/ndX25a/yaplDpZXB0c9C1UsEvnToKjQ/tSpO6ODq4ZBPFVCN0kNeCggxSKqbTc5v4ckjTp5IGzHL7nOc9zwuG4+F8dbQdk2H9+/3pe2lYps4YQPh6cFO8eR4bzEnNwavhqcEN05+2x3Sc9nw5OSl5VXIDP3ryXqqxzqyev35FyTclW4KtrtcnPb3rbT30d1f5OE/UftgYrcFnm/D461Zy39Dfp1ESFmMHDz7+YXvJ6c3FGRFKiImUEEdIySjgen4EH/bu0jUd9tA2lpRThcFz8vqBtxOSHdvjyxjdi7wvdPg83lp5FpXQH4sUHzkZUXdY26Nwmr82swVL9imbCxSllSupQ1dT32BrM4cXCPJyVNxKkikj+Af4IbKaIyj5/AAAAAElFTkSuQmCC'
}).appendTo($('<a/>', {
    href : '#',
    click : function(e){
        var postContainer = $(this).parent().parent();
        var pseudo = $.trim(postContainer.find('li.pseudo strong').text());
        var post = $.trim(postContainer.find('li.post').html().replace(/( +<br(?: \/)?>)/, '\n').replace(/<img.*?alt="([^"]*?)".*?>|<a.*?href="([^"]*?)".*?>.*?<\/a>|<img.*?class="img_shack".*?>/gi, '$1 $2')).replace(/&gt;/g, '>').replace(/&lt/g, '<').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').split('\n').join('\n| ');
        var date = $.trim(postContainer.find('li.date').text().replace('Posté ', '').replace('\n', ''));
        var permalink = $.trim(postContainer.find('li.ancre a').attr('href'));

        var citation = '';
        if(textarea.is('*') && textarea.val() !== '') citation += '\n\n';
        if(permalink) citation += '| ' + permalink + '\n';

        citation += "| Ecrit par « " + pseudo + " » , " + date + "\n| « "+ post + " »\n\n\n> ";

        if(alertemail.is('*') && !textarea.is('*')){ // Si on est sur la page d'un topic
            localStorage.setItem('JVCMaster_citation', citation);
            window.location.href = $('.bt_repondre').attr('href');
        }
        else if(!alertemail.is('*') && textarea.is('*')){ // Si on est sur la page de réponse d'un topic
            if(textarea.val().match("Ne postez pas d'insultes, évitez les majuscules, faites une recherche avant de poster pour voir si la question n'a pas déjà été posée..."))
                textarea.val('');
            textarea.val(textarea.val() + citation);
        }
        
        e.preventDefault();
    }
}).appendTo("div[id^=message] li.pseudo"));



if($('.nouveau').is('*') && textarea.is('*')){
    var citation = localStorage.getItem('JVCMaster_citation');
    if(citation){
        textarea.val(citation);
        localStorage.removeItem('JVCMaster_citation');
    }
    
    textarea.get(0).setSelectionRange(textarea.val().length, textarea.val().length);
    textarea.focus();
}