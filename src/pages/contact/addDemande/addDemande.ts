import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams, ToastController, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';

@IonicPage()
@Component({
  selector: 'page-add-demande-contact',
  templateUrl: 'addDemande.html'
})

export class AddDemandeContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  files:any;
  _files:any;
  mois:any;
  jour:any;
  params: any;
  response : any;
  today: any;
  fileURL: any;
  win: any;
  fail: any;
  ent_selected: any;

  contact: any;

  ent: any;
  nbEnt: any;
  entLength: number = 1;


  receiverTitle: string;
  senderTitle: string;

  id_receiver: number = null;

  filtreTeam: boolean = false;

  constructor(private navCtrl: NavController,private toastCtrl:ToastController, private Sqlite: SQLite, private contactSrv: ContactServiceProvider,
    public alertCtrl: AlertController, public annuaire:AnnuaireServiceProvider) {
    this.getUser();
    this.getEnt();
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

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.userContact = res.rows.item(0).id_user;
        this.annuaire.getEmployeById(this.userContact).subscribe(data =>{
          this.senderTitle = data[0].prenom+" "+data[0].nom;
        });
        this.Sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM ent_selected', {})
            .then(result => {
              if (result.rows.length != 0) {
                this.ent_selected = result.rows.item(0).id_ent;
                this.getEnt();
              }
            });
        });
        $('#load, #loader').hide();
      });
    });
  }

  public getEnt(){
    this.annuaire.getLvl2ListMessagerie(this.ent_selected,this.userContact).subscribe(data =>{
      this.ent = data;
      this.entLength = this.ent.length;
    });
  }

  public goBack(){
    this.navCtrl.setRoot('DemandesContactPage',{});
  }

  public setContact(){
    this.id_receiver =  $("#select-contact").val();
  }

  public setFiltreEnt(){
    let id_ent =  $("#select-filtre-ent").val();
    this.annuaire.getTeam(id_ent).subscribe(data => {
      this.contact = data;
      $("#select-contact").val($("#select-contact option:first").val());
      this.id_receiver = null;
      this.filtreTeam = true;
    });
  }

  public sendDatas() {
    if(this.id_receiver != null){
      this.annuaire.getEmployeById(this.id_receiver).subscribe(data =>{
        this.receiverTitle = data[0].prenom+" "+data[0].nom;
        this.contactSrv.getMessageDemandeBySenderReceiver(this.userContact,this.id_receiver).subscribe(data => {
          if(data.length == 0){
            var params = [];
            params.push({
              user_id_sender: this.userContact,
              user_id_receiver: this.id_receiver,
              name_sender: this.senderTitle,
              name_receiver: this.receiverTitle,
              demande : "demande",
              sujet : "sujet",
            });
            this.contactSrv.postMessageDemande(JSON.stringify(params)).then(response => {
              this.contactSrv.getMessageDemandeBySenderReceiver(this.userContact,this.id_receiver).subscribe(data2 => {
                this.navCtrl.setRoot('DetaildemContactPage',{
                  param: data2[0].id,
                  id_sender: data2[0].user_id_sender,
                  id_receiver: data2[0].user_id_receiver,
                  type: 'user'
                });
              });
            });
          }else{
            this.navCtrl.setRoot('DetaildemContactPage',{
              param: data[0].id,
              id_sender: data[0].user_id_sender,
              id_receiver: data[0].user_id_receiver,
              type: 'user'
            });
          }
        });
      });
    }else{
      let toast = this.toastCtrl.create({
        message: 'Veuillez selectionner une personne',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  };

  public verifForm() {
    var inspect = true;
    var subject = $('#subject');
    var desc = $('#desc');
    if(subject.val() == ""){
      subject.css('border-color','red');
      inspect = false;
    }else{
      subject.css('border-color','lightgrey');
    }
    if(desc.val() == ""){
      desc.css('border-color','red');
      inspect = false;
    }else{
      desc.css('border-color','lightgrey');
    }
    if(inspect){
      this.sendDatas();
    }else{
      let alert = this.alertCtrl.create({
        title: 'Attention !',
        message: "Tous les champs doivent être saisis.",
        buttons: ['Fermer']
      });
      alert.present();
    }
  };

}
