import { Component, ViewChild } from '@angular/core';
import {NavController, IonicPage, ToastController} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage()
@Component({
  selector: 'page-sondage-contact',
  templateUrl: 'sondage.html'
})

export class SondageContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  user: any;
  name: string;
  prenoms: string;
  sondageList: any;
  userReponses: any;
  right_result: boolean = false;
  right_response: boolean = false;

  constructor(private navCtrl: NavController, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              public alertCtrl: AlertController, private homeSrv: HomeServiceProvider, private toastCtrl: ToastController) {
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

  public getConnected(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.userContact = res.rows.item(0).id_user;
        this.homeSrv.getHasRight(this.userContact,43).subscribe(data =>{
          if(!data){
            let toast = this.toastCtrl.create({
              message: "Vous n'avez pas les droits d'accès à cette fonctionnalité.",
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.navCtrl.setRoot('home-home',{});
          }else{
            this.homeSrv.getHasRight(this.userContact,45).subscribe(data =>{
              this.right_result = data;
            });
            this.homeSrv.getHasRight(this.userContact,44).subscribe(data =>{
              this.right_response = data;
            });
          }
        });
        this.getSondages(this.userContact);
        this.getUserResponse();
      });
    });
  }

  public getSondages(user){
    this.contactSrv.getSondageList(user).subscribe( data => {
      this.sondageList = data;
      $('#load, #loader').hide();
      if(this.sondageList.length != 0){
        $('#sond-list-box h5').hide();
      }
    });
  }

  public goBack() {
    this.navCtrl.setRoot('home-home');
  }

  public getUserResponse(){
    this.contactSrv.getUserReponses(this.userContact).subscribe( data => {
      this.userReponses = data;
    });
  }

  public sondageQuest = function (id, index) {
    if(this.sondageList[index].finish){
      if(this.right_result){
        this.navCtrl.setRoot('ResultsContactPage', {
          param: id
        });
      }
    }else{
      if(this.right_response){
        var inspect = false;
        for(var i = 0; i < this.userReponses.length; i++){
          if(id == this.userReponses[i].sondage_id){
            inspect = true;
          }
        }
        if(!inspect){
          this.navCtrl.setRoot('RepondreContactPage', {
            param: id
          });
        }else{
          let alert = this.alertCtrl.create({
            title: 'Réponse déjà enregistrée !',
            message: "Vous avez déjà répondu à cette question.",
            buttons: ['Fermer']
          });
          alert.present();
        }
      }
    }
  };

}
