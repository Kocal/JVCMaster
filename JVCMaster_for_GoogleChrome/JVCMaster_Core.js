jQuery(function($){
    JVCMaster = {
        // Les extensions disponibles
        extensions : {
            antiBot : {description : 'AntiBot : Permet de cacher les posts des bots (flood)', file : 'JVCMaster_AntiBot.js'},
            citation : { description : 'Citation : Permet de citer un post', file : 'JVCMaster_Citation.js'},
            getCDVInformations : {description : 'GetCDVInformations : Permet d\'afficher des informations du pseudo sur son post (sexe, rang)', file : 'JVCMaster_GetCDVInformations.js'},
            hidePosts : {description : 'HidePosts : Permet de cacher des posts', file : 'JVCMaster_HidePosts.js'},
            showCdv : {description : 'ShowCDV : Permet d\'afficher la CDV d\'un pseudo dans une LightBox', file : 'JVCMaster_ShowCDV.js'},
            ShowNoelShackImages : {description : 'ShowNoelShackImages : Permet d\'afficher les images de NoelShack dans une LightBox', file : 'JVCMaster_ShowNoelShackImages.js'}
        },

        main : function(){
            $('<script>', {
                src : chrome.extension.getURL('lightbox.js')
            }).appendTo('body');

            // On construit la LightBox
            JVCMaster_LightBox.main();

            // On crée le bouton pour configurer JVCMaster
            var buttonOptions = $('<a/>', {
                href : '#',
                text : 'JVCMaster',
                click : function(e){
                    
                    $('<h2/>', {
                        'class' : 'titre_page',
                        html : '<span>JVCMaster : Configuration</span>'
                    }).appendTo('#JVCMaster_LightBox_popup');

                    $('<div class="bloc_forum"><h3><span class="txt">Extensions</span></h3><div class="bloc_inner"><ul id="JVCMaster_SortableExtensions" class="liste_liens">').appendTo('#JVCMaster_LightBox_popup');

                    // Si un ordre a déjà été choisis par l'utilisateur
                    var extensions = localStorage.getItem('JVCMaster_extensionsListed');
                    var activatedExtensions = localStorage.getItem('JVCMaster_extensionsActivated');

                    var extensionsParsed = JSON.parse(extensions);
                    var activatedExtensionsParsed = JSON.parse(activatedExtensions);

                    if(extensions && (extensionsParsed.length < Object.keys(JVCMaster.extensions).length)){
                        var extensionsNoListed = Object.keys(JVCMaster.extensions).slice(extensionsParsed.length, Object.keys(JVCMaster.extensions).length);
                        extensionsParsed.push(extensionsNoListed.toString());
                        localStorage.setItem('JVCMaster_extensionsListed', JSON.stringify(extensionsParsed));
                    }

                    // Si l'utilisateur n'as pas choisis d'ordre
                    $.each(JVCMaster.extensions, function(key, value){
                        $('<li>', {
                            id : 'JVCMaster_extension_' + key,
                            css : {
                                textAlign : 'left',
                                fontSize : '95%',
                                borderBottom : '1px solid rgb(237, 237, 237)',
                                verticalAlign : 'top'
                            },
                            html : '<input type="checkbox" style="margin-right: 3px" class="JVCMaster_activatedExtensions"' + (activatedExtensions && activatedExtensionsParsed[key] ? ' checked="checked" ' : '') + '/>' + JVCMaster.extensions[key].description
                        }).appendTo('#JVCMaster_SortableExtensions');
                    });
                    
                    // Si on clique sur un "checkbox"
                    $('.JVCMaster_activatedExtensions').click(function(){
                        var activaded = {} ;

                        // On boucle les "li", et on vérifie si le "checkbox" est coché
                        $('#JVCMaster_SortableExtensions li').each(function(){
                            var extensionName = $(this).attr('id').replace('JVCMaster_extension_', '');
                            var isActivated = $(this).children('input[type=checkbox]').is(':checked');

                            activaded[extensionName] = isActivated;
                            if(isActivated){
                                $('<script>', {
                                    src : chrome.extension.getURL(JVCMaster.extensions[extensionName].file)
                                }).appendTo('body');
                            }
                        });
                        localStorage.setItem('JVCMaster_extensionsActivated', JSON.stringify(activaded));
                    });
                    $('#JVCMaster_LightBox_layer').click(function(){
                        setTimeout(function(){
                            window.location.reload();
                        }, 600);
                    });
                    $('#JVCMaster_LightBox_popup').css({padding : '0 5px'});
                    JVCMaster_LightBox.show(500);
                    e.preventDefault();
                }
            });

            buttonOptions.appendTo($('<td id="JVCMaster_buttonOptions">').prependTo('table#connexion tbody tr'));

            // On cherche les extensions activées, et on les "installe"
            var activatedExtensions = JSON.parse(localStorage.getItem('JVCMaster_extensionsActivated'));
            if(activatedExtensions){
                $.each(activatedExtensions, function(key, value){
                    if(value){
                        $('<script>', {
                            src : chrome.extension.getURL(JVCMaster.extensions[key].file)
                        }).appendTo('body');
                    }
                });
            }
        },

        
    };

    JVCMaster.main();
});