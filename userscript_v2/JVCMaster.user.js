// ==UserScript==
// @name        JVCMaster Userscript
// @namespace   jvcmaster
// @description Ajoute des fonctionnalités aux forums de Jeuxvideo.com
// @include     http://www.jeuxvideo.com/*
// @include     https://www.jeuxvideo.com/*
// @run-at      document-end
// @version     2.4.5
// ==/UserScript==

/*
Dans une variable :
    "JVCMaster_" : indique que celle-ci appartient à JVCMaster

Au début d'une variable    
    "o" : Object
    "s" : String
    "b" : Boolean
*/

window.JVCMaster_sVersion = "2.4.5"

function JVCMaster(){
    this.version = window.JVCMaster_sVersion;
    this.oScripts = {};
    this.sActivatedScripts = JSON.parse(localStorage.getItem("JVCMaster_sActivatedScripts") || "{}");

    // Variables globales
    this.vars = {
        // Ce qui contient le pseudo, la date, le post et le permalink 
        oPostContainers : $('.msg'),
        // Les posts
        oPosts : $('li.post')
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
                var t    = $(this);
                var sHtml = t.html();
                    
                if(/(?:(?:<br(\/ )?> *){9,}){5,}/gi.test(sHtml)
                || /^[0-9]+|http:\/\/concours-apple\.fr\.cr|[0-9]+$/gi.test(sHtml)
                || /(W{20,})+/gi.test(sHtml)
                || /[@]{15,}|([W]+[V]+(<br (\/)?>+)){20,}/gi.test(sHtml)){
                    
                    // On cache le post
                    t.hide(0);
                    t.parent().find('.post.JVCMaster_citation_viewOnTopic').hide();

                    // On insère après celui-ci, un post d'information
                    t.after($("<li>", {
                        "class" : "JVCMaster_AntiBot_informPost post",
                        html    : "<b>JVCMaster</b> : <i>Spam, ce message a &eacute;t&eacute; cach&eacute;, cliquer pour faire apparaitre le post</i>",
                        css : {cursor : "pointer", display : "none"},
                        click : function(e){
                            $(this).slideUp(300);
                            t.slideDown(300);
                        }
                    }));
                    
                    // On montre le message d'information pour chaque posts caché
                    t.parent().find("li.post.JVCMaster_AntiBot_informPost").slideDown(300);
                }
             });
        },
        uninstall : function(){
            $(".JVCMaster_AntiBot_informPost").slideUp(300).remove();
            $(".JVCMaster_hideByAntibot").slideDown(300);
        }
    }

    // Script "Citation"
    this.oScripts.citation = {
        id   : "citation",
        name : "Citation",
        description : "Permet de citer un post",
        main : function(){
            // Présent sur la page de réponse d'un topic
            var oTextarea = $("#newmessage");
            // Présent sur les pages d'un topic
            var oAlertemail = $(".alertemail");

            // Bouton de citation
            $('<img />', {
                "class" : "JVCMaster_btn_citation",
                title : "Citer ce post",
                css : { marginRight : "3px"},
                src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMEAYAAADkOZvdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wAA/6wAAIMCAACETAAA7XIAADqFAAAdxCRWn50AAAMoSURBVHjadJJvSJx1AMc/v98993h3HnLq6Q41lVKwGiGHmAwZQ4bEBW1sEENMgkSWuGMVDDlijIi4F3XY8EWMKBUnIccacdhYMlbYUasX4zj7I1K3FHGXXDc778/zPPf8elUNap/XXz58XnxFa9e8WvtWKZ6TXRwGcV40yMdBHFGn1IfYKsUlQuSYYYRJFuWbXKeHqHZRzspZO6EGZYR01dI2pJTS2yTCjInbxoQmUrJPRKGu6Nl1A9UJe8wOYjBFnDH2RYIx+tmWAyInblHnOCtSooteR0YWxaSwnC5N1/KO68actVwdK4xKnxwWDe6boiN01Z18XymX7ex1NoM8JbNyFEM0kyBGcf3E6Z5gGB+P4OlXP8gnxom6+/23moPMFTRrRV3mrsZRggwCm4ziAlHmJDPo6ydOB4JT6H8LWj+e6J7eAnGNNjEADt017vkD9JX6bxqTTDtna5719DEt3vF0essgVU5NiWkQWRETKRAf4aHrf9LiO/HfF0HLeIa8P4P7wmMHT8RB/+HQepsEdacmqr8I5h161QZofG8H1EmQy2JHngU2xKBKAJB62Fsqljr/jIEn7Tva9B7o4y3fde6D+ZTjosxC6RerUI1AOWcNWjmQak7GSIOdrAatAMgRe8Q+8t/gao8YNq/BwbY1XlmAB22l48URKCTLb1fuQnHXzFp7gIEHQKqgnbGHwPis3FKOQGXIiBgZSKczmQf5h8wL9iV9EqywmpEFMK8oH2FQtr1kS1CIT4Tx71y0Dsx/unZOKXrNrFEAsUgDcTB27x/fvgL3ayO+l87wSA69EV29Ogry9fpVvxccfe6wdxhEa8v81trnSinN8FQA8iwQA3uitHKwC6b3t1c2G8D0bb28eQ/4Sdn2VyAuuJZq3wVHsv6M/0fQIx3Pd8+BI9fYHjgGmgpZq2ZZNIkb+gs1uvpV+c3LlQSavOkxanfBGe94snsHzfGW7+vGVTR1u/Ja6RywrI6pJRCHa75wh4Abzo2aZVB+VafaQfzz08D8wdqXnEdDQ6p7wD4WISDPHu1Alh38wA57PAPsk0MC22SRQDsBAPoZgL8GAMXsSoEas11IAAAAAElFTkSuQmCC"
            }).appendTo($("<a/>", {
                href : "#",
                click : function(e){
                    var oPostContainers = $(this).parent().parent().parent();
                    
                    // Si on est pas sur un topic, ou un mp
                    if(!oPostContainers.is('*'))
                        return;

                    // Si on est sur un mp
                    if($("#reception").is("*") && $("#bouton_post").is("*")){
                        var sPost = $.trim(oPostContainers.find(".msg_body").html().replace(/( +<br(?: \/)?>)/g, "").replace(/<img.*?alt="([^"]*?)".*?>|<a.*?href="([^"]*?)".*?>.*?<\/a>|<img.*?class="img_shack".*?>/gi, "$1 $2")).replace(/&gt;/g, ">").replace(/&lt/g, "<").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").split("\n").join("\n| ");
                        var sDate = $.trim(oPostContainers.find(".msg_infos").text().replace("Posté ", "").replace("\n", ""));
                    } 
                    // Si on est sur un topic
                    else{
                        var sPost = $.trim(oPostContainers.find("li.post").html().replace(/( +<br(?: \/)?>)/g, "").replace(/<img.*?alt="([^"]*?)".*?>|<a.*?href="([^"]*?)".*?>.*?<\/a>|<img.*?class="img_shack".*?>/gi, "$1 $2")).replace(/&gt;/g, ">").replace(/&lt/g, "<").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").split("\n").join("\n| ");
                        var sDate = $.trim(oPostContainers.find("li.date").text().replace("Posté ", "").replace("\n", ""));
                    }

                    var sPseudo = $.trim(oPostContainers.find(".pseudo strong").text());
                    var sPermalink = $.trim(oPostContainers.find("li.ancre a").attr("href"));

                    var sCitation = "";
                    
                    // Sur la page de réponse d'un topic, s'il y a déjà du texte
                    if(oTextarea.is('*') && oTextarea.val() !== "") sCitation += "\n\n";
                    
                    // Si un lien permanent est présent
                    if(sPermalink) sCitation += "| " + sPermalink + "\n";

                    sCitation += "| Ecrit par « " + sPseudo + " », " + sDate + "\n| « "+ sPost + " »\n\n\n> ";

                    // Si on est sur la page d"un topic
                    if(oAlertemail.is('*') && !oTextarea.is('*')){
                        localStorage.setItem("JVCMaster_citation", sCitation);
                        window.location.href = $(".bt_repondre").attr("href");
                    } 
                    // Si on est sur la page de réponse d"un topic
                    else if(!oAlertemail.is('*') && oTextarea.is('*')){
                        if(oTextarea.val().match("Ne postez pas d\"insultes, &eacute;vitez les majuscules, faites une recherche avant de poster pour voir si la question n\"a pas d&eacute;jà &eacute;t&eacute; pos&eacute;e..."))
                            oTextarea.val("");
                        oTextarea.val(oTextarea.val() + sCitation);
                    }
                    
                    e.preventDefault();
                }
            }).appendTo(vars.oPostContainers.find(".pseudo")));

            // // Si on est sur la page d'un topic
            if($(".nouveau").is('*') && oTextarea.is('*')){
                var sCitation = localStorage.getItem("JVCMaster_citation");
                if(sCitation){
                    oTextarea.val(sCitation);
                    localStorage.removeItem("JVCMaster_citation");
                }
                
                oTextarea.get(0).setSelectionRange(oTextarea.val().length, oTextarea.val().length);
                oTextarea.focus();
            }

            // Pour les utilisateurs de JVCMaster, on modifie la gueule de la citation et on ajoute du CSS
            vars.oPosts.each(function(){
                var t = $(this);
                if(t.css("display") == "none"){
                    var display = "none";
                }
                t.css("display", "none")

                var html = t.html();

                html = html.replace(/(?:<br(?: \/)?>)?\| (Ecrit par .*)/g, "<div class='JVCMaster_citation_viewOnTopic' style='padding: 23px 5px 5px;background: #D3EFFF;border: 1px solid #51BFFF;border-radius: 6px;margin: 5px 0;position: relative;'>$1");
                html = html.replace(/ »\n(?: <br>(\| )*\n){2} <br>(\| )*&gt;/g, "</div>");
                html = html.replace(/\|(?: )*<a href="([^"]*?)".+>.+<\/a>(?:(?:\n |(?:\n <br>(?:\| )+))<div class='JVCMaster_citation_viewOnTopic' style='([^"]*?)'>)?/g, '<div class="JVCMaster_citation_viewOnTopic" style="$2padding-bottom:30px;"><div style="background: #BDE7FF;position: absolute;bottom: -1px;left: -1px; right:-1px;padding: 2px 5px;border: 1px solid #51BFFF;height:15px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"><a href=\'$1\'>$1</a></div>');
                html = html.replace(/Ecrit par « (.+) » ?, (?:posté|via mobile )?le  ?((?:\d+) (?:\w+) (?:\d{4}) à (?:\d{2}):(?:\d{2}):(?:\d{2}))/gi, '<div style="background: #BDE7FF;position: absolute;top: -1px;left: -1px;padding: 2px 5px;border: 1px solid #51BFFF;">$1</div><div style="background: #BDE7FF; position: absolute; top: -1px; right: -1px;padding: 2px 5px; border: 1px solid #51BFFF;">$2</div>');//.replace(/Ecrit par « (.+) » ?, posté le  ?((?:\d+) (?:\w+) (?:\d{4}) à (?:\d{2}):(?:\d{2}):(?:\d{2}))/gi, "<div style='background: #BDE7FF; position: absolute;     top: -1px;     right: -1px;    padding: 2px 5px; border: 1px solid #51BFFF;'>$1</div>");
                html = html.replace(/ *<br( \/)?>(\| )*«/g, "");
                html = html.replace(/<br( \/)?>(\| )+/g, "<br>");

                t.after($('<li/>', {
                    'class' : 'post JVCMaster_citation_viewOnTopic',
                    html : html,
                    css : {
                        display : display
                    }
                }));
            });
        },

        uninstall : function(){
            $(".JVCMaster_btn_citation").remove();
            localStorage.removeItem("JVCMaster_citation");
            
            vars.oPostContainers.find('.JVCMaster_citation_viewOnTopic').slideUp();
            vars.oPostContainers.find('li.post:first').slideDown();
        }
    };

    // Script "CDV informations"
    this.oScripts.cdvinformations = {
        id : "cdvinformations",
        name : "CDV informations",
        description : "Permet d'afficher des informations d'un pseudo à ses côt&eacute;s",
        main : function(){
            $(".pseudo strong").each(function(t){
                var t = $(this);
                var otParent = t.parent();

                $.ajax({
                    url : "http://www.jeuxvideo.com/profil/" + t.text() + ".html",
                    success : function(data){
                        var btn_CDV = otParent.find("a[href^=http\\:\\/\\/www\\.jeuxvideo\\.com\\/profil] img");
                        // Si le pseudo est banni
                        if(data.match("<p class=\"banni\">")){
                            btn_CDV.attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wICggWDgPWFDkAAAD2SURBVCjPhdEtroNAEMDxP4VtsqYkxXALDAoBohfgCIg9wJpaLoDZA+BxXAgEsmkIigSxJDzR0Pa9NK/jJvnNZD4crfXGlzDGOAAeQBzH/2Kt9WaMcTwAay0ARVH8QlVVcTqdiKIIrfV22PFfCHC9XhmGgXmeATi8dwZIkoTL5fLMu65jmiaeM1trKcuSrusIw5C2bQHIsowgCFjX9YX7vsday/F4pGkaANI0BcB1Xe73O1LKBwYQQiCEQCnF7XZDCMH5fCYIAoQQr87vUdc1AHme4/v+E37ESinGcfx4b2c/+r6EtZZlWQCQUr5G8LwH3gu+vf0HNF5XpCC6I0sAAAAASUVORK5CYII=");
                        }
                        else{
                                // Rang
                            var sRank = data.match("<body.*class=\"(.*)\">")[1],
                                // Sexe
                                sSexe = data.match("<h1.*class=\"(sexe_[f|m])\">")[1];

                            if(sSexe == "sexe_f")
                                btn_CDV.attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEmSURBVHjahNG/SwJhHMfx92Ond4slYaF3EmgN0tQQLTm2FQQtZbTV5tYc9Cc49TccLU61NZ4E4eJSJGFDSGFJmoZ3Ss/TIF72g/xsD8/reZ4P30c4lq0Yk0wtKwA0gIW1xX+xc2GrTC0rNADVlQDETpe+oauNc6L6NPOraZyirQID/PELAqycrXNTr/De6QDg42Gy1iYHqR1/XaqXeW694HdWXcnlcoFiq0RaT3FczQOwb24zZ5goV37h2/sKrvIwZZTdp0MAcpE9DIJE+5O8ug2mAmGEY9nKUz3/2aZsc927oynfSGoJksEEhtDRRWjQeTRbjzmOGnliEzPEtVkMoft72k9ciJ9Q7T/8OW8BMFrFVR5N2QYgEgj7N+siNMDDA+O+/XMAnBxmyJCBTqUAAAAASUVORK5CYII=");
                            else
                                btn_CDV.attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEmSURBVHjahJE9S8NQFIafG29JHKq1FOkHCFUHRwcpoh0cHJ3cdHBRhOAfUBAc/Qnd3QRxEBfBMUUQZ0UIFYeiRrQpVBKbkOsQjPUDe7bDec57Xt4jSqal6FPNWlUASIDFyuS/8DmWataqQgJ43Vj8cDP/DVrav0RP55ifnqBuWkoD8AL1CwQ43ang3N/Q6bwBoPUqA5RmVxhf2Eh6x76i3Xom8ewFipntC9p2HX10isbJHgDF6jpGdgw/UF/wnX2LCn2iVJHHo1UAMnNbgEGg5fCdFpoxjCiZllLhe3I28l26T9dEvoscKZPKlhHSQEg99txbDwfLvJztMpDOI4cKCGkkM/kTLqwdE7w2/sxbAPRaUaFP5LlxVIOZRFlIPYY/F/q9/WMAikdlnhDc6i4AAAAASUVORK5CYII=");

                            otParent.find("a:not(.JVCMaster_btn_mp):last").after($("<span>", {
                                "class" : "JVCMaster_cdvinformations_rank",
                                css : {
                                    marginRight : "3px",
                                    display : "inline-block",
                                    height : "12px",
                                    width : "14px",
                                    backgroundImage : "url(data:image/png;base64,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)"
                                }
                            }));
                            
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
            $(".pseudo strong").css({
                backgroundColor : "",
                borderRadius : "",
                padding : ""
            });
            $(".JVCMaster_cdvinformations_rank").remove();
        }
    };

    this.oScripts.favoritestopic = {
        id : "favoritestopic",
        name : "Topic favoris",
        description : "Permet d'épingler ces topics favoris dans une box",
        main : function(){
            // Si on est sur un forum/topic
            if($("#bloc_forums_img").is('*')){
                var oTopicFavorites = funcs.sortObject(JSON.parse(localStorage.getItem("JVCMaster_TopicFavorites") || "{}"));
            
                // Ce qui sera affiché dans la box juste en dessous des forums préférés 
                var sHtml = "<h3 class=\"titre_bloc\"><span>Mes topics préférés</span></h3>";
                    sHtml += "<div class=\"bloc_inner\">";
                    sHtml += "<ul class=\"liste_liens\">";
                    sHtml += "</ul>";
                    sHtml += "</div>";

                // Box en dessous des forums préférés
                $("div.bloc3:first").after(
                    $("<div>", {
                        id : "JVCMaster_TopicFavorites",
                        "class" : "bloc3",
                        html : sHtml
                    })
                );
                
                (listTopicFavorites = function(){
                    var oTopicFavorites = funcs.sortObject(JSON.parse(localStorage.getItem("JVCMaster_TopicFavorites") || "{}"));
                    for(topic in oTopicFavorites){
                        $("<a/>", {
                            href : oTopicFavorites[topic]["sTopicUrl"],
                            html : "<b>" + oTopicFavorites[topic]["sForumName"] + "</b> : " + oTopicFavorites[topic]["sTopicName"] 
                        }).after($("<a/>", {
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
                                $(this).css("backgroundPosition", "bottom left");
                            },
                            mouseout : function(){
                                $(this).css("backgroundPosition", "top left");
                            },
                            click : function(e){
                                var tParent = $(this).parent();
                                // console.log(tParent.attr("data-jvcmaster_forumname"));
                                // console.log(tParent.attr("data-jvcmaster_topicname"));
                                delete oTopicFavorites[tParent.attr("data-jvcmaster_forumname") + "_" + tParent.attr("data-jvcmaster_topicname")]                        
                                localStorage.setItem("JVCMaster_TopicFavorites", JSON.stringify(oTopicFavorites));

                                tParent.slideUp(300, function(){
                                    $(".JVCMaster_TopicFavorites").remove();
                                    listTopicFavorites();
                                });

                                e.preventDefault();
                            }
                        })).appendTo($("<li>", {
                            "class" : "JVCMaster_TopicFavorites",
                            "data-jvcmaster_forumname" : oTopicFavorites[topic]["sForumName"],
                            "data-jvcmaster_topicname" : oTopicFavorites[topic]["sTopicName"],
                            css : {
                                position : "relative"
                            },
                            mouseover : function(){
                                var t = $(this);
                                t.find(".JVCMaster_btn_topicfavorites_delete").css("display", "inline-block");
                                t.css("backgroundColor", "#F5F5F5");
                            },
                            mouseout : function(){
                                var t = $(this);
                                t.find(".JVCMaster_btn_topicfavorites_delete").css("display", "none");
                                t.css("backgroundColor", "#EDEDED");
                            }
                        }).appendTo("#JVCMaster_TopicFavorites ul"));
                    }
                })();

                // Pour insérer le bouton juste à côté
                $("div.bloc_forum div.bloc_inner").css("textAlign", "center");
                // On règle les quelques bugs d"alignement
                $("div.bloc_forum form").css("textAlign", "left");
                $("div.bloc_forum td.nouveau, div.bloc_forum td.navig_prec").css("textAlign", "left");
                // On insère le petit bouton à côté des titres du topic

                $("div.bloc_forum h1.sujet, div.bloc_forum h4.sujet").css({
                    display : "inline-block",
                    verticalAlign : "middle"
                }).after(
                    $("<img>", {
                        id : "JVCMaster_addToTopicFavorites",
                        title : "Ajouter ce topic aux favoris",
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
                            var oPagination = $(".pagination:first strong, .pagination:first a");

                            // S"il n"y a pas de pagination
                            if(oPagination.is('*')){
                                oPagination.each(function(){
                                    var t = $(this);
                                    if(t.text() == 1){
                                        if(t.attr('href') || t.text()){
                                            sTopicUrl = t.attr('href') || window.location.href;
                                        }
                                    }
                                })
                            }
                            else{
                                tmp = $(".revenir a:first");
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
                            var sForumName = $.trim($(".bloc_forum h3:first").text().replace("Forum : ", ""));
                            // On cherche le nom du topic
                            var sTopicName = $(".bloc_forum .sujet:first").text();
                                sTopicName = $.trim(sTopicName.substr(10).substr(0, sTopicName.length - 12)); 
                            
                            // La clé est sous forme <forumName>_<topicName> pour trier par le nom du forum, et ensuite du topic
                            oTopicFavorites[sForumName + "_" + sTopicName] = {
                                sForumName : sForumName,
                                sTopicUrl  : sTopicUrl,
                                sTopicName : sTopicName
                            } 

                            // On stock
                            localStorage.setItem("JVCMaster_TopicFavorites", JSON.stringify(oTopicFavorites));

                            // On actualise les topics favoris
                            $(".JVCMaster_TopicFavorites").remove();
                            listTopicFavorites();
                               
                            e.preventDefault();
                        }
                    })
                );
            }
        },
        uninstall : function(){
            $("#JVCMaster_addToTopicFavorites").remove();
            $("#JVCMaster_TopicFavorites").remove();
        }
    }

    // Script "HidePost"
    this.oScripts.hidepost = {
        id   : "hidepost",
        name : "HidePost",
        description : "Permet de cacher un post",
        main : function(){
            // S'il y a des posts, et qu'ils on un id
            if(vars.oPostContainers.is('*') && vars.oPostContainers[0].id !== ""){
                var oHiddenPosts = JSON.parse(localStorage.getItem("JVCMaster_oHiddenPosts") || "[]");
                var oHiddenPostsViaPseudos = JSON.parse(localStorage.getItem("JVCMaster_oHiddenPostsViaPseudos") || "[]");

                // Le message d"information comme quoi le post a été caché;
                vars.oPostContainers.find("li.post:not(.JVCMaster_citation_viewOnTopic)").after($("<li/>", {
                    "class" : "JVCMaster_hiddenPosts_informPost post",
                    html : "<b>JVCMaster</b> : <i>Ce message a &eacute;t&eacute; cach&eacute;</i>",
                    css : {
                        display : "none"
                    }
                }));

                vars.oPostContainers.each(function(){
                    var t = $(this);

                    // Si un id ou un pseudo est à cacher
                    if(oHiddenPosts.indexOf(t.attr("id").replace("message_", "")) !== -1
                        || oHiddenPostsViaPseudos.indexOf($.trim(t.find(".pseudo strong").text().toLowerCase())) !== -1){
                            
                        t.find("li.post").slideUp(300);
                        t.find("li.post.JVCMaster_hiddenPosts_informPost").slideDown(300);
                    }
                });

                // Bouton pour cacher un post
                $("<img />", {
                    "class" : "JVCMaster_btn_hidepost",
                    title : "Cacher ce post",
                    css : { marginRight : "3px"},
                    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMEAYAAADkOZvdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wAA/6wAAIMCAACETAAA7XIAADqFAAAdxCRWn50AAALqSURBVHjaZJNfaFt1HMU/39+9jVmMXWVZCSOUIqPOMce1yKgjlDGCSh7GENEJfS4yREcp2odRhoziQzdKKaWKD2NIcVuZY5RZ1m4UQVHR0IcZNJSVlRpCrF0NaWju/f3xocM/23k7Lx8Oh3Nk5c/5eXBOBl0ngBr3TgBQ5DRgyUgC2HChXQe+UDXP5wafqKzc83+1s9Lhzria0TLjTfqHk3vlkgyri2G/rL5253lwbtdc4vwzveCOmYLOELpbxMhRk6Scl+OscY6q9wYFWZakV+eqdKp2r8ud84NYqqXf3TD3o3TzOdMnS5L1Fne94KsZtUoZ7Mcmq0dABqRLDYPqlhEV4KfsK7r2OwEAPxP8dHDm3u4X6Wk/lWqV21JOKhnQadHeqHc5Hqj8Vs/W8b/KuqQkS16OAd1USIMMy3uSJMYEQ3KUNh7TnR9/+EDnOFhd3QjcIjlOyZyEjOpZhlyaVYU3LDeJK0blVVcCKagjsgm08r7MAhm5Lfd5QitfrY3ZLGx9vz0mQ2DfpEII5sNwSbeDm4oWwlZQLiNJAAnUWa8I1GjIdSBglMUnwa6PTmpgfFMyk9B8t3GzYWF7rHm9PgBNq5ei78Bn0OwH0EFkbQrkS5VoKYNUmabjEe3hv+Ao32wLp6Fxpf5Oswjbl7eL7iq41+kD8ENvA8DXg3YEINLhbFgFz6o12wV20sT050Dv/xObs/a0XQC9bK6xAAaTBlCh1wDA5wCA78quFyDcH30TzYHkOBABpmhTTAKwjPtPFTl3BMC9bS888hUAFnZ+wMt07/AP0QVgfdsNwFE3AWCmbQXg1uanBRH49pfCSwCZqfQiQOzZpz4CMCfdPgDpc28BcIlxACnt+fppINVy1/8M3EozH5YAnzoVgPp4ox/w/+h9OAH4rm0n8Z5kWwIgsRzPA3hT3iGA+N1YHkD+mdFv89eAM8SIgXuAJgHkWWcT6KBMFUixjgYOs0ENUFQJAUWaOAA9dAL8PQB4PTdp3o3mAAAAAABJRU5ErkJggg=="
                }).appendTo($("<a/>", {
                    href : "#",
                    click : function(e){
                        var t = $(this);
                        var oPostContainers = t.parent().parent().parent();
                        if(oPostContainers.attr("id")){
                            var oPostContainersId = oPostContainers.attr("id").replace("message_", "");

                             // Si le post n"est pas déjà été caché
                            if(oHiddenPosts.indexOf(oPostContainersId) === -1){
                                oHiddenPosts.push(oPostContainersId);         
                                oPostContainers.find("li.post:visible").addClass("JVCMaster_hideByHidePost").slideUp(300);
                                oPostContainers.find("li.post.JVCMaster_hiddenPosts_informPost").slideDown(300);
                            }
                            else{
                                oHiddenPosts.splice(oHiddenPosts.indexOf(oPostContainersId), 1);
                                oPostContainers.find("li.post.JVCMaster_hiddenPosts_informPost").slideUp(300);
                                oPostContainers.find("li.post.JVCMaster_hideByHidePost, li.post.JVCMaster_citation_viewOnTopic").slideDown(300);
                            }

                            localStorage.setItem("JVCMaster_oHiddenPosts", JSON.stringify(oHiddenPosts));
                            e.preventDefault();   
                        }
                    }
                }).appendTo(vars.oPostContainers.find(".pseudo")));

                $("<img />", {
                    "class" : "JVCMaster_btn_hidepseudo",
                    title : "Cacher les posts de ce pseudo",
                    css : { marginRight : "3px"},
                    src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMEAYAAADkOZvdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wAA/6wAAIMCAACETAAA7XIAADqFAAAdxCRWn50AAAMCSURBVHjabI9hSJx1HMc/v//zv/N2qIldy3Is2a6ykuM6xhIRE4kYRzUJoYghFOMYw8QXEm6M3iQiI2SYyIgxLO5FjmGyfDFGLDOJrUmNw1Yd0Zwdyy65rnnq3XPP8/x7sdWC6/PmC1/4fvj9ZPFqS6ExbAwtdHMA1B4ZlQEwZ2RC2vCIM25S5DhqkpwiSbMVUScYVRPWrH7Xm2PZ6zPtrqOUDup09UMyr1al305oGVUvSgp2UHOmdgu8mLPgJrDpZYQ+7rBfPS1zZOSy8qtWaiWsEtYRonJUjVor4uh8VcIXsGbd3lK1PVU4JPWqX9XtuKSlU6WtHnB3un2uB+qQ9bN6FRiTYdmJjvUv/vr9QaLc5W4e5K3PBp977am3ZSFUb/JmTFRNR9VI1R4V30xuDP0VdNKKdg7QAUTIsgs4xXUp4r8nrGO/ecXsg+O/7Z1ufJJ/efn9q9M/fEDHT5Obme03GNno8uadl1iVZTkhKwSUDJEyOZCURCULhGVRzt4XOAPlYPkXuBWxP7SHqeC7Y/nzhTBkDxcGihfBpEvV5W9AmW6pYwnUEatTnQWqZZDJ/yxnidEF0mY+JlAp/n1y8852M/z57Wa0UAtOzm4q3gDNsrdqpsBpcG94X4O06ZO+/nurm6DP+d/xn4ckGf6o9OKmy045Ce5ssam4BOwK5H0hUF6XN25iUDxux+wLYK/Yp0tdlYLnj9W8GZiu7E0TPWYMZMnETfR+r1igx4TBmS+1lzSUolu5rXOVgsCQLqon/ufkfeYC48AV0wlAFhsHNHGTYxUMZsLcBjKm1Sj4aObxjYcfgGvXCj8WZ2DvcGC37zq8d+WxZ+ubYe0ru8+dgUe6q4b1GPg/t6ZkBYigaAH54tNn1h49TMjnFyUXzc3SC+YT40dva6/gpSDX5FzyBtEmQYYCOvC6yksEttNe3lwGTpp1tuDBbl+vOg11c1avCoH889Hily1rjQ0MoNBocwuHIBBnHQ/YzW0cIMQ6QSBCDg9QZCUAKBpMEYBWbIC/BwCMhjqxWSOhnwAAAABJRU5ErkJggg=="
                }).appendTo($("<a/>", {
                    href : "#",
                    click : function(e){
                        var oPostContainers = $(this).parent().parent().parent();
                        var pseudoToHide = $.trim(oPostContainers.find(".pseudo").text().toLowerCase());
                        var toHide = (oHiddenPostsViaPseudos.indexOf(pseudoToHide) === -1) ? true : false;

                        vars.oPostContainers.each(function(){
                            var t = $(this);
                            var pseudo = $.trim(t.find(".pseudo").text().toLowerCase());

                            if(pseudo == pseudoToHide){
                                if(toHide){
                                    t.find("li.post:visible").addClass("JVCMaster_hideByHidePost").slideUp(300);
                                    t.find("li.post.JVCMaster_hiddenPosts_informPost").slideDown(300);
                                    oHiddenPostsViaPseudos.push(pseudoToHide);
                                }
                                else{
                                    t.find("li.post.JVCMaster_hiddenPosts_informPost").slideUp(300);
                                    t.find("li.post.JVCMaster_hideByHidePost, li.post.JVCMaster_citation_viewOnTopic").slideDown(300);
                                    oHiddenPostsViaPseudos.splice(oHiddenPostsViaPseudos.indexOf(pseudoToHide), 1);                  
                                } 
                            }
                        });

                        localStorage.setItem("JVCMaster_oHiddenPostsViaPseudos", JSON.stringify($.unique(oHiddenPostsViaPseudos)));

                        e.preventDefault();
                    }
                }).appendTo(vars.oPostContainers.find(".pseudo")));
            }
        },

        uninstall : function(){
            $(".JVCMaster_btn_hidepost").remove();
            $(".JVCMaster_btn_hidepseudo").remove();
            vars.oPostContainers.find("li.post:first").slideDown(300);
            vars.oPostContainers.find("li.post.JVCMaster_hiddenPosts_informPost").slideUp(300).remove();
        }
    };

    // Script "Highlight post"
    this.oScripts.highlightpost = {
        id : "highlightpost",
        name : "Highlight post",
        description : "Permet de surligner les posts permaliens",
        main : function(){
            var hash = window.location.hash;
            if(hash !== ""){
                var post = $(hash);
                if(post.is('*')){
                    post.addClass("JVCMaster_highlightedPost");
                    $("body").animate({
                        scrollTop : post.offset().top - 50
                    }, 500, function(){
                        post.stop().animate({
                            backgroundColor : "#FFF9D0"
                        }, 500)
                    });
                }
            }

            $(".ancre a").click(function(e){
                var t = $(this);
                var href = t.attr("href").match("(#.*)$")[0];
                var post = $(href);

                console.log(post);
                if(post.is('*')){
                    var highlightedPost = $('.JVCMaster_highlightedPost');
                    highlightedPost.removeClass("JVCMaster_highlightedPost");

                    highlightedPost.animate({
                        backgroundColor : "#EFF4FC"
                    }, 500);

                    $("body").animate({
                        scrollTop : post.offset().top - 50
                    }, 300, function(){
                        post.addClass("JVCMaster_highlightedPost");
                        post.stop().animate({
                            backgroundColor : "#FFF9D0"
                        }, 500);
                    });

                }
            });
        },
        uninstall : function(){
            var highlightedPost = $('.JVCMaster_highlightedPost');
            highlightedPost.css("backgroundColor", "");
            highlightedPost.removeClass("JVCMaster_highlightedPost");
            $(".ancre a").unbind("click");
        }
    },

    // Script "Show CDV"
    this.oScripts.showcdv = {
        id   : "showcdv",
        name : "Show CDV",
        description : "Affiche la CDV d'un pseudo dans une LightBox",
        main : function(){
            // Evite que la cdv se duplique si l'utilisateur bourine le bouton
            var bAlreadyLoading = false;
            var oPseudos = $(".pseudo strong");
            oPseudos.css("cursor", "pointer");

            oPseudos.click(function(e){
                if(!bAlreadyLoading){
                    bAlreadyLoading = true;

                    var iframe = $("<iframe>", {
                        src : "http://www.jeuxvideo.com/profil/" + $(this).text() + ".html",
                        css : {
                            width : "800px",
                            height : "600px",
                            border : 0
                        },
                        load : function(){
                            if(window.innerHeight < 600){
                                $(this).css("height", window.innerHeight - 50);
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
            var oPseudos = $(".pseudo strong");
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

            $(".img_shack, a[href^=http\\:\\/\\/www\\.noelshack\\.com], a[href^=http\\:\\/\\/image\\.noelshack\\.com]").click(function(e){
                if(!bAlreadyLoading){
                    bAlreadyLoading = true;

                    // Si c"est une minitature
                    if($(this).attr("class") === "img_shack")
                        var sImgFalseUrl = $(this).parent().attr("href");
                    // Si c"est un lien hyper-texte
                    else{
                        var sImgFalseUrl = $(this).attr("href");
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

                    $("<img />", {
                        src : sImgTrueUrl,
                        css : {
                            cursor : "pointer"
                        },
                        load : function(){
                            var t = $(this);
                            var popup = $("#JVCMaster_LightBox_popup");
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
                    }).appendTo($("<a/>", {
                        href : sImgTrueUrl
                    }).appendTo("#JVCMaster_LightBox_popup"));

                }
                e.preventDefault();
            });
        },
        uninstall : function(){
            $(".img_shack, a[href^=http\\:\\/\\/www\\.noelshack\\.com], a[href^=http\\:\\/\\/image\\.noelshack\\.com]").unbind("click");
        }
    };

    // Script "Shortcuts"
    this.oScripts.shortcuts = {
        id : "shortcuts",
        name : "Raccourcis",
        description : "Rajoute des raccourcis (Oh, merci Captain Obvious)",
        main : function(){
            
            // Sur les pages où les topics sont listés
            var oListeTopics = $("#liste_topics tr:not(:first)");
            if(oListeTopics){
                oListeTopics.each(function(k, tr){
                    var oTds = $(this).find("td");
                    var oTopic_img = $(oTds[0]).find("img"),
                        sTopic_url = $(oTds[1]).find('a').attr("href"),
                        iTopic_msg = oTds[3].innerText;

                    oTopic_img.parent().css("position", "relative")
                    $(oTopic_img).after($("<a/>", {
                        "class" : "JVCMaster_btn_lastMsg",
                        href : sTopic_url.replace(/(http:\/\/www.jeuxvideo.com\/forums\/)([0-9]+\-)([0-9]+\-)([0-9]+\-)([0-9]+\-)/g, "$1$2$3$4" + Math.ceil(iTopic_msg / 20) + '-'),
                        title : "Accéder à la dernière page de ce topic",
                        css : {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }
                    }));
                });
            }

            // là où des posts apparaissent
            if(vars.oPostContainers){
                vars.oPostContainers.each(function(k, oPostContainer){
                    var pseudo = $(this).find("li.pseudo");

                    $("<a/>", {
                        "class" : "JVCMaster_btn_mp",
                        href : "http://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=" + pseudo.find("strong").text(),
                        title : "Envoyer un message privé à " + pseudo.find("strong").text(),
                        css : {
                            background: "url(http://image.jeuxvideo.com/css_img/defaut/mprives/enveloppe.png) no-repeat top right",
                            width: "16px",
                            display: "inline-block",
                            height: "10px"
                        }
                    }).appendTo(pseudo);
                });
            }
        },
        uninstall : function(){
            $(".JVCMaster_btn_mp").remove();
            $(".JVCMaster_btn_lastMsg").remove();
        }
    };

    // LightBox
    function LightBox(){
        // On crée le calque qui servira à cacher la page
        $("<div>", {
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
        $("<div>", {
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

        $(window).resize(function(){
            var popup = $("#JVCMaster_LightBox_popup");
            popup.css({
                top : (window.innerHeight / 2 - popup.css("height").replace("px", "")  / 2) + "px",
                left : (window.innerWidth / 2 - popup.css("width").replace("px", "") / 2) + "px"
            });
        });
        

        this.show = function(width, height, html){
            var popup = $("#JVCMaster_LightBox_popup");

            popup.css({
                width : width + "px",
                height : height + "px"
            });
            popup.css({ // obligé d"appeler 2 fois ".css()", sinon la popup n"est bien plac&eacute; qu"à son 2ème d&eacute;clenchement
                top : (window.innerHeight / 2 - popup.css("height").replace("px", "")  / 2) + "px",
                left : (window.innerWidth / 2 - popup.css("width").replace("px", "") / 2) + "px"
            });
            
            $("#JVCMaster_LightBox_layer").fadeIn(300, function(){
                popup.fadeIn(300);
            });
        }

        this.hide = function(){
            var popup = $("#JVCMaster_LightBox_popup");

            popup.fadeOut(300, function(){
                $("#JVCMaster_LightBox_layer").fadeOut(300, function(){
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

        $.each(sActivatedScripts, function(key, value){
            if(value)
                oScripts[key].main();
        });
        
        var buttonOptions = $("<a/>", {
            href : '#',
            title : "Panneau de configuration de JVCMaster",
            text : "JVCMaster " + window.JVCMaster_sVersion,
            click : function(e){
                // $('<div style="position: relative;padding-bottom: 8px;background: url(http://image.jeuxvideo.com/css_img/defaut/bloc_forum_bas.png) left bottom no-repeat;"><h3 style="position: static;height: 20px;line-height: 22px;font-size: 116.67%;width: auto;background: url(http://image.jeuxvideo.com/css_img/defaut/bloc_h3_forums.png) right top no-repeat!important;"><span class="txt">JVCMaster : Extensions</span></h3><div style="padding: 5px;border: solid 1px #9C0;border-bottom: 0;height: 1%;position: relative;"><ul id="JVCMaster_Scripts" class="liste_liens">').appendTo('#JVCMaster_LightBox_popup');
                    $('<div class="bloc1"><h3 class="titre_bloc"><span>JVCMaster : Extensions</span></h3><div class="bloc_inner"><ul id="JVCMaster_Scripts" class="liste_liens">').appendTo('#JVCMaster_LightBox_popup');
                // On boucle sur les oScripts
                $.each(oScripts, function(key, value){
                    $("<li>", {
                        id : "JVCMaster_extension_" + value.id,
                        css : {
                            textAlign : "left",
                            fontSize : "95%",
                            borderBottom : "1px solid rgb(237, 237, 237)",
                            fontWeight : "normal"
                        },
                        html : '<input type="checkbox" style="vertical-align : bottom; margin-right: 3px" ' + (sActivatedScripts[value.id] ? 'checked="checked"' : '') + '/><b>' + value.name + "</b> : " + value.description
                    }).appendTo('#JVCMaster_Scripts');
                    
                    $("#JVCMaster_extension_" + value.id + " input[type=checkbox]").click(function(){
                        if($(this).is(':checked')){
                            if(value.id == "shortcuts"){
                                setTimeout(function(){
                                    oScripts[value.id].main();
                                }, 300);
                            }
                            else{
                                oScripts[value.id].main();
                            }

                            sActivatedScripts[value.id] = true;
                        }
                        else{
                            oScripts[value.id].uninstall();
                            sActivatedScripts[value.id] = false;
                        }

                        localStorage.setItem("JVCMaster_sActivatedScripts", JSON.stringify(sActivatedScripts));
                    });
                });
                
                var lb_popup = $("#JVCMaster_LightBox_popup");
                
                lb_popup.attr("class", "forums hp_forums")
                lb_popup.css("padding", "5px 5px 0");
                lb.show();
                e.preventDefault();
            }
        }).appendTo($("<td id=\"JVCMaster_buttonOptions\">").prependTo($("table#connexion tbody tr")));
        
        // Si l"utilisateur viens d"installer JVCMaster
        if(typeof localStorage.getItem("JVCMaster_firstUse") === "object"){
            buttonOptions.click();
            localStorage.setItem("JVCMaster_firstUse", "0");
        }

        // Si on est sur un mp, et que l'utilisateur clique sur "Voir les messages précédents"
        var voir_debut = $("#voir_debut");
        if(voir_debut.is('*')){
            voir_debut.click(function(){

                setTimeout(function(){
                    // On raffraichit les variables
                    vars.oPostContainers = $('.msg'),
                    vars.oPosts = $('li.post'),
                    
                    $.each(sActivatedScripts, function(key, value){
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
