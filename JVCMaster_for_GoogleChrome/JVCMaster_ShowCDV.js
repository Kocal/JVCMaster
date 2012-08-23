var alreadyLoading = false;
var pseudos = $('li.pseudo strong');
pseudos.css({ cursor : 'pointer'});

pseudos.click(function(e){
    if(!alreadyLoading){
        alreadyLoading = true;

        var iframe = $('<iframe>', {
            src : 'http://www.jeuxvideo.com/profil/' + $(this).text() + '.html',
            css : {
                width : '800px',
                height : '600px',
                border : 0
            },
            load : function(){
                if(window.innerHeight < 600){
                    $(this).css('height', window.innerHeight - 50);
                }
                JVCMaster_LightBox.show();
                alreadyLoading = false;
            }
        }).appendTo('#JVCMaster_LightBox_popup');

    }
    e.preventDefault();
});