import { Component, ViewChild } from '@angular/core';
import {NavController, NavParams, Nav, AlertController, LoadingController, ToastController, IonicPage} from 'ionic-angular';
import * as $ from 'jquery';
import {  SQLite,  SQLiteObject} from '@ionic-native/sqlite';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-modifDetails',
  templateUrl: 'modif_details.html'
})

export class ModifDetailsPage {
  @ViewChild(Nav) nav: NavController;

  //Données formulaire
  bio : string = this.navParams.get("param_text_bio").replace(new RegExp('\n','g'), '<br/>');
  groupes : any = [];
  //Varialbe pour stocker les id des favoris
  favPro : any = [];
  favAma : any = [];

  tel : string = this.navParams.get("param_data_tel");
  mail: string = this.navParams.get("param_data_mail");
  twitter: string = this.navParams.get("param_data_twitter");
  facebook: string = this.navParams.get("param_data_facebook");
  insta: string = this.navParams.get("param_data_insta");
  linkedin: string = this.navParams.get("param_data_linkedin");
  foncPro : any = this.navParams.get("foncPro");

  //Ancienne données
  old_bio : string;
  old_groupes : any;
  old_tel: string;
  old_mail: string;
  old_twitter: string;
  old_facebook: string;
  old_insta: string;
  old_linkedin: string;

  //Id user
  id_user: number;

  //Variable pour la liste des favoris dans le formulaire
  listFavoris: any;
  listFonc: any;
  listGroupes: any;

  //Variable pour l'envoi de données dans la BD
  response:any;
  lesReponsesfav: any;
  lesReponsesProfil: any;
  lesReponsesGroupes: any;

  teamcolor1: string = null;
  teamcolor2: string = null;
  fsccolor1: string = null;
  fsccolor2: string = null;

