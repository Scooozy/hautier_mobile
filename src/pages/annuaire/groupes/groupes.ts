import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, AlertController, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { ContactServiceProvider } from '../../../providers/contact-service/contact-service';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-annuaire-groupes',
  templateUrl: 'groupes.html'
})
export class AnnuaireGroupesPage {
  @ViewChild(Nav) nav: NavController;

  id_user: number = 0;
  demandesGroupe: any = [];

  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams, public annuaire: AnnuaireServiceProvider,
    public sqlite: SqliteServiceProvider,public alertCtrl:AlertController,public toastCtrl:ToastController,public contactSrv:ContactServiceProvider, public Sqlite: SQLite, public http: HTTP, public platform: Platform, public favorisSrv:FavorisServiceProvider) {

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

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
        this.getDemandesGroupe(this.id_user);
      });
    });
  }

  public getDemandesGroupe(user){
    this.contactSrv.getGroupeByUser(user).subscribe(data => {
      this.demandesGroupe = [];
      if(data.length == 0){
        $('#noData').css('display','block');
      }
      for(let i = 0; i<data.length; i++){
        this.demandesGroupe.push(data[i]);
      }
      this.demandesGroupe.sort(function(a,b) {return (a.nom > b.nom) ? 1 : ((b.nom > a.nom) ? -1 : 0);} );
      $('#load, #loader').hide();
    });
  }

  public demDetail(id, index){
    this.navCtrl.setRoot('DetaildemContactPage',{
      param: id,
      id_sender:null,
      id_receiver:null,
      type: 'groupe',
      origin:'groupes'
    });
  }

  public selectGroupe(){
    let dataInputs = [];
    this.contactSrv.getGroupeByUser(this.id_user).subscribe(data => {
      data.sort(function(a,b) {return (a.prenom > b.prenom) ? 1 : ((b.prenom > a.prenom) ? -1 : 0);} );
      for(var i=0; i<data.length; i++)  {
        dataInputs[i] = {};
        dataInputs[i].label = data[i].nom;
        dataInputs[i].type = 'radio';
        dataInputs[i].value = data[i].id;
      }

      let alert = this.alertCtrl.create({
        title: 'Sélection d\'un groupe',
        message: 'Sélectionner le groupe où vous souhaitez ajouter des membres',
        inputs : dataInputs,
        buttons: [{
          text: 'Annuler',
          role: 'cancel'
        },{
          text: 'Valider',
          handler: data => {
            if(data.length != 0){
              this.addPeopleInGroupe(data,"noInit");
            }else{
              let toast = this.toastCtrl.create({
                message: 'Veuillez sélectionner un groupe.',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              this.selectGroupe();
            }
          }
        }]
      });
      alert.present();
    });
  }

  public createGroupe(){
    let alert = this.alertCtrl.create({
      title: "Création d'un groupe",
      message: 'Créer un groupe et ajouter les membres que vous souhaitez pour communiquer avec eux.',
      inputs: [{
        name: 'nom',
        placeholder: 'Nom du groupe'
      }],
      buttons: [{
        text: 'Annuler',
        role: 'cancel'
      },{
        text: 'Créer le groupe',
        handler: data => {
          if(data.nom != ""){
            let params = [];
            params.push({
              nom: data.nom,
              is_public: 0,
            });
            this.contactSrv.postGroupe(JSON.stringify(params)).then(response => {
              this.addPeopleInGroupe(response,"init");
            });
          }else{
            let toast = this.toastCtrl.create({
              message: 'Veuillez saisir le nom de votre groupe.',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.createGroupe();
          }
        }
      }]
    });
    alert.present();
  }

  public addPeopleInGroupe(id_groupe,when){
    let dataInputs = [];
    this.contactSrv.getUserOfGroupe(id_groupe).subscribe(UserOfGroup =>{
      this.annuaire.getAllTeamAllEnt().subscribe(data => {
        data.sort(function(a,b) {return (a.prenom > b.prenom) ? 1 : ((b.prenom > a.prenom) ? -1 : 0);} );
        let cpt = 0;
        for(let i=0; i<data.length; i++)  {
          if(UserOfGroup.length == 0){
            if(data[i].id_employe != this.id_user){
              dataInputs[cpt] = {};
              dataInputs[cpt].label = data[i].prenom+" "+data[i].nom;
              dataInputs[cpt].type = 'checkbox';
              dataInputs[cpt].value = data[i].id_employe;
              cpt++;
            }
          }else{
            for(let e=0; e<UserOfGroup.length;e++){
              if(data[i].id_employe == UserOfGroup[e].id_user || data[i].id_employe == this.id_user){
                e=UserOfGroup.length;
              }
              if(e == UserOfGroup.length-1){
                dataInputs[cpt] = {};
                dataInputs[cpt].label = data[i].prenom+" "+data[i].nom;
                dataInputs[cpt].type = 'checkbox';
                dataInputs[cpt].value = data[i].id_employe;
                cpt++;
              }
            }
          }
        }

        let alert = this.alertCtrl.create({
          title: 'Ajout d\'un membre',
          message: 'Ajouter les membres que vous souhaitez à votre groupe',
          inputs : dataInputs,
          buttons: [{
            text: 'Annuler',
            role: 'cancel',
            handler: data => {
              if(when == "init"){
                let params = [];
                //Ajout de la pesonne qui créé le groupe
                params.push({
                  id_groupe: id_groupe,
                  id_user: this.id_user,
                });
                this.contactSrv.postUserGroupeAuto(JSON.stringify(params)).then(response => {
                  this.getDemandesGroupe(this.id_user);
                });
              }
            }
          },{
            text: 'Ajouter les membres',
            handler: data => {
              if(data.length != 0){
                let params = [];
                //Ajout de la pesonne qui créé le groupe
                if(when == "init"){
                  params.push({
                    id_groupe: id_groupe,
                    id_user: this.id_user,
                  });
                }
                for(let e = 0; e<data.length;e++){
                  params.push({
                    id_groupe: id_groupe,
                    id_user: data[e],
                  });
                }
                this.contactSrv.postUserGroupeAuto(JSON.stringify(params)).then(response => {
                  this.getDemandesGroupe(this.id_user);
                });
              }else{
                let toast = this.toastCtrl.create({
                  message: 'Veuillez sélectionner au moins un membre dans votre groupe.',
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
                this.addPeopleInGroupe(id_groupe,"init");
              }
            }
          }]
        });
        alert.present();
      });
    });
  }

  public goBack() {
    this.navCtrl.setRoot('home-home');
  }
}
