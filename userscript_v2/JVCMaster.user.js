// ==UserScript==
// @name        JVCMaster Userscript
// @namespace   jvcmaster
// @description Ajoute des fonctionnalités aux forums de Jeuxvideo.com
// @include     http://www.jeuxvideo.com/*
// @include     https://www.jeuxvideo.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @run-at      document-end
// @version     2.0
// ==/UserScript==

window.JVCMaster_version = '2.0'

function JVCMaster(){
    this.version = window.JVCMaster_version;
    this.scripts = {};
    this.activatedScripts = JSON.parse(localStorage.getItem('JVCMaster_activatedScripts') || "{}");

    // Variables globales
    this.vars = {
        posts : $('.msg')
    };

    ///////////////////////////////////////////////////////////////////////
    // Model pour les scripts //
    ////////////////////////////
    //
    // this.scripts.<scriptId> = {
    //     id : '<scriptId>',
    //     name : '<scriptName>',
    //     description : "<scriptDescription>",
    //     main : function(){ // Quand le script est chargé
            
    //     },
    //     uninstall : function(){ // Quand le script est "déchargé"

    //     }
    // };
    ///////////////////////////////////////////////////////////////////////


    // Script "Anti-Bot"
    this.scripts.antibot = {
        id : 'antibot',
        name : 'Anti-Bot',
        description : "Permet de cacher les posts des bots",
        main : function(){
            vars.posts.each(function(){
                var t    = $(this);
                var html = t.html();

                if(/(?:(?:<br> ){9,}){5,}/.test(html) 
                || /^[0-9]+|http:\/\/concours-apple\.fr\.cr|[0-9]+$/.test(html)
                || /[WV]{30,}/.test(html)
                ){ // Si le post est un spam (flood)
                    var tPost = t.find('li.post:first').addClass('JVCMaster_hideByAntibot');
                    
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
                    t.find('li.post.JVCMaster_AntiBot_informPost').slideDown(300);
                }
            });
        },
        uninstall : function(){
            $('.JVCMaster_AntiBot_informPost').slideUp(300).remove();
            $('.JVCMaster_hideByAntibot').slideDown(300);
        }
    }

    // Script "Citation"
    this.scripts.citation = {
        id   : "citation",
        name : "Citation",
        description : "Permet de citer un post",
        main : function(){
            var textarea = $('#newmessage');
            var alertemail = $('.alertemail');

            $('<img />', {
                "class" : "JVCMaster_citation",
                css : { marginRight : '3px'},
                src : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIAwsCFkFaqukAAAEnSURBVCjPhdA/a1NxFMbxz/ndX25a/yaplDpZXB0c9C1UsEvnToKjQ/tSpO6ODq4ZBPFVCN0kNeCggxSKqbTc5v4ckjTp5IGzHL7nOc9zwuG4+F8dbQdk2H9+/3pe2lYps4YQPh6cFO8eR4bzEnNwavhqcEN05+2x3Sc9nw5OSl5VXIDP3ryXqqxzqyev35FyTclW4KtrtcnPb3rbT30d1f5OE/UftgYrcFnm/D461Zy39Dfp1ESFmMHDz7+YXvJ6c3FGRFKiImUEEdIySjgen4EH/bu0jUd9tA2lpRThcFz8vqBtxOSHdvjyxjdi7wvdPg83lp5FpXQH4sUHzkZUXdY26Nwmr82swVL9imbCxSllSupQ1dT32BrM4cXCPJyVNxKkikj+Af4IbKaIyj5/AAAAAElFTkSuQmCC'
            }).appendTo($('<a/>', {
                href : '#',
                click : function(e){
                    var postContainer = $(this).parent().parent().parent();
                    
                    // Si on est sur un topic, ou un mp
                    if(!postContainer)
                        return;

                    // Si on est sur un mp
                    if($('#reception').is('*') && $("#bouton_post").is('*')){
                        var post = $.trim(postContainer.find('.msg_body').html().replace(/( +<br(?: \/)?>)/g, '').replace(/<img.*?alt="([^"]*?)".*?>|<a.*?href="([^"]*?)".*?>.*?<\/a>|<img.*?class="img_shack".*?>/gi, '$1 $2')).replace(/&gt;/g, '>').replace(/&lt/g, '<').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').split('\n').join('\n| ');
                        var date = $.trim(postContainer.find('.msg_infos').text().replace('Posté ', '').replace('\n', ''));
                    } 
                    // Si on est sur un topic
                    else{
                        var post = $.trim(postContainer.find('li.post').html().replace(/( +<br(?: \/)?>)/g, '').replace(/<img.*?alt="([^"]*?)".*?>|<a.*?href="([^"]*?)".*?>.*?<\/a>|<img.*?class="img_shack".*?>/gi, '$1 $2')).replace(/&gt;/g, '>').replace(/&lt/g, '<').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').split('\n').join('\n| ');
                        var date = $.trim(postContainer.find('li.date').text().replace('Posté ', '').replace('\n', ''));
                    }

                    var pseudo = $.trim(postContainer.find('.pseudo strong').text());
                    var permalink = $.trim(postContainer.find('li.ancre a').attr('href'));

                    var citation = '';
                    
                    // Si on a déjà cité quelque chose
                    if(textarea.is('*') && textarea.val() !== '') citation += '\n\n';
                    
                    // Si un lien permanent est présent
                    if(permalink) citation += '| ' + permalink + '\n';

                    citation += "| Ecrit par « " + pseudo + " » , " + date + "\n| « "+ post + " »\n\n\n> ";

                    // Si on est sur la page d'un topic
                    if(alertemail.is('*') && !textarea.is('*')){
                        localStorage.setItem('JVCMaster_citation', citation);
                        window.location.href = $('.bt_repondre').attr('href');
                    } 
                    // Si on est sur la page de réponse d'un topic
                    else if(!alertemail.is('*') && textarea.is('*')){
                        if(textarea.val().match("Ne postez pas d'insultes, évitez les majuscules, faites une recherche avant de poster pour voir si la question n'a pas déjà été posée..."))
                            textarea.val('');
                        textarea.val(textarea.val() + citation);
                    }
                    
                    e.preventDefault();
                }
            }).appendTo(vars.posts.find(".pseudo")));

            // // Si on est sur la page d'un topic
            if($('.nouveau').is('*') && textarea.is('*')){
                var citation = localStorage.getItem('JVCMaster_citation');
                if(citation){
                    textarea.val(citation);
                    localStorage.removeItem('JVCMaster_citation');
                }
                
                textarea.get(0).setSelectionRange(textarea.val().length, textarea.val().length);
                textarea.focus();
            }
        },

        uninstall : function(){
            $('.JVCMaster_citation').remove();
            localStorage.removeItem('JVCMaster_citation');
        }
    };

    // Script "CDV informations"
    this.scripts.cdvinformations = {
        id : 'cdvinformations',
        name : 'CDV informations',
        description : 'Permet d\'afficher des informations d\'un pseudo à ses côtés',
        main : function(){
            $('.pseudo strong').each(function(t){
                var t = $(this);
                var tParent = t.parent();

                $.ajax({
                    url : 'http://www.jeuxvideo.com/profil/' + t.text() + '.html',
                    success : function(data){
                        // Si le pseudo est banni
                        if(data.match('<p class="banni">')){
                            tParent.find('a[href^=http\\:\\/\\/www\\.jeuxvideo\\.com\\/profil] img').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wICggWDgPWFDkAAAD2SURBVCjPhdEtroNAEMDxP4VtsqYkxXALDAoBohfgCIg9wJpaLoDZA+BxXAgEsmkIigSxJDzR0Pa9NK/jJvnNZD4crfXGlzDGOAAeQBzH/2Kt9WaMcTwAay0ARVH8QlVVcTqdiKIIrfV22PFfCHC9XhmGgXmeATi8dwZIkoTL5fLMu65jmiaeM1trKcuSrusIw5C2bQHIsowgCFjX9YX7vsday/F4pGkaANI0BcB1Xe73O1LKBwYQQiCEQCnF7XZDCMH5fCYIAoQQr87vUdc1AHme4/v+E37ESinGcfx4b2c/+r6EtZZlWQCQUr5G8LwH3gu+vf0HNF5XpCC6I0sAAAAASUVORK5CYII=');
                        }
                        else{
                            var rank = data.match('<body.*class="(.*)">')[1],
                                sexe = data.match('<h1.*class="(sexe_[f|m])">')[1];

                            // On ajoute des styles au pseudo en fonction de son sexe
                            t.css({
                                backgroundColor : (sexe == 'sexe_m') ? '#B3E0FF' : '#FFC2E0',
                                borderRadius : '5px',
                                padding : '3px',
                                display : 'inline-block'
                            });

                            // Quand on passe et enlève la souris sur le pseudo 
                            t.hover(function(){
                                t.css({
                                    backgroundColor : (sexe == 'sexe_m') ? '#A1CAE6' : '#E6AFCA'
                                })
                            },
                            function(){
                                t.css({
                                    backgroundColor : (sexe == 'sexe_m') ? '#B3E0FF' : '#FFC2E0'
                                });
                            });

                            $('<span>', {
                                'class' : 'JVCMaster_cdvinformations_rank',
                                css : {
                                    marginRight : '3px',
                                    display : 'inline-block',
                                    height : '12px',
                                    width : '14px',
                                    backgroundImage : 'url("data:image/png;base64,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")'
                                }
                            }).appendTo(tParent);
                            
                            // On cherche le rang
                            switch(rank){
                                case 'carton':
                                    tParent.find('.JVCMaster_cdvinformations_rank').css({
                                        width : '13px',
                                        height : '13px',
                                        backgroundPosition : '0 0'
                                    });
                                    break;

                                case 'bronze':
                                    tParent.find('.JVCMaster_cdvinformations_rank').css({
                                        width : '8px',
                                        height : '14px',
                                        backgroundPosition : '-14px 0'
                                    });
                                    break;

                                case 'argent':
                                    tParent.find('.JVCMaster_cdvinformations_rank').css({
                                        height : '13px',
                                        backgroundPosition : '-22px 0'
                                    });
                                    break;

                                case 'or':
                                    tParent.find('.JVCMaster_cdvinformations_rank').css({
                                        width : '13px',
                                        height : '13px',
                                        backgroundPosition : '0 -14px'
                                    });
                                    break;

                                case 'rubis':
                                    tParent.find('.JVCMaster_cdvinformations_rank').css({
                                        width : '11px',
                                        backgroundPosition : '-14px -15px'
                                    });
                                    break;

                                case 'saphir':
                                    tParent.find('.JVCMaster_cdvinformations_rank').css({
                                        width : '12px',
                                        backgroundPosition : '0 -28px'
                                    });
                                    break;

                                case 'emeraude':
                                    tParent.find('.JVCMaster_cdvinformations_rank').css({
                                        width : '12px',
                                        backgroundPosition : '-12px -28px'
                                    });
                                    break;

                                case 'diamant':
                                    tParent.find('.JVCMaster_cdvinformations_rank').css({
                                        width : '11px',
                                        backgroundPosition : '-25px -27px'
                                    });
                                    break;
                            }
                        }
                    }
                })
            });
        },
        uninstall : function(){
            $('.pseudo strong').css({
                backgroundColor : '',
                borderRadius : '',
                padding : ''
            });
            $('.JVCMaster_cdvinformations_rank').remove();
        }
    };

    // Script "HidePost"
    this.scripts.hidepost = {
        id   : "hidepost",
        name : "HidePost",
        description : "Permet de cacher un post",
        main : function(){
            // S'il y a des posts, et qu'ils on un id
            if(vars.posts && vars.posts[0].id !== ''){
                var hiddenPosts = JSON.parse(localStorage.getItem('JVCMaster_HiddenPosts') || "[]");
                var hiddenPostsViaPseudos = JSON.parse(localStorage.getItem('JVCMaster_HiddenPostsViaPseudos') || "[]");

                // Le message d'information comme quoi le post a été caché
                vars.posts.find('li.post').after($('<li/>', {
                    'class' : 'JVCMaster_HiddenPosts_informPost post',
                    html : '<b>JVCMaster</b> : <i>Ce message a été caché</i>',
                    css : {
                        display : 'none'
                    }
                }));

                vars.posts.each(function(){
                    var t = $(this);

                    // Si un id ou un pseudo est à cacher
                    if(hiddenPosts.indexOf(t.attr('id').replace('message_', '')) !== -1
                        || hiddenPostsViaPseudos.indexOf($.trim(t.find('.pseudo strong').text().toLowerCase())) !== -1){
                            
                        t.find('li.post:first').slideUp(300);
                        t.find('li.post:last').slideDown(300);
                    }
                });

                // Bouton pour cacher un post
                $('<img />', {
                    'class' : 'JVCMaster_hidepost',
                    css : { marginRight : '3px'},
                    src : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIBAoODxWRH6sAAADcSURBVCjPlZExbsJgDIU/+ycVGxMjZe7UMwTOwlU4R3uQROICrTIhMRDRIjYGRFUFEvx3+EVCEKjiTc/2e7ZlS5Li+QfjEQLQAYjj17pg5jmdAncOVIUkzfx4hGhIH4EjZgecZjxFGXn+w35fYHYgjl9IUrxejquqhs9mv2w2VSvXuRR736yf5yXr7yWDAUQRPA9B2+KGf35sW3Hd+f1tDkBZwmRy/yrKA7grdg5EbqxxhghMp8JiAf0+dLttgwAkKf5rBWZQFLDbhWKvFwyq4Rq17/x2M64+2HT+A8hKUErfzQyDAAAAAElFTkSuQmCC'
                }).appendTo($('<a/>', {
                    href : '#',
                    click : function(e){
                        var t = $(this);
                        var postContainer = t.parent().parent().parent();
                        if(postContainer.attr('id')){
                            var postContainerId = postContainer.attr('id').replace('message_', '');

                             // Si le post n'est pas déjà caché
                            if(hiddenPosts.indexOf(postContainerId) === -1){
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
                    }
                }).appendTo(vars.posts.find(".pseudo")));

                $('<img />', {
                    'class' : 'JVCMaster_hidepseudo',
                    css : { marginRight : '3px'},
                    src : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIBAoHF9c/PLQAAADmSURBVCjPhdGxTgJBFIXhb2BiYkUpPYliYWjUzkLexVcylj7JPoOhWWIkRkoLEqxWYHcsnF23IHGqk9z/zpxzJhQk/5w5ASLcz2bdoElJjZSSEIIhisUizQkR7HbgkJJYlgZ5sZxMnMXobjpVLJdp0L8xliV4HI/B5WplUVW2da1pbcABJ1m/7fedraf12hVu6F6U0l/Ol82m01/49ttChOeytMdDBoreYo0m68Gxqm5D6HS/16PwaU/HHhQK0kcO+InXrEfYZvgc1/LPFKR3VBlIuZldBka4aOF2ocmB5EHrd5it/AD/OVM2g9hH0wAAAABJRU5ErkJggg=='
                }).appendTo($('<a/>', {
                    href : '#',
                    click : function(e){
                        var postContainer = $(this).parent().parent().parent();
                        var pseudoToHide = $.trim(postContainer.find('.pseudo').text().toLowerCase());
                        var toHide = (hiddenPostsViaPseudos.indexOf(pseudoToHide) === -1) ? true : false;

                        vars.posts.each(function(){
                            var t = $(this);
                            var pseudo = $.trim(t.find('.pseudo').text().toLowerCase());

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
                }).appendTo(vars.posts.find('.pseudo')));
            }
        },

        uninstall : function(){
            $('.JVCMaster_hidepost').remove();
            $('.JVCMaster_hidepseudo').remove();
            vars.posts.find('li.post:first').slideDown(300);
            vars.posts.find('li.post:last').slideUp(300).remove();
        }
    };

    // Script "Show CDV"
    this.scripts.showcdv = {
        id   : "showcdv",
        name : "Show CDV",
        description : "Affiche la CDV d'un pseudo dans une LightBox",
        main : function(){
            // Evite que la cdv se duplique si l'utilisateur bourine le bouton
            var alreadyLoading = false;
            var pseudos = $('.pseudo strong');
            pseudos.css('cursor', 'pointer');

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
                            lb.show();
                            alreadyLoading = false;
                        }
                    }).appendTo('#JVCMaster_LightBox_popup');

                }
                e.preventDefault();
            });
        },
        uninstall : function(){
            var pseudos = $('.pseudo strong');
            pseudos.css('cursor', '');
            pseudos.unbind('click');
        }
    };

    // Script "Visionneuse d'image NoelShack"
    this.scripts.noelshack = {
        id : 'noelshack',
        name : 'Visionneuse d\'image NoelShack',
        description : 'Permet d\'afficher les images de NoelShack dans la LightBox',
        main : function(){
            // Evite que la cdv se duplique si l'utilisateur bourine le bouton
            var alreadyLoading = false;

            $('.img_shack, a[href^=http\\:\\/\\/www\\.noelshack\\.com], a[href^=http\\:\\/image\\.noelshack\\.com]').click(function(e){
                if(!alreadyLoading){
                    alreadyLoading = true;

                    // Si c'est une minitature
                    if($(this).attr('class') === 'img_shack')
                        var imgFalseUrl = $(this).parent().attr('href');
                    // Si c'est un lien hyper-texte
                    else{
                        var imgFalseUrl = $(this).attr('href');
                    }
                    
                    var imgTrueUrl = '';
                    
                    // Si une miniature est activé
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

                            lb.show();
                        }
                    }).appendTo($('<a/>', {
                        href : imgTrueUrl
                    }).appendTo('#JVCMaster_LightBox_popup'));

                }
                e.preventDefault();
            });
        },
        uninstall : function(){
            $('.img_shack, a[href^=http\\:\\/\\/www\\.noelshack\\.com]').unbind('click');
        }
    };

    // LightBox
    function LightBox(){
        // On crée le calque qui servira à cacher la page
        $('<div>', {
            id : 'JVCMaster_LightBox_layer',
            css : {
                position : 'fixed',
                display  : 'none',
                top : 0, right : 0, bottom : 0, left : 0,
                background: 'rgba(0, 0, 0, 0.7)',
                zIndex: 99999998
            },
            click : function(){
                lb.hide();
            }
        }).appendTo('body');
        
        // On crée la popup
        $('<div>', {
            id : 'JVCMaster_LightBox_popup',
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
        

        this.show = function(width, height, html){
            var popup = $('#JVCMaster_LightBox_popup');

            popup.css({
                width : width + 'px',
                height : height + 'px'
            });
            popup.css({ // obligé d'appeler 2 fois '.css()', sinon la popup n'est bien placé qu'à son 2ème déclenchement
                top : (window.innerHeight / 2 - popup.css('height').replace('px', '')  / 2) + 'px',
                left : (window.innerWidth / 2 - popup.css('width').replace('px', '') / 2) + 'px'
            });
            
            // popup.html(html || '');

            $('#JVCMaster_LightBox_layer').fadeIn(300, function(){
                popup.fadeIn(300);
            });
        }

        this.hide = function(){
            var popup = $('#JVCMaster_LightBox_popup');

            popup.fadeOut(300, function(){
                $('#JVCMaster_LightBox_layer').fadeOut(300, function(){
                    popup.html('');
                    popup.css('padding', '0');
                });
            });
        }
    };
    window.JVCMaster_Lightbox = lb = new LightBox();

    // Fonction principale
    (function(){
        scripts = this.scripts;

        // Bug sous Firefox
        $('#connexion').css('display', 'block');

        $.each(activatedScripts, function(key, value){
            if(value)
                scripts[key].main();
        });
        
        var buttonOptions = $("<a/>", {
            href : '#',
            text : "JVCMaster " + this.version,
            click : function(e){
                $('<div class="bloc_forum"><h3><span class="txt">JVCMaster : Extensions</span></h3><div class="bloc_inner"><ul id="JVCMaster_Scripts" class="liste_liens">').appendTo('#JVCMaster_LightBox_popup');

                // On boucle sur les scripts
                $.each(scripts, function(key, value){
                    $('<li>', {
                        id : 'JVCMaster_extension_' + value.id,
                        css : {
                            textAlign : 'left',
                            fontSize : '95%',
                            borderBottom : '1px solid rgb(237, 237, 237)',
                            verticalAlign : 'top'
                        },
                        html : '<input type="checkbox" style="margin-right: 3px" ' + (activatedScripts[value.id] ? 'checked="checked"' : '') + '/><b style="vertical-align:top">' + value.name + "</b> : " + value.description
                    }).appendTo('#JVCMaster_Scripts');
                    
                    $("#JVCMaster_extension_" + value.id + " input[type=checkbox]").click(function(){
                        if($(this).is(':checked')){
                            scripts[value.id].main();
                            activatedScripts[value.id] = true;
                        }
                        else{
                            scripts[value.id].uninstall();
                            activatedScripts[value.id] = false;
                        }

                        localStorage.setItem("JVCMaster_activatedScripts", JSON.stringify(activatedScripts));
                    });
                });
                
                var lb_popup = $('#JVCMaster_LightBox_popup');
                
                lb_popup.css('padding', '5px 5px 0');
                lb.show();
                e.preventDefault();
            }
        }).appendTo($('<td id="JVCMaster_buttonOptions">').prependTo($('table#connexion tbody tr')));
        
        // Si l'utilisateur viens d'installer JVCMaster
        if(typeof localStorage.getItem('JVCMaster_firstUse') === 'object'){
            buttonOptions.click();
            localStorage.setItem('JVCMaster_firstUse', '0');
        }

        // Permet de comparer 2 versions
        
    })();
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('(JVCMaster = ' + JVCMaster +')(JVCMaster_version = "' + window.JVCMaster_version + '");'));
(document.body || document.head || document.documentElement).appendChild(script)

versionCompare = function(left, right) {
    if (typeof left + typeof right != 'stringstring')
        return false;
    
    var a = left.split('.')
    ,   b = right.split('.')
    ,   i = 0, len = Math.max(a.length, b.length);
        
    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
            return -1;
        }
    }
    
    return 0;
}

