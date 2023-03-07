import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {SqliteServiceProvider} from "../../providers/sqlite-service/sqlite-service";
import * as $ from 'jquery';
import {AnnuaireServiceProvider} from "../../providers/annuaire-service/annuaire-service";
import {File} from "@ionic-native/file";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import {ContactServiceProvider} from "../../providers/contact-service/contact-service";
import {ContentserviceProvider} from "../../providers/contentservice/contentservice";
import {HomeServiceProvider} from "../../providers/home-service/home-service";


@IonicPage()
@Component({
  selector: 'page-boiteaoutils',
  templateUrl: 'boiteaoutils.html',
})
export class BoiteaoutilsPage {
  id_user: any;
  ent_selected: any;
  files: any;
  file_length: number = 0;
  toolboxcat: any = [];
  select_cat: number = 0;

  constructor(public transfer : FileTransfer, public navCtrl: NavController, public navParams: NavParams, public sqlite: SqliteServiceProvider,
              public Sqlite: SQLite, public annuaire: AnnuaireServiceProvider, private file: File,
              public loadingCtrl:LoadingController, public toastCtrl:ToastController, private fileOpener: FileOpener,
              private platform: Platform, private contentSrv: ContentserviceProvider, private homeSrv: HomeServiceProvider) {

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
        $('page-annuaire ion-content').css('top','0px');
    }

    //Retour sur la home
    public goBack() {
        this.navCtrl.setRoot('home-home');
    }

    //Get le user connecté
    public getUser(){
        this.Sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM connectContact', {}).then(res => {
              this.id_user = res.rows.item(0).id_user;
              this.homeSrv.getHasRight(this.id_user, 58).subscribe(data => {
                if(!data){
                  this.presentToast("Vous n'avez pas les droits d'accès à cette fonctionnalité.");
                  this.navCtrl.setRoot('home-home',{});
                }
              });
              this.Sqlite.create({
                name: 'ionicdb.db',
                location: 'default'
              }).then((db: SQLiteObject) => {
                db.executeSql('SELECT * FROM ent_selected', {}).then(result => {
                  if (result.rows.length != 0) {
                    this.ent_selected = result.rows.item(0).id_ent;
                    this.getToolBoxCat();
                    this.getFiles();
                    }
                });
              });
              $('#load, #loader').hide();
            });
        });
    }

    private getToolBoxCat(){
      this.contentSrv.getToolBoxCat().subscribe(data => {
        this.toolboxcat = data;
      });
    }

    public getFiles(){
        $('page-annuaire ion-content').css('top','170px');
        this.annuaire.getFile().subscribe(data => {
            this.files = data;
            this.file_length = this.files.length;
        });
    }

    public displayFile(){
      this.select_cat = $('.select_cat').val();
    }

    DownloadFile(name_file){
      let url = "https://hautier.teamsmart.fr/images/boiteaoutils/" + name_file;
      var file = this.file;
      var loader = this.loadingCtrl.create({content: "Téléchargement en cours ..."});
      loader.present();
      let target;
      const fileTransfer: FileTransferObject = this.transfer.create();

      if(this.platform.is('android')){
        target = 'file:///storage/emulated/0/Download/' + name_file;
      } else {
        target = (<any>window).cordova.file.documentsDirectory + name_file;
      }

      fileTransfer.download(url, target).then((data) => {
        loader.dismiss();
        this.presentToast("Le fichier a bien été enregistrée.");
        this.fileOpener.open(target,'application/pdf').then(() => {
          console.log('File is opened')
        }).catch(e => {
          console.log('Error opening file', e)
        })
      }, (err) => {
        console.log('err');
        loader.dismiss();
        this.presentToast("L'enregistrement du fichier a rencontré un problème...");
      });
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

    public closeImg(){
        $('.img-bg-post').hide();
    }



}
