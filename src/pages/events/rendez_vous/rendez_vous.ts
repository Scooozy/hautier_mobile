import { Component, ViewChild } from '@angular/core';
import {NavController, NavParams, Select, IonicPage, ToastController} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { AnnuaireServiceProvider } from "../../../providers/annuaire-service/annuaire-service";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage()
@Component({
  selector: 'page-rendez_vous',
  templateUrl: 'rendez_vous.html'
})

export class RendezVousEventPage {
  id_ent: any;
  @ViewChild(Nav) nav: NavController;
  @ViewChild('Select') monSelectCat: Select;
  userContact: number;
  rdv: any = [];
  responserdv: any = [];

  allRdv: any = [];
  validRdv: any = [];
  waitRdv: any = [];
  refuseRdv:any = [];

  flag: string = "";

  unix_time: number;
  typeRdv: string;


  constructor(public navCtrl: NavController, private storage:Storage, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              public alertCtrl: AlertController, private localNotifications: LocalNotifications, private annuaireSrv:AnnuaireServiceProvider,
              private navParams: NavParams, private homeSrv: HomeServiceProvider, private toastCtrl: ToastController){
    let date_day = new Date();
    this.unix_time = Math.round(date_day.getTime()/1000.0);
    this.storage.set('nbNotifrdv', 0 );
    this.id_ent = this.navParams.get("id_ent");
    this.getConnected();
  }


  ionViewWillEnter(){
    let self = this;
    //Add click on class myBackArrow
    $(function() {
      $(".myBackArrow").click(function() {
        self.goBack();
      });
    });
  }

  ionViewWillLeave(){
    //Remove all delegated click handlers
    $(".myBackArrow").off();
  }

  //Fonction recup user connecté
  public getConnected(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        if (res.rows.length != 0){
          if(res.rows.item(0).connected == 0) {
          }else{
            this.userContact = res.rows.item(0).id_user;
            this.homeSrv.getHasRight(this.userContact,15).subscribe(data => {
              if(!data){
                let toast = this.toastCtrl.create({
                  message: 'Vous n\'avez pas les droits d\'accès à cette fonctionnalité.',
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
                this.navCtrl.setRoot('home-home',{});
              }
            });
            this.getRdv(this.userContact);
          }
        }
      });
    });
  }

  //retour sur la home
  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  //Aller sur le detail d'un rdv
  public goToDetailEvent(id){
    this.navCtrl.setRoot('event-detail', {
      idEvent: id,
      type : 'rdv',
      originPage: "rendez-vous"
    });
  }

  //Lors du clique pour valider un rdv
  public comfirmed(id, comfirmed){
    this.responserdv = [];
    if(comfirmed == 1){
      this.responserdv.push({
        id: id,
        comfirmed: 0
      });
    }else{
      this.responserdv.push({
        id: id,
        comfirmed: 1
      });
    }
    //Envoi comfirmed
    this.annuaireSrv.postRdvComfirmed(JSON.stringify(this.responserdv)).then(data => {
      this.rdv = [];
      this.validRdv = [];
      this.waitRdv = [];
      this.refuseRdv = [];
      this.allRdv = [];
      this.getRdv(this.userContact)
    });
  }

  //Convert Date to readable date
  public dateForRDV(dateString) {
    let d = new Date(dateString.replace(/-/g, "/"));

    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

    return datestring;
  }

  //Recup les rdv
  public getRdv(id_user){
    this.annuaireSrv.getUserRdv(this.userContact).subscribe(data =>{
      this.rdv = data;
      this.allRdv = this.rdv;
      if(data.length == 0){
        $('#account-box-2').css('display','inline-block');
        $('#noData').css('display','inline-block');
        $('#load, #loader').hide();
      }else{
        $('#noData').css('display','none');
        var self = this;
        let compteur = 0;
        let load = setInterval(function(){
          if($('#icon_'+self.rdv[compteur].id+' .laResponse')!=undefined) {
            //RDV validé
            if(self.rdv[compteur].confirmed == 1){
              $('#icon_'+self.rdv[compteur].id+' .laResponse').css('background-color','green');
              self.validRdv.push(self.rdv[compteur]);
              compteur = compteur + 1;
              //RDV sans reponse
            }else if(self.rdv[compteur].confirmed == null){
              $('#icon_'+self.rdv[compteur].id+' .laResponse').css('background-color','#FF9800');
              self.waitRdv.push(self.rdv[compteur]);
              compteur = compteur + 1;
              //RDV refusé
            }else{
              $('#icon_'+self.rdv[compteur].id+' .laResponse').css('background-color','#ca3a11');
              self.refuseRdv.push(self.rdv[compteur]);
              compteur = compteur + 1;
            }
            if(compteur == self.rdv.length) {
              //Check dans quel fitre on est pour mettre les bonnes data
              if(self.flag == "valid"){
                self.rdv = self.validRdv;
              }else if(self.flag == "wait"){
                self.rdv = self.waitRdv;
              }else if(self.flag == "refuse"){
                self.rdv = self.refuseRdv;
              }else if(self.flag == "all" || self.flag == ""){
                self.rdv = self.allRdv;
              }
              clearInterval(load);
              $('#load, #loader').hide();
            }
          }
        },50);
      }
    });
  }

  //Set le filtre des rdv
  public setFilter(){
    if(this.typeRdv == "valid"){
      this.rdv = this.validRdv;
      this.setColor(this.validRdv);
      this.flag = "valid";
    }else if(this.typeRdv == "wait"){
      this.rdv = this.waitRdv;
      this.setColor(this.waitRdv);
      this.flag = "wait";
    }else if(this.typeRdv == "refuse"){
      this.rdv = this.refuseRdv;
      this.setColor(this.refuseRdv);
      this.flag = "refuse";
    }else{
      this.rdv = this.allRdv;
      this.setColor(this.allRdv);
      this.flag = "all";
    }
  }

  //Ouvre le filtre
  public openFilter(){
    this.monSelectCat.open();
  }

  //Set la couleur des reponses
  public setColor(array){
    var self = this;
    let compteur = 0;
    let load = setInterval(function(){
      if(array.length>0){
        if($('#icon_'+array[compteur].id+' .laResponse')!=undefined) {
          //RDV validé
          if(array[compteur].confirmed == 1){
            $('#icon_'+array[compteur].id+' .laResponse').css('background-color','green');
            compteur = compteur + 1;
            //RDV sans reponse
          }else if(array[compteur].confirmed == null){
            $('#icon_'+array[compteur].id+' .laResponse').css('background-color','#FF9800');
            compteur = compteur + 1;
            //RDV refusé
          }else{
            $('#icon_'+array[compteur].id+' .laResponse').css('background-color','#ca3a11');
            compteur = compteur + 1;
          }
          if(compteur == array.length) {
            clearInterval(load);
          }
        }
        $('#noData').css('display','none');
      }else{
        clearInterval(load);
        $('#noData').css('display','inline-block');
      }
    },50);
  }

  //Ouvre la apge pour créer un rdv
  public openForm(){
    this.navCtrl.setRoot('AppointmentPage',{
      idSender: this.userContact,
      originPage: "rendez-vous",
      id_cli: this.navParams.get('id_cli'),
      id_ent: this.navParams.get("id_ent")
    });
  }
}


