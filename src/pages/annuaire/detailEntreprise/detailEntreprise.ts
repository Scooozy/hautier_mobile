import { Component, ViewChild, Directive } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ToastController, Content, LoadingController, IonicPage } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { FavorisServiceProvider } from '../../../providers/favoris-service/favoris-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EventsServiceProvider } from "../../../providers/events-service/events-service";
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage()
@Component({
  selector: 'page-detailEntreprise',
  templateUrl: 'detailEntreprise.html'
})
@Directive({
  selector: '[longPress]'
})
export class DetailEntreprisePage {
  @ViewChild(Nav) nav: NavController;
  @ViewChild(Content) content: Content;
  grid: any;
  id_user: number;
  ent_selected: number;
  title: string;
  employes : any = [];
  lvl1: any = [];
  lvl2: any = [];
  lvl1_lvl2: any = [];
  nbPlaces: number;
  ent: any;
  categ: any;
  mail: string;
  tel: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  image : string;
  description: string;
  list_title: string;
  collabLength: number = 0;
  text: string;
  fsccolor2:string;
  teamcolor2: string;
  mesPosts: any;
  monPost: string = "";
  flag: boolean = false;
  fav:any = [];
  imageURI: any;
  img_post: string = "";
  monIdEnt: number;
  events: any = 0;
  event_title : string = "";
  event_desc : string = "";
  month_short: any;
  _day: any;
  event_id: number = 0;
  event_max: number = 0;
  niveau1 : number = 0;
  niveau2 : number = 0;
  client: number = 0;
  mesPostsLength : number = 0;
  gridLength: number = 0;
  eventType : string = "";
  eventSize: any;
  isadmin: boolean = false;
  ifadmin: boolean = false;

  right_actu: boolean = false;


  constructor(public navCtrl: NavController,public toastCtrl:ToastController, public navParams: NavParams,
              private camera: Camera,private transfer: FileTransfer, public annuaire: AnnuaireServiceProvider,
              public sqlite: SqliteServiceProvider, public favorisSrv:FavorisServiceProvider,public loadingCtrl:LoadingController,
              public platform: Platform,private iab: InAppBrowser, private emailComposer: EmailComposer,
              private alertCtrl:AlertController, private storage: Storage, public Sqlite: SQLite,
              public eventSrv: EventsServiceProvider,  private homeSrv: HomeServiceProvider) {

    this.grid = [];
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
    this.storage.get('fsc').then((val) => {
      if(val){
        this.storage.get('fsccolor2').then((val1) => {
          $('#wave svg path').removeAttr('fill');
          $('#wave svg path').attr('fill',val1);
        });
      }else{
        this.storage.get('teamcolor2').then((val1) => {
          $('#wave svg path').removeAttr('fill');
          $('#wave svg path').attr('fill',val1);
        });
      }
    });
  }

  ionViewWillLeave(){
    //Remove all delegated click handlers
    $(".myBackArrow").off();
  }

  public checkIsMonEnt(id_user){
    this.annuaire.getEntreprise(id_user).subscribe(data => {
      this.monIdEnt = data[0].loc_id;
    });
  }

  //Funtion pour voir plus ou moins su texte de description
  public showMore(){
    if($('#text_bio').text().length > 253){
      $('#text_bio').html(this.text.substring(0, 250) + '...');
      $('#arrow_down').css('display','block');
      $('#arrow_up').css('display','none');
    }else{
      $('#text_bio').text(this.text);
      $('#arrow_down').css('display','none');
      $('#arrow_up').css('display','block');
    }
  }

  //Function permet d'aller directement a la partie contact de la page
  public goDownToContact(){
    let element = document.getElementById("ancreBottom").offsetTop;
    this.content.scrollTo(0, element, 2000);
  }

