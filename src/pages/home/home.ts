import {Component, ViewChild, Directive} from '@angular/core';
import {
    NavController, MenuController, AlertController, NavParams, Platform, ToastController,
    LoadingController, IonicPage
} from 'ionic-angular';
import {Nav} from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import * as $ from 'jquery';
import {Events} from 'ionic-angular';
import {Vibration} from '@ionic-native/vibration';
import {Storage} from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import {Camera} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";

// PROVIDERS
import {SqliteServiceProvider} from '../../providers/sqlite-service/sqlite-service';
import {MeteoServiceProvider} from '../../providers/meteo-service/meteo-service';
import {HomeServiceProvider} from '../../providers/home-service/home-service';
import { ContactServiceProvider } from '../../providers/contact-service/contact-service';
import { ContentserviceProvider } from '../../providers/contentservice/contentservice';
import { AnnuaireServiceProvider } from '../../providers/annuaire-service/annuaire-service';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import {Market} from "@ionic-native/market";
import {DomSanitizer} from "@angular/platform-browser";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import {VideoPlayer} from "@ionic-native/video-player";
import {StreamingVideoOptions, StreamingMedia} from "@ionic-native/streaming-media";
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import {AppVersion} from "@ionic-native/app-version";
import { NewsServiceProvider } from '../../providers/news-services/news-services';

@IonicPage({
  name : 'home-home',
  segment : 'home-home'
})
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
@Directive({
    selector: '[longPress]'
})
export class HomePage {
  inspect: boolean;
  @ViewChild(Nav) nav: NavController;
  user: any;
  userContact: number;
  name: string;
  prenoms: string;
  user_info:any;
  bgImage:any;
  partenaire:any = [];
  partenaire_fixe: any =[];
  version: any;
  rdv: any = [];
  allRdv: any = [];
  validRdv: any = [];
  waitRdv: any = [];
  refuseRdv:any = [];
  flag_rdv: string = "";

  grid: any = [];
  diamonds: any;
  _diamonds: any = [];
  _nbFixe: number;
  nbTiles: number;
  flag: boolean;
  removeTile: boolean = false;
  nbCross: number = 0;
  meteo: any;
  date : any;
  picto : any;
  titre: any;
  message: any;
  cross: any;
  vigilance: any;
  video: any;

  teamcolor1: string = "#678E9B"; // bleu
  teamcolor2: string = "#D85756"; // rouge
  teamcolorB: string = "#D85756"; // bleu
  teamcolorR: string = "#950054"; // violet
  teamcolorJ: string = "#97BF0E"; // vert
  teamcolorG: string = "#F2F2F2"; // gris
  teamcolorDG: string = "#39414c"; // dark gris

  id_user: number;
  ent: any;
  id_ent:any;
  id_ent_FSC: number = 3;
  fsc: boolean;
  ent_select : any = 1;

  nb_notif: number;
  nb_notif_msg: number;
  nb_notif_rdv: number;
  dataNotification: any = [];

  img_post : string = "";
  monPost: string = "";
  lesReponsesPosts: any;
  imageURI:any;
  footerMenu: any = [];
  private danger: any;
  lat: any;
  long: any;
  city: any;
  ville: any;
  piece_jointe :any;
  type: any;
  mime_content_type: any;
  image_danger: any;

  constructor(private toastCtrl:ToastController, public navCtrl: NavController,private meteoSrv:MeteoServiceProvider,
              private storage: Storage, public statusBar: StatusBar, public navParams: NavParams, public Sqlite: SQLite,
              private camera: Camera, private transfer: FileTransfer, public sqlitesrv: SqliteServiceProvider,
              public events: Events, public menu: MenuController, public loadingCtrl: LoadingController,
              public vibration: Vibration, public alertCtrl: AlertController, private push: Push,
              public annuaire: AnnuaireServiceProvider, public contentSrv: ContentserviceProvider,
              private platform: Platform, private homeSrv:HomeServiceProvider,private annuaireSrv:AnnuaireServiceProvider,
              private contactSrv: ContactServiceProvider, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder,
              private market: Market, private sanitizer : DomSanitizer, public appBrowser : InAppBrowser,
              private file: File, private fileOpener: FileOpener, private androidPermission: AndroidPermissions,
              private videoPlayer: VideoPlayer, private streamingMedia: StreamingMedia, private youtube: YoutubeVideoPlayer,
              private appVersion: AppVersion, private newsSrv: NewsServiceProvider) {


      $("ion-footer").css("display", "block");
      $("ion-header").css("display", "block");
      $("ion-footer").css('visibility','visible');
      this.getConnected();


  }

  ionViewWillLeave(){
      $(".empty").css("display", "none");
      $(".myBackArrow").css("display", "block");
  }

  ionViewDidEnter(){
      $(".myBackArrow").off();
      $(".empty").css("display", "block");
      $(".myBackArrow").css("display", "none");
  }

  //Recup les rdv
  public getRdv(id_user){
      this.annuaireSrv.getUserRdv(this.userContact).subscribe(data =>{
        this.rdv = data;

        this.allRdv = this.rdv;
        if(data.length == 0){
            $('#load, #loader').hide();
        }else{
            var self = this;
            let compteur = 0;

            data.forEach(rdv => {
                if(rdv.id_receiver == id_user && rdv.confirmed == null )
                    this.storage.set('nbNotifrdv', 1 );
                    $(".showNotifRDV").css("display", "block");
            });

        }
      });
  }

