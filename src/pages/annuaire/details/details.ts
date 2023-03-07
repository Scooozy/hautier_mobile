import { Component, ViewChild, Directive } from '@angular/core';
import { NavController, NavParams, ToastController,AlertController, Platform, LoadingController, IonicPage} from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import * as $ from 'jquery';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Storage } from '@ionic/storage';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { ContentserviceProvider } from "../../../providers/contentservice/contentservice";
import { EmailComposer } from '@ionic-native/email-composer';
import { ImagePicker } from '@ionic-native/image-picker';
import { HttpClient } from '@angular/common/http';
import {HomeServiceProvider} from "../../../providers/home-service/home-service";
import {TeamPage} from "../team/team";

@IonicPage({
  name : 'place-detail',
  segment : 'place-detail'
})
@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
@Directive({
  selector: '[longPress]'
})
export class PlaceDetailsPage {
  @ViewChild(Nav) nav: NavController;

  idTW: number = 0;
  id_user: number = 0;
  ent_selected: number;
  TWname: string;
  image: string;
  ent_name: string;
  service: string = "";
  description: string = "";
  mesFavorisPro: any;
  mesFavorisProLength : number = 0;
  mesFavorisAma: any;
  mail: string = "";
  tel: string = "";
  twitter: string = "";
  facebook: string = "";
  linkedin: string = "";
  instagram: string = "";
  categ : any;
  imageURI:any;
  img_post : string = "";
  mesPosts: any = [];
  postsLength: number = 0;
  monPost: string = "";
  lesReponsesPosts: any;
  foncPro: any;
  right_actu: boolean = false;
  right_contact: boolean = false;


