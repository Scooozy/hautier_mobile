import { Component, ViewChild } from '@angular/core';
import {NavController, MenuController, AlertController, LoadingController, ToastController, IonicPage} from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient } from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-add-signalement-contact',
  templateUrl: 'addSignalement.html'
})

export class AddSignalementContactPage {
  @ViewChild(Nav) nav: NavController;
  id_user: number;
  ent_selected: number;
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
  subject: any;
  fileDirectory: any;
  location: any;

  categories: any = [];
  img_post: string = "";
  imageURI: string = "";


  constructor(public navCtrl: NavController, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              public menu: MenuController, public alertCtrl: AlertController, public file: File, private camera: Camera,
              private geolocation: Geolocation, private transfer: FileTransfer, public http: HttpClient,
              private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
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

  //Get le user connecté
  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          this.id_user = res.rows.item(0).id_user;
          this.Sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM ent_selected', {})
              .then(result => {
                if (result.rows.length != 0) {
                  this.ent_selected = result.rows.item(0).id_ent;
                  this.getCategories();
                }
              });
          });
        });
    });
  }

  private getCategories(){
    this.contactSrv.getSignalementsCategories(this.ent_selected).subscribe(data => {
      this.categories = data;
      $('#load, #loader').hide();
    });
  }

  public openCamera = function() {

    let cameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.imageURI = imageData;
      this.uploadFile();
    });
  };

  //Fonction pour mettre la photo sur le serveur
  private uploadFile() {
    this.img_post= "";
    $('.preloadImg').remove();
    let loader = this.loadingCtrl.create({
      content: "Chargement de la photo ..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let id_img = this.makeid();
    let name_file = id_img+".jpg";
    this.img_post = name_file;

    let options: FileUploadOptions = {
      chunkedMode: false,
      fileKey: 'file',
      fileName: name_file,
      params:{operatiune:'uploadpoza'}
    };
    fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/signalements/upload.php', options).then((data) => {
      loader.dismiss();
      $('#imageFile').attr('src', "https://hautier.teamsmart.fr/images/signalements/"+this.img_post);
      $('#label-image').css('display','none');
      $('#imageFile').css('display','inline-block');
    }, (err) => {
      loader.dismiss();
      this.presentToast("La photo n'a pas pu être enregistrée");
    });
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

  //Function chaine string aléatoire pour identifiant image
  public makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  public geoloc(){
    this.geolocation.getCurrentPosition().then((resp) => {
      $('#location').val('('+resp.coords.latitude+', '+resp.coords.longitude+')')
    }).catch((error) => {
      let alert = this.alertCtrl.create({
        title: 'Attention !',
        message: "Problème de géolocalisation. Vérifiez qu'elle est bien activée.",
        buttons: ['Fermer']
      });
      alert.present();
    });
  }

  public verifForm(){
    $('#load, #loader').show();
    var inspect = true;
    var cat = $('#cat');
    var subject = this.subject;
    var subject_css =  $('#subject');
    var desc = $('#desc');
    var img = this.img_post;
    var loc = $('#location');
      var loc_css =  $('#location');
    if(cat.find(":selected").val() == ""){
      cat.css('border-color','red');
      inspect = false;
    }else{
      cat.css('border-color','lightgrey');
    }
    if(subject_css.val() == ""){
      subject_css.css('border-color','red');
      inspect = false;
    }else{
      subject_css.css('border-color','lightgrey');
    }
    if(desc.val() == ""){
      desc.css('border-color','red');
      inspect = false;
    }else{
      desc.css('border-color','lightgrey');
    }
    if(img == undefined){
      $('#image-signalement').css('border-color','red');
      inspect = false;
    }else{
      $('#image-signalement').css('border-color','lightgrey');
    }
    if(loc.val() == ""){
      loc_css.css('border-color','red');
      inspect = false;
    }else{
      loc_css.css('border-color','lightgrey');
    }

    if(inspect){
      this.sendDatas();
    }else{
      $('#load, #loader').hide();
      let alert = this.alertCtrl.create({
        title: 'Attention !',
        message: "Tous les champs doivent être saisis.",
        buttons: ['Fermer']
      });
      alert.present();
    }
  }

  /*public sendSign() {
    let url = "https://dev.cityapps.fr/administrator/components/com_citycontact/views/img/imgSign/upload.php";

    const fileTransfer: FileTransferObject = this.transfer.create();

    var nomFichier = this.fileURL.split("/");
    let options1: FileUploadOptions = {
      fileKey: 'file',
      fileName: nomFichier[nomFichier.length-1],
      chunkedMode: false,
      params:{operatiune:'uploadpoza'}
    };

    fileTransfer.upload(this.fileURL, 'https://dev.cityapps.fr/administrator/components/com_citycontact/views/img/imgSign/upload.php', options1)
      .then(data => {
          this.sendDatas();
        }, (err) => {
          // error
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'upload de l'image a rencontré un problème.",
          buttons: ['Fermer']
        });
        alert.present();
        $('#load, #loader').hide();
      });

  };*/


  public sendDatas = function () {
    var cat = $('#cat');
    var subject = this.subject;
    var desc = $('#desc');
    var loc =  $('#location');
    this.params = [];
    var nomFichier = this.img_post;
    this.params.push({
      categorie : cat.find(":selected").val(),
      subject : subject,
      description : desc.val(),
      location : loc.val(),
      image : nomFichier,
      user_id : this.id_user,
      cli: this.ent_selected
    });
    this.contactSrv.postSignalement(JSON.stringify(this.params)).then(response => {
      this.response = response;
      let alert = this.alertCtrl.create({
        title: 'Enregistré !',
        message: "Votre signalement a été enregistré avec succès.",
        buttons: ['Fermer']
      });
      alert.present();
      this.navCtrl.setRoot('SignalementsContactPage',{});
    });
  };

  public goBack(){
    this.navCtrl.setRoot('SignalementsContactPage',{});
  }

}