var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var newVersion = xhr.responseText;
            if(versionCompare(JVCMaster_version, newVersion )){
                if(typeof localStorage.getItem('JVCMaster_dontUpdateVersion') === 'string'
                    || localStorage.getItem('JVCMaster_dontUpdateVersion') != newVersion){
                    function JVCMaster_updateNotification(newVersion){
                    var lb_popup = document.querySelector('#JVCMaster_LightBox_popup');
                    lb_popup.style.padding = "5px 5px 0";
                    lb_popup.innerHTML = '<div class="bloc_forum"><h3><span class="txt">JVCMaster : Mise à jour</span></h3><div class="bloc_inner">'+ "<p>La version « <b>" + newVersion + "</b> » est sortie, voulez-vous la télécharger?</p><p style='margin-top:20px; text-align:center'><input type='button' value='Oui' onclick='javascript:window.open(\"http://kocal.github.com/JVCMaster/\", \"_newtab\");' /> <input type='button' value=\"J'en ai rien à battre des MàJ\" onclick=\"localStorage.setItem('JVCMaster_dontUpdateVersion', '" + newVersion + "'); JVCMaster_Lightbox.hide(); \"/></p></div></div>"
                    JVCMaster_Lightbox.show()
                }

                var script = document.createElement('script');
                script.appendChild(document.createTextNode('(' + JVCMaster_updateNotification + ')(newVersion = "' + newVersion + '");'));
                (document.body || document.head || document.documentElement).appendChild(script)
                }
            }
        }
    };
    xhr.open("GET", "https://raw.github.com/Kocal/JVCMaster/master/userscript_v2/version", true);
    xhr.send(null);