JVCMaster_LightBox = {
    id : 'JVCMaster_LightBox',

    main : function(){
        // On crée le calque qui servira à cacher la page
        $('<div>', {
            id : JVCMaster_LightBox.id + '_layer',
            css : {
                position : 'fixed',
                display  : 'none',
                top : 0, right : 0, bottom : 0, left : 0,
                background: 'rgba(0, 0, 0, 0.7)',
                zIndex: 99999998
            },
            click : function(){
                JVCMaster_LightBox.hide();
            }
        }).appendTo('body');
        
        // On crée la popup
        $('<div>', {
            id : JVCMaster_LightBox.id + '_popup',
            css : {
                position : 'fixed',
                display  : 'none',
                backgroundColor : '#fff',
                zIndex : 99999999,
                border : '1px solid black',
                textAlign: 'left'
            }
        }).appendTo('body');

        $(window).resize(function(){
            var popup = $('#JVCMaster_LightBox_popup');
            popup.css({
                top : (window.innerHeight / 2 - popup.css('height').replace('px', '')  / 2) + 'px',
                left : (window.innerWidth / 2 - popup.css('width').replace('px', '') / 2) + 'px'
            });
        });
    },

    show : function(width, height, html){
        var popup = $('#JVCMaster_LightBox_popup');

        popup.css({
            width : width + 'px',
            height : height + 'px'
        });
        popup.css({ // obligé d'appeler 2 fois '.css()', sinon la popup n'est bien placé qu'à son 2ème déclenchement
            top : (window.innerHeight / 2 - popup.css('height').replace('px', '')  / 2) + 'px',
            left : (window.innerWidth / 2 - popup.css('width').replace('px', '') / 2) + 'px'
        });

        popup.html(html)
        $('#JVCMaster_LightBox_layer').fadeIn(300, function(){
            popup.fadeIn(300);
        });
    },

    hide : function(){
        var popup = $('#JVCMaster_LightBox_popup');

        popup.fadeOut(300, function(){
            $('#JVCMaster_LightBox_layer').fadeOut(300, function(){
                popup.html('');
            });
        });
    }
};