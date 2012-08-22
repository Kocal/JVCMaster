var buttonOptions = $('<a/>', {
    href : '#',
    text : 'JVCMaster : comptes JVC',
    click : function(e){
        
        $('<h2/>', {
            'class' : 'titre_page',
            html : '<span>JVCMaster : Configuration</span>'
        }).appendTo('#JVCMaster_LightBox_popup');

        $('<div class="bloc_forum"><h3><span class="txt">Configuration des comptes utilisateurs</span></h3><div class="bloc_inner"><ul id="JVCMaster_UserAccountsConfiguration" class="liste_liens">').appendTo('#JVCMaster_LightBox_popup');

        $('<li>', {
            css : {
                textAlign : 'left',
                fontSize : '95%',
                borderBottom : '1px solid rgb(237, 237, 237)',
                verticalAlign : 'top',
            },
            html : "Nom d'utilisateur : <input type='text' name='JVCMaster_UserAccounts_username' style='padding : 2px; font-size: 95%;height: 10px; width:112px; vertical-align: top; border: 1px solid rgb(51, 51, 51);box-shadow: inset 1px 1px 1px rgb(153, 153, 153);border-radius: 2px;' /> - Mot de passe : <input type='password' name='JVCMaster_UserAccounts_password' style='padding: 2px;font-size: 95%;height: 10px; width:112px; vertical-align:top; border: 1px solid rgb(51, 51, 51); box-shadow: inset 1px 1px 1px rgb(153, 153, 153); border-radius: 2px;'/><input type='button' value='Se connecter' style='font-size: 95%;height: 16px; padding:0'>"
        }).appendTo('#JVCMaster_UserAccountsConfiguration');

        $('#JVCMaster_LightBox_popup').css({padding : '0 5px'});
        JVCMaster.LightBox.show(500);
        e.preventDefault();
    }
});

buttonOptions.appendTo($('<td id="JVCMaster_buttonOptions">').prependTo('table#connexion tbody tr'));
