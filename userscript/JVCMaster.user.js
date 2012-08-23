// ==UserScript==
// @name        JVCMaster Userscript
// @namespace   jvcmaster
// @description Ajoute des fonctionnalités aux forums de Jeuxvideo.com
// @updateURL   https://github.com/Kocal/JVCMaster/raw/master/JVCMaster.user.js
// @include     http://www.jeuxvideo.com/forums/*
// @include     https://www.jeuxvideo.com/forums/*
// @exclude     http://www.jeuxvideo.com
// @exclude     https://www.jeuxvideo.com
// @version     1.0
// ==/UserScript==
var url = 'https://raw.github.com/Kocal/JVCMaster/master/userscript/';
// var url = 'http://localhost/';
var script = document.createElement('script');
    script.src = url + 'JVCMaster_Core.js';
document.body.appendChild(script);


delete script;