  //function pour envoyer un mail
  public sendMail(mail){
    let email = {
      to: mail,
      cc: null,
      bcc: null,
      attachments: null,
      subject: null,
      body: null,
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  //Function qui ouvre les différent reseaux sociaux
  public openSocialMedia(type){
    if(type != null)
    {
      if(type == "twitter"){
        this.platform.ready().then(() => {
          this.iab.create('https://twitter.com/'+this.twitter, '_system', 'location= yes,toolbar=no');
        });

      }
      else if (type == "facebook"){
        this.platform.ready().then(() => {
          this.iab.create('https://www.facebook.com/'+this.facebook, '_system', 'location= yes,toolbar=no');
        });

      }
      else if (type == "linkedin"){
        this.platform.ready().then(() => {
          this.iab.create('https://www.linkedin.com/company/'+this.linkedin, '_system', 'location= yes,toolbar=no');
        });

      }
      else if (type == "instagram"){
        this.platform.ready().then(() => {
          this.iab.create('https://www.instagram.com/'+this.instagram, '_system', 'location= yes,toolbar=no');
        });

      }
    }
  }

  //Function qui recupère le user connecté
  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          this.id_user = res.rows.item(0).id_user;
          this.homeSrv.getHasRight(this.id_user,6).subscribe(data => {
            this.right_actu = data;
          });
          this.checkIsMonEnt(this.id_user);
          this.getEnt(this.navParams.get('param'));
          this.getAdminEnt();
          db.executeSql('SELECT * FROM ent_selected', {})
            .then(result => {
              if (result.rows.length != 0) {
                this.ent_selected = result.rows.item(0).id_ent;
                this.getPost(this.navParams.get('param'),this.ent_selected);
              }
          });
        });
    });
  }

  //Function qui get les info de l'ent
  private getEnt(id_ent){
    this.annuaire.getEntreprise1(id_ent).subscribe(data => {
      this.ent = data[0];
      this.niveau1 = this.ent.niveau1;
      this.niveau2 = this.ent.niveau2;
      this.client = this.ent.client;
      this.getEntEvents(this.ent.loc_id);
      this.mail = this.ent.email;
      this.tel = this.ent.phone;
      this.twitter = this.ent.twitter;
      this.facebook = this.ent.facebook;
      this.instagram = this.ent.instagram;
      this.linkedin = this.ent.linkedin;
      this.title = this.ent.title;
      this.image = this.ent.image;
      this.description = this.ent.description;
      var self = this;
      if(this.ent.niveau2 == 1){
        this.getTeam(this.navParams.get('param'));
        this.eventType = "lvl2";
      }else if(this.ent.niveau1 == 1){
        this.getLvl2(this.navParams.get('param'));
        this.eventType = "lvl1";
      }else if(this.ent.client == 1){
        this.getLvl1(this.navParams.get('param'));
        this.eventType = "cli";
      }
      var load = setInterval(function(){
        if($('#img_avatar')!=undefined && $('.img_avatarPost').length >0 && $('.img_avatarPost') != undefined) {
          self.text = $('#text_bio').text();
          if($('#text_bio').text().length >250){
            $('#text_bio').text(self.text.substring(0, 250) + '...');
            $('#arrow_down').css('display','block');
          }
          clearInterval(load);
        }
      },50);
      if( (this.mail != "" && this.mail != null) || (this.tel != "" && this.tel != null) || (this.twitter != "" && this.twitter != null) || (this.facebook != "" && this.facebook != null) || (this.instagram != "" && this.instagram != null) || (this.linkedin != "" && this.linkedin != null) ){
        $('#contact').css("display","block");
      }else{
        $('#contact').css("display","none");
      }
    });
  }

  private getAdminEnt(){
    this.annuaire.getAdminEnt(this.navParams.get('param')).subscribe(data =>{
      for(var i = 0; i < data.length; i++){
        this.ifadmin = true;
        if(data[i].id_user == this.id_user){
          this.isadmin = true;
        }
      }
    });
  }

  private getLvl2(id_ent){
    this.annuaire.getLvl2ListFromLvl1(id_ent).subscribe(data =>{
      this.list_title = "Nos adhérents";
      this.loadStitle();
      this.collabLength = data.length;
      this.lvl1_lvl2 = data;
      this.nbPlaces = data.length;
      if(this.nbPlaces == 0){
        $('#place-none-info').css('display','block');
        $('#loader, #load').hide();
        $('#list-categ-home').css('display','none');
      }else{
        this.generateFullGridClub();
        $('#list_title').css('border-bottom','1px solid '+this.teamcolor2);
      }
    });
  }

  private getLvl1(id_ent){
    this.annuaire.getLvl1List(id_ent).subscribe(data =>{
      this.list_title = "Nos filiales";
      this.loadStitle();
      this.collabLength = data.length;
      this.lvl1_lvl2 = data;
      this.nbPlaces = data.length;
      if(this.nbPlaces == 0){
        $('#place-none-info').css('display','block');
        $('#loader, #load').hide();
        $('#list-categ-home').css('display','none');
      }else{
        this.generateFullGridClub();
        $('#list_title').css('border-bottom','1px solid '+this.teamcolor2);
      }
    });
  }

  //Function get la team de l'ent selctionner
  private getTeam(id_ent){
    this.annuaire.getTeam(id_ent).subscribe(data => {
      this.list_title = "Nos collaborateurs";
      this.loadStitle();
      this.collabLength = data.length;
      this.employes = data;
      this.nbPlaces = data.length;
      if(this.nbPlaces == 0){
        $('#place-none-info').css('display','block');
        $('#loader, #load').hide();
        $('#list-categ-home').css('display','none');
      }else{
        this.generateFullGrid();
      }
    });
  }

  public addFavoris(id_receiver){
    let param = [];
    param.push({
      id_user:this.id_user,
      id_ent: 0,
      id_employe:id_receiver,
      is_entreprise: 0
    });
    this.favorisSrv.postUserFavoris(JSON.stringify(param)).then(response => {
      this.getFav(this.id_user);
    });
  }

  //Fonction pour recup une image pour les post
  getImg(){
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
      this.uploadFile('post');
    }, (err) => {
      console.log(err);
    });
  }

  //fonction pour recupérer une image du téléphone
  getImage() {
    let alert = this.alertCtrl.create({
      title: "Modification de l'image",
      message: 'Voulez-vous modifier l\'image de profil de l\'entreprise',
      buttons: [{
        text: 'Non',
        role: 'cancel'
      },{
        text: 'Oui',
        handler: () => {
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
            this.uploadFile('profil');
          }, (err) => {
            console.log(err);
          });
        }
      }]
    });
    alert.present();
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
    };

    if(type == 'profil'){
      console.log(options);
      console.log(this.imageURI);
      fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/jevents/jevlocations/sad.php', options)
        .then((data) => {
          console.log(data);
          let responseImg = [];
          responseImg.push({
            ent_id : this.navParams.get('param'),
            image : name_file,
          });

          this.annuaire.postImageProfilEnt(JSON.stringify(responseImg)).then(data => {
            this.getTeam(this.navParams.get('param'));
            this.getEnt(this.navParams.get('param'));
            this.getPost(this.navParams.get('param'),this.ent_selected);
            loader.dismiss();
            this.presentToast("La photo a été enregistré avec succès");
          }, (err)=>{
            loader.dismiss();
            this.presentToast("La photo n'a pas pu être enregistré");
          });
        }, (err) => {
          loader.dismiss();
          this.presentToast("La photo n'a pas pu être enregistré");
        });
    }else if(type == 'post'){
      console.log(options);
      console.log(this.imageURI);
      fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/post/upload.php', options)
        .then((data) => {
          console.log(data);
          $('#input_post').append("<img class='preloadImg' src='https://hautier.teamsmart.fr/images/post/"+name_file+"'/>");
          loader.dismiss();

        }, (err) => {
          loader.dismiss();
          this.presentToast("La photo n'a pas pu être enregistré");
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
      console.log('Dismissed toast');
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

  public pressed(id_tuile) {
    this.flag = true;
    this.getFav(this.id_user);
  }
  public released() {
  }

  public getFav(id_user){
    this.favorisSrv.getUserFavoris(id_user).subscribe(data =>{
      this.fav = data;

      for(let i=0; i<this.employes.length;i++){
        $('.icon-hexa-star-'+this.employes[i].id_employe).css('color', 'black');
        $('.icon-hexa-star-'+this.employes[i].id_employe).addClass('icon-favori');
        $('.icon-hexa-star-'+this.employes[i].id_employe).removeClass('icon-favoris-plein');
      }

      for(let i = 0; i< this.fav.length; i++){
        if(this.fav[i].id_employe != 0){
          $('.icon-hexa-star-'+this.fav[i].id_employe).css('color', '#fce300');
          $('.icon-hexa-star-'+this.fav[i].id_employe).removeClass('icon-favori');
          $('.icon-hexa-star-'+this.fav[i].id_employe).addClass('icon-favoris-plein');
        }
      }
    });
  }

  public backToFormualaire(){
    this.flag = false;
  }

  //Function pour la flèche retour
  public goBack() {
    if(this.navParams.get('origin') == 'fav'){
      this.navCtrl.setRoot('AnnuaireFavorisPage');
    }else if(this.navParams.get('origin') == 'liste'){
      this.navCtrl.setRoot('ListEntreprisesPage',{
        param: this.navParams.get('id_categorie')
      });
    } else if(this.navParams.get('origin') == 'annuaire'){
      this.navCtrl.setRoot('AnnuairePage',{});
    }else if(this.navParams.get('origin') == 'adminpage'){
      this.navCtrl.setRoot('AdminPage',{
        id: this.navParams.get('admin_id'),
        prov: 'home',
        lvl: 'n1'
      })
    } else if(this.navParams.get('origin') == 'ent'){
      this.navCtrl.setRoot('DetailEntreprisePage', {
        param: this.navParams.get('id_ent'),
        id_ent: this.navParams.get('param'),
        name: '',
        prov: "home",
        origin: "home"
      });
    }else {
      this.navCtrl.setRoot('home-home',{});
    }
  }

  // Génère la grille avec seulement des tuiles vides
  generateFullGrid() {
    var nb_tiles = this.nbPlaces;
    var ko = 0;
    var ko_if = ko;
    var line = '';
    var clic = null;
    for (var i = 0; i < nb_tiles; i++) {
      if (ko == 2 || ko == ko_if + 4) {
        line = "ko";
        ko_if = ko;
        ko++;
      } else {
        line = "ok";
        ko++;
      }
      var diamond = 'empty_diamond';
      clic = this.employes[i].id_employe;
      var title = this.employes[i].nom+" "+this.employes[i].prenom;

      this.grid.push({
        id: "" + i,
        idBox: "box" + i,
        title: title,
        drag: "",
        drop: "",
        id_line: "" + line,
        clic: "" + clic,
        diamond: "" + diamond,
        dropsuccess: "",
        dragsuccess: "",
        image: this.employes[i].image,
        type: 'employe',
        service: this.employes[i].service,
        imgsize: 'imgEmp'
      });
    }

    this.gridLength = this.grid.length;
    $('#loader, #load').hide();
  }

  // Génère la grille avec seulement des tuiles vides
  generateFullGridClub() {
    var nb_tiles = this.nbPlaces;
    var ko = 0;
    var ko_if = ko;
    var line = '';
    var clic = null;
    for (var i = 0; i < nb_tiles; i++) {
      if (ko == 2 || ko == ko_if + 4) {
        line = "ko";
        ko_if = ko;
        ko++;
      } else {
        line = "ok";
        ko++;
      }
      var diamond = 'empty_diamond';
      clic = this.lvl1_lvl2[i].loc_id;
      var title = this.lvl1_lvl2[i].title;

      this.grid.push({
        id: "" + i,
        idBox: "box" + i,
        title: title,
        drag: "",
        drop: "",
        id_line: "" + line,
        clic: "" + clic,
        diamond: "" + diamond,
        dropsuccess: "",
        dragsuccess: "",
        image: this.lvl1_lvl2[i].image,
        type: 'entreprise',
        imgsize: 'imgEnt'
      });
    }
    this.gridLength = this.grid.length;
    $('#loader, #load').hide();
  }

  public goToPlace(id,type){
    if(type == 0){
      this.navCtrl.setRoot('DetailEntreprisePage', {
        param: id,
        id_ent: this.navParams.get('param'),
        name: this.title,
        prov: "ent",
        origin: "ent"
      });
    }else{
      this.navCtrl.setRoot('place-detail', {
        param: id,
        idCat: "team",
        id_ent: this.navParams.get('param'),
        name: this.title,
        prov: "ent",
        origin: "annuaire"
      });
    }

  }

  public openImg(img){
    $('.img-bg-post').css("background-image","url('https://hautier.teamsmart.fr/images/post/"+img+"')");
    $('.img-bg-post').show();
  }

  public closeImg(){
    $('.img-bg-post').hide();
  }

  //Funcrion pour aller sur la page modif profil de l'ent
  public modifProfil(){
    this.navCtrl.setRoot('ModifDetailsPageEntreprise',{
      "id_ent":this.navParams.get('param'),
      "param_text_bio": this.description,
      "param_data_groupes": this.categ,
      "param_data_tel": this.tel,
      "param_data_mail": this.mail,
      "param_data_twitter": this.twitter,
      "param_data_facebook": this.facebook,
      "param_data_linkedin": this.linkedin,
      "param_data_insta": this.instagram,
      param: this.navParams.get("param"),
      idCat: this.navParams.get("id_categorie"),
      origin: "ent"
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

  //Convetie une date
  public formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  //Function pour mettre un post
  public savePost(){
    let lesReponsesPosts = [];
    if(this.img_post != "" || this.monPost != ""){
        let loader = this.loadingCtrl.create({
            content: "Envoi du post ..."
        });
        loader.present();
      lesReponsesPosts.push({
        id_user : 0,
        post : this.monPost.replace('\\r\\n', '<br/>'),
        is_ent: 1,
        id_ent: this.navParams.get('param'),
        image: this.img_post,
        date: this.formatDate(new Date()),
        cli: this.ent_selected
      });
      this.annuaire.postMesPost(JSON.stringify(lesReponsesPosts)).then(data => {
        let response = data;
        if(response != null){
          let alert = this.alertCtrl.create({
            title: 'Oups...',
            message: "L'envoi de la réponse a connu un problème...",
            buttons: ['Fermer']
          });
          alert.present();
        }else{
          this.presentToast("Publication enregistrée.");
        }
        this.getPost(this.navParams.get('param'),this.ent_selected);
        this.monPost = "";
        this.img_post= "";
        $('#input_post').val('');
        $('.preloadImg').remove();
        loader.dismiss();
      });
    }else{
      this.presentToast("Veuillez remplir le champ ci-dessus avant de faire un post.");
    }
  }

  //Function pour get les posts de l'ent
  private getPost(id_ent,select){
    this.annuaire.getAllPostEnt(id_ent,select).subscribe(data =>{
      this.mesPosts = data;
        for (let i = 0; i < this.mesPosts.length; i++) {
            this.mesPosts[i]['post'] = this.mesPosts[i]['post'].replace(new RegExp('\n','g'), '<br/>');
        }
      this.mesPostsLength = this.mesPosts.length;
      this.mesPosts.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
      //Reverse to descending order
      this.mesPosts.reverse();

      var load = setInterval(function(){
        if($('.imgPost') != undefined && $('.imgPost').length > 0) {
          for(let i = 0; i<data.length;i++){
            if(data[i].image != ""){
              $('.imgPost_'+data[i].id).attr("src", "https://hautier.teamsmart.fr/images/post/"+data[i].image);
              $('.imgPost_'+data[i].id).css('display','block');
            }else{
              $('.imgPost_'+data[i].id).css('display','none');
            }
          }
          clearInterval(load);
        }
      },50);
    });
  }

  private getEntEvents(ent){
    this.eventSrv.getEntEvents(ent).subscribe(data =>{
      this.events = data;
      this.eventSize = this.events.length;
      this.event_max = this.events.length;
      if(this.events.length != 0){
        this.setEventContent();
      }
    });
  }

  private getEventDetail(){
      this.navCtrl.setRoot('event-detail', {
          idEvent: this.events[this.event_id]["evdet_id"],
          type : "event",
          id : 0,
          my_user_id: this.id_user,
          id_ent : this.ent,
          originePage : 'detail_ent'
      });

  }

  public nextEvent(){
    if(this.event_id != this.event_max-1){
      this.event_id++;
    }else{
      this.event_id = 0;
    }
    this.setEventContent();
  }

  public previousEvent(){
    if(this.event_id == 0){
    this.event_id = this.event_max-1;
    }else{
      this.event_id--;
    }
    this.setEventContent();
  }

  private setEventContent(){
    console.log(this.events);
    this.event_title = this.events[this.event_id].summary;
    this.event_desc = this.events[this.event_id].description;
    this._day = this.events[this.event_id].day;
    this.month_short = this.events[this.event_id].month_short;
    console.log(this.event_title + "TITLE");
    console.log(this.event_desc + "DESC");
    console.log(this._day + "DAY");
    console.log(this.month_short + "MONTH");
  }

  //Function change between bio and post
  private change(param) {
    $('.filter').removeClass('active_tab');
    if (param == 0) {
      $('#contentEnt').show();
      $('#contentMesPosts').hide();
      $('#filter_bio').addClass('active_tab');
    } else {
      $('#contentMesPosts').show();
      $('#contentEnt').hide();
      $('#filter_post').addClass('active_tab');
    }
  }


  private loadStitle(){
    var load = setInterval(function(){
      if($('.titre_lvl').width() != 0){
        $('.trait_lvl').css("width",$(".st-fav").width()-$('.titre_lvl').width()-10+"px");
        clearInterval(load);
      }
    },100);
  }

  public rdvEnt(){
    this.navCtrl.setRoot('AppointmentPage',{
      id_ent: this.navParams.get('param'),
      idSender: this.id_user
    })
  }

  public goToModifEnt(){
    let lvl = '';
    if(this.niveau1 == 1){
      lvl = 'n1';
    }else if(this.niveau2 == 1){
      lvl = 'n2';
    }
    this.navCtrl.setRoot('AdminPage',{
      id: this.navParams.get('param'),
      prov: 'detailEnt',
      lvl: lvl
    });
  }

  public addEvent(){
    if(this.eventType == "lvl1"){
      this.navCtrl.setRoot('events-formulaire',{
        lvl1 : this.eventType,
        loc_id : this.navParams.get('param')
      })
    }else if(this.eventType == "lvl2"){
      this.navCtrl.setRoot('events-formulaire',{
        lvl2 : this.eventType,
        loc_id : this.navParams.get('param')
      })
    }else if(this.eventType == "cli"){
      this.navCtrl.setRoot('events-formulaire',{
        cli : this.eventType,
        loc_id : this.navParams.get('param')
      })
    }
  }

}
