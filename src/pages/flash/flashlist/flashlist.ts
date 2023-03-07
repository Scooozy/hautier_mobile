import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {MeteoServiceProvider} from "../../../providers/meteo-service/meteo-service";
import {DomSanitizer} from "@angular/platform-browser";
import * as $ from 'jquery';
import {HomeServiceProvider} from "../../../providers/home-service/home-service";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {FileOpener} from "@ionic-native/file-opener";
import {StreamingMedia, StreamingVideoOptions} from "@ionic-native/streaming-media";
import {YoutubeVideoPlayer} from "@ionic-native/youtube-video-player";
import {AndroidPermissions} from "@ionic-native/android-permissions";

@IonicPage()
@Component({
  selector: 'page-flashlist',
  templateUrl: 'flashlist.html',
})
export class FlashlistPage {
  flashs: any = [];
  flashs_length: number = 0;
  showFlash: boolean = false;
  titre: string = "";
  message: string = "";
  type: any;
  mime_content_type: string = "";
  piece_jointe: any;
  video: number;
  image_danger: any;
  danger: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private meteoSrv: MeteoServiceProvider,
              private sanitizer : DomSanitizer, private homeSrv: HomeServiceProvider, private toastCtrl: ToastController,
              private transfer: FileTransfer, private loadingCtrl: LoadingController, private platform: Platform,
              private fileOpener: FileOpener, private youtube: YoutubeVideoPlayer, private streamingMedia: StreamingMedia,
              private androidPermissions: AndroidPermissions) {
    this.getDanger(this.navParams.get('user'));
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

  private getDanger(id_user){
    this.homeSrv.getHasRight(id_user, 64).subscribe(data => {
      if(!data){
        let toast = this.toastCtrl.create({
          message: "Vous n'avez pas les droits d'accès à cette fonctionnalité.",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        this.navCtrl.setRoot('home-home',{});
      }
    });
    this.meteoSrv.getDangers(id_user).subscribe( data => {
      this.flashs = data;
      this.flashs_length = this.flashs.length;
    });

  };

  public displayFlash(i){
    this.danger = this.flashs[i];
    this.titre = this.flashs[i].titre;
    this.message = this.flashs[i].message;
    this.type = this.flashs[i].type;
    this.mime_content_type = this.flashs[i].mime_content_type;
    this.piece_jointe = this.flashs[i].piece_jointe;
    var matches = this.piece_jointe.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/);
    if (matches) {
      this.video = 0; // Video Youtube
      this.piece_jointe = this.sanitizer.bypassSecurityTrustResourceUrl(this.flashs[i].piece_jointe);
    } else {
      this.video = 1; // Video Non Youtube
      this.piece_jointe = this.sanitizer.bypassSecurityTrustResourceUrl(this.flashs[i].piece_jointe);
    }
    if(this.type == 2){
      this.image_danger = this.sanitizer.bypassSecurityTrustResourceUrl("https://hautier.teamsmart.fr/images/flashinfos/" + this.flashs[i].piece_jointe);
    }

    this.showFlash = true;
    $('ion-footer').hide();

  }

  // Fermer l’alerte modale
  public closeAlert() {
    this.showFlash = false;
    $('ion-footer').show();
  };

  public goBack() {
    this.navCtrl.setRoot('home-home',{});
  }

  public openFile(){

    let path = "https://hautier.teamsmart.fr/images/flashinfos/" + this.danger.piece_jointe;
    const fileTransfer: FileTransferObject = this.transfer.create();

    var loader = this.loadingCtrl.create({content: "Téléchargement en cours ..."});
    loader.present();
    let target = "";

    if(this.platform.is('android')){
      target = 'file:///storage/emulated/0/Download/' + this.danger.piece_jointe;
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          console.log('Has permission?', result.hasPermission);
          if(result.hasPermission){
            fileTransfer.download(path, target).then((data) => {
              loader.dismiss();
              this.presentToast("Le fichier a bien été enregistrée.");
              (<any>window).cordova.plugins.fileOpener2.open(target, this.danger.mime_content_type, {
                error : function(e){
                  console.log('Error file opener',e);
                }, success : function(){
                  console.log('File Open');
                }
              });
            }, (err) => {
              loader.dismiss();
              console.log('ERROR DOWNLOAD FILE');
              console.log(err);
              //this.presentToast("La photo n'a pas pu être enregistré");
              this.presentToast("L'enregistrement du fichier a rencontré un problème...");
            });
          }else{
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(res => {
              this.openFile();
            });
          }
        }, err => {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(res => {
            this.openFile();
          });
        }
      );
    } else {
      target = (<any>window).cordova.file.documentsDirectory + this.danger.piece_jointe;
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