  public getConnected() {
      this.Sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name="connectContact"', {})
          .then(_res => {
            if(_res.rows.length == 0){
              this.getConnected();
            }else{
              this.Sqlite.create({
                name: 'ionicdb.db',
                location: 'default'
              }).then((db: SQLiteObject) => {
                db.executeSql('SELECT * FROM connectContact', {}).then(res => {
                    if (res.rows.length != 0) {
                        if (res.rows.item(0).connected == 0) {
                            this.navCtrl.setRoot('ConnexionPage', {});
                        }else{
                          this.contentSrv.getUserAccess(res.rows.item(0).id_user).subscribe(data => {
                            if(data == "Access denied"){
                              this.navCtrl.setRoot('ConnexionPage');
                              let alert = this.alertCtrl.create({
                                title: '',
                                message: "Votre compte n'est plus actif. Merci de contacter votre administrateur.",
                                buttons: ['Fermer']
                              });
                              alert.present();
                            }
                          });
                          if(this.navParams.get('origin') != "" && this.navParams.get('origin') != null && this.navParams.get('origin') != undefined){
                            if(this.navParams.get('origin') == 'connect'){
                              this.events.publish('user:connected', res.rows.item(0).id_user);
                            }
                          }
                            this.checkDidactitiel();
                            this.pushSetup();
                            this.user = res.rows.item(0).id_user;
                            this.homeSrv.initParametters(this.user).subscribe(data => {
                              console.log(data);
                            });
                            this.getDanger(this.user);
                            this.getColors(this.user);
                            this.annuaireSrv.GetMyEntClient(this.user).subscribe(data => {
                                if(data.length != 0){
                                    this.saveEntTile(data[0].id_e);
                                }else{
                                    this.annuaireSrv.GetMenuClient(this.user).subscribe(data1 => {
                                        this.saveEntTile(data1[0].cli);
                                    },error => {
                                        this.getConnected();
                                    });
                                }
                            },error => {
                                this.getConnected();
                            });
                            this.annuaire.getEmployeById(this.user).subscribe(data => {
                                this.user_info = data[0];
                                if(this.user_info.image != undefined){
                                    this.bgImage = "https://hautier.teamsmart.fr/images/entreprise/profils/"+this.user_info.image;
                                }
                            },error => {
                                this.getConnected();
                            });
                        }
                    } else {
                        this.navCtrl.setRoot('ConnexionPage', {});
                    }
                });
              });
            }
            this.getRdv(this.id_user);
          });
      });
  }

  public checkVersion(){
    this.appVersion.getVersionNumber().then(
      (versionNumber) => {
        this.version = versionNumber;
        this.homeSrv.checkAppVersion(this.version).subscribe(data => {
          if(!data){
            if (this.platform.is("android")) {
              let alert = this.alertCtrl.create({
                title: 'Mise à jour',
                message: "Pour continuer d'utiliser l'application, merci d'effectuer la dernière mise à jour.",
                buttons: [{
                  text: 'Mettre à jour',
                  handler: () => {
                    this.market.open('com.teamsmart.hautier3');
                  }
                }, {
                  text: 'Non',
                  role: 'cancel',
                  handler: () => {
                    this.platform.exitApp();
                  }
                }
                ]
              });
              alert.present();
            }else{
              let alert = this.alertCtrl.create({
                title: 'Mise à jour',
                message: "Pour continuer d'utiliser l'application, merci d'effectuer la dernière mise à jour.",
                buttons: [{
                  text: "J'ai compris",
                  role: 'cancel'
                }]
              });
              alert.present();
            }
          }
        });
      },
      (error) => {
        console.log(error);
      });
  }

    private checkDidactitiel(){
      this.Sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM didactitiel', {})
          .then(res => {
            console.log(res.rows.item(0));
            if(res.rows.item(0) == undefined){
              this.showDidactitiel();
            } else if(res.rows.item(0).vu == 0){
              this.showDidactitiel();
            }
          });
      });
    }

    private saveEntTile(id_e){
      this.Sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM ent_selected', {}).then(res => {
          if (res.rows.length != 0) {
            this.ent_select = res.rows.item(0).id_ent;
          } else {
            this.ent_select = id_e;
            this.sqlitesrv.updateEntSelected(this.ent_select, 0);
          }
          $('.logo_header_team_smart').show();
          db.executeSql('SELECT * FROM home_diamond WHERE user_id = "' + this.user + '" AND ent_diamond = ' + this.ent_select, {}).then(res => {

            this.entPartenaire();
            if (res.rows.length != 0) {
                this.diamonds = [];
                for (var i = 0; i < res.rows.length; i++) {
                    this.diamonds.push(res.rows.item(i));
                    this._diamonds.push(res.rows.item(i));

                }
                this.checkTiles(this.diamonds);
                this.cross = $("#losange-detail-box").html();
            } else {
              this.sqlitesrv.saveDiamond(2, 0, '', 'icon-agenda', 'Mon agenda', 'box0', 'ok', '', 'openCalendar,0', 'hexa-pink', 'true', 'true', 'onDragComplete($data,$event)', 'onDropCompleteRemove($data,$event,1)', this.ent_select, this.user);
              this.sqlitesrv.saveDiamond(7, 0, '', 'icon-contact', 'Messagerie', 'box1', 'ok', '', 'messagerie,0', 'hexa-vert', 'true', 'true', 'onDragComplete($data,$event)', 'onDropCompleteRemove($data,$event,2)', this.ent_select, this.user);
              this.sqlitesrv.saveDiamond(0, 0, '', '', '', 'box2', 'ko', this.ent_select, 'detail_ent,' + this.ent_select, 'hexa-gris', 'true', 'true', 'onDragComplete($data,$event)', 'onDropCompleteRemove($data,$event,3)', this.ent_select, this.user);
              this.getConnected();
            }
            this.getMsgNotifs(this.user);
            this.getNewsNotif(this.user);
          });
        });
      });
    };

    pushSetup(){
        const options: PushOptions = {
            android: {
                senderID:'714756472177'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            }
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('accept').subscribe((data) => {
            console.log("ACCEPT")
        });

        //Réception d'un notification
        pushObject.on('notification').subscribe((notification: any) =>{
            this.dataNotification = [];
            if(notification.additionalData.coldstart){
                console.log("COLDSTART");
            } else if(notification.additionalData.foreground){
                this.storage.set('nbNotif', 1 );
                let toast;
                if(notification.additionalData.type == 'sondage'){
                  toast = this.toastCtrl.create({
                    message: 'Un nouveau sondage est disponible : '+notification.message,
                    duration: 5000,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: "Voir"
                  });
                }else{
                  toast = this.toastCtrl.create({
                    message: 'Vous avez reçu un message de '+notification.title+'. '+notification.message,
                    duration: 5000,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: "Voir"
                  });
                }

                let duration:number = 5000;
                let elapsedTime:number = 0;
                let intervalHandler = setInterval( () => { elapsedTime += 10; },10);

                if(notification.additionalData.type == 'sondage') {
                  this.navCtrl.setRoot('RepondreContactPage', {
                    param: notification.additionalData.id_sondage
                  });
                }else if(notification.message == 'Nouvelle demande de rendez-vous.'){
                    toast.onDidDismiss((data, role) => {
                      if (role == "close") {this.navCtrl.push('RendezVousEventPage');}
                      this.storage.set('nbNotifrdv', 1 );

                    });
                }else {
                  this.storage.set('nbNotif', 1);
                  this.storage.set('nbNotifmsg', 1);
                  toast.onDidDismiss((data, role) => {
                    if (role == "close") {
                      this.navCtrl.push('DemandesContactPage');
                    }
                  });

                }

                toast.present();

                this.storage.get('id_user_sender_notification').then((val) => {
                    if(JSON.parse(val) != null){
                        let data = JSON.parse(val)
                        //Insertion des value deja existante dans le storage
                        for(let i = 0; i<data.length;i++){
                            this.dataNotification.push(data[i]);
                        }
                        //Insertion de la nouvelle notification
                        this.dataNotification.push(notification.additionalData.param1);
                    }else{
                        //Insertion de la nouvelle notification si storage vide
                        this.dataNotification.push(notification.additionalData.param1);
                    }

                    this.storage.set('id_user_sender_notification', JSON.stringify(this.dataNotification));
                    this.storage.get('id_user_sender_notification').then((val) => {
                      // empty
                    });
                });
            }
        });
    }

    private getColors(user){
      this.storage.set('teamcolor1',this.teamcolor1);
      this.storage.set('teamcolor2',this.teamcolor2);
      this.storage.set('teamcolorB',this.teamcolorB);
      this.storage.set('teamcolorR',this.teamcolorR);
      this.storage.set('teamcolorJ',this.teamcolorJ);
      this.storage.set('teamcolorG',this.teamcolorG);
    }

    private checkTiles = function (results) {
        this.grid = [];
        this.nbTiles = results.length;
        this.homeSrv.getFooterMenu(this.ent_select).subscribe(items =>{
          this.footerMenu = [];
          for(var i = 0; i < items.length; i++){
            this.footerMenu.push({
              id: items[i].id,
              icon: items[i].icon
            })
          }
          if (results.length == 0) {
            this.generateFullGrid(0);
          } else {
            this.generateEndGrid(results);
          }
        });
        $("ion-content").css('overflow', "hidden");
        if (results.length >= 15) {
            $("ion-content").css('overflow', "scroll");
        }
    };

    public openProfil(){
      this.navCtrl.setRoot('place-detail',{
        param : this.user,
        idCat: 'team'
      })
    }

    //Fonction pour publier un post
    public savePost(){
        let loader = this.loadingCtrl.create({
            content: "Envoi du post ..."
        });
        loader.present();
        this.monPost = this.monPost.replace('\\r\\n', '<br/>');
      if(this.img_post != "" || this.monPost != ""){
        this.lesReponsesPosts = [];
        this.lesReponsesPosts.push({
          id_user : this.user,
          post : this.monPost,
          is_ent: 0,
          image: this.img_post,
          date: this.formatDate(new Date()),
          cli: this.ent_select
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
            this.presentToast("Publication enregistrée.");
          }
          //this.getPost(this.user);
          this.monPost = "";
          this.img_post= "";
          $('#input_post').val('');
          $('.preloadImg').remove();
          loader.dismiss();
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

    //Fonction pour recup une image pour les post
    public getImg(){
      this.displayImgChoice();
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

    //Function chaine string aléatoire pour identifiant image
    public makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    //Fonction pour mettre la photo sur le serveur
    private uploadFile(type) {
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
      fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/post/upload.php', options).then((data) => {
          loader.dismiss();
          $('#input_post').after("<img class='preloadImg' src='https://hautier.teamsmart.fr/images/post/"+data['response']+"'/>");
          $('.img-cross-delete').show();
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

    // Générer la grille avec les tuiles pleines puis avec les tuiles vides
    private generateEndGrid = function (results) {
        for (var i = 0; i < results.length; i++) {
            let formInspect = false;
            let classe = results[i].on_click.split(',');
            if(classe[0] == 'formTile'){
              for(var ii = 0; ii < this.footerMenu.length;ii++){
                if(classe[1] == this.footerMenu[ii].id){
                  formInspect = true;
                }
              }
            }else{
              formInspect = true;
            }

            if(formInspect){
              this.grid.push({
                id: i + 1,
                icon: results[i].icon,
                idBox: results[i].id_box,
                id_bdd: parseInt(results[i].id_bdd),
                id_tuile: results[i].id_tuile,
                id_list_fav: results[i].id_list_fav,
                title: results[i].title,
                drag: results[i].on_drag,
                drop: results[i].on_drop,
                id_line: results[i].id_line,
                clic: results[i].on_click,
                classe: classe[0],
                diamond: results[i].diamond_class,
                dropsuccess: results[i].on_drop_success,
                dragsuccess: results[i].on_drag_success,
                dragstart: 'onDragStart("li' + (i + 1) + 's")',
                shake: 'shake-rotate',
                longPress: 'itemOnLongPress()',
                remove_diamond: 'icon-croix delete-diamond',
                dom: "dom" + (i + 1),
                transform: 'true'
              });
            }
        }

        // Vérification de la position de la dernière tuile décalée
        var start = 3;
        var ko;
        var ko_if = ko;

        if (results.length >= 3) {
            start = 4;
            if (results[parseInt(results.length) - 1].id_line == "ko") {
                ko = 1;
                ko_if = ko;
            } else if (results[parseInt(results.length) - 2].id_line == "ko") {
                ko = 2;
                ko_if = ko;
            } else if (results[parseInt(results.length) - 3].id_line == "ko") {
                //var start = 2;
                ko = 3;
                ko_if = ko;
            } else if (results[parseInt(results.length) - 4].id_line == "ko") {
                //var start = 2;
                ko = 4;
                ko_if = ko;
            }
        } else if (results.length == 1) {
            ko = 2;
            ko_if = ko;
        } else if (results.length == 2) {
            start = 2;
            ko = 2;
            ko_if = ko;
        }

        var max_tiles = 0;
        for (var cpt = 0; cpt < results.length; cpt = cpt + 2) {

            if (results.length >= 17) {
                if (results.length % 2 == 0) {
                    max_tiles = results.length + 2;
                } else {
                    max_tiles = results.length + 1;
                }
            } else {
                max_tiles = 17;
            }
        }

        // Remplir  l'objet grid avec des tuiles vides mais bien positionées
        var line;
        var nb_tiles = 17;
        if (results.length >= 17) {
            nb_tiles = max_tiles;
        }
        for (var i = 0; i < nb_tiles; i++) {
            if (i >= results.length) {
                var title = "";
                var clic = "";
                var diamond = "empty_diamond";
                if (i == results.length) {
                    title = "";
                    clic = "addPage";
                    diamond = "add_diamond";
                }
                if (ko == start || ko == ko_if + 4) {
                    line = "ko";
                    ko_if = ko;
                    ko++;
                } else {
                    line = "ok";
                    ko++;
                }
                this.grid.push({
                    id: i + 1,
                    idBox: "box" + i,
                    id_bdd: "",
                    id_tuile: null,
                    id_list_fav: null,
                    title: title,
                    drag: "",
                    drop: "",
                    id_line: line,
                    clic: "" + clic,
                    diamond: diamond,
                    dropsuccess: "",
                    dragsuccess: "",
                    dragstart: "",
                    transform: 'false'
                });
            }
        }
        var id_line = 2;
        var id_line1 = 0;
        for (var i = 0; i < this.grid.length; i++) {
            if (id_line == i) {
                this.grid[i].id_line = 'ko';
                id_line = id_line + 3;
            } else {
                this.grid[i].id_line = 'ok';
            }
            if (id_line1 == i) {
                this.grid[i].id_line = 'ok okl';
                id_line1 = id_line1 + 3;
            }
        }

        var self = this;
        var load = setInterval(function() {
          if ($('.add_diamond').length != 0){
            $(".hexa-bleu").css("background-color", self.teamcolorB);
            $(".hexa-pink").css("background-color", self.teamcolorR);
            $(".hexa-vert").css("background-color", self.teamcolorJ);
            $(".hexa-jaune").css("color", "#000");
            $(".hexa-gris").css("background-color", self.teamcolorG);
            $('.hexa-dark-gris').css("background-color",self.teamcolorDG);
            $('#load, #loader').hide();
            for (var u = 0; u < self.grid.length; u++) {
              if (self.grid[u].title == "" && self.grid[u].icon == "" && self.grid[u].clic != "") {
                console.log('ID BDD', self.grid[u].id_bdd);
                self.annuaireSrv.getPlace(self.grid[u].id_bdd).subscribe(data => {
                  console.log(data);
                  $('.tuile_' + data[0].loc_id + ', .tuile_ls_' + data[0].loc_id).find('.hexa').find('.hex1').find('.hex2').find('.bg-ent').css("background-image", "url('https://hautier.teamsmart.fr/images/jevents/jevlocations/" + data[0].image + "')");
                  $('.tuile_' + data[0].loc_id + ', .tuile_ls_' + data[0].loc_id).find('.hexa').find('.hex1').find('.hex2').find('.bg-ent').show();

                });
              }
            }
            // Affichage des Pastilles
            self.getPastilles();
            clearInterval(load);
          }
        },100);

      /*var cpt_load2 = 0;
      var load2 = setInterval(function(){
        if(self.id_ent != undefined && $('.imgHex') != undefined && $('.imgHex').length > 0) {
          self.homeSrv.getHomeImgByEnt(self.id_ent).subscribe(data => {
            for(let i = 0; i<data.length;i++){
              //$('.hexa_'+data[i].tuile_id+' .hexa .hex1 .hex2 .bg-ent').css("background", "url('https://hautier.teamsmart.fr/images/jevents/jevlocations/"+data[0].image+"')");
              $('.hexa_'+data[i].tuile_id+' .hexa .hex1 .hex2 .bg_ent').css("background", "#red");
              //$('.imgHex_'+data[i].tuile_id).css('display','block');
            }
          });
          clearInterval(load2);
        }
        if(cpt_load2 > 10){
          clearInterval(load2);
        }
        cpt_load2++;
      },100);*/
      this.checkVersion();
    };

    public pressed() {
        console.log('pressed');
    }

    public active() {
        if(this._diamonds.length > 3 + this._nbFixe){
          this.menu.swipeEnable(false);
          this.flag = true;
          $('#side-menu-right, .backHome').css('visibility', 'hidden');
          this.vibration.vibrate(100);
          $('#list-settings, #close-settings').show();
          $('#list-categ-home, ion-footer, .toolbar-content .hexaApp, #side-menu-right ').hide();
        }
    }

    public released() {
        //EMPTY
    }

    public removeDiamond(index) {
        this.removeTile = true;
        let alert = this.alertCtrl.create({
            title: 'Suppression d\'un élément',
            message: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
            buttons: [{
                text: 'Annuler',
                role: 'cancel'
            },{
                text: 'Supprimer',
                handler: () => {
                    $("#li" + this.nbTiles + "s").removeClass("shake-rotate");
                    this.nbTiles--;
                    this.Sqlite.create({
                        name: 'ionicdb.db',
                        location: 'default'
                    }).then((db: SQLiteObject) => {
                        db.executeSql('DELETE FROM home_diamond WHERE user_id = ? OR user_id = ?', [this.user,null]).then(res => {
                            //ok
                        });
                    });
                    if(this.grid[index].id_list_fav != null){
                        this.homeSrv.deleteTuileFav(this.id_user,this.grid[index].id_list_fav).subscribe(data => {
                        });
                    }

                    var grid_tmp = this.grid;
                    this.grid = [];
                    for(var i = 0; i < grid_tmp.length; i++){
                      if(i != index){
                        this.grid.push(grid_tmp[i]);
                        this.grid[this.grid.length-1].id = this.grid.length;
                      }
                    }
                    var id_line = 2;
                    var id_line1 = 0;
                    for (i = 0; i < this.grid.length; i++) {
                      if (id_line == i) {
                        this.grid[i].id_line = 'ko';
                        id_line = id_line + 3;
                      } else {
                        this.grid[i].id_line = 'ok';
                      }
                      if (id_line1 == i) {
                        this.grid[i].id_line = 'ok okl';
                        id_line1 = id_line1 + 3;
                      }
                    }
                    setInterval(function () {
                        $(".add_diamond").parent().removeClass('shake-rotate');
                    }, 1000);
                }
            }]
        });
        alert.present();
    }


    public backToHome() {
        this.flag = false;
        if(this.removeTile){
            $('#loader-meteo').css("display", 'block');
            $('#load-meteo').css("display", 'block');
            $('#loader-meteo').css("height", $('#loader-meteo').width() + 'px');
            let self = this;
            this.Sqlite.create({
                name: 'ionicdb.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                db.executeSql('DELETE FROM home_diamond WHERE user_id = ? OR user_id = ?', [this.user, null]).then((res) => {
                    //$rootScope.nbGrid = this.grid.length;
                    for (var i = 0; i < this.grid.length; i++) {
                        if (this.grid[i].title != '' || (this.grid[i].clic != "" && this.grid[i].clic != "addPage")) {
                            this.sqlitesrv.saveDiamond1(i, this.grid.length,this.grid[i].id_tuile, this.grid[i].id_list_fav, this.grid[i].icon, this.grid[i].title, this.grid[i].idBox, this.grid[i].id_line, this.grid[i].id_bdd, this.grid[i].clic, this.grid[i].diamond, this.grid[i].drag, this.grid[i].drop, this.grid[i].dragsuccess, this.grid[i].dropsuccess, this.ent_select, this.user);
                        } else {
                            if (i == this.grid.length - 1) {
                                this.sqlitesrv.saveDiamond1(i, this.grid.length,this.grid.id_tuile, this.grid[i].id_list_fav, this.grid[i].icon, this.grid[i].title, this.grid[i].idBox, this.grid[i].id_line, this.grid[i].id_bdd, this.grid[i].clic, this.grid[i].diamond, this.grid[i].drag, this.grid[i].drop, this.grid[i].dragsuccess, this.grid[i].dropsuccess, this.ent_select, this.user);
                            }
                        }
                    }
                    var myVar = setInterval(function () {
                        clearInterval(myVar);
                        $('#side-menu-right, .backHome').css('visibility', 'visible');
                        $('.toolbar-content .hexaApp, #side-menu-right ').show();
                        $('ion-footer').show();
                        self.navCtrl.setRoot('home-home', {});
                    }, 1000);
                });
            });
        }else{
            $('#side-menu-right, .backHome').css('visibility', 'visible');
            $('.toolbar-content .hexaApp, #side-menu-right ').show();
            $('ion-footer').show();
            this.navCtrl.setRoot('home-home', {});
        }
    }


    private displayMeteo(id) {
        if (!this.flag) {
            $('#load-meteo').css('display', 'block');
            $('#loader-meteo').css('display', 'block');
            $('#loader-meteo').css('height', $('#loader-meteo').width() + 'px');
            $('#main-content').css('marginBottom', '0');
            // Récupération des données de météo
            this.Sqlite.create({
                name: 'ionicdb.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                db.executeSql('SELECT * FROM meteo WHERE id_ville = ?', [id])
                .then(res => {
                    if (res.rows.length != 0) {
                        var today = new Date();
                        var jour = "" + today.getDate();
                        var mois = (today.getMonth() + 1) + "";
                        var annee = today.getFullYear();
                        var heure = today.getHours();
                        var minute = today.getMinutes();
                        if (parseInt(mois) < 10) {
                            mois = '0' + mois;
                        }
                        if (parseInt(jour) < 10) {
                            jour = '0' + jour;
                        }
                        var currentDate = new Date(annee, parseInt(mois, 10) - 1, parseInt(jour), heure, minute);
                        var inside = false;
                        for (var i = 0; i < res.rows.length - 1; i++) {
                            if (currentDate.getTime() / 1000 >= res.rows.item(i).time && currentDate.getTime() / 1000 < res.rows.item(i + 1).time) {
                                inside = true;
                                if (i < 24) {
                                    this.displayMeteoDiamond(id);
                                } else {
                                    this.sqlitesrv.deleteMeteo(id);
                                    this.meteoSrv.getMeteo(id).subscribe(data => {
                                        this.meteo = data;
                                        for (var i = 0; i < this.meteo.length; i++) {
                                            this.sqlitesrv.saveMeteo(this.meteo[i].id_ville, this.meteo[i].icon, this.meteo[i].summary, this.meteo[i].precipProbability, this.meteo[i].temperature, this.meteo[i].apparentTemperature, this.meteo[i].humidity, this.meteo[i].windSpeed, this.meteo[i].time);
                                        }
                                        this.displayMeteoDiamond(id);
                                    });
                                }
                                i = res.rows.length
                            }
                        }
                        if (inside == false) {
                            this.sqlitesrv.deleteMeteo(id);
                            this.meteoSrv.getMeteo(id).subscribe(data => {
                                this.meteo = data;
                                for (var i = 0; i < this.meteo.length; i++) {
                                    this.sqlitesrv.saveMeteo(this.meteo[i].id_ville, this.meteo[i].icon, this.meteo[i].summary, this.meteo[i].precipProbability, this.meteo[i].temperature, this.meteo[i].apparentTemperature, this.meteo[i].humidity, this.meteo[i].windSpeed, this.meteo[i].time);
                                }
                                this.displayMeteoDiamond(id);
                            });
                        }
                    } else {
                        this.meteoSrv.getMeteo(id).subscribe(data => {
                            this.meteo = data;
                            for (var i = 0; i < this.meteo.length; i++) {
                                this.sqlitesrv.saveMeteo(this.meteo[i].id_ville, this.meteo[i].icon, this.meteo[i].summary, this.meteo[i].precipProbability, this.meteo[i].temperature, this.meteo[i].apparentTemperature, this.meteo[i].humidity, this.meteo[i].windSpeed, this.meteo[i].time);
                            }
                            this.displayMeteoDiamond(id);
                        });
                    }
                });
            });
        }
    };

    private displayMeteoDiamond(id) {
        var today = new Date();
        var jour = today.getDate() + "";
        var mois = (today.getMonth() + 1) + "";
        var annee = today.getFullYear();
        var heure = today.getHours();
        var minute = today.getMinutes();
        if (parseInt(mois) < 10) {
            mois = '0' + mois;
        }
        if (parseInt(jour) < 10) {
            jour = '0' + jour;
        }
        var currentDate = new Date(annee, parseInt(mois, 10) - 1, parseInt(jour), heure, minute);
        this.Sqlite.create({name: 'ionicdb.db', location: 'default'}).then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM meteo WHERE id_ville = ?', [id])        .then(res => {
                for (var i = 0; i < res.rows.length; i++) {
                    if (currentDate.getTime() / 1000 >= res.rows.item(i).time && currentDate.getTime() / 1000 < res.rows.item(i + 1).time) {
                    // Décomposition de la date pour afficher
                    // "*Nom du jour num du jour nom du mois année*"
                    // exemple: vendredi 14 avril 2017
                    var monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
                    var mois = monthNames[today.getMonth()];
                    var days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                    var jour = days[today.getDay()];
                    var today1 = jour + " " + today.getDate() + " " + mois;
                    var temperature = Math.round((res.rows.item(i).temperature - 32) * 5 / 9);
                    var windSpeed = Math.round(res.rows.item(i).windSpeed * 1.609344);
                    var windSpeedN = Math.round(windSpeed*0.54);
                    var humidity = Math.round(res.rows.item(i).humidity * 100);
                    var dark_sky_icon = ["clear-day", "clear-night", "rain", "snow", "wind", "fog", "cloudy", "partly-cloudy-day", "partly-cloudy-night", "thunderstorm"];
                    var translate_summary = ["Ensoleillé", "Nuit Claire", "Pluie", "Neige", "Vent", "Brouillard", "Nuageux", "Soleil et Nuages", "Nuit Nuageuse", "Orages"];
                    var cpt = 0;
                    var summary = " - - ";
                    for (var ii = 0; ii < dark_sky_icon.length; ii++) {
                        if (dark_sky_icon[ii] == res.rows.item(i).icon) {
                            summary = translate_summary[ii];
                            cpt = ii;
                            ii = dark_sky_icon.length;
                        }
                    }
                    var content = "<h3>"+today1+"</h3>";
                    content += "<div id='weather-icon' class='"+dark_sky_icon[cpt]+"''>";
                    content += "</div>";
                    content += "<h3 id='weather-temp'>"+temperature+"°C</h3>";
                    content += "<h3>"+summary+"</h3>";
                    content += "<div>";
                    content += "<div class='wind-icon'><div id='wind-icon'></div></div>";
                    content += "<div id='wind-speed'>"+windSpeed+" km/h - "+windSpeedN+" noeuds</div>";
                    content += "<div class='humidity-icon'><div id='humidity-icon'></div></div>";
                    content += "<div id='humidity-percent'>"+humidity+"%</div>";
                    content += "</div>";
                    i = res.rows.length;
                    // Le contenu de la variable content ainsi que la croix de femreture
                    // se mettent dans le losange
                    $("#losange-detail-box").html(content + "" + this.cross);
                    var el = $("#losange-detail");
                    var el_bg = $("#opac-bg");
                        // Taille du losange
                        var size = el.width();
                        el.css('height', size + 'px');
                        el.fadeIn('slow');
                        el_bg.fadeIn('slow');
                    //this.fadeIn(el, el_bg);
                }
            }
            $('#load-meteo').css('display', 'none');
            $('#loader-meteo').css('display', 'none');
        }, null);
        });
    };

    // Génère la grille avec seulement des tuiles vides
    generateFullGrid(tiles_before) {
        var nb_tiles = 17;
        var ko = 0;
        var ko_if = ko;
        var line = '';
        for (var i = 0; i < nb_tiles; i++) {
            if (ko == 2 || ko == ko_if + 4) {
                line = "ko";
                ko_if = ko;
                ko++;
            } else {
                line = "ok";
                ko++;
            }
            var diamond = 'test ';
            var clic = '';
            var title = "";
            if (i == tiles_before) {
                clic = "addPage";
                diamond = "add_diamond";
            } else {
                clic = "";
                diamond = "empty_diamond";
            }
            this.grid.push({
                id: "" + i,
                idBox: "box" + i,
                id_tuile: null,
                id_list_fav: null,
                title: title,
                drag: "",
                drop: "",
                id_line: "" + line,
                clic: "" + clic,
                diamond: "" + diamond,
                dropsuccess: "",
                dragsuccess: ""
            });
        }
        //if(screen.width < 340){
            var id_line = 2;
            var id_line1 = 0;
            for (var i = 0; i < this.grid.length; i++) {
                if (id_line == i) {
                    this.grid[i].id_line = 'ko';
                    id_line = id_line + 3;
                } else {
                    this.grid[i].id_line = 'ok';
                }
                if (id_line1 == i) {
                    this.grid[i].id_line = 'ok okl';
                    id_line1 = id_line1 + 3;
                }
            }
        //}

        $('#load, #loader').hide();
      this.checkVersion();
    };

    public goToCarteFSC(){

    }

    // Fonction qui emmene aux chois du module à ajouter
    tempAdd(param) {
        if (!this.flag) {
            param = param.split(',');
            if (param[0] == "addPage") {
                this.navCtrl.setRoot('CategoriesPage');
            } else if (param[0] == 'place') {
                this.navCtrl.setRoot('place-detail', {
                    param: param[1]
                });
            } else if (param[0] == 'annuaireForm') {
                this.navCtrl.setRoot('place-formulaire', {
                    param: param[1]
                });
            } else if (param[0] == 'team') {
                this.navCtrl.setRoot('TeamPage', {
                  param: param[1]
                });
            } else if (param[0] == 'annuairePartenaires') {
                this.navCtrl.setRoot('PartenairePage', {
                    param: param[1]
                });
            } else if (param[0] == 'openCalendar') {
                this.navCtrl.setRoot('EventsListPage', {
                    param: param[1]
                });
            } else if (param[0] == 'newshautier') {
                this.storage.get('fsc').then((val) => {
                    this.fsc = val;
                    if(this.fsc){
                        this.navCtrl.setRoot('news-list', {
                            param: param[1],
                            id_ent: this.id_ent_FSC,
                            id_ent_post: this.id_ent,
                            typeActu: "groupe"
                        });
                    }else{
                        this.navCtrl.setRoot('news-list', {
                            param: param[1],
                            id_ent: this.id_ent,
                            id_ent_post: this.id_ent,
                            typeActu: "groupe"
                        });
                    }
                });
            } else if (param[0] == 'newsfiliale') {
                this.storage.get('fsc').then((val) => {
                    this.fsc = val;
                    if(this.fsc){
                        this.navCtrl.setRoot('news-list', {
                            param: param[1],
                            id_ent: this.id_ent_FSC,
                            id_ent_post: this.id_ent,
                            typeActu: "filiale"
                        });
                    }else{
                        this.navCtrl.setRoot('news-list', {
                            param: param[1],
                            id_ent: this.id_ent,
                            id_ent_post: this.id_ent,
                            typeActu: "filiale"
                        });
                    }
                });
            } else if (param[0] == 'annuaireEnt') {
                this.navCtrl.setRoot('ListEntreprisesPage', {
                    param: param[1]
                });
            }else if(param[0] == 'compte-rh'){
                this.navCtrl.setRoot('CompteRhPage',{
                    user: this.user,
                    ent: this.ent_select,
                });
            } else if (param[0] == 'boiteaoutils') {
                this.navCtrl.setRoot('BoiteaoutilsPage',{});
            } else if (param[0] == 'meteo') {
                this.getMeteo();
            } else if (param[0] == 'messagerie') {
                this.navCtrl.setRoot('DemandesContactPage', {});
            } else if (param[0] == 'suggestions') {
                this.navCtrl.setRoot('SuggestionsContactPage', {
                    param: 0
                });
            } else if (param[0] == 'concours') {
                this.navCtrl.setRoot('SuggestionsContactPage', {
                    param: 1
                });
            } else if (param[0] == 'sondages') {
                this.navCtrl.setRoot('SondageContactPage', {});
            } else if (param[0] == 'ce') {
                if (this.platform.is('android')) {
                    this.market.open("com.prowebce027232CEHRO.android");
                } else {
                    this.market.open("1407270752");
                }
            }else if (param[0] == 'favoris') {
                this.navCtrl.push('AnnuaireFavorisPage');
            }else if(param[0] == 'rendezvous') {
                this.navCtrl.setRoot('RendezVousEventPage', {
                    id_cli: this.ent_select
                });
            }else if(param[0] == 'annuaire'){
                this.navCtrl.setRoot('AnnuairePage');
            }else if(param[0] == 'list_fav'){
                this.navCtrl.setRoot('AnnuaireFavCentresInteretPage',{
                    id_fav_tuile: param[1],
                    title: param[2]
                });
            }else if(param[0] == 'signalements'){
              this.navCtrl.setRoot('SignalementsContactPage');
            }else if(param[0] == 'groupes'){
                this.navCtrl.setRoot('AnnuaireGroupesPage');
            }else if(param[0] == 'carte-fsc'){
              this.navCtrl.setRoot('CartePage');
            }else if(param[0] == 'formulaires'){
              this.navCtrl.setRoot('form-list',{});
            }else if(param[0] == 'flash'){
              this.navCtrl.setRoot('FlashlistPage',{
                user: this.user
              });
            }else if(param[0] == 'formTile'){
              this.navCtrl.setRoot('form-detail', {
                id_form: param[1],
                cli : this.ent_select,
                user : this.user,
                origin: 'home'
              });
            }else if(param[0] == 'detail_ent'){
              this.storage.get('fsc').then((val) => {
                  this.fsc = val;
                  if(this.fsc){
                      this.navCtrl.setRoot('news-list', {
                          param: param[1],
                          id_ent: this.id_ent_FSC,
                          id_ent_post: this.id_ent,
                          typeActu: "groupe"
                      });
                  }else{
                      this.navCtrl.setRoot('news-list', {
                          param: param[1],
                          id_ent: this.id_ent,
                          id_ent_post: this.id_ent,
                          typeActu: "groupe"
                      });
                  }
              });
            }else if(param[0] == 'detail_partenaire'){
                this.navCtrl.setRoot('PartenairedetailPage', {
                    param: param[1],
                    origin: 'home',
                    title: param[2],
                    image: param[3]
                });
            }else if(param[0] != ''){
              let alert = this.alertCtrl.create({
                title: 'Mise à jour',
                message: "Vous devez installer la dernière mise à jour de l'application afin de pouvoir bénéficier de cette fonctionnalité.",
                buttons: ['Fermer']
              });
              alert.present();
            }
        }
    }

    // Affiche la bulle de notification sur la tuile messages
    private getMsgNotifs(user){
      this.contactSrv.getMsgNotifs(user).subscribe(data => {
        if(data.length != 0){
          $('#hexagon_messagerie').find('.hex2').append('<div class="msg-notif">'+data.length+'</div>');
        }
      });
    }

    private getNewsNotif(user){
      this.newsSrv.getNotReadNews(user).subscribe(data => {
        var filiale = 0;
        var groupe  = 0;
        data.forEach(item => {
          if(item.type == 0){
            groupe++;
          }else if(item.type == 1){
            filiale++;
          }
        });
        if(groupe != 0){
          $('#hexagon_newshautier').find('.hex2').append('<div class="msg-notif">'+groupe+'</div>');
        }
        if(filiale != 0){
          $('#hexagon_newsfiliale').find('.hex2').append('<div class="msg-notif">'+filiale+'</div>');
        }
      });
    }

    entPartenaire(){
        this.annuaireSrv.getPartenairesEntFixe(this.ent_select).subscribe(data => {
            this.partenaire = data;
            this._nbFixe = this.partenaire.length;
            var inspect = false;
            for (let j = 0; j < this.partenaire.length; j++) {
                let exist = false;
                for (let i = 0; i < this.diamonds.length; i++) {
                    if(Number(this.diamonds[i]['id_bdd']) == this.partenaire[j]['loc_id']){
                        exist = true
                    }
                }
                if(!exist){
                    this.addPartenaire(this.partenaire[j]['loc_id'],this.partenaire[j]['title'],this.partenaire[j]['image']);
                    inspect = true
                }
            }
            if(inspect){
                this.navCtrl.setRoot('home-home');
            }

        });
    }

    /*private setDiamond(){
        this.Sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM home_diamond WHERE user_id = ? AND ent_diamond = ?', [this.id_user, this.ent_select])
                .then(res => {
                    this.diamonds = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        this.diamonds.push({
                            id : res.rows.item(i).id
                        })

                    }
                    console.log(this.diamonds);
                });
        });
    }*/

    private addPartenaire(loc_id,title_partenaire,image_partenaire){
            var len = this.diamonds.length;
            var title = '';
            var icon = '';
            var idBox = "box" + len;
            var ko = 0;
            var ko_if = ko;
            var addition = 2;
            var line;
            if (len == 0) {
                line = "ok";
            } else {
                for (let i = 0; i <= len; i++) {
                    if (ko == 2 || ko == ko_if + addition) {
                        line = "ko";
                        ko_if = ko;
                        ko++;
                        addition = 4;
                    } else {
                        line = "ok";
                        ko++;
                    }
                }
            }
            var color = 'hexa-gris';
            var id_line = line;
            var id_bdd = loc_id;
            var on_click = 'detail_partenaire,'+loc_id+','+title_partenaire+','+image_partenaire;
            var on_drag = "true";
            var on_drop = "true";
            var on_drag_success = "onDragComplete($data,$event)";
            var len1 = len + 1;
            var on_drop_success = "onDropCompleteRemove($data,$event," + len1 + ")";
            var link = "";
            this.sqlitesrv.saveDiamond(0,0,link, icon, title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success,this.ent_select,this.user);
        }

    // Fermer l’alerte modale
    public closeAlert() {
        $('#alert-meteo, #alert-meteo-info, #alert-meteo-close').css('display','none');
        $('ion-footer').show();
        console.log(this.danger);
        this.sqlitesrv.saveAlert(this.danger.id);
    };

