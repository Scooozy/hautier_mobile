import { Component, ViewChild } from '@angular/core';
import {NavController, NavParams, Nav, AlertController, ToastController, LoadingController, IonicPage} from 'ionic-angular';
import * as $ from 'jquery';
import { SQLite } from '@ionic-native/sqlite';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { Storage } from '@ionic/storage';
import {Camera} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";

@IonicPage()
@Component({
  selector: 'page-modifDetailsEntreprise',
  templateUrl: 'modif_details_entreprise.html'
})

export class ModifDetailsPageEntreprise {
  @ViewChild(Nav) nav: NavController;

  //Données formulaire
  bio : string = this.navParams.get("param_text_bio");
  groupes : any;
  //Varialbe pour stocker les id des favoris
  favPro : any;
  favAma : any;

  tel : string = this.navParams.get("param_data_tel");
  mail: string = this.navParams.get("param_data_mail");
  twitter: string = this.navParams.get("param_data_twitter");
  facebook: string = this.navParams.get("param_data_facebook");
  insta: string = this.navParams.get("param_data_insta");
  linkedin: string = this.navParams.get("param_data_linkedin");

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

  listGroupes: any;

  //Variable pour l'envoi de données dans la BD
  response:any;
  lesReponsesProfil: any;

  teamcolor1: string = null;
  teamcolor2: string = null;
  fsccolor1: string = null;
  fsccolor2: string = null;

  imageURI: string = '';
  img_post: string = '';

  constructor(public navParams: NavParams,private storage: Storage,public alertCtrl: AlertController,private transfer: FileTransfer,
              public annuaire:AnnuaireServiceProvider, public navCtrl: NavController, public Sqlite: SQLite,
              public favoris: FavorisServiceProvider, private camera: Camera, public toastCtrl:ToastController,
              public loadingCtrl:LoadingController) {
    //Définiotn anciennes valeus
    this.old_bio = this.bio;
    this.old_groupes = this.groupes;
    this.old_tel = this.tel;
    this.old_mail = this.mail;
    this.old_twitter = this.twitter;
    this.old_facebook = this.facebook;
    this.old_insta = this.insta;
    this.old_linkedin = this.linkedin;

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
    $("#input_tel").attr("placeholder", "Saisir le numero de telephone");
    $('#load, #loader').hide();
  }

  ionViewWillLeave(){
    //Remove all delegated click handlers
    $(".myBackArrow").off();
  }

  //Fonction pour valider les modif du profil
  public saveProfil(){
    //Stockage de la bio pour envoyer en BD
    this.lesReponsesProfil = [];
    this.setNullIfEmpty();
    this.lesReponsesProfil.push({
      bio : this.bio,
      id_ent : this.navParams.get('param'),
      tel:this.tel,
      mail:this.mail,
      twitter:this.twitter,
      facebook:this.facebook,
      instagram:this.insta,
      linkedin:this.linkedin
    });

    //Envoi des données en base
    this.sendDatas();
    if(this.navParams.get("origin") == 'ent'){
      //Redirige vers la page détails
      this.navCtrl.setRoot('DetailEntreprisePage',{
        idCat: this.navParams.get("idCat"),
        param: this.navParams.get("param")
      });
    }else{
        this.navCtrl.setRoot('AdminPage',{
            id: this.navParams.get('param'),
            prov: this.navParams.get('prov'),
            lvl: this.navParams.get('lvl'),
            part: this.navParams.get('part'),
        });
    }
  }

  //Envoid des modifs en base de données
  public sendDatas() {
      let loader = this.loadingCtrl.create({
          content: "Envoi du post ..."
      });
      loader.present();
    this.annuaire.postDataEnt(JSON.stringify(this.lesReponsesProfil)).then(data => {
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
  }

  //Fonction Check si le formulaire est valide
  public checkvalid(){
    if(this.bio != this.old_bio || this.tel != this.old_tel || this.mail != this.old_mail || this.twitter != this.old_twitter || this.facebook != this.old_facebook || this.insta != this.old_insta || this.linkedin != this.old_linkedin)
    {
      $("#submit_button").prop("disabled",false);
    }else{
      $("#submit_button").prop("disabled",true);
    }
  }

  public goBack() {
    if(this.navParams.get("origin") == 'ent'){
      //Redirige vers la page détails
      this.navCtrl.setRoot('DetailEntreprisePage',{
        idCat: this.navParams.get("idCat"),
        param: this.navParams.get("param")
      });
    }else{
      this.navCtrl.setRoot('AdminPage',{
        id: this.navParams.get('param'),
        prov: this.navParams.get('prov'),
        lvl: this.navParams.get('lvl'),
        part: this.navParams.get('part'),
      });
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
}
