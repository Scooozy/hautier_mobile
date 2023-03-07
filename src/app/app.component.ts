import { Component, ViewChild, Renderer2 } from '@angular/core';
import { Nav, Platform  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SqliteServiceProvider } from '../providers/sqlite-service/sqlite-service';
import { HomeServiceProvider } from '../providers/home-service/home-service';
import { AnnuaireServiceProvider } from '../providers/annuaire-service/annuaire-service';
import {Keyboard} from '@ionic-native/keyboard';
import {Events} from "ionic-angular";
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { FCM } from '@ionic-native/fcm';
import * as $ from 'jquery';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import {ContentserviceProvider} from "../providers/contentservice/contentservice";
import {ToastController} from "ionic-angular";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import {AppVersion} from "@ionic-native/app-version";
import { Gesture } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private gesture: Gesture;
  @ViewChild('image') element;

  image : string = "";
  rootPage: any = 'home-home';
  nameOnglet: string;
  pages: Array<{title: string, component: any, fsc: boolean, id_ent: number, class: string}> = [];
  isselect: boolean;
  categ: any;
  diamonds: any = [];
  user: any;
  admin:boolean=false;
  tuiles:any=[];
  admin_ent: any;
  admin_n1: any;
  cli: any = [];
  dataNotification: any;
  ent_selected: number;
  footerMenu: any = [];

  constructor(private storage: Storage, public Sqlite: SQLite, public platform: Platform, public statusBar: StatusBar,
              public keyboard: Keyboard, public splashScreen: SplashScreen, private events : Events,
              public sqlite : SqliteServiceProvider, private push: Push, public homeSrv:HomeServiceProvider,
              public annuaireSrv : AnnuaireServiceProvider, private contentSrv: ContentserviceProvider,
              public toastCtrl : ToastController, public renderer2: Renderer2, public fcm: FCM,
              private androidPermission: AndroidPermissions, private appVersion: AppVersion,
              private localNotif : LocalNotifications) {

    this.initializeApp();

    this.platform.registerBackButtonAction(() => {
      let view = this.nav.getActive();
      if(view.component.name == 'HomePage'){
        this.platform.exitApp();
      }else{
        this.nav.setRoot('home-home');
      }
    },1);
  }

  ionViewDidLoad(){
    //create gesture obj w/ ref to DOM element
    this.gesture = new Gesture(this.element.nativeElement);

    //listen for the gesture
    this.gesture.listen();

    //turn on listening for pinch or rotate events
    this.gesture.on('pinch', e => this.pinchEvent(e));
  }

  private pinchEvent(event) {
      console.log(event);
  }

  //Init pour la premiere connexion
  initializeApp() {

    this.platform.ready().then(() => {
      this.androidPermission.requestPermissions([
        this.androidPermission.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]);
      this.keyboard.disableScroll(false);
      this.keyboard.hideKeyboardAccessoryBar(false);
      let html = document.getElementsByTagName('html').item(0);
      this.keyboard.onKeyboardHide().subscribe(() => {
        this.renderer2.setStyle(html,'height','101vh');
      });
      this.keyboard.onKeyboardShow().subscribe((e)=>{
        this.renderer2.setStyle(html,'height','auto');
      });
      //this.keyboard.hideFormAccessoryBar(false);
      this.statusBar.styleLightContent();
      this.sqlite.createTable();
      var self = this;
      this.localNotif.on('click').subscribe(notification => {
        self.notifAction(notification);
      });
      this.pushSetup();
      this.splashScreen.hide();
      this.backToHome();

      this.listenLoginEvent();
      this.prepareMenu();

      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          console.log("%cWe have permission to send push notifications", "color: black; font-style: italic; background-color: GreenYellow;padding: 2px");
        } else {
          console.log("%cWe do not have permission to send push notifications", "color: black; font-style: italic; background-color: Crimson;padding: 2px");
        }
      });

      this.pages = [];
      this.cli = [];
    });
  }

  private prepareMenu(){
    this.platform.registerBackButtonAction(() => {
      this.nav.setRoot('home-home');
    },1);

    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', []).then(res => {
        if (res.rows.length != 0) {
          if (res.rows.item(0).connected == 0) {
            this.goToConnectPage(0);
          }else{
            this.user = res.rows.item(0).id_user;
            this.loadMenu(this.user);
          }
        } else {
          this.goToConnectPage(0);
        }
      });
    });
  }

  private goToConnectPage(opt){
    this.nav.setRoot('ConnexionPage', {});
  }

  private listenLoginEvent(){
    let self = this;
    this.events.subscribe("user:connected",() =>{
      self.prepareMenu()
    });
  }

  public closeImg(){
    $('.img_full_size').fadeOut();
    $('.img_full_size').find('.img_post_info').find('.name').text('');
    $('.img_full_size').find('.img_post_info').find('.desc').text('');
    $('.img_full_size').find('.img_box').find('img').attr('src','');
  }

  private loadMenu(user){
    this.annuaireSrv.GetMyEntClient(user).subscribe(data => {
      this.annuaireSrv.GetMenuClient(user).subscribe(data1 => {
        if(user != '' && user != null && user != 0) {
          this.trackOpeningApp(user);
        }
        if(this.pages.length == 0){
          this.pages.push({title: 'Accueil', component: 'home-home', fsc: false, id_ent: null, class: ''});
          this.pages.push({title: 'Mon profil', component: 'place-detail', fsc: false, id_ent: null, class: 'profil'});
          this.pages.push({title: "Paramètres de l'application", component: 'ParamettrePage', fsc: false, id_ent: null, class:''});
          this.contentSrv.getAdminEntUser(this.user).subscribe(res =>{
            /*for(var ii = 0; ii < res.length; ii++){
              if(res[ii].niveau2 == 1){
                  //this.pages.push({title: "Mes clubs", component: AdhesionPage, fsc: false, id_ent: null, class:''});
                  this.pages.push({title: 'Paramétrer mon service', component: AdminPage, fsc: false, id_ent: null, class: 'parament'});
                this.admin_ent = res[ii].id_ent;
              }else if(res[ii].niveau1 == 1){
                this.pages.push({title: 'Paramétrer ma filiale', component: AdminPage, fsc: false, id_ent: null, class: 'paramn1'});
                this.admin_n1 = res[ii].id_ent;
                this.contentSrv.getNewEnt(this.user).subscribe(res =>{
                  if(res.length != 0){
                    $('#side-menu-right, ion-menu .paramn1').append("<div class='pastille'></div>");
                  }
                });
              }
            }*/
            var id_ent;
            for (var i = 0; i < data.length; i++) {
            }
            for (i = 0; i < data1.length; i++) {
              var inspect = true;
              for(var u = 0; u < data.length; u++){
                if(data1[i].cli == data[u].id_e){
                  inspect = false;
                }
              }
              if(inspect){
                id_ent = parseInt(data1[i].cli);
                this.cli.push({title: data1[i].title, component: 'home-home', fsc: false, id_ent: id_ent, img: data1[i].image, class: 'cli'});
              }
            }

            this.Sqlite.create({
              name: 'ionicdb.db',
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('SELECT * FROM ent_selected', {}).then(res => {
                if (res.rows.length != 0) {
                  $('.item-cli').removeClass('cli-selected');
                  $('.cli-'+res.rows.item(0).id_ent).addClass('cli-selected');
                  this.ent_selected = res.rows.item(0).id_ent;
                } else {
                  $('.item-cli').removeClass('cli-selected');
                  $('.cli-'+id_ent).addClass('cli-selected');
                  this.ent_selected = id_ent;
                }
                this.homeSrv.getFooterMenu(this.ent_selected).subscribe(items =>{
                  this.footerMenu = [];
                  for(var i = 0; i < items.length; i++){
                    this.footerMenu.push({
                      id: items[i].id,
                      icon: items[i].icon
                    })
                  }
                });
              });
            });
            this.pages.push({title: 'Didactitiel', component: 'DidactitielPage', fsc: false, id_ent: null, class: ''});
            this.pages.push({title: 'CGU', component: 'CguPage', fsc: false, id_ent: null, class: ''});
            this.pages.push({title: 'Déconnexion', component: 'ConnexionPage', fsc: false, id_ent: null, class: 'logout'});
            /*this.contentSrv.getNewUserEnt(this.user).subscribe(res =>{
              if(res.length != 0){
                $('#side-menu-right, ion-menu .parament').append("<div class='pastille'></div>");
              }
            });*/
          });
        }
      });
    });
  }

  private trackOpeningApp(user){
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
      this.homeSrv.trackOpeningApp((JSON.stringify(params))).then(data => {});
    });
  }

  pushSetup(){
    const options: PushOptions = {
      android: {
        senderID:'714756472177'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };

    const pushObject: PushObject = this.push.init(options);
    pushObject.on('registration').subscribe((registration: any) =>{
      this.storage.set('fcm', registration.registrationId);
    });

    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        switch (data.type) {
          case "messagerie" :
            this.nav.setRoot('DetaildemContactPage',{
                param: data.param,
                id_sender:data.id_sender,
                id_receiver:data.id_receiver,
                type: data.messagerie,
                origin: "messagerie",
                name: name
            });
            break;
          case "rdv" :
            this.nav.setRoot('event-detail', {
                idEvent: data.id_event,
                type : 'rdv',
                originPage: "rendez-vous"
            });
            break;
          case "news" :
            this.nav.setRoot('news-list', {
              typeActu: data.option
            });
            break;
          case "post" :
            this.nav.setRoot('news-list', {
                typeActu: data.type_actu
            });
            break;
          case "sondage" :
            this.nav.setRoot('RepondreContactPage', {
                param : data.id_sondage
            });
        }
      } else {
        var rootParams;
        switch (data.type) {
          case "messagerie" :
            rootParams = {
              param: data.param,
              id_sender:null,
              id_receiver:null,
              type: data.messagerie,
              origin: "messagerie",
              name: data.title
            }
            this.displayLocalNotif(data,'DetaildemContactPage',rootParams);
            break;
          case "rdv" :
            rootParams = {
              idEvent: data.id_event,
              type : 'rdv',
              originPage: "rendez-vous"
            }
            this.displayLocalNotif(data,'event-detail',rootParams);
            break;
          case "news" :
            rootParams = {
              typeActu: data.option
            }
            this.displayLocalNotif(data,'news-list',rootParams);
            break;
          case "post" :
            rootParams = {
              typeActu: data.type_actu
            }
            this.displayLocalNotif(data,'news-list',rootParams);
            break;
          case "sondage" :
            rootParams = {
              param : data.id_sondage
            }
            this.displayLocalNotif(data,'RepondreContactPage',rootParams);
            break;
        }
        /*this.dataNotification = [];
        this.storage.set('nbNotif', 1 );
        let toast : any;
        if(data.type == "messagerie" || data.type == "rdv"){
          toast = this.toastCtrl.create({
            message: 'Vous avez reçu un message de '+data.title,
            duration: 5000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: "Voir"
          });
        } else if(data.type == "sondage" || data.type == "rdv"){
          toast = this.toastCtrl.create({
            message: "Un nouveau sondage est disponible.",
            duration: 5000,
            position: 'bottom'
          });
        } else {
          toast = this.toastCtrl.create({
            message: 'Vous avez reçu un message de '+data.title,
            duration: 5000,
            position: 'bottom',
            showCloseButton: true
          });
        }

        let duration:number = 5000;
        let elapsedTime:number = 0;
        let intervalHandler = setInterval( () => { elapsedTime += 10; },10);

        if(data.message == 'Nouvelle demande de rendez-vous.' || data.message == 'Réponse au rendez-vous.'){
            toast.onDidDismiss((data, role) => {
                if (role == "close") {this.nav.setRoot('RendezVousEventPage');}
                this.storage.set('nbNotifrdv', 1 );

            });
        }else if(data.type == "sondage"){
          toast.onDidDismiss((data, role) => {
            if (role == "close") {this.nav.setRoot('RepondreContactPage');}
          });
        }else{
            this.storage.set('nbNotif', 1 );
            this.storage.set('nbNotifmsg', 1 );
            toast.onDidDismiss((data, role) => {
                if (role == "close") {this.nav.setRoot('DemandesContactPage');}
            });

            let view = this.nav.getActive();
            if(view.component.name == 'DemandesContactPage'){
                this.nav.setRoot('DemandesContactPage');
            }

        }
        toast.present();*/
      }
    });


      //Réception d'un notification
      /*pushObject.on('notification').subscribe((notification: any) =>{
          //if(this.platform.is('ios')){
              this.fcm.onNotification().subscribe(data => {
                  console.log(data);
              });
              if(!notification.additionalData.foreground){
                  //alert('NINJA');
                  switch (notification.additionalData.type) {
                      case "messagerie" :
                          this.nav.setRoot('DetaildemContactPage',{
                              param: notification.additionalData.param,
                              id_sender:notification.additionalData.id_sender,
                              id_receiver:notification.additionalData.id_receiver,
                              type: notification.additionalData.messagerie,
                              origin: "messagerie",
                              name: name
                          });
                          break;
                      case "rdv" :
                          this.nav.setRoot('event-detail', {
                              idEvent: notification.additionalData.id_event,
                              type : 'rdv',
                              originPage: "rendez-vous"
                          });
                          break;
                      case "post" :
                          this.nav.setRoot('news-list', {
                              typeActu: notification.additionalData.type_actu
                          });
                          break;
                      case "sondage" :
                          this.nav.setRoot('RepondreContactPage', {
                              param: notification.additionalData.id_sondage
                          });
                          break;
                  }
              }else{
                  //this.contentSrv.getNotificationTest();
                  this.dataNotification = [];

                  this.storage.set('nbNotif', 1 );
                  let toast : any;

                  if(notification.additionalData.type == "messagerie" || notification.additionalData.type == "rdv"){
                      toast = this.toastCtrl.create({
                          message: 'Vous avez reçu un message de '+notification.additionalData.title,
                          duration: 5000,
                          position: 'bottom',
                          showCloseButton: true,
                          closeButtonText: "Voir"
                      });
                  } else if(notification.additionalData.type == "sondage"){
                      toast = this.toastCtrl.create({
                          message: "Un nouveau sondage est disponible.",
                          duration: 5000,
                          position: 'bottom'
                      });
                  } else {
                      toast = this.toastCtrl.create({
                          message: 'Vous avez reçu un message de '+notification.additionalData.title,
                          duration: 5000,
                          position: 'bottom',
                          showCloseButton: true
                      });
                  }

                  let duration:number = 5000;
                  let elapsedTime:number = 0;
                  let intervalHandler = setInterval( () => { elapsedTime += 10; },10);

                  if(notification.message == 'Nouvelle demande de rendez-vous.' || notification.message == 'Réponse au rendez-vous.'){
                      toast.onDidDismiss((data, role) => {
                          if (role == "close") {this.nav.setRoot('RendezVousEventPage');}
                          this.storage.set('nbNotifrdv', 1 );

                      });
                  }else{
                      this.storage.set('nbNotif', 1 );
                      this.storage.set('nbNotifmsg', 1 );
                      toast.onDidDismiss((data, role) => {
                          if (role == "close") {this.nav.setRoot('DemandesContactPage');}
                      });

                      let view = this.nav.getActive();
                      if(view.component.name == 'DemandesContactPage'){
                          this.nav.setRoot('DemandesContactPage');
                      }

                  }
                  toast.present();
              }
      });*/
  }

  openPage(page) {
      if(page.component == 'AdhesionPage'){
          this.nav.setRoot('AdhesionPage',{
              user: this.user,
          });
      }else if(page.component == 'ParamettrePage'){
      this.nav.setRoot('ParamettrePage',{
          user: this.user,
      });
    }else if(page.component == 'CguPage'){
          this.nav.setRoot('CguPage',{});
      }else if(page.component == 'DidactitielPage'){
          this.nav.setRoot('DidactitielPage',{});
      }else if(page.component == 'place-detail'){
      this.nav.setRoot('place-detail',{
        param: this.user,
        idCat: 'team'
      });
    }else if(page.class == 'parament') {
      this.nav.setRoot(page.component, {
        id: this.admin_ent,
        prov: 'home',
        lvl: 'n2'
      })
    }else if(page.class == 'paramn1') {
      this.nav.setRoot(page.component, {
        id: this.admin_n1,
        prov: 'home',
        lvl: 'n1'
      })
    }else if(page.id_ent != null){
      this.sqlite.updateEntSelected(page.id_ent,1);
      this.nav.setRoot(page.component);
      $('.item-cli').removeClass('cli-selected');
      $('.cli-'+page.id_ent).addClass('cli-selected');
    }else{
      this.nav.setRoot(page.component);
    }
  }

  backToHome(){
    this.nav.setRoot('home-home');
  }

  public goTo(param,i){
    if(param == 'form'){
      this.nav.setRoot('form-detail', {
        id_form: i,
        cli : this.ent_selected,
        user : this.user,
        origin: 'home'
      });
    }else{
      switch (i){
        case 2:
          this.nav.setRoot('SignalementsContactPage',{});
          break;
        /*case 3:
        this.nav.setRoot('SuggestionsContactPage',{
          param: 1
        });
        break;*/
      }
    }
  }

  private showDidactitiel(){
      this.nav.setRoot('DidactitielPage',{});
  }

  private displayLocalNotif(data,page,rootParams){
    this.localNotif.schedule({
      id: 1,
      title: data.title,
      text: data.body,
      data: {
        data,
        page,
        rootParams
      }
    });
  }

  private notifAction(notif){
    console.log('NOTIFICATION CLICKED');
    console.log(notif);
    this.nav.setRoot(notif.data.page, notif.data.rootParams);
  }

}