  constructor(public navParams: NavParams, private transfer: FileTransfer,public loadingCtrl: LoadingController,
              private camera: Camera, public navCtrl: NavController,public content:ContentserviceProvider,
              public annuaire: AnnuaireServiceProvider, public appBrowser: InAppBrowser, public sqliteProv: SqliteServiceProvider,
              public Sqlite: SQLite, public sqlite: SqliteServiceProvider, private http:HttpClient,
              private contactSrv:ContactServiceProvider, private imagePicker: ImagePicker, private iab: InAppBrowser,
              private emailComposer: EmailComposer,public platform: Platform, private alertCtrl:AlertController,
              private toastCtrl: ToastController, private storage: Storage, private favoris:FavorisServiceProvider,
              private homeSrv: HomeServiceProvider) {

    this.idTW = navParams.get("param");

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

  ionViewDidLoad(){
    $('.trait_favoris').css("width",$(".st-fav").width()-$('.titre_favoris').width()-10+"px");
    $('.trait_actus').css("width",$(".st-fav").width()-$('.titre_actus').width()-10+"px");
  }

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          this.id_user = res.rows.item(0).id_user;
          this.homeSrv.getHasRight(this.id_user,6).subscribe(data =>{
            this.right_actu = data;
          });
          this.homeSrv.getHasRight(this.id_user,25).subscribe(data => {
            this.right_contact = data;
          });
          this.getTWInfo(this.idTW);
          this.getEntreprise(this.idTW);
          this.getTWService(this.idTW);
          this.getCompetences(this.idTW);
          $('#load, #loader').hide();
          db.executeSql('SELECT * FROM ent_selected', {})
            .then(result => {
              if (result.rows.length != 0) {
                this.ent_selected = result.rows.item(0).id_ent;
                this.getPost(this.idTW,this.ent_selected);
              }
            });
        });
    });
  }

  private getTWInfo(id){
    this.annuaire.getEmployeById(id).subscribe(data =>{
      this.TWname = data[0].prenom + ' ' +  data[0].nom;
      this.image = data[0].image;
      this.description = data[0].description;
      this.description = this.description.replace(new RegExp('\n','g'), '<br/>');
      this.tel = data[0].tel;
      this.mail = data[0].email;
    });
  }

  private getEntreprise(id){
    this.annuaire.getEntreprise(id).subscribe(data =>{
      this.ent_name = data[0].title;
    });
  }

  private getTWService(id){
    this.annuaire.getServiceTW(id).subscribe(data =>{
      if(data.length != 0){
        this.service = data[0].nom;
        this.foncPro = data[0].id;
      }
    });
  }

  private getCompetences(id){
    this.favoris.getFavorisUserPro(id).subscribe(data =>{
      this.mesFavorisPro = data;
      this.mesFavorisProLength = this.mesFavorisPro.length;
    });
  }

  //Focntion pour recup les posts de l'utilsateur
  private getPost(id_user,selected){
    this.annuaire.getAllPostUser(id_user,selected).subscribe(data =>{
      this.mesPosts = data;
        for (let i = 0; i < this.mesPosts.length; i++) {
            this.mesPosts[i]['post '] = this.mesPosts[i]['post'].replace(new RegExp('\n','g'), '<br/>');
        }
      this.mesPosts.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
      //Reverse to descending order
      this.mesPosts.reverse();
      this.postsLength = this.mesPosts.length;
    });
  }

  //Convert Date to readable date
  public dateForPost(dateString) {
    let d = new Date(dateString);
    if(d.toString() == "Invalid Date"){
      let date = (dateString).split(" ");
      let date1 = date[0].split('-');
      let heure = date[1].split(':');
      d = new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]);
    }

    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;
  }

  public openImg(img){
    $('.img-bg-post').css("background-image","url('https://hautier.teamsmart.fr/images/post/"+img+"')");
    $('.img-bg-post').show();
  }

  public closeImg(){
    $('.img-bg-post').hide();
  }

  //Fonction pour recup une image pour les post
  public getImg(){
    this.displayImgChoice();
  }

  private getLibraryImg(){
    let cameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.imageURI = imageData;
      this.uploadFile('post');
    }, (err) => {
    });
  }

  private getCameraImg(){
    let cameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.imageURI = imageData;
      this.uploadFile('post');
    }, (err) => {
    });
  }

  public removeImg(){
    $('.img-cross-delete').hide();
    $('.preloadImg').remove();
    this.img_post = "";
  }

  private displayImgChoice(){
    let alert = this.alertCtrl.create({
      title: "Partage d'image",
      message: 'Quel outil voulez-vous ouvrir ?',
      buttons: [{
        text: 'Appareil Photo',
        handler: () => {
          this.getCameraImg();
        }
      },{
        text: 'Mes images',
        handler: () => {
          this.getLibraryImg();
        }
      }]
    });
    alert.present();
  }

  //Fonction pour publier un post
  public savePost(){
    if(this.img_post != "" || this.monPost != ""){
        let loader = this.loadingCtrl.create({
            content: "Envoi du post ..."
        });
        loader.present();
      this.lesReponsesPosts = [];
      this.lesReponsesPosts.push({
        id_user : this.idTW,
        post : this.monPost,
        is_ent: 0,
        image: this.img_post,
        date: this.formatDate(new Date()),
        cli: this.ent_selected
      });
      this.annuaire.postMesPost(JSON.stringify(this.lesReponsesPosts)).then(data => {
        let response = data;
        if(response != null){
          let alert = this.alertCtrl.create({
            title: 'Oups...',
            message: "L'envoi de la réponse a connu un problème...",
            buttons: ['Fermer']
          });
          alert.present();
        }else{
          loader.dismiss();
          this.presentToast("Publication enregistrée.");
          this.getPost(this.idTW,this.ent_selected);
        }
        //this.getPost(this.user);
        this.monPost = "";
        this.img_post= "";
        $('#input_post').val('');
        $('.preloadImg').remove();
      });
    }else{
      this.presentToast("Veuillez remplir le champ avant de faire un post.");
    }
  }

  //Fonction pour convertir une date
  public formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  //fonction pour recupérer une image du téléphone
  getImage() {
    let alert = this.alertCtrl.create({
      title: "Modification de l'image",
      message: 'Voulez-vous modifier votre image de profil',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            let cameraOptions = {
              quality: 50,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              correctOrientation: true
            }
            this.camera.getPicture(cameraOptions).then((imageData) => {
              this.imageURI = imageData;
              this.uploadFile('profil');
            }, (err) => {
            });
          }
        }
      ]
    });
    if(this.id_user == this.idTW){
      alert.present();      
    }
  }

  //Function pour modif le profil
  public modifProfil(){
    let text_bio =  $('.tw_desc').text();
    this.navCtrl.setRoot('ModifDetailsPage',{
      "param_text_bio": text_bio,
      "param_data_groupes": this.categ,
      "param_data_fav_pro": this.mesFavorisPro,
      "param_data_fav_ama": this.mesFavorisAma,
      "param_data_tel": this.tel,
      "param_data_mail": this.mail,
      "param_data_twitter": this.twitter,
      "param_data_facebook": this.facebook,
      "param_data_linkedin": this.linkedin,
      "param_data_insta": this.instagram,
      "foncPro" : this.foncPro,
      param: this.navParams.get("param"),
      idCat: this.navParams.get("idCat")
    });
  }

  //Function back to formulaire pager
  public goBack() {
    if(this.navParams.get("prov") == "agenda"){
      this.navCtrl.setRoot('EventsListPage',{
        param: this.navParams.get("data_agenda")
      });
    } else if(this.navParams.get("prov") == "fav"){
      this.navCtrl.setRoot('AnnuaireFavorisPage');
    } else if(this.navParams.get("prov") == "c_interet"){
      this.navCtrl.setRoot('AnnuaireCentresInteretPage');
    }else if(this.navParams.get("way") == "detailsuggestion"){
        this.navCtrl.setRoot('DetailsugContactPage', {
            id: this.navParams.get('id_contribution'),
            id_cli : this.navParams.get('id_cli')
        });
    }else if(this.navParams.get("prov") == "annuaire"){
      this.navCtrl.setRoot('AnnuairePage',{});
    }else if(this.navParams.get("prov") == "team"){
      this.navCtrl.setRoot('TeamPage',{});
    }else if(this.navParams.get("prov") == "adminpage"){
      this.navCtrl.setRoot('AdminPage',{
        id: this.navParams.get("admin_id")
      });
    }else if(this.navParams.get("prov") == "ent"){
      this.navCtrl.setRoot('DetailEntreprisePage', {
        param: this.navParams.get('id_ent'),
        id_ent: '',
        name: '',
        prov: "home",
        origin: this.navParams.get("origin")
      });
    } else{
      this.navCtrl.setRoot('AnnuairePage', {});
    }
  }

  //Fonction pour mettre la photo sur le serveur
  uploadFile(type) {
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
    }
    if(type == 'profil'){
      console.log(this.imageURI + " IMAGEURI");
      fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/entreprise/profils/upload.php', options)
        .then((data) => {
          let responseImg = [];
          responseImg.push({
            user_id : this.id_user,
            image : name_file,
          });

          this.annuaire.postImageProfil(JSON.stringify(responseImg)).then(data => {
            this.image = id_img;
            loader.dismiss();
            this.presentToast("La photo a été enregistrée avec succès");
          }, (err)=>{
            loader.dismiss();
            this.presentToast("La photo n'a pas pu être enregistrée");
          });
        }, (err) => {
          loader.dismiss();
          this.presentToast("La photo n'a pas pu être enregistrée");
        });
    }else if(type == 'post'){
      fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/post/upload.php', options)
        .then((data) => {
          loader.dismiss();
          $('#input_post').after("<img class='preloadImg' src='https://hautier.teamsmart.fr/images/post/"+name_file+"'/>");
          $('.img-cross-delete').show();
        }, (err) => {
          loader.dismiss();
          this.presentToast("La photo n'a pas pu être enregistrée");
        });
    }
  }

  presentToast(msg) {
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

  public msgTW(){
    this.annuaire.getEmployeById(this.id_user).subscribe(data =>{
      var senderTitle = data[0].prenom+" "+data[0].nom;
      this.contactSrv.getMessageDemandeBySenderReceiver(this.id_user,this.idTW).subscribe(data => {
        if(data.length == 0){
          var params = [];
          params.push({
            user_id_sender: this.id_user,
            user_id_receiver: this.idTW,
            name_sender: senderTitle,
            name_receiver: this.TWname,
            demande : "demande",
            sujet : "sujet",
          });
          this.contactSrv.postMessageDemande(JSON.stringify(params)).then(response => {
            this.contactSrv.getMessageDemandeBySenderReceiver(this.id_user,this.idTW).subscribe(data2 => {
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
  }

  public rdvTW(){
    this.navCtrl.setRoot('AppointmentPage',{
      idTW: this.idTW,
      idSender: this.id_user
    })
  }

}
