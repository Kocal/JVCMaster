// ==UserScript==
// @name        JVCMaster Userscript
// @namespace   jvcmaster
// @description Ajoute des fonctionnalités aux forums de Jeuxvideo.com
// @include     http://www.jeuxvideo.com/*
// @include     https://www.jeuxvideo.com/*
// @run-at      document-end
// @version     2.1.9
// ==/UserScript==

/*
Dans une variable :
    "JVCMaster_" : indique que celle-ci appartient à JVCMaster

Au début d'une variable    
    "o" : Object
    "s" : String
    "b" : Boolean
*/

window.JVCMaster_sVersion = "2.1.9"

function JVCMaster(){
    this.version = window.JVCMaster_sVersion;
    this.oScripts = {};
    this.sActivatedScripts = JSON.parse(localStorage.getItem("JVCMaster_sActivatedScripts") || "{}");

    // Variables globales
    this.vars = {
        // Ce qui contient le pseudo, la date, le post et le permalink 
        oPostContainer : jQuery('.msg'),
        // Les posts
        oPosts : jQuery('li.post')
    };

    this.funcs = {
        sortObject : function(o) {     var sorted = {},     key, a = [];      for (key in o) {         if (o.hasOwnProperty(key)) {                 a.push(key);         }     }      a.sort();      for (key = 0; key < a.length; key++) {         sorted[a[key]] = o[a[key]];     }     return sorted; }
    }
    ///////////////////////////////////////////////////////////////////////
    // Model pour les scripts //
    ////////////////////////////
    //
    // this.oScripts.<scriptId> = {
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
    this.oScripts.antibot = {
        id : "antibot",
        name : "Anti-Bot",
        description : "Permet de cacher les posts des bots",
        main : function(){
            vars.oPosts.each(function(){
                var t    = jQuery(this);
                var sHtml = t.html();
                    
                if(/(?:(?:<br(\/ )?> *){9,}){5,}/gi.test(sHtml)
                || /^[0-9]+|http:\/\/concours-apple\.fr\.cr|[0-9]+jQuery/gi.test(sHtml)
                || /[@]{15,}|([W]+[V]+(<br (\/)?>+)){20,}/gi.test(sHtml)){
                    
                    // On cache le post
                    t.slideUp(300);

                    // On insère après celui-ci, un post d'information
                    t.after(jQuery("<li>", {
                        "class" : "JVCMaster_AntiBot_informPost post",
                        html    : "<b>JVCMaster</b> : <i>Spam, ce message a &eacute;t&eacute; cach&eacute;, cliquer pour faire apparaitre le post</i>",
                        css : {cursor : "pointer", display : "none"},
                        click : function(e){
                            jQuery(this).slideUp(300);
                            t.slideDown(300);
                        }
                    }));
                    
                    // On montre le message d'information pour chaque posts caché
                    t.parent().find("li.post.JVCMaster_AntiBot_informPost").slideDown(300);
                }
             });
        },
        uninstall : function(){
            jQuery(".JVCMaster_AntiBot_informPost").slideUp(300).remove();
            jQuery(".JVCMaster_hideByAntibot").slideDown(300);
        }
    }

    // Script "Citation"
    this.oScripts.citation = {
        id   : "citation",
        name : "Citation",
        description : "Permet de citer un post",
        main : function(){
            // Présent sur la page de réponse d'un topic
            var oTextarea = jQuery("#newmessage");
            // Présent sur les pages d'un topic
            var oAlertemail = jQuery(".alertemail");

            // Bouton de citation
            jQuery('<img />', {
                "class" : "JVCMaster_btn_citation",
                css : { marginRight : "3px"},
                src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIAwsCFkFaqukAAAEnSURBVCjPhdA/a1NxFMbxz/ndX25a/yaplDpZXB0c9C1UsEvnToKjQ/tSpO6ODq4ZBPFVCN0kNeCggxSKqbTc5v4ckjTp5IGzHL7nOc9zwuG4+F8dbQdk2H9+/3pe2lYps4YQPh6cFO8eR4bzEnNwavhqcEN05+2x3Sc9nw5OSl5VXIDP3ryXqqxzqyev35FyTclW4KtrtcnPb3rbT30d1f5OE/UftgYrcFnm/D461Zy39Dfp1ESFmMHDz7+YXvJ6c3FGRFKiImUEEdIySjgen4EH/bu0jUd9tA2lpRThcFz8vqBtxOSHdvjyxjdi7wvdPg83lp5FpXQH4sUHzkZUXdY26Nwmr82swVL9imbCxSllSupQ1dT32BrM4cXCPJyVNxKkikj+Af4IbKaIyj5/AAAAAElFTkSuQmCC"
            }).appendTo(jQuery("<a/>", {
                href : "#",
                click : function(e){
                    var oPostContainer = jQuery(this).parent().parent().parent();
                    
                    // Si on est pas sur un topic, ou un mp
                    if(!oPostContainer.is('*'))
                        return;

                    // Si on est sur un mp
                    if(jQuery("#reception").is("*") && jQuery("#bouton_post").is("*")){
                        var sPost = jQuery.trim(oPostContainer.find(".msg_body").html().replace(/( +<br(?: \/)?>)/g, "").replace(/<img.*?alt="([^"]*?)".*?>|<a.*?href="([^"]*?)".*?>.*?<\/a>|<img.*?class="img_shack".*?>/gi, "jQuery1 jQuery2")).replace(/&gt;/g, ">").replace(/&lt/g, "<").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").split("\n").join("\n| ");
                        var sDate = jQuery.trim(oPostContainer.find(".msg_infos").text().replace("Post&eacute; ", "").replace("\n", ""));
                    } 
                    // Si on est sur un topic
                    else{
                        var sPost = jQuery.trim(oPostContainer.find("li.post").html().replace(/( +<br(?: \/)?>)/g, "").replace(/<img.*?alt="([^"]*?)".*?>|<a.*?href="([^"]*?)".*?>.*?<\/a>|<img.*?class="img_shack".*?>/gi, "jQuery1 jQuery2")).replace(/&gt;/g, ">").replace(/&lt/g, "<").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").split("\n").join("\n| ");
                        var sDate = jQuery.trim(oPostContainer.find("li.date").text().replace("Post&eacute; ", "").replace("\n", ""));
                    }

                    var sPseudo = jQuery.trim(oPostContainer.find(".pseudo strong").text());
                    var sPermalink = jQuery.trim(oPostContainer.find("li.ancre a").attr("href"));

                    var sCitation = "";
                    
                    // Sur la page de réponse d'un topic, s'il y a déjà du texte
                    if(oTextarea.is('*') && oTextarea.val() !== "") sCitation += "\n\n";
                    
                    // Si un lien permanent est présent
                    if(sPermalink) sCitation += "| " + sPermalink + "\n";

                    sCitation += "| Ecrit par « " + sPseudo + " » , " + sDate + "\n| « "+ sPost + " »\n\n\n> ";

                    // Si on est sur la page d"un topic
                    if(oAlertemail.is('*') && !oTextarea.is('*')){
                        localStorage.setItem("JVCMaster_citation", sCitation);
                        window.location.href = jQuery(".bt_repondre").attr("href");
                    } 
                    // Si on est sur la page de réponse d"un topic
                    else if(!oAlertemail.is('*') && oTextarea.is('*')){
                        if(oTextarea.val().match("Ne postez pas d\"insultes, &eacute;vitez les majuscules, faites une recherche avant de poster pour voir si la question n\"a pas d&eacute;jà &eacute;t&eacute; pos&eacute;e..."))
                            oTextarea.val("");
                        oTextarea.val(oTextarea.val() + sCitation);
                    }
                    
                    e.preventDefault();
                }
            }).appendTo(vars.oPostContainer.find(".pseudo")));

            // // Si on est sur la page d'un topic
            if(jQuery(".nouveau").is('*') && oTextarea.is('*')){
                var sCitation = localStorage.getItem("JVCMaster_citation");
                if(sCitation){
                    oTextarea.val(sCitation);
                    localStorage.removeItem("JVCMaster_citation");
                }
                
                oTextarea.get(0).setSelectionRange(oTextarea.val().length, oTextarea.val().length);
                oTextarea.focus();
            }
        },

        uninstall : function(){
            jQuery(".JVCMaster_btn_citation").remove();
            localStorage.removeItem("JVCMaster_citation");
        }
    };

    // Script "CDV informations"
    this.oScripts.cdvinformations = {
        id : "cdvinformations",
        name : "CDV informations",
        description : "Permet d'afficher des informations d'un pseudo à ses côt&eacute;s",
        main : function(){
            jQuery(".pseudo strong").each(function(t){
                var t = jQuery(this);
                var otParent = t.parent();

                jQuery.ajax({
                    url : "http://www.jeuxvideo.com/profil/" + t.text() + ".html",
                    success : function(data){
                        // Si le pseudo est banni
                        if(data.match("<p class=\"banni\">")){
                            otParent.find("a[href^=http\\:\\/\\/www\\.jeuxvideo\\.com\\/profil] img").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wICggWDgPWFDkAAAD2SURBVCjPhdEtroNAEMDxP4VtsqYkxXALDAoBohfgCIg9wJpaLoDZA+BxXAgEsmkIigSxJDzR0Pa9NK/jJvnNZD4crfXGlzDGOAAeQBzH/2Kt9WaMcTwAay0ARVH8QlVVcTqdiKIIrfV22PFfCHC9XhmGgXmeATi8dwZIkoTL5fLMu65jmiaeM1trKcuSrusIw5C2bQHIsowgCFjX9YX7vsday/F4pGkaANI0BcB1Xe73O1LKBwYQQiCEQCnF7XZDCMH5fCYIAoQQr87vUdc1AHme4/v+E37ESinGcfx4b2c/+r6EtZZlWQCQUr5G8LwH3gu+vf0HNF5XpCC6I0sAAAAASUVORK5CYII=");
                        }
                        else{
                                // Rang
                            var sRank = data.match("<body.*class=\"(.*)\">")[1],
                                // Sexe
                                sSexe = data.match("<h1.*class=\"(sexe_[f|m])\">")[1];

                            // On ajoute des styles au pseudo en fonction de son sexe
                            t.css({
                                backgroundColor : (sSexe == "sexe_m") ? "#B3E0FF" : "#FFC2E0",
                                borderRadius : "5px",
                                padding : "3px",
                                display : "inline-block"
                            });

                            // Quand on passe et enlève la souris sur le pseudo 
                            t.hover(function(){
                                t.css({
                                    backgroundColor : (sSexe == "sexe_m") ? "#A1CAE6" : "#E6AFCA"
                                })
                            },
                            function(){
                                t.css({
                                    backgroundColor : (sSexe == "sexe_m") ? "#B3E0FF" : "#FFC2E0"
                                });
                            });

                            jQuery("<span>", {
                                "class" : "JVCMaster_cdvinformations_rank",
                                css : {
                                    marginRight : "3px",
                                    display : "inline-block",
                                    height : "12px",
                                    width : "14px",
                                    backgroundImage : "url(data:image/png;base64,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)"
                                }
                            }).appendTo(otParent);
                            
                            // On cherche le rang
                            switch(sRank){
                                case "carton":
                                    otParent.find(".JVCMaster_cdvinformations_rank").css({
                                        width : "13px",
                                        height : "13px",
                                        backgroundPosition : "0 0"
                                    });
                                    break;

                                case "bronze":
                                    otParent.find(".JVCMaster_cdvinformations_rank").css({
                                        width : "8px",
                                        height : "14px",
                                        backgroundPosition : "-14px 0"
                                    });
                                    break;

                                case "argent":
                                    otParent.find(".JVCMaster_cdvinformations_rank").css({
                                        height : "13px",
                                        backgroundPosition : "-22px 0"
                                    });
                                    break;

                                case "or":
                                    otParent.find(".JVCMaster_cdvinformations_rank").css({
                                        width : "13px",
                                        height : "13px",
                                        backgroundPosition : "0 -14px"
                                    });
                                    break;

                                case "rubis":
                                    otParent.find(".JVCMaster_cdvinformations_rank").css({
                                        width : "11px",
                                        backgroundPosition : "-14px -15px"
                                    });
                                    break;

                                case "saphir":
                                    otParent.find(".JVCMaster_cdvinformations_rank").css({
                                        width : "12px",
                                        backgroundPosition : "0 -28px"
                                    });
                                    break;

                                case "emeraude":
                                    otParent.find(".JVCMaster_cdvinformations_rank").css({
                                        width : "12px",
                                        backgroundPosition : "-12px -28px"
                                    });
                                    break;

                                case "diamant":
                                    otParent.find(".JVCMaster_cdvinformations_rank").css({
                                        width : "11px",
                                        backgroundPosition : "-25px -27px"
                                    });
                                    break;
                            }
                        }
                    }
                })
            });
        },
        uninstall : function(){
            jQuery(".pseudo strong").css({
                backgroundColor : "",
                borderRadius : "",
                padding : ""
            });
            jQuery(".JVCMaster_cdvinformations_rank").remove();
        }
    };

    this.oScripts.favoritestopic = {
        id : "favoritestopic",
        name : "Topic favoris",
        description : "Permet d'épingler ces topics favoris dans une box",
        main : function(){
                var oTopicFavorites = funcs.sortObject(JSON.parse(localStorage.getItem("JVCMaster_TopicFavorites") || "{}"));
            
            // Ce qui sera affiché dans la box juste en dessous des forums préférés 
            var sHtml = "<h3 class=\"titre_bloc\"><span>Mes topics préférés</span></h3>";
                sHtml += "<div class=\"bloc_inner\">";
                sHtml += "<ul class=\"liste_liens\">";
                sHtml += "</ul>";
                sHtml += "</div>";

            // Box en dessous des forums préférés
            jQuery("div.bloc3").after(
                jQuery("<div>", {
                    id : "JVCMaster_TopicFavorites",
                    "class" : "bloc3",
                    html : sHtml
                })
            );
            
            (listTopicFavorites = function(){
                var oTopicFavorites = funcs.sortObject(JSON.parse(localStorage.getItem("JVCMaster_TopicFavorites") || "{}"));
                for(topic in oTopicFavorites){
                    jQuery("<a/>", {
                        href : oTopicFavorites[topic]["sTopicUrl"],
                        html : "<b>" + oTopicFavorites[topic]["sForumName"] + "</b> : " + oTopicFavorites[topic]["sTopicName"] 
                    }).after(jQuery("<a/>", {
                        "class" : "JVCMaster_btn_topicfavorites_delete",
                        css : {
                            display : "none",
                            width : "10px",
                            height : "10px",
                            position : "absolute",
                            top : "2px",
                            cursor : 'pointer',
                            right : "0",
                            background : "url(http://image.jeuxvideo.com/css_img/defaut/bt_forum_supp_pref.png) no-repeat top left"
                        },
                        mouseover : function(){
                            jQuery(this).css("backgroundPosition", "bottom left");
                        },
                        mouseout : function(){
                            jQuery(this).css("backgroundPosition", "top left");
                        },
                        click : function(e){
                            var tParent = jQuery(this).parent();
                            // console.log(tParent.attr("data-jvcmaster_forumname"));
                            // console.log(tParent.attr("data-jvcmaster_topicname"));
                            delete oTopicFavorites[tParent.attr("data-jvcmaster_forumname") + "_" + tParent.attr("data-jvcmaster_topicname")]                        
                            localStorage.setItem("JVCMaster_TopicFavorites", JSON.stringify(oTopicFavorites));

                            tParent.slideUp(300, function(){
                                jQuery(".JVCMaster_TopicFavorites").remove();
                                listTopicFavorites();
                            });

                            e.preventDefault();
                        }
                    })).appendTo(jQuery("<li>", {
                        "class" : "JVCMaster_TopicFavorites",
                        "data-jvcmaster_forumname" : oTopicFavorites[topic]["sForumName"],
                        "data-jvcmaster_topicname" : oTopicFavorites[topic]["sTopicName"],
                        css : {
                            position : "relative"
                        },
                        mouseover : function(){
                            var t = jQuery(this);
                            t.find(".JVCMaster_btn_topicfavorites_delete").css("display", "inline-block");
                            t.css("backgroundColor", "#F5F5F5");
                        },
                        mouseout : function(){
                            var t = jQuery(this);
                            t.find(".JVCMaster_btn_topicfavorites_delete").css("display", "none");
                            t.css("backgroundColor", "#EDEDED");
                        }
                    }).appendTo("#JVCMaster_TopicFavorites ul"));
                }
            })();

            // Pour insérer le bouton juste à côté
            jQuery("div.bloc_forum div.bloc_inner").css("textAlign", "center");
            // On règle les quelques bugs d"alignement
            jQuery("div.bloc_forum form").css("textAlign", "left");
            jQuery("div.bloc_forum td.nouveau, div.bloc_forum td.navig_prec").css("textAlign", "left");
            // On insère le petit bouton à côté des titres du topic

            jQuery("div.bloc_forum h1.sujet, div.bloc_forum h4.sujet").css({
                display : "inline-block",
                verticalAlign : "middle"
            }).after(
                jQuery("<img>", {
                    id : "JVCMaster_addTooTopicFavorites",
                    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAIAQMAAAARA0f2AAAABlBMVEX///+ZzADAT8hDAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfcCBsMAieAZsMmAAAAGklEQVQI12MoZ2D43wBF9QwMdgwMMgwMHAwAXZcF1pKKg9EAAAAASUVORK5CYII=",
                    css : {
                        cursor : "pointer",
                        marginLeft : "5px",
                    },
                    title : "JVCMaster : ajouter ce topic à vos topics favoris",
                    click : function(e){
                        // L'url du topic (première page)
                        var sTopicUrl = '';
                        // On cherche l"url de la première page du topic
                        var oPagination = jQuery(".pagination:first strong, .pagination:first a");

                        // S"il n"y a pas de pagination
                        if(oPagination.is('*')){
                            oPagination.each(function(){
                                var t = jQuery(this);
                                if(t.text() == 1){
                                    if(t.attr('href') || t.text()){
                                        sTopicUrl = t.attr('href') || window.location.href;
                                    }
                                }
                            })
                        }
                        else{
                            tmp = jQuery(".revenir a:first");
                            if(tmp.is('*')){
                                tmp = tmp.attr('href').split("-");
                                tmp[3] = "1"; // Première page
                                sTopicUrl = tmp.join("-");
                            }
                            else{
                                sTopicUrl = window.location.href;
                            }
                        }

                        // On cherche le nom du forum 
                        var sForumName = jQuery.trim(jQuery(".bloc_forum h3:first").text().replace("Forum : ", ""));
                        // On cherche le nom du topic
                        var sTopicName = jQuery(".bloc_forum .sujet:first").text();
                            sTopicName = jQuery.trim(sTopicName.substr(10).substr(0, sTopicName.length - 12)); 
                        
                        // La clé est sous forme <forumName>_<topicName> pour trier par le nom du forum, et ensuite du topic
                        oTopicFavorites[sForumName + "_" + sTopicName] = {
                            sForumName : sForumName,
                            sTopicUrl  : sTopicUrl,
                            sTopicName : sTopicName
                        } 

                        // On stock
                        localStorage.setItem("JVCMaster_TopicFavorites", JSON.stringify(oTopicFavorites));

                        // On actualise les topics favoris
                        jQuery(".JVCMaster_TopicFavorites").remove();
                        listTopicFavorites();
                           
                        e.preventDefault();
                    }
                })
            );


        },
        uninstall : function(){
            jQuery("#JVCMaster_addTooTopicFavorites").remove();
            jQuery("#JVCMaster_TopicFavorites").remove();
        }
    }

    // Script "HidePost"
    this.oScripts.hidepost = {
        id   : "hidepost",
        name : "HidePost",
        description : "Permet de cacher un post",
        main : function(){
            // S'il y a des posts, et qu'ils on un id
            if(vars.oPostContainer.is('*') && vars.oPostContainer[0].id !== ""){
                var oHiddenPosts = JSON.parse(localStorage.getItem("JVCMaster_oHiddenPosts") || "[]");
                var oHiddenPostsViaPseudos = JSON.parse(localStorage.getItem("JVCMaster_oHiddenPostsViaPseudos") || "[]");

                // Le message d"information comme quoi le post a été caché;
                vars.oPostContainer.find("li.post").after(jQuery("<li/>", {
                    "class" : "JVCMaster_hiddenPosts_informPost post",
                    html : "<b>JVCMaster</b> : <i>Ce message a &eacute;t&eacute; cach&eacute;</i>",
                    css : {
                        display : "none"
                    }
                }));

                vars.oPostContainer.each(function(){
                    var t = jQuery(this);

                    // Si un id ou un pseudo est à cacher
                    if(oHiddenPosts.indexOf(t.attr("id").replace("message_", "")) !== -1
                        || oHiddenPostsViaPseudos.indexOf(jQuery.trim(t.find(".pseudo strong").text().toLowerCase())) !== -1){
                            
                        t.find("li.post:first").slideUp(300);
                        t.find("li.post.JVCMaster_hiddenPosts_informPost").slideDown(300);
                    }
                });

                // Bouton pour cacher un post
                jQuery("<img />", {
                    "class" : "JVCMaster_btn_hidepost",
                    css : { marginRight : "3px"},
                    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIBAoODxWRH6sAAADcSURBVCjPlZExbsJgDIU/+ycVGxMjZe7UMwTOwlU4R3uQROICrTIhMRDRIjYGRFUFEvx3+EVCEKjiTc/2e7ZlS5Li+QfjEQLQAYjj17pg5jmdAncOVIUkzfx4hGhIH4EjZgecZjxFGXn+w35fYHYgjl9IUrxejquqhs9mv2w2VSvXuRR736yf5yXr7yWDAUQRPA9B2+KGf35sW3Hd+f1tDkBZwmRy/yrKA7grdg5EbqxxhghMp8JiAf0+dLttgwAkKf5rBWZQFLDbhWKvFwyq4Rq17/x2M64+2HT+A8hKUErfzQyDAAAAAElFTkSuQmCC"
                }).appendTo(jQuery("<a/>", {
                    href : "#",
                    click : function(e){
                        var t = jQuery(this);
                        var oPostContainer = t.parent().parent().parent();
                        if(oPostContainer.attr("id")){
                            var oPostContainerId = oPostContainer.attr("id").replace("message_", "");

                             // Si le post n"est pas déjà été caché
                            if(oHiddenPosts.indexOf(oPostContainerId) === -1){
                                oHiddenPosts.push(oPostContainerId);         
                                oPostContainer.find("li.post:first").slideUp(300);
                                oPostContainer.find("li.post.JVCMaster_hiddenPosts_informPost").slideDown(300);
                            }
                            else{
                                oHiddenPosts.splice(oHiddenPosts.indexOf(oPostContainerId), 1);
                                oPostContainer.find("li.post.JVCMaster_hiddenPosts_informPost").slideUp(300);
                                oPostContainer.find("li.post:first").slideDown(300);
                            }

                            localStorage.setItem("JVCMaster_oHiddenPosts", JSON.stringify(oHiddenPosts));
                            e.preventDefault();   
                        }
                    }
                }).appendTo(vars.oPostContainer.find(".pseudo")));

                jQuery('<img />', {
                    'class' : 'JVCMaster_btn_hidepseudo',
                    css : { marginRight : '3px'},
                    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wIBAoHF9c/PLQAAADmSURBVCjPhdGxTgJBFIXhb2BiYkUpPYliYWjUzkLexVcylj7JPoOhWWIkRkoLEqxWYHcsnF23IHGqk9z/zpxzJhQk/5w5ASLcz2bdoElJjZSSEIIhisUizQkR7HbgkJJYlgZ5sZxMnMXobjpVLJdp0L8xliV4HI/B5WplUVW2da1pbcABJ1m/7fedraf12hVu6F6U0l/Ol82m01/49ttChOeytMdDBoreYo0m68Gxqm5D6HS/16PwaU/HHhQK0kcO+InXrEfYZvgc1/LPFKR3VBlIuZldBka4aOF2ocmB5EHrd5it/AD/OVM2g9hH0wAAAABJRU5ErkJggg=="
                }).appendTo(jQuery("<a/>", {
                    href : "#",
                    click : function(e){
                        var oPostContainer = jQuery(this).parent().parent().parent();
                        var pseudoToHide = jQuery.trim(oPostContainer.find(".pseudo").text().toLowerCase());
                        var toHide = (oHiddenPostsViaPseudos.indexOf(pseudoToHide) === -1) ? true : false;

                        vars.oPostContainer.each(function(){
                            var t = jQuery(this);
                            var pseudo = jQuery.trim(t.find(".pseudo").text().toLowerCase());

                            if(pseudo == pseudoToHide){
                                if(toHide){
                                    t.find("li.post:first").slideUp(300);
                                    t.find("li.post:last").slideDown(300);
                                    oHiddenPostsViaPseudos.push(pseudoToHide);
                                }
                                else{
                                    t.find("li.post:last").slideUp(300);    
                                    t.find("li.post:first").slideDown(300);
                                    oHiddenPostsViaPseudos.splice(oHiddenPostsViaPseudos.indexOf(pseudoToHide), 1);                  
                                } 
                            }
                        });

                        localStorage.setItem("JVCMaster_oHiddenPostsViaPseudos", JSON.stringify(jQuery.unique(oHiddenPostsViaPseudos)));

                        e.preventDefault();
                    }
                }).appendTo(vars.oPostContainer.find(".pseudo")));
            }
        },

        uninstall : function(){
            jQuery(".JVCMaster_btn_hidepost").remove();
            jQuery(".JVCMaster_btn_hidepseudo").remove();
            vars.oPostContainer.find("li.post:first").slideDown(300);
            vars.oPostContainer.find("li.post.JVCMaster_hiddenPosts_informPost").slideUp(300).remove();
        }
    };

    // Script "Show CDV"
    this.oScripts.showcdv = {
        id   : "showcdv",
        name : "Show CDV",
        description : "Affiche la CDV d'un pseudo dans une LightBox",
        main : function(){
            // Evite que la cdv se duplique si l'utilisateur bourine le bouton
            var bAlreadyLoading = false;
            var oPseudos = jQuery(".pseudo strong");
            oPseudos.css("cursor", "pointer");

            oPseudos.click(function(e){
                if(!bAlreadyLoading){
                    bAlreadyLoading = true;

                    var iframe = jQuery("<iframe>", {
                        src : "http://www.jeuxvideo.com/profil/" + jQuery(this).text() + ".html",
                        css : {
                            width : "800px",
                            height : "600px",
                            border : 0
                        },
                        load : function(){
                            if(window.innerHeight < 600){
                                jQuery(this).css("height", window.innerHeight - 50);
                            }
                            lb.show();
                            bAlreadyLoading = false;
                        }
                    }).appendTo("#JVCMaster_LightBox_popup");

                }
                e.preventDefault();
            });
        },
        uninstall : function(){
            var oPseudos = jQuery(".pseudo strong");
            oPseudos.css("cursor", "");
            oPseudos.unbind("click");
        }
    };

    // Script "Visionneuse d'image NoelShack"
    this.oScripts.noelshack = {
        id : "noelshack",
        name : "Visionneuse d'image NoelShack",
        description : "Permet d'afficher les images de NoelShack dans la LightBox",
        main : function(){
            // Evite que la cdv se duplique si l'utilisateur bourine le bouton
            var bAlreadyLoading = false;

            jQuery(".img_shack, a[href^=http\\:\\/\\/www\\.noelshack\\.com], a[href^=http\\:\\/\\/image\\.noelshack\\.com]").click(function(e){
                if(!bAlreadyLoading){
                    bAlreadyLoading = true;

                    // Si c"est une minitature
                    if(jQuery(this).attr("class") === "img_shack")
                        var sImgFalseUrl = jQuery(this).parent().attr("href");
                    // Si c"est un lien hyper-texte
                    else{
                        var sImgFalseUrl = jQuery(this).attr("href");
                    }
                    
                    var sImgTrueUrl = "";
                    
                    // Si une miniature est activ&eacute;
                    if(/^http:\/\/image.noelshack.com\/minis/.test(sImgFalseUrl)){
                        sImgTrueUrl = sImgFalseUrl.replace("http://image.noelshack.com/minis/", "http://image.noelshack.com/fichiers/");
                    }
                    else if(/^http:\/\/image.noelshack.com\/fichiers/.test(sImgFalseUrl)){
                        sImgTrueUrl = sImgFalseUrl;
                    }
                    else{
                        sImgTrueUrl = sImgFalseUrl.replace('http://www.noelshack.com/', 'http://image.noelshack.com/fichiers/');
                        var toReplace = /(^http:\/\/image.noelshack.com\/fichiers\/[0-9]*)-/.exec(sImgTrueUrl);
                        sImgTrueUrl = sImgTrueUrl.replace(toReplace[0], toReplace[1] + '/');
                        toReplace = /(^http:\/\/image.noelshack.com\/fichiers\/[0-9]*\/[0-9]*)-/.exec(sImgTrueUrl);
                        sImgTrueUrl = sImgTrueUrl.replace(toReplace[0], toReplace[1] + '/');  
                    } 

                    jQuery("<img />", {
                        src : sImgTrueUrl,
                        css : {
                            cursor : "pointer"
                        },
                        load : function(){
                            var t = jQuery(this);
                            var popup = jQuery("#JVCMaster_LightBox_popup");
                            var width = popup.css("width").replace("px", "");
                            var height = popup.css("height").replace("px", "");
                            
                            bAlreadyLoading = false;
                    
                            if(width > height){
                                t.css("width", (width > window.innerWidth ? width - window.innerWidth - (width - window.innerWidth) + window.innerWidth - 50 : width) + "px");
                                
                                if(popup.css("height").replace("px", "") > window.innerHeight){
                                    t.css("width", "");
                                    t.css("height", (height > window.innerHeight ? height - window.innerHeight - (height - window.innerHeight) + window.innerHeight - 50 : height) + "px");
                                }
                            }
                            else{
                                t.css("height", (height > window.innerHeight ? height - window.innerHeight - (height - window.innerHeight) + window.innerHeight - 50 : height) + "px");
                                
                                if(popup.css("width").replace("px", "") > window.innerWidth){
                                    t.css("height", "");
                                    t.css("width", (width > window.innerWidth ? width - window.innerWidth - (width - window.innerWidth) + window.innerWidth - 50 : width) + "px");
                                }
                            }

                            lb.show();
                        }
                    }).appendTo(jQuery("<a/>", {
                        href : sImgTrueUrl
                    }).appendTo("#JVCMaster_LightBox_popup"));

                }
                e.preventDefault();
            });
        },
        uninstall : function(){
            jQuery(".img_shack, a[href^=http\\:\\/\\/www\\.noelshack\\.com], a[href^=http\\:\\/\\/image\\.noelshack\\.com]").unbind("click");
        }
    };

    // LightBox
    function LightBox(){
        // On crée le calque qui servira à cacher la page
        jQuery("<div>", {
            id : "JVCMaster_LightBox_layer",
            css : {
                position : "fixed",
                display  : "none",
                top : 0, right : 0, bottom : 0, left : 0,
                background: "rgba(0, 0, 0, 0.7)",
                zIndex: 99999998
            },
            click : function(){
                lb.hide();
            }
        }).appendTo("body");
        
        // On crée la popup
        jQuery("<div>", {
            id : "JVCMaster_LightBox_popup",
            css : {
                position : "fixed",
                display  : "none",
                backgroundColor : "#fff",
                zIndex : 99999999,
                border : "1px solid black",
                textAlign: "left"
            }
        }).appendTo("body");

        jQuery(window).resize(function(){
            var popup = jQuery("#JVCMaster_LightBox_popup");
            popup.css({
                top : (window.innerHeight / 2 - popup.css("height").replace("px", "")  / 2) + "px",
                left : (window.innerWidth / 2 - popup.css("width").replace("px", "") / 2) + "px"
            });
        });
        

        this.show = function(width, height, html){
            var popup = jQuery("#JVCMaster_LightBox_popup");

            popup.css({
                width : width + "px",
                height : height + "px"
            });
            popup.css({ // obligé d"appeler 2 fois ".css()", sinon la popup n"est bien plac&eacute; qu"à son 2ème d&eacute;clenchement
                top : (window.innerHeight / 2 - popup.css("height").replace("px", "")  / 2) + "px",
                left : (window.innerWidth / 2 - popup.css("width").replace("px", "") / 2) + "px"
            });
            
            jQuery("#JVCMaster_LightBox_layer").fadeIn(300, function(){
                popup.fadeIn(300);
            });
        }

        this.hide = function(){
            var popup = jQuery("#JVCMaster_LightBox_popup");

            popup.fadeOut(300, function(){
                jQuery("#JVCMaster_LightBox_layer").fadeOut(300, function(){
                    popup.html("");
                    popup.css("padding", "0");
                    popup.attr("class", "");
                });
            });
        }
    };
    window.JVCMaster_Lightbox = lb = new LightBox();

    // Fonction principale
    (function(){
        oScripts = this.oScripts;

        jQuery.each(sActivatedScripts, function(key, value){
            if(value)
                oScripts[key].main();
        });
        
        var buttonOptions = jQuery("<a/>", {
            href : '#',
            text : "JVCMaster " + window.JVCMaster_sVersion,
            click : function(e){
                // jQuery('<div style="position: relative;padding-bottom: 8px;background: url(http://image.jeuxvideo.com/css_img/defaut/bloc_forum_bas.png) left bottom no-repeat;"><h3 style="position: static;height: 20px;line-height: 22px;font-size: 116.67%;width: auto;background: url(http://image.jeuxvideo.com/css_img/defaut/bloc_h3_forums.png) right top no-repeat!important;"><span class="txt">JVCMaster : Extensions</span></h3><div style="padding: 5px;border: solid 1px #9C0;border-bottom: 0;height: 1%;position: relative;"><ul id="JVCMaster_Scripts" class="liste_liens">').appendTo('#JVCMaster_LightBox_popup');
                    jQuery('<div class="bloc1"><h3 class="titre_bloc"><span>JVCMaster : Extensions</span></h3><div class="bloc_inner"><ul id="JVCMaster_Scripts" class="liste_liens">').appendTo('#JVCMaster_LightBox_popup');
                // On boucle sur les oScripts
                jQuery.each(oScripts, function(key, value){
                    jQuery("<li>", {
                        id : "JVCMaster_extension_" + value.id,
                        css : {
                            textAlign : "left",
                            fontSize : "95%",
                            borderBottom : "1px solid rgb(237, 237, 237)",
                            fontWeight : "normal"
                        },
                        html : '<input type="checkbox" style="vertical-align : bottom; margin-right: 3px" ' + (sActivatedScripts[value.id] ? 'checked="checked"' : '') + '/><b>' + value.name + "</b> : " + value.description
                    }).appendTo('#JVCMaster_Scripts');
                    
                    jQuery("#JVCMaster_extension_" + value.id + " input[type=checkbox]").click(function(){
                        if(jQuery(this).is(':checked')){
                            oScripts[value.id].main();
                            sActivatedScripts[value.id] = true;
                        }
                        else{
                            oScripts[value.id].uninstall();
                            sActivatedScripts[value.id] = false;
                        }

                        localStorage.setItem("JVCMaster_sActivatedScripts", JSON.stringify(sActivatedScripts));
                    });
                });
                
                var lb_popup = jQuery("#JVCMaster_LightBox_popup");
                
                lb_popup.attr("class", "forums hp_forums")
                lb_popup.css("padding", "5px 5px 0");
                lb.show();
                e.preventDefault();
            }
        }).appendTo(jQuery("<td id=\"JVCMaster_buttonOptions\">").prependTo(jQuery("table#connexion tbody tr")));
        
        // Si l"utilisateur viens d"installer JVCMaster
        if(typeof localStorage.getItem("JVCMaster_firstUse") === "object"){
            buttonOptions.click();
            localStorage.setItem("JVCMaster_firstUse", "0");
        }

        // Si on est sur un mp, et que l'utilisateur clique sur "Voir les messages précédents"
        var voir_debut = jQuery("#voir_debut");
        if(voir_debut.is('*')){
            voir_debut.click(function(){

                setTimeout(function(){
                    // On raffraichit les variables
                    vars.oPostContainer = jQuery('.msg'),
                    vars.oPosts = jQuery('li.post'),
                    
                    jQuery.each(sActivatedScripts, function(key, value){
                        if(value){
                            console.log(key);
                            oScripts[key].uninstall();
                            oScripts[key].main();
                        }
                    });                    
                }, 400);
            })
        }
    })();
}

var script = document.createElement("script");
script.appendChild(document.createTextNode("(JVCMaster = " + JVCMaster +")(window.JVCMaster_sVersion = '" + window.JVCMaster_sVersion + "');"));
(document.body || document.head || document.documentElement).appendChild(script)
