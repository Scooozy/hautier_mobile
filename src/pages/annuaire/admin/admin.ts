import { Component, ViewChild, Directive } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, Nav, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import {HomeServiceProvider} from '../../../providers/home-service/home-service';
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { EmailComposer } from '@ionic-native/email-composer';
import {ContentserviceProvider} from "../../../providers/contentservice/contentservice";

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {
  @ViewChild(Nav) nav: NavController;

  id_user: number;
  ent: any;
  places:any;
  placesValidation: any;
  nbPlaces: number;
  entSend: any;

  grid: any = [];
  diamonds: any;
  imageURI: string = '';
  img_post: string = '';
  title: string = "";
  n1_title: string = "";
  team_title: string = "";
  lvl: string;
  lvl2: any = [];
  lvl2Length: number = 0;
  part: string;
  id_ent: any;
  isPart: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public annuaire: AnnuaireServiceProvider,
              public sqlite: SqliteServiceProvider,private homeSrv:HomeServiceProvider, private transfer: FileTransfer,
              public toastCtrl:ToastController,public loadingCtrl: LoadingController, private camera: Camera,
              public menu: MenuController,private emailComposer: EmailComposer, public Sqlite: SQLite,
              public alertCtrl:AlertController, private contentSrv: ContentserviceProvider) {
    this.getUser();

    this.lvl = this.navParams.get('lvl');
    this.part = this.navParams.get('part');
    console.log(this.part);
    this.id_ent = this.navParams.get('id');
    if(this.navParams.get('lvl') == 'n2'){
      this.title = "PARAMÉTRAGE DE MON SERVICE";
      this.n1_title = "Mon service";
      this.team_title = "Membres de la team";
    }else if(this.navParams.get('lvl') == 'n1'){
      this.title = "PARAMÉTRAGE DE MA FILIALE";
      this.n1_title = "Mon filiale";
      this.team_title = "Les services";
    } else if(this.part == '0'){
      this.isPart = true;
        this.title = "PARAMÉTRAGE DE MON SERVICE";
        this.n1_title = "Mon service";
    }


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
        this.getEntreprise(this.navParams.get('id'));
      });

    });
  }

  public getEntreprise(user){
      if (this.part == '0'){
          this.annuaire.getPartenaireAdmin(this.id_user, this.id_ent).subscribe(data => {
            this.ent = data[0];
            $('.trait_profil').css("width",$(".st-profil").width()-$('.titre_profil').width()-15+"px");
            $('#loader, #load').hide();
          })
      } else {
          this.annuaire.getEntreprise1(user).subscribe(data => {
              this.ent = data[0];
              if(this.lvl == "n2"){
                  this.getTeam(this.ent.loc_id);
              }else{
                  this.getLvl2(this.ent.loc_id);
              }
          });
      }
  }

  private getLvl2(id_ent){
    this.annuaire.getAllLvl2ListFromLvl1(id_ent).subscribe(data => {
      this.lvl2 = data;
      this.lvl2Length = data.length;
      $('.trait_profil').css("width",$(".st-profil").width()-$('.titre_profil').width()-15+"px");
      $('.trait_team').css("width",$(".st-team").width()-$('.titre_team').width()-15+"px");
      $('#loader, #load').hide();
    });
  }

  private getTeam(id_ent){
    this.annuaire.getAllTeam(id_ent).subscribe(data => {
      this.places = data;
      this.nbPlaces = data.length;
      $('.trait_profil').css("width",$(".st-profil").width()-$('.titre_profil').width()-15+"px");
      $('.trait_team').css("width",$(".st-team").width()-$('.titre_team').width()-15+"px");
      $('#loader, #load').hide();
    });
  }

  public accept(id){
    let data = [];
    data.push({
      user_id: id,
    });
    this.annuaire.postPublishedEmploye(JSON.stringify(data)).then(dataRes =>{
      let response = dataRes;
      if(response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "Votre demande a rencontré un problème.",
          buttons: ['Fermer']
        });
        alert.present();
      }else{
        //Réactualise la team
        this.getTeam(this.ent.loc_id);
        this.getNewUserEnt();
      }
    });
  }

  public refuse(id){
    let data = [];
    data.push({
      user_id: id
    });
    this.annuaire.postRefuseEmploye(JSON.stringify(data)).then(dataRes =>{
      let response = dataRes;
      if(response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "Votre demande a rencontré un problème.",
          buttons: ['Fermer']
        });
        alert.present();
      }else{
        //Réactualise la team
        this.getTeam(this.ent.loc_id);
        this.getNewUserEnt();
      }
    });
  }

    private displayDeleteChoice(id, prenom, nom) {
        let alert = this.alertCtrl.create({
            title: "Suppression d'un compte",
            message: 'Etes-vous de vouloir supprimer ' + prenom + ' ' + nom + ' ?',
            buttons: [{
                text: 'OUI',
                handler: () => {
                    this.delete(id);
                }
            }, {
                text: 'NON',
            }]
        });
        alert.present();
    }

    public delete(id){
        let data = [];
        data.push({
            user_id: id
        });
        this.annuaire.postDeleteEmploye(JSON.stringify(data)).then(dataRes =>{
            let response = dataRes;
            if(response != null){
                let alert = this.alertCtrl.create({
                    title: 'Oups...',
                    message: "Votre demande a rencontré un problème.",
                    buttons: ['Fermer']
                });
                alert.present();
            }else{
                //Réactualise la team
                this.getTeam(this.ent.loc_id);
                this.getNewUserEnt();
            }
        });
    }

  public acceptEnt(id){
    let data = [];
    data.push({
      loc_id: id,
    });
    this.annuaire.postPublishedEnt(JSON.stringify(data)).then(dataRes =>{
      let response = dataRes;
      if(response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "Votre demande a rencontré un problème.",
          buttons: ['Fermer']
        });
        alert.present();
      }else{
        //Réactualise la team
        this.getLvl2(this.ent.loc_id);
        this.getNewEnt();
      }
    });
    // contact@estellealacrea.fr
  }

  public refuseEnt(id){
    let data = [];
    data.push({
      loc_id: id
    });
    this.annuaire.postRefuseEnt(JSON.stringify(data)).then(dataRes =>{
      let response = dataRes;
      if(response != null){
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "Votre demande a rencontré un problème.",
          buttons: ['Fermer']
        });
        alert.present();
      }else{
        //Réactualise la team
        this.getLvl2(this.ent.loc_id);
        this.getNewEnt();
      }
    });
  }

  public getNewUserEnt(){
    this.contentSrv.getNewUserEnt(this.id_user).subscribe(res =>{
      if(res.length != 0){
        $('#side-menu-right, ion-menu .parament').append("<div class='pastille'></div>");
      }else{
        $('#side-menu-right .pastille, ion-menu .parament .pastille').remove();
      }
    });
  }

  public getNewEnt(){
    this.contentSrv.getNewEnt(this.id_user).subscribe(res =>{
      if(res.length != 0){
        $('#side-menu-right, ion-menu .paramn1').append("<div class='pastille'></div>");
      }else{
        $('#side-menu-right .pastille, ion-menu .paramn1 .pastille').remove();
      }
    });
  }

  public sendMail(){
    var html = "<p>Bonjour et bienvenue sur Teamsmart,</p>";
      html += "</br>";
      html += "<p>Suite à l’inscription de votre entreprise sur l’application, vous pouvez dès à présent configurer votre compte et découvrez ce que Teamsmart peut vous offrir.</p>";
      html += "<p>Restez connecté à votre Team où que vous soyez.</p>";
      html += "<p>Il est parfois difficile d’être tous connectés lors de déplacement ou même au bureau. Grâce à Teamsmart, tout le monde peut rester informé et échangé sur son téléphone. À vous de jouer !</p>";
      html += "<br/>";
      html += "<p>Application Android : </p>";
      html += "<a href='https://play.google.com/store/apps/details?id=com.lrmarketing.teamsmart'>https://play.google.com/store/apps/details?id=com.lrmarketing.teamsmart</a>";
      html += "<p>Application iOS : </p>";
      html += "<a href='https://itunes.apple.com/fr/app/teamsmart/id1378958267?mt=8'>https://itunes.apple.com/fr/app/teamsmart/id1378958267?mt=8</a>";
    let email = {
      to: null,
      cc: null,
      bcc: null,
      attachments: null,
      subject: "Inscription TeamSmart",
      //body: "Bonjour, suite à l'intégration de notre entreprise dans l'application TeamSmart nous vous demandons de vous y inscrire afin que l'ensemble des membres de l'entreprise y soit présent. https://play.google.com/store/apps/details?id=com.lrmarketing.teamsmart",
      body : html,
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  public goBack() {
    if(this.navParams.get('prov') == 'detailEnt'){
      this.navCtrl.setRoot('DetailEntreprisePage', {
        param: this.navParams.get('id'),
        id_categorie: 0,
        origin: 'annuaire'
      });
    }else if(this.navParams.get('prov') == 'detailPart'){
        this.navCtrl.setRoot('PartenairedetailPage', {
            param: this.navParams.get('id'),
            id_categorie: 0,
            origin: 'annuaire',
            image: this.img_post,
        });
    }else{
      this.navCtrl.setRoot('home-home');
    }
  }

  public goToModifProfilEnt(){
    if(this.part = "0"){
        this.annuaire.getPartenaireAdmin(this.id_user,this.ent.loc_id).subscribe(data => {
            this.entSend = data[0];
            console.log(this.ent.loc_id);
            console.log(this.navParams.get('prov'));
            console.log(this.lvl);
            this.navCtrl.setRoot('ModifDetailsPageEntreprise',{
                "param": this.ent.loc_id,
                "param_text_bio": this.entSend.description,
                "param_data_tel": this.entSend.phone,
                "param_data_mail": this.entSend.email,
                "param_data_twitter": this.entSend.twitter,
                "param_data_facebook": this.entSend.facebook,
                "param_data_linkedin": this.entSend.linkedin,
                "param_data_insta": this.entSend.instagram,
                "prov": this.navParams.get('prov'),
                "part": this.part
            });
        });
    } else {
        this.annuaire.getEntreprise1(this.ent.loc_id).subscribe(data => {
            this.entSend = data[0];
            console.log(this.ent.loc_id);
            console.log(this.navParams.get('prov'));
            console.log(this.lvl);
            this.navCtrl.setRoot('ModifDetailsPageEntreprise',{
                "param": this.ent.loc_id,
                "param_text_bio": this.entSend.description,
                "param_data_tel": this.entSend.phone,
                "param_data_mail": this.entSend.email,
                "param_data_twitter": this.entSend.twitter,
                "param_data_facebook": this.entSend.facebook,
                "param_data_linkedin": this.entSend.linkedin,
                "param_data_insta": this.entSend.instagram,
                "prov" : this.navParams.get('prov'),
                'lvl': this.lvl
            });
        });
    }

  }

  //fonction pour recupérer une image du téléphone
  public getImage() {
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
      this.uploadFile();
    }, (err) => {
      console.log(err);
    });
  }

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

    fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/jevents/jevlocations/upload.phphttps://hautier.teamsmart.fr/images/jevents/jevlocations/upload.php', options).then((data) => {
      let responseImg = [];
      responseImg.push({
        ent_id : this.navParams.get('id'),
        image : name_file,
      });

      this.annuaire.postImageProfilEnt(JSON.stringify(responseImg)).then(data => {
        loader.dismiss();
        this.presentToast("La photo a été enregistré avec succès");
      }, (err)=>{
        loader.dismiss();
        this.presentToast("La photo n'a pas pu être enregistrée");
      });
    }, (err) => {
      loader.dismiss();
      this.presentToast("La photo n'a pas pu être enregistrée");
    });
  }

  //Function chaine string aléatoire pour identifiant image
  private makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  private  presentToast(msg) {
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

  //Fonction pour convertir une date
  public formatDate(date) {
    var d = new Date(date.replace(/-/g, "/")),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  public goToTW(id){
    this.navCtrl.setRoot('place-detail', {
      param: id,
      idCat: 'team',
      image: null,
      prov: 'adminpage',
      admin_id: this.navParams.get('id')
    });
  }

  public goToEnt(id){
    this.navCtrl.setRoot('DetailEntreprisePage', {
      param: id,
      idCat: 'team',
      image: null,
      origin: 'adminpage',
      admin_id: this.navParams.get('id')
    });
  }
}
