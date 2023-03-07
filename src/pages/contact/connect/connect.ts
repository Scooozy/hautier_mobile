import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { SqliteServiceProvider } from "../../../providers/sqlite-service/sqlite-service";
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-connect-contact',
  templateUrl: 'connect.html'
})

export class ConnectContactPage {
  result: any;
  login: any;
  mdp: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public sqliteSrv: SqliteServiceProvider,
              public toast: Toast, public contactSrv: ContactServiceProvider) {

    var load = setInterval(function () {
      if($('#header-co-fp').width() != undefined){
        clearInterval(load);
        $('#triangle-bottomright-co').css('border-left',$('#header-co-fp').width()+'px solid transparent');
      }
    },100);

  }

  public scrollToMe() {
    $('.scroll-content').animate({
      scrollTop: $("#login").offset().top
    }, 1000);
  };

  public displayHelp() {
    let alert = this.alertCtrl.create({
      title: 'Aide',
      message: "<p id='intro-connect'>Saisissez votre identifiant et mot de passe pour vous connecter à votre Portail Citoyens</p><p>Veuillez vous connecter une première fois au Portail Citoyens sur le site internet avant votre première connexion sur l'application</p>",
      buttons: ['Fermer']
    });
    alert.present();
  };

  public confirmConnect(){
    var login = this.login;
    var mdp = this.mdp;
    var self = this;
    this.contactSrv.getConnected(login, mdp).subscribe(data => {
      this.result = data;
      if(this.result[0].condition){
        this.sqliteSrv.saveConnectContact(1,this.result[0].id,0);
        var load = setInterval(function () {
          self.navCtrl.setRoot('contact-home', []);
          clearInterval(load);
        },500);
      }else{
        //Identifiants incorrects
        this.toast.show('Identifiants incorrects.', '5000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }
    });
  }

}
