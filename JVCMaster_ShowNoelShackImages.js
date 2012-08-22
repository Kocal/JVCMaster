var alreadyLoading = false;

$('.img_shack, a[href^=http\\:\\/\\/www\\.noelshack\\.com]').click(function(e){
    if(!alreadyLoading){
        alreadyLoading = true;

        if($(this).attr('class') === 'img_shack')
            var imgFalseUrl = $(this).parent().attr('href');
        else{
            var imgFalseUrl = $(this).attr('href');
        }
        var imgTrueUrl = '';
        // http://www.noelshack.com/2012-33-1345035147-screenshot-from-2012-08-15-14-51-54.png
        // http://image.noelshack.com/fichiers/2012/33/1345035147-screenshot-from-2012-08-15-14-51-54.png

        if(/^http:\/\/image.noelshack.com\/minis/.test(imgFalseUrl)){
            imgTrueUrl = imgFalseUrl.replace('http://image.noelshack.com/minis/', 'http://image.noelshack.com/fichiers/');
        }
        else if(/^http:\/\/image.noelshack.com\/fichiers/.test(imgFalseUrl)){
            imgTrueUrl = imgFalseUrl;
        }
        else{
            imgTrueUrl = imgFalseUrl.replace('http://www.noelshack.com/', 'http://image.noelshack.com/fichiers/');
            var toReplace = /(^http:\/\/image.noelshack.com\/fichiers\/[0-9]*)-/.exec(imgTrueUrl);
            imgTrueUrl = imgTrueUrl.replace(toReplace[0], toReplace[1] + '/');
            toReplace = /(^http:\/\/image.noelshack.com\/fichiers\/[0-9]*\/[0-9]*)-/.exec(imgTrueUrl);
            imgTrueUrl = imgTrueUrl.replace(toReplace[0], toReplace[1] + '/');  
        }
        

        $('<img />', {
            src : imgTrueUrl,
            css : {
                cursor : 'pointer'
            },
            load : function(){
                var t = $(this);
                var popup = $('#JVCMaster_LightBox_popup');
                var width = popup.css('width').replace('px', '');
                var height = popup.css('height').replace('px', '');
                
                alreadyLoading = false;
                
                    // height : (popup.css('height').replace('px', '') > window.innerHeight ? window.innerHeight - 50 : popup.css('height')),

                if(width > height){
                    t.css('width', (width > window.innerWidth ? width - window.innerWidth - (width - window.innerWidth) + window.innerWidth - 50 : width) + 'px');
                    
                    if(popup.css('height').replace('px', '') > window.innerHeight){
                        t.css('width', '');
                        t.css('height', (height > window.innerHeight ? height - window.innerHeight - (height - window.innerHeight) + window.innerHeight - 50 : height) + 'px');
                    }
                }
                else{
                    t.css('height', (height > window.innerHeight ? height - window.innerHeight - (height - window.innerHeight) + window.innerHeight - 50 : height) + 'px');
                    
                    if(popup.css('width').replace('px', '') > window.innerWidth){
                        t.css('height', '');
                        t.css('width', (width > window.innerWidth ? width - window.innerWidth - (width - window.innerWidth) + window.innerWidth - 50 : width) + 'px');
                    }
                }

                JVCMaster.LightBox.show();
            }
        }).appendTo($('</a>', {
            href : imgTrueUrl
        }).appendTo('#JVCMaster_LightBox_popup'));

    }
    e.preventDefault();
});