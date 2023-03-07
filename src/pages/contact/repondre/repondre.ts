import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";

@IonicPage()
@Component({
  selector: 'page-repondre-contact',
  templateUrl: 'repondre.html'
})

export class RepondreContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  sondage: any;
  datepublication: string;
  reponses: any;
  lesReponses: any;
  name: string;
  response: any;
  sondages: any;
  userReponses:any;
  nb_new_sondages: number;

  constructor(public navCtrl: NavController, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              public alertCtrl: AlertController, public navParam: NavParams) {
    this.getUser();
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

  public goBack(){
    this.navCtrl.setRoot('SondageContactPage',{});
  }

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          this.userContact = res.rows.item(0).id_user;
          this.getReponseSondage(this.navParam.get('param'),this.userContact);
          this.getSondage(this.navParam.get('param'));

        });
    });
  }

  public getSondage(id){
    this.contactSrv.getSondage(id).subscribe(data => {
      this.sondage = data;
      this.sondage = this.sondage[0];
      this.name = this.sondage.question;
      var date = this.sondage.datepublication.split('-');
      var mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      this.datepublication = date[2] + ' ' + mois[date[1]-1];
      if(this.sondage.multiple == 0){
        $('.question div:nth-child(3)').css('display','none')
      }else{
        if(this.sondage.multiple == 1){
          $('.question div:nth-child(2)').css('display','none')
        }
      }
      this.contactSrv.getLesReponses(id).subscribe( data => {
        this.reponses = data;
        var int = setInterval(function () {
          if($('#reponse-box-song').height() != 0){
            var screen = $('ion-content').height();
            var div = $('#reponse-box-song').height();
            var margin = (screen - div - 30 - $('.question').height()) / 2;
            margin = margin - $('#valid-reponse-box-sond').height();
            //jQuery('#reponse-box-song').css('margin-top',margin+'px');
            clearInterval(int);
          }
        },100);
        this.lesReponses = [];
        for(var i = 0; i < this.reponses.length; i++){
          this.lesReponses.push({
            sondage_id : this.sondage.id,
            user_id : this.userContact,
            id : this.reponses[i].id,
            check : false
          });
        }
        $('#load, #loader').hide();
      })
    });
  }

  public getReponseSondage(id_sondage, id_user){
      this.contactSrv.getReponseSondage(id_sondage, id_user).subscribe(data => {
          if(data[0] == true){
              this.navCtrl.setRoot('ResultsContactPage', {
                  param: this.navParam.get('param')
              });
          }
      });
  }

  public answerIt(id, index) {
    if(this.sondage.multiple == 1){
      if(this.lesReponses[index].check){
        this.lesReponses[index].check = false;
        $('#rep-'+id).css('background-color','#4d6073');
      }else{
        this.lesReponses[index].check = true;
        $('#rep-'+id).css('background-color','#62b0ad');
      }
    }else{
      if(this.lesReponses[index].check){
        this.lesReponses[index].check = false;
        $('#rep-'+id).css('background-color','#4d6073');
      }else{
        for(var i = 0; i < this.lesReponses.length; i++){
          this.lesReponses[i].check = false;
          $('.lesrep').css('background-color','#4d6073');
        }
        this.lesReponses[index].check = true;
        $('#rep-'+id).css('background-color','#62b0ad');
      }
    }
  };

  public verifAnswer() {
    var c = 0;
    for(var i = 0; i < this.lesReponses.length; i++){
      if(this.lesReponses[i].check){
        c++;
      }
    }
    if(c == 0){
      let alert = this.alertCtrl.create({
        title: 'Attention !',
        message: "Vous devez répondre à la question avant de valider.",
        buttons: ['Fermer']
      });
      alert.present();
    }else{
      this.sendDatas();
    }
  };

  public sendDatas() {
    this.contactSrv.postLesReponses(JSON.stringify(this.lesReponses)).then(data => {
      this.response = data;
      if(this.response == null){
        let alert = this.alertCtrl.create({
          title: 'Enregistré !',
          message: "Votre réponse a été enregistrée avec succès.",
          buttons: ['Fermer']
        });
        alert.present();
        this.navCtrl.setRoot('ResultsContactPage', {
            param: this.navParam.get('param')
        });
        this.load_notif();
      }else{
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
      }
    });
  };

  public load_notif = function () {
    this.contactSrv.getSondageList().subscribe(data => {
      this.sondages = data;
      this.contactSrv.getUserReponses(this.userContact).subscribe(data => {
        this.userReponses = data;
        this.nb_new_sondages = 0;
        var date = new Date();
        var inspect = false;
        for (var i = 0; i < this.sondages.length; i++) {
          var date1 = new Date(this.sondages[i].datefin);
          if (date1 > date) {
            if(this.userReponses.length == 0){
              inspect = true;
              }else {
              for (var u = 0; u < this.userReponses.length; u++) {
                if (this.sondages[i].id != this.userReponses[u].sondage_id) {
                  inspect = true;
                }
              }
            }
          }
        }
        if (inspect){
          $('#sondage-notif').css('display', 'block');
          }else{
          $('#sondage-notif').css('display', 'none');
        }
        this.navCtrl.setRoot('SondageContactPage');
      });
    });
  };

}