// Récupérer les alertes
    private getDanger(id_user){

        this.meteoSrv.getDanger(id_user).subscribe( data => {
            this.danger = data;
            for (let i = 0; i < this.danger.length; i++) {
                this.danger[i]['message'] = this.danger[i]['message'].replace(new RegExp('\n','g'), '<br/>');
            }
            var c = 0;
            this.date = "";
            this.Sqlite.create({
                name: 'ionicdb.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                db.executeSql('SELECT * FROM alertes', [])
                    .then(res => {
                        if(res.rows.length == 0){
                            this.danger = this.danger[0];
                        }else{
                            for(var i = 0; i < this.danger.length; i++){
                                var az = false;
                                for(var u = 0; u < res.rows.length; u++){
                                    if(this.danger[i].id == res.rows.item(u).id_alert){
                                        az = true;
                                    }
                                }
                                if(az){
                                    c++;
                                }
                            }
                            console.log(this.danger[c]);
                            this.danger = this.danger[c];
                        }
                        if(this.danger != undefined){
                            if(this.danger.length != 0) {
                                this.titre = this.danger.titre;
                                this.message = this.danger.message;
                                this.type = this.danger.type;
                                this.mime_content_type = this.danger.mime_content_type;
                                this.piece_jointe = this.danger.piece_jointe;
                                var matches = this.piece_jointe.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/);
                                if (matches) {
                                    this.video = 0; // Video Youtube
                                    this.piece_jointe = this.sanitizer.bypassSecurityTrustResourceUrl(this.danger.piece_jointe);
                                } else {
                                    this.video = 1; // Video Non Youtube
                                    this.piece_jointe = this.sanitizer.bypassSecurityTrustResourceUrl(this.danger.piece_jointe);
                                }
                                if(this.type == 2){
                                    this.image_danger = this.sanitizer.bypassSecurityTrustResourceUrl("https://hautier.teamsmart.fr/images/flashinfos/" + this.danger.piece_jointe);
                                }

                                $('#alert-meteo, #alert-meteo-info, #alert-meteo-close').show();
                                $('ion-footer').hide();
                            }
                        }
                    }, null);
            });
        });
    }

    public readVideo(){

        var matches = this.danger.piece_jointe.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/);
        if (matches) {
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = this.danger.piece_jointe.match(regExp);
            if (match && match[2].length == 11) {
                let yt_id = match[2];
                console.log('ID YT');
                console.log(yt_id);
                this.youtube.openVideo(yt_id);
            } else {
                console.log('error')
            }
        } else {
            let options: StreamingVideoOptions = {
                successCallback: () => { console.log('Video played') },
                errorCallback: (e) => { console.log('Error streaming') },
                controls: true
            };

            this.streamingMedia.playVideo(this.danger.piece_jointe, options);
        }




        /*
        this.videoPlayer.play(this.danger.piece_jointe).then(() => {
            console.log('video completed');
        }).catch(err => {
            console.log(err);
        });*/
    }

    public getMeteo(){
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };

        $('#load-meteo').css('display', 'block');
        $('#loader-meteo').css('display', 'block');
        $('#loader-meteo').css('height', $('#loader-meteo').width() + 'px');
        $('#main-content').css('marginBottom', '0');
        this.geolocation.getCurrentPosition().then((resp) => {
            this.nativeGeocoder.reverseGeocode(resp.coords.latitude,resp.coords.longitude, options)
                .then((result: NativeGeocoderReverseResult[]) => this.ville = result[0]['locality'])
                .catch((error: any) => console.log(error));
            this.meteoSrv.getDonneeMeteo(resp.coords.latitude,resp.coords.longitude).subscribe(data => {
                var today = new Date();
                var jour = today.getDate() + "";
                var mois = (today.getMonth() + 1) + "";
                var annee = today.getFullYear();
                var heure = today.getHours();
                var minute = today.getMinutes();
                if (parseInt(mois) < 10) {
                    mois = '0' + mois;
                }
                if (parseInt(jour) < 10) {
                    jour = '0' + jour;
                }
                var monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
                mois = monthNames[today.getMonth()];
                var days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                jour = days[today.getDay()];
                var today1 = jour + " " + today.getDate() + " " + mois;
                var temperature = data.current_condition.tmp;
                var windSpeed = data.current_condition.wnd_spd;
                var humidity = data.current_condition.humidity;
                var summary = data.current_condition.condition;
                var content = "<h3>"+this.ville+"</h3>";
                content += "<h3>"+today1+"</h3>";
                content += "<img id='weather-icon' src='"+data.current_condition.icon+"' alt='icon_meteo'/>";
                content += "</div>";
                content += "<h3 id='weather-temp'>"+temperature+"°C</h3>";
                content += "<h3>"+summary+"</h3>";
                content += "<div>";
                content += "<div class='wind-icon'><div id='wind-icon'></div></div>";
                content += "<div id='wind-speed'>"+windSpeed+" km/h";
                content += "<div class='humidity-icon'><div id='humidity-icon'></div></div>";
                content += "<div id='humidity-percent'>"+humidity+"%</div>";
                content += "</div>";
                // Le contenu de la variable content ainsi que la croix de femreture
                // se mettent dans le losange
                $("#losange-detail-box").html(content + "" + this.cross);
                var el = $("#losange-detail");
                var el_bg = $("#opac-bg");
                // Taille du losange
                var size = el.width();
                el.css('height', size + 'px');
                el.fadeIn('slow');
                el_bg.fadeIn('slow');
                //this.fadeIn(el, el_bg);
                var currentDate = new Date(annee, parseInt(mois, 10) - 1, parseInt(jour), heure, minute);
                $('#load-meteo').css('display', 'none');
                $('#loader-meteo').css('display', 'none');
            })
        }).catch((error) => {
            let alert = this.alertCtrl.create({
                title: 'Attention !',
                message: "Problème de géolocalisation. Vérifiez qu'elle est bien activée.",
                buttons: ['Fermer']
            });
            alert.present();
            $('#load-meteo').css('display', 'none');
            $('#loader-meteo').css('display', 'none');
        });

    }

    private openFile(){

        let path = "https://hautier.teamsmart.fr/images/flashinfos/" + this.danger.piece_jointe;
        const fileTransfer: FileTransferObject = this.transfer.create();

        var loader = this.loadingCtrl.create({content: "Téléchargement en cours ..."});
        loader.present();
        let target = "";

        if(this.platform.is('android')){
            target = 'file:///storage/emulated/0/Download/' + this.danger.piece_jointe;
        } else {
            target = (<any>window).cordova.file.documentsDirectory + this.danger.piece_jointe;
        }

        fileTransfer.download(path, target)
            .then((data) => {
                loader.dismiss();
                this.presentToast("Le fichier a bien été enregistrée.");
                this.fileOpener.open(target,this.danger.mime_content_type)
                    .then(() => console.log('File is opened'))
                    .catch(e => console.log('Error opening file', e));
            }, (err) => {
                loader.dismiss();
                console.log(err);
                //this.presentToast("La photo n'a pas pu être enregistré");
                this.presentToast("L'enregistrement du fichier a rencontré un problème...");
            });
    }

    private showDidactitiel(){
        this.navCtrl.setRoot('DidactitielPage',{});
    }

    private getPastillesSondage(){
      this.homeSrv.getPastillesSondage(this.user).subscribe(data => {
        if(data.length != 0) {
          $('.hexa_10').find('.hexa').find('.hex2').prepend("<div class='pastilles'>" + data.length + "</div>");
        }
      });
    }

    private getPastillesSuggestions(){
      this.homeSrv.getPastillesSuggestions(this.user).subscribe(data => {
        if(data.length != 0){
          $('.hexa_8').find('.hexa').find('.hex2').prepend("<div class='pastilles'>"+data.length+"</div>");
        }
      });
    }

    private getPastilles(){
      // Pastille des sondages
      this.getPastillesSondage();
      // Pastille des suggestions
      this.getPastillesSuggestions();
    }

}
