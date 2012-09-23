// ==UserScript==
// @name        JVCMaster
// @namespace   http://kocal.github.com/JVCMaster/
// @description Ajoute des fonctionnalités à Jeuxvideo.com
// @include     http://www.jeuxvideo.com/*
// @include     http://*.forumjv.com/*
// @run-at      document-end
// @version     3.3.3
// ==/UserScript==

function JVCMaster(){
    /*
    Permettra d'acceder à l'objet "JVCMaster" depuis n'importe où*/
    var _ = this;

    _.version = "3.3.3";

    /*
    Raccourcis pour des fonctions casse-burnes à écrire */
    _.log = function(msg){ console.log(msg); }

    /*
    localStorage */
    _.LS_get = function(key){ return localStorage.getItem("JVCMaster_" + key); }
    _.LS_set = function(key, value){ localStorage.setItem("JVCMaster_" + key, value); }
    _.LS_rm  = function(key){ localStorage.removeItem("JVCMaster_" + key); }
    
    /*
    Le pattern où les boutons seront insérés */
    _.patternButton = "_BTN:CITATION__BTN:HIDDENPOST__BTN:HIDDENPOSTSPSEUDO__BADGE:RANK__BTN:MP_";

    /*
    La zone où les boutons seront insérés (appendTo)
    Un $("li.pseudo") aurait suffit, mais sur les MP, la zone était présente à côté de "Ce pseudo vient de quitter la conversation." */
    _.pseudoArea = $(".msg").parent().find("li span:last-child:not(.generic), div[id^=message] ul").parent().find(".pseudo");

    /*
    Les extensions activées */
    _.activatedExtensions = JSON.parse(_.LS_get("activatedExtensions") || "[]");

    _.insertCSS = function(css){
        $("<style>", {
            text : css
        }).appendTo("head");
    }

    _.setButtonsArea = function(){
        $("<span>", {
            "class" : "JVCMaster_patternButton",
            html : _.patternButton.replace(/_(BTN|BADGE):([a-zA-Z]*)_/g, "<span class='JVCMaster_$1_$2'>").replace(/'><span/g, "'></span><span")
        }).appendTo(_.pseudoArea);
    }

    _.setButton = function(type, btn, onMp){
        onMp = (onMp === undefined ? true : false);

        if(!onMp)
            $("div[id^=message] .JVCMaster_" + type).append(btn);
        else
            $(".JVCMaster_" + type).append(btn);
    }

    /*
    Permet de savoir si on est sur www.jeuxvideo.com */
    _.isJVC = function(){
        return /jeuxvideo.com|forumjv\.com$/.test(window.location.hostname);
    }
    /*
    Permet de savoir si on est sur un MP */
    _.onMp = function(){
        return $("#reception").is('*')
    }

    /*
    Permet de trier un Object */
    _.sortObject = function(o) {     var sorted = {},     key, a = [];      for (key in o) {         if (o.hasOwnProperty(key)) {                 a.push(key);         }     }      a.sort();      for (key = 0; key < a.length; key++) {         sorted[a[key]] = o[a[key]];     }     return sorted; }

    /*
    Retourne la sélection HTML de l'utilisateur */
    _.getSelectionHtml = function(){        var html = "";        if (typeof window.getSelection != "undefined") {            var sel = window.getSelection();            if (sel.rangeCount) {                var container = document.createElement("div");                for (var i = 0, len = sel.rangeCount; i < len; ++i) {                    container.appendChild(sel.getRangeAt(i).cloneContents());                }                html = container.innerHTML;            }        } else if (typeof document.selection != "undefined") {            if (document.selection.type == "Text") {                html = document.selection.createRange().htmlText;            }        }        return html;    }
    
    _.init = function(){
        _.setButtonsArea();

        /*
        ColorBox v1.3.20.1 - jQuery lightbox plugin
        (c) 2012 Jack Moore - jacklmoore.com
        License: http://www.opensource.org/licenses/mit-license.php */
        (function(e,t,n){function G(n,r,i){var o=t.createElement(n);return r&&(o.id=s+r),i&&(o.style.cssText=i),e(o)}function Y(e){var t=T.length,n=(U+e)%t;return n<0?t+n:n}function Z(e,t){return Math.round((/%/.test(e)?(t==="x"?tt():nt())/100:1)*parseInt(e,10))}function et(e){return B.photo||/\.(gif|png|jp(e|g|eg)|bmp|ico)((#|\?).*)?$/i.test(e)}function tt(){return n.innerWidth||N.width()}function nt(){return n.innerHeight||N.height()}function rt(){var t,n=e.data(R,i);n==null?(B=e.extend({},r),console&&console.log&&console.log("Error: cboxElement missing settings object")):B=e.extend({},n);for(t in B)e.isFunction(B[t])&&t.slice(0,2)!=="on"&&(B[t]=B[t].call(R));B.rel=B.rel||R.rel||"nofollow",B.href=B.href||e(R).attr("href"),B.title=B.title||R.title,typeof B.href=="string"&&(B.href=e.trim(B.href))}function it(t,n){e.event.trigger(t),n&&n.call(R)}function st(){var e,t=s+"Slideshow_",n="click."+s,r,i,o;B.slideshow&&T[1]?(r=function(){M.text(B.slideshowStop).unbind(n).bind(f,function(){if(B.loop||T[U+1])e=setTimeout(J.next,B.slideshowSpeed)}).bind(a,function(){clearTimeout(e)}).one(n+" "+l,i),g.removeClass(t+"off").addClass(t+"on"),e=setTimeout(J.next,B.slideshowSpeed)},i=function(){clearTimeout(e),M.text(B.slideshowStart).unbind([f,a,l,n].join(" ")).one(n,function(){J.next(),r()}),g.removeClass(t+"on").addClass(t+"off")},B.slideshowAuto?r():i()):g.removeClass(t+"off "+t+"on")}function ot(t){V||(R=t,rt(),T=e(R),U=0,B.rel!=="nofollow"&&(T=e("."+o).filter(function(){var t=e.data(this,i),n;return t&&(n=t.rel||this.rel),n===B.rel}),U=T.index(R),U===-1&&(T=T.add(R),U=T.length-1)),W||(W=X=!0,g.show(),B.returnFocus&&e(R).blur().one(c,function(){e(this).focus()}),m.css({opacity:+B.opacity,cursor:B.overlayClose?"pointer":"auto"}).show(),B.w=Z(B.initialWidth,"x"),B.h=Z(B.initialHeight,"y"),J.position(),d&&N.bind("resize."+v+" scroll."+v,function(){m.css({width:tt(),height:nt(),top:N.scrollTop(),left:N.scrollLeft()})}).trigger("resize."+v),it(u,B.onOpen),H.add(A).hide(),P.html(B.close).show()),J.load(!0))}function ut(){!g&&t.body&&(Q=!1,N=e(n),g=G(K).attr({id:i,"class":p?s+(d?"IE6":"IE"):""}).hide(),m=G(K,"Overlay",d?"position:absolute":"").hide(),L=G(K,"LoadingOverlay").add(G(K,"LoadingGraphic")),y=G(K,"Wrapper"),b=G(K,"Content").append(C=G(K,"LoadedContent","width:0; height:0; overflow:hidden"),A=G(K,"Title"),O=G(K,"Current"),_=G(K,"Next"),D=G(K,"Previous"),M=G(K,"Slideshow").bind(u,st),P=G(K,"Close")),y.append(G(K).append(G(K,"TopLeft"),w=G(K,"TopCenter"),G(K,"TopRight")),G(K,!1,"clear:left").append(E=G(K,"MiddleLeft"),b,S=G(K,"MiddleRight")),G(K,!1,"clear:left").append(G(K,"BottomLeft"),x=G(K,"BottomCenter"),G(K,"BottomRight"))).find("div div").css({"float":"left"}),k=G(K,!1,"position:absolute; width:9999px; visibility:hidden; display:none"),H=_.add(D).add(O).add(M),e(t.body).append(m,g.append(y,k)))}function at(){return g?(Q||(Q=!0,j=w.height()+x.height()+b.outerHeight(!0)-b.height(),F=E.width()+S.width()+b.outerWidth(!0)-b.width(),I=C.outerHeight(!0),q=C.outerWidth(!0),g.css({"padding-bottom":j,"padding-right":F}),_.click(function(){J.next()}),D.click(function(){J.prev()}),P.click(function(){J.close()}),m.click(function(){B.overlayClose&&J.close()}),e(t).bind("keydown."+s,function(e){var t=e.keyCode;W&&B.escKey&&t===27&&(e.preventDefault(),J.close()),W&&B.arrowKey&&T[1]&&(t===37?(e.preventDefault(),D.click()):t===39&&(e.preventDefault(),_.click()))}),e("."+o,t).live("click",function(e){e.which>1||e.shiftKey||e.altKey||e.metaKey||(e.preventDefault(),ot(this))})),!0):!1}var r={transition:"elastic",speed:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,inline:!1,html:!1,iframe:!1,fastIframe:!0,photo:!1,href:!1,title:!1,rel:!1,opacity:.9,preloading:!0,current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",open:!1,returnFocus:!0,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:undefined},i="colorbox",s="cbox",o=s+"Element",u=s+"_open",a=s+"_load",f=s+"_complete",l=s+"_cleanup",c=s+"_closed",h=s+"_purge",p=!e.support.opacity&&!e.support.style,d=p&&!n.XMLHttpRequest,v=s+"_IE6",m,g,y,b,w,E,S,x,T,N,C,k,L,A,O,M,_,D,P,H,B,j,F,I,q,R,U,z,W,X,V,$,J,K="div",Q;if(e.colorbox)return;e(ut),J=e.fn[i]=e[i]=function(t,n){var s=this;t=t||{},ut();if(at()){if(!s[0]){if(s.selector)return s;s=e("<a/>"),t.open=!0}n&&(t.onComplete=n),s.each(function(){e.data(this,i,e.extend({},e.data(this,i)||r,t))}).addClass(o),(e.isFunction(t.open)&&t.open.call(s)||t.open)&&ot(s[0])}return s},J.position=function(e,t){function f(e){w[0].style.width=x[0].style.width=b[0].style.width=e.style.width,b[0].style.height=E[0].style.height=S[0].style.height=e.style.height}var n,r=0,i=0,o=g.offset(),u,a;N.unbind("resize."+s),g.css({top:-9e4,left:-9e4}),u=N.scrollTop(),a=N.scrollLeft(),B.fixed&&!d?(o.top-=u,o.left-=a,g.css({position:"fixed"})):(r=u,i=a,g.css({position:"absolute"})),B.right!==!1?i+=Math.max(tt()-B.w-q-F-Z(B.right,"x"),0):B.left!==!1?i+=Z(B.left,"x"):i+=Math.round(Math.max(tt()-B.w-q-F,0)/2),B.bottom!==!1?r+=Math.max(nt()-B.h-I-j-Z(B.bottom,"y"),0):B.top!==!1?r+=Z(B.top,"y"):r+=Math.round(Math.max(nt()-B.h-I-j,0)/2),g.css({top:o.top,left:o.left}),e=g.width()===B.w+q&&g.height()===B.h+I?0:e||0,y[0].style.width=y[0].style.height="9999px",n={width:B.w+q,height:B.h+I,top:r,left:i},e===0&&g.css(n),g.dequeue().animate(n,{duration:e,complete:function(){f(this),X=!1,y[0].style.width=B.w+q+F+"px",y[0].style.height=B.h+I+j+"px",B.reposition&&setTimeout(function(){N.bind("resize."+s,J.position)},1),t&&t()},step:function(){f(this)}})},J.resize=function(e){W&&(e=e||{},e.width&&(B.w=Z(e.width,"x")-q-F),e.innerWidth&&(B.w=Z(e.innerWidth,"x")),C.css({width:B.w}),e.height&&(B.h=Z(e.height,"y")-I-j),e.innerHeight&&(B.h=Z(e.innerHeight,"y")),!e.innerHeight&&!e.height&&(C.css({height:"auto"}),B.h=C.height()),C.css({height:B.h}),J.position(B.transition==="none"?0:B.speed))},J.prep=function(t){function o(){return B.w=B.w||C.width(),B.w=B.mw&&B.mw<B.w?B.mw:B.w,B.w}function u(){return B.h=B.h||C.height(),B.h=B.mh&&B.mh<B.h?B.mh:B.h,B.h}if(!W)return;var n,r=B.transition==="none"?0:B.speed;C.remove(),C=G(K,"LoadedContent").append(t),C.hide().appendTo(k.show()).css({width:o(),overflow:B.scrolling?"auto":"hidden"}).css({height:u()}).prependTo(b),k.hide(),e(z).css({"float":"none"}),d&&e("select").not(g.find("select")).filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one(l,function(){this.style.visibility="inherit"}),n=function(){function y(){p&&g[0].style.removeAttribute("filter")}var t,n,o=T.length,u,a="frameBorder",l="allowTransparency",c,d,v,m;if(!W)return;c=function(){clearTimeout($),L.detach().hide(),it(f,B.onComplete)},p&&z&&C.fadeIn(100),A.html(B.title).add(C).show();if(o>1){typeof B.current=="string"&&O.html(B.current.replace("{current}",U+1).replace("{total}",o)).show(),_[B.loop||U<o-1?"show":"hide"]().html(B.next),D[B.loop||U?"show":"hide"]().html(B.previous),B.slideshow&&M.show();if(B.preloading){t=[Y(-1),Y(1)];while(n=T[t.pop()])m=e.data(n,i),m&&m.href?(d=m.href,e.isFunction(d)&&(d=d.call(n))):d=n.href,et(d)&&(v=new Image,v.src=d)}}else H.hide();B.iframe?(u=G("iframe")[0],a in u&&(u[a]=0),l in u&&(u[l]="true"),u.name=s+ +(new Date),B.fastIframe?c():e(u).one("load",c),u.src=B.href,B.scrolling||(u.scrolling="no"),e(u).addClass(s+"Iframe").appendTo(C).one(h,function(){u.src="//about:blank"})):c(),B.transition==="fade"?g.fadeTo(r,1,y):y()},B.transition==="fade"?g.fadeTo(r,0,function(){J.position(0,n)}):J.position(r,n)},J.load=function(t){var n,r,i=J.prep;X=!0,z=!1,R=T[U],t||rt(),it(h),it(a,B.onLoad),B.h=B.height?Z(B.height,"y")-I-j:B.innerHeight&&Z(B.innerHeight,"y"),B.w=B.width?Z(B.width,"x")-q-F:B.innerWidth&&Z(B.innerWidth,"x"),B.mw=B.w,B.mh=B.h,B.maxWidth&&(B.mw=Z(B.maxWidth,"x")-q-F,B.mw=B.w&&B.w<B.mw?B.w:B.mw),B.maxHeight&&(B.mh=Z(B.maxHeight,"y")-I-j,B.mh=B.h&&B.h<B.mh?B.h:B.mh),n=B.href,$=setTimeout(function(){L.show().appendTo(b)},100),B.inline?(G(K).hide().insertBefore(e(n)[0]).one(h,function(){e(this).replaceWith(C.children())}),i(e(n))):B.iframe?i(" "):B.html?i(B.html):et(n)?(e(z=new Image).addClass(s+"Photo").error(function(){B.title=!1,i(G(K,"Error").html(B.imgError))}).load(function(){var e;z.onload=null,B.scalePhotos&&(r=function(){z.height-=z.height*e,z.width-=z.width*e},B.mw&&z.width>B.mw&&(e=(z.width-B.mw)/z.width,r()),B.mh&&z.height>B.mh&&(e=(z.height-B.mh)/z.height,r())),B.h&&(z.style.marginTop=Math.max(B.h-z.height,0)/2+"px"),T[1]&&(B.loop||T[U+1])&&(z.style.cursor="pointer",z.onclick=function(){J.next()}),p&&(z.style.msInterpolationMode="bicubic"),setTimeout(function(){i(z)},1)}),setTimeout(function(){z.src=n},1)):n&&k.load(n,B.data,function(t,n,r){i(n==="error"?G(K,"Error").html(B.xhrError):e(this).contents())})},J.next=function(){!X&&T[1]&&(B.loop||T[U+1])&&(U=Y(1),J.load())},J.prev=function(){!X&&T[1]&&(B.loop||U)&&(U=Y(-1),J.load())},J.close=function(){W&&!V&&(V=!0,W=!1,it(l,B.onCleanup),N.unbind("."+s+" ."+v),m.fadeTo(200,0),g.stop().fadeTo(300,0,function(){g.add(m).css({opacity:1,cursor:"auto"}).hide(),it(h),C.remove(),setTimeout(function(){V=!1,it(c,B.onClosed)},1)}))},J.remove=function(){e([]).add(g).add(m).remove(),g=null,e("."+o).removeData(i).removeClass(o).die()},J.element=function(){return e(R)},J.settings=r})(jQuery,document,window);
        var ColorBox_img_Overlay = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeBAMAAADJHrORAAAAMFBMVEX///8HBwcICAgUFBQXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABuanbkAAAAQUlEQVR4nOzOoQ0AIBDF0K5QNiC3wYUN2H8nJPkai6l5prSOdcPU2jckN8mTZEmWZEmW5EFy8f+e/g4AAAD//wMAKnM4yCLdBHkAAAAASUVORK5CYII="
          , ColorBox_img_Controls = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAAAyCAYAAAD8z1GNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACu9JREFUeNrsXVtsFNcZ/sE37NjgNTYXh8ZgFBoupRJuWjVtlZguRVxSWqSobaKmUiHLU9T2oapbRJ8ajB+ohIIfcFupoY5JFaBKU0wjGdyEgiHJ1qHUQFwutcHGNo7XYTe+geXOd9gznB3PzM7M7szuLPNJRx7vzsw3/55v/vOfy/wzg4j2kAVMTU39gjzYgRkS4u1TJZXKaPE5fH0hqVyLlqABnUwZNLrOysVkP4wKGRsbY2XWrFmsuAgQrj8FohXhi14Hv5YWI0K2C2kh4Fu3btHw8DCNjIxM+66goICKi4tp4cKFDzMHRPNc1OOmE/h1QcxvRr2zs81VKkMIVPbVq1flCi4sKqLsrCz5+3uTkxQJh2VBLF26lInAKkdJSYnscfPz82l0dFT2yENDQ0nhSIIdyhACIgmk2OsaDS0alCK2O4RImYCvX7/ORIMKLykrp4L8XMrJmhHTpENYdyenaGR0goZu9zIBQIRLliwxxYFjfD4fZeXkaXJM3h2nUCgk72+U48bNmzTQ32/ajnnz59PnFi2KJ2C3iFdTxBkZA3NhoRKLCgslbzRHdT8Wo0p/ix7Jp7zsKQpHIkwsQDyBiRzFvrnsHHockk9mAs/OybHEYdUODRFzPOci8YohRUPGxsBobo0ISwk0uRAYgMqHR9VqhkWOstJSwx01XEtOVqlpjkTsuC/8Yr2RBrehMnrtjnTsZjptHWJFNLeoOKOVLgoMx+F4HnNqcSAMwL5mRxmwP47D8fE4bLbD7+KBHseu3VEBo5fOvZDodRBHnjx5khVsc5w+c4Z9hr+iB+PH8vOpcRQUleh2xi5dukThz0Y1vSSOj8ehtEMtxNDzxDp2VLksdNAaasssAaPZhdfBCEBMZUpN8JUrV6itrY2ONzczYUG0/2htZZ+V+GLrkh+P82lxINaMdzMdev1PMTeMCH68HofSDhFHjx6Vrv2s7jXo2FFJ7kdlxgkYvW8MMSmbdTSpGzZuZNu3b9+mU++20pnTp9n/y5cvZ0XZzKOJVxtv1eKAYOEReYFowPXGoUOqntIKBxdjU9Mh5uEjkXAMp5JHh8MTcDqPQqgBvfFnqquZ121vb2eflZWV0br1G1TFZRYQFLy5EuiI7dy5k7Zv305r1641zCGO84qhEG6IiYkJ+WZsamqShByhrq4uqqiooNraWiMcvgwQsCM2zEyFZVoVV7VmDeXm5rIK7+jooJWrVpnuIBkVIIQLjs7OThofH6f6+npqlsIXo8DkhMgBDy+KF4Ad3d3dMoeHDPDA9+7e1Ykb/0Jnzz6IG+v376eVK1aYnhlT40DTDjGFw2FVMa1fv542RsMYKxyYIoYHb2i4PwQ6ODjoqStTQwi+kEZEMBikI0cOs+1t27ZRY2MjE1pdXV1Ms8uPN8uB5vvpp5+R/79w4d/MM+bl5U0LH6xyVFVVUSAQkEVcWloaw6mc6DDCYRXSdfik4peuyVQsKtXDNen6W6QS8gSsAHruaLoxQSBWPLzj3r172fayZcuYJ5wjed3fSp9BZOjRb926Nabi+TS0UQ6IC4VDCk1ZXLpr165pnUSrHJynpqaG9kutB8Kh55//ge4NoMWRCI4dO+aXfkNLw1gQ/IEDBwJbtmwJbtq0qcUTsDhcJokSPW4sohHDgo6LF2nz5mfZdnX1fY/1taeeov6+PqmSx1kRwRfhqIUWnAPTtXqhR8XiCnbTaK0Ow/HxOJR2cGAKGjdGc/Nx3d9Dz45UiFcEziGdi9JdxI4v5kGoAFhZ9cW9NZ+9Ej1qKjjgOXEDWOVAxw83goIDi3ks1QnCBnjPZApkx44dDQmEEzV2L+ZxfBQCogKw8ktrJkwL2B/HieeJx6E2ERFPWEY5IL5E7MDxehwWBJz0KVw7zunqThy8FQbv+frbSZ0FM2rC4ssd9Y5RchhtphPhsMMOK/FrsuvLjnO6fhSCL1NEJaIjg1gQ06rKR3z4oz/4nj/pYHStrsghLnnU4hCXOFrhsMsOD2koYF756MUj1uRTqahUAJXPh5hEL2o2phU5IE4UziEiWRx22eEhDQXMm2F0YPizZGIli0NWiTyvlikcHtJQwByoVF6xdj0xLHK42Q4PaShgEZlS4Z5wncFM7yfw4AnYg4eHOYQQx0aV4I/EJ9prdyKxiRN2eEgjASsTgoiJR8SOEN8nGUlHMB6slnSkt7eXlWRw2GGHhzQTMDwiBGMmIQgEUF5ebthTGk2egmfyRA4zkwxO2OEhzQTMK91sQhA0zzgOiFf5TiRPccIOD2kmYDS3vNKtJgTB8ZiytTvpSLzEJnbbYRZYjJ7stQs4pzcKISDRhCAQlZHEJk4kT7HbDrPAkxTJri87zulaAWslBDn893bad7CVlbb2+zc8lhw2/Pmf8uf9g59OOzaRpCPg7Or9RNNLJotDzxPrcVgUW6i5uTlpKZ1wrnR/tCgtEps8ufox6vzfACtHW84zsb5z6jKd/7iHfeabU0DzSx/El0YSmxTO1m+WewaGaf/r79Hla32q3xvh0EpsgpuvtuEdan2/U/ca9DisAk9QJEPEOIf3SJECPK2ocoq1onwubfjGCjp+6iLrqdc3naJPhj9j380tfoS+6189rVOkXO+r5MBIgAh4dn5OANvgerXxXdq67ov0za8+YZpDbaoYXv0Ph9tkLvEGAd+alY8Z4khUxIFAIOg91GkHYVaWasVvrv4CXb0xyDwur/yxiXu043tfnxZjGlljoNzn/Qtd7NzTvOmdUfr1q8104tx/afdPnzXMoWYHbhK0IBAqB24Q2NF9S+r0DXxKHW//ypQdiYQTUnkz00chHO/EYeJAC9/fuIb9jYyMU2fXoBQ2zKZH59sz4A/hfnS5hz76uJeGw2P01okL9PJvDlu2418d3dT49gcx4oVwYcfZ811MvB4ywAPrJTbZ1/geffifGxSJigCievHbT9ITlQsS5rgTGaObfcM0Mn6PhiQPD3GJ+PySeVTzkt8yx+OLy2jxo3Ol6++mIenmuBMele3wkEEemHkmlYQeB986xwSLSi+f96DD9vIrR6Y9NGk06YiInJxsKp6dT+VlRbTq8QVUmJ8rf7f2K8votdoXYry9WQ6EOT/f5qelFWXM23Lxfmnlophi0I5QBmjLERvSIrEJOjp1vz/BtiGsP+5+gfb8roVOnutkYqiVtsX41ErSkZqX1sXs96Oag/Rhx036oeThld9Z5QBwnV9eVUE79/2N/f/anhd1bwANDowlVrlcwI5MgDjqgfm4J0/oIXvfv34ge6hfBr7FPOHun22SP+vpC1FP/4OhpniJTdQ4lJhdWECv/GSzqngT5fiOfzUd2ffjGC9vkuMauR+O2JCSxCY2JQSJ4QD0Vn0hLNGaQUtWYhPcdFqd0DiJTfAXv69b06wifKiL6iSzEptgFVYyEoLgPFowkjxFS7xGk6cYsUNLvAbtaCH3wrFrd3wUAh5LfLEgzVtgaC0BKn1woE9OCKK3isuJpCMO2BEkd76pyNA7lF0rYECZEARCwdSvmgBQ4ZE7wwklNnEieYpNdmAiwm0vOnR08iSlr5rl62l5zx7CwosGMcuFiQKMtUIY/DEgK4vAxXgWsCPpSJLt8F416xYBqwlAK950w8u++WtntaDzelk9AXMRp+PLvsWwQfVl3w+FgJUeUzlclWw4kXQkATvUBMyBmNifRt44FO2wBXV0knnvStaDEw87OpF0xCY7gorOXWUKxByKelxHO2ta+L8AAwAVufYzBE3j5AAAAABJRU5ErkJggg=="
          , ColorBox_img_Border = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAyAQMAAACnNSPJAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlOArV5bRgAAABhJREFUeF6VwQENAAAAgjCjG50GbPwzDwUmggsB4+yamQAAAABJRU5ErkJggg=="
          , ColorBox_img_Loading = "data:image/png;base64,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"        
        ;
        
        /*
        ColorBox CSS
        Modifié pour JVCMaster */
        _.insertCSS("#colorbox, #cboxOverlay, #cboxWrapper{position:absolute; top:0; left:0; z-index:9999; overflow:hidden;}#cboxOverlay{position:fixed; width:100%;  height:100%;}#cboxMiddleLeft, #cboxBottomLeft{clear:left;}#cboxContent{position:relative;}#cboxLoadedContent{overflow:auto;}#cboxTitle{margin:0;}#cboxLoadingOverlay, #cboxLoadingGraphic{position:absolute; top:0; left:0; width:100%; height:100%;}#cboxPrevious, #cboxNext, #cboxClose, #cboxSlideshow{cursor:pointer;}.cboxPhoto{float:left; margin:auto; border:0; display:block; max-width:none;}.cboxIframe{width:100%; height:100%; display:block; border:0;}#colorbox, #cboxContent, #cboxLoadedContent{box-sizing:content-box;}/*User Style:Change the following styles to modify the appearance of ColorBox.  They areordered & tabbed in a way that represents the nesting of the generated HTML.*/#cboxOverlay{background:url(" + ColorBox_img_Overlay + ") repeat 0 0;}#colorbox{}#cboxTopLeft{width:21px; height:21px; background:url(" + ColorBox_img_Controls + ") no-repeat -101px 0;}#cboxTopRight{width:21px; height:21px; background:url(" + ColorBox_img_Controls + ") no-repeat -130px 0;}#cboxBottomLeft{width:21px; height:21px; background:url(" + ColorBox_img_Controls + ") no-repeat -101px -29px;}#cboxBottomRight{width:21px; height:21px; background:url(" + ColorBox_img_Controls + ") no-repeat -130px -29px;}#cboxMiddleLeft{width:21px; background:url(" + ColorBox_img_Controls + ") left top repeat-y;}#cboxMiddleRight{width:21px; background:url(" + ColorBox_img_Controls + ") right top repeat-y;}#cboxTopCenter{height:21px; background:url(" + ColorBox_img_Border + ") 0 0 repeat-x;}#cboxBottomCenter{height:21px; background:url(" + ColorBox_img_Border + ") 0 -29px repeat-x;}#cboxContent{background:#fff; overflow:hidden;}.cboxIframe{background:#fff;}#cboxError{padding:50px; border:1px solid #ccc;}#cboxLoadedContent{margin-bottom:28px;}#cboxTitle{position:absolute; bottom:4px; left:0; text-align:center; width:100%; color:#949494;}#cboxCurrent{position:absolute; bottom:4px; left:58px; color:#949494;}#cboxSlideshow{position:absolute; bottom:4px; right:30px; color:#0092ef;}#cboxPrevious{position:absolute; bottom:0; left:0; background:url(" + ColorBox_img_Controls + ") no-repeat -75px 0; width:25px; height:25px; text-indent:-9999px;}#cboxPrevious:hover{background-position:-75px -25px;}#cboxNext{position:absolute; bottom:0; left:27px; background:url(" + ColorBox_img_Controls + ") no-repeat -50px 0; width:25px; height:25px; text-indent:-9999px;}#cboxNext:hover{background-position:-50px -25px;}#cboxLoadingGraphic{background:url(" + ColorBox_img_Loading + ") no-repeat center center;}#cboxClose{position:absolute; bottom:0; right:0; background:url(" + ColorBox_img_Controls + ") no-repeat -25px 0; width:25px; height:25px; text-indent:-9999px;}#cboxClose:hover{background-position:-25px -25px;}")

        /*
        Code CSS pour JVCMaster */
        _.insertCSS(".JVCMaster_patternButton img { cursor: pointer; margin-right : 3px } \
                    #JVCMaster_panneauConfiguration .titre_bloc{ font-size : 13px; text-align: left } \
                    #JVCMaster_panneauConfiguration li{ \
                        background: url(http://image.jeuxvideo.com/css_img/defaut/puce_base.gif) no-repeat left center; \
                        border-bottom : 1px solid rgb(237, 237, 237); \
                        font-size : 12px; \
                        font-weight : normal; \
                        margin: 2px 0;  \
                        overflow: hidden; \
                        padding: 0 0 1px 18px; \
                        text-align : left \
                     } \
                    #JVCMaster_panneauConfiguration input[type=checkbox]{ margin-right: 3px; vertical-align : bottom } \
                    \
                    .JVCMaster_POST{ \
                        background: url(http://image.jeuxvideo.com/css_img/defaut/sep_444.gif) repeat-x top; \
                        clear: both; \
                        line-height: 1.3em; \
                        margin-bottom: 8px; \
                        padding-top: 10px; \
                    }");


        /*
        Bouton "JVCMaster x.x.x" pour ouvrir le panneau de configuration */
        var BTN_CONFIGURATION = $("<a/>", {
            title : "Panneau de configuration de JVCMaster",
            text  : "JVCMaster " + _.version,
            click : function(e){
                 /*
                On rafraichit la liste des extensions activées */
                _.activatedExtensions = JSON.parse(_.LS_get("activatedExtensions") || "[]");

                /*
                Contenu du panneau de configuration de JVCMaster*/
                var html = '<div id="JVCMaster_panneauConfiguration" class="forums hp_forums"><div class="bloc1"><h3 class="titre_bloc"><span>JVCMaster : Extensions</span></h3><div class="bloc_inner"><ul class="liste_liens">';
                    $.each(_.scripts, function(script){
                       html += '<li><input type="checkbox" data-jvcmaster-script-id="' + _.scripts[script].id + '"' + (_.activatedExtensions.indexOf(scripts[script].id) !== -1 ? ' checked="checked"' : '') + '/><b>' + _.scripts[script].name + "</b> : " + _.scripts[script].description + "</li>"
                    });
                    html += "</ul></div></div>";

                $.colorbox({html : html});
                
                $("input[type=checkbox][data-jvcmaster-script-id]").click(function(){
                   var t  = $(this)
                     , id = t.attr("data-jvcmaster-script-id");

                    if(t.is(":checked")){
                        _.activatedExtensions.push(id);
                        _.scripts[id].init();
                    } else{
                        _.activatedExtensions.splice(_.activatedExtensions.indexOf(id), 1);
                        _.scripts[id].destroy();
                    }

                   _.LS_set("activatedExtensions", JSON.stringify($.unique(_.activatedExtensions)));
                })

                e.preventDefault();
            },
            css : { cursor : "pointer"}
        });

        BTN_CONFIGURATION.appendTo($("<td>").prependTo($("table#connexion tbody tr")));

        /* 
        Obligé d'utiliser un timer, car sur les forumJV, la barre est "actualisée" */
        setTimeout(function(){
            BTN_CONFIGURATION.appendTo($("<li>").prependTo($("div#log ul")));
        }, 1001);

        /*
        On lance les extensions que l'utilisateur a activées */
        $.each(_.activatedExtensions, function(k, script){
            _.scripts[script].init();
        });

        if(typeof LS_get("isFirstUse") === "object"){
            _.LS_set("isFirstUse", "0")

            /*
            On purge la configuration de JVCMaster 2.x */
            _.LS_rm("oHiddenPosts");
            _.LS_rm("oHiddenPostsViaPseudos");
            _.LS_rm("firstUse");
            _.LS_rm("sActivatedScripts");
            BTN_CONFIGURATION.click();
        }
        
        /*
        "Voir les messages précedents" sur les MP */
        var voir_debut = $("#voir_debut a span");
        if(voir_debut.is('*')){
            // Utilisation de $("#voir_debut") sans l'avoir mis dans une variable pour "actualiser"
            voir_debut.click(function(){
                setTimeout(function(){
                    $(".JVCMaster_patternButton").remove();
                    _.pseudoArea = $(".msg").parent().find("li span:last-child:not(.generic), div[id^=message] ul").parent().find(".pseudo");
                    _.setButtonsArea();

                    voir_debut = $("#voir_debut a span")

                    $.each(_.activatedExtensions, function(k, script){
                        _.scripts[script].destroy();
                        _.scripts[script].init();
                    });                 
                }, 1000);
            });
        }

        delete ColorBox_img_Controls, ColorBox_img_Loading, ColorBox_img_Border, ColorBox_img_Overlay;
    }

    // Extensions de JVCMaster
    _.scripts = {
        antiflood : {
            id          : "antiflood",
            name        : "Anti-Flood",
            description : "Cache le flood",
            init : function(){
                _.insertCSS(".JVCMaster_POST_FLOOD{ \
                                background : rgba(255, 0, 0, 0.2); \
                                border : 1px solid red; \
                                padding : 10px; \
                            } \
                            .JVCMaster_POST_FLOOD a img{ \
                                margin-right : 3px; \
                                vertical-align : top; \
                            }");

                var postContainers = $("div[id^=message]");

                postContainers.find(".post").each(function(){
                    var t             = $(this)
                      , postContainer = t.parents(".msg")
                      , html          = t.html();

                    if(/( ?<br( \/)?>&nbsp;\n){200}/.test(html)
                    || /[W]{40}/.test(html)
                    ){
                        var BTN_AVERTIR_HREF = postContainers.find(".avertir").attr("href")
                          , pseudo           = postContainer.find(".pseudo strong").text()
                        ;

                        postContainer.hide();
                        postContainer.before($("<div>", {
                            "class" : "msg JVCMaster_POST_FLOOD"
                            , html : "<i>JVCMaster</i> : <b>Flood</b> de <b>" + pseudo + "</b> - <a href='#' onclick='$(this).parent().next().slideToggle(); return false'>Voir/cacher le post</a>"
                        }));    
                    }
                })

            },
            destroy : function(){
                $(".JVCMaster_POST_FLOOD").remove();
                $(".msg").show();
            }
        },

        cdvinformations : {
            id :        "cdvinformations",
            name        : "CDV informations",
            description : "Affiche des informations à côté du pseudo", 
            init : function(){
                /*
                Impossible de faire une requête AJAX depuis les forumJV sur "Jeuxvideo.com" */
                if(/forumjv\.com$/.test(window.location.hostname))
                    return;

                _.insertCSS(".JVCMaster_BADGE_RANK img{ cursor : default }")
                
                _.insertCSS(".JVCMaster_avatar{ \
                        display : none; \
                        height : 100px; \
                        left: -105px; \
                        position: absolute; \
                        text-align : right; \
                        top: 0; \
                        z-index: 1; \
                        width : 100px; \
                    } \
                    .JVCMaster_avatar img{ \
                        background: white; \
                        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); \
                        padding: 5px; \
                    } \
                    .pseudo strong{ \
                        cursor : default \
                    }");

                BADGE_RANK = $("<span>", {
                    height : "12px"
                    , width : "14px"
                    , css : {
                        backgroundImage : "url(data:image/png;base64,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)"
                        , marginRight : "3px"
                        , display : "inline-block"
                    }
                });
                _.setButton("BADGE_RANK", BADGE_RANK);

                $(".pseudo strong").each(function(){
                    var t             = $(this)
                      , postContainer = t.parents(".msg")
                      , pseudo        = t.text().toLowerCase()
                    ;

                    $.ajax({
                        url : "http://www.jeuxvideo.com/profil/" + pseudo + ".html",
                        success : function(data){
                            var BTN_CDV    = postContainer.find("a[href^=http\\:\\/\\/www\\.jeuxvideo\\.com\\/profil] img")
                              , BADGE_RANK = postContainer.find("span.JVCMaster_BADGE_RANK span")
                            ;


                            if(data.match("<p class=\"banni\">"))
                                BTN_CDV.attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wICggWDgPWFDkAAAD2SURBVCjPhdEtroNAEMDxP4VtsqYkxXALDAoBohfgCIg9wJpaLoDZA+BxXAgEsmkIigSxJDzR0Pa9NK/jJvnNZD4crfXGlzDGOAAeQBzH/2Kt9WaMcTwAay0ARVH8QlVVcTqdiKIIrfV22PFfCHC9XhmGgXmeATi8dwZIkoTL5fLMu65jmiaeM1trKcuSrusIw5C2bQHIsowgCFjX9YX7vsday/F4pGkaANI0BcB1Xe73O1LKBwYQQiCEQCnF7XZDCMH5fCYIAoQQr87vUdc1AHme4/v+E37ESinGcfx4b2c/+r6EtZZlWQCQUr5G8LwH3gu+vf0HNF5XpCC6I0sAAAAASUVORK5CYII=");
                            else{
                                var rank   = data.match("<body.*class=\"(.*)\">")[1]
                                  , sexe   = data.match("<h1.*class=\"(sexe_[f|m])\">")[1]
                                  , avatar = data.match('<img id="img_grande"(?: | style="(?:[^"]*)" onClick="(?:[^"]*)" )?src="([^"]*)"')[1]
                                ;

                                if(!_.onMp()){
                                    $("<li>", {
                                        "class" : "JVCMaster_avatar",
                                        html : "<img src='" + avatar + "'>"
                                    }).appendTo(postContainer.find("ul"));

                                    postContainer.find(".pseudo strong").hover(function(){
                                        postContainer.find(".JVCMaster_avatar").fadeIn(200);
                                    }, function(){
                                        postContainer.find(".JVCMaster_avatar").fadeOut(200);
                                    });
                                }

                                if(sexe == "sexe_f")
                                    BTN_CDV.attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEmSURBVHjahNG/SwJhHMfx92Ond4slYaF3EmgN0tQQLTm2FQQtZbTV5tYc9Cc49TccLU61NZ4E4eJSJGFDSGFJmoZ3Ss/TIF72g/xsD8/reZ4P30c4lq0Yk0wtKwA0gIW1xX+xc2GrTC0rNADVlQDETpe+oauNc6L6NPOraZyirQID/PELAqycrXNTr/De6QDg42Gy1iYHqR1/XaqXeW694HdWXcnlcoFiq0RaT3FczQOwb24zZ5goV37h2/sKrvIwZZTdp0MAcpE9DIJE+5O8ug2mAmGEY9nKUz3/2aZsc927oynfSGoJksEEhtDRRWjQeTRbjzmOGnliEzPEtVkMoft72k9ciJ9Q7T/8OW8BMFrFVR5N2QYgEgj7N+siNMDDA+O+/XMAnBxmyJCBTqUAAAAASUVORK5CYII=");
                                else
                                    BTN_CDV.attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEmSURBVHjahJE9S8NQFIafG29JHKq1FOkHCFUHRwcpoh0cHJ3cdHBRhOAfUBAc/Qnd3QRxEBfBMUUQZ0UIFYeiRrQpVBKbkOsQjPUDe7bDec57Xt4jSqal6FPNWlUASIDFyuS/8DmWataqQgJ43Vj8cDP/DVrav0RP55ifnqBuWkoD8AL1CwQ43ang3N/Q6bwBoPUqA5RmVxhf2Eh6x76i3Xom8ewFipntC9p2HX10isbJHgDF6jpGdgw/UF/wnX2LCn2iVJHHo1UAMnNbgEGg5fCdFpoxjCiZllLhe3I28l26T9dEvoscKZPKlhHSQEg99txbDwfLvJztMpDOI4cKCGkkM/kTLqwdE7w2/sxbAPRaUaFP5LlxVIOZRFlIPYY/F/q9/WMAikdlnhDc6i4AAAAASUVORK5CYII=");

                                switch(rank){
                                    case "carton":
                                        BADGE_RANK.css({
                                            width : "13px",
                                            height : "13px",
                                            backgroundPosition : "0 0"
                                        });
                                    break;

                                    case "bronze":
                                        BADGE_RANK.css({
                                            width : "8px",
                                            height : "14px",
                                            backgroundPosition : "-14px 0"
                                        });
                                    break;

                                    case "argent":
                                        BADGE_RANK.css({
                                            height : "13px",
                                            backgroundPosition : "-22px 0"
                                        });
                                    break;

                                    case "or":
                                        BADGE_RANK.css({
                                            width : "13px",
                                            height : "13px",
                                            backgroundPosition : "0 -14px"
                                        });
                                    break;

                                    case "rubis":
                                        BADGE_RANK.css({
                                            width : "11px",
                                            backgroundPosition : "-14px -15px"
                                        });
                                    break;

                                    case "saphir":
                                        BADGE_RANK.css({
                                            width : "12px",
                                            backgroundPosition : "0 -28px"
                                        });
                                    break;

                                    case "emeraude":
                                        BADGE_RANK.css({
                                            width : "12px",
                                            backgroundPosition : "-12px -28px"
                                        });
                                    break;

                                    case "diamant":
                                        BADGE_RANK.css({
                                            width : "11px",
                                            backgroundPosition : "-25px -27px"
                                        });
                                    break;
                                }
                            }
                        }
                    });
                })
            },
            destroy : function(){
                $("span.JVCMaster_BADGE_RANK span").remove();
                $("a[href^=http\\:\\/\\/www\\.jeuxvideo\\.com\\/profil] img").attr("src" ,"data:image/png;base64,R0lGODlhCwAMAMQAAAAAAP///3LEGzpYGj5qD5LkO2m1GWClF3q0PKHnVlKAIVGLE4PHO6boX5XcSkyDEm69Gn/GM4zJS1mLJJrdUj9iGWWtGFaUFJzmTVWAJkNzEJflREJjIQAAAAAAAAAAACH5BAUUAAAALAAAAAALAAwAAAVFoCCOIwAITaqmwpkkQRxIVCJisow44hYPnFiGISpEJopYRRERQQyHGIFwMTghEMtDU4VcIbGFBfu1LMTkExZ6MKRPJFIIADs=");
            }
        },

        citation : {
            id          : "citation",
            name        : "Citation",
            description : "Citer des posts",

            init : function(){
                var textarea = $("#newmessage")
                  , btn = $("<img />", {
                        title : "Citer ce post",
                        src   : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMEAYAAADkOZvdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wAA/6wAAIMCAACETAAA7XIAADqFAAAdxCRWn50AAAMoSURBVHjadJJvSJx1AMc/v98993h3HnLq6Q41lVKwGiGHmAwZQ4bEBW1sEENMgkSWuGMVDDlijIi4F3XY8EWMKBUnIccacdhYMlbYUasX4zj7I1K3FHGXXDc778/zPPf8elUNap/XXz58XnxFa9e8WvtWKZ6TXRwGcV40yMdBHFGn1IfYKsUlQuSYYYRJFuWbXKeHqHZRzspZO6EGZYR01dI2pJTS2yTCjInbxoQmUrJPRKGu6Nl1A9UJe8wOYjBFnDH2RYIx+tmWAyInblHnOCtSooteR0YWxaSwnC5N1/KO68actVwdK4xKnxwWDe6boiN01Z18XymX7ex1NoM8JbNyFEM0kyBGcf3E6Z5gGB+P4OlXP8gnxom6+/23moPMFTRrRV3mrsZRggwCm4ziAlHmJDPo6ydOB4JT6H8LWj+e6J7eAnGNNjEADt017vkD9JX6bxqTTDtna5719DEt3vF0essgVU5NiWkQWRETKRAf4aHrf9LiO/HfF0HLeIa8P4P7wmMHT8RB/+HQepsEdacmqr8I5h161QZofG8H1EmQy2JHngU2xKBKAJB62Fsqljr/jIEn7Tva9B7o4y3fde6D+ZTjosxC6RerUI1AOWcNWjmQak7GSIOdrAatAMgRe8Q+8t/gao8YNq/BwbY1XlmAB22l48URKCTLb1fuQnHXzFp7gIEHQKqgnbGHwPis3FKOQGXIiBgZSKczmQf5h8wL9iV9EqywmpEFMK8oH2FQtr1kS1CIT4Tx71y0Dsx/unZOKXrNrFEAsUgDcTB27x/fvgL3ayO+l87wSA69EV29Ogry9fpVvxccfe6wdxhEa8v81trnSinN8FQA8iwQA3uitHKwC6b3t1c2G8D0bb28eQ/4Sdn2VyAuuJZq3wVHsv6M/0fQIx3Pd8+BI9fYHjgGmgpZq2ZZNIkb+gs1uvpV+c3LlQSavOkxanfBGe94snsHzfGW7+vGVTR1u/Ja6RywrI6pJRCHa75wh4Abzo2aZVB+VafaQfzz08D8wdqXnEdDQ6p7wD4WISDPHu1Alh38wA57PAPsk0MC22SRQDsBAPoZgL8GAMXsSoEas11IAAAAAElFTkSuQmCC",
                        click : function(){
                            var postContainer = $(this).parents(".msg");

                            var citationPermalink = $.trim(postContainer.find(".ancre a").attr("href"))
                              , citationDate      = $.trim(postContainer.find(".date, .msg_infos").text().replace("Posté ", "").replace(/le \n/, ""))
                              , citationPseudo    = $.trim(postContainer.find(".pseudo strong").text())
                              , citationPost      = $.trim(getSelection().toString() !== "" && (getSelection().focusNode.parentElement.className.match("JVCMaster_POST") || getSelection().focusNode.parentElement.className == "postContainer") ? _.getSelectionHtml() : postContainer.find(".post:eq(0), .msg_body:eq(0)").html()).replace(/ *<br(?: \/)?>/g, "").replace(/<img.*?alt="([^"]*?)".*?>|<a.*?href="([^"]*?)".*?>.*?<\/a>|<img.*?class="img_shack".*?>/gi, "$1 $2").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").split("\n").join("\n| ")
                              , citation          = ""
                            ;

                            if(citationPermalink != "") citation += "| " + citationPermalink + "\n";

                            citation += "| Ecrit par « " + citationPseudo + " », " + citationDate + "\n| « " + citationPost + " »\n\n> "

                            if(!textarea.is('*')){
                                _.LS_set("citation", citation);
                                window.location.href = $(".bt_repondre").attr("href");
                            } else{
                                if(textarea.val() !== "")
                                    textarea.val(textarea.val() + "\n\n" + citation);
                                /*
                                Si on est sur un MP ou la page de réponse d'un topic ET que la valeur du textarea est vide */                            
                                if(($("#reception").is('*') || $(".revenir").is('*')) && textarea.val() === "")
                                    textarea.val(citation);
                            }
                        }
                    })
                ; _.setButton("BTN_CITATION", btn);

                if(textarea.is('*') && $(".revenir").is('*'))
                    textarea.focus();

                if(textarea.is('*') && _.LS_get("citation")){
                    textarea.focus();
                    textarea.val(_.LS_get("citation"));
                    _.LS_rm("citation");
                }

                /*
                On ajoute du CSS pour les citations */
                _.insertCSS(".JVCMaster_POST_CITATION .postContainer{ \
                                background: #E4F5FF; \
                                border: 1px solid #9DDBFF; \
                                border-radius: 6px 6px 0 0 ; \
                                box-shadow : 0 0 10px rgba(0,0,0,0.2); \
                                margin:20px 0 5px; \
                                padding: 5px; \
                                position: relative; \
                            } \
                            .JVCMaster_POST_CITATION .postContainer:first-child{ \
                                margin-top : -5px; \
                            } \
                            .postContainer > .postContainer {\
                                margin-top : 4px \
                            } \
                            .JVCMaster_POST_CITATION .postContainer .CITATION_pseudo, .JVCMaster_POST_CITATION .postContainer .CITATION_date, .JVCMaster_POST_CITATION .postContainer .CITATION_permalink{ \
                                background : #CBECFF; \
                                border: 1px solid #9DDBFF; \
                                height : 13px; \
                                line-height : 13px; \
                                padding : 2px 5px; \
                                position : absolute; \
                            } \
                            .JVCMaster_POST_CITATION .postContainer .CITATION_pseudo{ \
                                border-radius : 6px 0 6px 0; \
                                left : -1px; \
                                top : -1px; \
                            } \
                            .JVCMaster_POST_CITATION .postContainer .CITATION_date{ \
                                border-radius : 0 6px 0 6px; \
                                color : #0C4568; \
                                right : -1px; \
                                top : -1px; \
                            } \
                            .JVCMaster_POST_CITATION .postContainer .CITATION_permalink{ \
                                border-radius : 0 0 6px 6px; \
                                display : none; \
                                left : -1px; \
                                overflow : hidden; \
                                right : -1px; \
                                text-overflow : ellipsis; \
                                top : 100%; \
                                white-space : nowrap; \
                            } \
                            .JVCMaster_MSGBODY { \
                                width: 720px; \
                                overflow: hidden; \
                                float: right; \
                                margin-top: 8px; \
                                padding-top: 10px; \
                                line-height: 1.3em; \
                                background: url(http://image.jeuxvideo.com/css_img/defaut/sep_444.gif) repeat-x left top; \
                            } \
                            .JVCMaster_MSGBODY .postContainer{ \
                                width : 98%; \
                            } \
                            .JVCMaster_POST_CITATION a span{ \
                                left: -9999em; \
                                letter-spacing: -1em; \
                                position: absolute; \
                            } \
                            .JVCMaster_POST_CITATION a i{ \
                                background: url(http://image.jeuxvideo.com/css_img/defaut/liens_tronq.png) right 3px no-repeat; \
                                font-style: normal; \
                                padding-right: 19px; \
                            } \
                            .JVCMaster_POST_CITATION a:hover i{ \
                                background-position-y : -37px; \
                            } \
                            ");

                $(".msg").find(".post:first, .msg_body:first").each(function(){
                    t = $(this);
                    t.css("display", "none");

                    html = t.html();

                    html = html.replace(/(?:<br(?: \/)?>)?(?:\| )((?:Ecrit par « |Citation de )([a-zA-Z0-9_\-\|\]]*)(?: »)?(?:[^<]*))/gi, 
                                        '<div class="postContainer' + (t.attr("class") == "msg_body" ? " JVCMaster_MSGBODY" : '' ) + '">$1')

                                .replace(/»( *<br( \/)?> <br( \/)?>|((?:\n)|<br( \/)?>(?:\n))((\| )*<br>(?:\n)| <br( \/)?>(\| )*(?:\n))*((\| )*&gt; | <br( \/)?>)((\| )*&gt; )?)/g, 
                                        "</div>")
                                
                                .replace(/\| *<a href="([^"]*?)".+>.+<\/a> ?\n? (?:<br(?:\/ )?>(?:\| )*)?<div class="postContainer">/g, 
                                        '<div class="postContainer"><div class="CITATION_permalink"><a href=\'$1\'>$1</a></div>')
                                
                                .replace(/(<div class="postContainer(?: JVCMaster_MSGBODY)?">|<\/div>)(?:Ecrit par « |Citation de (?:")?)([a-zA-Z0-9_\-\[\]]*)(?: »?|(?:")?)? ?, *([^<]*)/gi, 
                                       '$1<div class="CITATION_pseudo"><a href="http://www.jeuxvideo.com/profil/$2.html">$2</a></div><div class="CITATION_date">$3</div>')
                                
                                .replace(/ ?(<br(?: \/)?>)? ?(?:\| )+(« |«&nbsp;)?(?:\|)?/g, 
                                        "<br>")

                                .replace(/(\| )*« |/g,
                                        "")

                                .replace(/<br( \/)?>\n(\| )+/,
                                        "<br>")
                                
                                .replace(/(<\/div>\n) ?<br(?: \/)?> ?/g,
                                        "$1");

                    t.before($("<li>", {
                        "class" : "JVCMaster_POST_CITATION " + (t.attr("class") == "msg_body" ? "JVCMaster_MSGBODY" : "JVCMaster_POST" )
                        , html  : html
                    }));

                    $(".JVCMaster_POST .postContainer").hover(function(){
                        $(this).find(".CITATION_permalink").slideDown(100);
                    }, function(){
                        $(this).find(".CITATION_permalink").slideUp(100);
                    });
                })
            },

            destroy : function(){
                $(".JVCMaster_BTN_CITATION img").remove();
                $(".JVCMaster_POST_CITATION").remove();
                $(".msg").find(".post, .msg_body").show();
            }
        },

        hideposts : {
            id          : "hideposts",
            name        : "HidePosts",
            description : "Cacher des posts et les posts d'un pseudo",
            init : function(){
                $("div[id^=message]").find(".post").after($("<li/>", {
                    "class" : "JVCMaster_POST JVCMaster_POST_HIDDENPOST"
                    , html  : "<b>JVCMaster</b> : <i>Ce message a été caché</i>"
                    , css   : { display : "none" }
                }));

                var postContainers      = $(".msg")
                    , topicContainers   = $("#liste_topics tr:not(:first)")
                    , hiddenPosts       = JSON.parse(_.LS_get("hiddenposts") || "[]")
                    , hiddenPostsPseudo = JSON.parse(_.LS_get("hiddenpostspseudo") || "[]");

                /*
                Timer, sinon, ".JVCMaster_POST_CITATION" ou autre n'apparaissent pas. */
                setTimeout(function(){
                    postContainers.each(function(){
                        var t = $(this);

                        if(t.attr("id") === undefined)
                            return;

                        if(hiddenPosts.indexOf(t.attr("id").replace("message_", "")) !== -1
                        || hiddenPostsPseudo.indexOf(t.find(".pseudo strong").text().toLowerCase()) !== -1){
                            t.find(".post, .JVCMaster_POST").hide();
                            t.find(".JVCMaster_POST_HIDDENPOST").show();
                        }
                    });

                    topicContainers.each(function(){
                        var t           = $(this)
                          , topicTitle  = t.find("td:eq(1) a")
                          , topicPseudo = t.find("td:last").prev().prev().text().toLowerCase()
                        ;


                        if(hiddenPostsPseudo.indexOf(topicPseudo) !== -1){
                            topicTitle.css("color", "#0C4568");
                            topicTitle.html("<b>JVCMaster</b> : <i style='font-weight:normal'>Ce topic a été caché</i>");
                        }
                    });
                }, 10);

                var btn = $("<img />", {
                    title : "Cacher ce post"
                    , src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMEAYAAADkOZvdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wAA/6wAAIMCAACETAAA7XIAADqFAAAdxCRWn50AAALqSURBVHjaZJNfaFt1HMU/39+9jVmMXWVZCSOUIqPOMce1yKgjlDGCSh7GENEJfS4yREcp2odRhoziQzdKKaWKD2NIcVuZY5RZ1m4UQVHR0IcZNJSVlRpCrF0NaWju/f3xocM/23k7Lx8Oh3Nk5c/5eXBOBl0ngBr3TgBQ5DRgyUgC2HChXQe+UDXP5wafqKzc83+1s9Lhzria0TLjTfqHk3vlkgyri2G/rL5253lwbtdc4vwzveCOmYLOELpbxMhRk6Scl+OscY6q9wYFWZakV+eqdKp2r8ud84NYqqXf3TD3o3TzOdMnS5L1Fne94KsZtUoZ7Mcmq0dABqRLDYPqlhEV4KfsK7r2OwEAPxP8dHDm3u4X6Wk/lWqV21JOKhnQadHeqHc5Hqj8Vs/W8b/KuqQkS16OAd1USIMMy3uSJMYEQ3KUNh7TnR9/+EDnOFhd3QjcIjlOyZyEjOpZhlyaVYU3LDeJK0blVVcCKagjsgm08r7MAhm5Lfd5QitfrY3ZLGx9vz0mQ2DfpEII5sNwSbeDm4oWwlZQLiNJAAnUWa8I1GjIdSBglMUnwa6PTmpgfFMyk9B8t3GzYWF7rHm9PgBNq5ei78Bn0OwH0EFkbQrkS5VoKYNUmabjEe3hv+Ao32wLp6Fxpf5Oswjbl7eL7iq41+kD8ENvA8DXg3YEINLhbFgFz6o12wV20sT050Dv/xObs/a0XQC9bK6xAAaTBlCh1wDA5wCA78quFyDcH30TzYHkOBABpmhTTAKwjPtPFTl3BMC9bS888hUAFnZ+wMt07/AP0QVgfdsNwFE3AWCmbQXg1uanBRH49pfCSwCZqfQiQOzZpz4CMCfdPgDpc28BcIlxACnt+fppINVy1/8M3EozH5YAnzoVgPp4ox/w/+h9OAH4rm0n8Z5kWwIgsRzPA3hT3iGA+N1YHkD+mdFv89eAM8SIgXuAJgHkWWcT6KBMFUixjgYOs0ENUFQJAUWaOAA9dAL8PQB4PTdp3o3mAAAAAABJRU5ErkJggg=="
                    , click : function(){
                        var postContainer = $(this).parents(".msg") 
                          , id            = postContainer.attr("id").replace("message_", "")
                          , hiddenPosts   = JSON.parse(_.LS_get("hiddenposts") || "[]")
                        ;

                        if(hiddenPosts.indexOf(id) === -1){
                            postContainer.find(".post, .JVCMaster_POST").slideUp(300);
                            postContainer.find(".JVCMaster_POST_HIDDENPOST").slideDown(300);
                            hiddenPosts.push(id);
                        } else{
                            hiddenPosts.splice(hiddenPosts.indexOf(id), 1);
                            postContainer.find(".JVCMaster_POST_HIDDENPOST").slideUp(300);

                            if(postContainer.find(".JVCMaster_POST_CITATION").is('*'))
                                postContainer.find(".JVCMaster_POST_CITATION").slideDown(300);
                            else
                                postContainer.find(".post").slideDown(300);
                        }

                        _.LS_set("hiddenposts", JSON.stringify($.unique(hiddenPosts)));
                    }
                });
    
                _.setButton("BTN_HIDDENPOST", btn, false);

                btn = $("<img />", {
                    title : "Cacher les posts de ce pseudo"
                    , src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMEAYAAADkOZvdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wAA/6wAAIMCAACETAAA7XIAADqFAAAdxCRWn50AAAMCSURBVHjabI9hSJx1HMc/v//zv/N2qIldy3Is2a6ykuM6xhIRE4kYRzUJoYghFOMYw8QXEm6M3iQiI2SYyIgxLO5FjmGyfDFGLDOJrUmNw1Yd0Zwdyy65rnnq3XPP8/x7sdWC6/PmC1/4fvj9ZPFqS6ExbAwtdHMA1B4ZlQEwZ2RC2vCIM25S5DhqkpwiSbMVUScYVRPWrH7Xm2PZ6zPtrqOUDup09UMyr1al305oGVUvSgp2UHOmdgu8mLPgJrDpZYQ+7rBfPS1zZOSy8qtWaiWsEtYRonJUjVor4uh8VcIXsGbd3lK1PVU4JPWqX9XtuKSlU6WtHnB3un2uB+qQ9bN6FRiTYdmJjvUv/vr9QaLc5W4e5K3PBp977am3ZSFUb/JmTFRNR9VI1R4V30xuDP0VdNKKdg7QAUTIsgs4xXUp4r8nrGO/ecXsg+O/7Z1ufJJ/efn9q9M/fEDHT5Obme03GNno8uadl1iVZTkhKwSUDJEyOZCURCULhGVRzt4XOAPlYPkXuBWxP7SHqeC7Y/nzhTBkDxcGihfBpEvV5W9AmW6pYwnUEatTnQWqZZDJ/yxnidEF0mY+JlAp/n1y8852M/z57Wa0UAtOzm4q3gDNsrdqpsBpcG94X4O06ZO+/nurm6DP+d/xn4ckGf6o9OKmy045Ce5ssam4BOwK5H0hUF6XN25iUDxux+wLYK/Yp0tdlYLnj9W8GZiu7E0TPWYMZMnETfR+r1igx4TBmS+1lzSUolu5rXOVgsCQLqon/ufkfeYC48AV0wlAFhsHNHGTYxUMZsLcBjKm1Sj4aObxjYcfgGvXCj8WZ2DvcGC37zq8d+WxZ+ubYe0ru8+dgUe6q4b1GPg/t6ZkBYigaAH54tNn1h49TMjnFyUXzc3SC+YT40dva6/gpSDX5FzyBtEmQYYCOvC6yksEttNe3lwGTpp1tuDBbl+vOg11c1avCoH889Hily1rjQ0MoNBocwuHIBBnHQ/YzW0cIMQ6QSBCDg9QZCUAKBpMEYBWbIC/BwCMhjqxWSOhnwAAAABJRU5ErkJggg=="
                    , click : function(){
                        var postContainer     = $(this).parents(".msg") 
                          , pseudoToHide      = postContainer.find(".pseudo strong").text().toLowerCase()
                          , hiddenPostsPseudo = JSON.parse(_.LS_get("hiddenpostspseudo") || "[]")
                          /*
                          Sinon, dans la boucle, ça renvoit true/false 1 fois sur 2 */
                          , postsAreToHide    = (hiddenPostsPseudo.indexOf(pseudoToHide) === -1 ? true : false) 
                        ;

                        postContainers.each(function(){
                            var t      = $(this)
                              , pseudo = t.find(".pseudo strong").text().toLowerCase()
                            ;
                                if(pseudoToHide == pseudo){
                                    if(postsAreToHide){
                                        t.find(".post, .JVCMaster_POST").slideUp(300);
                                        t.find(".JVCMaster_POST_HIDDENPOST").slideDown(300);

                                        hiddenPostsPseudo.push(pseudoToHide);
                                    }
                                    else{
                                        t.find(".JVCMaster_POST").slideUp(300);
                                        if(t.find(".JVCMaster_POST_CITATION").is('*'))
                                            t.find(".JVCMaster_POST_CITATION").slideDown(300);
                                        else
                                            t.find(".post").slideDown(300);

                                        hiddenPostsPseudo.splice(hiddenPostsPseudo.indexOf(pseudoToHide), 1);
                                    }
                                }
                            
                        })

                        _.LS_set("hiddenpostspseudo", JSON.stringify(hiddenPostsPseudo));

                    }
                });
    
                _.setButton("BTN_HIDDENPOSTSPSEUDO", btn, false);
            },

            destroy : function(){
                $(".JVCMaster_BTN_HIDDENPOST img").remove();
                $(".JVCMaster_BTN_HIDDENPOSTSPSEUDO img").remove();

            }
        },

        /*
        A voir plus tard */
        /* friendlist : {
            id : "friendlist",
            name : "Liste d'amis",
            description : "Gerez une liste d'amis",
            init : function(){
                var BTN_FRIENDLIST = $("<a/>", {
                    text : "JVCMaster : Liste d'amis"
                });
                BTN_FRIENDLIST.appendTo($("<td>").prependTo($("table#connexion tbody tr")));

                setTimeout(function(){
                    BTN_FRIENDLIST.appendTo($("<li>").prependTo($("div#log ul")));
                }, 1001);
            },
            destroy : function(){
                
            }
        },*/

        shortcuts : {
            id          : "shortcuts",
            name        : "Raccourcis",
            description : "Des raccourcis sont ajoutés",
            init : function(){
                if(_.onMp())
                    return;
                /*
                Bouton MP */
                _.insertCSS(".JVCMaster_BTN_MP span { \
                                cursor : pointer; \
                                display: inline-block; \
                                height: 10px; \
                                background: url(http://image.jeuxvideo.com/css_img/defaut/mprives/enveloppe.png) no-repeat top right; \
                                width: 16px; \
                            }");

                $(".pseudo strong").each(function(){
                    var pseudo = $(this);

                    var btn = $("<a/>", {
                        title : "Envoyer un mp à " + pseudo.text(),
                        href  : "http://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=" + pseudo.text(),
                        css   : {
                            background: "url(http://image.jeuxvideo.com/css_img/defaut/mprives/enveloppe.png) no-repeat top right"
                            , width   : "16px"
                            , display : "inline-block"
                            , height  : "10px"
                        }
                    });

                    btn.appendTo(pseudo.parents(".msg").find(".JVCMaster_BTN_MP"));
                });

                /*
                Derniere page lors du clic sur l'"icône" du topic*/
                $("#liste_topics tr:not(:first)").each(function(){
                    var t         = $(this)
                      , icon      = t.find("td:first").find("img")
                      , href      = t.find("td:eq(1) a").attr("href")
                      , nbMessage = parseInt(t.find("td:last").prev().text()) + 1
                    ;

                    icon.wrap($("<a/>", {
                        href : href.replace(/(http:\/\/www.jeuxvideo.com\/forums\/|http:\/\/.*\.forumjv.com\/)([0-9]+\-)([0-9]+\-)([0-9]+\-)([0-9]+\-)/, "$1$2$3$4" + Math.ceil(nbMessage / 20) + '-'),
                        /*
                        Bug sur les forumJV */
                        css : {
                            display : "inline-block",
                            width   : "16px"
                        }
                    }));
                });
            },
            destroy : function(){
                $(".JVCMaster_BTN_MP a").remove();
            }
        },

        showcdv : {
            id : "showcdv",
            name : "Show CDV",
            description : "Affiche la CDV dans une lightbox",
            init : function(){
                var targetClick = $("a[target=profil], .pseudo > a, .CITATION_pseudo a").click(function(e){
                    if(!_.isJVC())
                        return; 

                    $.colorbox({
                        iframe     : true, 
                        href       : $(this).attr("href"), 
                        width      : "830px", 
                        height     : "81%",
                        onComplete : function(){
                            /*
                            Le temps que l'iframe se charge completement */
                            setTimeout(function(){
                                $("#cboxLoadedContent iframe").on("load", function(){  
                                    var tFrame = $(this)
                                      , tabs   = tFrame.contents().find("#onglets")
                                    ;

                                    tabs.find("li").click(function(e){
                                        var t = $(this);

                                        if(t.find('a').is('*'))
                                            tFrame.attr("src", t.find('a').attr("href"));

                                        return false;
                                    });
                                });
                            }, 30);
                        }
                    });

                    return false;
                })
            },
            destroy : function(){
                $("a[target=profil]").unbind("click");
            }
        },

        hightlightpemt : {
            id          : "hightlightpemt",
            name        : "Surlign'PEMT",
            description : "Les posts \"PEMT\" sont surlignés",
            init : function(){
                _.insertCSS(".JVCMaster_PEMT_time{ font-size : 11px}");
                var formatDate = function(date){ if(!date.is('*')) return; return date.text().match("([0-9]*[a-z]* [a-zûé]* [0-9]{4} à [0-9]{2}:[0-9]{2}:[0-9]{2})")[1]}
                  , dates = $(".date");

                dates.each(function(k){
                    var date     = $(dates[k])
                      , prevDate = $(dates[k - 1])
                    ;

                    if(formatDate(date) == formatDate(prevDate)){
                        date.html(date.html().replace(/([0-9]{2}:[0-9]{2}:[0-9]{2})/g, "<span class='JVCMaster_PEMT_time'>$1</span>"));
                        prevDate.html(prevDate.html().replace(/([0-9]{2}:[0-9]{2}:[0-9]{2})/g, "<span class='JVCMaster_PEMT_time'>$1</span>"));
                    }
                });  
            },
            destroy : function(){
                var dates = $(".date");
                dates.each(function(){
                    var date = $(dates);
                    date.html(date.html().replace(/(<span class='JVCMaster_PEMT_time'>)*<span class='JVCMaster_PEMT_time'>([0-9]{2}:[0-9]{2}:[0-9]{2})<\/span>(<\/span>)*/g, "$2"));
                })
            }
        },

        hightlightpermapost : {
            id          : "hightlightpermapost",
            name        : "Surlign'perma-post",
            description : "Les posts \"permanents\" sont surlignés",
            init : function(){
                var hash = window.location.hash;

                scrollTo = function(el){el = $(el);if(el.is('*')){ el.addClass("JVCMaster_highlightedPost"); $("body").animate({ scrollTop : el.offset().top - 50 }, 500, function(){ el.stop().animate({ backgroundColor : "#FFF9D0" }, 500) }); }}

                if(hash !== "" && hash !== "#last_msg"){
                    setTimeout(function(){
                        scrollTo(hash);
                    }, 100);
                }

                $(".ancre a").click(function(e){
                    var t    = $(this)
                      , href = t.attr("href").match("(#.*)$")[0]
                      , post = href
                    ;

                    if($(post).is('*')){
                        var highlightedPost = $('.JVCMaster_highlightedPost');
                        highlightedPost.removeClass("JVCMaster_highlightedPost");
                        highlightedPost.animate({ backgroundColor : "#EFF4FC" }, 500);
                        scrollTo(post);
                    }
                });
            },
            destroy : function(){
                var highlightedPost = $('.JVCMaster_highlightedPost');
                
                highlightedPost.css("backgroundColor", "").removeClass("JVCMaster_highlightedPost");
                $(".ancre a").unbind("click");
            }
        },
        
        favoritestopics : {
            id          : "favoritestopics",
            name        : "Topics préférés",
            description : "Epinglez vos topics préférés",
            init : function(){
                _.insertCSS("#JVCMaster_FavoritesTopics li{ \
                                position : relative; \
                            } \
                            #JVCMaster_FavoritesTopics li .JVCMaster_BTN_RMFAVORITESTOPIC{ \
                                background : url(http://image.jeuxvideo.com/css_img/defaut/bt_forum_supp_pref.png) no-repeat top left; \
                                cursor : pointer; \
                                display : none; \
                                height : 10px; \
                                position : absolute; \
                                right : 0; \
                                top : 2px; \
                                width : 10px; \
                            } \
                            #JVCMaster_FavoritesTopics li a:first-child{ \
                                display: inline-block; \
                                overflow: hidden; \
                                text-overflow: ellipsis; \
                                width: 270px; \
                                white-space: nowrap; \
                            } \
                            #JVCMaster_FavoritesTopics li:hover .JVCMaster_BTN_RMFAVORITESTOPIC{ \
                                display : inline-block; \
                            } \
                            #JVCMaster_FavoritesTopics .JVCMaster_BTN_RMFAVORITESTOPIC:hover{ \
                                background-position : bottom left; \
                            }");

                html =  "<h3 class=\"titre_bloc\"><span>Mes topics préférés</span></h3>";
                html += "<div class=\"bloc_inner\">";
                html += "<ul class=\"liste_liens\">";
                html += "</ul>";
                html += "</div>"

                // Box en dessous des forums préférés
                $("div.bloc3:first").after(
                    $("<div>", {
                        id : "JVCMaster_FavoritesTopics",
                        "class" : "bloc3",
                        html : html
                    })
                );

                (listFavoritesTopics = function(){
                    var favoritesTopics = JSON.parse(_.LS_get("favoritesTopics") || "{}");
                    $("#JVCMaster_FavoritesTopics ul").slideUp(250, function(){
                        $(this).find("li").remove();
                    
                        for(topic in favoritesTopics){
                            var split     = topic.split("|||")
                              , forumName = split[0]
                            ;
                            split.shift();

                            var topicName = split.join("|||")
                              , topicUrl  = favoritesTopics[topic]["topicUrl"]
                            ;

                            $("<a/>", {
                                href : topicUrl,
                                title : topicName,
                                html : "<b class='JVCMaster_FavoritesTopics_forumName'>" + forumName + "</b> : <span class='JVCMaster_FavoritesTopics_topicName'>" + topicName + "</span>"
                             }).after($("<a/>", {
                                "class" : "JVCMaster_BTN_RMFAVORITESTOPIC",
                                click : function(){
                                    var t         = $(this)
                                      , forumName = t.prev().find(".JVCMaster_FavoritesTopics_forumName").text()
                                      , topicName = t.prev().find(".JVCMaster_FavoritesTopics_topicName").text()
                                    ;

                                    delete favoritesTopics[forumName + "|||" + topicName];
                                    _.LS_set("favoritesTopics", JSON.stringify(_.sortObject(favoritesTopics)));
                                    listFavoritesTopics();
                                }
                             })).appendTo($("<li>").appendTo("#JVCMaster_FavoritesTopics ul"));
                        }

                        $("#JVCMaster_FavoritesTopics ul").delay(100).slideDown(250);

                    });
                })();

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
                        "class" : "JVCMaster_BTN_FAVORITESTOPIC",
                        title   : "Epingler ce topics à vos topics préférés",
                        src     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAIAQMAAAARA0f2AAAABlBMVEX///+ZzADAT8hDAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfcCBsMAieAZsMmAAAAGklEQVQI12MoZ2D43wBF9QwMdgwMMgwMHAwAXZcF1pKKg9EAAAAASUVORK5CYII=",
                        css     : {
                            cursor : "pointer",
                            marginLeft : "5px",
                        },
                        title : "JVCMaster : ajouter ce topic à vos topics favoris",
                        click : function(){
                            var favoritesTopics = JSON.parse(_.LS_get("favoritesTopics") || "{}")
                              , topicUrl        = location.href.replace(/(http:\/\/www.jeuxvideo.com\/forums\/)(?:[0-9])-((?:[0-9]*)-(?:[0-9]*)-)(?:[0-9]*)-(.*)(#form_post)?/g, "$11-$21-$3")
                              , topicName       = $(".bloc_forum .sujet:first").text()
                              , topicName       = $.trim(topicName.substr(10).substr(0, topicName.length - 12))
                              , forumName       = $.trim($(".bloc_forum h3:first").text().replace("Forum : ", ""))

                            favoritesTopics[forumName + "|||" + topicName] = {
                                topicUrl : topicUrl
                            }

                            _.LS_set("favoritesTopics", JSON.stringify(_.sortObject(favoritesTopics)));

                            listFavoritesTopics();
                            
                        }
                    })
                );
            },
            destroy : function(){
                $("#JVCMaster_FavoritesTopics").remove();
                $(".JVCMaster_BTN_FAVORITESTOPIC").remove();
            }
        },

        visionoelshack : {
            id          : "visionoelshack",
            name        : "Visionneuse d'image NoelShack",
            description : "Visionner directement les images NoelShack",
            init : function(){
                setTimeout(function(){
                    $("a[href^=http\\:\\/\\/www\\.noelshack\\.com], a[href^=http\\:\\/\\/image\\.noelshack\\.com]").click(function(e){

                        var t        = $(this)
                          , pageUrl  = t.attr("href")
                          , imageUrl = pageUrl
                        ;

                        imageUrl = pageUrl.replace(/http:\/\/www\.noelshack.com\/([0-9]{4})\-([0-9]*)\-([0-9]*)\-(.*)/, "http://image.noelshack.com/fichiers/$1/$2/$3-$4")
                        $.colorbox({
                            photo       : true
                            , href      : imageUrl
                            , title     : "<a href='" + imageUrl + "' style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap'>" + imageUrl + "</a>"
                            , maxHeight : "95%"
                            , maxWidth  : "95%"
                        });
                        
                        e.preventDefault();
                    });
                }, 10);
            },
            destroy : function(){
                $("a[href^=http\\:\\/\\/www\\.noelshack\\.com], a[href^=http\\:\\/\\/image\\.noelshack\\.com]").unbind("click");
            }
        }
    };
}


var script = document.createElement("script");
script.appendChild(document.createTextNode("(JVCMaster = " + JVCMaster.toString() +")();\nJVCMaster = new JVCMaster(); JVCMaster.init();"));
(document.body || document.head || document.documentElement).appendChild(script)