  constructor(public navParams: NavParams,private storage: Storage,public alertCtrl: AlertController,
              public annuaire:AnnuaireServiceProvider, public navCtrl: NavController, public Sqlite: SQLite,
              public favoris: FavorisServiceProvider, private loadingCtrl : LoadingController, public toastCtrl: ToastController) {
    //Définition anciennes valeurs
    this.old_bio = this.bio;
    this.old_groupes = this.groupes;
    this.old_tel = this.tel;
    this.old_mail = this.mail;
    this.old_twitter = this.twitter;
    this.old_facebook = this.facebook;
    this.old_insta = this.insta;
    this.old_linkedin = this.linkedin;

    let pro = this.navParams.get("param_data_fav_pro");
    let ama = this.navParams.get("param_data_fav_ama");
    for(var i = 0; i< pro.length;i++) {
      this.favPro[i] = pro[i].id;
    }

    //Récupération de l'utilisateur
    this.getUser();

    this.favoris.getAllFavoris().subscribe(data =>{
      this.listFavoris = data;
    });

    this.annuaire.getServices().subscribe(data =>{
      this.listFonc = data;
    });

    this.annuaire.getServicesEnt(1).subscribe(data =>{
      this.listGroupes = data;
    });
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

  ionViewDidLoad(){
    this.storage.get('fsccolor1').then((val) =>{
      this.fsccolor1 = val;
    });
    this.storage.get('fsccolor2').then((val) =>{
      this.fsccolor2 = val;
    });
    this.storage.get('teamcolor1').then((val) =>{
      this.teamcolor1 = val;
    });
    this.storage.get('teamcolor2').then((val) =>{
      this.teamcolor2 = val;
    });

    this.storage.get('fsc').then((val) => {
      if(val){
        $('#app-send-btn').css("background-color", this.fsccolor1);
        $('#app-form-title ').css("color", this.fsccolor1);
      }else{
        $('#app-send-btn').css("background-color", this.teamcolor1);
        $('#app-form-title ').css("color", this.teamcolor1);
      }
    });
  }

  ionViewWillLeave(){
    //Remove all delegated click handlers
    $(".myBackArrow").off();
  }

  //Fonction qui permet de récuperer l'utilisateur conncter en base de données
  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.id_user = res.rows.item(0).id_user;
        $('#load, #loader').hide();
      });
    });
  }

  //Fonction pour valider les modif du profil
  public saveProfil(){
    this.setNullIfEmpty();
    //Stockage de la bio pour envoyer en BD
    this.lesReponsesProfil = [];
    this.lesReponsesProfil.push({
      bio : this.bio.replace('\\r\\n', '<br/>'),
      id_user : this.id_user,
      tel:this.tel,
      mail:this.mail,
      twitter:this.twitter,
      facebook:this.facebook,
      instagram:this.insta,
      linkedin:this.linkedin,
      fonc: this.foncPro
    });

    //Stockage des favs pour envoyer en BD
    this.lesReponsesfav = [];
    //Premiere definiton avec le id_user
    this.lesReponsesfav.push({
      id_fav : null,
      id_user : this.id_user
    });
    if(this.favPro != undefined){
      for(var i = 0; i < this.favPro.length; i++){
        this.lesReponsesfav.push({
          id_fav : this.favPro[i],
          id_user : this.id_user
        });
      }
    }

    this.lesReponsesGroupes = [];
    //Premiere definiton avec le id_user
    this.lesReponsesGroupes.push({
      id_groupes : null,
      id_user : this.id_user
    });
    if(this.groupes != undefined){
      for(var i = 0; i < this.groupes.length; i++){
        this.lesReponsesGroupes.push({
          id_groupes : this.groupes[i],
          id_user : this.id_user
        });
      }
    }
    //Envoi des données en base
    this.sendDatas();

    //Redirige vers la page détails
    this.navCtrl.setRoot('place-detail',{
      idCat: this.navParams.get("idCat"),
      param: this.navParams.get("param")
    });
  }

  //Envoid des modifs en base de données
  public sendDatas() {
    //Envoi favoris
    let loader = this.loadingCtrl.create({
      content: "Envoi du post ..."
    });
    loader.present();
    this.favoris.postFavoris(JSON.stringify(this.lesReponsesfav)).then(data => {
      this.response = data;
      if(this.response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }
      loader.dismiss();
    });

    //Envoi Bio
    this.annuaire.postBio(JSON.stringify(this.lesReponsesProfil)).then(data => {
      this.response = data;
      if(this.response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }
      loader.dismiss();
    });

    this.annuaire.postTel(JSON.stringify(this.lesReponsesProfil)).then(data => {
      this.response = data;
      if(this.response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }
      loader.dismiss();
    });

    this.annuaire.postMail(JSON.stringify(this.lesReponsesProfil)).then(data => {
      this.response = data;
      if(this.response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }
      loader.dismiss();
    });

    this.annuaire.postTwitter(JSON.stringify(this.lesReponsesProfil)).then(data => {
      this.response = data;
      if(this.response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }
    });

    this.annuaire.postFacebook(JSON.stringify(this.lesReponsesProfil)).then(data => {
      this.response = data;
      if (this.response != null) {
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }
    });

    this.annuaire.postInsta(JSON.stringify(this.lesReponsesProfil)).then(data => {
      this.response = data;
      if (this.response != null) {
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }
    });

    this.annuaire.postLinkedin(JSON.stringify(this.lesReponsesProfil)).then(data => {
      this.response = data;
      if (this.response != null) {
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'envoi de la réponse a connu un problème...",
          buttons: ['Fermer']
        });
        alert.present();
      }
    });
  };

  //Fonction Check si le formulaire est valide
  public checkvalid(){
    if(this.bio != this.old_bio || this.groupes != this.old_groupes || this.favAma != undefined || this.favPro != undefined || this.foncPro != undefined || this.groupes != undefined || this.tel != this.old_tel || this.mail != this.old_mail || this.twitter != this.old_twitter || this.facebook != this.old_facebook || this.insta != this.old_insta || this.linkedin != this.old_linkedin) {
      if(this.bio != this.old_bio || this.groupes != this.old_groupes || this.favPro.length != 0 || this.foncPro.length != 0 || this.favAma.length != 0 || this.groupes.length != 0 ||  this.tel != this.old_tel || this.mail != this.old_mail || this.twitter != this.old_twitter || this.facebook != this.old_facebook || this.insta != this.old_insta || this.linkedin != this.old_linkedin) {
        $("#submit_button").prop("disabled",false);
      }
    }else{
      $("#submit_button").prop("disabled",true);
    }
  }


  public setNullIfEmpty(){
    if(this.tel == ""){
      this.tel = null;
    }

    if(this.mail == ""){
      this.mail = null;
    }

    if(this.twitter == ""){
      this.twitter = null;
    }

    if(this.facebook == ""){
      this.facebook = null;
    }

    if(this.insta == ""){
      this.insta = null;
    }

    if(this.linkedin == ""){
      this.linkedin = null;
    }
  }

  //Fonction Retour sur la page détail
  public goBack() {
    this.navCtrl.setRoot('place-detail',{
      idCat: this.navParams.get("idCat"),
      param: this.navParams.get("param")
    });
  }

  public modifpwd(){
    let alert = this.alertCtrl.create({
    title: 'Modifier son mot de passe',
    inputs: [
      {
        name: 'pwd',
        placeholder: 'Votre mot de passe',
        type: 'password'
      },
      {
        name: 'confirm_pwd',
        placeholder: 'Confirmation du mot de passe',
        type: 'password'
      }
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Ok',
        handler: data => {
          if (data.pwd == data.confirm_pwd) {
            this.annuaire.checkPassword(this.id_user,data.pwd).subscribe(data => {
              if(data == true){
                let alert = this.alertCtrl.create({
                title: 'Nouveau mot de passe',
                inputs: [
                  {
                    name: 'new_pwd',
                    placeholder: 'Password',
                    type: 'password'
                  }
                ],
                buttons: [
                  {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: data => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: 'Ok',
                    handler: data => {
                      if (data != "") {
                        this.annuaire.newPassword(this.id_user,data.new_pwd).subscribe(data => {
                          this.presentToast('Votre mot de passe a été modifié.');
                        });
                      } else {
                        return false;
                      }
                    }
                  }
                ]
              });
              alert.present();
            } else {
              this.presentToast('Mauvais mot de passe.');
            }
            });
          } else {
            this.presentToast('Les mots de passe doivent être identiques.');
            return false;
          }
        }
      }
    ]
  });
  alert.present();
  }

  private presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }
}
