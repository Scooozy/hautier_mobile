import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, AlertController, Events, MenuController,
  ToastController
} from 'ionic-angular';
import * as $ from 'jquery';
import { ContentserviceProvider } from "../../providers/contentservice/contentservice";
import { Toast } from '@ionic-native/toast';
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { ContactServiceProvider } from "../../providers/contact-service/contact-service";
import {Platform} from "ionic-angular";
import {HomeServiceProvider} from "../../providers/home-service/home-service";
import {AppVersion} from "@ionic-native/app-version";

@IonicPage()
@Component({
  selector: 'page-connexion',
  templateUrl: 'connexion.html',
})
export class ConnexionPage {
  result: any;
  user_fcm: any = [];
  //Variable pour afficher le mot de passe
  private type = 'password';
  private showPass = false;
  condition: boolean;
  private login: any;
  private mdp: any;

   constructor(private storage: Storage, public navCtrl: NavController, public contactSrv: ContactServiceProvider,
               private menu: MenuController,public toast: Toast,public statusBar:StatusBar,
               public sqliteSrv: SqliteServiceProvider, public navParams: NavParams, private ev: Events,
               public alertCtrl: AlertController, public content:ContentserviceProvider, public platform : Platform,
               private homeSrv: HomeServiceProvider, private appVersion: AppVersion, private toastCtrl: ToastController) {
     $("ion-footer").css("display", "none");
     $("ion-header").css("display", "none");
     this.sqliteSrv.disconnectContact();
     this.sqliteSrv.disconnectEnt();
     this.menu.swipeEnable(false);

     this.storage.get('fcm').then(fcm => {
       if(fcm) {
         this.contactSrv.deleteFCM(fcm).subscribe(data => {
           console.log("in subcribe delete fcm");
         });
       }
     });

   }

   ionViewDidLoad() {
      $("#login, #password").focusin(function(){
        $('#bottom-element').hide();
      });
      $("#login, #password").focusout(function(){
        $('#bottom-element').show();
      });
   }

   //Function pour afficher de l'aide
   public displayHelp() {
     let alert = this.alertCtrl.create({
       title: 'Aide',
       message: "<p id='intro-connect'>Saisissez votre identifiant et mot de passe pour vous connecter</p>"+
                "<p id='intro-connect'>Si vous n'avez pas de compte ou d'entreprise veuillez soumettre une demande de création de compte ou d'entreprise.</p>",
       buttons: ['Fermer']
     });
     alert.present();
   };

  private trackConnecting(user){
    this.appVersion.getVersionNumber().then(data => {
      let params = [];
      let phone;
      if(this.platform.is('ios')){
        phone = 'ios';
      }else{
        phone = 'android';
      }
      params.push({
        user_id: user,
        phone: phone,
        appversion: data
      });
      this.homeSrv.trackConnecting((JSON.stringify(params))).then(data => {});
    });
  }

   //Function pour valider la connexion
   public confirmConnect(){
     var login = this.login;
     var mdp = this.mdp;

     var self = this;
     this.content.getConnect(login, mdp).subscribe(data => {
       this.result = data;
       if(this.result[0].condition){
         this.trackConnecting(this.result[0].id);
         this.sqliteSrv.saveConnectContact(1,this.result[0].id,1);
         this.storage.get('fcm').then(fcm => {
           if(fcm) {
             this.user_fcm.push({
               id_user: this.result[0].id,
               code_fcm: fcm
             });
             var params = [];
             params.push({
               id_user: this.result[0].id,
               code_fcm: fcm
             });
             this.contactSrv.postFCM(JSON.stringify(params)).then(data =>{
               let response = data;
               if(response != null){
                 let alert = this.alertCtrl.create({
                   title: 'Oups...',
                   message: "L'envoi de la réponse a connu un problème...",
                   buttons: ['Fermer']
                 });
                 alert.present();
               }
             });
           }
         });

         var load = setInterval(function () {
           self.navCtrl.setRoot('home-home', {
             origin: 'connect'
           });
           clearInterval(load);
         },500);
       }else{
         let toast = this.toastCtrl.create({
           message: this.result[0].error,
           duration: 3000,
           position: 'bottom'
         });
         toast.present();
       }
     });
   }

   //Permet la création d'un nouveau compte
   public addAccount(id){
     this.navCtrl.setRoot('InscriptionPage',{
       'param' : id
     })
   }

   //Lors de l'oubli de mot de passe
   public forgotPasssword(){
     this.navCtrl.setRoot('ForgotPwdPage',{});
   }

    //Lors de l'oubli de mot de passe
    public forgotID(){
        this.navCtrl.setRoot('ForgotIdPage',{});
    }

   //Permet de cacher et montre le mot de passe
   public showPassword() {
     this.showPass = !this.showPass;
     if(this.showPass){
       this.type = 'text';
     } else {
       this.type = 'password';
     }
   }

   public addUserAccount(){
       this.navCtrl.setRoot('SlidePage');
   }

 }
